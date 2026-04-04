"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

const categories = [
  {
    slug: "fresh-citrus",
    label: "FRESH & CITRUS",
    image: "/assets/home/fresh-citrus.jpg",
    href: "/products?tag=fresh-citrus",
  },
  {
    slug: "woody-spicy",
    label: "WOODY & SPICY",
    image: "/assets/home/woody-spicy.jpg",
    href: "/products?tag=woody-spicy",
  },
];

export default function CollectionsSection() {
  return (
    <section className="flex flex-col md:flex-row min-h-[600px] md:h-[80vh]" style={{ background: "#f9f9f9" }}>
      {categories.map((cat, i) => (
        <Link
          key={cat.slug}
          href={cat.href}
          className="relative flex-1 group overflow-hidden block"
          style={{
            borderRight: i === 0 ? "1px solid rgba(173,179,180,0.05)" : undefined,
          }}
        >
          {/* Image with hover zoom */}
          <Image
            src={cat.image}
            alt={cat.label}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 50vw"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-[#2d3435]/15 group-hover:bg-[#2d3435]/25 transition-all duration-500" />

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="absolute inset-0 flex flex-col items-center justify-end pb-16 md:pb-24 text-center px-6"
          >
            <h3
              className="font-serif font-bold uppercase tracking-tight mb-4"
              style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                color: "#f9f9f9",
              }}
            >
              {cat.label}
            </h3>
            <span
              className="inline-flex items-center gap-1 font-sans uppercase tracking-widest group/btn"
              style={{ fontSize: "12px", color: "#f9f9f9" }}
            >
              SHOP NOW
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </motion.div>
        </Link>
      ))}
    </section>
  );
}
