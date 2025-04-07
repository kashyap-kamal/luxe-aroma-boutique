
import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-luxe-black text-white pt-12 pb-6">
      <div className="luxury-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="col-span-1">
            <h3 className="text-2xl font-serif font-bold mb-4">
              Aromé <span className="text-luxe-gold">Luxe</span>
            </h3>
            <p className="text-gray-300 mb-4">
              Exquisite fragrances that tell a story and leave an impression.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-luxe-gold transition-colors">
                <Instagram />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-luxe-gold transition-colors">
                <Facebook />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-luxe-gold transition-colors">
                <Twitter />
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div className="col-span-1">
            <h4 className="text-lg font-medium mb-4">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-gray-300 hover:text-luxe-gold transition-colors">
                  All Perfumes
                </Link>
              </li>
              <li>
                <Link to="/products?category=men" className="text-gray-300 hover:text-luxe-gold transition-colors">
                  Men's Collection
                </Link>
              </li>
              <li>
                <Link to="/products?category=women" className="text-gray-300 hover:text-luxe-gold transition-colors">
                  Women's Collection
                </Link>
              </li>
              <li>
                <Link to="/products?category=unisex" className="text-gray-300 hover:text-luxe-gold transition-colors">
                  Unisex Collection
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="col-span-1">
            <h4 className="text-lg font-medium mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-luxe-gold transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-luxe-gold transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-gray-300 hover:text-luxe-gold transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-gray-300 hover:text-luxe-gold transition-colors">
                  Returns & Refunds
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="col-span-1">
            <h4 className="text-lg font-medium mb-4">Contact Us</h4>
            <address className="not-italic text-gray-300 space-y-2">
              <p>123 Luxury Avenue</p>
              <p>Mumbai, Maharashtra 400001</p>
              <p>India</p>
              <p className="mt-4">
                <a href="mailto:info@aromeluxe.com" className="hover:text-luxe-gold transition-colors">
                  info@aromeluxe.com
                </a>
              </p>
              <p>
                <a href="tel:+911234567890" className="hover:text-luxe-gold transition-colors">
                  +91 123 456 7890
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <p className="text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Aromé Luxe. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
