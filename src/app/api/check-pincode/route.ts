import { NextRequest, NextResponse } from 'next/server';
import { delhiveryAPI } from '@/lib/delhivery-api';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pincode, weight, cod } = body;

    // Validate required fields
    if (!pincode) {
      return NextResponse.json(
        { error: 'Pincode is required' },
        { status: 400 }
      );
    }

    // Check pincode serviceability
    const result = await delhiveryAPI.checkPincodeServiceability({
      pincode,
      weight: weight || 0.5,
      cod: cod || false,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Pincode check API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
