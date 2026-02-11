// Supabase Edge Function: Shiprocket Webhook Handler
// Receives real-time shipment status updates from Shiprocket
// Updates order status in database and triggers customer notifications

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-api-key",
};

/**
 * Shiprocket Webhook Event Types:
 * - ORDER_PICKUP_SCHEDULED - Shiprocket has scheduled pickup from seller
 * - ORDER_PLACED - Order placed with courier
 * - ORDER_PICKUP_DONE - Courier picked up the shipment
 * - ORDER_DISPATCHED - Shipment dispatched from origin facility
 * - IN_TRANSIT - Shipment in transit
 * - OUT_FOR_DELIVERY - Shipment out for delivery
 * - DELIVERED - Successfully delivered to customer
 * - RTO - Return to origin (failed delivery)
 * - CANCELLED - Order cancelled
 */

/**
 * Map Shiprocket event types to our internal status values
 */
function mapShiprocketStatus(eventType: string): string {
  const statusMap: Record<string, string> = {
    ORDER_PICKUP_SCHEDULED: "pickup_scheduled",
    ORDER_PLACED: "placed",
    ORDER_PICKUP_DONE: "picked_up",
    ORDER_DISPATCHED: "dispatched",
    IN_TRANSIT: "in_transit",
    OUT_FOR_DELIVERY: "out_for_delivery",
    DELIVERED: "delivered",
    RTO: "rto",
    CANCELLED: "cancelled",
  };

  return statusMap[eventType] || eventType.toLowerCase();
}

/**
 * Determine if we should send customer notification for this status
 */
function shouldNotifyCustomer(status: string): boolean {
  const notifyStatuses = [
    "picked_up",
    "dispatched",
    "out_for_delivery",
    "delivered",
    "rto",
  ];
  return notifyStatuses.includes(status);
}

/**
 * Verify Shiprocket webhook authenticity
 * Note: Shiprocket doesn't use HMAC signatures like Cashfree
 * Instead, verify by checking the request origin and structure
 * You can also whitelist Shiprocket's IP addresses in production
 */
function isValidShiprocketWebhook(payload: any): boolean {
  // Check for required Shiprocket webhook fields
  const hasRequiredFields =
    payload &&
    typeof payload === "object" &&
    (payload.order_id || payload.awb) &&
    payload.current_status;

  return hasRequiredFields;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Handle GET requests (Shiprocket uses GET to validate the webhook URL)
  if (req.method === "GET") {
    return new Response(
      JSON.stringify({ status: true, message: "Webhook endpoint active" }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  // Only accept POST for actual webhook events
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ status: true, message: "Method not allowed" }),
      {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  try {
    // Verify Shiprocket webhook token from x-api-key header
    const shiprocketWebhookToken = Deno.env.get("SHIPROCKET_WEBHOOK_TOKEN");
    const apiKey = req.headers.get("x-api-key");

    if (shiprocketWebhookToken && apiKey !== shiprocketWebhookToken) {
      console.error("Invalid Shiprocket webhook token");
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Parse webhook payload
    const bodyText = await req.text();

    // Handle empty body (Shiprocket validation/test ping)
    if (!bodyText || bodyText.trim() === "" || bodyText.trim() === "{}") {
      console.log("Shiprocket webhook validation ping received");
      return new Response(
        JSON.stringify({ status: true, message: "Webhook endpoint active" }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    let payload: any;
    try {
      payload = JSON.parse(bodyText);
    } catch {
      console.log("Non-JSON body received, treating as test ping");
      return new Response(
        JSON.stringify({ status: true, message: "Webhook endpoint active" }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Handle test/empty payloads from Shiprocket's webhook verification
    if (!payload || Object.keys(payload).length === 0 || payload.test) {
      console.log("Shiprocket webhook test/validation request received");
      return new Response(
        JSON.stringify({ status: true, message: "Webhook endpoint active" }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Initialize Supabase client with service role key for full access
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log("Shiprocket webhook received:", {
      order_id: payload.order_id,
      awb: payload.awb,
      status: payload.current_status,
      event_type: payload.event_type,
    });

    // Validate webhook authenticity
    if (!isValidShiprocketWebhook(payload)) {
      console.error("Invalid Shiprocket webhook payload - missing required fields");
      return new Response(
        JSON.stringify({ error: "Invalid webhook payload" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Extract webhook data
    const {
      order_id,
      awb,
      shipment_id,
      current_status,
      event_type,
      courier_name,
      courier_company_id,
      pickup_date,
      delivered_date,
      rto_delivered_date,
      etd, // Estimated time of delivery
      tracking_data,
    } = payload;

    // Store webhook event for audit trail
    const { error: webhookError } = await supabase
      .from("webhooks")
      .insert({
        order_id: order_id || awb || "unknown",
        event_type: event_type || current_status,
        payload: payload,
        processed: false,
      });

    if (webhookError) {
      console.error("Error storing Shiprocket webhook:", webhookError);
      // Continue processing even if webhook storage fails
    }

    // Map Shiprocket status to our internal status
    const internalStatus = mapShiprocketStatus(event_type || current_status);

    console.log(`Shiprocket status update: ${current_status} -> ${internalStatus}`);

    // Find the order by AWB or Shiprocket order_id
    let orderQuery = supabase.from("orders").select("*");

    if (awb) {
      orderQuery = orderQuery.eq("shiprocket_awb", awb);
    } else if (order_id) {
      orderQuery = orderQuery.eq("shiprocket_order_id", order_id);
    } else {
      console.error("Webhook missing both AWB and order_id");
      return new Response(
        JSON.stringify({ error: "Missing order identifier" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { data: orders, error: fetchError } = await orderQuery;

    if (fetchError) {
      console.error("Error fetching order:", fetchError);
      throw new Error(`Database error: ${fetchError.message}`);
    }

    if (!orders || orders.length === 0) {
      console.warn(`Order not found for AWB: ${awb} or order_id: ${order_id}`);
      // Return success to avoid Shiprocket retrying
      return new Response(
        JSON.stringify({
          success: true,
          message: "Order not found but acknowledged"
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const order = orders[0];
    const cashfreeOrderId = order.cashfree_order_id;

    console.log(`Updating order ${cashfreeOrderId} with Shiprocket status: ${internalStatus}`);

    // Prepare update data
    const updateData: any = {
      shiprocket_status: internalStatus,
      updated_at: new Date().toISOString(),
    };

    // Update additional fields based on status
    switch (internalStatus) {
      case "delivered":
        updateData.order_status = "DELIVERED";
        if (delivered_date) {
          updateData.delivered_at = delivered_date;
        }
        break;

      case "rto":
        updateData.order_status = "RTO";
        if (rto_delivered_date) {
          updateData.rto_delivered_at = rto_delivered_date;
        }
        break;

      case "cancelled":
        updateData.order_status = "CANCELLED";
        break;

      case "dispatched":
        updateData.order_status = "SHIPPED";
        break;
    }

    // Update Shiprocket details if provided
    if (courier_name && !order.shiprocket_courier_name) {
      updateData.shiprocket_courier_name = courier_name;
    }
    if (courier_company_id && !order.shiprocket_courier_id) {
      updateData.shiprocket_courier_id = String(courier_company_id);
    }
    if (shipment_id && !order.shiprocket_shipment_id) {
      updateData.shiprocket_shipment_id = String(shipment_id);
    }

    // Update order in database
    const { error: updateError } = await supabase
      .from("orders")
      .update(updateData)
      .eq("id", order.id);

    if (updateError) {
      console.error("Error updating order:", updateError);
      throw new Error(`Failed to update order: ${updateError.message}`);
    }

    console.log(`Order ${cashfreeOrderId} updated successfully with status: ${internalStatus}`);

    // Mark webhook as processed
    await supabase
      .from("webhooks")
      .update({ processed: true })
      .eq("order_id", order_id || awb || "unknown")
      .eq("event_type", event_type || current_status);

    // Send customer notification for important status updates
    if (shouldNotifyCustomer(internalStatus)) {
      console.log(`Sending customer notification for status: ${internalStatus}`);

      try {
        // Map internal status to notification type
        let notificationType = "shipment_status_update";
        switch (internalStatus) {
          case "picked_up":
          case "dispatched":
            notificationType = "shipment_dispatched";
            break;
          case "out_for_delivery":
            notificationType = "out_for_delivery";
            break;
          case "delivered":
            notificationType = "delivered";
            break;
          case "rto":
            notificationType = "delivery_failed";
            break;
        }

        const notificationResponse = await fetch(`${supabaseUrl}/functions/v1/send-notification`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${supabaseServiceKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: notificationType,
            order_id: cashfreeOrderId,
            customer_email: order.customer_email,
            customer_name: order.customer_name,
            customer_phone: order.customer_phone,
            awb: awb,
            courier_name: courier_name || order.shiprocket_courier_name,
            etd: etd,
            status: internalStatus,
          }),
        });

        if (notificationResponse.ok) {
          console.log(`Notification sent successfully for ${internalStatus}`);
        } else {
          console.warn("Failed to send notification:", await notificationResponse.text());
        }
      } catch (notificationError) {
        console.error("Failed to send notification:", notificationError);
        // Don't fail webhook processing if notification fails
      }
    }

    // Return success response to Shiprocket
    return new Response(
      JSON.stringify({
        success: true,
        message: "Webhook processed successfully",
        order_id: cashfreeOrderId,
        status: internalStatus,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Shiprocket webhook error:", error);

    // Return 500 but don't expose internal error details
    return new Response(
      JSON.stringify({
        error: "Webhook processing failed",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
