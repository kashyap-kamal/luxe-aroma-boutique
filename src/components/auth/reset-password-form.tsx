"use client"

import { useState, useEffect } from "react"
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
import { Loader2, Lock, CheckCircle2, AlertCircle } from "lucide-react"
import { toast } from "sonner"

export function ResetPasswordForm() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)
  const [isValidToken, setIsValidToken] = useState(false)
  const [isCheckingToken, setIsCheckingToken] = useState(true)
  const router = useRouter()

  // Check if we have a valid password reset token
  useEffect(() => {
    const checkToken = async () => {
      try {
        // Get the current session to check if recovery token exists
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session) {
          setIsValidToken(true)
        } else {
          setIsValidToken(false)
          setError(
            "Invalid or expired reset link. Please request a new password reset.",
          )
        }
      } catch (err) {
        console.error("Token check error:", err)
        setIsValidToken(false)
        setError("Failed to verify reset link. Please try again.")
      } finally {
        setIsCheckingToken(false)
      }
    }

    checkToken()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      toast.error("Passwords do not match", {
        description: "Please make sure both passwords are the same.",
      })
      setIsLoading(false)
      return
    }

    // Validate password strength
    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      toast.error("Password too short", {
        description: "Please use at least 6 characters.",
      })
      setIsLoading(false)
      return
    }

    try {
      // Update the user's password
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      })

      if (updateError) {
        setError(updateError.message)
        toast.error("Failed to reset password", {
          description: updateError.message,
        })
      } else {
        // Success!
        setIsSuccess(true)
        toast.success("Password reset successful!", {
          description: "You can now sign in with your new password.",
        })

        // Redirect to sign-in page after 3 seconds
        setTimeout(() => {
          router.push("/auth/signin")
        }, 3000)
      }
    } catch (err) {
      const errorMsg = "An unexpected error occurred. Please try again."
      setError(errorMsg)
      toast.error("Error", { description: errorMsg })
      console.error("Reset password error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // Loading state while checking token
  if (isCheckingToken) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-luxe-blue" />
            <p className="text-sm text-muted-foreground">
              Verifying reset link...
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Invalid token state
  if (!isValidToken) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Invalid Reset Link
          </CardTitle>
          <CardDescription>
            This password reset link is invalid or has expired
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>

          <div className="space-y-2 pt-4">
            <Button
              className="w-full"
              onClick={() => router.push("/auth/forgot-password")}
            >
              Request New Reset Link
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/auth/signin")}
            >
              Back to Sign In
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Success state
  if (isSuccess) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Password Reset Successful!
          </CardTitle>
          <CardDescription>
            Your password has been updated successfully
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              Redirecting you to sign in page in a few seconds...
            </AlertDescription>
          </Alert>

          <Button
            className="w-full"
            onClick={() => router.push("/auth/signin")}
          >
            Go to Sign In
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Form state
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Reset Password
        </CardTitle>
        <CardDescription className="text-center">
          Enter your new password below
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
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
                minLength={6}
                disabled={isLoading}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Must be at least 6 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10"
                required
                minLength={6}
                disabled={isLoading}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Reset Password
          </Button>
        </form>

        <div className="mt-4 text-center">
          <Button
            variant="link"
            className="p-0 h-auto text-sm"
            onClick={() => router.push("/auth/signin")}
            disabled={isLoading}
          >
            Back to Sign In
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
