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
    // Cashfree signs webhooks using the Client Secret (from API Keys in dashboard)
    // Note: Use the secret from the OLDEST active key pair if multiple exist
    const webhookSecret = (Deno.env.get("CASHFREE_WEBHOOK_SECRET") || "").trim();
    const clientSecret = (Deno.env.get("CASHFREE_SECRET_KEY") || "").trim();

    // Collect available secrets to try (primary first, then fallback)
    const secretsToTry: { name: string; value: string }[] = [];
    if (webhookSecret) secretsToTry.push({ name: "CASHFREE_WEBHOOK_SECRET", value: webhookSecret });
    if (clientSecret && clientSecret !== webhookSecret) secretsToTry.push({ name: "CASHFREE_SECRET_KEY", value: clientSecret });

    console.log("Webhook secret config:", {
      CASHFREE_WEBHOOK_SECRET_set: !!webhookSecret,
      CASHFREE_WEBHOOK_SECRET_len: webhookSecret.length,
      CASHFREE_SECRET_KEY_set: !!clientSecret,
      CASHFREE_SECRET_KEY_len: clientSecret.length,
      secrets_to_try: secretsToTry.length,
    });

    // CRITICAL: Verify webhook secret is configured
    if (secretsToTry.length === 0) {
      console.error("No webhook secret configured - set CASHFREE_WEBHOOK_SECRET or CASHFREE_SECRET_KEY");
      return new Response(
        JSON.stringify({ error: "Webhook secret not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get webhook signature and timestamp from headers
    const signature = req.headers.get("x-webhook-signature");
    const timestamp = req.headers.get("x-webhook-timestamp");

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
    const payloadText = await req.text();

    // Try verifying with each available secret (handles cases where
    // CASHFREE_WEBHOOK_SECRET is stale but CASHFREE_SECRET_KEY is correct)
    let isValid = false;
    let usedSecret = "";
    for (const secret of secretsToTry) {
      const valid = await verifyWebhookSignature(
        payloadText,
        timestamp,
        signature,
        secret.value
      );
      if (valid) {
        isValid = true;
        usedSecret = secret.name;
        break;
      }
      console.warn(`Signature verification failed with ${secret.name} (len=${secret.value.length})`);
    }

    if (!isValid) {
      console.error("Invalid webhook signature - none of the configured secrets matched");
      return new Response(
        JSON.stringify({ error: "Invalid webhook signature" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Webhook signature verified successfully using ${usedSecret}`);

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

    // Cashfree v2023-08-01 webhook format nests data under "data" key
    // Support both new nested format and legacy flat format
    const eventType = webhookData.type; // e.g. "PAYMENT_SUCCESS_WEBHOOK"
    const nestedData = webhookData.data;

    // Extract fields from nested v2023-08-01 format, falling back to legacy flat format
    const order_id = nestedData?.order?.order_id || webhookData.order_id;
    const order_amount = nestedData?.order?.order_amount || webhookData.order_amount;
    const order_currency = nestedData?.order?.order_currency || webhookData.order_currency;
    const payment_details = nestedData?.payment || webhookData.payment_details;
    const customer_details = nestedData?.customer_details || webhookData.customer_details;
    const shipping_address = webhookData.shipping_address;
    const billing_address = webhookData.billing_address;

    // Derive order_status from webhook type or payment status
    // v2023-08-01 format uses event type to indicate status
    let order_status: string;
    if (nestedData?.payment?.payment_status === "SUCCESS" || eventType === "PAYMENT_SUCCESS_WEBHOOK") {
      order_status = "PAID";
    } else if (eventType === "PAYMENT_FAILED_WEBHOOK" || nestedData?.payment?.payment_status === "FAILED") {
      order_status = "CANCELLED";
    } else if (eventType === "PAYMENT_USER_DROPPED_WEBHOOK") {
      order_status = "CANCELLED";
    } else {
      // Fallback to legacy flat format field
      order_status = webhookData.order_status || "UNKNOWN";
    }

    console.log("Cashfree webhook received:", {
      order_id,
      order_status,
      event_type: eventType,
      payment_status: nestedData?.payment?.payment_status,
    });

    // Validate required fields
    if (!order_id) {
      return new Response(
        JSON.stringify({ error: "Missing required field: order_id" }),
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
        event_type: eventType || order_status,
        payload: webhookData,
        processed: false,
      });

    if (webhookError) {
      console.error("Error storing webhook:", webhookError);
    }

    // Handle different order statuses
    switch (order_status) {
      case "PAID":
        // Payment successful - upsert order in database
        console.log(`Order ${order_id} payment successful`);

        // First, fetch the order details to get items and customer info
        const { data: orderData, error: fetchError } = await supabase
          .from("orders")
          .select("*")
          .eq("cashfree_order_id", order_id)
          .single();

        if (fetchError && fetchError.code !== "PGRST116") {
          console.error("Error fetching order:", fetchError);
        }

        // If order doesn't exist (initial insert failed), create it from webhook data
        if (!orderData) {
          console.warn(`Order ${order_id} not found in DB — creating from webhook data`);
          const { error: insertFallbackError } = await supabase.from("orders").insert({
            cashfree_order_id: order_id,
            order_amount: order_amount || 0,
            order_currency: order_currency || "INR",
            order_status: "PAID",
            payment_status: "SUCCESS",
            customer_name: customer_details?.customer_name || "Unknown",
            customer_email: customer_details?.customer_email || "",
            customer_phone: customer_details?.customer_phone || "",
            items: [],
            payment_method: payment_details?.payment_group || payment_details?.payment_method || null,
            payment_details: payment_details || {},
            shipping_address: shipping_address || null,
            billing_address: billing_address || null,
            notes: "Order record created from payment webhook (initial insert failed)",
          });
          if (insertFallbackError) {
            console.error("Fallback order insert also failed:", insertFallbackError);
          } else {
            console.log(`Fallback order record created for ${order_id}`);
          }
        }

        // Update order status in database (applies whether row was just inserted or already existed)
        const { error: updateError } = await supabase
          .from("orders")
          .update({
            order_status: "PAID",
            payment_status: "SUCCESS",
            payment_method: payment_details?.payment_group || payment_details?.payment_method || payment_details?.payment_method_type,
            payment_details: payment_details || {},
            ...(shipping_address ? { shipping_address } : {}),
            ...(billing_address ? { billing_address } : {}),
            updated_at: new Date().toISOString(),
          })
          .eq("cashfree_order_id", order_id);

        if (updateError) {
          console.error("Error updating order:", updateError);
        }

        // Re-fetch order data if it was just created via fallback
        const { data: latestOrderData } = !orderData
          ? await supabase.from("orders").select("*").eq("cashfree_order_id", order_id).single()
          : { data: orderData };
        const resolvedOrderData = latestOrderData || orderData;

        // Automatically create Shiprocket shipment order after payment success
        if (resolvedOrderData && !resolvedOrderData.shiprocket_awb) {
          try {
            console.log(`Creating Shiprocket order for ${order_id}`);
            
            // Extract shipping address details
            const shipAddr = shipping_address || resolvedOrderData.shipping_address || {};
            const customerName = resolvedOrderData.customer_name || customer_details?.customer_name || "Customer";
            const customerPhone = resolvedOrderData.customer_phone || customer_details?.customer_phone || "";
            const customerEmail = resolvedOrderData.customer_email || customer_details?.customer_email || "";

            // Extract items for product description
            const items = resolvedOrderData.items || [];
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
            
            // Extract address fields with validation
            const addressLine = shipAddr.address_line1 || shipAddr.address || resolvedOrderData.shipping_address?.address || "";
            const pincode = shipAddr.pincode || shipAddr.postal_code || shipAddr.zip_code || resolvedOrderData.shipping_address?.pincode || "";
            const city = shipAddr.city || resolvedOrderData.shipping_address?.city || "";
            const state = shipAddr.state || resolvedOrderData.shipping_address?.state || "";
            const phone = customerPhone;
            
            // Validate required fields before calling Shiprocket
            const missingFields = [];
            if (!addressLine || addressLine.trim() === "") missingFields.push("address");
            if (!pincode || pincode.trim() === "") missingFields.push("pincode");
            if (!city || city.trim() === "") missingFields.push("city");
            if (!state || state.trim() === "") missingFields.push("state");
            if (!phone || phone.trim() === "") missingFields.push("phone");
            if (!customerName || customerName.trim() === "") missingFields.push("name");
            
            if (missingFields.length > 0) {
              console.warn(`Missing required address fields for Shiprocket: ${missingFields.join(", ")}`);
              console.log("Address data received:", { shipAddr, orderDataAddress: resolvedOrderData.shipping_address });
              
              // Set status to pending_address instead of failed
              await supabase
                .from("orders")
                .update({
                  shiprocket_status: "pending_address",
                  notes: `Awaiting complete shipping address. Missing: ${missingFields.join(", ")}`,
                  updated_at: new Date().toISOString(),
                })
                .eq("cashfree_order_id", order_id);
              
              console.log(`Skipping Shiprocket creation - missing fields: ${missingFields.join(", ")}`);
              // Don't throw error - continue webhook processing
              break;
            }
            
            // Validate pincode format (must be 6 digits)
            if (!/^\d{6}$/.test(pincode.trim())) {
              console.error(`Invalid pincode format: ${pincode}. Must be 6 digits.`);
              await supabase
                .from("orders")
                .update({
                  shiprocket_status: "failed",
                  notes: `Invalid pincode format: ${pincode}. Required: 6 digits`,
                  updated_at: new Date().toISOString(),
                })
                .eq("cashfree_order_id", order_id);
              break;
            }
            
            console.log("Validated address for Shiprocket:", { addressLine, city, state, pincode, phone });
            
            // Build Shiprocket order items from order data
            const shiprocketItems = items.map((item: any) => ({
              name: item.product_name || item.name || "Product",
              sku: item.product_id || `SKU-${order_id}`,
              units: item.quantity || 1,
              selling_price: item.price || item.total || 0,
              hsn: "",
            }));

            // Prepare Shiprocket order request with validated fields
            const shiprocketRequest = {
              name: customerName,
              email: customerEmail,
              phone: phone,
              address: addressLine,
              pincode: pincode,
              city: city,
              state: state,
              country: shipAddr.country || resolvedOrderData.shipping_address?.country || "India",
              order_id: order_id, // Use Cashfree order ID as Shiprocket order reference
              payment_mode: paymentMode as "COD" | "Prepaid",
              products_desc: productsDesc,
              cod_amount: paymentMode === "COD" ? Number(resolvedOrderData.order_amount) : undefined,
              total_amount: Number(resolvedOrderData.order_amount),
              quantity: items.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0),
              weight: totalWeight,
              items: shiprocketItems,
            };

            // Log Shiprocket request for debugging
            console.log("Calling Shiprocket API with request:", JSON.stringify(shiprocketRequest));
            
            // Call Shiprocket Edge Function to create shipment
            const shiprocketFunctionUrl = `${supabaseUrl}/functions/v1/create-shiprocket-order`;
            const shiprocketResponse = await fetch(shiprocketFunctionUrl, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${supabaseServiceKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(shiprocketRequest),
            });

            if (shiprocketResponse.ok) {
              const shiprocketResult = await shiprocketResponse.json();
              
              if (shiprocketResult.success) {
                // Update order with Shiprocket details
                await supabase
                  .from("orders")
                  .update({
                    shiprocket_order_id: shiprocketResult.order_id || order_id,
                    shiprocket_shipment_id: shiprocketResult.shipment_id || "",
                    shiprocket_awb: shiprocketResult.awb || "",
                    shiprocket_courier_name: shiprocketResult.courier_name || "",
                    shiprocket_courier_id: shiprocketResult.courier_id || "",
                    shiprocket_status: shiprocketResult.awb ? "created" : "pending",
                    updated_at: new Date().toISOString(),
                  })
                  .eq("cashfree_order_id", order_id);

                console.log(`Shiprocket order created successfully. AWB: ${shiprocketResult.awb || "pending"}`);
              } else {
                console.error("Shiprocket order creation failed:", shiprocketResult.error);

                // Log error to order_errors table
                await supabase.from("order_errors").insert({
                  order_id: resolvedOrderData.id,
                  cashfree_order_id: order_id,
                  error_type: "shipment_failed",
                  error_message: shiprocketResult.error || "Shiprocket order creation failed",
                  error_details: {
                    shiprocket_response: shiprocketResult,
                    request_data: shiprocketRequest,
                  },
                  error_source: "cashfree-webhook",
                });

                // Update status to indicate failure (but don't fail the webhook)
                await supabase
                  .from("orders")
                  .update({
                    shiprocket_status: "failed",
                    notes: `Shiprocket error: ${shiprocketResult.error}`,
                    updated_at: new Date().toISOString(),
                  })
                  .eq("cashfree_order_id", order_id);
              }
            } else {
              const errorText = await shiprocketResponse.text();
              console.error("Shiprocket API call failed:", errorText);

              // Log error to order_errors table for tracking
              await supabase.from("order_errors").insert({
                order_id: resolvedOrderData.id,
                cashfree_order_id: order_id,
                error_type: "shipment_failed",
                error_message: "Shiprocket API call failed",
                error_details: {
                  response_status: shiprocketResponse.status,
                  response_body: errorText,
                  request_data: shiprocketRequest,
                },
                error_source: "cashfree-webhook",
              });

              // Update status to indicate failure (but don't fail the webhook)
              await supabase
                .from("orders")
                .update({
                  shiprocket_status: "failed",
                  notes: `Shiprocket API error: ${shiprocketResponse.status}`,
                  updated_at: new Date().toISOString(),
                })
                .eq("cashfree_order_id", order_id);
            }
          } catch (shiprocketError) {
            console.error("Error creating Shiprocket order:", shiprocketError);

            // Log error to order_errors table for tracking
            await supabase.from("order_errors").insert({
              order_id: resolvedOrderData.id,
              cashfree_order_id: order_id,
              error_type: "shipment_failed",
              error_message: shiprocketError instanceof Error ? shiprocketError.message : "Unknown error creating Shiprocket order",
              error_details: {
                error: shiprocketError,
                request_data: shiprocketRequest,
                stack: shiprocketError instanceof Error ? shiprocketError.stack : undefined,
              },
              error_source: "cashfree-webhook",
            });

            // Don't fail the webhook if Shiprocket creation fails
            // The order can be manually processed later
            await supabase
              .from("orders")
              .update({
                shiprocket_status: "failed",
                notes: `Shiprocket creation error: ${shiprocketError instanceof Error ? shiprocketError.message : "Unknown error"}`,
                updated_at: new Date().toISOString(),
              })
              .eq("cashfree_order_id", order_id);
          }
        } else if (orderData?.shiprocket_awb) {
          console.log(`Shiprocket order already exists for ${order_id}. AWB: ${orderData.shiprocket_awb}`);
        }

        // Send order confirmation notification
        try {
          const notificationUrl = `${supabaseUrl}/functions/v1/send-notification`;
          const notificationResponse = await fetch(notificationUrl, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${supabaseServiceKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              type: resolvedOrderData?.shiprocket_awb ? "shipment_created" : "order_confirmation",
              order_id: order_id,
              customer_email: resolvedOrderData?.customer_email || customer_details?.customer_email,
              customer_name: resolvedOrderData?.customer_name || customer_details?.customer_name,
              customer_phone: resolvedOrderData?.customer_phone || customer_details?.customer_phone,
              order_amount: resolvedOrderData?.order_amount,
              order_items: resolvedOrderData?.items,
              awb: resolvedOrderData?.shiprocket_awb,
              courier_name: resolvedOrderData?.shiprocket_courier_name,
            }),
          });

          if (notificationResponse.ok) {
            console.log("Order confirmation notification sent successfully");
          } else {
            console.warn("Failed to send notification:", await notificationResponse.text());
          }
        } catch (notificationError) {
          console.error("Error sending notification:", notificationError);
          // Don't fail webhook if notification fails
        }

        // Mark webhook as processed
        await supabase
          .from("webhooks")
          .update({ processed: true })
          .eq("order_id", order_id)
          .eq("event_type", eventType || order_status);

        // TODO: Add additional logic here:
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
      .eq("event_type", eventType || order_status);

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





