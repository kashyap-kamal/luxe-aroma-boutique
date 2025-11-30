"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Mail,
  Send,
  CheckCircle,
  AlertCircle,
  Phone,
  MapPin,
} from "lucide-react";
import Image from "next/image";
import { ContactService, ContactMessage } from "@/lib/contact-service";
import { toast } from "sonner";
import { motion } from "framer-motion";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear status when user starts typing
    if (submitStatus.type) {
      setSubmitStatus({ type: null, message: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      // Use client-side service directly for static export compatibility
      const result = await ContactService.submitContactMessage(
        formData as ContactMessage
      );

      if (result.success) {
        setSubmitStatus({
          type: "success",
          message: result.message,
        });
        toast.success(result.message);

        // Reset form after successful submission
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        setSubmitStatus({
          type: "error",
          message: result.message,
        });
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      setSubmitStatus({
        type: "error",
        message: "An unexpected error occurred. Please try again.",
      });
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex-grow bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <Image
            src="/assets/contact/contact-us.jpeg"
            alt="Contact Aromé Luxe"
            className="w-full h-full object-cover"
            width={1280}
            height={640}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
        </motion.div>
        
        <div className="relative h-full luxury-container flex flex-col justify-center items-start text-white">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <Link href="/">
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 backdrop-blur-sm transition-all duration-300"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-serif font-bold mb-6 max-w-3xl"
          >
            Get in Touch
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl max-w-2xl font-light text-gray-200 leading-relaxed"
          >
            We&apos;d love to hear from you. Reach out to us for any questions,
            feedback, or assistance.
          </motion.p>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="py-24">
        <div className="luxury-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-luxe-gold text-sm font-bold uppercase tracking-widest mb-3 block">
                Contact Info
              </span>
              <h2 className="text-4xl font-serif font-bold text-gray-900 mb-10">
                We're Here to Help
              </h2>

              <div className="space-y-10">
                {[
                  { icon: Mail, title: "Email", content: "contact@aromeluxe.in", sub: "We'll get back to you within 24 hours" },
                  { icon: Phone, title: "Phone", content: "+91-9711562006", sub: "Available for urgent inquiries and support" },
                  { icon: MapPin, title: "Address", content: "A5/901, Olive County, Vasundhara, Sector-5, Ghaziabad, U.P.", sub: "PIN: 201012 • Visit our boutique" }
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start gap-6 group"
                  >
                    <div className="w-14 h-14 bg-luxe-cream rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-luxe-gold transition-colors duration-300">
                      <item.icon className="h-6 w-6 text-gray-900 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div>
                      <h3 className="text-lg font-serif font-bold text-gray-900 mb-1">
                        {item.title}
                    </h3>
                      <p className="text-gray-700 font-medium text-lg mb-1">
                        {item.content}
                    </p>
                      <p className="text-gray-500 text-sm">
                        {item.sub}
                    </p>
                  </div>
                  </motion.div>
                ))}

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-gray-50 p-8 rounded-2xl border border-gray-100 mt-8"
                >
                  <h4 className="text-lg font-serif font-bold text-gray-900 mb-3">
                    Multiple Ways to Reach Us
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    We offer multiple contact options to ensure you can reach us
                    in the way that&apos;s most convenient for you. Use email
                    for detailed inquiries, phone for urgent matters, or visit
                    our boutique for personalized fragrance consultations.
                  </p>
                </motion.div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl border border-gray-100 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-luxe-gold/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8 relative z-10">
                Send us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                {/* Status Message */}
                {submitStatus.type && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg flex items-center gap-3 ${
                      submitStatus.type === "success"
                        ? "bg-green-50 border border-green-200 text-green-800"
                        : "bg-red-50 border border-red-200 text-red-800"
                    }`}
                  >
                    {submitStatus.type === "success" ? (
                      <CheckCircle className="h-5 w-5 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    )}
                    <p className="text-sm font-medium">
                      {submitStatus.message}
                    </p>
                  </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxe-gold focus:bg-white transition-all duration-300"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxe-gold focus:bg-white transition-all duration-300"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide"
                  >
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxe-gold focus:bg-white transition-all duration-300 appearance-none"
                  >
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
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxe-gold focus:bg-white transition-all duration-300 resize-none"
                    placeholder="How can we help you today?"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gray-900 hover:bg-luxe-gold hover:text-black text-white py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium rounded-lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-luxe-cream">
        <div className="luxury-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
            <div className="w-20 h-1 bg-luxe-gold mx-auto rounded-full" />
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div className="space-y-8">
              {[
                { q: "How can I track my order?", a: "Once your order ships, you'll receive a tracking number via email. You can also track your order through your account dashboard." },
                { q: "What is your return policy?", a: "We offer a 30-day return policy for unused items in original packaging. Return shipping costs are the responsibility of the customer." },
                { q: "Do you ship internationally?", a: "Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by location." }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">
                    {faq.q}
                </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {faq.a}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="space-y-8">
              {[
                { q: "How do I choose the right fragrance?", a: "Consider your personal style, the occasion, and your skin chemistry. We recommend trying samples or visiting our boutique for a personalized consultation." },
                { q: "Are your fragrances cruelty-free?", a: "Yes, all our fragrances are cruelty-free and we never test on animals. We're committed to ethical and sustainable practices." },
                { q: "Can I schedule a private consultation?", a: "Absolutely! We offer private consultations by appointment. Contact us to schedule your personalized fragrance experience." }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (index + 3) * 0.1 }}
                >
                  <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">
                    {faq.q}
                </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {faq.a}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
