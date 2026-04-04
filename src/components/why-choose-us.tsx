"use client";

import React from "react";
import { motion } from "framer-motion";
import { BadgeCheck, Truck, RotateCcw, Headphones } from "lucide-react";

const trustItems = [
  { icon: BadgeCheck, label: "100% AUTHENTIC" },
  { icon: Truck, label: "FREE DELIVERY" },
  { icon: RotateCcw, label: "EASY RETURNS" },
  { icon: Headphones, label: "EXPERT SUPPORT" },
];

const WhyChooseUs: React.FC = () => {
  return (
    <section
      className="py-10 md:py-12 px-6 lg:px-12"
      style={{
        background: "#f9f9f9",
        borderTop: "1px solid rgba(173,179,180,0.1)",
        borderBottom: "1px solid rgba(173,179,180,0.1)",
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between gap-6 md:gap-8">
        {trustItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.35, delay: index * 0.06 }}
            className="flex items-center gap-3 group"
          >
            <item.icon
              className="h-[18px] w-[18px] shrink-0 transition-colors group-hover:text-[#2d3435]"
              style={{ color: "#735b3a" }}
              strokeWidth={1.5}
            />
            <span
              className="font-sans font-semibold uppercase transition-colors group-hover:text-[#2d3435]"
              style={{
                fontSize: "10px",
                letterSpacing: "0.2em",
                color: "#5a6061",
              }}
            >
              {item.label}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;
