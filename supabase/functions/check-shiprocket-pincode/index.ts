// Supabase Edge Function: Check Shiprocket Pincode Serviceability
// Checks if a pincode is serviceable by Shiprocket courier partners
// Credentials are stored in Supabase secrets

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

// Shiprocket uses email/password auth to generate a bearer token
async function getShiprocketToken(): Promise<string> {
  const email = Deno.env.get("SHIPROCKET_EMAIL");
  const password = Deno.env.get("SHIPROCKET_PASSWORD");
  const baseUrl = Deno.env.get("SHIPROCKET_BASE_URL") || "https://apiv2.shiprocket.in/v1/external";

  if (!email || !password) {
    throw new Error("Shiprocket credentials not configured");
  }

  const response = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error(`Shiprocket auth failed: ${response.status}`);
  }

  const data = await response.json();
  return data.token;
}

interface PincodeRequest {
  pincode: string;
  weight?: number;
  cod?: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Parse request body
  let body: PincodeRequest;
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
    const baseUrl = Deno.env.get("SHIPROCKET_BASE_URL") || "https://apiv2.shiprocket.in/v1/external";
    const sellerPincode = Deno.env.get("SELLER_PINCODE") || "110001";

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

    // Authenticate with Shiprocket
    const token = await getShiprocketToken();

    // Check pincode serviceability via Shiprocket API
    const params = new URLSearchParams({
      pickup_postcode: sellerPincode,
      delivery_postcode: pincode,
      weight: String(weight),
      cod: cod ? "1" : "0",
    });

    const shiprocketResponse = await fetch(
      `${baseUrl}/courier/serviceability/?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!shiprocketResponse.ok) {
      const errorText = await shiprocketResponse.text();
      console.error("Shiprocket API error:", errorText);
      throw new Error(`Shiprocket API error: ${shiprocketResponse.status}`);
    }

    const data = await shiprocketResponse.json();

    // Shiprocket returns available_courier_companies array
    const couriers = data.data?.available_courier_companies || [];
    const isServiceable = couriers.length > 0;

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

    // Find the best courier (cheapest or fastest)
    const bestCourier = couriers.reduce((best: any, current: any) => {
      // Prefer cheapest option
      if (!best || current.rate < best.rate) return current;
      return best;
    }, null);

    // Build delivery time string from courier data
    const deliveryDays = bestCourier?.estimated_delivery_days || bestCourier?.etd;
    const deliveryTime = deliveryDays
      ? `${deliveryDays} business days`
      : "3-7 business days";

    // Calculate charges from courier rates
    const prepaidRate = Math.round(bestCourier?.rate || 0);
    const codCharges = Math.round(bestCourier?.cod_charges || 0);

    return new Response(
      JSON.stringify({
        pincode,
        serviceable: true,
        deliveryTime,
        charges: {
          prepaid: prepaidRate,
          cod: prepaidRate + codCharges,
        },
        courierName: bestCourier?.courier_name || "Standard Shipping",
        codAvailable: couriers.some((c: any) => c.cod === 1),
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Shiprocket pincode check error:", error);

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
