"use client";

import { useEffect } from "react";
import Link from "next/link";
import CartItem from "@/components/cart-item";
import BundleCartItem from "@/components/bundle-cart-item";
import CartSummary from "@/components/cart-summary";
import { useCartStore, useCartSubtotal } from "@/stores/cart-store";
import { toast } from "sonner";

const INK = "#0E0E0C";
const CREAM = "#F2EDE4";
const SAFFRON = "#E8763A";

const Cart = () => {
  const { cartItems, bundleItems, clearCart, refreshPrices } = useCartStore();
  const subtotal = useCartSubtotal();

  useEffect(() => {
    refreshPrices().then((pricesChanged) => {
      if (pricesChanged) {
        toast.info("Prices Updated", {
          description: "Some prices in your cart have been updated.",
        });
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const totalQty =
    cartItems.reduce((t, i) => t + i.quantity, 0) +
    bundleItems.reduce((t, i) => t + i.quantity, 0);

  const isEmpty = totalQty === 0;

  return (
    <main style={{ minHeight: "100vh", background: CREAM, color: INK }}>
      {/* Page header */}
      <div
        style={{
          borderBottom: `1px solid ${INK}`,
          padding: "56px 48px 28px",
        }}
        className="hidden md:block"
      >
        <div
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: INK,
            marginBottom: 10,
          }}
        >
          YOUR COLLECTION — {totalQty} {totalQty === 1 ? "ITEM" : "ITEMS"}
        </div>
        <h1
          style={{
            fontFamily: "var(--font-fraunces), serif",
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
            fontWeight: 300,
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
          }}
        >
          The <em>cart.</em>
        </h1>
      </div>

      {/* Mobile header */}
      <div
        className="block md:hidden"
        style={{ padding: "28px 20px 20px", borderBottom: `1px solid ${INK}` }}
      >
        <div
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 9,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          YOUR COLLECTION — {totalQty} {totalQty === 1 ? "ITEM" : "ITEMS"}
        </div>
        <h1
          style={{
            fontFamily: "var(--font-fraunces), serif",
            fontSize: "2.2rem",
            fontWeight: 300,
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
          }}
        >
          The <em>cart.</em>
        </h1>
      </div>

      {isEmpty ? (
        /* Empty state */
        <div style={{ paddingTop: 80, paddingBottom: 80, textAlign: "center" }} className="px-5 md:px-12">
          <div
            style={{
              fontFamily: "var(--font-fraunces), serif",
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              fontWeight: 300,
              fontStyle: "italic",
              color: INK,
              opacity: 0.3,
              marginBottom: 24,
            }}
          >
            Nothing here yet.
          </div>
          <div
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 10,
              letterSpacing: "0.15em",
              opacity: 0.5,
              marginBottom: 32,
            }}
          >
            YOUR CART IS EMPTY
          </div>
          <Link href="/products">
            <button
              style={{
                background: INK,
                color: CREAM,
                border: "none",
                padding: "16px 32px",
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 11,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              BROWSE THE COLLECTION →
            </button>
          </Link>
        </div>
      ) : (
        <div
          style={{
            gridTemplateColumns: "1fr 360px",
          }}
          className="hidden md:grid"
        >
          {/* Items */}
          <div style={{ borderRight: `1px solid ${INK}`, padding: "0 48px 48px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px 0",
                borderBottom: `1px solid ${INK}`,
                marginBottom: 0,
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: 10,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  opacity: 0.6,
                }}
              >
                PRODUCT
              </div>
              <button
                onClick={clearCart}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: 9,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  opacity: 0.4,
                  color: INK,
                  textDecoration: "underline",
                }}
              >
                CLEAR ALL
              </button>
            </div>

            {cartItems.map((item) => (
              <CartItem key={item.product.id} item={item} />
            ))}
            {bundleItems.map((item) => (
              <BundleCartItem key={item.bundle.id} item={item} />
            ))}

            <div style={{ marginTop: 32 }}>
              <Link
                href="/products"
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: 10,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: INK,
                  textDecoration: "underline",
                  opacity: 0.6,
                }}
              >
                ← CONTINUE SHOPPING
              </Link>
            </div>
          </div>

          {/* Summary */}
          <div style={{ padding: "32px 48px" }}>
            <CartSummary subtotal={subtotal} />
          </div>
        </div>
      )}

      {/* Mobile layout */}
      {!isEmpty && (
        <div className="block md:hidden">
          <div style={{ padding: "0 20px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 0",
                borderBottom: `1px solid ${INK}`,
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: 9,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  opacity: 0.5,
                }}
              >
                ITEMS
              </div>
              <button
                onClick={clearCart}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: 9,
                  letterSpacing: "0.1em",
                  opacity: 0.4,
                  color: INK,
                  textDecoration: "underline",
                  textTransform: "uppercase",
                }}
              >
                CLEAR ALL
              </button>
            </div>
            {cartItems.map((item) => (
              <CartItem key={item.product.id} item={item} />
            ))}
            {bundleItems.map((item) => (
              <BundleCartItem key={item.bundle.id} item={item} />
            ))}
          </div>
          <div style={{ padding: "24px 20px", borderTop: `1px solid ${INK}` }}>
            <CartSummary subtotal={subtotal} />
          </div>
          <div className="h-20" />
        </div>
      )}
    </main>
  );
};

export default Cart;
