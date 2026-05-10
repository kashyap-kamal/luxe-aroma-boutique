"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { fetchActiveReviews, ReviewRow } from "@/lib/review-service";

const INK = "#0E0E0C";
const CREAM = "#F2EDE4";
const SAFFRON = "#E8763A";

interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  scent: string;
}

const fallbackTestimonials: Testimonial[] = [
  {
    id: "1",
    name: "Priya Sharma",
    location: "Mumbai",
    rating: 5,
    scent: "Aventus",
    comment:
      "The dry-down on Ameer Al Oud lasts past midnight — and so does the compliment count. Ten-hour skin, finally.",
  },
  {
    id: "2",
    name: "Rajesh Kumar",
    location: "Delhi NCR",
    rating: 5,
    scent: "Cool Water",
    comment:
      "Cool Water exceeded all expectations. Premium quality at an honest price — the Aromé Luxe model in action.",
  },
  {
    id: "3",
    name: "Anita Patel",
    location: "Bangalore",
    rating: 5,
    scent: "Hawas",
    comment:
      "Hawas is perfect for special occasions. Fast delivery, beautiful packaging, and a fragrance that genuinely turns heads.",
  },
];

function toTestimonial(row: ReviewRow): Testimonial {
  return {
    id: row.id,
    name: row.customer_name,
    location: row.customer_location || "",
    rating: row.rating,
    comment: row.comment,
    scent: row.product_name || "",
  };
}

const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] =
    useState<Testimonial[]>(fallbackTestimonials);
  const [[current, dir], setPage] = useState([0, 0]);

  useEffect(() => {
    fetchActiveReviews().then((rows) => {
      if (rows.length > 0) setTestimonials(rows.map(toTestimonial));
    });
  }, []);

  const paginate = useCallback(
    (d: number) => {
      const next =
        d > 0
          ? current === testimonials.length - 1
            ? 0
            : current + 1
          : current === 0
          ? testimonials.length - 1
          : current - 1;
      setPage([next, d]);
    },
    [current, testimonials.length]
  );

  useEffect(() => {
    const t = setInterval(() => paginate(1), 6000);
    return () => clearInterval(t);
  }, [paginate]);

  const item = testimonials[current];
  if (!item) return null;

  return (
    <section
      style={{
        background: CREAM,
        color: INK,
        borderBottom: `1px solid ${INK}`,
      }}
    >
      {/* Section header */}
      <div
        style={{
          padding: "40px 48px 28px",
          borderBottom: `1px solid ${INK}`,
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
        className="hidden md:flex"
      >
        <div>
          <div
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            FEATURE — 07 / LETTERS FROM THE FIELD
          </div>
          <h2
            style={{
              fontSize: "clamp(2.5rem, 4.5vw, 4rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              fontWeight: 300,
              margin: "10px 0 0",
              fontFamily: "var(--font-fraunces), serif",
            }}
          >
            What the wrists say.
          </h2>
        </div>
        <div
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 11,
            letterSpacing: "0.15em",
            opacity: 0.5,
          }}
        >
          {String(current + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
        </div>
      </div>

      {/* Mobile header */}
      <div
        className="flex md:hidden"
        style={{ padding: "24px 20px 16px", borderBottom: `1px solid ${INK}` }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 9,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            LETTERS FROM THE FIELD
          </div>
          <h2
            style={{
              fontSize: "1.8rem",
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              fontWeight: 300,
              fontFamily: "var(--font-fraunces), serif",
            }}
          >
            What the wrists say.
          </h2>
        </div>
      </div>

      {/* Quote area */}
      <div
        style={{
          gridTemplateColumns: "1fr auto",
          minHeight: 280,
        }}
        className="hidden md:grid"
      >
        <div
          style={{
            padding: "56px 64px",
            borderRight: `1px solid ${INK}`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={item.id}
              custom={dir}
              initial={{ opacity: 0, y: dir > 0 ? 16 : -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: dir > 0 ? -16 : 16 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {/* Stars */}
              <div
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: 12,
                  letterSpacing: "0.15em",
                  color: SAFFRON,
                  marginBottom: 24,
                }}
              >
                {"★".repeat(item.rating)}
              </div>

              {/* Quote */}
              <blockquote
                style={{
                  fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
                  lineHeight: 1.35,
                  fontWeight: 300,
                  fontStyle: "italic",
                  fontFamily: "var(--font-fraunces), serif",
                  letterSpacing: "-0.01em",
                  margin: 0,
                  maxWidth: 820,
                }}
              >
                &ldquo;{item.comment}&rdquo;
              </blockquote>

              {/* Attribution */}
              <div
                style={{
                  marginTop: 28,
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: 11,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  opacity: 0.55,
                }}
              >
                — {item.name}
                {item.location && `, ${item.location.toUpperCase()}`}
                {item.scent && (
                  <span style={{ color: SAFFRON }}>
                    {" "}
                    · {item.scent.toUpperCase()}
                  </span>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation column */}
        <div
          style={{
            width: 88,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "56px 0",
          }}
        >
          <button
            onClick={() => paginate(-1)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 18,
              color: INK,
              opacity: 0.4,
              lineHeight: 1,
              padding: "8px",
              transition: "opacity 150ms",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.4")}
            aria-label="Previous"
          >
            ↑
          </button>

          {/* Dot indicators */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: 6 }}
          >
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setPage([i, i > current ? 1 : -1])}
                style={{
                  width: i === current ? 3 : 3,
                  height: i === current ? 16 : 6,
                  background: i === current ? INK : "rgba(14,14,12,0.25)",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 300ms",
                  padding: 0,
                }}
                aria-label={`Testimonial ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => paginate(1)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 18,
              color: INK,
              opacity: 0.4,
              lineHeight: 1,
              padding: "8px",
              transition: "opacity 150ms",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.4")}
            aria-label="Next"
          >
            ↓
          </button>
        </div>
      </div>

      {/* Mobile quote */}
      <div className="flex flex-col md:hidden">
        <div style={{ padding: "32px 20px 28px", minHeight: 200 }}>
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={item.id}
              custom={dir}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28 }}
            >
              <div
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: 11,
                  letterSpacing: "0.15em",
                  color: SAFFRON,
                  marginBottom: 16,
                }}
              >
                {"★".repeat(item.rating)}
              </div>
              <blockquote
                style={{
                  fontSize: "1.2rem",
                  lineHeight: 1.4,
                  fontWeight: 300,
                  fontStyle: "italic",
                  fontFamily: "var(--font-fraunces), serif",
                  margin: 0,
                }}
              >
                &ldquo;{item.comment}&rdquo;
              </blockquote>
              <div
                style={{
                  marginTop: 16,
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: 9,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  opacity: 0.5,
                }}
              >
                — {item.name}
                {item.location && `, ${item.location}`}
                {item.scent && (
                  <span style={{ color: SAFFRON }}> · {item.scent}</span>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile nav */}
        <div
          style={{
            borderTop: `1px solid ${INK}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "14px 20px",
          }}
        >
          <button
            onClick={() => paginate(-1)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 14,
              color: INK,
              padding: 0,
            }}
          >
            ← PREV
          </button>
          <div
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 9,
              letterSpacing: "0.15em",
              opacity: 0.4,
            }}
          >
            {String(current + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
          </div>
          <button
            onClick={() => paginate(1)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 14,
              color: INK,
              padding: 0,
            }}
          >
            NEXT →
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
