"use client";

import { useState } from "react";
import Link from "next/link";

const INK = "#0E0E0C";
const CREAM = "#F2EDE4";
const SAFFRON = "#E8763A";

const moods = [
  { name: "FRESH", sub: "citrus · marine", bg: "#C7DCC8", fg: INK, count: "12", href: "/products?tag=fresh" },
  { name: "WOODY", sub: "cedar · sandal", bg: "#8B5A3C", fg: CREAM, count: "08", href: "/products?tag=woody" },
  { name: "SPICY", sub: "pepper · cardamom", bg: "#C24F1B", fg: CREAM, count: "06", href: "/products?tag=spicy" },
  { name: "FLORAL", sub: "rose · jasmine", bg: "#E8B4B8", fg: INK, count: "09", href: "/products?tag=floral" },
  { name: "OUD", sub: "amber · resin", bg: "#2A1810", fg: SAFFRON, count: "07", href: "/products?tag=oud" },
  { name: "GOURMAND", sub: "vanilla · coffee", bg: "#D4A574", fg: INK, count: "04", href: "/products?tag=sweet" },
];

export default function CollectionsSection() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section style={{ borderBottom: `1px solid ${INK}`, background: CREAM }}>
      {/* Section header */}
      <div
        style={{
          padding: "40px 48px 20px",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
        className="hidden md:flex"
      >
        <div>
          <div
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            FEATURE 02 / SHOP BY MOOD
          </div>
          <h2
            style={{
              fontSize: "clamp(3rem, 6vw, 5rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              fontWeight: 300,
              margin: "10px 0 0",
              fontFamily: "var(--font-fraunces), serif",
            }}
          >
            The atlas of{" "}
            <em style={{ fontWeight: 300 }}>olfactory</em> moods.
          </h2>
        </div>
        <div
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 13,
            color: "#3A3833",
            maxWidth: 260,
            lineHeight: 1.5,
          }}
        >
          Six territories. Forty-two scents. Pick a mood, we&apos;ll do the
          cartography.
        </div>
      </div>

      {/* Mobile header */}
      <div className="flex md:hidden items-baseline justify-between" style={{ padding: "30px 20px 16px" }}>
        <h2 style={{ fontSize: "1.75rem", lineHeight: 1, letterSpacing: "-0.02em", fontWeight: 300, fontFamily: "var(--font-fraunces), serif", margin: 0 }}>
          Shop by <em>mood</em>
        </h2>
        <Link href="/products" style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: INK, opacity: 0.6 }}>
          All
        </Link>
      </div>

      {/* Mood grid: responsive editorial strip on desktop */}
      <div
        className="hidden md:flex"
        style={{
          borderTop: `1px solid ${INK}`,
          overflowX: "auto",
          overflowY: "hidden",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {moods.map((mood, i) => (
          <Link
            key={mood.name}
            href={mood.href}
            style={{
              background: mood.bg,
              color: mood.fg,
              flex: "1 0 220px",
              minWidth: 220,
              height: 240,
              borderRight: i < moods.length - 1 ? `1px solid ${INK}` : "none",
              padding: 20,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
              cursor: "pointer",
              boxShadow: hovered === i ? `inset 0 0 0 2px ${mood.fg}` : "none",
              transition: "box-shadow 220ms ease",
              zIndex: hovered === i ? 2 : 1,
              textDecoration: "none",
            }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <div
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 10,
                letterSpacing: "0.2em",
              }}
            >
              N° {String(i + 1).padStart(2, "0")}
            </div>
            <div
              style={{
                transform: hovered === i ? "translateY(-4px)" : "translateY(0)",
                transition: "transform 220ms ease",
              }}
            >
              <div
                style={{
                  fontSize: "clamp(1.5rem, 2.1vw, 2.5rem)",
                  lineHeight: 0.95,
                  fontWeight: 300,
                  letterSpacing: "-0.02em",
                  fontFamily: "var(--font-fraunces), serif",
                }}
              >
                {mood.name}
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontFamily: "var(--font-inter), sans-serif",
                  fontStyle: "italic",
                  marginTop: 4,
                  opacity: 0.85,
                }}
              >
                {mood.sub}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 10,
                letterSpacing: "0.15em",
              }}
            >
              <span>{mood.count} SCENTS</span>
              <span
                style={{
                  display: "inline-block",
                  transform: hovered === i ? "translateX(4px)" : "translateX(0)",
                  transition: "transform 220ms ease",
                }}
              >
                →
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Mobile: swipe row */}
      <div className="swipe-row md:hidden" style={{ paddingBottom: 30 }}>
        {moods.map((mood, i) => (
          <Link
            key={mood.name}
            href={mood.href}
            className="flex flex-col justify-between active:scale-[0.97]"
            style={{ width: 124, height: 164, padding: 14, background: mood.bg, color: mood.fg }}
          >
            <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 9, letterSpacing: "0.18em" }}>N° {String(i + 1).padStart(2, "0")}</span>
            <span>
              <span style={{ display: "block", fontFamily: "var(--font-fraunces), serif", fontWeight: 300, fontSize: 24, lineHeight: 1, textTransform: "capitalize" }}>{mood.name.toLowerCase()}</span>
              <span style={{ display: "block", fontSize: 11, fontStyle: "italic", opacity: 0.8, marginTop: 4 }}>{mood.sub}</span>
            </span>
            <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 9, letterSpacing: "0.16em" }}>{mood.count} SCENTS</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
