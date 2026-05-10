import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const INK = "#0E0E0C";
const CREAM = "#F2EDE4";
const SAFFRON = "#E8763A";

const h2Style = {
  fontFamily: "var(--font-fraunces), serif",
  fontSize: "1.6rem",
  fontWeight: 300,
  color: INK,
  letterSpacing: "-0.02em",
  borderTop: `1px solid ${INK}`,
  paddingTop: 20,
  marginBottom: 16,
  marginTop: 40,
};
const pStyle = { marginBottom: 14, lineHeight: 1.75 };
const ulStyle = { listStyle: "disc", paddingLeft: 24, marginBottom: 20 };
const liStyle = { marginBottom: 8 };

const CancellationRefund: React.FC = () => {
  return (
    <div style={{ minHeight: "100vh", background: CREAM, color: INK, paddingTop: 80 }}>
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${INK}`, paddingTop: 40, paddingBottom: 40 }} className="px-5 md:px-12">
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
              marginBottom: 24,
              opacity: 0.6,
            }}
          >
            <ArrowLeft className="h-3 w-3" />
            Back to Home
          </Link>
          <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12, opacity: 0.5 }}>
            LEGAL / CANCELLATION &amp; REFUND
          </div>
          <h1 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 300, lineHeight: 0.95, letterSpacing: "-0.03em", margin: 0 }}>
            Cancellation &amp; <em>Refund</em>
          </h1>
          <p style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, letterSpacing: "0.15em", marginTop: 16, opacity: 0.5 }}>
            LAST UPDATED: APRIL 2026
          </p>
        </div>
      </div>

      {/* Quick stats row */}
      <div style={{ borderBottom: `1px solid ${INK}` }}>
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 divide-x-0 sm:divide-x divide-[#0E0E0C]">
          {[
            { label: "RETURN WINDOW", value: "7 days" },
            { label: "REFUND TIME", value: "5–7 working days" },
            { label: "DEFECT RETURNS", value: "Free shipping" },
          ].map((stat, i) => (
            <div key={i} style={{ padding: "20px 24px" }}>
              <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.5, marginBottom: 6 }}>{stat.label}</div>
              <div style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "1.4rem", fontWeight: 300 }}>{stat.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ paddingTop: 48, paddingBottom: 80 }} className="px-5 md:px-12">
        <div className="max-w-4xl mx-auto" style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 15, color: "#3A3833" }}>

          <h2 style={h2Style}>Order Cancellation</h2>
          <p style={pStyle}>You can cancel your order for free <strong>within 2 hours of placing it</strong>, provided it hasn&apos;t been processed for shipping. Once processing begins, you will need to follow our return process to receive a refund.</p>
          <p style={pStyle}><strong>How to cancel:</strong> Email <a href="mailto:contact@aromeluxe.in" style={{ color: SAFFRON }}>contact@aromeluxe.in</a> with your order number and reason. We will confirm cancellation and process your refund within 24 hours.</p>

          <h2 style={h2Style}>Returns</h2>
          <p style={pStyle}>You have <strong>7 days from the date of delivery</strong> to initiate a return. Items must be in their original condition with all packaging and tags intact, and seals must be unbroken.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div style={{ border: `1px solid rgba(14,14,12,0.15)`, padding: "20px 24px" }}>
              <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12, color: SAFFRON }}>RETURNABLE</div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: 14 }}>
                {["Unopened perfumes in original packaging", "Defective or damaged items", "Wrong items delivered", "Items not matching description"].map(item => (
                  <li key={item} style={{ padding: "6px 0", borderBottom: "1px solid rgba(14,14,12,0.06)" }}>✓ {item}</li>
                ))}
              </ul>
            </div>
            <div style={{ border: `1px solid rgba(14,14,12,0.15)`, padding: "20px 24px", background: "rgba(14,14,12,0.02)" }}>
              <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12, opacity: 0.5 }}>NOT RETURNABLE</div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: 14 }}>
                {["Opened or used perfumes", "Personalised or custom items", "Items damaged by customer", "Items without original packaging", "Sale items (unless defective)"].map(item => (
                  <li key={item} style={{ padding: "6px 0", borderBottom: "1px solid rgba(14,14,12,0.06)", opacity: 0.6 }}>✗ {item}</li>
                ))}
              </ul>
            </div>
          </div>

          <p style={pStyle}><strong>Return process:</strong> Contact us within 7 days → get a return authorisation (RMA) → pack securely in original packaging → ship back. We will inspect within 2–3 business days of receipt.</p>

          <h2 style={h2Style}>Refunds</h2>
          <div style={{ border: `1px solid rgba(14,14,12,0.15)`, marginBottom: 24 }}>
            {[
              ["Return received & inspected", "1–2 business days"],
              ["Refund initiated by us", "2–3 business days"],
              ["Bank/card credit (via Cashfree)", "5–7 working days"],
              ["Total time from return receipt", "7–12 working days"],
            ].map(([label, time], i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: i < 3 ? "1px solid rgba(14,14,12,0.08)" : "none", background: i === 3 ? "rgba(14,14,12,0.04)" : "transparent" }}>
                <span style={{ fontWeight: i === 3 ? 600 : 400, color: INK }}>{label}</span>
                <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 12, letterSpacing: "0.1em", color: i === 3 ? SAFFRON : INK }}>{time}</span>
              </div>
            ))}
          </div>

          <div style={{ background: `rgba(232,118,58,0.06)`, border: `1px solid rgba(232,118,58,0.3)`, padding: "16px 20px", marginBottom: 24 }}>
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.65 }}>
              <strong>Important:</strong> Refund processing after initiation is managed by Cashfree Payments (RBI-authorised) and your bank, and is outside our direct control.{" "}
              <strong>Cash refunds are not available.</strong> All refunds go to the original payment method only. Refunds cannot be processed for transactions older than 120 days from the purchase date.
            </p>
          </div>

          <h3 style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: INK, marginTop: 24, marginBottom: 12 }}>Refund Methods</h3>
          <ul style={ulStyle}>
            <li style={liStyle}><strong>UPI:</strong> 1–3 working days after initiation</li>
            <li style={liStyle}><strong>Credit / Debit cards:</strong> 5–7 working days</li>
            <li style={liStyle}><strong>Net banking:</strong> 3–5 working days</li>
          </ul>

          <h2 style={h2Style}>Return Shipping Costs</h2>
          <ul style={ulStyle}>
            <li style={liStyle}><strong>We pay return shipping</strong> for: defective/damaged items, wrong items delivered, our fulfilment error.</li>
            <li style={liStyle}><strong>Customer pays return shipping</strong> for: change of mind, preference changes, items ordered by mistake.</li>
          </ul>

          <h2 style={h2Style}>Exchanges</h2>
          <p style={pStyle}>We offer exchanges for defective items or wrong items delivered, subject to stock availability, within 7 days of delivery. If the replacement item is higher-priced, the difference will be charged; if lower-priced, we will refund the difference.</p>

          <h2 style={h2Style}>Contact</h2>
          <p style={pStyle}>To initiate a return or refund, email <a href="mailto:contact@aromeluxe.in" style={{ color: SAFFRON }}>contact@aromeluxe.in</a> with your order number and reason. Support hours: Mon–Sat 9 AM–7 PM. Response within 24 hours.</p>

          <p style={{ ...pStyle, fontSize: 13, opacity: 0.5 }}>This policy may be updated from time to time. Continued use of our service after changes constitutes acceptance of the updated policy.</p>
        </div>
      </div>
    </div>
  );
};

export default CancellationRefund;
