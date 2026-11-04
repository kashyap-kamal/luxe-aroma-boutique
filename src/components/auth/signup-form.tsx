"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-service";
import { validatePassword } from "@/lib/password-validator";
import { Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { PasswordStrengthIndicator } from "@/components/auth/password-strength-indicator";

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

export function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.errors.join(". "));
      return;
    }

    setIsLoading(true);
    try {
      const result = await signUp(email, password, fullName);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
        }, 1800);
      } else {
        setError(result.error || "An error occurred. Please try again.");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ border: `1px solid ${INK}`, background: PAPER, padding: 28 }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
            color: "#1F6F43",
          }}
        >
          <CheckCircle2 style={{ width: 20, height: 20, flexShrink: 0, marginTop: 2 }} />
          <div>
            <div
              style={{
                fontFamily: "var(--font-fraunces), serif",
                fontSize: "1.4rem",
                fontWeight: 300,
                color: INK,
                marginBottom: 6,
              }}
            >
              Account created.
            </div>
            <p
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: 13,
                lineHeight: 1.6,
                color: "#3A3833",
                margin: 0,
              }}
            >
              Check your inbox for a 6-digit verification code. Redirecting to verification...
            </p>
          </div>
        </div>
      </div>
    );
  }

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
          02 / NEW MEMBERSHIP
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
          Join the <em style={{ fontStyle: "italic", color: SAFFRON }}>house.</em>
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
          Create your Aromé Luxe profile for faster checkout and order history.
        </p>
      </div>

      <div style={{ padding: "26px 28px 28px" }}>
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
            <label htmlFor="fullName" style={labelStyle}>
              FULL NAME
            </label>
            <input
              id="fullName"
              type="text"
              autoComplete="name"
              placeholder="Your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={inputStyle}
              required
              disabled={isLoading}
            />
          </div>

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
            <label htmlFor="password" style={labelStyle}>
              PASSWORD
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Create a secure password"
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
            <PasswordStrengthIndicator password={password} />
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
                CREATING ACCOUNT...
              </>
            ) : (
              "CREATE ACCOUNT →"
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
          <span style={{ color: INK, opacity: 0.55 }}>ALREADY A MEMBER?</span>
          <Link
            href="/auth/signin"
            style={{
              color: SAFFRON,
              textDecoration: "underline",
              fontWeight: 600,
            }}
          >
            SIGN IN →
          </Link>
        </div>
      </div>
    </div>
  );
}
