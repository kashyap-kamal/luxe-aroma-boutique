"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { ShoppingBag, Check } from "lucide-react";
import { Product, useCartStore } from "@/stores/cart-store";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCartStore();
  const [added, setAdded] = useState(false);

  const discountPercent =
    product.price.on_sale && product.price.original > 0
      ? Math.round(
          ((product.price.original - product.price.current) /
            product.price.original) *
            100
        )
      : 0;

  // Build a concise scent note string from top notes (first 3)
  const scentSummary = (() => {
    const notes = product.fragrance_notes?.top ?? [];
    return notes.slice(0, 3).join(" · ");
  })();

  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      addToCart(product, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    },
    [addToCart, product]
  );

  return (
    <div
      className="group overflow-hidden transition-all duration-200"
      style={{ background: "#ffffff" }}
    >
      <Link href={`/products/${product.id}`} className="block">
        {/* Image */}
        <div
          className="relative overflow-hidden"
          style={{ background: "#f6f3f2", aspectRatio: "3/4" }}
        >
          <Image
            src={product.image}
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-[1.04]"
            width={400}
            height={533}
          />
          {discountPercent > 0 && (
            <span
              className="absolute top-3 left-3 text-[10px] font-sans font-semibold px-2 py-0.5 tracking-wide"
              style={{
                background: "rgba(212,175,55,0.15)",
                color: "#735c00",
                borderRadius: "0.125rem",
              }}
            >
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Content */}
        <div className="pt-3 pb-4 px-2">
          {/* Scent notes — Apothecary chip style */}
          {scentSummary && (
            <p
              className="mb-1.5 font-sans tracking-[0.1em] uppercase"
              style={{ fontSize: "0.6rem", color: "#7f7663" }}
            >
              {scentSummary}
            </p>
          )}

          <h3
            className="font-serif font-medium leading-snug mb-2 line-clamp-2 transition-colors duration-200 group-hover:text-primary"
            style={{ fontSize: "clamp(0.9rem, 2vw, 1.05rem)", color: "#1c1b1b" }}
          >
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="font-sans font-semibold" style={{ color: "#1c1b1b" }}>
              {product.price.currency}{product.price.current.toLocaleString("en-IN")}
            </span>
            {product.price.on_sale && (
              <span
                className="font-sans text-xs line-through"
                style={{ color: "#7f7663" }}
              >
                {product.price.currency}{product.price.original.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {/* Add to Cart button */}
          <motion.button
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 font-sans text-xs font-medium tracking-wide transition-all duration-200"
            style={{
              background: added ? "rgba(115,92,0,0.06)" : "#735c00",
              color: added ? "#735c00" : "#ffffff",
              borderRadius: "0.25rem",
              border: added ? "1px solid rgba(115,92,0,0.3)" : "1px solid transparent",
            }}
            animate={added ? { scale: [1, 1.03, 1] } : {}}
            transition={{ duration: 0.25 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {added ? (
                <motion.span
                  key="added"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="flex items-center gap-1.5"
                >
                  <Check className="h-3.5 w-3.5" />
                  Added!
                </motion.span>
              ) : (
                <motion.span
                  key="add"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="flex items-center gap-1.5"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  Add to Cart
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
