import { NextRequest, NextResponse } from 'next/server';
import ky from 'ky';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerInfo,
      orderItems,
      totalAmount,
      paymentMode,
      cashfreeOrderId,
    } = body;

    // Validate required fields
    if (!customerInfo || !orderItems || !totalAmount || !paymentMode) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate Supabase configuration
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: 'Supabase configuration is missing' },
        { status: 500 }
      );
    }

    // Calculate total weight (assuming each product weighs 0.5kg)
    const totalWeight = orderItems.reduce((sum: number, item: { quantity: number }) => {
      return sum + (item.quantity * 0.5);
    }, 0);

    // Prepare order description
    const productsDesc = orderItems
      .map((item: { name: string; quantity: number }) => `${item.name} (Qty: ${item.quantity})`)
      .join(', ');

    // Call Supabase Edge Function to create Delhivery order
    // Delhivery API keys are securely stored in Supabase secrets
    const delhiveryOrder = await ky
      .post(
        `${supabaseUrl}/functions/v1/create-delhivery-order`,
        {
          headers: {
            Authorization: `Bearer ${supabaseAnonKey}`,
            "Content-Type": "application/json",
          },
          json: {
            name: `${customerInfo.firstName} ${customerInfo.lastName}`,
            add: customerInfo.address,
            phone: customerInfo.phone,
            pin: customerInfo.postalCode,
            city: customerInfo.city,
            state: customerInfo.state,
            country: customerInfo.country || 'India',
            order: cashfreeOrderId || `ORD-${Date.now()}`,
            payment_mode: paymentMode === 'cod' ? 'COD' : 'Prepaid',
            products_desc: productsDesc,
            cod_amount: paymentMode === 'cod' ? totalAmount : undefined,
            total_amount: totalAmount,
            seller_inv: `INV-${Date.now()}`,
            quantity: orderItems.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0),
            weight: totalWeight,
            address_type: 'home',
            shipping_mode: 'Surface',
            fragile_shipment: false,
            dangerous_good: false,
            plastic_packaging: false,
          },
        }
      )
      .json<{ success: boolean; order_id?: string; waybill?: string; error?: string }>();

    if (delhiveryOrder.success) {
      return NextResponse.json({
        success: true,
        delhiveryOrderId: delhiveryOrder.order_id,
        waybill: delhiveryOrder.waybill,
        message: 'Order created successfully with Delhivery',
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: delhiveryOrder.error || 'Failed to create Delhivery order',
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Create Delhivery order API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
