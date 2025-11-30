import { nanoid } from "nanoid";

export const runtime = "nodejs";

/**
 * Cashfree Payment Verification API Route
 * Verifies payment status with Cashfree
 */

// Cashfree API configuration
const CASHFREE_API_URL =
  process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT === "production"
    ? "https://api.cashfree.com"
    : "https://sandbox.cashfree.com";

const CASHFREE_CLIENT_ID = process.env.CASHFREE_CLIENT_ID || "";
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY || "";

export async function POST(request: Request) {
  // Check if Cashfree credentials are properly configured
  if (!CASHFREE_CLIENT_ID || !CASHFREE_SECRET_KEY) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Payment service not configured.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const body = await request.json();
    const { orderId }: { orderId: string } = body;

    if (!orderId) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Order ID is required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Call Cashfree API to get order details
    const cashfreeResponse = await fetch(
      `${CASHFREE_API_URL}/pg/orders/${orderId}`,
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
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const orderData = await cashfreeResponse.json();

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
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Payment verification error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}





