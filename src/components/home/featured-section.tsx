"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductGrid from "@/components/product-grid";
import { Product } from "@/stores/cart-store";
import { useProducts } from "@/hooks/use-products";

interface FeaturedSectionProps {
  products: Product[];
}

export default function FeaturedSection({ products: initialProducts }: FeaturedSectionProps) {
  const { products } = useProducts(initialProducts, { featured: true, limit: 8 });

  return (
    <section className="py-20 md:py-24" style={{ background: "#f6f3f2" }}>
      <div className="luxury-container">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p
              className="apo-chip inline-block mb-3"
              style={{ color: "#735c00", background: "rgba(212,175,55,0.15)" }}
            >
              Bestsellers
            </p>
            <h2
              className="font-serif font-bold leading-tight"
              style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", color: "#1c1b1b" }}
            >
              Featured Fragrances
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 font-sans text-sm font-medium transition-all duration-200 group"
              style={{ color: "#735c00" }}
            >
              View All
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <ProductGrid products={products} />
        </motion.div>
      </div>
    </section>
  );
}
