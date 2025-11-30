// Supabase Edge Function: User Signup
// Handles user registration with validation and profile creation
// All authentication logic is handled securely on the server

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
    const { email, password, fullName }: {
      email: string;
      password: string;
      fullName?: string;
    } = await req.json();

    // Validate input
    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email and password are required" }),
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

    // Validate password strength (secure password requirements)
    const passwordErrors: string[] = [];
    
    if (password.length < 8) {
      passwordErrors.push("Password must be at least 8 characters long");
    }
    
    if (!/[A-Z]/.test(password)) {
      passwordErrors.push("Password must contain at least one uppercase letter");
    }
    
    if (!/[a-z]/.test(password)) {
      passwordErrors.push("Password must contain at least one lowercase letter");
    }
    
    if (!/[0-9]/.test(password)) {
      passwordErrors.push("Password must contain at least one number");
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      passwordErrors.push("Password must contain at least one special character");
    }
    
    if (passwordErrors.length > 0) {
      return new Response(
        JSON.stringify({ error: passwordErrors.join(". ") }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check if user already exists BEFORE attempting signup
    // This prevents unnecessary email sending and rate limit issues
    try {
      const { data: existingUser } = await supabase.auth.admin.getUserByEmail(email);
      if (existingUser?.user) {
        return new Response(
          JSON.stringify({ error: "User with this email already exists" }),
          {
            status: 409,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    } catch (checkError) {
      // If check fails, continue with signup attempt
      console.log("User existence check failed, continuing with signup");
    }

    // Create user account using signUp
    // Only sends email if user doesn't exist
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || "",
        },
        emailRedirectTo: `${Deno.env.get("APP_URL") || "https://aromeluxe.in"}/auth/callback`,
      },
    });

    if (authError) {
      console.error("Auth error:", authError);
      
      // Handle specific error cases
      if (authError.message?.includes("already registered") || 
          authError.message?.includes("already exists") ||
          authError.message?.includes("User already registered")) {
        return new Response(
          JSON.stringify({ error: "User with this email already exists" }),
          {
            status: 409,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Handle rate limit errors
      if (authError.message?.includes("rate limit") || 
          authError.message?.includes("too many requests") ||
          authError.status === 429) {
        return new Response(
          JSON.stringify({ 
            error: "Too many requests. Please wait a few minutes before trying again." 
          }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      return new Response(
        JSON.stringify({ error: authError.message || "Failed to create user account" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check if user was created successfully
    if (!authData.user) {
      return new Response(
        JSON.stringify({ error: "Failed to create user account" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Profile is automatically created by database trigger
    // But we can verify it was created
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: "Account created successfully. Please check your email to confirm your account.",
        user: {
          id: authData.user.id,
          email: authData.user.email,
          full_name: fullName,
        },
        profile: profile || null,
      }),
      {
        status: 201,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Signup error:", error);
    
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





