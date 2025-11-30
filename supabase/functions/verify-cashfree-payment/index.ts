// Supabase Edge Function: Verify Cashfree Payment
// This function verifies payment status with Cashfree
// API keys are stored securely in Supabase secrets

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS headers for allowing requests from your frontend
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Main handler function
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get Cashfree credentials from Supabase secrets
    const CASHFREE_CLIENT_ID = Deno.env.get("CASHFREE_CLIENT_ID");
    const CASHFREE_SECRET_KEY = Deno.env.get("CASHFREE_SECRET_KEY");
    const CASHFREE_ENVIRONMENT = Deno.env.get("CASHFREE_ENVIRONMENT") || "sandbox";

    // Validate credentials
    if (!CASHFREE_CLIENT_ID || !CASHFREE_SECRET_KEY) {
      throw new Error("Cashfree credentials not configured");
    }

    // Get Cashfree API URL based on environment
    const cashfreeApiUrl =
      CASHFREE_ENVIRONMENT === "production"
        ? "https://api.cashfree.com"
        : "https://sandbox.cashfree.com";

    // Parse request body
    const { orderId }: { orderId: string } = await req.json();

    // Validate input
    if (!orderId) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Order ID is required",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Call Cashfree API to get order details
    const cashfreeResponse = await fetch(
      `${cashfreeApiUrl}/pg/orders/${orderId}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "x-api-version": "2022-09-01",
          "x-client-id": CASHFREE_CLIENT_ID,
          "x-client-secret": CASHFREE_SECRET_KEY,
        },
      }
    );

    if (!cashfreeResponse.ok) {
      const errorData = await cashfreeResponse.json().catch(() => ({}));
      console.error("Cashfree API error:", errorData);
      
      return new Response(
        JSON.stringify({
          success: false,
          error: errorData.message || "Failed to verify payment",
        }),
        {
          status: cashfreeResponse.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const orderData = await cashfreeResponse.json();

    // Optional: Update order status in Supabase database
    // You can add database update logic here if needed

    // Return payment status
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          order_id: orderData.order_id,
          order_amount: orderData.order_amount,
          order_currency: orderData.order_currency,
          order_status: orderData.order_status,
          payment_session_id: orderData.payment_session_id,
          payment_details: orderData.payment_details,
          customer_details: orderData.customer_details,
          shipping_address: orderData.shipping_address,
          billing_address: orderData.billing_address,
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error verifying payment:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});





