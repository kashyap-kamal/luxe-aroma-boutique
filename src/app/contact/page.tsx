"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Send, CheckCircle, AlertCircle, Phone, MapPin } from "lucide-react";
import { ContactService, ContactMessage } from "@/lib/contact-service";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const INK = "#0E0E0C";
const CREAM = "#F2EDE4";
const SAFFRON = "#E8763A";
const DARK = "#1A0908";

const faqs = [
  { q: "How can I track my order?", a: "Once your order ships, you'll receive an AWB number via SMS and email. You can also track in real time through your account Orders page." },
  { q: "What is your return policy?", a: "We offer a 7-day return policy for unopened items in original sealed packaging. See our Cancellation & Refund page for full details." },
  { q: "Do you ship across India?", a: "Yes, we ship pan-India via Shiprocket. All perfume orders are shipped via surface courier (4–9 business days) due to aviation restrictions on flammable goods." },
  { q: "How do I choose the right fragrance?", a: "Take our free Scent Quiz — it recommends fragrances based on your mood, style, and occasions. You can also reach out for a personalised recommendation." },
  { q: "Are your fragrances cruelty-free?", a: "Yes. All Aromé Luxe fragrances are cruelty-free — we never test on animals." },
  { q: "What payment methods do you accept?", a: "We accept all major credit/debit cards, UPI, net banking, and wallets through Cashfree — an RBI-authorised, PCI-DSS compliant payment gateway." },
];

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (status.type) setStatus({ type: null, message: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await ContactService.submitContactMessage(formData as ContactMessage);
      if (result.success) {
        setStatus({ type: "success", message: result.message });
        toast.success(result.message);
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus({ type: "error", message: result.message });
        toast.error(result.message);
      }
    } catch {
      const msg = "An unexpected error occurred. Please try again.";
      setStatus({ type: "error", message: msg });
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    background: "rgba(14,14,12,0.04)",
    border: `1px solid rgba(14,14,12,0.2)`,
    outline: "none",
    fontFamily: "var(--font-inter), sans-serif",
    fontSize: 14,
    color: INK,
    boxSizing: "border-box" as const,
  };
  const labelStyle = {
    display: "block",
    fontFamily: "var(--font-jetbrains-mono), monospace",
    fontSize: 10,
    letterSpacing: "0.18em",
    textTransform: "uppercase" as const,
    marginBottom: 8,
    opacity: 0.6,
  };

  return (
    <main style={{ background: CREAM, color: INK, paddingTop: 0 }}>

      {/* HERO */}
      <section style={{ background: DARK, color: CREAM, paddingTop: 80, paddingBottom: 56, borderBottom: `1px solid ${INK}` }} className="px-5 md:px-12">
        <div className="max-w-5xl mx-auto">
          <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.5, marginBottom: 20 }}>
            CONTACT / GET IN TOUCH
          </div>
          <h1 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "clamp(3rem, 7vw, 7rem)", fontWeight: 300, lineHeight: 0.88, letterSpacing: "-0.04em", margin: "0 0 24px" }}>
            We&apos;d love to <em style={{ color: SAFFRON }}>hear</em> from you.
          </h1>
          <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 16, lineHeight: 1.65, maxWidth: 480, opacity: 0.75 }}>
            Questions, feedback, fragrance consultations — reach out through any of the channels below.
          </p>
        </div>
      </section>

      {/* CONTACT INFO + FORM */}
      <section style={{ borderBottom: `1px solid ${INK}` }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2" style={{ gridTemplateColumns: undefined }}>
            {/* Info panel */}
            <div style={{ paddingTop: 40, paddingBottom: 40 }} className="px-5 md:px-12 border-b md:border-b-0 md:border-r border-[#0E0E0C]">
              <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.5, marginBottom: 28 }}>
                CONTACT INFO
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                {[
                  { icon: Mail, label: "EMAIL", value: "contact@aromeluxe.in", sub: "Response within 24 hours", href: "mailto:contact@aromeluxe.in" },
                  { icon: Phone, label: "PHONE", value: "+91-9711562006", sub: "Urgent inquiries & support", href: "tel:+919711562006" },
                  { icon: MapPin, label: "ADDRESS", value: "A5/901, Olive County, Vasundhara, Sector-5, Ghaziabad, U.P. — 201012", sub: "Visit our boutique by appointment", href: undefined },
                ].map((item) => (
                  <div key={item.label} style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
                    <div style={{ width: 40, height: 40, background: INK, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <item.icon className="h-4 w-4" style={{ color: CREAM }} strokeWidth={1.5} />
                    </div>
                    <div>
                      <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.5, marginBottom: 4 }}>{item.label}</div>
                      {item.href ? (
                        <a href={item.href} style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "1.1rem", fontWeight: 300, color: INK, textDecoration: "none", display: "block", marginBottom: 4 }}>{item.value}</a>
                      ) : (
                        <div style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 14, lineHeight: 1.5, marginBottom: 4 }}>{item.value}</div>
                      )}
                      <div style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 12, opacity: 0.5 }}>{item.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 40, padding: "20px 24px", background: "rgba(14,14,12,0.04)", border: `1px solid rgba(14,14,12,0.1)` }}>
                <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", opacity: 0.5, marginBottom: 8 }}>SUPPORT HOURS</div>
                <div style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, lineHeight: 1.7, color: "#3A3833" }}>
                  Mon–Sat: 9:00 AM – 7:00 PM<br />
                  Sun: 10:00 AM – 6:00 PM<br />
                  Response within 2–4 hours
                </div>
              </div>
            </div>

            {/* Form panel */}
            <div style={{ paddingTop: 40, paddingBottom: 40 }} className="px-5 md:px-12">
              <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.5, marginBottom: 28 }}>
                SEND A MESSAGE
              </div>

              {status.type && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    padding: "14px 18px",
                    marginBottom: 24,
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-start",
                    background: status.type === "success" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                    border: `1px solid ${status.type === "success" ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
                    color: status.type === "success" ? "#166534" : "#991b1b",
                  }}
                >
                  {status.type === "success" ? <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" /> : <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />}
                  <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13 }}>{status.message}</span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" style={labelStyle}>Full Name *</label>
                    <input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} placeholder="Your name" style={inputStyle} />
                  </div>
                  <div>
                    <label htmlFor="email" style={labelStyle}>Email *</label>
                    <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="your@email.com" style={inputStyle} />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" style={labelStyle}>Subject *</label>
                  <select id="subject" name="subject" required value={formData.subject} onChange={handleChange} style={{ ...inputStyle, appearance: "none" }}>
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="product">Product Information</option>
                    <option value="order">Order Status</option>
                    <option value="return">Returns & Refunds</option>
                    <option value="wholesale">Wholesale Inquiry</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" style={labelStyle}>Message *</label>
                  <textarea id="message" name="message" required rows={5} value={formData.message} onChange={handleChange} placeholder="How can we help you today?" style={{ ...inputStyle, resize: "none" }} />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    background: isSubmitting ? "rgba(14,14,12,0.5)" : INK,
                    color: CREAM,
                    border: "none",
                    padding: "18px 32px",
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: 11,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    width: "100%",
                  }}
                >
                  {isSubmitting ? (
                    <><span style={{ opacity: 0.7 }}>SENDING</span><span className="animate-pulse">...</span></>
                  ) : (
                    <><Send className="h-3.5 w-3.5" />SEND MESSAGE</>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ borderBottom: `1px solid ${INK}` }} className="px-5 md:px-12">
        <div className="max-w-5xl mx-auto">
          <div style={{ padding: "40px 0 20px", borderBottom: `1px solid ${INK}` }}>
            <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.5, marginBottom: 10 }}>FAQ</div>
            <h2 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 300, lineHeight: 0.95, letterSpacing: "-0.03em", margin: 0 }}>
              Frequently asked <em>questions.</em>
            </h2>
          </div>
          <Accordion type="single" collapsible>
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                style={{ borderBottom: `1px solid rgba(14,14,12,0.12)` }}
              >
                <AccordionTrigger
                  style={{
                    fontFamily: "var(--font-fraunces), serif",
                    fontSize: "1.1rem",
                    fontWeight: 300,
                    color: INK,
                    padding: "20px 0",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: 14,
                    lineHeight: 1.75,
                    color: "#3A3833",
                    paddingBottom: 20,
                  }}
                >
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section style={{ paddingTop: 56, paddingBottom: 56, background: SAFFRON }} className="px-5 md:px-12">
        <div className="max-w-5xl mx-auto" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: INK }}>OR JUST BROWSE</div>
          <div style={{ display: "flex", gap: 0, flexWrap: "wrap" }}>
            <Link href="/products" style={{ background: INK, color: CREAM, padding: "16px 28px", fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none" }}>SHOP COLLECTION →</Link>
            <Link href="/quiz" style={{ background: "transparent", color: INK, border: `1px solid ${INK}`, borderLeft: "none", padding: "16px 28px", fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none" }}>TAKE THE QUIZ</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
