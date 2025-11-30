import { nanoid } from "nanoid";

export const runtime = "nodejs";

/**
 * Cashfree Checkout API Route
 * Creates a Cashfree order with One Click Checkout enabled
 * Uses Supabase for secure API key storage
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
        error: "Payment service not configured. Please set CASHFREE_CLIENT_ID and CASHFREE_SECRET_KEY environment variables.",
      }),
      {
      status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
  const body = await request.json();
    const {
      amount,
      customerInfo,
      cartItems,
      returnUrl,
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
    } = body;

    // Validate input
    if (Number.isNaN(amount) || amount <= 0) {
      return new Response(
        JSON.stringify({ error: "Amount value is not a valid number" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (!customerInfo?.email || !customerInfo?.name || !customerInfo?.contact) {
      return new Response(
        JSON.stringify({ error: "Customer information is incomplete" }),
        {
      status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
  }

    // Generate unique customer ID and order ID
    const customerId = `CUST_${nanoid(8)}`;
    const orderId = `ORDER_${Date.now()}_${nanoid(6)}`;

    // Convert amount to paise (smallest currency unit)
    const orderAmount = Math.round(amount * 100);

    // Prepare cart items for Cashfree
    const cashfreeCartItems = cartItems.map((item, index) => ({
      item_id: item.productId || `item_${index}`,
      item_name: item.productName,
      item_description: `Product: ${item.productName}`,
      item_details_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/products/${item.productId}`,
      item_image_url: item.imageUrl || "",
      item_original_unit_price: Math.round(item.price * 100), // Convert to paise
      item_discounted_unit_price: Math.round(item.price * 100), // Same as original for now
      item_quantity: item.quantity,
      item_currency: "INR",
    }));

    // Prepare order request for Cashfree
    const orderRequest = {
      order_amount: orderAmount,
      order_currency: "INR",
      customer_details: {
        customer_id: customerId,
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.contact,
      },
      order_meta: {
        return_url: returnUrl.replace("{order_id}", orderId),
        notify_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/webhook/cashfree`,
      },
      products: {
        one_click_checkout: {
          enabled: true,
          conditions: [
            {
              action: "ALLOW",
              values: ["checkoutCollectAddress", "checkoutAuthenticate"],
              key: "features",
            },
          ],
        },
      },
      cart_details: {
        cart_items: cashfreeCartItems,
      },
    };

    // Call Cashfree API to create order
    const cashfreeResponse = await fetch(`${CASHFREE_API_URL}/pg/orders`, {
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
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const orderData = await cashfreeResponse.json();

    // Return order response with payment session ID
    return new Response(
      JSON.stringify({
        order_id: orderData.order_id || orderId,
        order_token: orderData.order_token,
        payment_session_id: orderData.payment_session_id,
        order_amount: orderData.order_amount,
        order_currency: orderData.order_currency || "INR",
        order_status: orderData.order_status,
        payment_session_id_expiry: orderData.payment_session_id_expiry,
      }),
      {
    status: 200,
    headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Checkout API error:", error);
    return new Response(
      JSON.stringify({
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
