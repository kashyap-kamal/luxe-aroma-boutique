// Supabase Edge Function: Cashfree Webhook Handler
// This function handles payment status updates from Cashfree
// Stores order updates in Supabase database
// Includes webhook signature verification for security

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

/**
 * Verify Cashfree webhook signature
 * Cashfree uses HMAC-SHA256 with the following format:
 * 1. Concatenate timestamp + raw payload body
 * 2. Generate HMAC-SHA256 hash using client secret key
 * 3. Base64 encode the hash
 * 4. Compare with x-webhook-signature header
 * 
 * Headers:
 * - x-webhook-signature: The signature to verify
 * - x-webhook-timestamp: The timestamp of the webhook event
 */
async function verifyWebhookSignature(
  payload: string,
  timestamp: string | null,
  signature: string | null,
  secret: string
): Promise<boolean> {
  // If signature or timestamp is missing, reject the webhook
  if (!signature || !timestamp) {
    console.warn("Webhook signature or timestamp missing - rejecting request");
    return false;
  }

  try {
    // Step 1: Concatenate timestamp + raw payload
    const signString = timestamp + payload;

    // Step 2: Generate HMAC-SHA256 hash using client secret
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const messageData = encoder.encode(signString);

    // Import the secret key for HMAC
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    // Generate HMAC signature
    const signatureBuffer = await crypto.subtle.sign(
      "HMAC",
      cryptoKey,
      messageData
    );

    // Step 3: Base64 encode the hash
    const expectedSignature = btoa(
      String.fromCharCode(...new Uint8Array(signatureBuffer))
    );

    // Step 4: Compare signatures (case-sensitive)
    const isValid = expectedSignature === signature;

    if (!isValid) {
      console.error("Webhook signature verification failed", {
        expected: expectedSignature.substring(0, 20) + "...",
        received: signature.substring(0, 20) + "...",
      });
    }

    return isValid;
  } catch (error) {
    console.error("Error verifying webhook signature:", error);
    return false;
  }
}

// Main handler function
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get Cashfree webhook secret for signature verification
    // Priority: CASHFREE_WEBHOOK_SECRET (if set) > CASHFREE_SECRET_KEY (fallback)
    // Cashfree uses HMAC-SHA256 with the secret key to sign webhooks
    const WEBHOOK_SECRET = Deno.env.get("CASHFREE_WEBHOOK_SECRET") || 
                           Deno.env.get("CASHFREE_SECRET_KEY") || 
                           "";

    // CRITICAL: Verify webhook secret is configured
    if (!WEBHOOK_SECRET) {
      console.error("Webhook secret not configured - rejecting request");
      return new Response(
        JSON.stringify({ error: "Webhook secret not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get webhook signature and timestamp from headers
    // Cashfree sends these headers:
    // - x-webhook-signature: HMAC-SHA256 signature (base64 encoded)
    // - x-webhook-timestamp: Unix timestamp of the webhook event
    const signature = req.headers.get("x-webhook-signature");
    const timestamp = req.headers.get("x-webhook-timestamp");

    // CRITICAL: Always verify signature BEFORE processing
    // This ensures the webhook is actually from Cashfree and hasn't been tampered with
    if (!signature || !timestamp) {
      console.error("Webhook signature or timestamp missing - rejecting request");
      return new Response(
        JSON.stringify({ error: "Missing webhook signature or timestamp" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get raw payload text BEFORE parsing (required for signature verification)
    // The signature is calculated on the raw body, so we must verify before parsing
    const payloadText = await req.text();

    // Verify webhook signature BEFORE any processing
    // This is a security requirement - never process webhooks without verification
    const isValid = await verifyWebhookSignature(
      payloadText,
      timestamp,
      signature,
      WEBHOOK_SECRET
    );

    if (!isValid) {
      console.error("Invalid webhook signature - rejecting request");
      return new Response(
        JSON.stringify({ error: "Invalid webhook signature" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Webhook signature verified successfully - processing webhook");

    // Now parse the payload after signature verification
    let webhookData: any;
    try {
      webhookData = JSON.parse(payloadText);
    } catch (parseError) {
      console.error("Error parsing webhook payload:", parseError);
      return new Response(
        JSON.stringify({ error: "Invalid JSON payload" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Cashfree webhook received:", {
      order_id: webhookData.order_id,
      order_status: webhookData.order_status,
      event_type: webhookData.type || webhookData.event_type,
    });

    // Extract order and payment information
    const {
      order_id,
      order_amount,
      order_currency,
      order_status,
      payment_details,
      customer_details,
      shipping_address,
      billing_address,
      type, // Event type (e.g., "PAYMENT_SUCCESS_WEBHOOK")
    } = webhookData;

    // Validate required fields
    if (!order_id || !order_status) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: order_id or order_status" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Store webhook event in database for logging and audit trail
    const { error: webhookError } = await supabase
      .from("webhooks")
      .insert({
        order_id,
        event_type: type || order_status,
        payload: webhookData,
        processed: false,
      });

    if (webhookError) {
      console.error("Error storing webhook:", webhookError);
    }

    // Handle different order statuses
    switch (order_status) {
      case "PAID":
        // Payment successful - update order in database
        console.log(`Order ${order_id} payment successful`);

        // First, fetch the order details to get items and customer info
        const { data: orderData, error: fetchError } = await supabase
          .from("orders")
          .select("*")
          .eq("cashfree_order_id", order_id)
          .single();

        if (fetchError) {
          console.error("Error fetching order:", fetchError);
        }

        // Update order status in database
        const { error: updateError } = await supabase
          .from("orders")
          .update({
            order_status: "PAID",
            payment_status: "SUCCESS",
            payment_method: payment_details?.payment_method || payment_details?.payment_method_type,
            payment_details: payment_details || {},
            shipping_address: shipping_address || {},
            billing_address: billing_address || {},
            updated_at: new Date().toISOString(),
          })
          .eq("cashfree_order_id", order_id);

        if (updateError) {
          console.error("Error updating order:", updateError);
        }

        // Automatically create Delhivery shipment order after payment success
        if (orderData && !orderData.delhivery_waybill) {
          try {
            console.log(`Creating Delhivery order for ${order_id}`);
            
            // Extract shipping address details
            const shipAddr = shipping_address || orderData.shipping_address || {};
            const customerName = orderData.customer_name || customer_details?.customer_name || "Customer";
            const customerPhone = orderData.customer_phone || customer_details?.customer_phone || "";
            const customerEmail = orderData.customer_email || customer_details?.customer_email || "";
            
            // Extract items for product description
            const items = orderData.items || [];
            const productsDesc = items
              .map((item: any) => `${item.product_name || item.name || "Product"} (Qty: ${item.quantity || 1})`)
              .join(", ") || "Perfume Products";
            
            // Calculate total weight (assuming 0.5kg per item, minimum 0.5kg)
            const totalWeight = Math.max(
              items.reduce((sum: number, item: any) => sum + ((item.quantity || 1) * 0.5), 0),
              0.5
            );
            
            // Determine payment mode based on payment method
            const paymentMode = payment_details?.payment_method === "cod" || 
                              payment_details?.payment_method_type === "COD" ? "COD" : "Prepaid";
            
            // Prepare Delhivery order request
            const delhiveryRequest = {
              name: customerName,
              add: shipAddr.address_line1 || shipAddr.address || orderData.shipping_address?.address || "",
              phone: customerPhone,
              pin: shipAddr.pincode || shipAddr.postal_code || orderData.shipping_address?.pincode || "",
              city: shipAddr.city || orderData.shipping_address?.city || "",
              state: shipAddr.state || orderData.shipping_address?.state || "",
              country: shipAddr.country || orderData.shipping_address?.country || "India",
              order: order_id, // Use Cashfree order ID as Delhivery order reference
              payment_mode: paymentMode,
              products_desc: productsDesc,
              cod_amount: paymentMode === "COD" ? Number(orderData.order_amount) : undefined,
              total_amount: Number(orderData.order_amount),
              quantity: items.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0),
              weight: totalWeight,
              address_type: "home",
              shipping_mode: "Surface",
              fragile_shipment: false,
              dangerous_good: false,
              plastic_packaging: false,
            };

            // Call Delhivery Edge Function to create shipment
            const delhiveryFunctionUrl = `${supabaseUrl}/functions/v1/create-delhivery-order`;
            const delhiveryResponse = await fetch(delhiveryFunctionUrl, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${supabaseServiceKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(delhiveryRequest),
            });

            if (delhiveryResponse.ok) {
              const delhiveryResult = await delhiveryResponse.json();
              
              if (delhiveryResult.success && delhiveryResult.waybill) {
                // Update order with Delhivery waybill and order ID
                await supabase
                  .from("orders")
                  .update({
                    delhivery_order_id: delhiveryResult.order_id || order_id,
                    delhivery_waybill: delhiveryResult.waybill,
                    delhivery_status: "created",
                    updated_at: new Date().toISOString(),
                  })
                  .eq("cashfree_order_id", order_id);

                console.log(`Delhivery order created successfully. Waybill: ${delhiveryResult.waybill}`);
              } else {
                console.error("Delhivery order creation failed:", delhiveryResult.error);
                // Update status to indicate failure (but don't fail the webhook)
                await supabase
                  .from("orders")
                  .update({
                    delhivery_status: "failed",
                    updated_at: new Date().toISOString(),
                  })
                  .eq("cashfree_order_id", order_id);
              }
            } else {
              const errorText = await delhiveryResponse.text();
              console.error("Delhivery API call failed:", errorText);
              // Update status to indicate failure (but don't fail the webhook)
              await supabase
                .from("orders")
                .update({
                  delhivery_status: "failed",
                  updated_at: new Date().toISOString(),
                })
                .eq("cashfree_order_id", order_id);
            }
          } catch (delhiveryError) {
            console.error("Error creating Delhivery order:", delhiveryError);
            // Don't fail the webhook if Delhivery creation fails
            // The order can be manually processed later
            await supabase
              .from("orders")
              .update({
                delhivery_status: "failed",
                updated_at: new Date().toISOString(),
              })
              .eq("cashfree_order_id", order_id);
          }
        } else if (orderData?.delhivery_waybill) {
          console.log(`Delhivery order already exists for ${order_id}. Waybill: ${orderData.delhivery_waybill}`);
        }

        // Mark webhook as processed
        await supabase
          .from("webhooks")
          .update({ processed: true })
          .eq("order_id", order_id)
          .eq("event_type", type || order_status);

        // TODO: Add additional logic here:
        // - Send confirmation email to customer (with waybill number)
        // - Update inventory
        // - Notify admin

        break;

      case "ACTIVE":
        // Order created but payment pending
        console.log(`Order ${order_id} is active, payment pending`);
        
        // Update order status if order exists
        await supabase
          .from("orders")
          .update({
            order_status: "ACTIVE",
            updated_at: new Date().toISOString(),
          })
          .eq("cashfree_order_id", order_id);

        break;

      case "EXPIRED":
        // Payment session expired
        console.log(`Order ${order_id} payment session expired`);

        await supabase
          .from("orders")
          .update({
            order_status: "EXPIRED",
            updated_at: new Date().toISOString(),
          })
          .eq("cashfree_order_id", order_id);

        break;

      case "CANCELLED":
        // Payment cancelled by user
        console.log(`Order ${order_id} payment cancelled`);

        await supabase
          .from("orders")
          .update({
            order_status: "CANCELLED",
            payment_status: "CANCELLED",
            updated_at: new Date().toISOString(),
          })
          .eq("cashfree_order_id", order_id);

        break;

      default:
        console.log(`Order ${order_id} status: ${order_status}`);
        
        // Update order with any status change
        await supabase
          .from("orders")
          .update({
            order_status: order_status,
            updated_at: new Date().toISOString(),
          })
          .eq("cashfree_order_id", order_id);
    }

    // Mark webhook as processed
    await supabase
      .from("webhooks")
      .update({ processed: true })
      .eq("order_id", order_id)
      .eq("event_type", type || order_status);

    // Return success response to Cashfree
    // Cashfree expects 200 status code to acknowledge webhook receipt
    return new Response(
      JSON.stringify({
        success: true,
        message: "Webhook processed successfully",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Cashfree webhook error:", error);
    
    // Return 500 but don't expose internal error details
    return new Response(
      JSON.stringify({
        error: "Webhook processing failed",
        // Don't expose internal error in production
        // details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});





