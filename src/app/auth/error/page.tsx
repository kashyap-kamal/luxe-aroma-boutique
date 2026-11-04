"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AuthHeader } from "@/components/auth/auth-header";

const INK = "#0E0E0C";
const CREAM = "#F2EDE4";
const PAPER = "#FAF7F2";
const SAFFRON = "#E8763A";

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(searchParams.get("error"));
  }, [searchParams]);

  const getErrorMessage = (err: string) => {
    switch (err) {
      case "Configuration":
        return "There is a problem with the server configuration.";
      case "AccessDenied":
        return "Access denied. You do not have permission to sign in.";
      case "Verification":
        return "The verification token has expired or has already been used.";
      default:
        return "An error occurred during authentication.";
    }
  };

  return (
    <main
      className="flex-1 flex items-center justify-center px-5 py-12 md:py-20"
      style={{ background: CREAM, color: INK }}
    >
      <div className="w-full max-w-[460px] space-y-5">
        <AuthHeader />
        <div style={{ border: `1px solid ${INK}`, background: PAPER }}>
          <div style={{ padding: "28px 28px 22px", borderBottom: `1px solid ${INK}` }}>
            <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: SAFFRON, marginBottom: 10 }}>
              AUTHENTICATION NOTICE
            </div>
            <h1 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "2.1rem", fontWeight: 300, lineHeight: 0.95, letterSpacing: "-0.03em", color: INK, margin: 0 }}>
              Unable to <em style={{ fontStyle: "italic", color: SAFFRON }}>sign in.</em>
            </h1>
          </div>
          <div style={{ padding: 28, display: "flex", flexDirection: "column", gap: 14 }}>
            <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, lineHeight: 1.6, color: "#3A3833", margin: 0 }}>
              {error ? getErrorMessage(error) : "An error occurred during authentication."}
            </p>
            <Link
              href="/auth/signin"
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
              TRY AGAIN →
            </Link>
            <Link
              href="/"
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
              RETURN HOME
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<main className="flex-1" style={{ background: CREAM, minHeight: "60vh" }} />}>
      <AuthErrorContent />
    </Suspense>
  );
}
