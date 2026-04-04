"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Gift } from "lucide-react";
import { toast } from "sonner";
import { subscribeEmail } from "@/lib/newsletter-service";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
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
    setLoading(true);
    const { success, error } = await subscribeEmail(email);
    setLoading(false);
    if (success) {
      setSubscribed(true);
      setEmail("");
      toast.success("You're in! Your ₹50 credit is on its way.");
    } else {
      toast.error(error || "Something went wrong. Please try again.");
    }
  };

  return (
    <section className="py-20 md:py-24" style={{ background: "#1c1b1b" }}>
      <div className="luxury-container">
        <div className="max-w-xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* Credit pill */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1 mb-6 font-sans text-xs font-medium tracking-wide"
              style={{
                background: "rgba(212,175,55,0.15)",
                color: "#d4af37",
                borderRadius: "0.25rem",
              }}
            >
              <Gift className="h-3.5 w-3.5" />
              Get ₹50 store credit on your first order
            </div>

            <h2
              className="font-serif font-bold mb-3 leading-tight"
              style={{
                fontSize: "clamp(1.6rem, 3vw, 2rem)",
                color: "#fcf9f8",
              }}
            >
              Join the Inner Circle
            </h2>
            <p
              className="font-sans mb-8 leading-relaxed"
              style={{ fontSize: "0.9rem", color: "#7f7663" }}
            >
              New arrivals, exclusive offers, and expert fragrance tips — delivered
              weekly. No spam, ever.
            </p>

            {subscribed ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="font-sans font-medium"
                style={{ color: "#d4af37" }}
              >
                Welcome aboard! Check your inbox for your ₹50 credit.
              </motion.div>
            ) : (
              <motion.form
                onSubmit={handleSubscribe}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15, duration: 0.4 }}
                className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto"
              >
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-grow px-4 py-3 font-sans text-sm bg-transparent text-white placeholder:text-[#7f7663] focus:outline-none transition-colors duration-200"
                  style={{
                    border: "1px solid rgba(212,175,55,0.25)",
                    borderRadius: "0.25rem",
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "rgba(212,175,55,0.6)")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "rgba(212,175,55,0.25)")
                  }
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 font-sans text-sm font-medium transition-opacity duration-200 hover:opacity-90 shrink-0 disabled:opacity-50"
                  style={{
                    background: "#735c00",
                    color: "#ffffff",
                    borderRadius: "0.25rem",
                  }}
                >
                  Subscribe
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </motion.form>
            )}

            <p
              className="font-sans mt-5"
              style={{ fontSize: "0.72rem", color: "#4d4635" }}
            >
              By subscribing you agree to our Privacy Policy. Unsubscribe anytime.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
