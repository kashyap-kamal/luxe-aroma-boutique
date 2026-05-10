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

const ShippingDelivery: React.FC = () => {
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
            LEGAL / SHIPPING &amp; DELIVERY
          </div>
          <h1 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 300, lineHeight: 0.95, letterSpacing: "-0.03em", margin: 0 }}>
            Shipping &amp; <em>Delivery</em>
          </h1>
          <p style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, letterSpacing: "0.15em", marginTop: 16, opacity: 0.5 }}>
            LAST UPDATED: APRIL 2026
          </p>
        </div>
      </div>

      {/* Quick stats row */}
      <div style={{ borderBottom: `1px solid ${INK}` }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-[#0E0E0C]">
          {[
            { label: "DELIVERY TIME", value: "3–9 days" },
            { label: "COVERAGE", value: "Pan-India" },
            { label: "MODE", value: "Surface only" },
            { label: "TRACKING", value: "SMS + Email" },
          ].map((stat, i) => (
            <div key={i} style={{ padding: "20px 24px" }} className={i === 0 || i === 2 ? "border-l-0" : ""}>
              <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.5, marginBottom: 6 }}>{stat.label}</div>
              <div style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "1.4rem", fontWeight: 300 }}>{stat.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ paddingTop: 48, paddingBottom: 80 }} className="px-5 md:px-12">
        <div className="max-w-4xl mx-auto" style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 15, color: "#3A3833" }}>

          {/* Important notice */}
          <div style={{ background: `rgba(232,118,58,0.08)`, border: `1px solid ${SAFFRON}`, padding: "20px 24px", marginBottom: 32, display: "flex", gap: 16, alignItems: "flex-start" }}>
            <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: SAFFRON, flexShrink: 0, paddingTop: 2 }}>NOTICE</span>
            <p style={{ margin: 0, lineHeight: 1.65 }}>
              Ethanol-based perfumes are classified as <strong>flammable goods under IATA aviation regulations</strong> and cannot be transported by air. All our fragrance orders are shipped via <strong>surface (ground) courier only</strong>, typically taking 5–9 business days. We partner with Shiprocket to connect you with the best available surface courier for your pin code.
            </p>
          </div>

          <h2 style={h2Style}>Shipping</h2>
          <p style={pStyle}>All orders ship via surface courier through Shiprocket&apos;s courier network (Shadowfax, Delhivery, Ekart, XpressBees and others depending on your pin code).</p>
          <ul style={ulStyle}>
            <li style={liStyle}><strong>Delivery time:</strong> 3–9 business days (varies by zone and courier)</li>
            <li style={liStyle}><strong>Cost:</strong> As displayed at checkout (free shipping available when active)</li>
            <li style={liStyle}><strong>Coverage:</strong> All serviceable pin codes across India</li>
            <li style={liStyle}><strong>Tracking:</strong> AWB number sent via SMS &amp; email after dispatch</li>
            <li style={liStyle}><strong>Liability:</strong> Shiprocket base coverage up to ₹5,000 per shipment without add-on insurance</li>
          </ul>
          <p style={{ ...pStyle, opacity: 0.6, fontSize: 13 }}>Express and same-day delivery are not available for perfumes due to air shipping restrictions on flammable goods.</p>

          <h2 style={h2Style}>Estimated Delivery Timeline</h2>
          <div style={{ overflowX: "auto", marginBottom: 24 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-inter), sans-serif", fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${INK}` }}>
                  {["Zone", "Cities / States", "Est. Days"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Metro", "Delhi NCR, Mumbai, Bangalore, Chennai, Hyderabad, Kolkata", "3–5 days"],
                  ["Tier 1", "Pune, Ahmedabad, Jaipur, Lucknow, Chandigarh", "4–6 days"],
                  ["Tier 2/3", "Other cities & state capitals", "5–8 days"],
                  ["Remote", "Smaller towns, J&K, Northeast", "7–9 days"],
                ].map(([zone, cities, days], i) => (
                  <tr key={i} style={{ borderBottom: `1px solid rgba(14,14,12,0.1)`, background: i % 2 === 1 ? "rgba(14,14,12,0.03)" : "transparent" }}>
                    <td style={{ padding: "12px 16px", fontWeight: 500, whiteSpace: "nowrap" }}>{zone}</td>
                    <td style={{ padding: "12px 16px" }}>{cities}</td>
                    <td style={{ padding: "12px 16px", fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 12, whiteSpace: "nowrap" }}>{days}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ ...pStyle, fontSize: 13, opacity: 0.6 }}>Timelines exclude processing time (1–2 business days). Actual delivery may vary due to courier load, weather, or public holidays.</p>

          <h2 style={h2Style}>Shipping Costs</h2>
          <p style={pStyle}>Shipping charges and free shipping eligibility are displayed at checkout and may change based on current promotions. When free shipping is active, it applies to all serviceable pin codes with no minimum order restriction.</p>

          <h2 style={h2Style}>Order Processing</h2>
          <ul style={ulStyle}>
            <li style={liStyle}><strong>Order confirmation:</strong> Within 30 minutes of payment</li>
            <li style={liStyle}><strong>Standard orders:</strong> Processed within 1–2 business days</li>
            <li style={liStyle}><strong>Bulk orders (5+ items):</strong> 2–3 business days</li>
            <li style={liStyle}>Orders placed on weekends/holidays are processed the next business day</li>
          </ul>

          <h2 style={h2Style}>Tracking &amp; Updates</h2>
          <p style={pStyle}>After dispatch you will receive an AWB number via email and SMS. You can track your shipment on the courier partner&apos;s website or directly in your <Link href="/orders" style={{ color: SAFFRON }}>orders dashboard</Link>.</p>

          <h2 style={h2Style}>Delivery Terms</h2>
          <ul style={ulStyle}>
            <li style={liStyle}><strong>Delivery attempts:</strong> Couriers make up to 3 attempts. After 3 failed attempts a Non-Delivery Report (NDR) is raised and the shipment is returned to us (RTO). The order amount is refunded once we receive and verify the returned package.</li>
            <li style={liStyle}><strong>Address changes:</strong> Cannot be made once the order has shipped. Contact us immediately at <a href="mailto:contact@aromeluxe.in" style={{ color: SAFFRON }}>contact@aromeluxe.in</a> if needed.</li>
            <li style={liStyle}><strong>Incorrect address:</strong> We are not responsible for delays or failed deliveries due to incorrect or incomplete addresses.</li>
            <li style={liStyle}><strong>Cash on Delivery:</strong> Not available. All orders are prepaid.</li>
          </ul>

          <h2 style={h2Style}>International Shipping</h2>
          <p style={pStyle}>We currently ship within India only. International shipping is not available at this time.</p>

          <h2 style={h2Style}>Support</h2>
          <p style={pStyle}>For delivery queries, email us at <a href="mailto:contact@aromeluxe.in" style={{ color: SAFFRON }}>contact@aromeluxe.in</a>. Support hours: Monday–Saturday 9 AM–7 PM, Sunday 10 AM–6 PM. Response within 2–4 hours during working hours.</p>
        </div>
      </div>
    </div>
  );
};

export default ShippingDelivery;
