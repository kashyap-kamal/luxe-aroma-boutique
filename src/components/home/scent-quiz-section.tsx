"use client";

import { motion } from "framer-motion";

export default function ScentQuizSection() {
  return (
    <section
      className="py-24 md:py-32 px-6 lg:px-12 text-center relative overflow-hidden"
      style={{ background: "#2d3435" }}
    >
      {/* Subtle radial vignette */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, transparent 20%, #000 100%)" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-2xl mx-auto space-y-6"
      >
        <span
          className="font-sans uppercase font-medium block"
          style={{ fontSize: "10px", letterSpacing: "0.5em", color: "#735b3a" }}
        >
          SENSORY JOURNEY
        </span>

        <h2
          className="font-serif italic font-normal leading-tight"
          style={{
            fontSize: "clamp(2rem, 4vw, 3.2rem)",
            color: "#f9f9f9",
          }}
        >
          Not sure where to begin?
        </h2>

        <p
          className="font-sans font-light leading-relaxed mx-auto max-w-md"
          style={{ fontSize: "1.05rem", color: "rgba(249,249,249,0.55)" }}
        >
          Take our 2-minute olfactory diagnostic to find the notes that match
          your personality and presence.
        </p>

        <div className="pt-4">
          <button
            className="font-sans uppercase tracking-widest transition-all duration-500 hover:bg-[#f9f9f9] hover:text-[#2d3435]"
            style={{
              fontSize: "12px",
              color: "#f9f9f9",
              border: "1px solid rgba(249,249,249,0.3)",
              padding: "18px 48px",
            }}
            onClick={() => {
              window.location.href = "/quiz";
            }}
          >
            START QUIZ &gt;
          </button>
        </div>
      </motion.div>
    </section>
  );
}
