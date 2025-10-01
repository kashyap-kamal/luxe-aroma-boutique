import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

/**
 * Auth Callback Route
 * Handles email confirmation and other auth redirects from Supabase
 * This route is called when users click the confirmation link in their email
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const next = requestUrl.searchParams.get("next") || "/"

  // If we have a code, exchange it for a session
  if (code) {
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error("Error exchanging code for session:", error)
        // Redirect to error page with message
        return NextResponse.redirect(
          `${requestUrl.origin}/auth/error?message=Unable to confirm email. Please try again.`,
        )
      }

      // Success! Redirect to the next page or home
      return NextResponse.redirect(`${requestUrl.origin}${next}`)
    } catch (error) {
      console.error("Auth callback error:", error)
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/error?message=An unexpected error occurred.`,
      )
    }
  }

  // No code provided, redirect to home
  return NextResponse.redirect(requestUrl.origin)
}
