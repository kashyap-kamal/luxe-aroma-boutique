import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Mail, Phone, MapPin, Clock, Send } from "lucide-react"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Form submitted:", formData)
    // Reset form
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[50vh] min-h-[400px]">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Contact Aromé Luxe"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
          </div>
          <div className="relative h-full luxury-container flex flex-col justify-center items-start text-white">
            <div className="mb-4">
              <Link to="/">
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
              We'd love to hear from you. Reach out to us for any questions,
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
                      <p className="text-gray-600 mb-1">info@aromeluxe.in</p>
                      <p className="text-gray-600">support@aromeluxe.in</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-luxe-sandy rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-luxe-blue mb-2">
                        Phone
                      </h3>
                      <p className="text-gray-600 mb-1">+91 98765 43210</p>
                      <p className="text-gray-600">+91 98765 43211</p>
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
                      <p className="text-gray-600">
                        Aromé Luxe Boutique
                        <br />
                        123 Luxury Lane, Connaught Place
                        <br />
                        New Delhi, Delhi 110001
                        <br />
                        India
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-luxe-sandy rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-luxe-blue mb-2">
                        Business Hours
                      </h3>
                      <p className="text-gray-600 mb-1">
                        Monday - Friday: 10:00 AM - 8:00 PM
                      </p>
                      <p className="text-gray-600 mb-1">
                        Saturday: 10:00 AM - 6:00 PM
                      </p>
                      <p className="text-gray-600">
                        Sunday: 12:00 PM - 5:00 PM
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="mt-12">
                  <h3 className="text-xl font-semibold text-luxe-blue mb-4">
                    Follow Us
                  </h3>
                  <div className="flex space-x-4">
                    <a
                      href="#"
                      className="w-10 h-10 bg-luxe-blue rounded-full flex items-center justify-center text-white hover:bg-luxe-sandy transition-colors"
                    >
                      <span className="text-sm font-bold">F</span>
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 bg-luxe-blue rounded-full flex items-center justify-center text-white hover:bg-luxe-sandy transition-colors"
                    >
                      <span className="text-sm font-bold">I</span>
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 bg-luxe-blue rounded-full flex items-center justify-center text-white hover:bg-luxe-sandy transition-colors"
                    >
                      <span className="text-sm font-bold">T</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-luxe-cream p-8 rounded-lg">
                <h2 className="text-3xl font-serif font-bold text-luxe-blue mb-8">
                  Send us a Message
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
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
                    className="w-full bg-luxe-blue hover:bg-luxe-sandy text-white py-3 text-lg flex items-center justify-center gap-2"
                  >
                    <Send className="h-5 w-5" />
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-20 bg-gray-100">
          <div className="luxury-container">
            <h2 className="text-3xl font-serif font-bold text-center text-luxe-blue mb-12">
              Visit Our Boutique
            </h2>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-96 bg-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">
                    Interactive Map Coming Soon
                  </p>
                  <p className="text-gray-500">
                    123 Luxury Lane, Connaught Place, New Delhi
                  </p>
                </div>
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
                    Once your order ships, you'll receive a tracking number via
                    email. You can also track your order through your account
                    dashboard.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-luxe-blue mb-2">
                    What is your return policy?
                  </h3>
                  <p className="text-gray-600">
                    We offer a 30-day return policy for unused items in original
                    packaging. Return shipping costs are the responsibility of
                    the customer.
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
                    Yes, all our fragrances are cruelty-free and we never test
                    on animals. We're committed to ethical and sustainable
                    practices.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-luxe-blue mb-2">
                    Can I schedule a private consultation?
                  </h3>
                  <p className="text-gray-600">
                    Absolutely! We offer private consultations by appointment.
                    Contact us to schedule your personalized fragrance
                    experience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default Contact
