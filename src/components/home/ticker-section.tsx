"use client";

const ITEMS = [
  "★ 100% AUTHENTIC",
  "★ FREE DELIVERY",
  "★ EASY RETURNS",
  "★ EXPERT SUPPORT",
  "★ FROM ₹499",
  "★ NO MIDDLEMEN",
  "★ DIRECT FROM INDIA",
  "★ 2,341 FIVE-STAR WRISTS",
];

const TEXT = ITEMS.join("  ") + "  " + ITEMS.join("  ");

export default function TickerSection() {
  return (
    <div
      style={{
        background: "#0E0E0C",
        color: "#F2EDE4",
        borderBottom: "1px solid #0E0E0C",
        padding: "13px 0",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div className="ticker-inner">
        <span
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 11,
            letterSpacing: "0.2em",
            whiteSpace: "nowrap",
            display: "inline-block",
          }}
        >
          {TEXT}&nbsp;&nbsp;{TEXT}
        </span>
      </div>
    </div>
  );
}
