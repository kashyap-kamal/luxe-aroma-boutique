"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { fetchActiveReviews, ReviewRow } from "@/lib/review-service";

interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  scent: string;
}

// Fallback data if DB is empty
const fallbackTestimonials: Testimonial[] = [
  { id: "1", name: "Priya Sharma", location: "Mumbai", rating: 5, scent: "Aventus", comment: "Absolutely love the Aventus fragrance! The quality is exceptional and the scent lasts all day. Aromé Luxe has become my go-to for premium perfumes." },
  { id: "2", name: "Rajesh Kumar", location: "Delhi NCR", rating: 5, scent: "Cool Water", comment: "The Cool Water perfume exceeded my expectations. Great value for money and the packaging was beautiful. Will definitely order again!" },
  { id: "3", name: "Anita Patel", location: "Bangalore", rating: 5, scent: "Hawas", comment: "Fast delivery and amazing customer service. The Hawas fragrance is perfect for special occasions. Highly recommend Aromé Luxe!" },
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

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase();
}

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -60 : 60, opacity: 0 }),
};

const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackTestimonials);
  const [[currentIndex, direction], setPage] = useState([0, 0]);

  useEffect(() => {
    fetchActiveReviews().then((rows) => {
      if (rows.length > 0) {
        setTestimonials(rows.map(toTestimonial));
      }
    });
  }, []);

  const paginate = useCallback(
    (newDirection: number) => {
      const nextIndex =
        newDirection > 0
          ? currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1
          : currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1;
      setPage([nextIndex, newDirection]);
    },
    [currentIndex, testimonials.length]
  );

  useEffect(() => {
    const interval = setInterval(() => paginate(1), 5500);
    return () => clearInterval(interval);
  }, [paginate]);

  const current = testimonials[currentIndex];
  if (!current) return null;

  return (
    <section className="py-20 md:py-24" style={{ background: "#fcf9f8" }}>
      <div className="luxury-container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="apo-chip inline-block mb-3" style={{ color: "#735c00", background: "rgba(212,175,55,0.15)" }}>
            Worn by You
          </p>
          <h2 className="font-serif font-bold" style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", color: "#1c1b1b" }}>
            What Our Customers Say
          </h2>
        </motion.div>

        <div className="relative max-w-2xl mx-auto">
          <div className="min-h-[260px] flex items-center justify-center">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="w-full px-2 md:px-0"
              >
                <div className="p-8 md:p-10 text-center" style={{ background: "#f6f3f2", borderRadius: "0.25rem" }}>
                  <div className="inline-flex items-center justify-center w-12 h-12 font-sans font-semibold text-sm mb-5" style={{ background: "#1c1b1b", color: "#ffffff", borderRadius: "50%" }}>
                    {getInitials(current.name)}
                  </div>
                  <div className="flex justify-center gap-0.5 mb-4">
                    {Array.from({ length: current.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5" style={{ color: "#d4af37", fill: "#d4af37" }} />
                    ))}
                  </div>
                  <blockquote className="font-serif font-normal leading-relaxed mb-5 italic" style={{ fontSize: "1.05rem", color: "#1c1b1b" }}>
                    &ldquo;{current.comment}&rdquo;
                  </blockquote>
                  <div>
                    <div className="font-sans font-semibold" style={{ fontSize: "0.875rem", color: "#1c1b1b" }}>{current.name}</div>
                    <div className="font-sans mt-0.5" style={{ fontSize: "0.75rem", color: "#7f7663" }}>
                      {current.location}{current.scent && <> &middot; <span style={{ color: "#735c00" }}>{current.scent}</span></>}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center items-center gap-4 mt-6">
            <button onClick={() => paginate(-1)} className="p-2 transition-colors duration-200" style={{ color: "#7f7663" }} aria-label="Previous">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-1.5">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setPage([index, index > currentIndex ? 1 : -1])}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{ width: index === currentIndex ? "2rem" : "0.5rem", background: index === currentIndex ? "#735c00" : "#d4c9b2" }}
                  aria-label={`Go to ${index + 1}`}
                />
              ))}
            </div>
            <button onClick={() => paginate(1)} className="p-2 transition-colors duration-200" style={{ color: "#7f7663" }} aria-label="Next">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
