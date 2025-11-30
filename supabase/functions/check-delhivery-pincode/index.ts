// Supabase Edge Function: Check Delhivery Pincode Serviceability
// Securely checks if a pincode is serviceable by Delhivery
// API keys are stored in Supabase secrets

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

interface PincodeServiceabilityRequest {
  pincode: string;
  weight?: number;
  cod?: boolean;
}

interface PincodeServiceabilityResponse {
  pincode: string;
  serviceable: boolean;
  deliveryTime?: string;
  charges?: {
    cod: number;
    prepaid: number;
  };
  error?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Parse request body once at the start
  let body: PincodeServiceabilityRequest;
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid request body" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  try {
    // Get Delhivery API credentials from environment variables (Supabase secrets)
    const DELHIVERY_API_KEY = Deno.env.get("DELHIVERY_API_KEY");
    const DELHIVERY_BASE_URL = Deno.env.get("DELHIVERY_BASE_URL") || "https://staging-express.delhivery.com";

    if (!DELHIVERY_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Delhivery API key not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { pincode, weight = 0.5, cod = false } = body;

    // Validate pincode format (6 digits)
    if (!/^\d{6}$/.test(pincode)) {
      return new Response(
        JSON.stringify({
          pincode,
          serviceable: false,
          error: "Invalid pincode format. Please enter a 6-digit pincode.",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Call Delhivery API to check pincode serviceability
    const delhiveryUrl = `${DELHIVERY_BASE_URL}/c/api/pin-codes/json/?token=${DELHIVERY_API_KEY}&filter_codes=${pincode}`;
    
    const delhiveryResponse = await fetch(delhiveryUrl, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    });

    if (!delhiveryResponse.ok) {
      throw new Error(`Delhivery API error: ${delhiveryResponse.status}`);
    }

    const data = await delhiveryResponse.json();

    // Check if pincode is serviceable
    const isServiceable = data.delivery_codes && data.delivery_codes.length > 0;

    if (!isServiceable) {
      return new Response(
        JSON.stringify({
          pincode,
          serviceable: false,
          error: "Sorry, we do not deliver to this pincode.",
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get the first delivery code (most relevant)
    const deliveryCode = data.delivery_codes[0];
    const postalCode = deliveryCode.postal_code;

    // Check if COD is available
    const codAvailable = postalCode.cod === "Y";
    const prepaidAvailable = postalCode.pre_paid === "Y";

    // Determine if serviceable based on payment mode
    let serviceable = false;
    if (cod && codAvailable) {
      serviceable = true;
    } else if (!cod && prepaidAvailable) {
      serviceable = true;
    }

    // Check weight restrictions
    if (postalCode.max_weight > 0 && weight > postalCode.max_weight) {
      return new Response(
        JSON.stringify({
          pincode,
          serviceable: false,
          error: `Weight limit exceeded. Maximum allowed weight: ${postalCode.max_weight}kg`,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!serviceable) {
      let errorMessage = "Sorry, we do not deliver to this pincode.";
      if (cod && !codAvailable) {
        errorMessage = "COD not available for this pincode. Please try prepaid payment.";
      } else if (!cod && !prepaidAvailable) {
        errorMessage = "Prepaid delivery not available for this pincode. Please try COD.";
      }

      return new Response(
        JSON.stringify({
          pincode,
          serviceable: false,
          error: errorMessage,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Calculate delivery time and charges
    const deliveryTime = calculateDeliveryTime(postalCode);
    const charges = calculateCharges(weight, cod);

    const response: PincodeServiceabilityResponse = {
      pincode,
      serviceable: true,
      deliveryTime,
      charges,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Delhivery pincode check error:", error);
    
    return new Response(
      JSON.stringify({
        pincode: body?.pincode || "",
        serviceable: false,
        error: "Unable to verify pincode serviceability. Please try again.",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

// Helper function to calculate delivery time
function calculateDeliveryTime(postalCode: any): string {
  if (postalCode.is_oda === "Y") {
    return "5-7 business days (Remote area)";
  }

  if (postalCode.remarks) {
    const remarks = postalCode.remarks.toLowerCase();
    if (remarks.includes("embargo")) {
      return "Delivery suspended (Embargo area)";
    }
    if (remarks.includes("restricted")) {
      return "4-6 business days (Restricted area)";
    }
  }

  if (postalCode.covid_zone === "R") {
    return "3-5 business days (Red zone)";
  } else if (postalCode.covid_zone === "O") {
    return "2-4 business days (Orange zone)";
  }

  const sundayDelivery = postalCode.sun_tat;
  const stateCode = postalCode.state_code;
  const city = postalCode.city.toLowerCase();

  if (
    ["DL", "MH", "KA", "TN", "GJ"].includes(stateCode) ||
    city.includes("delhi") ||
    city.includes("mumbai") ||
    city.includes("bangalore") ||
    city.includes("chennai")
  ) {
    return sundayDelivery ? "1-2 business days" : "2-3 business days";
  }

  if (["RJ", "UP", "MP", "WB", "AP", "TS"].includes(stateCode)) {
    return sundayDelivery ? "2-3 business days" : "3-4 business days";
  }

  return sundayDelivery ? "3-4 business days" : "4-5 business days";
}

// Helper function to calculate shipping charges
function calculateCharges(weight: number, cod: boolean): { cod: number; prepaid: number } {
  let baseCharge = 0;

  if (weight <= 0.5) {
    baseCharge = 50;
  } else if (weight <= 1) {
    baseCharge = 80;
  } else if (weight <= 2) {
    baseCharge = 120;
  } else {
    baseCharge = 120 + (weight - 2) * 20;
  }

  return {
    cod: cod ? baseCharge + 20 : baseCharge,
    prepaid: baseCharge,
  };
}

