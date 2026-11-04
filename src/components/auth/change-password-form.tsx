"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { validatePassword } from "@/lib/password-validator";
import { Loader2, CheckCircle2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { PasswordStrengthIndicator } from "@/components/auth/password-strength-indicator";
import { supabase } from "@/lib/supabase";

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

export function ChangePasswordForm() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.errors.join(". "));
      return;
    }

    setIsLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (updateError) {
        setError(updateError.message || "Failed to change password. Please try again.");
        return;
      }
      setSuccess(true);
      setTimeout(() => router.push("/profile"), 1800);
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ border: `1px solid ${INK}`, background: PAPER }}>
      <div style={{ padding: "28px 28px 22px", borderBottom: `1px solid ${INK}` }}>
        <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: SAFFRON, marginBottom: 10 }}>
          ACCOUNT SECURITY
        </div>
        <h1 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "clamp(2rem, 5vw, 2.5rem)", fontWeight: 300, lineHeight: 0.95, letterSpacing: "-0.03em", color: INK, margin: 0 }}>
          Change <em style={{ fontStyle: "italic", color: SAFFRON }}>password.</em>
        </h1>
      </div>

      <div style={{ padding: "26px 28px 28px" }}>
        {success ? (
          <div style={{ border: "1px solid #1F6F43", background: "rgba(31,111,67,0.08)", padding: "14px 16px", display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--font-inter), sans-serif", fontSize: 13, color: "#1F6F43" }}>
            <CheckCircle2 style={{ width: 16, height: 16, flexShrink: 0 }} />
            <span>Password changed. Redirecting to profile...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {error && (
              <div role="alert" style={{ border: `1px solid ${SAFFRON}`, background: "rgba(232,118,58,0.08)", padding: "12px 14px", fontFamily: "var(--font-inter), sans-serif", fontSize: 13, color: INK }}>
                {error}
              </div>
            )}

            <div>
              <label htmlFor="newPassword" style={labelStyle}>NEW PASSWORD</label>
              <div style={{ position: "relative" }}>
                <input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={inputStyle}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((v) => !v)}
                  aria-label={showNewPassword ? "Hide password" : "Show password"}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: INK, opacity: 0.55, padding: 4 }}
                >
                  {showNewPassword ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                </button>
              </div>
              <PasswordStrengthIndicator password={newPassword} />
            </div>

            <div>
              <label htmlFor="confirmPassword" style={labelStyle}>CONFIRM NEW PASSWORD</label>
              <div style={{ position: "relative" }}>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={inputStyle}
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
                  SAVING...
                </>
              ) : (
                "CHANGE PASSWORD →"
              )}
            </button>
          </form>
        )}

        <div style={{ marginTop: 20, textAlign: "center" }}>
          <Link href="/profile" style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: INK, opacity: 0.65, textDecoration: "underline" }}>
            ← BACK TO PROFILE
          </Link>
        </div>
      </div>
    </div>
  );
}
