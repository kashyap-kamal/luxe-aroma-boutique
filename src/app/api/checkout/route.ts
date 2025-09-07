import { nanoid } from "nanoid";
import Razorpay from "razorpay";

export const runtime = "nodejs";

// Initialize Razorpay with environment variables
// Use placeholder values during build if env vars are not set
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "placeholder_secret",
});

export async function POST(request: Request) {
  // Check if Razorpay credentials are properly configured
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return new Response("Payment service not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables.", {
      status: 500,
    });
  }

  const body = await request.json();
  const { amount } = body;

  if (Number.isNaN(amount)) {
    return new Response("Amount value is not a valid number", {
      status: 400,
    });
  }

  const receiptId = nanoid();

  /// here got an error, that the value of amount should be integer
  // that is why adding Math.round() for now
  const order = await razorpay.orders.create({
    amount: Math.round(amount),
    currency: "INR",
    receipt: `${receiptId}_${Date.now()}`,
  });

  return new Response(JSON.stringify(order), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
