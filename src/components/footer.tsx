import Link from "next/link";

const INK = "#0E0E0C";
const CREAM = "#F2EDE4";
const SAFFRON = "#E8763A";

const footerColumns = [
  {
    head: "SHOP",
    items: [
      { href: "/products", label: "ALL PERFUMES" },
      { href: "/products?category=men", label: "MEN" },
      { href: "/products?category=women", label: "WOMEN" },
      { href: "/products?category=unisex", label: "UNISEX" },
    ],
  },
  {
    head: "INFO",
    items: [
      { href: "/shipping-delivery", label: "SHIPPING" },
      { href: "/cancellation-refund", label: "RETURNS" },
      { href: "/privacy-policy", label: "PRIVACY" },
      { href: "/about", label: "ABOUT" },
    ],
  },
  {
    head: "CONTACT",
    items: [
      { href: "/contact", label: "GET IN TOUCH" },
      { href: "/terms-of-service", label: "TERMS" },
    ],
  },
];

const Footer = () => {
  return (
    <footer
      style={{
        background: INK,
        color: CREAM,
        borderTop: `1px solid ${INK}`,
      }}
    >
      {/* Main footer grid */}
      <div
        style={{
          gridTemplateColumns: "2fr 1fr 1fr 1fr",
          gap: 0,
          borderBottom: `1px solid rgba(242,237,228,0.1)`,
        }}
        className="hidden md:grid"
      >
        {/* Brand column */}
        <div
          style={{
            padding: "56px 48px",
            borderRight: `1px solid rgba(242,237,228,0.08)`,
          }}
        >
          <div
            style={{
              fontSize: "2rem",
              fontWeight: 300,
              fontFamily: "var(--font-fraunces), serif",
              letterSpacing: "-0.02em",
            }}
          >
            Aromé <em style={{ fontStyle: "italic", color: SAFFRON }}>Luxe.</em>
          </div>
          <div
            style={{
              marginTop: 16,
              opacity: 0.45,
              lineHeight: 1.7,
              maxWidth: 300,
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 10,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            PREMIUM FRAGRANCES, HONEST PRICES.
            <br />
            CURATED FOR THE CONNOISSEUR WHO
            <br />
            REFUSES TO COMPROMISE.
          </div>
        </div>

        {/* Link columns */}
        {footerColumns.map((col) => (
          <div
            key={col.head}
            style={{
              padding: "56px 32px",
              borderRight: `1px solid rgba(242,237,228,0.08)`,
            }}
          >
            <div
              style={{
                color: SAFFRON,
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginBottom: 20,
              }}
            >
              {col.head}
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {col.items.map((item) => (
                <li key={item.href} style={{ marginBottom: 12 }}>
                  <Link
                    href={item.href}
                    style={{
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                      fontSize: 10,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: CREAM,
                      opacity: 0.55,
                      textDecoration: "none",
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Mobile footer */}
      <div className="flex flex-col md:hidden" style={{ padding: "40px 20px" }}>
        <div
          style={{
            fontSize: "1.6rem",
            fontWeight: 300,
            fontFamily: "var(--font-fraunces), serif",
            marginBottom: 16,
          }}
        >
          Aromé <em style={{ fontStyle: "italic", color: SAFFRON }}>Luxe.</em>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
            marginBottom: 32,
          }}
        >
          {footerColumns.map((col) => (
            <div key={col.head}>
              <div
                style={{
                  color: SAFFRON,
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: 9,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  marginBottom: 12,
                }}
              >
                {col.head}
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {col.items.map((item) => (
                  <li key={item.href} style={{ marginBottom: 8 }}>
                    <Link
                      href={item.href}
                      style={{
                        fontFamily: "var(--font-jetbrains-mono), monospace",
                        fontSize: 9,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: CREAM,
                        opacity: 0.5,
                        textDecoration: "none",
                      }}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Colophon */}
      <div
        style={{
          padding: "20px 48px",
          borderTop: `1px solid rgba(242,237,228,0.08)`,
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: 10,
          letterSpacing: "0.12em",
          opacity: 0.3,
          textTransform: "uppercase",
        }}
        className="hidden md:flex"
      >
        <span>© MMXXVI AROMÉ LUXE — ALL RIGHTS RESERVED</span>
        <span>SET IN FRAUNCES &amp; JETBRAINS MONO</span>
        <span>BOMBAY · INDIA</span>
      </div>

      {/* Mobile colophon */}
      <div
        className="flex md:hidden"
        style={{
          padding: "16px 20px",
          borderTop: `1px solid rgba(242,237,228,0.08)`,
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: 9,
          letterSpacing: "0.1em",
          opacity: 0.3,
          textTransform: "uppercase",
        }}
      >
        © MMXXVI AROMÉ LUXE
      </div>
    </footer>
  );
};

export default Footer;
