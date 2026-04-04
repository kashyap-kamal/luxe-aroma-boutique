"use client";

import { motion } from "framer-motion";
import { Flower2, FlaskConical, Bike } from "lucide-react";

const pillars = [
  {
    icon: Flower2,
    label: "Rooted in India",
    body:
      "We partner directly with India's finest fragrance houses — cutting out middlemen to bring you premium ingredients at honest prices.",
  },
  {
    icon: FlaskConical,
    label: "Expert Blending",
    body:
      "Each formula is refined over dozens of iterations. We don't ship until the dry-down is flawless on skin, not just paper.",
  },
  {
    icon: Bike,
    label: "Direct to You",
    body:
      "No middlemen, no inflated margins. You pay for the fragrance, not the boutique. That's the Aromé Luxe model.",
  },
];

export default function StorySection() {
  return (
    <section className="py-20 md:py-24" style={{ background: "#ffffff" }}>
      <div className="luxury-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="max-w-xl mb-14"
        >
          <p
            className="apo-chip inline-block mb-3"
            style={{ color: "#735c00", background: "rgba(212,175,55,0.15)" }}
          >
            The Luxury Paradox
          </p>
          <h2
            className="font-serif font-bold leading-tight"
            style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", color: "#1c1b1b" }}
          >
            Why should luxury cost a fortune?
          </h2>
          <p
            className="mt-3 font-sans leading-relaxed"
            style={{ fontSize: "0.95rem", color: "#4d4635" }}
          >
            We built Aromé Luxe on a single belief: premium fragrance shouldn&apos;t
            come with a premium guilt trip.
          </p>
        </motion.div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="p-6 md:p-8"
              style={{ background: "#f6f3f2", borderRadius: "0.25rem" }}
            >
              <div
                className="inline-flex items-center justify-center w-10 h-10 mb-5"
                style={{
                  background: "rgba(212,175,55,0.15)",
                  borderRadius: "0.25rem",
                }}
              >
                <pillar.icon className="h-5 w-5" style={{ color: "#735c00" }} />
              </div>
              <h3
                className="font-serif font-semibold mb-2 leading-snug"
                style={{ fontSize: "1.05rem", color: "#1c1b1b" }}
              >
                {pillar.label}
              </h3>
              <p
                className="font-sans leading-relaxed"
                style={{ fontSize: "0.875rem", color: "#4d4635" }}
              >
                {pillar.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
