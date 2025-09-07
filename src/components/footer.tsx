import Link from "next/link";

const Footer = () => {
  return (
    <footer className="pt-12 pb-6 text-black bg-luxe-aliceBlue">
      <div className="luxury-container">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Logo and About Column */}
          <div className="col-span-1">
            <h3 className="mb-4 text-xl font-black font-poppins text-luxe-blue">
              Aromé Luxe
            </h3>
            <p className="mb-4 text-sm">
              Experience the epitome of luxury fragrances, crafted with
              precision and passion to elevate your presence.
            </p>
          </div>

          {/* Shop Column */}
          <div className="col-span-1">
            <h4 className="mb-4 text-lg font-medium text-luxe-blue">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/products"
                  className="text-black transition-colors hover:text-luxe-sandy"
                >
                  All Perfumes
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=men"
                  className="text-black transition-colors hover:text-luxe-sandy"
                >
                  Men&apos;s Collection
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=women"
                  className="text-black transition-colors hover:text-luxe-sandy"
                >
                  Women&apos;s Collection
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=unisex"
                  className="text-black transition-colors hover:text-luxe-sandy"
                >
                  Unisex Collection
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="col-span-1">
            <h4 className="mb-4 text-lg font-medium text-luxe-blue">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-black transition-colors hover:text-luxe-sandy"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-black transition-colors hover:text-luxe-sandy"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-black transition-colors hover:text-luxe-sandy"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-black transition-colors hover:text-luxe-sandy"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="col-span-1">
            <h4 className="mb-4 text-lg font-medium text-luxe-blue">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="transition-colors hover:text-luxe-sandy">
                  FAQs
                </a>
              </li>
              <li>
                <Link
                  href="/shipping-delivery"
                  className="transition-colors hover:text-luxe-sandy"
                >
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link
                  href="/cancellation-refund"
                  className="transition-colors hover:text-luxe-sandy"
                >
                  Returns & Refunds
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-8 border-gray-200" />

        <div className="flex flex-col items-center justify-between md:flex-row">
          <p className="mb-4 text-sm text-gray-600 md:mb-0">
            &copy; {new Date().getFullYear()} Aromé Luxe. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link
              href="/privacy-policy"
              className="text-sm text-gray-600 hover:text-luxe-sandy"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="text-sm text-gray-600 hover:text-luxe-sandy"
            >
              Terms of Service
            </Link>
            <Link
              href="/shipping-delivery"
              className="text-sm text-gray-600 hover:text-luxe-sandy"
            >
              Shipping & Delivery
            </Link>
            <Link
              href="/cancellation-refund"
              className="text-sm text-gray-600 hover:text-luxe-sandy"
            >
              Returns & Refunds
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
