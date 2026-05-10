import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const INK = "#0E0E0C";
const CREAM = "#F2EDE4";
const SAFFRON = "#E8763A";

const PrivacyPolicy = () => {
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
            LEGAL / PRIVACY POLICY
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
            Privacy <em>Policy</em>
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
        <div className="max-w-4xl mx-auto" style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 15, lineHeight: 1.75, color: "#3A3833" }}>

          <p style={{ marginBottom: 24 }}>
            This Privacy Policy describes Our policies and procedures on the
            collection, use and disclosure of Your information when You use the
            Service and tells You about Your privacy rights and how the law
            protects You.
          </p>

          <p style={{ marginBottom: 32 }}>
            We use Your Personal data to provide and improve the Service. By
            using the Service, You agree to the collection and use of
            information in accordance with this Privacy Policy.
          </p>

          <h2 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "1.8rem", fontWeight: 300, color: INK, letterSpacing: "-0.02em", marginTop: 48, marginBottom: 20, borderTop: `1px solid ${INK}`, paddingTop: 24 }}>
            Interpretation and Definitions
          </h2>

          <h3 style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: INK, marginTop: 28, marginBottom: 12 }}>
            Interpretation
          </h3>
          <p style={{ marginBottom: 20 }}>
            The words of which the initial letter is capitalized have meanings
            defined under the following conditions. The following definitions
            shall have the same meaning regardless of whether they appear in
            singular or in plural.
          </p>

          <h3 style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: INK, marginTop: 28, marginBottom: 12 }}>
            Definitions
          </h3>
          <p style={{ marginBottom: 12 }}>For the purposes of this Privacy Policy:</p>

          <ul style={{ listStyle: "disc", paddingLeft: 24, marginBottom: 32 }}>
            <li style={{ marginBottom: 12 }}><strong>Account</strong> means a unique account created for You to access our Service or parts of our Service.</li>
            <li style={{ marginBottom: 12 }}><strong>Affiliate</strong> means an entity that controls, is controlled by or is under common control with a party, where &quot;control&quot; means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.</li>
            <li style={{ marginBottom: 12 }}><strong>Company</strong> (referred to as either &quot;the Company&quot;, &quot;We&quot;, &quot;Us&quot; or &quot;Our&quot; in this Agreement) refers to Arome Luxe, A5 901 Olive County Vasundhara Ghaziabad - 201010.</li>
            <li style={{ marginBottom: 12 }}><strong>Cookies</strong> are small files that are placed on Your computer, mobile device or any other device by a website, containing the details of Your browsing history on that website among its many uses.</li>
            <li style={{ marginBottom: 12 }}><strong>Country</strong> refers to: Uttar Pradesh, India.</li>
            <li style={{ marginBottom: 12 }}><strong>Device</strong> means any device that can access the Service such as a computer, a cellphone or a digital tablet.</li>
            <li style={{ marginBottom: 12 }}><strong>Personal Data</strong> is any information that relates to an identified or identifiable individual.</li>
            <li style={{ marginBottom: 12 }}><strong>Service</strong> refers to the Website.</li>
            <li style={{ marginBottom: 12 }}><strong>Service Provider</strong> means any natural or legal person who processes the data on behalf of the Company.</li>
            <li style={{ marginBottom: 12 }}><strong>Usage Data</strong> refers to data collected automatically, either generated by the use of the Service or from the Service infrastructure itself.</li>
            <li style={{ marginBottom: 12 }}><strong>Website</strong> refers to Arome Luxe, accessible from <a href="https://aromeluxe.in/" rel="external nofollow noopener" target="_blank" style={{ color: SAFFRON }}>https://aromeluxe.in/</a></li>
            <li style={{ marginBottom: 12 }}><strong>You</strong> means the individual accessing or using the Service.</li>
          </ul>

          <h2 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "1.8rem", fontWeight: 300, color: INK, letterSpacing: "-0.02em", marginTop: 48, marginBottom: 20, borderTop: `1px solid ${INK}`, paddingTop: 24 }}>
            Collecting and Using Your Personal Data
          </h2>

          <h3 style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: INK, marginTop: 28, marginBottom: 12 }}>Types of Data Collected</h3>
          <h4 style={{ fontWeight: 600, color: INK, marginTop: 20, marginBottom: 8 }}>Personal Data</h4>
          <p style={{ marginBottom: 12 }}>While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. This may include:</p>
          <ul style={{ listStyle: "disc", paddingLeft: 24, marginBottom: 24 }}>
            <li style={{ marginBottom: 6 }}>Email address</li>
            <li style={{ marginBottom: 6 }}>First name and last name</li>
            <li style={{ marginBottom: 6 }}>Phone number</li>
            <li style={{ marginBottom: 6 }}>Address, State, Province, ZIP/Postal code, City</li>
            <li style={{ marginBottom: 6 }}>Usage Data</li>
          </ul>

          <h4 style={{ fontWeight: 600, color: INK, marginTop: 20, marginBottom: 8 }}>Usage Data</h4>
          <p style={{ marginBottom: 12 }}>Usage Data is collected automatically when using the Service. It may include Your Device&apos;s IP address, browser type, pages visited, time spent, and other diagnostic data.</p>
          <p style={{ marginBottom: 24 }}>We may also collect information that Your browser sends whenever You visit our Service or when You access the Service through a mobile device.</p>

          <h4 style={{ fontWeight: 600, color: INK, marginTop: 20, marginBottom: 8 }}>Tracking Technologies and Cookies</h4>
          <p style={{ marginBottom: 12 }}>We use Cookies and similar tracking technologies to track activity on Our Service. We use both Session and Persistent Cookies for the purposes set out below:</p>
          <ul style={{ listStyle: "disc", paddingLeft: 24, marginBottom: 24 }}>
            <li style={{ marginBottom: 12 }}><strong>Necessary / Essential Cookies</strong> — Session Cookies that are essential to provide services available through the Website.</li>
            <li style={{ marginBottom: 12 }}><strong>Cookies Policy / Notice Acceptance Cookies</strong> — Persistent Cookies that identify if users have accepted the use of cookies.</li>
            <li style={{ marginBottom: 12 }}><strong>Functionality Cookies</strong> — Persistent Cookies that allow us to remember choices You make when You use the Website.</li>
          </ul>

          <h3 style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: INK, marginTop: 28, marginBottom: 12 }}>Third-Party Data Processors</h3>
          <p style={{ marginBottom: 12 }}>When you make a purchase, your payment and personal data is processed by:</p>
          <ul style={{ listStyle: "disc", paddingLeft: 24, marginBottom: 24 }}>
            <li style={{ marginBottom: 12 }}><strong>Cashfree Payments India Pvt. Ltd.</strong> — Our RBI-authorised payment gateway. Privacy policy at <a href="https://www.cashfree.com/privacypolicy/" target="_blank" rel="noopener noreferrer" style={{ color: SAFFRON }}>cashfree.com/privacypolicy</a>.</li>
            <li style={{ marginBottom: 12 }}><strong>Shiprocket (Bigfoot Retail Solutions Pvt. Ltd.)</strong> — Our logistics partner. Privacy policy at <a href="https://www.shiprocket.in/privacy-policy/" target="_blank" rel="noopener noreferrer" style={{ color: SAFFRON }}>shiprocket.in/privacy-policy</a>.</li>
          </ul>

          <h3 style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: INK, marginTop: 28, marginBottom: 12 }}>Use of Your Personal Data</h3>
          <p style={{ marginBottom: 12 }}>The Company may use Personal Data for:</p>
          <ul style={{ listStyle: "disc", paddingLeft: 24, marginBottom: 24 }}>
            <li style={{ marginBottom: 8 }}><strong>Providing and maintaining our Service</strong></li>
            <li style={{ marginBottom: 8 }}><strong>Managing Your Account</strong></li>
            <li style={{ marginBottom: 8 }}><strong>Fulfilling contracts</strong> — processing purchases and delivering orders</li>
            <li style={{ marginBottom: 8 }}><strong>Contacting You</strong> — updates, order status, security notifications</li>
            <li style={{ marginBottom: 8 }}><strong>Marketing communications</strong> — newsletters (unsubscribe anytime)</li>
            <li style={{ marginBottom: 8 }}><strong>Managing requests</strong></li>
            <li style={{ marginBottom: 8 }}><strong>Business transfers</strong></li>
            <li style={{ marginBottom: 8 }}><strong>Analytics and service improvement</strong></li>
          </ul>

          <h3 style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: INK, marginTop: 28, marginBottom: 12 }}>Retention of Your Personal Data</h3>
          <p style={{ marginBottom: 12 }}>We retain Personal Data only as long as necessary. Order and transaction records are retained for a minimum of 3 years for legal compliance. Newsletter data is retained until you unsubscribe. Account data is retained while your account is active and for up to 1 year after a deletion request.</p>

          <h3 style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: INK, marginTop: 28, marginBottom: 12 }}>Delete Your Personal Data</h3>
          <p style={{ marginBottom: 24 }}>You have the right to delete or request deletion of the Personal Data We have collected about You. Contact us at <a href="mailto:contact@aromeluxe.in" style={{ color: SAFFRON }}>contact@aromeluxe.in</a> to exercise this right. We may need to retain certain information when we have a legal obligation to do so.</p>

          <h2 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "1.8rem", fontWeight: 300, color: INK, letterSpacing: "-0.02em", marginTop: 48, marginBottom: 20, borderTop: `1px solid ${INK}`, paddingTop: 24 }}>
            Children&apos;s Privacy
          </h2>
          <p style={{ marginBottom: 24 }}>Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from anyone under 13. If You are aware that Your child has provided Us with Personal Data, please contact Us.</p>

          <h2 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "1.8rem", fontWeight: 300, color: INK, letterSpacing: "-0.02em", marginTop: 48, marginBottom: 20, borderTop: `1px solid ${INK}`, paddingTop: 24 }}>
            Security of Your Personal Data
          </h2>
          <p style={{ marginBottom: 24 }}>The security of Your Personal Data is important to Us. While We strive to use commercially acceptable means to protect Your data, no method of transmission over the Internet is 100% secure.</p>

          <h2 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "1.8rem", fontWeight: 300, color: INK, letterSpacing: "-0.02em", marginTop: 48, marginBottom: 20, borderTop: `1px solid ${INK}`, paddingTop: 24 }}>
            Changes to this Privacy Policy
          </h2>
          <p style={{ marginBottom: 12 }}>We may update Our Privacy Policy from time to time. We will notify You of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.</p>

          <h2 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "1.8rem", fontWeight: 300, color: INK, letterSpacing: "-0.02em", marginTop: 48, marginBottom: 20, borderTop: `1px solid ${INK}`, paddingTop: 24 }}>
            Contact Us
          </h2>
          <p style={{ marginBottom: 8 }}>If you have any questions about this Privacy Policy:</p>
          <p><a href="mailto:contact@aromeluxe.in" style={{ color: SAFFRON, fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 12, letterSpacing: "0.1em" }}>contact@aromeluxe.in</a></p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
