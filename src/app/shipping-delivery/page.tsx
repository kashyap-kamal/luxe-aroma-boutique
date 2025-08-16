import React from "react";
import {
  Truck,
  Package,
  Clock,
  MapPin,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Globe,
  Shield,
  Phone,
} from "lucide-react";

const ShippingDelivery: React.FC = () => {
  return (
    <main className="flex-grow py-8">
      <div className="luxury-container">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Truck className="h-12 w-12 text-brown-600" />
          </div>
          <h1 className="text-3xl font-serif font-bold mb-2">
            Shipping & Delivery Policy
          </h1>
          <p className="text-lg text-gray-600">
            Fast, reliable delivery across India with multiple shipping options.
          </p>
        </div>

        <div className="prose prose-lg max-w-4xl mx-auto">
          {/* Quick Overview */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-blue-800">
              Delivery Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-blue-700">
                  Free shipping Rs 2000+
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-blue-700">2-7 business days</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-blue-700">
                  Pan-India delivery
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-blue-700">Secure packaging</span>
              </div>
            </div>
          </div>

          {/* Shipping Options */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Shipping Options
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Package className="h-6 w-6 text-green-600" />
                  <h3 className="text-lg font-semibold">Standard Shipping</h3>
                </div>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>
                    • <strong>Delivery Time:</strong> 5-7 business days
                  </li>
                  <li>
                    • <strong>Cost:</strong> Rs 150 (Free on orders Rs 2000+)
                  </li>
                  <li>
                    • <strong>Coverage:</strong> All India
                  </li>
                  <li>
                    • <strong>Tracking:</strong> SMS & Email updates
                  </li>
                  <li>
                    • <strong>Insurance:</strong> Up to Rs 5,000
                  </li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Truck className="h-6 w-6 text-blue-600" />
                  <h3 className="text-lg font-semibold">Express Shipping</h3>
                </div>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>
                    • <strong>Delivery Time:</strong> 2-3 business days
                  </li>
                  <li>
                    • <strong>Cost:</strong> Rs 300 (Rs 200 on orders Rs 2000+)
                  </li>
                  <li>
                    • <strong>Coverage:</strong> Major cities only
                  </li>
                  <li>
                    • <strong>Tracking:</strong> Real-time tracking
                  </li>
                  <li>
                    • <strong>Insurance:</strong> Up to Rs 10,000
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-800">
                    Same-Day Delivery (Select Cities)
                  </h4>
                  <p className="text-sm text-yellow-700">
                    Available in Mumbai, Delhi, Bangalore, Chennai, Hyderabad,
                    and Pune. Order before 2 PM for same-day delivery.
                    Additional charges: Rs 500.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Delivery Zones */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Delivery Zones & Timeline
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Zone
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Cities/States
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Standard
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Express
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-medium">
                      Zone A
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      Mumbai, Delhi, Bangalore, Chennai
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      2-3 days
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      1-2 days
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 font-medium">
                      Zone B
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      Hyderabad, Pune, Kolkata, Ahmedabad
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      3-4 days
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      2-3 days
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-medium">
                      Zone C
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      Other major cities & state capitals
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      4-5 days
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      3-4 days
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 font-medium">
                      Zone D
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      Remote areas & smaller towns
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      5-7 days
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      Not available
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-sm text-gray-600 mt-4">
              * Delivery times are estimated and may vary due to weather
              conditions, holidays, or unforeseen circumstances.
            </p>
          </section>

          {/* Shipping Costs */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Shipping Costs
            </h2>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <h3 className="text-lg font-semibold text-green-800">
                  Free Shipping Benefits
                </h3>
              </div>
              <p className="text-green-700 mb-3">
                Enjoy free standard shipping on orders Rs 2,000 and above!
              </p>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• No minimum weight restrictions</li>
                <li>• Applies to all products</li>
                <li>• Can be combined with offers</li>
                <li>• Valid across all zones</li>
              </ul>
            </div>

            <h3 className="text-lg font-semibold mb-3">Shipping Charges</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium mb-2">Orders below Rs 2,000</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>Zone A & B: Rs 150</li>
                  <li>Zone C: Rs 200</li>
                  <li>Zone D: Rs 250</li>
                </ul>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium mb-2">Express Shipping</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>Zone A: Rs 200 (Rs 300 if order &lt; Rs 2,000)</li>
                  <li>Zone B: Rs 250 (Rs 350 if order &lt; Rs 2,000)</li>
                  <li>Zone C: Rs 300 (Rs 400 if order &lt; Rs 2,000)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Order Processing */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Order Processing
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h4 className="font-medium mb-2">Order Confirmation</h4>
                <p className="text-sm text-gray-600">
                  Within 30 minutes of payment
                </p>
              </div>
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <h4 className="font-medium mb-2">Order Processing</h4>
                <p className="text-sm text-gray-600">1-2 business days</p>
              </div>
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <h4 className="font-medium mb-2">Shipping</h4>
                <p className="text-sm text-gray-600">Package dispatched</p>
              </div>
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">4</span>
                </div>
                <h4 className="font-medium mb-2">Delivery</h4>
                <p className="text-sm text-gray-600">At your doorstep</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Processing Times</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>
                  • <strong>Standard Items:</strong> 1-2 business days
                </li>
                <li>
                  • <strong>Gift Wrapping:</strong> Additional 1 business day
                </li>
                <li>
                  • <strong>Bulk Orders (5+ items):</strong> 2-3 business days
                </li>
                <li>
                  • <strong>Custom/Personalized Items:</strong> 3-5 business
                  days
                </li>
              </ul>
            </div>
          </section>

          {/* Tracking & Updates */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Order Tracking & Updates
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">How to Track</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Check your email for shipping confirmation</li>
                  <li>Click the tracking link or visit our website</li>
                  <li>Enter your order number and email</li>
                  <li>View real-time status updates</li>
                </ol>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Automatic Updates
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• SMS notifications for key milestones</li>
                  <li>• Email updates with tracking information</li>
                  <li>• Push notifications via mobile app</li>
                  <li>• Delivery day morning reminder call</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Delivery Terms */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Delivery Terms & Conditions
            </h2>

            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-blue-800">
                  Age Verification
                </h4>
                <p className="text-sm text-gray-700">
                  Delivery person may request ID verification for age-restricted
                  products (18+ items).
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-green-800">
                  Contactless Delivery
                </h4>
                <p className="text-sm text-gray-700">
                  Available upon request. Package will be left at your doorstep
                  with photo confirmation.
                </p>
              </div>

              <div className="border-l-4 border-yellow-500 pl-4">
                <h4 className="font-semibold text-yellow-800">
                  Delivery Attempts
                </h4>
                <p className="text-sm text-gray-700">
                  We make 3 delivery attempts. After that, package returns to
                  our facility for re-delivery scheduling.
                </p>
              </div>

              <div className="border-l-4 border-red-500 pl-4">
                <h4 className="font-semibold text-red-800">Address Changes</h4>
                <p className="text-sm text-gray-700">
                  Address cannot be changed once order is shipped. Contact us
                  immediately if changes are needed.
                </p>
              </div>
            </div>
          </section>

          {/* Special Circumstances */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Special Circumstances
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">
                  Holidays & Festivals
                </h3>
                <p className="text-sm text-yellow-700 mb-2">
                  Delivery may be delayed during national holidays and
                  festivals:
                </p>
                <ul className="text-xs text-yellow-700 space-y-1">
                  <li>• Diwali, Christmas, New Year</li>
                  <li>• Regional festivals (Durga Puja, Ganesh Chaturthi)</li>
                  <li>• National holidays (Independence Day, Republic Day)</li>
                </ul>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-800 mb-2">
                  Weather Conditions
                </h3>
                <p className="text-sm text-red-700 mb-2">
                  Deliveries may be affected by severe weather:
                </p>
                <ul className="text-xs text-red-700 space-y-1">
                  <li>• Heavy monsoons or flooding</li>
                  <li>• Cyclones or severe storms</li>
                  <li>• Extreme heat warnings</li>
                  <li>• Natural disasters</li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <h3 className="font-semibold text-blue-800 mb-2">
                COVID-19 Safety Measures
              </h3>
              <p className="text-sm text-blue-700">
                All delivery personnel follow safety protocols including masks,
                sanitization, and contactless delivery options to ensure your
                safety.
              </p>
            </div>
          </section>

          {/* International Shipping */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              International Shipping
            </h2>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="h-6 w-6 text-gray-600" />
                <h3 className="text-lg font-semibold">Currently Unavailable</h3>
              </div>
              <p className="text-gray-700 mb-3">
                We currently ship only within India. International shipping will
                be available soon.
              </p>
              <p className="text-sm text-gray-600">
                Subscribe to our newsletter to be notified when international
                shipping becomes available.
              </p>
            </div>
          </section>

          {/* Customer Support */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Shipping Support
            </h2>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold mb-4">
                Need Help with Your Delivery?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="h-4 w-4 text-brown-600" />
                    <span className="font-medium">Contact Information</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    Email: shipping@luxearomaboutique.com
                  </p>
                  <p className="text-sm text-gray-700">
                    Phone: +91 98765-43210
                  </p>
                  <p className="text-sm text-gray-700">
                    WhatsApp: +91 98765-43210
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-brown-600" />
                    <span className="font-medium">Support Hours</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    Monday - Saturday: 9:00 AM - 7:00 PM
                  </p>
                  <p className="text-sm text-gray-700">
                    Sunday: 10:00 AM - 6:00 PM
                  </p>
                  <p className="text-sm text-gray-700">
                    Response time: Within 2-4 hours
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Important Notes */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Important Information
            </h2>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <ul className="space-y-2 text-red-800 text-sm">
                <li>• Delivery times are estimates and not guaranteed</li>
                <li>
                  • Signature may be required for high-value orders (Rs 5,000+)
                </li>
                <li>
                  • We're not responsible for delays due to incorrect addresses
                </li>
                <li>• Additional charges may apply for remote locations</li>
                <li>
                  • Fragile items require special handling (additional Rs 50)
                </li>
                <li>
                  • Orders placed on weekends/holidays processed next business
                  day
                </li>
              </ul>
            </div>

            <p className="text-sm text-gray-500 mt-6">
              <strong>Last Updated:</strong> January 2025 |
              <strong> Version:</strong> 2.1
            </p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default ShippingDelivery;
