// Supabase Edge Function: Forgot Password
// Handles password reset email requests securely
// Validates email and sends reset link

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Main handler function
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body
    const { email }: { email: string } = await req.json();

    // Validate input
    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Generate password reset link
    const resetUrl = `${Deno.env.get("APP_URL") || "http://localhost:3000"}/auth/reset-password`;
    
    // Send password reset email using resetPasswordForEmail on the regular auth client
    // Note: resetPasswordForEmail is on supabase.auth, not supabase.auth.admin
    // This method handles non-existent users gracefully (won't send email if user doesn't exist)
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: resetUrl,
    });

    // Handle errors (but still return success for security - don't reveal if email exists)
    if (resetError) {
      console.error("Password reset error:", resetError);
      
      // Handle rate limit errors specifically
      if (resetError.message?.includes("rate limit") || 
          resetError.message?.includes("too many requests") ||
          resetError.status === 429) {
        // Still return generic success for security, but log the rate limit
        console.warn("Rate limit hit for password reset:", email);
      }
      // Continue - still return success for security (don't reveal if email exists)
    }

    // Always return success (security best practice - don't reveal if email exists)
    // The resetPasswordForEmail method on supabase.auth handles non-existent users gracefully
    return new Response(
      JSON.stringify({
        success: true,
        message: "If an account with that email exists, a password reset link has been sent.",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});





