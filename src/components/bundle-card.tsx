"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Check, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Bundle } from "@/lib/bundle-service";
import { useCartStore } from "@/stores/cart-store";

interface BundleCardProps {
  bundle: Bundle;
}

const BundleCard: React.FC<BundleCardProps> = ({ bundle }) => {
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

  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      addBundleToCart(bundle, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    },
    [addBundleToCart, bundle]
  );

  return (
    <div
      className="group overflow-hidden transition-all duration-200"
      style={{ background: "#ffffff" }}
    >
      <Link href={`/bundles/${bundle.id}`} className="block">
        {/* Image */}
        <div
          className="relative overflow-hidden"
          style={{ background: "#f6f3f2", aspectRatio: "3/4" }}
        >
          {bundle.imageUrl ? (
            <Image
              src={bundle.imageUrl}
              alt={bundle.name}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-[1.04]"
              width={400}
              height={533}
            />
          ) : (
            // Placeholder: show product images as a collage
            <div className="w-full h-full flex flex-wrap">
              {bundle.items.slice(0, 4).map((item, i) => (
                <div
                  key={i}
                  className="w-1/2 h-1/2 overflow-hidden"
                  style={{ background: "#ebe7e7" }}
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

          {/* Bundle badge */}
          <span
            className="absolute top-3 left-3 text-[10px] font-sans font-semibold px-2 py-0.5 tracking-wide inline-flex items-center gap-1"
            style={{
              background: "rgba(124,67,171,0.12)",
              color: "#7c43ab",
              borderRadius: "0.125rem",
            }}
          >
            <Tag className="h-2.5 w-2.5" />
            {bundle.bundleType.replace("_", " ").toUpperCase()}
          </span>

          {discountPercent > 0 && (
            <span
              className="absolute top-3 right-3 text-[10px] font-sans font-semibold px-2 py-0.5 tracking-wide"
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
          {/* Item count */}
          <p
            className="mb-1.5 font-sans tracking-[0.1em] uppercase"
            style={{ fontSize: "0.6rem", color: "#7f7663" }}
          >
            {bundle.items.length} {bundle.items.length === 1 ? "fragrance" : "fragrances"}
          </p>

          <h3
            className="font-serif font-medium leading-snug mb-2 line-clamp-2 transition-colors duration-200 group-hover:text-primary"
            style={{ fontSize: "clamp(0.9rem, 2vw, 1.05rem)", color: "#1c1b1b" }}
          >
            {bundle.name}
          </h3>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="font-sans font-semibold" style={{ color: "#1c1b1b" }}>
              {bundle.price.currency}{bundle.price.current.toLocaleString("en-IN")}
            </span>
            {bundle.price.original && (
              <span
                className="font-sans text-xs line-through"
                style={{ color: "#7f7663" }}
              >
                {bundle.price.currency}{bundle.price.original.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {/* Add to Cart button */}
          <motion.button
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 font-sans text-xs font-medium tracking-wide transition-all duration-200"
            style={{
              background: added ? "rgba(124,67,171,0.08)" : "#7c43ab",
              color: added ? "#7c43ab" : "#ffffff",
              borderRadius: "0.25rem",
              border: added ? "1px solid rgba(124,67,171,0.3)" : "1px solid transparent",
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
                  Add Bundle
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </Link>
    </div>
  );
};

export default BundleCard;
