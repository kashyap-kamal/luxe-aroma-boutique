import { NextRequest, NextResponse } from 'next/server';
import ky from 'ky';

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

    // Validate Supabase configuration
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: 'Supabase configuration is missing' },
        { status: 500 }
      );
    }

    // Call Supabase Edge Function to check pincode serviceability
    // Delhivery API keys are securely stored in Supabase secrets
    const result = await ky
      .post(
        `${supabaseUrl}/functions/v1/check-delhivery-pincode`,
        {
          headers: {
            Authorization: `Bearer ${supabaseAnonKey}`,
            "Content-Type": "application/json",
          },
          json: {
            pincode,
            weight: weight || 0.5,
            cod: cod || false,
          },
        }
      )
      .json();

    return NextResponse.json(result);
  } catch (error) {
    console.error('Pincode check API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
