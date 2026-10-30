// Supabase Edge Function: Verify Cashfree Payment
// Verifies payment status directly with Cashfree, reconciles orders row, and redeems coupon atomically.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const CASHFREE_CLIENT_ID = Deno.env.get("CASHFREE_CLIENT_ID");
    const CASHFREE_SECRET_KEY = Deno.env.get("CASHFREE_SECRET_KEY");
    const CASHFREE_ENVIRONMENT = Deno.env.get("CASHFREE_ENVIRONMENT") || "sandbox";
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (!CASHFREE_CLIENT_ID || !CASHFREE_SECRET_KEY) {
      throw new Error("Cashfree credentials not configured");
    }

    const cashfreeApiUrl =
      CASHFREE_ENVIRONMENT === "production"
        ? "https://api.cashfree.com"
        : "https://sandbox.cashfree.com";

    const { orderId }: { orderId: string } = await req.json();
    if (!orderId || typeof orderId !== "string") {
      return new Response(
        JSON.stringify({ success: false, error: "Order ID is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const cashfreeResponse = await fetch(
      `${cashfreeApiUrl}/pg/orders/${encodeURIComponent(orderId)}`,
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
      return new Response(
        JSON.stringify({
          success: false,
          error: errorData.message || "Failed to verify payment",
        }),
        { status: cashfreeResponse.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const orderData = await cashfreeResponse.json();
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: dbOrder } = await supabase
      .from("orders")
      .select("*")
      .eq("cashfree_order_id", orderData.order_id)
      .maybeSingle();

    if (orderData.order_status === "PAID" && dbOrder) {
      if (dbOrder.order_status !== "PAID" || dbOrder.payment_status !== "SUCCESS") {
        await supabase
          .from("orders")
          .update({
            order_status: "PAID",
            payment_status: "SUCCESS",
            payment_method:
              orderData.payment_details?.payment_method ||
              dbOrder.payment_method ||
              "online",
            updated_at: new Date().toISOString(),
          })
          .eq("id", dbOrder.id);
      }

      const { error: couponErr } = await supabase.rpc("redeem_order_coupon", {
        p_order_id: dbOrder.id,
      });
      if (couponErr) {
        console.warn("Coupon redemption RPC note:", couponErr.message);
      }
    }

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
          shipping_address: orderData.shipping_address || dbOrder?.shipping_address,
          billing_address: orderData.billing_address || dbOrder?.billing_address,
          db_order: dbOrder
            ? {
                items: dbOrder.items ?? [],
                subtotal_amount: dbOrder.subtotal_amount ?? dbOrder.order_amount,
                discount_amount: dbOrder.discount_amount ?? 0,
                shipping_amount: dbOrder.shipping_amount ?? 0,
                coupon_code: dbOrder.coupon_code ?? null,
                payment_method: dbOrder.payment_method ?? "online",
                shiprocket_awb: dbOrder.shiprocket_awb ?? null,
                shiprocket_status: dbOrder.shiprocket_status ?? null,
                created_at: dbOrder.created_at,
                notes: dbOrder.notes ?? null,
              }
            : null,
        },
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error verifying payment:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
