"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { forgotPassword } from "@/lib/auth-service";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const INK = "#0E0E0C";
const CREAM = "#F2EDE4";
const PAPER = "#FAF7F2";
const SAFFRON = "#E8763A";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const result = await forgotPassword(email);
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error || "Failed to send reset email. Please try again.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ border: `1px solid ${INK}`, background: PAPER }}>
      <div style={{ padding: "28px 28px 22px", borderBottom: `1px solid ${INK}` }}>
        <div
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 10,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: SAFFRON,
            marginBottom: 10,
          }}
        >
          ACCOUNT RECOVERY
        </div>
        <h1
          style={{
            fontFamily: "var(--font-fraunces), serif",
            fontSize: "clamp(2rem, 5vw, 2.5rem)",
            fontWeight: 300,
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            color: INK,
            margin: 0,
          }}
        >
          Reset <em style={{ fontStyle: "italic", color: SAFFRON }}>password.</em>
        </h1>
        <p
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 13,
            lineHeight: 1.6,
            color: "#3A3833",
            marginTop: 10,
            marginBottom: 0,
          }}
        >
          Enter the email linked to your account and we will send a recovery link.
        </p>
      </div>

      <div style={{ padding: "26px 28px 28px" }}>
        {success ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              style={{
                border: "1px solid #1F6F43",
                background: "rgba(31,111,67,0.08)",
                padding: "14px 16px",
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: 13,
                lineHeight: 1.5,
                color: "#1F6F43",
              }}
            >
              <CheckCircle2 style={{ width: 16, height: 16, flexShrink: 0, marginTop: 2 }} />
              <span>Password reset link sent. Check your inbox and follow the instructions.</span>
            </div>
            <button
              type="button"
              onClick={() => router.push("/auth/signin")}
              style={{
                width: "100%",
                background: "transparent",
                color: INK,
                border: `1px solid ${INK}`,
                padding: "14px 20px",
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 10,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <ArrowLeft style={{ width: 13, height: 13 }} />
              BACK TO SIGN IN
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {error && (
              <div
                role="alert"
                style={{
                  border: `1px solid ${SAFFRON}`,
                  background: "rgba(232,118,58,0.08)",
                  padding: "12px 14px",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: 13,
                  color: INK,
                }}
              >
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                style={{
                  display: "block",
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: INK,
                  marginBottom: 8,
                }}
              >
                EMAIL ADDRESS
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  background: CREAM,
                  border: `1px solid ${INK}`,
                  padding: "13px 14px",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: 16,
                  color: INK,
                  outline: "none",
                  borderRadius: 0,
                }}
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
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
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.7 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 style={{ width: 14, height: 14, animation: "spin 1s linear infinite" }} />
                  SENDING...
                </>
              ) : (
                "SEND RESET LINK →"
              )}
            </button>
          </form>
        )}

        <div
          style={{
            marginTop: 22,
            paddingTop: 18,
            borderTop: "1px dotted rgba(14,14,12,0.25)",
            textAlign: "center",
          }}
        >
          <Link
            href="/auth/signin"
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 10,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: INK,
              opacity: 0.7,
              textDecoration: "underline",
            }}
          >
            ← RETURN TO SIGN IN
          </Link>
        </div>
      </div>
    </div>
  );
}
