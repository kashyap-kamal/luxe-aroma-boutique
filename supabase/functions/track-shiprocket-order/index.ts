// Supabase Edge Function: Track Shiprocket Order
// Tracks shipments using Shiprocket AWB (Air Waybill) number
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

interface TrackOrderRequest {
  awb: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const baseUrl = Deno.env.get("SHIPROCKET_BASE_URL") || "https://apiv2.shiprocket.in/v1/external";

    // Parse request body
    const body: TrackOrderRequest = await req.json();
    const { awb } = body;

    // Validate required field
    if (!awb || !awb.trim()) {
      return new Response(
        JSON.stringify({ error: "AWB number is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Authenticate with Shiprocket
    const token = await getShiprocketToken();

    // Call Shiprocket tracking API
    const trackResponse = await fetch(
      `${baseUrl}/courier/track/awb/${awb.trim()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!trackResponse.ok) {
      const errorText = await trackResponse.text();
      console.error("Shiprocket tracking error:", errorText);
      throw new Error(`Shiprocket API error: ${trackResponse.status}`);
    }

    const data = await trackResponse.json();

    // Shiprocket returns tracking_data with activities array
    const trackingData = data.tracking_data;

    if (trackingData && trackingData.track_status === 1) {
      // Get the most recent tracking activity
      const activities = trackingData.shipment_track_activities || [];
      const latestActivity = activities[0]; // Most recent first

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            // Use 'waybill' key to stay compatible with the OrderTracker component
            waybill: awb,
            status: trackingData.shipment_status?.toString() || latestActivity?.["sr-status"] || "In Transit",
            location: latestActivity?.location || "In Transit",
            timestamp: latestActivity?.date || new Date().toISOString(),
            remarks: latestActivity?.activity || "",
            courierName: trackingData.courier_name || "",
            etd: trackingData.etd || "",
          },
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          error: trackingData?.error || "Order not found or tracking information unavailable",
        }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Shiprocket track order error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unable to track order. Please try again later.",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
