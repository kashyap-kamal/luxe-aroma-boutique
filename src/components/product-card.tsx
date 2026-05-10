"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { Product, useCartStore } from "@/stores/cart-store";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

const INK = "#0E0E0C";
const CREAM = "#F2EDE4";
const SAFFRON = "#E8763A";

interface ProductCardProps {
  product: Product;
  fullWidthMobile?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, fullWidthMobile = false }) => {
  const { addToCart, openSidebar } = useCartStore();
  const [added, setAdded] = useState(false);

  const discountPercent =
    product.price.on_sale && product.price.original > 0
      ? Math.round(
          ((product.price.original - product.price.current) / product.price.original) * 100
        )
      : 0;

  const topNotes = (product.fragrance_notes?.top ?? []).slice(0, 3).join(" · ");

  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (added) return;
      addToCart(product, 1);
      openSidebar();
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    },
    [added, addToCart, openSidebar, product]
  );

  return (
    <div style={{ background: CREAM, display: "flex", flexDirection: "column", height: "100%" }}>
      <Link href={`/products/${product.id}`} style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Image */}
        <div
          style={{
            position: "relative",
            aspectRatio: "3/4",
            background: "#EDE9E0",
            overflow: "hidden",
            borderBottom: `1px solid ${INK}`,
          }}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes={fullWidthMobile ? "(max-width: 640px) 100vw, 33vw" : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"}
            className="object-cover transition-transform duration-700 hover:scale-[1.04]"
          />

          {discountPercent > 0 && (
            <span
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                background: SAFFRON,
                color: INK,
                padding: "3px 8px",
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 9,
                letterSpacing: "0.15em",
              }}
            >
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: "14px 14px 8px", flexGrow: 1 }}>
          <div
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 9,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              opacity: 0.5,
              marginBottom: 6,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              color: INK,
            }}
          >
            {topNotes || " "}
          </div>
          <h3
            style={{
              fontFamily: "var(--font-fraunces), serif",
              fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)",
              fontWeight: 300,
              letterSpacing: "-0.01em",
              color: INK,
              lineHeight: 1.2,
              marginBottom: 10,
            }}
          >
            {product.name}
          </h3>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 8,
              paddingTop: 10,
              borderTop: `1px dotted ${INK}`,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-fraunces), serif",
                fontSize: "1rem",
                fontWeight: 300,
                color: INK,
              }}
            >
              {product.price.currency}{product.price.current.toLocaleString("en-IN")}
            </span>
            {product.price.on_sale && (
              <span
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: 10,
                  textDecoration: "line-through",
                  opacity: 0.4,
                  color: INK,
                }}
              >
                {product.price.currency}{product.price.original.toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Add to cart */}
      <div style={{ padding: "0 14px 14px", marginTop: "auto" }}>
        <button
          onClick={handleAddToCart}
          style={{
            width: "100%",
            background: added ? "transparent" : INK,
            color: added ? SAFFRON : CREAM,
            border: added ? `1px solid ${SAFFRON}` : "none",
            padding: "10px 14px",
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 9,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            cursor: added ? "default" : "pointer",
            transition: "all 150ms",
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {added ? (
              <motion.span key="added" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                ADDED ✓
              </motion.span>
            ) : (
              <motion.span key="add" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                ADD →
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
