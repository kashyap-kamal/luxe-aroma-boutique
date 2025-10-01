"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, ArrowLeft, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Send password reset email using Supabase
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        },
      )

      if (resetError) {
        // Handle specific errors
        if (resetError.message.includes("User not found")) {
          setError(
            "No account found with this email address. Please check and try again.",
          )
          toast.error("Email not found", {
            description: "Please check your email address and try again.",
          })
        } else {
          setError(resetError.message)
          toast.error("Failed to send reset email", {
            description: resetError.message,
          })
        }
      } else {
        // Success!
        setIsSuccess(true)
        toast.success("Reset email sent!", {
          description: "Check your inbox for password reset instructions.",
        })
      }
    } catch (err) {
      const errorMsg = "An unexpected error occurred. Please try again."
      setError(errorMsg)
      toast.error("Error", { description: errorMsg })
      console.error("Forgot password error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // Success state - show confirmation message
  if (isSuccess) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
          <CardDescription>
            We&apos;ve sent password reset instructions to
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-sm font-medium text-luxe-blue">{email}</p>
          </div>

          <Alert>
            <AlertDescription>
              Click the link in the email to reset your password. The link will
              expire in 1 hour.
            </AlertDescription>
          </Alert>

          <div className="space-y-2 pt-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/auth/signin")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sign In
            </Button>

            <Button
              variant="ghost"
              className="w-full text-sm"
              onClick={() => setIsSuccess(false)}
            >
              Didn&apos;t receive the email? Try again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Form state - show email input
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Forgot Password?
        </CardTitle>
        <CardDescription className="text-center">
          Enter your email address and we&apos;ll send you a link to reset your
          password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send Reset Link
          </Button>
        </form>

        <div className="mt-4 text-center">
          <Button
            variant="link"
            className="p-0 h-auto text-sm"
            onClick={() => router.push("/auth/signin")}
            disabled={isLoading}
          >
            <ArrowLeft className="mr-2 h-3 w-3" />
            Back to Sign In
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
