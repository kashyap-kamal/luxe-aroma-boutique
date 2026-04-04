// Supabase Edge Function: Create Cashfree Order
// Validates product prices server-side against the database before creating a payment order.
// This prevents price tampering from the frontend.

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
    // Parse request
    const { amount, customerInfo, cartItems, returnUrl } = await req.json();

    // Validate required fields
    if (!customerInfo?.email || !customerInfo?.name || !customerInfo?.contact) {
      return new Response(
        JSON.stringify({ error: "Missing required customer information" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!cartItems || cartItems.length === 0) {
      return new Response(
        JSON.stringify({ error: "Cart is empty" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!returnUrl) {
      return new Response(
        JSON.stringify({ error: "Return URL is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase with service role (bypasses RLS)
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch current prices from DB for all cart item product IDs
    const productIds = cartItems.map((item: { productId: string }) => item.productId);
    const { data: dbProducts, error: dbError } = await supabase
      .from("products")
      .select("id, name, price_current, price_original, currency, status")
      .in("id", productIds);

    if (dbError || !dbProducts) {
      console.error("Error fetching product prices:", dbError);
      return new Response(
        JSON.stringify({ error: "Failed to validate product prices" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate all products exist and are in stock, calculate server total
    const productMap = new Map(dbProducts.map((p: { id: string }) => [p.id, p]));
    let serverTotal = 0;
    const validatedItems: Array<{
      product_id: string;
      product_name: string;
      price: number;
      quantity: number;
    }> = [];

    for (const item of cartItems) {
      const dbProduct = productMap.get(item.productId) as {
        id: string;
        name: string;
        price_current: number;
        status: string;
      } | undefined;

      if (!dbProduct) {
        return new Response(
          JSON.stringify({ error: `Product not found: ${item.productId}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (dbProduct.status === "out_of_stock" || dbProduct.status === "discontinued") {
        return new Response(
          JSON.stringify({ error: `${dbProduct.name} is currently unavailable` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const quantity = Math.max(1, Math.floor(Number(item.quantity) || 1));
      const lineTotal = Number(dbProduct.price_current) * quantity;
      serverTotal += lineTotal;

      validatedItems.push({
        product_id: item.productId,
        product_name: dbProduct.name,
        price: Number(dbProduct.price_current),
        quantity,
      });
    }

    // Log discrepancy between client and server totals
    if (Math.abs(serverTotal - amount) > 1) {
      console.warn(
        `Price discrepancy detected: client=${amount}, server=${serverTotal}. Using server total.`
      );
    }

    // Get Cashfree credentials
    const CASHFREE_CLIENT_ID = Deno.env.get("CASHFREE_CLIENT_ID");
    const CASHFREE_SECRET_KEY = Deno.env.get("CASHFREE_SECRET_KEY");
    const CASHFREE_ENVIRONMENT = Deno.env.get("CASHFREE_ENVIRONMENT") || "sandbox";

    if (!CASHFREE_CLIENT_ID || !CASHFREE_SECRET_KEY) {
      return new Response(
        JSON.stringify({ error: "Payment gateway not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const cashfreeApiUrl = CASHFREE_ENVIRONMENT === "production"
      ? "https://api.cashfree.com"
      : "https://sandbox.cashfree.com";

    // Generate unique order ID
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Build Cashfree order payload with SERVER-VALIDATED total
    const cashfreePayload: Record<string, unknown> = {
      order_id: orderId,
      order_amount: serverTotal,
      order_currency: "INR",
      customer_details: {
        customer_id: `cust_${Date.now()}`,
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.contact,
      },
      order_meta: {
        return_url: returnUrl,
      },
    };

    // Add shipping address if provided
    if (customerInfo.address) {
      (cashfreePayload.order_meta as Record<string, unknown>).shipping_address = {
        address_line1: customerInfo.address,
        city: customerInfo.city,
        state: customerInfo.state,
        pincode: customerInfo.postalCode,
        country: customerInfo.country || "India",
      };
    }

    // Create order with Cashfree
    const cashfreeResponse = await fetch(`${cashfreeApiUrl}/pg/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-api-version": "2022-09-01",
        "x-client-id": CASHFREE_CLIENT_ID,
        "x-client-secret": CASHFREE_SECRET_KEY,
      },
      body: JSON.stringify(cashfreePayload),
    });

    const cashfreeData = await cashfreeResponse.json();

    if (!cashfreeResponse.ok) {
      console.error("Cashfree order creation failed:", cashfreeData);
      return new Response(
        JSON.stringify({ error: cashfreeData.message || "Failed to create payment order" }),
        { status: cashfreeResponse.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Store order in Supabase
    const shippingAddress = customerInfo.address
      ? {
          address: customerInfo.address,
          city: customerInfo.city,
          state: customerInfo.state,
          pincode: customerInfo.postalCode,
          country: customerInfo.country || "India",
        }
      : null;

    const { error: insertError } = await supabase.from("orders").insert({
      cashfree_order_id: cashfreeData.order_id,
      order_amount: serverTotal,
      order_currency: "INR",
      order_status: "ACTIVE",
      payment_status: "PENDING",
      customer_name: customerInfo.name,
      customer_email: customerInfo.email,
      customer_phone: customerInfo.contact,
      items: validatedItems,
      shipping_address: shippingAddress,
    });

    if (insertError) {
      console.error("Error storing order:", insertError);
      // Don't fail the payment flow — order can be reconciled from Cashfree webhook
    }

    // Return response to frontend
    return new Response(
      JSON.stringify({
        order_id: cashfreeData.order_id,
        order_token: cashfreeData.order_token,
        payment_session_id: cashfreeData.payment_session_id,
        order_amount: serverTotal,
        order_currency: "INR",
        order_status: cashfreeData.order_status,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Order creation failed",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
