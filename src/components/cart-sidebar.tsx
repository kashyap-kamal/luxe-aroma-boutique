"use client";

import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { X, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore, useCartSubtotal } from "@/stores/cart-store";
import CartItem from "@/components/cart-item";
import BundleCartItem from "@/components/bundle-cart-item";
import { ScrollArea } from "@/components/ui/scroll-area";

const INK = "#0E0E0C";
const CREAM = "#F2EDE4";
const SAFFRON = "#E8763A";

const CartSidebar: React.FC = () => {
  const { cartItems, bundleItems, sidebarOpen, closeSidebar } = useCartStore();
  const subtotal = useCartSubtotal();
  const router = useRouter();
  const pathname = usePathname();

  // Don't render sidebar on the /cart page — it IS the cart
  if (pathname === "/cart") return null;

  const itemCount =
    cartItems.reduce((t, i) => t + i.quantity, 0) +
    bundleItems.reduce((t, i) => t + i.quantity, 0);

  const handleCheckout = () => {
    closeSidebar();
    router.push("/checkout");
  };

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cart-sidebar-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[55]"
            onClick={closeSidebar}
          />

          {/* Panel */}
          <motion.div
            key="cart-sidebar-panel"
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="fixed top-0 right-0 bottom-0 w-[92%] max-w-[400px] z-[56] flex flex-col"
            style={{ background: CREAM, borderLeft: `1px solid ${INK}` }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4 flex-shrink-0"
              style={{ borderBottom: `1px solid ${INK}` }}
            >
              <div className="flex items-center gap-3">
                <div
                  style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: 10,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: INK,
                  }}
                >
                  YOUR CART
                </div>
                {itemCount > 0 && (
                  <span
                    style={{
                      background: SAFFRON,
                      color: INK,
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                      fontSize: 9,
                      fontWeight: 600,
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {itemCount}
                  </span>
                )}
              </div>
              <button
                onClick={closeSidebar}
                aria-label="Close cart"
                className="transition-opacity hover:opacity-60"
              >
                <X className="h-4 w-4" style={{ color: INK }} strokeWidth={1.5} />
              </button>
            </div>

            {/* Body */}
            {itemCount === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
                <ShoppingBag className="h-10 w-10" strokeWidth={1} style={{ color: INK, opacity: 0.2 }} />
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontFamily: "var(--font-fraunces), serif",
                      fontSize: "1.4rem",
                      fontWeight: 300,
                      color: INK,
                      opacity: 0.4,
                      marginBottom: 8,
                    }}
                  >
                    Nothing here yet.
                  </div>
                  <Link
                    href="/products"
                    onClick={closeSidebar}
                    style={{
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                      fontSize: 9,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: INK,
                      opacity: 0.5,
                      textDecoration: "underline",
                    }}
                  >
                    BROWSE THE COLLECTION
                  </Link>
                </div>
              </div>
            ) : (
              <ScrollArea className="flex-1">
                <div style={{ padding: "8px 20px" }}>
                  {cartItems.map((item) => (
                    <CartItem key={item.product.id} item={item} />
                  ))}
                  {bundleItems.map((item) => (
                    <BundleCartItem key={item.bundle.id} item={item} />
                  ))}
                </div>
              </ScrollArea>
            )}

            {/* Footer */}
            {itemCount > 0 && (
              <div
                className="flex-shrink-0 px-5 py-4"
                style={{ borderTop: `1px solid ${INK}` }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                  <span
                    style={{
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                      fontSize: 9,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      opacity: 0.5,
                      color: INK,
                    }}
                  >
                    SUBTOTAL
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-fraunces), serif",
                      fontSize: "1.4rem",
                      fontWeight: 300,
                      color: INK,
                    }}
                  >
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: 9,
                    letterSpacing: "0.1em",
                    color: INK,
                    opacity: 0.4,
                    marginBottom: 16,
                  }}
                >
                  TAXES &amp; SHIPPING CALCULATED AT CHECKOUT
                </p>
                <button
                  onClick={handleCheckout}
                  style={{
                    width: "100%",
                    background: INK,
                    color: CREAM,
                    border: "none",
                    padding: "16px",
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: 11,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    marginBottom: 8,
                  }}
                >
                  PROCEED TO CHECKOUT →
                </button>
                <Link
                  href="/cart"
                  onClick={closeSidebar}
                  style={{
                    display: "block",
                    textAlign: "center",
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: 9,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: INK,
                    opacity: 0.45,
                    textDecoration: "underline",
                  }}
                >
                  VIEW FULL CART
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
