import Link from "next/link";

const Footer = () => {
  return (
    <footer className="pt-12 pb-8" style={{ background: "#f6f3f2" }}>
      <div className="luxury-container">
        {/* Top row: brand + links */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-10 mb-10">
          {/* Brand */}
          <div className="max-w-xs">
            <h3
              className="font-serif font-bold mb-2"
              style={{ fontSize: "1.15rem", color: "#1c1b1b" }}
            >
              Aromé Luxe
            </h3>
            <p
              className="font-sans leading-relaxed"
              style={{ fontSize: "0.82rem", color: "#7f7663" }}
            >
              Premium fragrances, honest prices. Curated for the modern
              connoisseur who refuses to compromise.
            </p>
          </div>

          {/* Link groups */}
          <div className="flex flex-wrap gap-10">
            <div>
              <p
                className="font-sans font-semibold mb-3 uppercase tracking-[0.08em]"
                style={{ fontSize: "0.7rem", color: "#1c1b1b" }}
              >
                Shop
              </p>
              <ul className="space-y-2">
                {[
                  { href: "/products", label: "All Perfumes" },
                  { href: "/products?category=men", label: "Men" },
                  { href: "/products?category=women", label: "Women" },
                  { href: "/products?category=unisex", label: "Unisex" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="font-sans transition-colors duration-150"
                      style={{ fontSize: "0.85rem", color: "#7f7663" }}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p
                className="font-sans font-semibold mb-3 uppercase tracking-[0.08em]"
                style={{ fontSize: "0.7rem", color: "#1c1b1b" }}
              >
                Information
              </p>
              <ul className="space-y-2">
                {[
                  { href: "/shipping-delivery", label: "Shipping" },
                  { href: "/cancellation-refund", label: "Returns" },
                  { href: "/privacy-policy", label: "Privacy" },
                  { href: "/about", label: "Provenance" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="font-sans transition-colors duration-150"
                      style={{ fontSize: "0.85rem", color: "#7f7663" }}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p
                className="font-sans font-semibold mb-3 uppercase tracking-[0.08em]"
                style={{ fontSize: "0.7rem", color: "#1c1b1b" }}
              >
                Contact
              </p>
              <ul className="space-y-2">
                {[
                  { href: "/contact", label: "Get in Touch" },
                  { href: "/terms-of-service", label: "Terms" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="font-sans transition-colors duration-150"
                      style={{ fontSize: "0.85rem", color: "#7f7663" }}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          className="my-6"
          style={{ height: "1px", background: "#e5e2e1" }}
        />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p
            className="font-sans"
            style={{ fontSize: "0.78rem", color: "#7f7663" }}
          >
            &copy; {new Date().getFullYear()} Aromé Luxe. All rights reserved.
          </p>
          <div className="flex gap-5">
            {[
              { href: "/", label: "Home" },
              { href: "/products", label: "Perfumes" },
              { href: "/cart", label: "Cart" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="font-sans font-medium transition-colors duration-150"
                style={{ fontSize: "0.78rem", color: "#7f7663" }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
