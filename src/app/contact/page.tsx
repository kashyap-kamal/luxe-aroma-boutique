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
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px]">
        <div className="absolute inset-0">
          <Image
            src="/assets/contact/contact-us.jpeg"
            alt="Contact Aromé Luxe"
            className="w-full h-full object-cover"
            width={1280}
            height={640}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
        </div>
        <div className="relative h-full luxury-container flex flex-col justify-center items-start text-white">
          <div className="mb-4">
            <Link href="/">
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4 max-w-3xl animate-fade-in">
            Get in Touch
          </h1>
          <p className="text-xl max-w-2xl animate-fade-in">
            We&apos;d love to hear from you. Reach out to us for any questions,
            feedback, or assistance.
          </p>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="py-20">
        <div className="luxury-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-serif font-bold text-luxe-blue mb-8">
                Contact Information
              </h2>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-luxe-blue rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-luxe-blue mb-2">
                      Email
                    </h3>
                    <p className="text-gray-600  font-medium">
                      contact@aromeluxe.in
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      We&apos;ll get back to you within 24 hours
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-luxe-blue rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-luxe-blue mb-2">
                      Phone
                    </h3>
                    <p className="text-gray-600 font-medium">+91-9711562006</p>
                    <p className="text-gray-500 text-sm mt-2">
                      Available for urgent inquiries and support
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-luxe-blue rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-luxe-blue mb-2">
                      Address
                    </h3>
                    <p className="text-gray-600 font-medium">
                      A5/901, Olive County, Vasundhara, Sector-5, Ghaziabad,
                      U.P.
                    </p>
                    <p className="text-gray-600 font-medium">PIN: 201012</p>
                    <p className="text-gray-500 text-sm mt-2">
                      Visit our boutique for personalized consultations
                    </p>
                  </div>
                </div>

                <div className="bg-luxe-cream p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-luxe-blue mb-3">
                    Multiple Ways to Reach Us
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    We offer multiple contact options to ensure you can reach us
                    in the way that&apos;s most convenient for you. Use email
                    for detailed inquiries, phone for urgent matters, or visit
                    our boutique for personalized fragrance consultations and to
                    experience our products firsthand.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-luxe-cream p-8 rounded-lg">
              <h2 className="text-3xl font-serif font-bold text-luxe-blue mb-8">
                Send us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Status Message */}
                {submitStatus.type && (
                  <div
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
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-luxe-blue mb-2"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxe-blue focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-luxe-blue mb-2"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxe-blue focus:border-transparent"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-luxe-blue mb-2"
                  >
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxe-blue focus:border-transparent"
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
                    className="block text-sm font-medium text-luxe-blue mb-2"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxe-blue focus:border-transparent resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-luxe-blue hover:bg-luxe-sandy text-white py-3 text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="luxury-container">
          <h2 className="text-3xl font-serif font-bold text-center text-luxe-blue mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-luxe-blue mb-2">
                  How can I track my order?
                </h3>
                <p className="text-gray-600">
                  Once your order ships, you&apos;ll receive a tracking number
                  via email. You can also track your order through your account
                  dashboard.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-luxe-blue mb-2">
                  What is your return policy?
                </h3>
                <p className="text-gray-600">
                  We offer a 30-day return policy for unused items in original
                  packaging. Return shipping costs are the responsibility of the
                  customer.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-luxe-blue mb-2">
                  Do you ship internationally?
                </h3>
                <p className="text-gray-600">
                  Yes, we ship to most countries worldwide. International
                  shipping rates and delivery times vary by location.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-luxe-blue mb-2">
                  How do I choose the right fragrance?
                </h3>
                <p className="text-gray-600">
                  Consider your personal style, the occasion, and your skin
                  chemistry. We recommend trying samples or visiting our
                  boutique for a personalized consultation.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-luxe-blue mb-2">
                  Are your fragrances cruelty-free?
                </h3>
                <p className="text-gray-600">
                  Yes, all our fragrances are cruelty-free and we never test on
                  animals. We&apos;re committed to ethical and sustainable
                  practices.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-luxe-blue mb-2">
                  Can I schedule a private consultation?
                </h3>
                <p className="text-gray-600">
                  Absolutely! We offer private consultations by appointment.
                  Contact us to schedule your personalized fragrance experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
