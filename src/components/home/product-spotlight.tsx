"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Product, useCartStore } from "@/stores/cart-store";
import { useProducts } from "@/hooks/use-products";
import { toast } from "sonner";

interface ProductSpotlightProps {
  products: Product[];
}

export default function ProductSpotlight({ products: initialProducts }: ProductSpotlightProps) {
  const { products } = useProducts(initialProducts, { featured: true, limit: 6 });
  const { addToCart } = useCartStore();
  const [[idx, dir], setPage] = useState([0, 0]);

  const product = products[idx];

  const paginate = useCallback(
    (d: number) => {
      setPage(([prev]) => {
        const next = d > 0
          ? prev === products.length - 1 ? 0 : prev + 1
          : prev === 0 ? products.length - 1 : prev - 1;
        return [next, d];
      });
    },
    [products.length]
  );

  if (!product || products.length === 0) return null;

  const notes = product.fragrance_notes;
  const topNotes = notes?.top?.slice(0, 3) ?? [];
  const discountPercent =
    product.price.on_sale && product.price.original > 0
      ? Math.round(((product.price.original - product.price.current) / product.price.original) * 100)
      : 0;

  const handleAdd = () => {
    addToCart(product, 1);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <section className="py-20 md:py-28 px-6 lg:px-12 overflow-hidden" style={{ background: "#f2f4f4" }}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
        {/* Left: product info */}
        <div className="col-span-1 md:col-span-7 order-2 md:order-1">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={product.id}
              custom={dir}
              initial={{ opacity: 0, x: dir > 0 ? 40 : -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir > 0 ? -40 : 40 }}
              transition={{ duration: 0.35 }}
            >
              <div
                className="relative p-8 md:p-12"
                style={{
                  background: "rgba(255,255,255,0.4)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(173,179,180,0.1)",
                }}
              >
                {/* Badge */}
                <div
                  className="absolute -top-4 -left-2 md:-left-4 px-4 py-1.5 font-sans uppercase tracking-widest font-semibold"
                  style={{ fontSize: "10px", background: "#735b3a", color: "#f9f9f9" }}
                >
                  SIGNATURE SERIES
                </div>

                <h2
                  className="font-serif font-bold uppercase mb-1 leading-none"
                  style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "#2d3435" }}
                >
                  {product.name}
                </h2>

                <p
                  className="font-sans uppercase tracking-[0.3em] mb-8 md:mb-10"
                  style={{ fontSize: "11px", color: "#735b3a" }}
                >
                  NO FADE FRAGRANCE
                </p>

                {/* Fragrance notes */}
                <div className="space-y-5 mb-10">
                  {topNotes.map((note) => (
                    <div key={note} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 mt-2 flex-shrink-0" style={{ background: "#735b3a" }} />
                      <div>
                        <h4
                          className="font-sans font-bold uppercase tracking-widest mb-0.5"
                          style={{ fontSize: "11px", color: "#2d3435" }}
                        >
                          {note}
                        </h4>
                        <p
                          className="font-sans font-light"
                          style={{ fontSize: "13px", color: "#5a6061" }}
                        >
                          Premium {note.toLowerCase()} note for depth and character.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price */}
                <div className="flex items-end gap-3 mb-6">
                  <span
                    className="font-serif font-bold"
                    style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", color: "#2d3435" }}
                  >
                    {product.price.currency}{product.price.current.toLocaleString("en-IN")}
                  </span>
                  {product.price.on_sale && (
                    <span
                      className="font-sans line-through mb-1"
                      style={{ fontSize: "1.1rem", color: "rgba(90,96,97,0.6)" }}
                    >
                      {product.price.currency}{product.price.original.toLocaleString("en-IN")}
                    </span>
                  )}
                  {discountPercent > 0 && (
                    <span
                      className="font-sans font-semibold uppercase mb-1 ml-1"
                      style={{ fontSize: "11px", color: "#735b3a" }}
                    >
                      {discountPercent}% OFF
                    </span>
                  )}
                </div>

                <button
                  onClick={handleAdd}
                  className="w-full py-4 font-sans uppercase tracking-widest transition-all duration-300 hover:opacity-90 active:scale-[0.98]"
                  style={{ fontSize: "12px", background: "#2d3435", color: "#f9f9f9" }}
                >
                  ADD TO COLLECTION
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Carousel controls */}
          {products.length > 1 && (
            <div className="flex items-center gap-4 mt-6">
              <button
                onClick={() => paginate(-1)}
                className="p-2 transition-colors hover:text-[#2d3435]"
                style={{ color: "#5a6061" }}
                aria-label="Previous"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="flex gap-1.5">
                {products.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage([i, i > idx ? 1 : -1])}
                    className="h-1.5 rounded-full transition-all duration-300"
                    style={{
                      width: i === idx ? "2rem" : "0.5rem",
                      background: i === idx ? "#2d3435" : "#adb3b4",
                    }}
                    aria-label={`Product ${i + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={() => paginate(1)}
                className="p-2 transition-colors hover:text-[#2d3435]"
                style={{ color: "#5a6061" }}
                aria-label="Next"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {/* Right: product image */}
        <div className="col-span-1 md:col-span-5 order-1 md:order-2 flex justify-center">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={product.id + "-img"}
              custom={dir}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35 }}
              className="relative w-full max-w-md aspect-[3/4] flex items-center justify-center p-8 md:p-12"
              style={{
                background: "#ebeeef",
                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.1)",
              }}
            >
              <Image
                src={product.image}
                alt={product.name}
                width={400}
                height={533}
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
