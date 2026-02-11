// Supabase Edge Function: Send Customer Notifications
// Sends email (and optionally SMS) notifications for order updates
// Triggered by webhooks (Cashfree payment, Shiprocket shipment status)

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

/**
 * Notification types supported:
 * - order_confirmation: Payment successful, order confirmed
 * - shipment_created: Shiprocket order created, AWB assigned
 * - shipment_dispatched: Shipment picked up and dispatched
 * - out_for_delivery: Shipment out for delivery
 * - delivered: Order delivered successfully
 * - delivery_failed: Failed delivery attempt
 */

interface NotificationRequest {
  type: string; // Notification type
  order_id: string; // Cashfree order ID
  customer_email: string;
  customer_name?: string;
  customer_phone?: string;
  // Order details
  order_amount?: number;
  order_items?: any[];
  // Shipment details
  awb?: string;
  courier_name?: string;
  etd?: string; // Estimated time of delivery
  tracking_url?: string;
  // Status
  status?: string;
}

/**
 * Generate email subject based on notification type
 */
function getEmailSubject(type: string, orderSnippet: string): string {
  const subjects: Record<string, string> = {
    order_confirmation: `Order Confirmed - ${orderSnippet} - Aromé Luxe`,
    shipment_created: `Your Order Has Been Shipped - ${orderSnippet}`,
    shipment_dispatched: `Your Order Is On The Way - ${orderSnippet}`,
    out_for_delivery: `Your Order Will Be Delivered Today - ${orderSnippet}`,
    delivered: `Order Delivered - ${orderSnippet} - Aromé Luxe`,
    delivery_failed: `Delivery Update Required - ${orderSnippet}`,
  };

  return subjects[type] || `Order Update - ${orderSnippet} - Aromé Luxe`;
}

/**
 * Generate email body based on notification type
 */
function getEmailBody(request: NotificationRequest): string {
  const {
    type,
    order_id,
    customer_name,
    order_amount,
    order_items,
    awb,
    courier_name,
    etd,
    tracking_url,
  } = request;

  const customerGreeting = customer_name ? `Dear ${customer_name}` : "Dear Customer";
  const appUrl = Deno.env.get("APP_URL") || "https://aromeluxe.in";
  const orderUrl = `${appUrl}/orders?order_id=${order_id}`;
  const trackingLink = tracking_url || (awb ? `${appUrl}/orders?awb=${awb}` : orderUrl);

  // Common footer
  const footer = `
<br><br>
<p style="color: #666; font-size: 14px;">
  Need help? Contact us at <a href="mailto:support@aromeluxe.in">support@aromeluxe.in</a>
</p>
<p style="color: #666; font-size: 12px;">
  <strong>Aromé Luxe</strong><br>
  Luxury Perfumes & Fragrances<br>
  <a href="${appUrl}">${appUrl}</a>
</p>
`;

  switch (type) {
    case "order_confirmation":
      return `
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2 style="color: #2c3e50;">🎉 Order Confirmed!</h2>
    <p>${customerGreeting},</p>
    <p>Thank you for your order! We've received your payment and your order is being processed.</p>

    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 5px 0;"><strong>Order ID:</strong> ${order_id}</p>
      ${order_amount ? `<p style="margin: 5px 0;"><strong>Amount Paid:</strong> ₹${order_amount}</p>` : ""}
    </div>

    <p><strong>What's Next?</strong></p>
    <ul>
      <li>Your order will be packed and shipped within 1-2 business days</li>
      <li>You'll receive tracking details once shipped</li>
      <li>Expected delivery in 3-5 business days</li>
    </ul>

    <p style="text-align: center; margin: 30px 0;">
      <a href="${orderUrl}" style="background: #3498db; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
        View Order Details
      </a>
    </p>

    ${footer}
  </div>
</body>
</html>
`;

    case "shipment_created":
    case "shipment_dispatched":
      return `
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2 style="color: #27ae60;">📦 Your Order Has Been Shipped!</h2>
    <p>${customerGreeting},</p>
    <p>Great news! Your order has been dispatched and is on its way to you.</p>

    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 5px 0;"><strong>Order ID:</strong> ${order_id}</p>
      ${awb ? `<p style="margin: 5px 0;"><strong>Tracking Number (AWB):</strong> ${awb}</p>` : ""}
      ${courier_name ? `<p style="margin: 5px 0;"><strong>Courier Partner:</strong> ${courier_name}</p>` : ""}
      ${etd ? `<p style="margin: 5px 0;"><strong>Estimated Delivery:</strong> ${etd}</p>` : ""}
    </div>

    <p style="text-align: center; margin: 30px 0;">
      <a href="${trackingLink}" style="background: #27ae60; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
        Track Your Order
      </a>
    </p>

    ${footer}
  </div>
</body>
</html>
`;

    case "out_for_delivery":
      return `
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2 style="color: #f39c12;">🚚 Out For Delivery Today!</h2>
    <p>${customerGreeting},</p>
    <p>Exciting! Your order is out for delivery and will reach you today.</p>

    <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f39c12;">
      <p style="margin: 5px 0;"><strong>Order ID:</strong> ${order_id}</p>
      ${awb ? `<p style="margin: 5px 0;"><strong>Tracking Number:</strong> ${awb}</p>` : ""}
      ${courier_name ? `<p style="margin: 5px 0;"><strong>Courier:</strong> ${courier_name}</p>` : ""}
      <p style="margin: 5px 0; color: #856404;"><strong>Please be available to receive your order.</strong></p>
    </div>

    <p style="text-align: center; margin: 30px 0;">
      <a href="${trackingLink}" style="background: #f39c12; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
        Track Live Location
      </a>
    </p>

    ${footer}
  </div>
</body>
</html>
`;

    case "delivered":
      return `
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2 style="color: #27ae60;">✅ Order Delivered Successfully!</h2>
    <p>${customerGreeting},</p>
    <p>Your order has been delivered! We hope you love your new fragrances from Aromé Luxe.</p>

    <div style="background: #d4edda; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #27ae60;">
      <p style="margin: 5px 0;"><strong>Order ID:</strong> ${order_id}</p>
      ${awb ? `<p style="margin: 5px 0;"><strong>Tracking Number:</strong> ${awb}</p>` : ""}
      <p style="margin: 5px 0; color: #155724;"><strong>Status:</strong> Delivered ✓</p>
    </div>

    <p><strong>We'd love your feedback!</strong></p>
    <p>How was your experience? Your review helps us improve and helps other customers make informed choices.</p>

    <p style="text-align: center; margin: 30px 0;">
      <a href="${orderUrl}" style="background: #27ae60; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
        Leave a Review
      </a>
    </p>

    ${footer}
  </div>
</body>
</html>
`;

    case "delivery_failed":
      return `
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2 style="color: #e74c3c;">⚠️ Delivery Attempt Failed</h2>
    <p>${customerGreeting},</p>
    <p>Our delivery partner attempted to deliver your order but was unable to complete the delivery.</p>

    <div style="background: #f8d7da; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #e74c3c;">
      <p style="margin: 5px 0;"><strong>Order ID:</strong> ${order_id}</p>
      ${awb ? `<p style="margin: 5px 0;"><strong>Tracking Number:</strong> ${awb}</p>` : ""}
      <p style="margin: 5px 0; color: #721c24;"><strong>Action Required:</strong> Please contact our support team to reschedule delivery.</p>
    </div>

    <p><strong>What You Can Do:</strong></p>
    <ul>
      <li>Contact our support team at <a href="mailto:support@aromeluxe.in">support@aromeluxe.in</a></li>
      <li>Provide your tracking number for quick assistance</li>
      <li>We'll arrange for re-delivery at your convenience</li>
    </ul>

    <p style="text-align: center; margin: 30px 0;">
      <a href="${trackingLink}" style="background: #e74c3c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
        View Delivery Status
      </a>
    </p>

    ${footer}
  </div>
</body>
</html>
`;

    default:
      return `
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2 style="color: #3498db;">Order Update</h2>
    <p>${customerGreeting},</p>
    <p>There's an update on your order.</p>

    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 5px 0;"><strong>Order ID:</strong> ${order_id}</p>
    </div>

    <p style="text-align: center; margin: 30px 0;">
      <a href="${orderUrl}" style="background: #3498db; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
        View Order Details
      </a>
    </p>

    ${footer}
  </div>
</body>
</html>
`;
  }
}

/**
 * Send email via Supabase (configured with Hostinger SMTP)
 */
async function sendEmail(
  supabase: any,
  to: string,
  subject: string,
  html: string
): Promise<boolean> {
  try {
    // Use Supabase's built-in email function (if configured)
    // Or use an external email service like Resend, SendGrid, etc.

    // For now, log the email (replace with actual email sending)
    console.log("Sending email:", {
      to,
      subject,
      bodyLength: html.length,
    });

    // TODO: Implement actual email sending
    // Option 1: Use Supabase Auth's email sending (if configured with SMTP)
    // Option 2: Use Resend API
    /*
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Aromé Luxe <orders@aromeluxe.in>",
        to: [to],
        subject: subject,
        html: html,
      }),
    });
    */

    // Option 3: Use Hostinger SMTP directly via nodemailer equivalent
    // For now, return true as placeholder
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

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

    // Parse request
    const request: NotificationRequest = await req.json();

    console.log("Notification request received:", {
      type: request.type,
      order_id: request.order_id,
      customer_email: request.customer_email,
    });

    // Validate required fields
    if (!request.type || !request.order_id || !request.customer_email) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: type, order_id, customer_email" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Generate email content
    const orderSnippet = request.order_id.substring(0, 8).toUpperCase();
    const subject = getEmailSubject(request.type, orderSnippet);
    const body = getEmailBody(request);

    // Send email
    const emailSent = await sendEmail(
      supabase,
      request.customer_email,
      subject,
      body
    );

    if (!emailSent) {
      console.warn("Email sending failed but continuing...");
    }

    // TODO: Send SMS notification if phone number provided
    if (request.customer_phone && shouldSendSMS(request.type)) {
      console.log("SMS notification would be sent to:", request.customer_phone);
      // Implement SMS sending via Twilio, MSG91, etc.
    }

    // Return success
    return new Response(
      JSON.stringify({
        success: true,
        message: "Notification sent successfully",
        email_sent: emailSent,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Notification error:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to send notification",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

/**
 * Determine if SMS should be sent for this notification type
 */
function shouldSendSMS(type: string): boolean {
  const smsTypes = ["out_for_delivery", "delivered", "delivery_failed"];
  return smsTypes.includes(type);
}
