"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyEmailOTP, resendConfirmationEmail } from "@/lib/auth-service";
import { Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const INK = "#0E0E0C";
const CREAM = "#F2EDE4";
const PAPER = "#FAF7F2";
const SAFFRON = "#E8763A";

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

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) setEmail(emailParam);
  }, [searchParams]);

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
        setTimeout(() => {
          router.push("/auth/signin?verified=true");
        }, 1800);
      } else {
        setError(result.error || "Invalid verification code. Please try again.");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
        setTimeout(() => setResendSuccess(false), 5000);
      } else {
        setError(result.error || "Failed to resend email. Please try again.");
      }
    } catch {
      setError("Failed to resend email. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const handleOtpChange = (value: string) => {
    setOtp(value.replace(/\D/g, "").slice(0, 6));
  };

  if (success) {
    return (
      <div style={{ border: `1px solid ${INK}`, background: PAPER, padding: 28 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, color: "#1F6F43" }}>
          <CheckCircle2 style={{ width: 20, height: 20, flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "1.4rem", fontWeight: 300, color: INK, marginBottom: 6 }}>
              Email verified.
            </div>
            <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, color: "#3A3833", margin: 0 }}>
              Redirecting you to sign in...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ border: `1px solid ${INK}`, background: PAPER }}>
      <div style={{ padding: "28px 28px 22px", borderBottom: `1px solid ${INK}` }}>
        <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: SAFFRON, marginBottom: 10 }}>
          EMAIL CONFIRMATION
        </div>
        <h1 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "clamp(2rem, 5vw, 2.5rem)", fontWeight: 300, lineHeight: 0.95, letterSpacing: "-0.03em", color: INK, margin: 0 }}>
          Verify <em style={{ fontStyle: "italic", color: SAFFRON }}>your code.</em>
        </h1>
        <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, lineHeight: 1.6, color: "#3A3833", marginTop: 10, marginBottom: 0 }}>
          Enter the 6-digit code sent to your inbox.
        </p>
      </div>

      <div style={{ padding: "26px 28px 28px" }}>
        <form onSubmit={handleVerify} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {error && (
            <div role="alert" style={{ border: `1px solid ${SAFFRON}`, background: "rgba(232,118,58,0.08)", padding: "12px 14px", fontFamily: "var(--font-inter), sans-serif", fontSize: 13, color: INK }}>
              {error}
            </div>
          )}
          {resendSuccess && (
            <div style={{ border: "1px solid #1F6F43", background: "rgba(31,111,67,0.08)", padding: "12px 14px", fontFamily: "var(--font-inter), sans-serif", fontSize: 13, color: "#1F6F43" }}>
              Verification code resent to your email.
            </div>
          )}

          <div>
            <label htmlFor="verify-email" style={{ display: "block", fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: INK, marginBottom: 8 }}>
              EMAIL ADDRESS
            </label>
            <input
              id="verify-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              style={{ width: "100%", background: CREAM, border: `1px solid ${INK}`, padding: "13px 14px", fontFamily: "var(--font-inter), sans-serif", fontSize: 16, color: INK, outline: "none", borderRadius: 0 }}
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="otp" style={{ display: "block", fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: INK, marginBottom: 8 }}>
              6-DIGIT CODE
            </label>
            <input
              id="otp"
              type="text"
              inputMode="numeric"
              placeholder="000000"
              value={otp}
              onChange={(e) => handleOtpChange(e.target.value)}
              maxLength={6}
              style={{
                width: "100%",
                background: CREAM,
                border: `1px solid ${INK}`,
                padding: "14px",
                textAlign: "center",
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 22,
                letterSpacing: "0.35em",
                color: INK,
                outline: "none",
                borderRadius: 0,
              }}
              required
              disabled={isLoading}
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.length !== 6}
            style={{
              width: "100%",
              background: INK,
              color: CREAM,
              border: `1px solid ${INK}`,
              padding: "16px 20px",
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              cursor: isLoading || otp.length !== 6 ? "not-allowed" : "pointer",
              opacity: isLoading || otp.length !== 6 ? 0.55 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {isLoading ? (
              <>
                <Loader2 style={{ width: 14, height: 14, animation: "spin 1s linear infinite" }} />
                VERIFYING...
              </>
            ) : (
              "VERIFY EMAIL →"
            )}
          </button>
        </form>

        <div style={{ marginTop: 14 }}>
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending || !email}
            style={{
              width: "100%",
              background: "transparent",
              color: INK,
              border: `1px solid ${INK}`,
              padding: "13px 18px",
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 10,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              cursor: isResending || !email ? "not-allowed" : "pointer",
              opacity: isResending || !email ? 0.5 : 1,
            }}
          >
            {isResending ? "RESENDING..." : "RESEND CODE"}
          </button>
        </div>

        <div style={{ marginTop: 20, textAlign: "center" }}>
          <Link href="/auth/signup" style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: INK, opacity: 0.65, textDecoration: "underline" }}>
            ← BACK TO SIGN UP
          </Link>
        </div>
      </div>
    </div>
  );
}
