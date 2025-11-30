import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Cashfree Webhook Handler
 * Handles payment status updates from Cashfree
 * This endpoint receives webhook notifications when payment status changes
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Log webhook data for debugging
    console.log("Cashfree webhook received:", body);

    // Extract order and payment information from webhook
    const {
      order_id,
      order_amount,
      order_currency,
      order_status,
      payment_details,
      customer_details,
      shipping_address,
      billing_address,
    } = body;

    // Validate required fields
    if (!order_id || !order_status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Handle different order statuses
    switch (order_status) {
      case "PAID":
        // Payment successful - update order in database
        // TODO: Update order status in Supabase database
        console.log(`Order ${order_id} payment successful`);
        
        // Here you would typically:
        // 1. Update order status in Supabase
        // 2. Send confirmation email to customer
        // 3. Trigger fulfillment process
        
        break;

      case "ACTIVE":
        // Order created but payment pending
        console.log(`Order ${order_id} is active, payment pending`);
        break;

      case "EXPIRED":
        // Payment session expired
        console.log(`Order ${order_id} payment session expired`);
        break;

      default:
        console.log(`Order ${order_id} status: ${order_status}`);
    }

    // Store webhook data in Supabase (optional)
    // You can create a webhooks table in Supabase to log all webhook events
    // This helps with debugging and audit trails

    // Return success response to Cashfree
    return NextResponse.json(
      { success: true, message: "Webhook processed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Cashfree webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

// Handle GET requests (for webhook verification)
export async function GET(request: NextRequest) {
  return NextResponse.json(
    { message: "Cashfree webhook endpoint is active" },
    { status: 200 }
  );
}





