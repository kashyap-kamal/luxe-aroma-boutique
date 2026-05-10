"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Bundle } from "@/lib/bundle-service";
import { useCartStore } from "@/stores/cart-store";

const INK = "#0E0E0C";
const CREAM = "#F2EDE4";
const SAFFRON = "#E8763A";

interface BundleCardProps {
  bundle: Bundle;
  index?: number;
}

const BundleCard: React.FC<BundleCardProps> = ({ bundle, index = 0 }) => {
  const { addBundleToCart } = useCartStore();
  const [added, setAdded] = useState(false);

  const discountPercent =
    bundle.price.original && bundle.price.original > bundle.price.current
      ? Math.round(
          ((bundle.price.original - bundle.price.current) /
            bundle.price.original) *
            100
        )
      : 0;

  const itemSummary = bundle.items
    .slice(0, 3)
    .map((i) => i.product.name)
    .join(" · ");

  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (added) return;
      addBundleToCart(bundle, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    },
    [added, addBundleToCart, bundle]
  );

  return (
    <div
      style={{
        background: CREAM,
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Link href={`/bundles/${bundle.id}`}>
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
          {bundle.imageUrl ? (
            <Image
              src={bundle.imageUrl}
              alt={bundle.name}
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 hover:scale-[1.04]"
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexWrap: "wrap",
              }}
            >
              {bundle.items.slice(0, 4).map((item, i) => (
                <div
                  key={i}
                  style={{
                    width: "50%",
                    height: "50%",
                    overflow: "hidden",
                    borderRight: i % 2 === 0 ? `1px solid ${INK}` : "none",
                    borderBottom: i < 2 ? `1px solid ${INK}` : "none",
                  }}
                >
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    width={200}
                    height={200}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Bundle type badge */}
          <span
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              background: INK,
              color: CREAM,
              padding: "3px 8px",
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 9,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            {bundle.bundleType.replace(/_/g, " ")}
          </span>

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

          {/* Index number */}
          <div
            style={{
              position: "absolute",
              bottom: 10,
              left: 10,
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 9,
              letterSpacing: "0.2em",
              color: CREAM,
              opacity: 0.6,
            }}
          >
            N° {String(index + 1).padStart(2, "0")}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "16px 16px 8px" }}>
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
            }}
          >
            {itemSummary || "\u00A0"}
          </div>

          <h3
            style={{
              fontFamily: "var(--font-fraunces), serif",
              fontSize: "clamp(1rem, 1.5vw, 1.2rem)",
              fontWeight: 300,
              letterSpacing: "-0.01em",
              color: INK,
              lineHeight: 1.2,
              marginBottom: 10,
            }}
          >
            {bundle.name}
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
                fontSize: "1.1rem",
                fontWeight: 300,
                color: INK,
              }}
            >
              {bundle.price.currency}
              {bundle.price.current.toLocaleString("en-IN")}
            </span>
            {bundle.price.original && (
              <span
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: 10,
                  textDecoration: "line-through",
                  opacity: 0.4,
                }}
              >
                {bundle.price.currency}
                {bundle.price.original.toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Add to cart */}
      <div style={{ padding: "0 16px 16px", marginTop: "auto" }}>
        <button
          onClick={handleAddToCart}
          style={{
            width: "100%",
            background: added ? "transparent" : INK,
            color: added ? SAFFRON : CREAM,
            border: added ? `1px solid ${SAFFRON}` : "none",
            padding: "12px 16px",
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 10,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            cursor: added ? "not-allowed" : "pointer",
            transition: "all 150ms",
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {added ? (
              <motion.span
                key="added"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                ADDED ✓
              </motion.span>
            ) : (
              <motion.span
                key="add"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                ADD BUNDLE →
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );
};

export default BundleCard;
