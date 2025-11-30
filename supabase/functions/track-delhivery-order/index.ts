// Supabase Edge Function: Track Delhivery Order
// Securely tracks orders using Delhivery waybill number
// API keys are stored in Supabase secrets

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

interface TrackOrderRequest {
  waybill: string;
}

interface TrackOrderResponse {
  success: boolean;
  data?: {
    waybill: string;
    status: string;
    location: string;
    timestamp: string;
    remarks?: string;
  };
  error?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
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

    // Parse request body
    const body: TrackOrderRequest = await req.json();
    const { waybill } = body;

    // Validate required fields
    if (!waybill) {
      return new Response(
        JSON.stringify({ error: "Waybill number is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Call Delhivery API to track order
    const delhiveryUrl = `${DELHIVERY_BASE_URL}/api/v1/packages/json/?token=${DELHIVERY_API_KEY}&waybill=${waybill}`;
    
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

    if (data.success && data.data && data.data.length > 0) {
      const orderData = data.data[0];
      const response: TrackOrderResponse = {
        success: true,
        data: {
          waybill: orderData.waybill,
          status: orderData.status,
          location: orderData.location || "In Transit",
          timestamp: orderData.timestamp || new Date().toISOString(),
          remarks: orderData.remarks,
        },
      };

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else {
      const response: TrackOrderResponse = {
        success: false,
        error: "Order not found or tracking information unavailable",
      };

      return new Response(JSON.stringify(response), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Delhivery track order error:", error);
    const response: TrackOrderResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Unable to track order. Please try again later.",
    };

    return new Response(JSON.stringify(response), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

