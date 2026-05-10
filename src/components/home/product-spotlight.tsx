"use client";

import { Product, useCartStore } from "@/stores/cart-store";
import { useProducts } from "@/hooks/use-products";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import Image from "next/image";
import { getSetting } from "@/lib/settings-service";
import { fetchProductById } from "@/lib/product-service";

const SAFFRON = "#E8763A";
const CREAM = "#F2EDE4";
const INK = "#0E0E0C";

interface ProductSpotlightProps {
  products: Product[];
}

export default function ProductSpotlight({ products: initialProducts }: ProductSpotlightProps) {
  const { products } = useProducts(initialProducts, { featured: true, limit: 6 });
  const { addToCart } = useCartStore();
  const [addedId, setAddedId] = useState<string | null>(null);
  const [configuredProduct, setConfiguredProduct] = useState<Product | null>(null);

  useEffect(() => {
    getSetting<string>("spotlight_product_id").then(async (id) => {
      if (id) {
        const p = await fetchProductById(id);
        if (p) setConfiguredProduct(p);
      }
    }).catch(() => {});
  }, []);

  const product = configuredProduct ?? products[0];

  if (!product) return null;

  const notes = [
    { tier: "TOP", name: product.fragrance_notes?.top?.[0] ?? "Saffron", duration: "0–15 min", color: SAFFRON },
    { tier: "HEART", name: product.fragrance_notes?.middle?.[0] ?? "Rose", duration: "15 min–2 h", color: "#E8B4B8" },
    { tier: "BASE", name: product.fragrance_notes?.base?.[0] ?? "Oud", duration: "2–10 h", color: "#C7905C" },
  ];

  const discountPercent =
    product.price.on_sale && product.price.original > 0
      ? Math.round(
          ((product.price.original - product.price.current) /
            product.price.original) *
            100
        )
      : 30;

  const isAdded = addedId === product?.id;

  const handleAdd = () => {
    if (isAdded) return;
    addToCart(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
    toast.success(`${product.name} added to cart`);
  };

  return (
  <>
    <section
      style={{
        gridTemplateColumns: "1fr 1fr",
        borderBottom: `1px solid ${INK}`,
        background: "#1A0908",
        color: CREAM,
      }}
      className="hidden md:grid"
    >
      {/* LEFT: product info */}
      <div
        style={{
          padding: "72px 48px",
          borderRight: `1px solid rgba(232,118,58,0.3)`,
          position: "relative",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: SAFFRON,
          }}
        >
          FEATURE — 03 / SIGNATURE SERIES
        </div>
        <h2
          style={{
            fontSize: "clamp(3.5rem, 8vw, 8rem)",
            lineHeight: 0.88,
            letterSpacing: "-0.04em",
            fontWeight: 300,
            margin: "20px 0 0",
            fontFamily: "var(--font-fraunces), serif",
          }}
        >
          {product.name.split(" ")[0]}
          <br />
          <em style={{ fontWeight: 300, color: SAFFRON }}>
            {product.name.split(" ").slice(1).join(" ") || "Al Oud."}
          </em>
        </h2>
        <p
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 15,
            lineHeight: 1.6,
            maxWidth: 440,
            marginTop: 28,
            opacity: 0.85,
          }}
        >
          A no-fade fragrance built for ten-hour skin. Saffron up top,
          Bulgarian rose at the heart, Cambodian oud below. Twenty-three
          iterations until the dry-down was worth your wrist.
        </p>

        {/* Notes breakdown */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            marginTop: 40,
            border: "1px solid rgba(232,118,58,0.3)",
          }}
        >
          {notes.map((note, i) => (
            <div
              key={note.tier}
              style={{
                padding: 18,
                borderRight:
                  i < 2 ? "1px solid rgba(232,118,58,0.3)" : "none",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: 9,
                  letterSpacing: "0.2em",
                  color: note.color,
                  textTransform: "uppercase",
                }}
              >
                {note.tier}
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontStyle: "italic",
                  marginTop: 6,
                  fontFamily: "var(--font-fraunces), serif",
                }}
              >
                {note.name}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: 10,
                  opacity: 0.5,
                  marginTop: 4,
                }}
              >
                {note.duration}
              </div>
            </div>
          ))}
        </div>

        {/* Price + CTA */}
        <div
          style={{
            marginTop: 40,
            display: "flex",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div style={{ fontSize: 34, fontWeight: 300 }}>
              {product.price.currency}
              {product.price.current.toLocaleString("en-IN")}{" "}
              {product.price.on_sale && (
                <span
                  style={{
                    fontSize: 16,
                    opacity: 0.5,
                    textDecoration: "line-through",
                  }}
                >
                  {product.price.currency}
                  {product.price.original.toLocaleString("en-IN")}
                </span>
              )}
            </div>
            {discountPercent > 0 && (
              <div
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: 10,
                  color: SAFFRON,
                  letterSpacing: "0.2em",
                  marginTop: 4,
                  textTransform: "uppercase",
                }}
              >
                {discountPercent}% OFF — LIMITED
              </div>
            )}
          </div>
          <button
            onClick={handleAdd}
            disabled={isAdded}
            style={{
              background: SAFFRON,
              color: INK,
              border: "none",
              padding: "16px 24px",
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 11,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              cursor: isAdded ? "not-allowed" : "pointer",
              opacity: isAdded ? 0.7 : 1,
              whiteSpace: "nowrap",
            }}
          >
            {isAdded ? "ADDED!" : "ADD TO CART →"}
          </button>
        </div>
      </div>

      {/* RIGHT: product image */}
      <div
        style={{
          position: "relative",
          minHeight: 600,
          background: `radial-gradient(circle at 50% 50%, #6B2310 0%, #1A0908 70%)`,
          overflow: "hidden",
        }}
      >
        <Image
          src="/assets/perfumes/ameer-al-oud-nobg.png"
          alt={product.name}
          fill
          sizes="50vw"
          className="object-contain"
          style={{ padding: "48px 64px", filter: "drop-shadow(0 40px 60px rgba(0,0,0,0.5))" }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 28,
            left: 28,
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 10,
            letterSpacing: "0.2em",
            color: SAFFRON,
          }}
        >
          PLATE II.
          <br />
          FIG. B — THE FLAGSHIP
        </div>
        <div
          style={{
            position: "absolute",
            top: 28,
            right: 28,
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 10,
            letterSpacing: "0.2em",
            color: SAFFRON,
            textAlign: "right",
          }}
        >
          EAU DE PARFUM
          <br />
          SCALE 1:1
        </div>
      </div>
    </section>

    {/* MOBILE SIGNATURE FEATURE */}
    <section
      className="flex flex-col md:hidden"
      style={{
        background: "#1A0908",
        color: CREAM,
        borderBottom: `1px solid ${INK}`,
      }}
    >
      {/* Bottle panel */}
      <div
        style={{
          background: `radial-gradient(circle at 50% 50%, #6B2310 0%, #1A0908 70%)`,
          height: 320,
          position: "relative",
          overflow: "hidden",
          borderBottom: "1px solid rgba(232,118,58,0.2)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 14,
            left: 16,
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 9,
            letterSpacing: "0.2em",
            color: SAFFRON,
          }}
        >
          PLATE II.
        </div>
        <Image
          src="/assets/perfumes/ameer-al-oud-nobg.png"
          alt={product.name}
          fill
          sizes="100vw"
          className="object-contain"
          style={{ padding: "24px 40px", filter: "drop-shadow(0 20px 32px rgba(0,0,0,0.5))" }}
        />
      </div>

      {/* Info */}
      <div style={{ padding: "28px 20px 32px" }}>
        <div
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 9,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: SAFFRON,
            marginBottom: 10,
          }}
        >
          FEATURE — 03 / SIGNATURE SERIES
        </div>
        <h2
          style={{
            fontSize: "3.2rem",
            lineHeight: 0.88,
            letterSpacing: "-0.04em",
            fontWeight: 300,
            fontFamily: "var(--font-fraunces), serif",
            marginBottom: 14,
          }}
        >
          {product.name.split(" ")[0]}
          <br />
          <em style={{ color: SAFFRON }}>
            {product.name.split(" ").slice(1).join(" ") || "Al Oud."}
          </em>
        </h2>
        <p
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 13,
            lineHeight: 1.6,
            opacity: 0.8,
            marginBottom: 20,
          }}
        >
          A no-fade fragrance built for ten-hour skin. Saffron, Bulgarian rose,
          Cambodian oud.
        </p>

        {/* Notes row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            border: "1px solid rgba(232,118,58,0.3)",
            marginBottom: 20,
          }}
        >
          {notes.map((note, i) => (
            <div
              key={note.tier}
              style={{
                padding: "12px 10px",
                borderRight: i < 2 ? "1px solid rgba(232,118,58,0.3)" : "none",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: 8,
                  letterSpacing: "0.2em",
                  color: note.color,
                  textTransform: "uppercase",
                }}
              >
                {note.tier}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-fraunces), serif",
                  fontSize: 16,
                  fontStyle: "italic",
                  marginTop: 4,
                }}
              >
                {note.name}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ fontSize: 26, fontWeight: 300, fontFamily: "var(--font-fraunces), serif" }}>
              {product.price.currency}
              {product.price.current.toLocaleString("en-IN")}
              {product.price.on_sale && (
                <span
                  style={{
                    fontSize: 13,
                    opacity: 0.4,
                    textDecoration: "line-through",
                    marginLeft: 8,
                  }}
                >
                  {product.price.currency}
                  {product.price.original.toLocaleString("en-IN")}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={handleAdd}
            disabled={isAdded}
            style={{
              background: SAFFRON,
              color: INK,
              border: "none",
              padding: "14px 22px",
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              cursor: isAdded ? "not-allowed" : "pointer",
              opacity: isAdded ? 0.7 : 1,
            }}
          >
            {isAdded ? "ADDED!" : "ADD →"}
          </button>
        </div>
      </div>
    </section>
  </>
  );
}
