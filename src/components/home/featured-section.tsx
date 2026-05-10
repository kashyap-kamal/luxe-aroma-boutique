"use client";

import Link from "next/link";
import Image from "next/image";
import { Product, useCartStore } from "@/stores/cart-store";
import { useProducts } from "@/hooks/use-products";
import { toast } from "sonner";
import { useState } from "react";

const INK = "#0E0E0C";
const CREAM = "#F2EDE4";
const SAFFRON = "#E8763A";

interface FeaturedSectionProps {
  products: Product[];
}

export default function FeaturedSection({ products: initialProducts }: FeaturedSectionProps) {
  const { products } = useProducts(initialProducts, { featured: true, limit: 8 });
  const { addToCart } = useCartStore();
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const handleAdd = (product: Product) => {
    if (addedIds[product.id]) return;
    addToCart(product, 1);
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(
      () => setAddedIds((prev) => ({ ...prev, [product.id]: false })),
      1500
    );
    toast.success(`${product.name} added to cart`);
  };

  if (products.length === 0) return null;

  const display = products.slice(0, 4);

  return (
    <section
      style={{
        borderBottom: `1px solid ${INK}`,
        background: CREAM,
        color: INK,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "56px 48px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          borderBottom: `1px solid ${INK}`,
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
            FEATURE — 04 / BESTSELLERS
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
            Worn <em style={{ fontWeight: 300 }}>by you,</em> mostly.
          </h2>
        </div>
        <Link
          href="/products"
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            textDecoration: "underline",
            color: INK,
          }}
        >
          VIEW ALL →
        </Link>
      </div>

      {/* Mobile header */}
      <div
        className="flex md:hidden"
        style={{
          padding: "28px 20px 16px",
          justifyContent: "space-between",
          alignItems: "flex-end",
          borderBottom: `1px solid ${INK}`,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            BESTSELLERS
          </div>
          <h2
            style={{
              fontSize: "2rem",
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              fontWeight: 300,
              fontFamily: "var(--font-fraunces), serif",
            }}
          >
            Worn <em>by you.</em>
          </h2>
        </div>
        <Link
          href="/products"
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 10,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            textDecoration: "underline",
            color: INK,
          }}
        >
          ALL →
        </Link>
      </div>

      {/* Product grid */}
      <div
        className="hidden md:grid"
        style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
      >
        {display.map((product, i) => {
          const discount =
            product.price.on_sale && product.price.original > 0
              ? Math.round(
                  ((product.price.original - product.price.current) /
                    product.price.original) *
                    100
                )
              : 0;

          return (
            <div
              key={product.id}
              style={{
                borderRight: i < 3 ? `1px solid ${INK}` : "none",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Image area */}
              <Link
                href={`/products/${product.id}`}
                style={{
                  background: product.image ? CREAM : "#EDE9E0",
                  aspectRatio: "1",
                  position: "relative",
                  borderBottom: `1px solid ${INK}`,
                  overflow: "hidden",
                  display: "block",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: 9,
                    letterSpacing: "0.2em",
                    color: INK,
                    zIndex: 2,
                  }}
                >
                  N° {String(i + 1).padStart(2, "0")}
                </div>
                {discount > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      background: SAFFRON,
                      color: INK,
                      padding: "3px 8px",
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                      fontSize: 9,
                      letterSpacing: "0.15em",
                      zIndex: 2,
                    }}
                  >
                    {discount}% OFF
                  </div>
                )}
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-8 mix-blend-multiply hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                ) : (
                  <svg
                    viewBox="0 0 200 280"
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -46%)",
                      width: "60%",
                    }}
                  >
                    <rect x="78" y="8" width="44" height="28" fill={INK} opacity="0.8" />
                    <path
                      d="M50 60 Q100 50 150 60 L160 240 Q160 260 140 264 L60 264 Q40 260 40 240 Z"
                      fill={INK}
                      opacity="0.12"
                    />
                    <rect x="65" y="130" width="70" height="48" fill={CREAM} />
                    <text
                      x="100"
                      y="150"
                      textAnchor="middle"
                      fontFamily="serif"
                      fontSize="9"
                      fill={INK}
                      fontStyle="italic"
                    >
                      {product.name.split(" ")[0]}
                    </text>
                    <text
                      x="100"
                      y="165"
                      textAnchor="middle"
                      fontFamily="serif"
                      fontSize="11"
                      fill={INK}
                    >
                      {product.name.split(" ").slice(1).join(" ") || "—"}
                    </text>
                  </svg>
                )}
              </Link>

              {/* Info area */}
              <div
                style={{
                  padding: "18px 20px",
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                      fontSize: 9,
                      letterSpacing: "0.15em",
                      opacity: 0.55,
                      textTransform: "uppercase",
                    }}
                  >
                    {product.fragrance_notes?.top?.slice(0, 3).join(" · ") || "EAU DE PARFUM"}
                  </div>
                  <div
                    style={{
                      fontSize: "clamp(1.1rem, 1.8vw, 1.6rem)",
                      fontWeight: 300,
                      letterSpacing: "-0.01em",
                      marginTop: 6,
                      fontFamily: "var(--font-fraunces), serif",
                    }}
                  >
                    {product.name}
                  </div>
                </div>
                <div
                  style={{
                    marginTop: 16,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    borderTop: `1px dotted ${INK}`,
                    paddingTop: 12,
                  }}
                >
                  <div>
                    <span style={{ fontSize: 18 }}>
                      {product.price.currency}
                      {product.price.current.toLocaleString("en-IN")}
                    </span>
                    {product.price.on_sale && (
                      <span
                        style={{
                          fontSize: 11,
                          opacity: 0.45,
                          textDecoration: "line-through",
                          marginLeft: 8,
                        }}
                      >
                        {product.price.currency}
                        {product.price.original.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleAdd(product)}
                    style={{
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                      fontSize: 10,
                      letterSpacing: "0.15em",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: addedIds[product.id] ? SAFFRON : INK,
                      textTransform: "uppercase",
                    }}
                  >
                    {addedIds[product.id] ? "ADDED ✓" : "ADD →"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile: 2-column grid */}
      <div
        className="grid md:hidden"
        style={{ gridTemplateColumns: "repeat(2, 1fr)" }}
      >
        {display.map((product, i) => {
          const discount =
            product.price.on_sale && product.price.original > 0
              ? Math.round(
                  ((product.price.original - product.price.current) /
                    product.price.original) *
                    100
                )
              : 0;

          return (
            <div
              key={product.id}
              style={{
                borderRight: i % 2 === 0 ? `1px solid ${INK}` : "none",
                borderBottom: i < 2 ? `1px solid ${INK}` : "none",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Link
                href={`/products/${product.id}`}
                style={{
                  aspectRatio: "1",
                  position: "relative",
                  background: "#EDE9E0",
                  display: "block",
                  overflow: "hidden",
                }}
              >
                {discount > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      background: SAFFRON,
                      color: INK,
                      padding: "2px 6px",
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                      fontSize: 8,
                      letterSpacing: "0.1em",
                      zIndex: 2,
                    }}
                  >
                    {discount}% OFF
                  </div>
                )}
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-6 mix-blend-multiply"
                    sizes="50vw"
                  />
                ) : (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-fraunces), serif",
                      fontSize: "1.2rem",
                      fontStyle: "italic",
                      opacity: 0.3,
                    }}
                  >
                    {product.name}
                  </div>
                )}
              </Link>
              <div style={{ padding: "12px 14px 16px" }}>
                <div
                  style={{
                    fontFamily: "var(--font-fraunces), serif",
                    fontSize: "1rem",
                    fontWeight: 300,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {product.name}
                </div>
                <div
                  style={{
                    marginTop: 8,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                  }}
                >
                  <span style={{ fontSize: 15, fontFamily: "var(--font-fraunces), serif" }}>
                    {product.price.currency}
                    {product.price.current.toLocaleString("en-IN")}
                  </span>
                  <button
                    onClick={() => handleAdd(product)}
                    style={{
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                      fontSize: 9,
                      letterSpacing: "0.15em",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: addedIds[product.id] ? SAFFRON : INK,
                      textTransform: "uppercase",
                    }}
                  >
                    {addedIds[product.id] ? "✓" : "ADD →"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
