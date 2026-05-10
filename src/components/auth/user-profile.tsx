"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { User, Mail, Calendar, Shield, Lock, ShoppingBag } from "lucide-react";

const INK = "#0E0E0C";
const CREAM = "#F2EDE4";
const SAFFRON = "#E8763A";

export function UserProfile() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  if (!isAuthenticated || !user) {
    return (
      <div style={{ padding: "48px", textAlign: "center", border: `1px solid ${INK}`, fontFamily: "var(--font-inter), sans-serif", fontSize: 14, color: INK }}>
        Please sign in to view your profile.
      </div>
    );
  }

  const fullName = user.user_metadata?.full_name || user.email || "Member";
  const initials = fullName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })
    : "N/A";

  return (
    <div style={{ color: INK }}>
      {/* Profile header */}
      <div style={{ borderBottom: `1px solid ${INK}`, padding: "32px 0 28px", marginBottom: 32, display: "flex", alignItems: "center", gap: 24 }}>
        <div style={{ width: 64, height: 64, background: INK, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 18, color: CREAM, letterSpacing: "0.05em" }}>{initials}</span>
        </div>
        <div>
          <h2 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "1.8rem", fontWeight: 300, letterSpacing: "-0.02em", margin: "0 0 4px" }}>{fullName}</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, color: "#3A3833" }}>{user.email}</span>
            <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", background: INK, color: CREAM, padding: "2px 8px", display: "inline-flex", alignItems: "center", gap: 4 }}>
              <Shield style={{ width: 9, height: 9 }} />VERIFIED
            </span>
          </div>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0" style={{ border: `1px solid ${INK}`, marginBottom: 32 }}>
        <div style={{ padding: "28px 32px", borderBottom: `1px solid ${INK}` }} className="md:border-b-0 md:border-r border-[#0E0E0C]">
          <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.5, marginBottom: 20 }}>PERSONAL INFORMATION</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {[
              { icon: User, label: "FULL NAME", value: fullName },
              { icon: Mail, label: "EMAIL", value: user.email || "" },
              { icon: Calendar, label: "MEMBER SINCE", value: memberSince },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <Icon style={{ width: 14, height: 14, marginTop: 2, opacity: 0.5, flexShrink: 0 }} strokeWidth={1.5} />
                <div>
                  <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.5, marginBottom: 3 }}>{label}</div>
                  <div style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 14, color: INK }}>{value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: "28px 32px" }}>
          <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.5, marginBottom: 20 }}>ACCOUNT ACTIONS</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {[
              { icon: ShoppingBag, label: "VIEW MY ORDERS", onClick: () => router.push("/orders") },
              { icon: Lock, label: "CHANGE PASSWORD", onClick: () => router.push("/profile/change-password") },
            ].map(({ icon: Icon, label, onClick }, i) => (
              <button
                key={label}
                onClick={onClick}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "16px 0",
                  background: "transparent",
                  border: "none",
                  borderBottom: i === 0 ? `1px solid rgba(14,14,12,0.1)` : "none",
                  cursor: "pointer",
                  color: INK,
                  textAlign: "left",
                  width: "100%",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = SAFFRON; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = INK; }}
              >
                <Icon style={{ width: 14, height: 14, flexShrink: 0 }} strokeWidth={1.5} />
                <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase" }}>{label}</span>
                <span style={{ marginLeft: "auto", opacity: 0.4 }}>→</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
