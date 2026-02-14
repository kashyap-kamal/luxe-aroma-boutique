// Supabase Edge Function: Create Shiprocket Order
// Creates shipping orders with Shiprocket and auto-assigns a courier
// Credentials are stored in Supabase secrets

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

// Shiprocket uses email/password auth to generate a bearer token
async function getShiprocketToken(): Promise<string> {
  const email = Deno.env.get("SHIPROCKET_EMAIL");
  const password = Deno.env.get("SHIPROCKET_PASSWORD");
  const baseUrl = Deno.env.get("SHIPROCKET_BASE_URL") || "https://apiv2.shiprocket.in/v1/external";

  if (!email || !password) {
    throw new Error("Shiprocket credentials not configured");
  }

  const response = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error(`Shiprocket auth failed: ${response.status}`);
  }

  const data = await response.json();
  return data.token;
}

interface CreateOrderRequest {
  // Customer details
  name: string;
  email?: string;
  phone: string;
  // Shipping address
  address: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
  // Order details
  order_id: string;
  payment_mode: "COD" | "Prepaid";
  products_desc?: string;
  cod_amount?: number;
  total_amount: number;
  quantity?: number;
  weight?: number;
  // Item details for Shiprocket
  items?: Array<{
    name: string;
    sku?: string;
    units: number;
    selling_price: number;
    hsn?: string;
  }>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const baseUrl = Deno.env.get("SHIPROCKET_BASE_URL") || "https://apiv2.shiprocket.in/v1/external";

    // Seller details from environment
    const sellerName = Deno.env.get("SELLER_NAME") || "Aromé Luxe";
    const sellerAddress = Deno.env.get("SELLER_ADDRESS") || "";
    const sellerCity = Deno.env.get("SELLER_CITY") || "";
    const sellerState = Deno.env.get("SELLER_STATE") || "";
    const sellerPincode = Deno.env.get("SELLER_PINCODE") || "";
    const sellerPhone = Deno.env.get("SELLER_PHONE") || "";

    // Parse request body
    const request: CreateOrderRequest = await req.json();

    // Validate required fields
    if (!request.name || !request.address || !request.phone || !request.pincode || !request.city || !request.state || !request.order_id || !request.payment_mode) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Normalize phone number: Shiprocket expects 10-digit Indian mobile number
    // Strip +91, 91, 0 prefixes
    let normalizedPhone = request.phone.replace(/\s+/g, "");
    if (normalizedPhone.startsWith("+91")) normalizedPhone = normalizedPhone.slice(3);
    else if (normalizedPhone.startsWith("91") && normalizedPhone.length > 10) normalizedPhone = normalizedPhone.slice(2);
    else if (normalizedPhone.startsWith("0")) normalizedPhone = normalizedPhone.slice(1);
    request.phone = normalizedPhone;

    // Validate total_amount
    if (!request.total_amount || isNaN(Number(request.total_amount)) || Number(request.total_amount) <= 0) {
      return new Response(
        JSON.stringify({ error: "Invalid total_amount" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Authenticate with Shiprocket
    const token = await getShiprocketToken();

    // Build order items for Shiprocket (required field)
    const orderItems = request.items && request.items.length > 0
      ? request.items
      : [
          {
            name: request.products_desc || "Products",
            sku: `SKU-${request.order_id}`,
            units: Number(request.quantity) || 1,
            selling_price: Number(request.total_amount),
            hsn: "",
          },
        ];

    // Prepare order payload for Shiprocket /orders/create/adhoc
    const orderPayload = {
      order_id: request.order_id,
      order_date: new Date().toISOString().split("T")[0], // YYYY-MM-DD format
      pickup_location: Deno.env.get("SHIPROCKET_PICKUP_LOCATION") || "Home",
      billing_customer_name: request.name.split(" ")[0] || request.name,
      billing_last_name: request.name.split(" ").slice(1).join(" ") || "",
      billing_address: request.address,
      billing_city: request.city,
      billing_pincode: request.pincode,
      billing_state: request.state,
      billing_country: request.country || "India",
      billing_email: request.email || "",
      billing_phone: request.phone,
      shipping_is_billing: true, // Use billing address as shipping address
      order_items: orderItems,
      payment_method: request.payment_mode === "COD" ? "COD" : "Prepaid",
      sub_total: Number(request.total_amount),
      length: 10, // Default package dimensions in cm
      breadth: 10,
      height: 10,
      weight: Number(request.weight) || 0.5, // Weight in kg
    };

    console.log("Creating Shiprocket order:", JSON.stringify(orderPayload));

    // Step 1: Create order on Shiprocket
    const createResponse = await fetch(`${baseUrl}/orders/create/adhoc`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderPayload),
    });

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.error("Shiprocket create order error:", errorText);
      throw new Error(`Shiprocket API error: ${createResponse.status} - ${errorText}`);
    }

    const createData = await createResponse.json();
    console.log("Shiprocket order response:", JSON.stringify(createData));

    // Shiprocket returns order_id at top level or inside nested response
    const shiprocketOrderId = createData.order_id || createData.id;
    const shipmentId = createData.shipment_id;

    if (!shiprocketOrderId) {
      console.error("Shiprocket response missing order_id. Full response:", JSON.stringify(createData));
      throw new Error(`Shiprocket did not return an order_id. Response: ${JSON.stringify(createData).substring(0, 200)}`);
    }

    // Step 2: Auto-assign courier using Shiprocket's recommendation
    let awbCode = null;
    let courierName = null;
    let courierId = null;

    if (shipmentId) {
      try {
        // Request AWB assignment (Shiprocket picks the best courier automatically)
        const awbResponse = await fetch(`${baseUrl}/courier/assign/awb`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ shipment_id: shipmentId }),
        });

        if (awbResponse.ok) {
          const awbData = await awbResponse.json();
          console.log("Shiprocket AWB assigned:", JSON.stringify(awbData));

          awbCode = awbData.response?.data?.awb_code || null;
          courierName = awbData.response?.data?.courier_name || null;
          courierId = awbData.response?.data?.courier_company_id || null;
        } else {
          const awbError = await awbResponse.text();
          console.warn("AWB assignment failed (order still created):", awbError);
        }
      } catch (awbError) {
        console.warn("AWB assignment error (order still created):", awbError);
      }
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        order_id: String(shiprocketOrderId),
        shipment_id: String(shipmentId || ""),
        awb: awbCode || "",
        courier_name: courierName || "",
        courier_id: courierId ? String(courierId) : "",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Shiprocket create order error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Failed to create order. Please try again.",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
