"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import BundleCard from "@/components/bundle-card";
import { fetchFeaturedBundles, Bundle } from "@/lib/bundle-service";

export default function BundleSection() {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchFeaturedBundles(4)
      .then(setBundles)
      .finally(() => setLoaded(true));
  }, []);

  // Don't render if no bundles exist
  if (loaded && bundles.length === 0) return null;

  return (
    <section className="py-20 md:py-24" style={{ background: "#fcf9f8" }}>
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
              style={{ color: "#7c43ab", background: "rgba(124,67,171,0.1)" }}
            >
              Discovery Sets
            </p>
            <h2
              className="font-serif font-bold leading-tight"
              style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", color: "#1c1b1b" }}
            >
              Explore Before You Commit
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link
              href="/bundles"
              className="inline-flex items-center gap-1.5 font-sans text-sm font-medium transition-all duration-200 group"
              style={{ color: "#7c43ab" }}
            >
              View All Sets
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </div>

        {!loaded ? (
          // Skeleton
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div
                  className="mb-3"
                  style={{
                    aspectRatio: "3/4",
                    background: "#f0edec",
                    borderRadius: "0.25rem",
                  }}
                />
                <div
                  className="h-3 mb-2"
                  style={{ background: "#f0edec", borderRadius: "0.125rem", width: "60%" }}
                />
                <div
                  className="h-4 mb-3"
                  style={{ background: "#f0edec", borderRadius: "0.125rem", width: "80%" }}
                />
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          >
            {bundles.map((bundle) => (
              <BundleCard key={bundle.id} bundle={bundle} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
