"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  comment: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Mumbai, Maharashtra",
    rating: 5,
    comment:
      "Absolutely love the Aventus fragrance! The quality is exceptional and the scent lasts all day. Arome Luxe has become my go-to for premium perfumes.",
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    location: "Delhi, NCR",
    rating: 5,
    comment:
      "The Cool Water perfume exceeded my expectations. Great value for money and the packaging was beautiful. Will definitely order again!",
  },
  {
    id: 3,
    name: "Anita Patel",
    location: "Bangalore, Karnataka",
    rating: 5,
    comment:
      "Fast delivery and amazing customer service. The Hawas fragrance is perfect for special occasions. Highly recommend Arome Luxe!",
  },
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
  }),
};

const Testimonials: React.FC = () => {
  const [[currentIndex, direction], setPage] = useState([0, 0]);

  const paginate = useCallback(
    (newDirection: number) => {
      const nextIndex =
        newDirection > 0
          ? currentIndex === testimonials.length - 1
            ? 0
            : currentIndex + 1
          : currentIndex === 0
          ? testimonials.length - 1
          : currentIndex - 1;
      setPage([nextIndex, newDirection]);
    },
    [currentIndex]
  );

  useEffect(() => {
    const interval = setInterval(() => paginate(1), 5000);
    return () => clearInterval(interval);
  }, [paginate]);

  const current = testimonials[currentIndex];

  return (
    <section className="py-20 md:py-24 bg-white">
      <div className="luxury-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-luxe-gold text-sm font-bold uppercase tracking-widest mb-3 block">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
            What Our Customers Say
          </h2>
        </motion.div>

        <div className="relative max-w-3xl mx-auto">
          <Quote className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 text-luxe-gold/20" />

          <div className="min-h-[280px] flex items-center justify-center">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="w-full text-center px-4 md:px-12"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-900 text-white text-lg font-semibold tracking-wide mb-6">
                  {getInitials(current.name)}
                </div>

                <div className="flex justify-center gap-1 mb-5">
                  {Array.from({ length: current.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-luxe-gold fill-luxe-gold"
                    />
                  ))}
                </div>

                <blockquote className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6 font-light italic">
                  &ldquo;{current.comment}&rdquo;
                </blockquote>

                <div>
                  <div className="font-semibold text-gray-900">
                    {current.name}
                  </div>
                  <div className="text-sm text-gray-400 mt-0.5">
                    {current.location}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => paginate(-1)}
              className="p-2.5 rounded-full border border-gray-200 text-gray-400 hover:border-luxe-gold hover:text-luxe-gold transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() =>
                    setPage([index, index > currentIndex ? 1 : -1])
                  }
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "w-8 bg-luxe-gold"
                      : "w-2 bg-gray-200 hover:bg-gray-300"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => paginate(1)}
              className="p-2.5 rounded-full border border-gray-200 text-gray-400 hover:border-luxe-gold hover:text-luxe-gold transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
