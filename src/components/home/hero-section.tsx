"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/stores/cart-store";
import { useProducts } from "@/hooks/use-products";

const INK = "#0E0E0C";
const CREAM = "#F2EDE4";
const SAFFRON = "#E8763A";

const tableOfContents = [
  ["Editorial", "02"],
  ["Signature Series", "04"],
  ["Mood Atlas", "08"],
  ["Quiz / Diagnostic", "12"],
  ["Letters", "16"],
];

interface HeroSectionProps {
  products: Product[];
}

export default function HeroSection({ products: initialProducts }: HeroSectionProps) {
  const { products } = useProducts(initialProducts, { featured: true, limit: 8 });
  const minPrice = products.length > 0
    ? Math.min(...products.map(p => p.price.current))
    : 499;

  return (
    <div style={{ background: CREAM, color: INK, fontFamily: "var(--font-fraunces), serif" }}>
      {/* MASTHEAD */}
      <div style={{ borderBottom: `1px solid ${INK}` }}>
        <div
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 48px",
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 11,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
          className="hidden md:flex"
        >
          <span>Vol. XII · Édition de Mai · MMXXVI</span>
          <span>No. 0427 — Bombay · Paris · Grasse</span>
          <span>₹ — Free shipping above ₹999</span>
        </div>
        <div
          style={{
            padding: "9px 20px",
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 9,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            textAlign: "center",
            color: INK,
          }}
          className="flex md:hidden"
        >
          FREE SHIPPING ON ALL ORDERS · BOMBAY, INDIA
        </div>
      </div>

      {/* HERO — asymmetric editorial grid */}
      <section
        className="hidden md:grid"
        style={{
          gridTemplateColumns: "5fr 4fr 3fr",
          borderBottom: `1px solid ${INK}`,
          minHeight: 680,
        }}
      >
        {/* LEFT: headline */}
        <div
          style={{
            padding: "56px 48px",
            borderRight: `1px solid ${INK}`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            FEATURE — 01
          </div>
          <div>
            <h1
              style={{
                fontSize: "clamp(4rem, 7.5vw, 9rem)",
                lineHeight: 0.88,
                letterSpacing: "-0.04em",
                fontWeight: 300,
                margin: 0,
                fontVariationSettings: '"opsz" 144',
              }}
            >
              Masterfully{" "}
              <br />
              <em style={{ fontStyle: "italic", fontWeight: 300 }}>crafted.</em>
              <br />
              Unapolo&shy;getically
              <br />
              <span
                style={{
                  background: SAFFRON,
                  color: CREAM,
                  padding: "0 12px",
                  display: "inline-block",
                  transform: "rotate(-1deg)",
                }}
              >
                accessible.
              </span>
            </h1>
            <p
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: 14,
                lineHeight: 1.6,
                maxWidth: 440,
                marginTop: 28,
                color: "#3A3833",
              }}
            >
              Premium fragrances from{" "}
              <span
                style={{
                  background: INK,
                  color: CREAM,
                  padding: "0 4px",
                }}
              >
                ₹{minPrice}
              </span>
              . Crafted for the connoisseur who refuses to pay the boutique
              tax. We cut the middlemen, not the molecules.
            </p>
          </div>
          <div style={{ display: "flex", gap: 0, marginTop: 24 }}>
            <Link
              href="/products?featured=true"
              style={{
                background: INK,
                color: CREAM,
                padding: "18px 28px",
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 11,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              SHOP BESTSELLERS →
            </Link>
            <Link
              href="/quiz"
              style={{
                background: "transparent",
                color: INK,
                border: `1px solid ${INK}`,
                borderLeft: "none",
                padding: "18px 28px",
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 11,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              TAKE THE QUIZ
            </Link>
          </div>
        </div>

        {/* CENTER: hero bottle vitrine */}
        <div
          style={{
            position: "relative",
            borderRight: `1px solid ${INK}`,
            background: `radial-gradient(ellipse at 50% 60%, #E8763A 0%, #C24F1B 50%, #6B2310 100%)`,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 20,
              left: 20,
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 10,
              letterSpacing: "0.2em",
              color: CREAM,
            }}
          >
            PLATE I.
          </div>
          <div
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 10,
              letterSpacing: "0.2em",
              color: CREAM,
              textAlign: "right",
            }}
          >
            FRESH · WOODY · AMBER
            <br />
            50ML — EAU DE PARFUM
          </div>
          {/* Bottle — 1 Million, background removed */}
          <Image
            src="/assets/perfumes/1-million-nobg.png"
            alt="1 Million"
            fill
            sizes="33vw"
            className="object-contain"
            style={{
              padding: "32px 40px",
              filter: "drop-shadow(0 32px 48px rgba(0,0,0,0.55))",
            }}
            priority
          />
          <div
            style={{
              position: "absolute",
              bottom: 20,
              left: 20,
              right: 20,
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 10,
              letterSpacing: "0.15em",
              color: CREAM,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>FIG. A — THE SIGNATURE</span>
            <span>↓ TURN PAGE</span>
          </div>
        </div>

        {/* RIGHT: marginalia */}
        <div
          style={{
            padding: "40px 28px",
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          {/* Combo offer */}
          <div>
            <div
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                borderBottom: `1px solid ${INK}`,
                paddingBottom: 6,
                marginBottom: 10,
              }}
            >
              OF NOTE / PG. 02
            </div>
            <div
              style={{
                fontSize: 20,
                lineHeight: 1.15,
                letterSpacing: "-0.01em",
              }}
            >
              <em>Curated combos,</em> priced to wear.
            </div>
            <div
              style={{
                fontSize: 12,
                fontFamily: "var(--font-inter), sans-serif",
                color: "#3A3833",
                marginTop: 8,
                lineHeight: 1.5,
              }}
            >
              Two signatures. One ritual. Better together.
            </div>
          </div>

          {/* Weather */}
          <div style={{ background: INK, color: CREAM, padding: 18 }}>
            <div
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              WEATHER REPORT
            </div>
            <div
              style={{
                fontSize: 26,
                lineHeight: 1,
                fontStyle: "italic",
              }}
            >
              Bombay,
              <br />
              34°C
            </div>
            <div
              style={{
                fontSize: 11,
                fontFamily: "var(--font-inter), sans-serif",
                marginTop: 10,
                opacity: 0.7,
              }}
            >
              Recommended:{" "}
              <span style={{ color: SAFFRON }}>citrus & vetiver →</span>
            </div>
          </div>

          {/* Table of contents */}
          <div>
            <div
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                borderBottom: `1px solid ${INK}`,
                paddingBottom: 6,
                marginBottom: 10,
              }}
            >
              THE INDEX
            </div>
            <div
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: 12,
                lineHeight: 1.9,
              }}
            >
              {tableOfContents.map(([label, page]) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom: `1px dotted ${INK}`,
                    padding: "3px 0",
                  }}
                >
                  <span>{label}</span>
                  <span
                    style={{
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                    }}
                  >
                    {page}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE HERO */}
      <section
        className="flex flex-col md:hidden"
        style={{ borderBottom: `1px solid ${INK}` }}
      >
        {/* Mobile bottle panel */}
        <div
          style={{
            background: `radial-gradient(ellipse at 50% 60%, #E8763A 0%, #C24F1B 50%, #6B2310 100%)`,
            height: 320,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 16,
              left: 16,
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 9,
              letterSpacing: "0.2em",
              color: CREAM,
            }}
          >
            PLATE I.
          </div>
          <Image
            src="/assets/perfumes/1-million-nobg.png"
            alt="1 Million"
            fill
            sizes="100vw"
            className="object-contain"
            style={{
              padding: "20px 36px",
              filter: "drop-shadow(0 20px 32px rgba(0,0,0,0.5))",
            }}
          />
        </div>

        {/* Mobile text */}
        <div style={{ padding: "32px 20px 40px" }}>
          <div
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            FEATURE — 01
          </div>
          <h1
            style={{
              fontSize: "clamp(3rem, 14vw, 5rem)",
              lineHeight: 0.9,
              letterSpacing: "-0.03em",
              fontWeight: 300,
              margin: "0 0 20px",
            }}
          >
            Masterfully{" "}
            <em style={{ fontStyle: "italic" }}>crafted.</em>
            <br />
            <span
              style={{
                background: SAFFRON,
                color: CREAM,
                padding: "0 8px",
                display: "inline-block",
              }}
            >
              Accessible.
            </span>
          </h1>
          <p
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 14,
              lineHeight: 1.6,
              color: "#3A3833",
              marginBottom: 24,
            }}
          >
            Premium fragrances from ₹{minPrice}. Crafted for the connoisseur
            who refuses to pay the boutique tax.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <Link
              href="/products?featured=true"
              style={{
                background: INK,
                color: CREAM,
                padding: "16px 24px",
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 11,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                textDecoration: "none",
                display: "block",
                textAlign: "center",
              }}
            >
              SHOP BESTSELLERS →
            </Link>
            <Link
              href="/quiz"
              style={{
                background: "transparent",
                color: INK,
                border: `1px solid ${INK}`,
                borderTop: "none",
                padding: "16px 24px",
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 11,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                textDecoration: "none",
                display: "block",
                textAlign: "center",
              }}
            >
              TAKE THE QUIZ
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
