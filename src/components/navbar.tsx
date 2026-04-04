"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Menu, X, Search, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";
import { useUser } from "@/stores/auth-store";
import { UserMenu } from "@/components/auth/user-menu";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";

const leftLinks = [
  { href: "/products", label: "SHOP BY MOOD" },
  { href: "/products?category=men", label: "MEN" },
  { href: "/products?category=women", label: "WOMEN" },
];

const rightLinks = [
  { href: "/products?category=unisex", label: "UNISEX" },
  { href: "/products?featured=true", label: "BESTSELLERS" },
];

const allLinks = [
  { href: "/products", label: "Shop by Mood" },
  { href: "/products?category=men", label: "Men" },
  { href: "/products?category=women", label: "Women" },
  { href: "/products?category=unisex", label: "Unisex" },
  { href: "/products?featured=true", label: "Bestsellers" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartItems, bundleItems } = useCartStore();
  const user = useUser();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 10);
  });

  const itemCount =
    cartItems.reduce((t, i) => t + i.quantity, 0) +
    bundleItems.reduce((t, i) => t + i.quantity, 0);

  const navLinkClass =
    "font-sans uppercase tracking-widest transition-all duration-200 whitespace-nowrap";

  return (
    <>
      {/* Sticky navbar — sits right below the sticky promo banner */}
      <header
        className="sticky top-0 z-50 transition-shadow duration-300"
        style={{
          background: isScrolled
            ? "rgba(249, 249, 249, 0.97)"
            : "rgba(249, 249, 249, 0.93)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          boxShadow: isScrolled ? "0 1px 0 rgba(0,0,0,0.05)" : "none",
        }}
      >
        {/* Desktop nav: 3-column grid */}
        <nav className="hidden lg:grid grid-cols-[1fr_auto_1fr] items-center px-8 xl:px-12 py-5 xl:py-6">
          {/* Left links */}
          <div className="flex gap-6 xl:gap-8 items-center">
            {leftLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`${navLinkClass} hover:text-[#2d3435] pb-0.5 border-b border-transparent hover:border-[#2d3435]`}
                style={{ fontSize: "11px", color: "#5c5b5b" }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Center logo */}
          <Link href="/" className="px-6 xl:px-10">
            <h1
              className="font-serif font-bold uppercase whitespace-nowrap"
              style={{
                fontSize: "clamp(1.3rem, 2vw, 1.75rem)",
                letterSpacing: "-0.02em",
                color: "#2D3435",
              }}
            >
              AROMÉ LUXE
            </h1>
          </Link>

          {/* Right links + icons */}
          <div className="flex items-center justify-end gap-6 xl:gap-8">
            {rightLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`${navLinkClass} hover:text-[#2d3435]`}
                style={{ fontSize: "11px", color: "#5c5b5b" }}
              >
                {link.label}
              </Link>
            ))}

            <div className="flex items-center gap-4 ml-2" style={{ color: "#2d3435" }}>
              <Link href="/products" className="transition-transform hover:scale-110" aria-label="Search">
                <Search className="h-[18px] w-[18px]" strokeWidth={1.5} />
              </Link>
              {user ? (
                <UserMenu />
              ) : (
                <Link href="/auth/signin" className="transition-transform hover:scale-110" aria-label="Sign in">
                  <User className="h-[18px] w-[18px]" strokeWidth={1.5} />
                </Link>
              )}
              <Link href="/cart" className="relative transition-transform hover:scale-110" aria-label="Cart">
                <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.5} />
                {itemCount > 0 && (
                  <Badge className="absolute -top-1.5 -right-2 bg-[#2d3435] text-[#f9f9f9] text-[9px] h-4 min-w-4 flex items-center justify-center rounded-full border-none p-0 font-sans">
                    {itemCount}
                  </Badge>
                )}
              </Link>
            </div>
          </div>
        </nav>

        {/* Mobile/tablet nav */}
        <nav className="lg:hidden flex justify-between items-center px-5 py-4">
          <Link href="/">
            <h1
              className="font-serif font-bold uppercase"
              style={{ fontSize: "1.15rem", letterSpacing: "-0.02em", color: "#2D3435" }}
            >
              AROMÉ LUXE
            </h1>
          </Link>
          <div className="flex items-center gap-3.5" style={{ color: "#2d3435" }}>
            <Link href="/products" aria-label="Search">
              <Search className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </Link>
            <Link href="/cart" className="relative" aria-label="Cart">
              <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.5} />
              {itemCount > 0 && (
                <Badge className="absolute -top-1.5 -right-2 bg-[#2d3435] text-[#f9f9f9] text-[9px] h-4 min-w-4 flex items-center justify-center rounded-full border-none p-0 font-sans">
                  {itemCount}
                </Badge>
              )}
            </Link>
            <button className="transition-transform hover:scale-110" onClick={() => setIsMenuOpen(true)} aria-label="Open menu">
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm z-50 flex flex-col"
              style={{ background: "#f9f9f9" }}
            >
              <div className="flex justify-between items-center px-6 py-5">
                <h2 className="font-serif font-bold uppercase" style={{ fontSize: "1.1rem", letterSpacing: "-0.02em", color: "#2D3435" }}>
                  AROMÉ LUXE
                </h2>
                <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)} aria-label="Close menu">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="flex-1 px-6 py-6 flex flex-col gap-1 overflow-y-auto">
                {allLinks.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.25 }}
                  >
                    <Link
                      href={link.href}
                      className="block py-3 font-sans uppercase tracking-widest transition-colors"
                      style={{ fontSize: "12px", color: "#5c5b5b" }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                  {!user && (
                    <Link
                      href="/auth/signin"
                      className="block py-3 font-sans uppercase tracking-widest transition-colors"
                      style={{ fontSize: "12px", color: "#5c5b5b" }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                  )}
                  <Link
                    href="/cart"
                    className="flex items-center gap-3 py-3 font-sans text-sm transition-colors"
                    style={{ color: "#2d3435" }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Cart
                    {itemCount > 0 && (
                      <span className="inline-flex items-center justify-center h-5 min-w-5 px-1 rounded-full text-xs font-bold" style={{ background: "#2d3435", color: "#f9f9f9" }}>
                        {itemCount}
                      </span>
                    )}
                  </Link>
                </div>
              </nav>
              <div className="px-6 py-5" style={{ background: "#f2f4f4" }}>
                <p className="font-sans uppercase" style={{ fontSize: "10px", letterSpacing: "0.15em", color: "#5a6061" }}>
                  &copy; {new Date().getFullYear()} Aromé Luxe
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
