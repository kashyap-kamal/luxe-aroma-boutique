import React from "react";
import Link from "next/link";

const INK = "#0E0E0C";
const CREAM = "#F2EDE4";
const SAFFRON = "#E8763A";

interface CartSummaryProps {
  subtotal: number;
}

const CartSummary: React.FC<CartSummaryProps> = ({ subtotal }) => {
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
            ₹{subtotal.toLocaleString("en-IN")}
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
