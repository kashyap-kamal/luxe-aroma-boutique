"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }
    setSubscribed(true);
    setEmail("");
    toast.success("Thank you for subscribing!");
  };

  return (
    <section className="py-24 bg-gray-900 text-white overflow-hidden relative">
      {/* Decorative circles */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-luxe-gold/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-luxe-blue/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

      <div className="luxury-container relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto"
        >
          <span className="text-luxe-gold text-sm font-bold uppercase tracking-widest mb-4 block">
            Stay Connected
          </span>
          <div className="w-12 h-[1px] bg-luxe-gold/40 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
            Join Our Exclusive Community
          </h2>
          <p className="text-gray-300 text-lg mb-10">
            Subscribe to our newsletter for exclusive offers, new releases, and
            expert fragrance tips delivered directly to your inbox.
          </p>

          {subscribed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-luxe-gold text-lg font-medium"
            >
              Thank you for subscribing! We&apos;ll keep you updated.
            </motion.div>
          ) : (
            <motion.form
              onSubmit={handleSubscribe}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="max-w-md mx-auto flex flex-col sm:flex-row gap-3"
            >
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow px-5 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-luxe-gold focus:border-transparent backdrop-blur-sm transition-all duration-300 hover:bg-white/15"
              />
              <Button
                type="submit"
                className="bg-luxe-gold text-black hover:bg-white hover:text-black transition-all duration-300 font-semibold px-8 py-6 h-auto rounded-lg"
              >
                Subscribe
              </Button>
            </motion.form>
          )}

          <p className="text-gray-500 text-xs mt-6">
            By subscribing, you agree to our Privacy Policy and Terms of Service.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

