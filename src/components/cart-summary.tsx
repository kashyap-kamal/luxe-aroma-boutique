"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/stores/cart-store";
import { validateCoupon } from "@/lib/coupon-service";
import { calculateCouponDiscount, roundCurrency } from "@/lib/checkout-pricing";
import { toast } from "sonner";

const INK = "#0E0E0C";
const CREAM = "#F2EDE4";
const SAFFRON = "#E8763A";

interface CartSummaryProps {
  subtotal: number;
}

const CartSummary: React.FC<CartSummaryProps> = ({ subtotal }) => {
  const { appliedCoupon, applyCoupon, removeCoupon } = useCartStore();
  const [codeInput, setCodeInput] = useState("");
  const [applying, setApplying] = useState(false);

  const couponCheck = calculateCouponDiscount(subtotal, appliedCoupon);
  const discount = couponCheck.valid ? couponCheck.discount : 0;
  const payableSubtotal = roundCurrency(Math.max(0, subtotal - discount));

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeInput.trim()) return;
    setApplying(true);
    try {
      const res = await validateCoupon(codeInput, subtotal);
      if (res.valid && res.coupon) {
        applyCoupon(res.coupon);
        setCodeInput("");
        toast.success(`Coupon ${res.coupon.code} applied`);
      } else {
        toast.error(res.error || "Invalid coupon code");
      }
    } catch {
      toast.error("Could not validate coupon right now");
    } finally {
      setApplying(false);
    }
  };

  return (
    <div style={{ border: `1px solid ${INK}`, background: CREAM }}>
      <div
        style={{
          padding: "16px 20px",
          borderBottom: `1px solid ${INK}`,
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: 10,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: INK,
        }}
      >
        ORDER SUMMARY
      </div>

      <div style={{ padding: "20px" }}>
        {/* Coupon Section */}
        <div style={{ marginBottom: 18, paddingBottom: 18, borderBottom: `1px dotted ${INK}` }}>
          {appliedCoupon && couponCheck.valid ? (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: 10,
                  letterSpacing: "0.14em",
                  color: SAFFRON,
                }}
              >
                CODE: {appliedCoupon.code}
              </span>
              <button
                type="button"
                onClick={removeCoupon}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: 9,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: INK,
                  textDecoration: "underline",
                  opacity: 0.7,
                }}
              >
                REMOVE
              </button>
            </div>
          ) : (
            <form onSubmit={handleApplyCoupon} style={{ display: "flex", gap: 6 }}>
              <input
                type="text"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                placeholder="COUPON CODE"
                aria-label="Coupon code"
                style={{
                  flex: 1,
                  background: "transparent",
                  border: `1px solid ${INK}`,
                  padding: "9px 10px",
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: 10,
                  letterSpacing: "0.14em",
                  color: INK,
                  outline: "none",
                }}
              />
              <button
                type="submit"
                disabled={applying || !codeInput.trim()}
                style={{
                  background: INK,
                  color: CREAM,
                  border: "none",
                  padding: "9px 14px",
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: 10,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  cursor: applying || !codeInput.trim() ? "not-allowed" : "pointer",
                  opacity: applying || !codeInput.trim() ? 0.5 : 1,
                }}
              >
                {applying ? "..." : "APPLY"}
              </button>
            </form>
          )}
          {appliedCoupon && !couponCheck.valid && couponCheck.error && (
            <div
              style={{
                marginTop: 6,
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 9,
                color: SAFFRON,
              }}
            >
              {couponCheck.error}
            </div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <span
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 10,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              opacity: 0.6,
              color: INK,
            }}
          >
            Subtotal
          </span>
          <span
            style={{
              fontFamily: "var(--font-fraunces), serif",
              fontSize: "1rem",
              fontWeight: 300,
              color: INK,
            }}
          >
            ₹{subtotal.toLocaleString("en-IN")}
          </span>
        </div>

        {discount > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <span
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 10,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: SAFFRON,
              }}
            >
              Discount ({appliedCoupon?.code})
            </span>
            <span
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 11,
                color: SAFFRON,
              }}
            >
              -₹{discount.toLocaleString("en-IN")}
            </span>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, paddingBottom: 20, borderBottom: `1px dotted ${INK}` }}>
          <span
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 10,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              opacity: 0.6,
              color: INK,
            }}
          >
            Shipping
          </span>
          <span
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 10,
              color: SAFFRON,
              letterSpacing: "0.1em",
            }}
          >
            CALC. AT CHECKOUT
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
          <span
            style={{
              fontFamily: "var(--font-fraunces), serif",
              fontSize: "1.1rem",
              fontWeight: 300,
              color: INK,
            }}
          >
            Total
          </span>
          <span
            style={{
              fontFamily: "var(--font-fraunces), serif",
              fontSize: "1.3rem",
              fontWeight: 300,
              color: INK,
            }}
          >
            ₹{payableSubtotal.toLocaleString("en-IN")}
          </span>
        </div>

        <div
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 9,
            letterSpacing: "0.1em",
            opacity: 0.5,
            color: INK,
            marginBottom: 20,
          }}
        >
          GST & shipping calculated at checkout
        </div>

        <Link href="/checkout">
          <button
            style={{
              width: "100%",
              background: INK,
              color: CREAM,
              border: "none",
              padding: "16px 20px",
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            PROCEED TO CHECKOUT →
          </button>
        </Link>
      </div>
    </div>
  );
};

export default CartSummary;
