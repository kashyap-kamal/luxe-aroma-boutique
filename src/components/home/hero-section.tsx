"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductGrid from "@/components/product-grid";
import { Product } from "@/stores/cart-store";
import { useProducts } from "@/hooks/use-products";

interface HeroSectionProps {
  products: Product[];
}

export default function HeroSection({ products: initialProducts }: HeroSectionProps) {
  const { products } = useProducts(initialProducts, { featured: true, limit: 8 });
  return (
    <section className="bg-luxe-cream pt-28 sm:pt-32 pb-12 md:pb-16">
      <div className="luxury-container">
        {/* Header row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6 md:mb-10"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-tight">
              Discover Your{" "}
              <span className="text-luxe-blue">Signature Scent</span>
            </h1>
            <p className="text-gray-600 text-sm sm:text-base md:text-lg mt-2 max-w-lg">
              Premium fragrances crafted for the modern connoisseur.
            </p>
          </div>

          <Link
            href="/products"
            className="group flex items-center text-gray-900 hover:text-luxe-blue transition-colors font-medium text-sm shrink-0"
          >
            Shop All
            <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Value prop badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6 md:mb-8"
        >
          <span className="inline-flex items-center gap-2 py-1.5 px-3 rounded-full bg-luxe-gold/10 border border-luxe-gold/20 text-sm font-medium text-gray-800">
            <span className="w-1.5 h-1.5 rounded-full bg-luxe-gold" />
            Premium Fragrances from ₹{Math.min(...products.map(p => p.price.current)).toLocaleString("en-IN")}
          </span>
        </motion.div>

        {/* Featured products grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <ProductGrid products={products.slice(0, 6)} />
        </motion.div>
      </div>
    </section>
  );
}
