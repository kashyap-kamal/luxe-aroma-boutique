"use client";

import React from "react";

const INK = "#0E0E0C";
const CREAM = "#F2EDE4";
const SAFFRON = "#E8763A";

const trustItems = [
  "100% AUTHENTIC",
  "FREE DELIVERY",
  "EASY RETURNS",
  "EXPERT SUPPORT",
  "FROM ₹499",
  "NO MIDDLEMEN",
];

const WhyChooseUs: React.FC = () => {
  return (
    <div
      style={{
        background: CREAM,
        borderTop: `1px solid ${INK}`,
        borderBottom: `1px solid ${INK}`,
        overflow: "hidden",
      }}
    >
      {/* Desktop: horizontal trust strip */}
      <div
        className="hidden md:grid"
        style={{
          gridTemplateColumns: `repeat(${trustItems.length}, 1fr)`,
        }}
      >
        {trustItems.map((item, i) => (
          <div
            key={item}
            style={{
              padding: "18px 20px",
              borderRight: i < trustItems.length - 1 ? `1px solid ${INK}` : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <span
              style={{
                color: SAFFRON,
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 10,
              }}
            >
              ★
            </span>
            <span
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 10,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: INK,
              }}
            >
              {item}
            </span>
          </div>
        ))}
      </div>

      {/* Mobile: 2-column grid */}
      <div
        className="grid md:hidden"
        style={{ gridTemplateColumns: "1fr 1fr" }}
      >
        {trustItems.map((item, i) => (
          <div
            key={item}
            style={{
              padding: "14px 16px",
              borderRight: i % 2 === 0 ? `1px solid ${INK}` : "none",
              borderBottom: i < trustItems.length - 2 ? `1px solid ${INK}` : "none",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span style={{ color: SAFFRON, fontSize: 9 }}>★</span>
            <span
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 9,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: INK,
              }}
            >
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyChooseUs;
