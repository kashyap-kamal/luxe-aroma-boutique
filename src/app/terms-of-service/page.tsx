import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const INK = "#0E0E0C";
const CREAM = "#F2EDE4";
const SAFFRON = "#E8763A";

const section = { marginTop: 40 };
const h2Style = {
  fontFamily: "var(--font-fraunces), serif",
  fontSize: "1.6rem",
  fontWeight: 300,
  color: INK,
  letterSpacing: "-0.02em",
  borderTop: `1px solid ${INK}`,
  paddingTop: 20,
  marginBottom: 14,
};
const pStyle = { marginBottom: 14, lineHeight: 1.75 };
const ulStyle = { listStyle: "disc", paddingLeft: 24, marginBottom: 20 };
const liStyle = { marginBottom: 8 };

const TermsOfService = () => {
  return (
    <div style={{ minHeight: "100vh", background: CREAM, color: INK, paddingTop: 80 }}>
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${INK}`, paddingTop: 40, paddingBottom: 40 }} className="px-5 md:px-12">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: INK,
              textDecoration: "none",
              marginBottom: 24,
              opacity: 0.6,
            }}
          >
            <ArrowLeft className="h-3 w-3" />
            Back to Home
          </Link>
          <div
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: 12,
              opacity: 0.5,
            }}
          >
            LEGAL / TERMS OF SERVICE
          </div>
          <h1
            style={{
              fontFamily: "var(--font-fraunces), serif",
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              fontWeight: 300,
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              margin: 0,
            }}
          >
            Terms of <em>Service</em>
          </h1>
          <p
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 10,
              letterSpacing: "0.15em",
              marginTop: 16,
              opacity: 0.5,
            }}
          >
            LAST UPDATED: APRIL 5, 2026
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ paddingTop: 48, paddingBottom: 80 }} className="luxury-container px-5 md:px-12">
        <div className="max-w-4xl mx-auto" style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 15, color: "#3A3833" }}>

          <div style={section}>
            <h2 style={h2Style}>1. Acceptance of Terms</h2>
            <p style={pStyle}>
              By accessing and using the Aromé Luxe website at{" "}
              <a href="https://aromeluxe.in" target="_blank" rel="noopener noreferrer" style={{ color: SAFFRON }}>https://aromeluxe.in</a>{" "}
              and any related services, you accept and agree to be bound by these terms.
              If you do not agree, please do not use this service.
            </p>
          </div>

          <div style={section}>
            <h2 style={h2Style}>2. Description of Service</h2>
            <p style={pStyle}>
              Aromé Luxe provides an online platform for the sale of luxury fragrances and related products.
              Our services include browsing products, placing orders, customer support, and account management.
              We reserve the right to modify, suspend, or discontinue any aspect of our service at any time.
            </p>
          </div>

          <div style={section}>
            <h2 style={h2Style}>3. User Accounts</h2>
            <p style={pStyle}>To access certain features of our website, you may be required to create an account. You are responsible for:</p>
            <ul style={ulStyle}>
              <li style={liStyle}>Maintaining the confidentiality of your account credentials</li>
              <li style={liStyle}>All activities that occur under your account</li>
              <li style={liStyle}>Providing accurate and complete information</li>
              <li style={liStyle}>Notifying us immediately of any unauthorized use</li>
            </ul>
            <p style={pStyle}>We reserve the right to terminate accounts that violate these terms or for any other reason at our discretion.</p>
          </div>

          <div style={section}>
            <h2 style={h2Style}>4. Product Information and Pricing</h2>
            <p style={pStyle}>We strive to provide accurate product descriptions, pricing, and availability information. However:</p>
            <ul style={ulStyle}>
              <li style={liStyle}>Product images are for illustrative purposes and may not reflect exact appearance</li>
              <li style={liStyle}>Prices are subject to change without notice</li>
              <li style={liStyle}>Product availability is not guaranteed</li>
              <li style={liStyle}>We reserve the right to correct pricing errors</li>
            </ul>
          </div>

          <div style={section}>
            <h2 style={h2Style}>5. Orders and Payment</h2>
            <p style={pStyle}>By placing an order, you:</p>
            <ul style={ulStyle}>
              <li style={liStyle}>Confirm that all information provided is accurate and complete</li>
              <li style={liStyle}>Agree to pay the specified price plus applicable taxes and shipping</li>
              <li style={liStyle}>Authorize us to process your payment via our payment gateway</li>
              <li style={liStyle}>Acknowledge that order confirmation does not guarantee product availability</li>
            </ul>
            <p style={pStyle}>
              All online payments are processed by <strong>Cashfree Payments India Pvt. Ltd.</strong>, an RBI-authorised Payment Aggregator.
              By completing a transaction, you also agree to{" "}
              <a href="https://www.cashfree.com/tnc/" target="_blank" rel="noopener noreferrer" style={{ color: SAFFRON }}>Cashfree&apos;s terms</a>.
              We accept UPI, credit/debit cards, and net banking. All payments are in INR.{" "}
              <strong>Cash on Delivery (COD) is not available.</strong>
            </p>
            <p style={pStyle}>
              <strong>Refund limitations:</strong> Refunds cannot be processed for transactions older than 120 days.
              Cash refunds are not offered; all refunds are credited to the original payment method only.
            </p>
            <p style={pStyle}>
              <strong>Chargebacks:</strong> If you initiate a chargeback, Cashfree will raise a dispute and we will submit evidence. Banks typically take 21–45 days to adjudicate.
            </p>
            <p style={pStyle}>
              <strong>Merchant-initiated cancellations:</strong> We may cancel an order if a product is out of stock, if we cannot verify your delivery address, or if there is a pricing or technical error. A full refund will be issued in such cases.
            </p>
          </div>

          <div style={section}>
            <h2 style={h2Style}>6. Shipping and Delivery</h2>
            <p style={pStyle}>All orders are shipped via <strong>Shiprocket</strong> courier partners. Please note:</p>
            <ul style={ulStyle}>
              <li style={liStyle}>Delivery times are estimates and may vary due to courier delays, weather, or public holidays</li>
              <li style={liStyle}>Risk of loss transfers to you upon delivery</li>
              <li style={liStyle}>You are responsible for providing an accurate and complete shipping address</li>
              <li style={liStyle}>We currently ship within India only</li>
              <li style={liStyle}><strong>Perfumes containing alcohol are classified as flammable goods under IATA regulations and are restricted from air transport.</strong> Such orders ship via surface/ground courier only (typically 5–9 business days).</li>
              <li style={liStyle}>Three delivery attempts are made before a shipment is returned (RTO)</li>
              <li style={liStyle}>Shiprocket&apos;s liability for lost or damaged shipments without add-on insurance is limited to ₹5,000 or the declared order value, whichever is lower</li>
            </ul>
            <p style={pStyle}>
              For full details, see our <Link href="/shipping-delivery" style={{ color: SAFFRON }}>Shipping &amp; Delivery Policy</Link>.
            </p>
          </div>

          <div style={section}>
            <h2 style={h2Style}>7. Returns and Refunds</h2>
            <p style={pStyle}>Our return policy allows for returns within <strong>7 days of delivery</strong>, subject to:</p>
            <ul style={ulStyle}>
              <li style={liStyle}>Products must be <strong>unopened and in original packaging</strong> with seals intact</li>
              <li style={liStyle}>Return shipping costs are the customer&apos;s responsibility, except for defective or incorrectly delivered items</li>
              <li style={liStyle}>Refunds are initiated within 2–3 business days and credited within 5–7 working days</li>
              <li style={liStyle}>Opened or used perfumes, sale items, and personalised products cannot be returned unless defective</li>
              <li style={liStyle}>Refunds cannot be processed for transactions older than 120 days</li>
            </ul>
            <p style={pStyle}>
              For full details, see our <Link href="/cancellation-refund" style={{ color: SAFFRON }}>Cancellation &amp; Refund Policy</Link>.
            </p>
          </div>

          <div style={section}>
            <h2 style={h2Style}>8. Intellectual Property</h2>
            <p style={pStyle}>
              All content on this website, including text, graphics, logos, images, and software, is the property of Aromé Luxe or its licensors
              and is protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative
              works without our express written consent.
            </p>
          </div>

          <div style={section}>
            <h2 style={h2Style}>9. Prohibited Uses</h2>
            <p style={pStyle}>You agree not to use our website for any unlawful purpose. Prohibited activities include:</p>
            <ul style={ulStyle}>
              <li style={liStyle}>Attempting to gain unauthorized access to our systems</li>
              <li style={liStyle}>Using automated tools to access our website</li>
              <li style={liStyle}>Interfering with the proper functioning of our website</li>
              <li style={liStyle}>Transmitting viruses or malicious code</li>
            </ul>
          </div>

          <div style={section}>
            <h2 style={h2Style}>10. Privacy Policy</h2>
            <p style={pStyle}>
              Your privacy is important to us. Please review our{" "}
              <Link href="/privacy-policy" style={{ color: SAFFRON }}>Privacy Policy</Link>,
              which also governs your use of our website and is incorporated into these Terms of Service by reference.
            </p>
          </div>

          <div style={section}>
            <h2 style={h2Style}>11. Disclaimers and Limitations</h2>
            <p style={pStyle}>Our website and services are provided &quot;as is&quot; without warranties of any kind. In no event shall Aromé Luxe be liable for any indirect, incidental, special, or consequential damages arising from your use of our website or services.</p>
          </div>

          <div style={section}>
            <h2 style={h2Style}>12. Fragrance Sensitivity & Allergen Disclaimer</h2>
            <p style={pStyle}>Fragrances and perfumes contain complex chemical compounds that may cause allergic reactions in some individuals. By purchasing, you acknowledge that:</p>
            <ul style={ulStyle}>
              <li style={liStyle}>You have considered any known fragrance allergies before purchase</li>
              <li style={liStyle}>We are not liable for any adverse reactions arising from use of our products</li>
              <li style={liStyle}>Opened or used products cannot be returned due to health and hygiene reasons</li>
              <li style={liStyle}>If you experience a reaction, discontinue use immediately and consult a medical professional</li>
            </ul>
            <p style={pStyle}>
              For known fragrance allergies, contact us at <a href="mailto:contact@aromeluxe.in" style={{ color: SAFFRON }}>contact@aromeluxe.in</a> before purchasing.
            </p>
          </div>

          <div style={section}>
            <h2 style={h2Style}>13. Governing Law</h2>
            <p style={pStyle}>
              These Terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Ghaziabad, Uttar Pradesh, India.
            </p>
          </div>

          <div style={section}>
            <h2 style={h2Style}>14. Changes to Terms</h2>
            <p style={pStyle}>
              We reserve the right to modify these Terms at any time. Changes are effective immediately upon posting. Continued use of our website after changes constitutes acceptance of the modified terms.
            </p>
          </div>

          <div style={section}>
            <h2 style={h2Style}>15. Contact Information</h2>
            <p style={pStyle}>If you have any questions about these Terms of Service:</p>
            <div style={{ background: "rgba(14,14,12,0.04)", border: `1px solid rgba(14,14,12,0.12)`, padding: "20px 24px", marginTop: 16 }}>
              <p style={{ margin: 0, fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 12, letterSpacing: "0.1em" }}>
                <span style={{ opacity: 0.5 }}>EMAIL</span> &nbsp;
                <a href="mailto:contact@aromeluxe.in" style={{ color: SAFFRON }}>contact@aromeluxe.in</a>
                <br /><br />
                <span style={{ opacity: 0.5 }}>ADDRESS</span> &nbsp;
                <span style={{ color: INK }}>Aromé Luxe, A5 901 Olive County, Vasundhara, Ghaziabad — 201010, Uttar Pradesh, India</span>
              </p>
            </div>
          </div>

          <div style={{ marginTop: 60, paddingTop: 24, borderTop: `1px solid rgba(14,14,12,0.15)`, textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, letterSpacing: "0.15em", opacity: 0.4, textTransform: "uppercase" }}>
              By using our website, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
