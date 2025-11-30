"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyEmailOTP, resendConfirmationEmail } from "@/lib/auth-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  // Get email from URL params or use empty string
  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  // Handle OTP verification
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResendSuccess(false);

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit verification code");
      return;
    }

    if (!email) {
      setError("Email address is required");
      return;
    }

    setIsLoading(true);

    try {
      const result = await verifyEmailOTP(email, otp);

      if (result.success) {
        setSuccess(true);
        // Redirect to sign in page after successful verification
        setTimeout(() => {
          router.push("/auth/signin?verified=true");
        }, 2000);
      } else {
        setError(result.error || "Invalid verification code. Please try again.");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resend confirmation email
  const handleResend = async () => {
    if (!email) {
      setError("Email address is required");
      return;
    }

    setIsResending(true);
    setError("");
    setResendSuccess(false);

    try {
      const result = await resendConfirmationEmail(email);

      if (result.success) {
        setResendSuccess(true);
        setTimeout(() => {
          setResendSuccess(false);
        }, 5000);
      } else {
        setError(result.error || "Failed to resend email. Please try again.");
      }
    } catch {
      setError("Failed to resend email. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  // Handle OTP input - auto-format and move to next input
  const handleOtpChange = (value: string) => {
    // Only allow digits
    const digitsOnly = value.replace(/\D/g, "");
    // Limit to 6 digits
    const limited = digitsOnly.slice(0, 6);
    setOtp(limited);
  };

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Email Verified!
              </h3>
              <p className="text-gray-600">
                Your email has been successfully verified. Redirecting to sign in...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Verify Your Email
        </CardTitle>
        <CardDescription className="text-center">
          Enter the 6-digit code sent to your email address
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleVerify} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {resendSuccess && (
            <Alert className="border-green-500 bg-green-50">
              <AlertDescription className="text-green-800">
                Verification code has been resent to your email!
              </AlertDescription>
            </Alert>
          )}

          {/* Email Display */}
          {email && (
            <div className="space-y-2">
              <Label>Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          {/* OTP Input */}
          <div className="space-y-2">
            <Label htmlFor="otp">Verification Code</Label>
            <Input
              id="otp"
              type="text"
              inputMode="numeric"
              placeholder="000000"
              value={otp}
              onChange={(e) => handleOtpChange(e.target.value)}
              className="text-center text-2xl font-mono tracking-widest"
              maxLength={6}
              required
              disabled={isLoading}
              autoFocus
            />
            <p className="text-xs text-muted-foreground text-center">
              Enter the 6-digit code from your email
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading || otp.length !== 6}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verify Email
          </Button>
        </form>

        {/* Resend Code */}
        <div className="mt-4 space-y-2">
          <div className="text-center text-sm text-muted-foreground">
            Didn't receive the code?
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleResend}
            disabled={isResending || !email}
          >
            {isResending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Resend Verification Code
          </Button>
        </div>

        {/* Back to Sign Up */}
        <div className="mt-4 text-center text-sm">
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sign Up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

