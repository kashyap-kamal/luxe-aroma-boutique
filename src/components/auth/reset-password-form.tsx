"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { resetPassword, getCurrentSession } from "@/lib/auth-service";
import { validatePassword } from "@/lib/password-validator";
import { Loader2, CheckCircle2, Eye, EyeOff } from "lucide-react";
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
  paddingRight: 44,
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: 16,
  color: INK,
  outline: "none",
  borderRadius: 0,
};

export function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await getCurrentSession();
        if (session) {
          setIsValidToken(true);
        } else {
          setIsValidToken(false);
          setError("Invalid or expired reset link. Please request a new password reset.");
        }
      } catch {
        setIsValidToken(false);
        setError("Failed to verify reset link. Please try again.");
      }
    };
    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.errors.join(". "));
      return;
    }

    setIsLoading(true);
    try {
      const result = await resetPassword(password);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/auth/signin");
        }, 1800);
      } else {
        setError(result.error || "Failed to reset password. Please try again.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidToken === null) {
    return (
      <div style={{ border: `1px solid ${INK}`, background: PAPER, padding: "48px 28px", textAlign: "center" }}>
        <Loader2 style={{ width: 22, height: 22, margin: "0 auto 12px", color: SAFFRON, animation: "spin 1s linear infinite" }} />
        <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: INK, opacity: 0.6 }}>
          VERIFYING LINK...
        </div>
      </div>
    );
  }

  if (isValidToken === false) {
    return (
      <div style={{ border: `1px solid ${INK}`, background: PAPER }}>
        <div style={{ padding: "28px 28px 22px", borderBottom: `1px solid ${INK}` }}>
          <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: SAFFRON, marginBottom: 10 }}>
            LINK EXPIRED
          </div>
          <h1 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "2.1rem", fontWeight: 300, lineHeight: 0.95, letterSpacing: "-0.03em", color: INK, margin: 0 }}>
            Invalid <em style={{ fontStyle: "italic", color: SAFFRON }}>reset link.</em>
          </h1>
        </div>
        <div style={{ padding: 28, display: "flex", flexDirection: "column", gap: 14 }}>
          <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, lineHeight: 1.6, color: "#3A3833", margin: 0 }}>
            {error}
          </p>
          <Link
            href="/auth/forgot-password"
            style={{
              display: "block",
              textAlign: "center",
              background: INK,
              color: CREAM,
              padding: "15px 20px",
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            REQUEST NEW LINK →
          </Link>
          <Link
            href="/auth/signin"
            style={{
              display: "block",
              textAlign: "center",
              border: `1px solid ${INK}`,
              color: INK,
              padding: "14px 20px",
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 10,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            BACK TO SIGN IN
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ border: `1px solid ${INK}`, background: PAPER }}>
      <div style={{ padding: "28px 28px 22px", borderBottom: `1px solid ${INK}` }}>
        <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: SAFFRON, marginBottom: 10 }}>
          SECURITY UPDATE
        </div>
        <h1 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "clamp(2rem, 5vw, 2.5rem)", fontWeight: 300, lineHeight: 0.95, letterSpacing: "-0.03em", color: INK, margin: 0 }}>
          Choose a new <em style={{ fontStyle: "italic", color: SAFFRON }}>password.</em>
        </h1>
      </div>

      <div style={{ padding: "26px 28px 28px" }}>
        {success ? (
          <div style={{ border: "1px solid #1F6F43", background: "rgba(31,111,67,0.08)", padding: "14px 16px", display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--font-inter), sans-serif", fontSize: 13, color: "#1F6F43" }}>
            <CheckCircle2 style={{ width: 16, height: 16, flexShrink: 0 }} />
            <span>Password updated. Redirecting to sign in...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {error && (
              <div role="alert" style={{ border: `1px solid ${SAFFRON}`, background: "rgba(232,118,58,0.08)", padding: "12px 14px", fontFamily: "var(--font-inter), sans-serif", fontSize: 13, color: INK }}>
                {error}
              </div>
            )}

            <div>
              <label htmlFor="password" style={labelStyle}>NEW PASSWORD</label>
              <div style={{ position: "relative" }}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={inputStyle}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: INK, opacity: 0.55, padding: 4 }}
                >
                  {showPassword ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                </button>
              </div>
              <PasswordStrengthIndicator password={password} />
            </div>

            <div>
              <label htmlFor="confirmPassword" style={labelStyle}>CONFIRM PASSWORD</label>
              <div style={{ position: "relative" }}>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{
                    ...inputStyle,
                    borderColor:
                      password && confirmPassword && password !== confirmPassword
                        ? SAFFRON
                        : INK,
                  }}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: INK, opacity: 0.55, padding: 4 }}
                >
                  {showConfirmPassword ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                </button>
              </div>
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
                  UPDATING...
                </>
              ) : (
                "UPDATE PASSWORD →"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
