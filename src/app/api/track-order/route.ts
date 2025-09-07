import { NextRequest, NextResponse } from 'next/server';
import { delhiveryAPI } from '@/lib/delhivery-api';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { waybill } = body;

    // Validate required fields
    if (!waybill) {
      return NextResponse.json(
        { error: 'Waybill number is required' },
        { status: 400 }
      );
    }

    // Track order with Delhivery
    const result = await delhiveryAPI.trackOrder({ waybill });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Track order API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
