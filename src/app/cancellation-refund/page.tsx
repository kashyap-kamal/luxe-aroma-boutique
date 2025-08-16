import React from "react";
import {
  RotateCcw,
  CreditCard,
  Clock,
  ShieldCheck,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";

const CancellationRefund: React.FC = () => {
  return (
    <main className="flex-grow py-8">
      <div className="luxury-container">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <RotateCcw className="h-12 w-12 text-brown-600" />
          </div>
          <h1 className="text-3xl font-serif font-bold mb-2">
            Cancellation & Refund Policy
          </h1>
          <p className="text-lg text-gray-600">
            Your satisfaction is our priority. Learn about our flexible return
            and refund process.
          </p>
        </div>

        <div className="prose prose-lg max-w-4xl mx-auto">
          {/* Quick Overview */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-blue-800">
              Quick Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-blue-700">
                  7-day return window
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-blue-700">
                  5-7 business days refund
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-blue-700">
                  Free returns on defects
                </span>
              </div>
            </div>
          </div>

          {/* Order Cancellation */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Order Cancellation
            </h2>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-green-800">
                    Before Processing
                  </h3>
                  <p className="text-sm text-green-700">
                    You can cancel your order for free within 2 hours of placing
                    it, provided it hasn't been processed for shipping.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-800">
                    After Processing
                  </h3>
                  <p className="text-sm text-yellow-700">
                    Once your order is processed, you'll need to follow our
                    return process to receive a refund.
                  </p>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-3">How to Cancel</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Contact us immediately via phone, email, or live chat</li>
              <li>Provide your order number and reason for cancellation</li>
              <li>
                We'll confirm cancellation and process your refund within 24
                hours
              </li>
            </ol>
          </section>

          {/* Returns Policy */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Returns Policy
            </h2>

            <h3 className="text-lg font-semibold mb-3">Return Window</h3>
            <p className="mb-4">
              You have <strong>7 days</strong> from the date of delivery to
              initiate a return. All returned items must be in their original
              condition with tags attached.
            </p>

            <h3 className="text-lg font-semibold mb-3">Eligible Items</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" /> Returnable Items
                </h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Unopened perfumes and cosmetics</li>
                  <li>• Items with defects or damage</li>
                  <li>• Wrong items delivered</li>
                  <li>• Items not matching description</li>
                  <li>• Accessories and gift sets</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-red-800 mb-2 flex items-center gap-2">
                  <XCircle className="h-4 w-4" /> Non-Returnable Items
                </h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Opened or used perfumes</li>
                  <li>• Personalized or custom items</li>
                  <li>• Items damaged by customer</li>
                  <li>• Items without original packaging</li>
                  <li>• Sale items (unless defective)</li>
                </ul>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-3">Return Process</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>
                <strong>Initiate Return:</strong> Contact customer service
                within 7 days of delivery
              </li>
              <li>
                <strong>Return Authorization:</strong> We'll provide a return
                authorization number (RMA)
              </li>
              <li>
                <strong>Package Items:</strong> Pack items securely in original
                packaging
              </li>
              <li>
                <strong>Ship Items:</strong> Use the prepaid return label we
                provide
              </li>
              <li>
                <strong>Processing:</strong> We'll inspect and process your
                return within 2-3 business days
              </li>
            </ol>
          </section>

          {/* Refund Policy */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Refund Policy
            </h2>

            <h3 className="text-lg font-semibold mb-3">Refund Timeline</h3>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Return received & inspected:</span>
                  <span className="font-medium">1-2 business days</span>
                </div>
                <div className="flex justify-between">
                  <span>Refund processed:</span>
                  <span className="font-medium">2-3 business days</span>
                </div>
                <div className="flex justify-between">
                  <span>Bank/card credit:</span>
                  <span className="font-medium">3-5 business days</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between font-semibold">
                  <span>Total time:</span>
                  <span>5-10 business days</span>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-3">Refund Methods</h3>
            <ul className="space-y-2 text-gray-700">
              <li>
                <strong>Original Payment Method:</strong> Refunds will be
                credited to the same payment method used for purchase
              </li>
              <li>
                <strong>UPI/Digital Wallets:</strong> Refunds processed within
                1-2 business days
              </li>
              <li>
                <strong>Credit/Debit Cards:</strong> Refunds may take 3-7
                business days depending on your bank
              </li>
              <li>
                <strong>Net Banking:</strong> Refunds typically processed within
                2-5 business days
              </li>
            </ul>

            <h3 className="text-lg font-semibold mb-3 mt-6">Partial Refunds</h3>
            <p className="mb-2">Partial refunds may be given for:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Items with minor damage not caused during shipping</li>
              <li>Items returned after 7 days but within 14 days</li>
              <li>Items missing original packaging or accessories</li>
              <li>Restocking fees for large or custom orders</li>
            </ul>
          </section>

          {/* Exchange Policy */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Exchange Policy
            </h2>

            <p className="mb-4">
              We offer exchanges for defective items or wrong items delivered.
              Exchanges are subject to product availability and must be
              initiated within 7 days of delivery.
            </p>

            <h3 className="text-lg font-semibold mb-3">Exchange Process</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Contact us to request an exchange</li>
              <li>We'll provide an exchange authorization</li>
              <li>Ship the item back using our prepaid label</li>
              <li>
                We'll send the replacement item once we receive the returned
                item
              </li>
            </ol>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> If the replacement item has a higher
                price, you'll be charged the difference. If it's lower, we'll
                refund the difference.
              </p>
            </div>
          </section>

          {/* Shipping Costs */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Return Shipping Costs
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">
                  We Pay Return Shipping
                </h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Defective or damaged items</li>
                  <li>• Wrong items delivered</li>
                  <li>• Items not matching description</li>
                  <li>• Our shipping error</li>
                </ul>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">
                  Customer Pays Return Shipping
                </h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Change of mind returns</li>
                  <li>• Size or color preference</li>
                  <li>• Items ordered by mistake</li>
                  <li>• Non-defective returns</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Contact Us for Returns
            </h2>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold mb-4">Customer Service</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p>
                    <strong>Email:</strong> returns@luxearomaboutique.com
                  </p>
                  <p>
                    <strong>Phone:</strong> +91 98765-43210
                  </p>
                  <p>
                    <strong>WhatsApp:</strong> +91 98765-43210
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Hours:</strong> 9:00 AM - 7:00 PM (Mon-Sat)
                  </p>
                  <p>
                    <strong>Response Time:</strong> Within 24 hours
                  </p>
                  <p>
                    <strong>Live Chat:</strong> Available on website
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Important Notes */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Important Notes
            </h2>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <ul className="space-y-2 text-red-800 text-sm">
                <li>
                  • All return requests must be initiated within 7 days of
                  delivery
                </li>
                <li>
                  • Items must be in original condition with all packaging and
                  tags
                </li>
                <li>• Refunds are processed only after quality inspection</li>
                <li>
                  • Custom or personalized items cannot be returned unless
                  defective
                </li>
                <li>
                  • International orders may have different return policies
                </li>
                <li>
                  • Misuse of return policy may result in account suspension
                </li>
              </ul>
            </div>
          </section>

          {/* Policy Updates */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Policy Updates
            </h2>
            <p className="text-gray-700">
              This policy may be updated from time to time. Any changes will be
              posted on this page with an updated effective date. Continued use
              of our service after changes constitutes acceptance of the updated
              policy.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              <strong>Last Updated:</strong> January 2025
            </p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default CancellationRefund;
