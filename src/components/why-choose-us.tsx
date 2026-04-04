"use client";

import React from "react";
import { motion } from "framer-motion";
import { Award, Truck, Shield, Headphones } from "lucide-react";

const features = [
  {
    icon: Award,
    title: "100% Authentic",
    description: "Handpicked premium fragrances from world-renowned perfumers.",
  },
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Complimentary delivery on every order across India.",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Protected transactions with Cashfree payment gateway.",
  },
  {
    icon: Headphones,
    title: "Expert Support",
    description: "Dedicated fragrance advisors available to guide you.",
  },
];

const WhyChooseUs: React.FC = () => {
  return (
    <section className="py-16 md:py-20 bg-luxe-cream border-y border-gray-100">
      <div className="luxury-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-luxe-gold text-sm font-bold uppercase tracking-widest mb-3 block">
            The Arome Luxe Promise
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
            Why Choose Us
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center group"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-luxe-gold/10 text-luxe-gold mb-4 transition-colors duration-300 group-hover:bg-luxe-gold group-hover:text-white">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1.5">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
