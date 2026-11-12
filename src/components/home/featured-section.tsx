"use client";

import Link from "next/link";
import Image from "next/image";
import { Product, useCartStore } from "@/stores/cart-store";
import { useProducts } from "@/hooks/use-products";
import { useViewportMode } from "@/hooks/use-viewport-mode";
import PlateCard from "@/components/plate-card";
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
  const { showDesktop, showMobile } = useViewportMode();

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
      <div className="flex md:hidden items-baseline justify-between" style={{ padding: "30px 20px 16px" }}>
        <h2 style={{ fontSize: "1.75rem", lineHeight: 1, letterSpacing: "-0.02em", fontWeight: 300, fontFamily: "var(--font-fraunces), serif", margin: 0 }}>
          Worn <em>by you</em>
        </h2>
        <Link href="/products?featured=true" style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: INK, opacity: 0.6 }}>
          View all
        </Link>
      </div>

      {/* Product grid */}
      {showDesktop && (
      <div
        className="hidden md:grid"
        style={{ gridTemplateColumns: `repeat(${display.length}, 1fr)` }}
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
                borderRight: i < display.length - 1 ? `1px solid ${INK}` : "none",
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
                    loading="lazy"
                    decoding="async"
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
      )}

      {/* Mobile: swipe row */}
      {showMobile && (
        <div className="swipe-row md:hidden" style={{ paddingBottom: 32 }}>
          {products.slice(0, 8).map((product) => (
            <PlateCard key={product.id} product={product} className="w-[208px]" />
          ))}
        </div>
      )}
    </section>
  );
}
