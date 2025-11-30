// Supabase Edge Function: Create Delhivery Order
// Securely creates shipping orders with Delhivery
// API keys are stored in Supabase secrets

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

interface CreateOrderRequest {
  name: string;
  add: string;
  phone: string;
  pin: string;
  city: string;
  state: string;
  country: string;
  order: string;
  payment_mode: "COD" | "Prepaid" | "Pickup" | "REPL";
  products_desc?: string;
  cod_amount?: number;
  total_amount?: number;
  seller_add?: string;
  seller_name?: string;
  seller_inv?: string;
  quantity?: number;
  weight?: number;
  address_type?: string;
  shipping_mode?: string;
  fragile_shipment?: boolean;
  shipment_height?: number;
  shipment_width?: number;
  shipment_length?: number;
  dangerous_good?: boolean;
  plastic_packaging?: boolean;
  hsn_code?: string;
  return_name?: string;
  return_address?: string;
  return_city?: string;
  return_phone?: string;
  return_state?: string;
  return_country?: string;
  return_pin?: string;
  waybill?: string;
}

interface CreateOrderResponse {
  success: boolean;
  order_id?: string;
  waybill?: string;
  error?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get Delhivery API credentials from environment variables (Supabase secrets)
    const DELHIVERY_API_KEY = Deno.env.get("DELHIVERY_API_KEY");
    const DELHIVERY_BASE_URL = Deno.env.get("DELHIVERY_BASE_URL") || "https://staging-express.delhivery.com";
    const DELHIVERY_PICKUP_LOCATION = Deno.env.get("DELHIVERY_PICKUP_LOCATION");
    const SELLER_NAME = Deno.env.get("SELLER_NAME") || "Aromé Luxe";
    const SELLER_ADDRESS = Deno.env.get("SELLER_ADDRESS") || "";

    if (!DELHIVERY_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Delhivery API key not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!DELHIVERY_PICKUP_LOCATION) {
      return new Response(
        JSON.stringify({ error: "Delhivery pickup location not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Parse request body
    const request: CreateOrderRequest = await req.json();

    // Validate required fields
    if (!request.name || !request.add || !request.phone || !request.pin || !request.city || !request.state || !request.country || !request.order || !request.payment_mode) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Prepare the shipment data according to Delhivery API specification
    const shipmentData = {
      name: request.name,
      add: request.add,
      pin: request.pin,
      city: request.city,
      state: request.state,
      country: request.country,
      phone: request.phone,
      order: request.order,
      payment_mode: request.payment_mode,
      return_pin: request.return_pin || "",
      return_city: request.return_city || "",
      return_phone: request.return_phone || "",
      return_add: request.return_address || "",
      return_state: request.return_state || "",
      return_country: request.return_country || "",
      products_desc: request.products_desc || "",
      hsn_code: request.hsn_code || "",
      cod_amount: request.cod_amount || "",
      order_date: null,
      total_amount: request.total_amount || "",
      seller_add: request.seller_add || SELLER_ADDRESS,
      seller_name: request.seller_name || SELLER_NAME,
      seller_inv: request.seller_inv || `INV-${Date.now()}`,
      quantity: request.quantity || "",
      waybill: request.waybill || "",
      shipment_width: request.shipment_width || "100",
      shipment_height: request.shipment_height || "100",
      weight: request.weight || "",
      shipping_mode: request.shipping_mode || "Surface",
      address_type: request.address_type || "",
      fragile_shipment: request.fragile_shipment || false,
      dangerous_good: request.dangerous_good || false,
      plastic_packaging: request.plastic_packaging || false,
    };

    // Prepare the request body in the format expected by Delhivery API
    const requestBody = {
      format: "json",
      data: JSON.stringify({
        shipments: [shipmentData],
        pickup_location: {
          name: DELHIVERY_PICKUP_LOCATION,
        },
      }),
    };

    // Call Delhivery API to create order
    const delhiveryUrl = `${DELHIVERY_BASE_URL}/api/cmu/create.json`;
    
    const formData = new URLSearchParams();
    formData.append("format", requestBody.format);
    formData.append("data", requestBody.data);

    const delhiveryResponse = await fetch(delhiveryUrl, {
      method: "POST",
      headers: {
        Authorization: `Token ${DELHIVERY_API_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    if (!delhiveryResponse.ok) {
      const errorText = await delhiveryResponse.text();
      console.error("Delhivery API error:", errorText);
      throw new Error(`Delhivery API error: ${delhiveryResponse.status}`);
    }

    const data = await delhiveryResponse.json();

    if (data.success) {
      // Extract waybill and order info from the response
      const shipment = data.shipments && data.shipments[0];
      const response: CreateOrderResponse = {
        success: true,
        order_id: shipment?.order || request.order,
        waybill: shipment?.waybill || shipment?.awb,
      };

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else {
      const response: CreateOrderResponse = {
        success: false,
        error: data.error || data.message || "Failed to create order",
      };

      return new Response(JSON.stringify(response), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Delhivery create order error:", error);
    const response: CreateOrderResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create order. Please try again.",
    };

    return new Response(JSON.stringify(response), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

