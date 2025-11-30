/**
 * Authentication Service
 * Handles all authentication operations through Supabase Edge Functions
 * All sensitive logic is handled securely on the server
 */

import ky from "ky";
import { supabase } from "./supabase";

// Get Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase configuration is missing");
}

/**
 * Sign up a new user
 * Creates account through Supabase Edge Function
 */
export const signUp = async (
  email: string,
  password: string,
  fullName?: string
): Promise<{
  success: boolean;
  message?: string;
  error?: string;
  user?: {
    id: string;
    email: string;
    full_name?: string;
  };
}> => {
  try {
    const response = await ky
      .post<{
        success: boolean;
        message?: string;
        error?: string;
        user?: {
          id: string;
          email: string;
          full_name?: string;
        };
      }>(`${supabaseUrl}/functions/v1/auth-signup`, {
        headers: {
          Authorization: `Bearer ${supabaseAnonKey}`,
          "Content-Type": "application/json",
        },
        json: {
          email,
          password,
          fullName,
        },
      })
      .json();

    return response;
  } catch (error) {
    console.error("Signup error:", error);
    
    // Try to extract error message from HTTP error response
    // This handles cases like "User already exists" (409 status)
    if (error instanceof Error && "response" in error) {
      try {
        const errorResponse = error as { response: Response };
        const errorData = await errorResponse.response.json() as { error?: string };
        if (errorData?.error) {
          return {
            success: false,
            error: errorData.error,
          };
        }
      } catch {
        // If parsing fails, use default error message
      }
    }
    
    return {
      success: false,
      error: "Failed to create account. Please try again.",
    };
  }
};

/**
 * Sign in a user
 * Authenticates user through Supabase Edge Function
 * Returns session tokens for client-side use
 */
export const signIn = async (
  email: string,
  password: string
): Promise<{
  success: boolean;
  error?: string;
  user?: {
    id: string;
    email: string;
    user_metadata?: Record<string, unknown>;
  };
  session?: {
    access_token: string;
    refresh_token: string;
    expires_at?: number;
  };
}> => {
  try {
    const response = await ky
      .post<{
        success: boolean;
        error?: string;
        user?: {
          id: string;
          email: string;
          user_metadata?: Record<string, unknown>;
        };
        session?: {
          access_token: string;
          refresh_token: string;
          expires_at?: number;
        };
      }>(`${supabaseUrl}/functions/v1/auth-signin`, {
        headers: {
          Authorization: `Bearer ${supabaseAnonKey}`,
          "Content-Type": "application/json",
        },
        json: {
          email,
          password,
        },
      })
      .json();

    // If successful, set session in Supabase client
    if (response.success && response.session) {
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: response.session.access_token,
        refresh_token: response.session.refresh_token,
      });

      if (sessionError) {
        console.error("Session error:", sessionError);
      }
    }

    return response;
  } catch (error) {
    console.error("Signin error:", error);
    return {
      success: false,
      error: "Failed to sign in. Please check your credentials.",
    };
  }
};

/**
 * Request password reset
 * Sends password reset email through Supabase Edge Function
 */
export const forgotPassword = async (
  email: string
): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> => {
  try {
    const response = await ky
      .post<{
        success: boolean;
        message?: string;
        error?: string;
      }>(`${supabaseUrl}/functions/v1/auth-forgot-password`, {
        headers: {
          Authorization: `Bearer ${supabaseAnonKey}`,
          "Content-Type": "application/json",
        },
        json: {
          email,
        },
      })
      .json();

    return response;
  } catch (error) {
    console.error("Forgot password error:", error);
    return {
      success: false,
      error: "Failed to send reset email. Please try again.",
    };
  }
};

/**
 * Reset password
 * Updates password through Supabase Edge Function
 */
export const resetPassword = async (
  password: string,
  token?: string
): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> => {
  try {
    // Get current session token if available
    const { data: { session } } = await supabase.auth.getSession();
    const sessionToken = session?.access_token;

    const response = await ky
      .post<{
        success: boolean;
        message?: string;
        error?: string;
      }>(`${supabaseUrl}/functions/v1/auth-reset-password`, {
        headers: {
          Authorization: `Bearer ${supabaseAnonKey}`,
          "Content-Type": "application/json",
        },
        json: {
          password,
          token: token || sessionToken,
        },
      })
      .json();

    return response;
  } catch (error) {
    console.error("Reset password error:", error);
    return {
      success: false,
      error: "Failed to reset password. Please try again.",
    };
  }
};

/**
 * Sign out current user
 * Clears session from Supabase client
 */
export const signOut = async (): Promise<void> => {
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error("Sign out error:", error);
    throw error;
  }
};

/**
 * Get current user session
 * Returns current authenticated user
 */
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
};

/**
 * Get current session
 * Returns current session data
 */
export const getCurrentSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.error("Get session error:", error);
    return null;
  }
};

/**
 * Verify email with OTP code
 * Verifies the email address using the OTP code from confirmation email
 */
export const verifyEmailOTP = async (
  email: string,
  token: string,
  type: "signup" | "email_change" | "recovery" = "signup"
): Promise<{
  success: boolean;
  error?: string;
  user?: {
    id: string;
    email: string;
  };
}> => {
  try {
    // Verify OTP using Supabase Auth
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type,
    });

    if (error) {
      console.error("OTP verification error:", error);
      return {
        success: false,
        error: error.message || "Invalid verification code. Please try again.",
      };
    }

    if (!data.user) {
      return {
        success: false,
        error: "Verification failed. Please try again.",
      };
    }

    return {
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email || email,
      },
    };
  } catch (error) {
    console.error("Verify email OTP error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
};

/**
 * Resend confirmation email
 * Sends a new confirmation email with OTP code
 */
export const resendConfirmationEmail = async (
  email: string
): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> => {
  try {
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "https://aromeluxe.in"}/auth/callback`,
      },
    });

    if (error) {
      console.error("Resend confirmation error:", error);
      return {
        success: false,
        error: error.message || "Failed to resend confirmation email.",
      };
    }

    return {
      success: true,
      message: "Confirmation email has been resent.",
    };
  } catch (error) {
    console.error("Resend confirmation error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
};





