"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle, Truck, RotateCcw, Headphones } from "lucide-react";
import { Product } from "@/stores/cart-store";
import { useProducts } from "@/hooks/use-products";

const valueProps = [
  { icon: CheckCircle, label: "100% Authentic" },
  { icon: Truck, label: "Free Delivery" },
  { icon: RotateCcw, label: "Easy Returns" },
  { icon: Headphones, label: "Expert Support" },
];

interface HeroSectionProps {
  products: Product[];
}

export default function HeroSection({ products: initialProducts }: HeroSectionProps) {
  const { products } = useProducts(initialProducts, { featured: true, limit: 8 });
  const minPrice = products.length > 0
    ? Math.min(...products.map(p => p.price.current))
    : 399;

  return (
    <section
      className="pt-12 sm:pt-16 pb-16 md:pb-20 relative overflow-hidden"
      style={{ background: "#fcf9f8" }}
    >
      {/* Ambient background accent */}
      <div
        className="absolute top-0 right-0 w-1/2 h-full opacity-30 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at top right, #cb8ffd22 0%, transparent 70%)",
        }}
      />

      <div className="luxury-container relative z-10">
        <div className="max-w-3xl">
          {/* Eyebrow label */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="apo-chip inline-block mb-5"
            style={{ color: "#735c00", background: "rgba(212,175,55,0.15)" }}
          >
            Fragrance Curators
          </motion.p>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold leading-[1.1] tracking-tight mb-4"
            style={{ color: "#1c1b1b" }}
          >
            Masterfully Crafted.{" "}
            <span className="italic font-normal" style={{ color: "#7c43ab" }}>
              Unapologetically
            </span>{" "}
            Accessible.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="text-base md:text-lg mb-8 max-w-xl leading-relaxed"
            style={{ color: "#4d4635" }}
          >
            Premium fragrances starting at ₹{minPrice.toLocaleString("en-IN")} — crafted
            for the modern connoisseur who refuses to compromise.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="flex flex-wrap gap-3 mb-12"
          >
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 font-sans font-medium text-sm text-white transition-all duration-200 hover:opacity-90 group"
              style={{ background: "#735c00", borderRadius: "0.25rem" }}
            >
              Shop Bestsellers
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 font-sans font-medium text-sm transition-all duration-200"
              style={{
                color: "#735c00",
                border: "1px solid rgba(115,92,0,0.3)",
                borderRadius: "0.25rem",
              }}
            >
              Explore Scents
            </Link>
          </motion.div>

          {/* Value propositions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.36 }}
            className="flex flex-wrap gap-x-6 gap-y-3"
          >
            {valueProps.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 text-sm font-sans"
                style={{ color: "#4d4635" }}
              >
                <Icon className="h-4 w-4 shrink-0" style={{ color: "#735c00" }} />
                <span>{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
