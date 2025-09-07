import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-luxe-aliceBlue">
      <div className="luxury-container py-12">
        {/* Back to Home Button */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Terms of Service Content */}
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 prose prose-lg">
          <h1 className="text-3xl font-bold text-luxe-blue mb-4">
            TERMS OF SERVICE
          </h1>
          <p className="text-gray-600 mb-8">Last updated: July 20, 2025</p>

          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-luxe-blue mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing and using the Aromé Luxe website at{" "}
                <a
                  href="https://aromeluxe.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-luxe-blue hover:underline"
                >
                  https://aromeluxe.in
                </a>{" "}
                and any related services, you accept and agree to be bound by
                the terms and provision of this agreement. If you do not agree
                to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-luxe-blue mb-4">
                2. Description of Service
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Aromé Luxe provides an online platform for the sale of luxury
                fragrances and related products. Our services include browsing
                products, placing orders, customer support, and account
                management. We reserve the right to modify, suspend, or
                discontinue any aspect of our service at any time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-luxe-blue mb-4">
                3. User Accounts
              </h2>
              <div className="space-y-3">
                <p className="text-gray-700 leading-relaxed">
                  To access certain features of our website, you may be required
                  to create an account. You are responsible for:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>
                    Maintaining the confidentiality of your account credentials
                  </li>
                  <li>All activities that occur under your account</li>
                  <li>Providing accurate and complete information</li>
                  <li>Notifying us immediately of any unauthorized use</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  We reserve the right to terminate accounts that violate these
                  terms or for any other reason at our discretion.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-luxe-blue mb-4">
                4. Product Information and Pricing
              </h2>
              <div className="space-y-3">
                <p className="text-gray-700 leading-relaxed">
                  We strive to provide accurate product descriptions, pricing,
                  and availability information. However:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>
                    Product images are for illustrative purposes and may not
                    reflect exact appearance
                  </li>
                  <li>Prices are subject to change without notice</li>
                  <li>Product availability is not guaranteed</li>
                  <li>We reserve the right to correct pricing errors</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-luxe-blue mb-4">
                5. Orders and Payment
              </h2>
              <div className="space-y-3">
                <p className="text-gray-700 leading-relaxed">
                  By placing an order, you:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>
                    Confirm that all information provided is accurate and
                    complete
                  </li>
                  <li>
                    Agree to pay the specified price plus applicable taxes and
                    shipping
                  </li>
                  <li>Authorize us to process your payment</li>
                  <li>
                    Acknowledge that order confirmation does not guarantee
                    product availability
                  </li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  We accept various payment methods as indicated on our website.
                  All payments must be made in the currency specified.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-luxe-blue mb-4">
                6. Shipping and Delivery
              </h2>
              <div className="space-y-3">
                <p className="text-gray-700 leading-relaxed">
                  Shipping terms and delivery estimates are provided at
                  checkout. Please note:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Delivery times are estimates and may vary</li>
                  <li>Risk of loss transfers to you upon delivery</li>
                  <li>
                    You are responsible for providing accurate shipping
                    information
                  </li>
                  <li>
                    Additional charges may apply for international shipping
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-luxe-blue mb-4">
                7. Returns and Refunds
              </h2>
              <div className="space-y-3">
                <p className="text-gray-700 leading-relaxed">
                  Our return policy allows for returns within 30 days of
                  delivery, subject to the following conditions:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Products must be unused and in original packaging</li>
                  <li>
                    Return shipping costs are the responsibility of the customer
                  </li>
                  <li>Refunds will be processed within 14 business days</li>
                  <li>
                    Sale items and personalized products may have different
                    return terms
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-luxe-blue mb-4">
                8. Intellectual Property
              </h2>
              <p className="text-gray-700 leading-relaxed">
                All content on this website, including but not limited to text,
                graphics, logos, images, and software, is the property of Aromé
                Luxe or its licensors and is protected by copyright, trademark,
                and other intellectual property laws. You may not reproduce,
                distribute, or create derivative works without our express
                written consent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-luxe-blue mb-4">
                9. Prohibited Uses
              </h2>
              <div className="space-y-3">
                <p className="text-gray-700 leading-relaxed">
                  You agree not to use our website for any unlawful purpose or
                  in any way that could damage, disable, overburden, or impair
                  our servers or networks. Prohibited activities include:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Attempting to gain unauthorized access to our systems</li>
                  <li>Using automated tools to access our website</li>
                  <li>
                    Interfering with the proper functioning of our website
                  </li>
                  <li>Transmitting viruses or malicious code</li>
                  <li>Harassing or threatening other users</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-luxe-blue mb-4">
                10. Privacy Policy
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Your privacy is important to us. Please review our{" "}
                <Link
                  href="/privacy-policy"
                  className="text-luxe-blue hover:underline"
                >
                  Privacy Policy
                </Link>
                , which also governs your use of our website and is incorporated
                into these Terms of Service by reference.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-luxe-blue mb-4">
                11. Disclaimers and Limitations
              </h2>
              <div className="space-y-3">
                <p className="text-gray-700 leading-relaxed">
                  Our website and services are provided &quot;as is&quot;
                  without warranties of any kind. We disclaim all warranties,
                  express or implied, including but not limited to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>
                    Warranties of merchantability or fitness for a particular
                    purpose
                  </li>
                  <li>
                    Warranties that our website will be uninterrupted or
                    error-free
                  </li>
                  <li>Warranties regarding the accuracy of information</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  In no event shall Aromé Luxe be liable for any indirect,
                  incidental, special, or consequential damages arising from
                  your use of our website or services.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-luxe-blue mb-4">
                12. Indemnification
              </h2>
              <p className="text-gray-700 leading-relaxed">
                You agree to indemnify and hold harmless Aromé Luxe, its
                officers, directors, employees, and agents from any claims,
                damages, or expenses arising from your use of our website or
                violation of these terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-luxe-blue mb-4">
                13. Governing Law
              </h2>
              <p className="text-gray-700 leading-relaxed">
                These Terms of Service shall be governed by and construed in
                accordance with the laws of India. Any disputes arising from
                these terms shall be subject to the exclusive jurisdiction of
                the courts in India.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-luxe-blue mb-4">
                14. Changes to Terms
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify these Terms of Service at any
                time. Changes will be effective immediately upon posting on our
                website. Your continued use of our website after changes
                constitutes acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-luxe-blue mb-4">
                15. Contact Information
              </h2>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about these Terms of Service, please
                contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mt-3">
                <p className="text-gray-700">
                  <strong>Email:</strong> legal@aromeluxe.in
                  <br />
                  <strong>Address:</strong> Aromé Luxe, [Your Business Address]
                  <br />
                  <strong>Phone:</strong> [Your Phone Number]
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-luxe-blue mb-4">
                16. Severability
              </h2>
              <p className="text-gray-700 leading-relaxed">
                If any provision of these Terms of Service is found to be
                unenforceable or invalid, that provision will be limited or
                eliminated to the minimum extent necessary so that these Terms
                of Service will otherwise remain in full force and effect.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-luxe-blue mb-4">
                17. Entire Agreement
              </h2>
              <p className="text-gray-700 leading-relaxed">
                These Terms of Service, together with our Privacy Policy,
                constitute the entire agreement between you and Aromé Luxe
                regarding your use of our website and services.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              By using our website, you acknowledge that you have read,
              understood, and agree to be bound by these Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
