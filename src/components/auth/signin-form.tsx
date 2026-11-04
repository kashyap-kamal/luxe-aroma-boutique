"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "@/lib/auth-service";
import { Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const INK = "#0E0E0C";
const CREAM = "#F2EDE4";
const PAPER = "#FAF7F2";
const SAFFRON = "#E8763A";

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-jetbrains-mono), monospace",
  fontSize: 10,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: INK,
  marginBottom: 8,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: CREAM,
  border: `1px solid ${INK}`,
  padding: "13px 14px",
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: 16,
  color: INK,
  outline: "none",
  borderRadius: 0,
};

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawRedirect = searchParams.get("redirect");
  const redirectTarget =
    rawRedirect && rawRedirect.startsWith("/") && !rawRedirect.startsWith("//")
      ? rawRedirect
      : "/";

  useEffect(() => {
    const verifiedParam = searchParams.get("verified");
    if (verifiedParam === "true") {
      setVerified(true);
      const timer = setTimeout(() => {
        const nextUrl =
          redirectTarget !== "/"
            ? `/auth/signin?redirect=${encodeURIComponent(redirectTarget)}`
            : "/auth/signin";
        router.replace(nextUrl);
        setVerified(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, router, redirectTarget]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn(email, password);
      if (result.success) {
        router.push(redirectTarget);
        router.refresh();
      } else {
        setError(result.error || "Invalid email or password");
      }
    } catch {
      setError("An error occurred. Please try again.");
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
          01 / MEMBER ACCESS
        </div>
        <h1
          style={{
            fontFamily: "var(--font-fraunces), serif",
            fontSize: "clamp(2rem, 5vw, 2.6rem)",
            fontWeight: 300,
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            color: INK,
            margin: 0,
          }}
        >
          Welcome <em style={{ fontStyle: "italic", color: SAFFRON }}>back.</em>
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
          Sign in to track orders, manage saved addresses, and access your fragrance archive.
        </p>
      </div>

      <div style={{ padding: "26px 28px 28px" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {verified && (
            <div
              style={{
                border: "1px solid #1F6F43",
                background: "rgba(31,111,67,0.08)",
                padding: "12px 14px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: 13,
                color: "#1F6F43",
              }}
            >
              <CheckCircle2 style={{ width: 16, height: 16, flexShrink: 0 }} />
              <span>Email verified. You can sign in below.</span>
            </div>
          )}

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
            <label htmlFor="email" style={labelStyle}>
              EMAIL ADDRESS
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <label htmlFor="password" style={{ ...labelStyle, marginBottom: 0 }}>
                PASSWORD
              </label>
              <Link
                href="/auth/forgot-password"
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: 9,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: INK,
                  opacity: 0.65,
                  textDecoration: "underline",
                }}
              >
                FORGOT?
              </Link>
            </div>
            <div style={{ position: "relative" }}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ ...inputStyle, paddingRight: 44 }}
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: INK,
                  opacity: 0.55,
                  padding: 4,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {showPassword ? (
                  <EyeOff style={{ width: 16, height: 16 }} />
                ) : (
                  <Eye style={{ width: 16, height: 16 }} />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="transition-colors hover:opacity-90"
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
              marginTop: 4,
            }}
          >
            {isLoading ? (
              <>
                <Loader2 style={{ width: 14, height: 14, animation: "spin 1s linear infinite" }} />
                SIGNING IN...
              </>
            ) : (
              "SIGN IN →"
            )}
          </button>
        </form>

        <div
          style={{
            marginTop: 22,
            paddingTop: 18,
            borderTop: "1px dotted rgba(14,14,12,0.25)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 10,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          <span style={{ color: INK, opacity: 0.55 }}>NEW TO AROMÉ LUXE?</span>
          <Link
            href="/auth/signup"
            style={{
              color: SAFFRON,
              textDecoration: "underline",
              fontWeight: 600,
            }}
          >
            CREATE ACCOUNT →
          </Link>
        </div>
      </div>
    </div>
  );
}
