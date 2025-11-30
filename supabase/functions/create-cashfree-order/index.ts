// Supabase Edge Function: Create Cashfree Order
// This function creates a Cashfree order with One Click Checkout enabled
// API keys are stored securely in Supabase secrets

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers for allowing requests from your frontend
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

/**
 * Generate consistent customer ID from email and phone
 * This ensures One Click Checkout can recognize returning customers
 * and pre-fill their saved addresses
 */
function generateCustomerId(email: string, phone: string): string {
  // Create a hash from email and phone for consistent customer ID
  const data = `${email.toLowerCase()}_${phone.replace(/\D/g, "")}`;
  // Simple hash function (in production, consider using crypto.subtle)
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return `CUST_${Math.abs(hash).toString(36).substring(0, 12).toUpperCase()}`;
}

// Main handler function
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client for database operations
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
    const {
      amount,
      customerInfo,
      cartItems,
      returnUrl,
      customerId, // Optional: allow frontend to pass customer ID for authenticated users
    }: {
      amount: number;
      customerInfo: {
        name: string;
        email: string;
        contact: string;
      };
      cartItems: Array<{
        productId: string;
        productName: string;
        price: number;
        quantity: number;
        imageUrl?: string;
      }>;
      returnUrl: string;
      customerId?: string;
    } = await req.json();

    // Validate input
    if (!amount || amount <= 0) {
      return new Response(
        JSON.stringify({ error: "Invalid amount" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!customerInfo?.email || !customerInfo?.name || !customerInfo?.contact) {
      return new Response(
        JSON.stringify({ error: "Customer information is incomplete" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Generate consistent customer ID for One Click Checkout
    // This allows Cashfree to recognize returning customers and pre-fill addresses
    const consistentCustomerId = customerId || generateCustomerId(
      customerInfo.email,
      customerInfo.contact
    );

    // IMPORTANT: Cashfree API expects order_amount in PAISE (smallest currency unit)
    // Frontend sends amount in rupees, so we convert to paise (₹1 = 100 paise)
    const amountInRupees = typeof amount === "number" ? amount : parseFloat(amount);
    if (isNaN(amountInRupees) || amountInRupees <= 0) {
      return new Response(
        JSON.stringify({ error: "Invalid amount format" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    // Convert rupees to paise: ₹399 -> 39900 paise
    // Cashfree API expects amounts in paise (smallest currency unit)
    const orderAmount = Math.round(amountInRupees * 100);
    
    console.log(`Amount conversion: ₹${amountInRupees} -> ${orderAmount} paise`);

    // Prepare cart items for Cashfree
    // IMPORTANT: Cashfree API expects prices in PAISE (smallest currency unit)
    const cashfreeCartItems = cartItems.map((item, index) => {
      const itemPriceInRupees = typeof item.price === "number" ? item.price : parseFloat(item.price);
      // Convert rupees to paise: ₹399 -> 39900 paise
      const itemPriceInPaise = Math.round(itemPriceInRupees * 100);
      
      return {
        item_id: item.productId || `item_${index}`,
        item_name: item.productName,
        item_description: `Product: ${item.productName}`,
        item_details_url: `${Deno.env.get("APP_URL") || "http://localhost:3000"}/products/${item.productId}`,
        item_image_url: item.imageUrl || "",
        item_original_unit_price: itemPriceInPaise, // Price in paise
        item_discounted_unit_price: itemPriceInPaise, // Price in paise
        item_quantity: item.quantity,
        item_currency: "INR",
      };
    });

    // Enhanced One Click Checkout configuration
    // This enables all One Click Checkout features:
    // - Address pre-filling from 100M+ saved addresses
    // - Instant OTP verification
    // - AI-powered risk assessment for COD orders
    const oneClickCheckoutConfig = {
      enabled: true,
      conditions: [
        {
          action: "ALLOW",
          values: [
            "checkoutCollectAddress", // Enable address collection and pre-filling
            "checkoutAuthenticate",   // Enable OTP authentication
            "checkoutRiskAssessment", // Enable AI risk assessment for COD
          ],
          key: "features",
        },
      ],
    };

    // Prepare order request for Cashfree with enhanced One Click Checkout
    const orderRequest = {
      order_amount: orderAmount,
      order_currency: "INR",
      customer_details: {
        customer_id: consistentCustomerId, // Consistent ID for returning customers
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.contact,
      },
      order_meta: {
        return_url: returnUrl,
        // Use Supabase project URL for webhook endpoint
        // This ensures Cashfree can send webhooks to our Edge Function
        notify_url: `${supabaseUrl}/functions/v1/cashfree-webhook`,
      },
      products: {
        one_click_checkout: oneClickCheckoutConfig,
      },
      cart_details: {
        cart_items: cashfreeCartItems,
      },
    };

    // Call Cashfree API to create order
    const cashfreeResponse = await fetch(`${cashfreeApiUrl}/pg/orders`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-api-version": "2022-09-01",
        "x-client-id": CASHFREE_CLIENT_ID,
        "x-client-secret": CASHFREE_SECRET_KEY,
      },
      body: JSON.stringify(orderRequest),
    });

    if (!cashfreeResponse.ok) {
      const errorData = await cashfreeResponse.json().catch(() => ({}));
      console.error("Cashfree API error:", errorData);
      
      return new Response(
        JSON.stringify({
          error: errorData.message || "Failed to create payment order",
        }),
        {
          status: cashfreeResponse.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const orderData = await cashfreeResponse.json();

    // Store order in Supabase database for tracking
    // Note: orderData.order_amount is in paise, convert back to rupees for storage
    const orderAmountInRupees = orderData.order_amount / 100;
    
    const { error: dbError } = await supabase
      .from("orders")
      .insert({
        cashfree_order_id: orderData.order_id,
        customer_email: customerInfo.email,
        customer_name: customerInfo.name,
        customer_phone: customerInfo.contact,
        order_amount: orderAmountInRupees, // Store in rupees for easier querying
        order_currency: orderData.order_currency || "INR",
        order_status: orderData.order_status || "ACTIVE",
        items: cartItems.map(item => ({
          product_id: item.productId,
          product_name: item.productName,
          price: item.price,
          quantity: item.quantity,
          total: item.price * item.quantity,
        })),
        notes: `One Click Checkout enabled. Customer ID: ${consistentCustomerId}`,
      });

    if (dbError) {
      console.error("Error storing order in database:", dbError);
      // Don't fail the request if DB insert fails, but log it
    }

    // Return success response with Cashfree order details
    return new Response(
      JSON.stringify({
        order_id: orderData.order_id,
        order_token: orderData.order_token,
        payment_session_id: orderData.payment_session_id,
        order_amount: orderData.order_amount,
        order_currency: orderData.order_currency || "INR",
        order_status: orderData.order_status,
        payment_session_id_expiry: orderData.payment_session_id_expiry,
        customer_id: consistentCustomerId, // Return customer ID for frontend reference
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error creating Cashfree order:", error);
    
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});





