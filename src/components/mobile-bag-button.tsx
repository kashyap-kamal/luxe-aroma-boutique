"use client";

import { usePathname } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";

// Pages with their own fixed buy bar, or where the bag is already the page.
const HIDDEN_ON = [/^\/products\/[^/]+/, /^\/bundles\/[^/]+/, /^\/cart/, /^\/checkout/, /^\/auth/, /^\/order-success/];

/** Floating bag button on phones; replaces the old four-tab bottom bar. Shown once the bag has something in it. */
export default function MobileBagButton(): React.JSX.Element | null {
  const pathname = usePathname() ?? "";
  const { cartItems, bundleItems, openSidebar } = useCartStore();
  const count = cartItems.reduce((t, i) => t + i.quantity, 0) + bundleItems.reduce((t, i) => t + i.quantity, 0);

  if (count === 0 || HIDDEN_ON.some((re) => re.test(pathname))) return null;

  return (
    <button
      type="button"
      onClick={openSidebar}
      aria-label={`Open bag, ${count} item${count === 1 ? "" : "s"}`}
      className="lg:hidden fixed z-40 inline-flex items-center gap-2.5"
      style={{
        right: "max(16px, env(safe-area-inset-right))",
        bottom: "calc(20px + env(safe-area-inset-bottom))",
        height: 48,
        padding: "0 18px",
        background: "#0E0E0C",
        color: "#F2EDE4",
        fontFamily: "var(--font-jetbrains-mono), monospace",
        fontSize: 10,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        boxShadow: "0 12px 24px -12px rgba(0,0,0,0.5)",
      }}
    >
      <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
      Bag
      <span
        key={count}
        className="bag-bump grid place-items-center"
        style={{ minWidth: 18, height: 18, borderRadius: 9, background: "#E8763A", color: "#0E0E0C", fontFamily: "var(--font-inter), sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: 0, padding: "0 5px" }}
      >
        {count}
      </span>
    </button>
  );
}
