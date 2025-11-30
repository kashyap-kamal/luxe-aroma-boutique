import { NextRequest, NextResponse } from 'next/server';
import ky from 'ky';

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

    // Validate Supabase configuration
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: 'Supabase configuration is missing' },
        { status: 500 }
      );
    }

    // Call Supabase Edge Function to track order
    // Delhivery API keys are securely stored in Supabase secrets
    try {
      const result = await ky
        .post(
          `${supabaseUrl}/functions/v1/track-delhivery-order`,
          {
            headers: {
              Authorization: `Bearer ${supabaseAnonKey}`,
              "Content-Type": "application/json",
            },
            json: {
              waybill,
            },
          }
        )
        .json();

      return NextResponse.json(result);
    } catch (kyError: unknown) {
      // Handle ky errors - extract response body if available
      const error = kyError as { response?: { status?: number; statusText?: string; json?: () => Promise<unknown>; text?: () => Promise<string> } };
      
      console.error('Track order Edge Function error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: `${supabaseUrl}/functions/v1/track-delhivery-order`,
      });
      
      if (error.response) {
        try {
          const errorBody = error.response.json ? await error.response.json() : { error: 'Unknown error' };
          console.error('Edge Function error body:', errorBody);
          return NextResponse.json(
            { 
              error: (errorBody as { error?: string }).error || 'Failed to track order',
              details: errorBody,
              status: error.response.status
            },
            { status: error.response.status || 500 }
          );
        } catch {
          // If we can't parse JSON, return text error
          const errorText = error.response.text ? await error.response.text().catch(() => 'Unknown error') : 'Unknown error';
          return NextResponse.json(
            { 
              error: 'Failed to track order',
              details: errorText,
              status: error.response.status
            },
            { status: error.response.status || 500 }
          );
        }
      }
      throw kyError; // Re-throw if not a ky error
    }
  } catch (error) {
    console.error('Track order API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
