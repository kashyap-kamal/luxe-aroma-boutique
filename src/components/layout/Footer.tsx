import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-luxe-aliceBlue text-black pt-12 pb-6">
      <div className="luxury-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and About Column */}
          <div className="col-span-1">
            <h3 className="text-xl font-poppins font-black text-luxe-blue mb-4">
              Aromé Luxe
            </h3>
            <p className="text-sm mb-4">
              Experience the epitome of luxury fragrances, crafted with
              precision and passion to elevate your presence.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                aria-label="Facebook"
                className="hover:text-luxe-blue transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="hover:text-luxe-sandy transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="hover:text-luxe-sandy transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div className="col-span-1">
            <h4 className="text-lg font-medium mb-4 text-luxe-blue">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/products"
                  className="text-black hover:text-luxe-sandy transition-colors"
                >
                  All Perfumes
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=men"
                  className="text-black hover:text-luxe-sandy transition-colors"
                >
                  Men's Collection
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=women"
                  className="text-black hover:text-luxe-sandy transition-colors"
                >
                  Women's Collection
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=unisex"
                  className="text-black hover:text-luxe-sandy transition-colors"
                >
                  Unisex Collection
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="col-span-1">
            <h4 className="text-lg font-medium mb-4 text-luxe-blue">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-black hover:text-luxe-sandy transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="text-black hover:text-luxe-sandy transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-black hover:text-luxe-sandy transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-black hover:text-luxe-sandy transition-colors"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="col-span-1">
            <h4 className="text-lg font-medium mb-4 text-luxe-blue">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-luxe-sandy transition-colors">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-luxe-sandy transition-colors">
                  Shipping & Returns
                </a>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-8 border-gray-200" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Aromé Luxe. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-sm text-gray-600 hover:text-luxe-sandy">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-luxe-sandy">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
