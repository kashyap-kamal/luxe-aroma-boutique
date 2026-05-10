"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Check, Minus, Plus, ArrowLeft } from "lucide-react";
import { Bundle } from "@/lib/bundle-service";
import { useCartStore } from "@/stores/cart-store";
import { toast } from "sonner";
import { TAG_META, tagLabel } from "@/lib/utils";

interface BundleDetailClientProps {
  bundle: Bundle;
}

export default function BundleDetailClient({ bundle }: BundleDetailClientProps) {
  const { addBundleToCart } = useCartStore();
  const router = useRouter();

  // Collect unique scent + occasion tags from all products in the bundle
  const bundleTags = [
    ...new Set(
      bundle.items
        .flatMap((item) => item.product.tags ?? [])
        .filter((t) => TAG_META[t]?.group === "scent" || TAG_META[t]?.group === "occasion")
    ),
  ];
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const discountPercent =
    bundle.price.original && bundle.price.original > bundle.price.current
      ? Math.round(
          ((bundle.price.original - bundle.price.current) /
            bundle.price.original) *
            100
        )
      : 0;

  const handleAddToCart = () => {
    if (added) return;
    addBundleToCart(bundle, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
    toast("Bundle added to cart", {
      description: `${bundle.name} (×${quantity}) has been added to your cart.`,
      duration: 3000,
    });
  };

  const handleBuyNow = () => {
    addBundleToCart(bundle, quantity);
    router.push("/cart");
  };

  return (
    <main className="flex-grow pt-8 pb-8" style={{ background: "#fcf9f8" }}>
      <div className="luxury-container">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-sans text-sm mb-8 transition-colors hover:opacity-70"
          style={{ color: "#5c5b5b" }}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </Link>

        <div className="flex flex-col lg:flex-row gap-10 xl:gap-16">
          {/* Image */}
          <div className="w-full lg:w-[45%] flex-shrink-0">
            <div
              className="relative overflow-hidden w-full"
              style={{ aspectRatio: "3/4", background: "#f6f3f2" }}
            >
              {bundle.imageUrl ? (
                <Image
                  src={bundle.imageUrl}
                  alt={bundle.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex flex-wrap">
                  {bundle.items.slice(0, 4).map((item, i) => (
                    <div key={i} className="w-1/2 h-1/2 overflow-hidden" style={{ background: "#ebe7e7" }}>
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        width={300}
                        height={300}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Badges */}
              <span
                className="absolute top-4 left-4 text-[10px] font-sans font-semibold px-2.5 py-1 tracking-wide uppercase"
                style={{ background: "#2d3435", color: "#f9f9f9", borderRadius: "0.125rem" }}
              >
                {bundle.bundleType.replace(/_/g, " ")}
              </span>
              {discountPercent > 0 && (
                <span
                  className="absolute top-4 right-4 text-[10px] font-sans font-semibold px-2.5 py-1 tracking-wide"
                  style={{ background: "#735c00", color: "#ffffff", borderRadius: "0.125rem" }}
                >
                  {discountPercent}% OFF
                </span>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 flex flex-col">
            {/* Chip */}
            <p
              className="apo-chip inline-block self-start mb-4"
              style={{ color: "#735c00", background: "rgba(212,175,55,0.15)" }}
            >
              Discovery Set · {bundle.items.length} Fragrances
            </p>

            <h1
              className="font-serif font-bold leading-tight mb-3"
              style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", color: "#1c1b1b" }}
            >
              {bundle.name}
            </h1>

            {bundle.short_description && (
              <p className="font-sans mb-5 leading-relaxed" style={{ color: "#4d4635", fontSize: "0.95rem" }}>
                {bundle.short_description}
              </p>
            )}

            {/* Scent & mood chips from included products */}
            {bundleTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {bundleTags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/products?tag=${tag}`}
                    className="inline-block px-3 py-1.5 font-sans text-xs font-medium rounded-full border transition-colors hover:border-gray-400"
                    style={{ color: "#2d3435", borderColor: "#d4d0cb", background: "#ffffff" }}
                  >
                    {tagLabel(tag)}
                  </Link>
                ))}
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-sans font-bold" style={{ fontSize: "1.5rem", color: "#1c1b1b" }}>
                {bundle.price.currency}{bundle.price.current.toLocaleString("en-IN")}
              </span>
              {bundle.price.original && (
                <span className="font-sans text-base line-through" style={{ color: "#7f7663" }}>
                  {bundle.price.currency}{bundle.price.original.toLocaleString("en-IN")}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="font-sans text-sm font-medium" style={{ color: "#735c00" }}>
                  Save {discountPercent}%
                </span>
              )}
            </div>

            {/* Included fragrances */}
            <div className="mb-6">
              <p className="font-sans text-xs uppercase tracking-widest mb-3" style={{ color: "#7f7663" }}>
                What&apos;s included
              </p>
              <div className="space-y-2">
                {bundle.items.map((item, i) => (
                  <Link
                    key={i}
                    href={`/products/${item.product.id}`}
                    className="flex items-center gap-3 p-2.5 rounded-lg transition-colors hover:bg-white group"
                  >
                    <div
                      className="relative flex-shrink-0 overflow-hidden rounded"
                      style={{ width: 48, height: 48, background: "#f6f3f2" }}
                    >
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-serif font-medium line-clamp-1 transition-colors group-hover:text-primary"
                        style={{ fontSize: "0.9rem", color: "#1c1b1b" }}
                      >
                        {item.product.name}
                      </p>
                      {item.product.size && (
                        <p className="font-sans text-xs" style={{ color: "#7f7663" }}>
                          {item.product.size}
                          {item.quantity > 1 && ` · ×${item.quantity}`}
                        </p>
                      )}
                    </div>
                    <ArrowLeft className="h-3.5 w-3.5 rotate-180 flex-shrink-0 opacity-0 group-hover:opacity-40 transition-opacity" style={{ color: "#5c5b5b" }} />
                  </Link>
                ))}
              </div>
            </div>

            {/* Description */}
            {bundle.description && (
              <div className="mb-6">
                <p className="font-sans text-xs uppercase tracking-widest mb-2" style={{ color: "#7f7663" }}>
                  About this set
                </p>
                <p className="font-sans leading-relaxed text-sm" style={{ color: "#4d4635" }}>
                  {bundle.description}
                </p>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <p className="font-sans text-xs uppercase tracking-widest mb-3" style={{ color: "#7f7663" }}>
                Quantity
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="flex items-center justify-center transition-opacity disabled:opacity-30"
                  style={{
                    width: 36, height: 36,
                    border: "1px solid #d4d0cb",
                    borderRadius: "0.25rem",
                    background: "#ffffff",
                  }}
                >
                  <Minus className="h-3.5 w-3.5" style={{ color: "#2d3435" }} />
                </button>
                <span className="font-sans font-medium w-8 text-center" style={{ color: "#1c1b1b" }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex items-center justify-center transition-opacity"
                  style={{
                    width: 36, height: 36,
                    border: "1px solid #d4d0cb",
                    borderRadius: "0.25rem",
                    background: "#ffffff",
                  }}
                >
                  <Plus className="h-3.5 w-3.5" style={{ color: "#2d3435" }} />
                </button>
              </div>
            </div>

            {/* CTAs — desktop */}
            <div className="hidden md:flex gap-3">
              <motion.button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 font-sans text-sm font-medium tracking-wide transition-all duration-200"
                style={{
                  background: added ? "rgba(115,92,0,0.06)" : "#735c00",
                  color: added ? "#735c00" : "#ffffff",
                  borderRadius: "0.25rem",
                  border: added ? "1px solid rgba(115,92,0,0.3)" : "1px solid transparent",
                }}
                animate={added ? { scale: [1, 1.02, 1] } : {}}
                transition={{ duration: 0.25 }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {added ? (
                    <motion.span key="added" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                      <Check className="h-4 w-4" /> Added!
                    </motion.span>
                  ) : (
                    <motion.span key="add" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4" /> Add to Cart
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              <button
                onClick={handleBuyNow}
                className="flex-1 py-3.5 font-sans text-sm font-medium tracking-wide transition-all duration-200 hover:opacity-80"
                style={{
                  background: "#1c1b1b",
                  color: "#f9f9f9",
                  borderRadius: "0.25rem",
                }}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for mobile sticky bar */}
      <div className="h-24 md:hidden" />

      {/* Sticky mobile bottom bar */}
      <div
        className="fixed bottom-0 left-0 right-0 md:hidden z-40 px-4 py-3 flex gap-3"
        style={{ background: "#ffffff", borderTop: "1px solid #e8e5e0" }}
      >
        <motion.button
          onClick={handleAddToCart}
          className="flex-1 flex items-center justify-center gap-2 py-3 font-sans text-sm font-medium"
          style={{
            background: added ? "rgba(115,92,0,0.06)" : "#735c00",
            color: added ? "#735c00" : "#ffffff",
            borderRadius: "0.25rem",
            border: added ? "1px solid rgba(115,92,0,0.3)" : "1px solid transparent",
          }}
          animate={added ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 0.25 }}
        >
          <ShoppingBag className="h-4 w-4" />
          {added ? "Added!" : "Add to Cart"}
        </motion.button>
        <button
          onClick={handleBuyNow}
          className="flex-1 py-3 font-sans text-sm font-medium"
          style={{ background: "#1c1b1b", color: "#f9f9f9", borderRadius: "0.25rem" }}
        >
          Buy Now
        </button>
      </div>
    </main>
  );
}
