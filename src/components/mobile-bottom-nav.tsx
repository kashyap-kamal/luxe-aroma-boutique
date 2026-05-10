"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid2X2, ShoppingBag, Menu } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { useUIStore } from "@/stores/ui-store";

const INK = "#0E0E0C";
const CREAM = "#F2EDE4";
const SAFFRON = "#E8763A";

const NAV_ITEMS = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Shop", icon: Grid2X2, href: "/products" },
] as const;

const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const { cartItems, bundleItems, openSidebar } = useCartStore();
  const { openNavDrawer } = useUIStore();

  const itemCount =
    cartItems.reduce((t, i) => t + i.quantity, 0) +
    bundleItems.reduce((t, i) => t + i.quantity, 0);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden grid grid-cols-4"
      style={{
        background: CREAM,
        borderTop: `1px solid ${INK}`,
        paddingBottom: "env(safe-area-inset-bottom)",
        height: "calc(56px + env(safe-area-inset-bottom))",
      }}
    >
      {NAV_ITEMS.map(({ label, icon: Icon, href }) => {
        const active = isActive(href);
        return (
          <Link
            key={label}
            href={href}
            className="flex flex-col items-center justify-center gap-0.5 active:opacity-60"
            style={{ background: active ? INK : "transparent" }}
          >
            <Icon
              className="h-5 w-5"
              strokeWidth={active ? 2 : 1.5}
              style={{ color: active ? CREAM : INK }}
            />
            <span
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: "8px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: active ? CREAM : INK,
                opacity: active ? 1 : 0.55,
              }}
            >
              {label}
            </span>
          </Link>
        );
      })}

      {/* Cart */}
      <button
        onClick={openSidebar}
        className="flex flex-col items-center justify-center gap-0.5 active:opacity-60 relative"
        style={{ background: "transparent", border: "none", cursor: "pointer" }}
        aria-label="Open cart"
      >
        <span className="relative">
          <ShoppingBag className="h-5 w-5" strokeWidth={1.5} style={{ color: INK }} />
          {itemCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: -6,
                right: -8,
                background: SAFFRON,
                color: INK,
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 8,
                letterSpacing: 0,
                width: 16,
                height: 16,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 600,
              }}
            >
              {itemCount}
            </span>
          )}
        </span>
        <span
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: "8px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: INK,
            opacity: 0.55,
          }}
        >
          Cart
        </span>
      </button>

      {/* Menu */}
      <button
        onClick={openNavDrawer}
        className="flex flex-col items-center justify-center gap-0.5 active:opacity-60"
        style={{ background: "transparent", border: "none", cursor: "pointer" }}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" strokeWidth={1.5} style={{ color: INK }} />
        <span
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: "8px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: INK,
            opacity: 0.55,
          }}
        >
          Menu
        </span>
      </button>
    </nav>
  );
};

export default MobileBottomNav;
