// Supabase Edge Function: Create Cashfree Order
// Validates product prices, bundle prices/stock, coupons, and shipping server-side.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function round2(n: number): number {
  return Math.round((Number(n) + Number.EPSILON) * 100) / 100;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const {
      amount,
      customerInfo,
      cartItems,
      bundleItems,
      couponCode,
      shiprocketPrepaid,
      returnUrl,
    } = await req.json();

    if (!customerInfo?.email || !customerInfo?.name || !customerInfo?.contact) {
      return new Response(
        JSON.stringify({ error: "Missing required customer information" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const hasCartItems = Array.isArray(cartItems) && cartItems.length > 0;
    const hasBundleItems = Array.isArray(bundleItems) && bundleItems.length > 0;
    if (!hasCartItems && !hasBundleItems) {
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

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let subtotal = 0;
    const validatedItems: Array<{
      product_id: string;
      bundle_id?: string;
      product_name: string;
      price: number;
      quantity: number;
      type: "product" | "bundle";
    }> = [];

    // 1. Validate individual products
    if (hasCartItems) {
      const productIds = (cartItems as Array<{ productId: string }>).map((item) => item.productId);
      const { data: dbProducts, error: dbError } = await supabase
        .from("products")
        .select("id, name, price_current, status")
        .in("id", productIds);

      if (dbError || !dbProducts) {
        console.error("Error fetching product prices:", dbError);
        return new Response(
          JSON.stringify({ error: "Failed to validate product prices" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const productMap = new Map(dbProducts.map((p: { id: string }) => [p.id, p]));
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
        const unitPrice = Number(dbProduct.price_current);
        subtotal += unitPrice * quantity;
        validatedItems.push({
          product_id: item.productId,
          product_name: dbProduct.name,
          price: unitPrice,
          quantity,
          type: "product",
        });
      }
    }

    // 2. Validate bundles + constituent bottle stock
    if (hasBundleItems) {
      const bundleIds = (bundleItems as Array<{ bundleId: string }>).map((item) => item.bundleId);
      const { data: dbBundles, error: bundleError } = await supabase
        .from("product_bundles")
        .select("id, name, price_current, status, bundle_items(quantity, sort_order, products(id, name, status))")
        .in("id", bundleIds);

      if (bundleError || !dbBundles) {
        console.error("Error fetching bundle prices:", bundleError);
        return new Response(
          JSON.stringify({ error: "Failed to validate bundle prices" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const bundleMap = new Map(dbBundles.map((b: { id: string }) => [b.id, b]));
      for (const item of bundleItems) {
        const dbBundle = bundleMap.get(item.bundleId) as {
          id: string;
          name: string;
          price_current: number;
          status: string;
          bundle_items?: Array<{
            quantity: number;
            sort_order: number;
            products: { id: string; name: string; status: string } | null;
          }>;
        } | undefined;

        if (!dbBundle) {
          return new Response(
            JSON.stringify({ error: `Bundle not found: ${item.bundleId}` }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        if (dbBundle.status !== "active") {
          return new Response(
            JSON.stringify({ error: `${dbBundle.name} is currently unavailable` }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const sortedConstituents = [...(dbBundle.bundle_items ?? [])].sort(
          (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
        );
        for (const c of sortedConstituents) {
          if (c.products && (c.products.status === "out_of_stock" || c.products.status === "discontinued")) {
            return new Response(
              JSON.stringify({
                error: `${dbBundle.name} cannot be ordered because ${c.products.name} is out of stock`,
              }),
              { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
        }

        const constituentLabel = sortedConstituents
          .filter((c) => c.products?.name)
          .map((c) => {
            const q = Math.max(1, Number(c.quantity) || 1);
            return q > 1 ? `${c.products!.name} x${q}` : c.products!.name;
          })
          .join(" + ");
        const lineName = constituentLabel
          ? `${dbBundle.name}: ${constituentLabel}`
          : dbBundle.name;

        const quantity = Math.max(1, Math.floor(Number(item.quantity) || 1));
        const unitPrice = Number(dbBundle.price_current);
        subtotal += unitPrice * quantity;
        validatedItems.push({
          product_id: item.bundleId,
          bundle_id: item.bundleId,
          product_name: lineName,
          price: unitPrice,
          quantity,
          type: "bundle",
        });
      }
    }

    subtotal = round2(subtotal);

    // 3. Validate coupon across full cart subtotal (Products + Bundles)
    let appliedCouponId: string | null = null;
    let appliedCouponCode: string | null = null;
    let discountAmount = 0;

    if (typeof couponCode === "string" && couponCode.trim().length > 0) {
      const normalizedCode = couponCode.trim().toUpperCase();
      const { data: couponRow, error: couponError } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", normalizedCode)
        .single();

      if (couponError || !couponRow) {
        return new Response(
          JSON.stringify({ error: "Invalid coupon code" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const now = new Date();
      if (!couponRow.is_active) {
        return new Response(
          JSON.stringify({ error: "This coupon is no longer active" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (couponRow.starts_at && new Date(couponRow.starts_at) > now) {
        return new Response(
          JSON.stringify({ error: "This coupon is not yet active" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (couponRow.ends_at && new Date(couponRow.ends_at) < now) {
        return new Response(
          JSON.stringify({ error: "This coupon has expired" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (
        couponRow.usage_limit !== null &&
        couponRow.usage_limit !== undefined &&
        Number(couponRow.usage_count || 0) >= Number(couponRow.usage_limit)
      ) {
        return new Response(
          JSON.stringify({ error: "This coupon has been fully redeemed" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const minOrder = Number(couponRow.min_order_amount || 0);
      if (minOrder > 0 && subtotal < minOrder) {
        return new Response(
          JSON.stringify({ error: `Minimum order of ₹${minOrder} required for ${normalizedCode}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (couponRow.discount_type === "percentage") {
        discountAmount = subtotal * (Number(couponRow.discount_value || 0) / 100);
        if (couponRow.max_discount_amount !== null && Number(couponRow.max_discount_amount) > 0) {
          discountAmount = Math.min(discountAmount, Number(couponRow.max_discount_amount));
        }
      } else {
        discountAmount = Number(couponRow.discount_value || 0);
      }
      discountAmount = Math.min(subtotal, Math.max(0, round2(discountAmount)));
      appliedCouponId = couponRow.id;
      appliedCouponCode = normalizedCode;
    }

    const discountedSubtotal = round2(Math.max(0, subtotal - discountAmount));

    // 4. Compute shipping against post-coupon discountedSubtotal
    const { data: settingsRows } = await supabase
      .from("site_settings")
      .select("key, value")
      .in("key", ["free_shipping", "shipping_rate"]);

    const settingsMap = new Map(
      (settingsRows ?? []).map((r: { key: string; value: unknown }) => [r.key, r.value])
    );
    const freeShipping = (settingsMap.get("free_shipping") as { enabled?: boolean; threshold?: number } | undefined) ?? {
      enabled: true,
      threshold: 0,
    };
    const shippingRate = (settingsMap.get("shipping_rate") as { amount?: number } | undefined) ?? {
      amount: 49,
    };

    let shippingAmount = 0;
    const threshold = Number(freeShipping.threshold || 0);
    if (freeShipping.enabled && threshold <= 0) {
      shippingAmount = 0;
    } else if (threshold > 0 && discountedSubtotal >= threshold) {
      shippingAmount = 0;
    } else {
      const configuredRate = Number(shippingRate.amount || 0);
      shippingAmount = round2(
        configuredRate > 0 ? configuredRate : Math.max(0, Number(shiprocketPrepaid) || 0)
      );
    }

    const serverTotal = round2(discountedSubtotal + shippingAmount);
    if (serverTotal < 1) {
      return new Response(
        JSON.stringify({ error: "Minimum payable order amount is ₹1.00" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (Math.abs(serverTotal - Number(amount || 0)) > 1) {
      console.warn(
        `Price discrepancy detected: client=${amount}, server=${serverTotal}. Using server total.`
      );
    }

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

    const orderId = `order_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;

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

    if (customerInfo.address) {
      (cashfreePayload.order_meta as Record<string, unknown>).shipping_address = {
        address_line1: customerInfo.address,
        city: customerInfo.city,
        state: customerInfo.state,
        pincode: customerInfo.postalCode,
        country: customerInfo.country || "India",
      };
    }

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

    const shippingAddress = customerInfo.address
      ? {
          address: customerInfo.address,
          city: customerInfo.city,
          state: customerInfo.state,
          pincode: customerInfo.postalCode,
          country: customerInfo.country || "India",
        }
      : null;

    const baseOrderRow = {
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
    };

    const { error: insertError } = await supabase.from("orders").insert({
      ...baseOrderRow,
      subtotal_amount: subtotal,
      coupon_id: appliedCouponId,
      coupon_code: appliedCouponCode,
      discount_amount: discountAmount,
      shipping_amount: shippingAmount,
    });

    if (insertError) {
      console.warn("Extended orders insert failed, retrying base row:", insertError.message);
      const { error: fallbackError } = await supabase.from("orders").insert({
        ...baseOrderRow,
        notes: appliedCouponCode
          ? `Coupon: ${appliedCouponCode} (-₹${discountAmount}), Shipping: ₹${shippingAmount}`
          : null,
      });
      if (fallbackError) {
        console.error("Error storing order:", fallbackError);
      }
    }

    return new Response(
      JSON.stringify({
        order_id: cashfreeData.order_id,
        order_token: cashfreeData.order_token,
        payment_session_id: cashfreeData.payment_session_id,
        order_amount: serverTotal,
        subtotal_amount: subtotal,
        discount_amount: discountAmount,
        shipping_amount: shippingAmount,
        coupon_code: appliedCouponCode,
        order_currency: "INR",
        order_status: cashfreeData.order_status,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Order creation failed",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
