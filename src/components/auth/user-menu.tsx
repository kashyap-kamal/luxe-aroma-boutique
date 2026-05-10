"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser, useLogout } from "@/stores/auth-store";
import { signOut } from "@/lib/auth-service";
import { User, LogOut, ShoppingBag, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const INK = "#0E0E0C";
const CREAM = "#F2EDE4";
const SAFFRON = "#E8763A";

export function UserMenu() {
  const user = useUser();
  const logout = useLogout();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSignOut = async () => {
    setOpen(false);
    await signOut();
    logout();
    router.push("/");
  };

  if (!user) return null;

  const initials =
    user.user_metadata?.full_name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ||
    user.email?.[0]?.toUpperCase() ||
    "U";

  const displayName = user.user_metadata?.full_name?.split(" ")[0] || user.email;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
        }}
        aria-label="Account menu"
      >
        <span
          style={{
            width: 28,
            height: 28,
            background: INK,
            color: CREAM,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 10,
            letterSpacing: "0.05em",
            flexShrink: 0,
          }}
        >
          {initials}
        </span>
        <ChevronDown
          className="h-3 w-3 transition-transform"
          style={{ color: INK, transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          strokeWidth={1.5}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.12 }}
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              right: 0,
              minWidth: 220,
              background: CREAM,
              border: `1px solid ${INK}`,
              zIndex: 100,
            }}
          >
            {/* Name + email header */}
            <div
              style={{
                padding: "14px 18px",
                borderBottom: `1px solid ${INK}`,
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-fraunces), serif",
                  fontSize: 15,
                  fontWeight: 300,
                  color: INK,
                  letterSpacing: "-0.01em",
                }}
              >
                {displayName}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: 10,
                  color: INK,
                  opacity: 0.5,
                  marginTop: 3,
                  letterSpacing: "0.03em",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user.email}
              </div>
            </div>

            {/* Menu items */}
            {[
              { label: "PROFILE", icon: User, href: "/profile" },
              { label: "ORDERS", icon: ShoppingBag, href: "/orders" },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => { setOpen(false); router.push(item.href); }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px 18px",
                  background: "none",
                  border: "none",
                  borderBottom: `1px solid rgba(14,14,12,0.08)`,
                  cursor: "pointer",
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  color: INK,
                  textAlign: "left",
                  transition: "background 0.1s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = INK) && (e.currentTarget.style.color = CREAM) || void (e.currentTarget.style.color = CREAM)}
                onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = INK; }}
              >
                <item.icon className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={1.5} />
                {item.label}
              </button>
            ))}

            {/* Sign out */}
            <button
              onClick={handleSignOut}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 18px",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 10,
                letterSpacing: "0.18em",
                color: SAFFRON,
                textAlign: "left",
                transition: "background 0.1s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = SAFFRON) || void (e.currentTarget.style.color = INK)}
              onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = SAFFRON; }}
            >
              <LogOut className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={1.5} />
              SIGN OUT
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
