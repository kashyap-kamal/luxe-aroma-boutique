import { ProtectedRoute } from "@/components/auth/protected-route";
import { UserProfile } from "@/components/auth/user-profile";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const INK = "#0E0E0C";
const CREAM = "#F2EDE4";
const DARK = "#1A0908";

export const metadata: Metadata = {
  title: "Profile | Aromé Luxe",
  description: "Manage your Aromé Luxe profile and preferences.",
};

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <main style={{ background: CREAM, color: INK, minHeight: "100vh" }}>
        {/* Hero */}
        <section style={{ background: DARK, color: CREAM, paddingTop: 80, paddingBottom: 48, borderBottom: `1px solid ${INK}` }} className="px-5 md:px-12">
          <div className="max-w-4xl mx-auto">
            <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.5, marginBottom: 20 }}>
              ACCOUNT / PROFILE
            </div>
            <h1 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 300, lineHeight: 0.9, letterSpacing: "-0.03em", margin: 0 }}>
              Your <em style={{ color: "#E8763A" }}>account.</em>
            </h1>
          </div>
        </section>

        {/* Content */}
        <section style={{ paddingTop: 48, paddingBottom: 80 }} className="px-5 md:px-12">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: INK,
                textDecoration: "none",
                marginBottom: 32,
                opacity: 0.6,
              }}
            >
              <ArrowLeft style={{ width: 12, height: 12 }} />
              Back to Home
            </Link>
            <UserProfile />
          </div>
        </section>
      </main>
    </ProtectedRoute>
  );
}
