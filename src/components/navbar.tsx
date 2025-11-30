"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Menu, X, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/stores/cart-store";
import { UserMenu } from "@/components/auth/user-menu";
import Image from "next/image";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartItems } = useCartStore();
  const { scrollY } = useScroll();
  const pathname = usePathname();

  // Handle scroll for sticky behavior
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Perfumes" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  // Check if we're on a page with light background
  // These pages need dark navbar colors since they have light backgrounds
  const isLightBackgroundPage = pathname?.startsWith("/auth") || pathname?.startsWith("/profile");

  // Determine if we should use light (white) or dark styling
  // Use dark styling when: scrolled OR on light background pages
  // Use light styling when: at top of pages with dark hero backgrounds
  const useDarkStyling = isScrolled || isLightBackgroundPage;
  const isAtTop = !useDarkStyling;

  return (
    <>
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out",
          isScrolled
            ? "bg-white/80 backdrop-blur-2xl border-b border-white/40 shadow-[0_4px_30px_rgba(0,0,0,0.03)] py-3"
            : isLightBackgroundPage
              ? "bg-white/60 backdrop-blur-xl py-4" // Light background pages: subtle white background
              : "bg-transparent py-6" // Other pages: transparent at top
        )}
      >
        <div className="luxury-container">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center z-50">
              <Image
                src={isAtTop ? "/assets/arome-luxe-logo-white.png" : "/assets/arome-luxe-logo.png"}
                alt="Aromé Luxe"
                width={150}
                height={50}
                className={cn(
                  "h-auto max-h-8 md:max-h-10 w-auto object-contain transition-all duration-300",
                  !isAtTop && "opacity-90"
                )}
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative font-medium text-sm uppercase tracking-wider transition-colors group py-2",
                    isAtTop ? "text-white hover:text-luxe-gold" : "text-gray-900 hover:text-luxe-gold"
                  )}
                >
                  {link.label}
                  <span className={cn(
                    "absolute bottom-0 left-0 w-0 h-[1px] transition-all duration-300 group-hover:w-full",
                    isAtTop ? "bg-luxe-gold" : "bg-gray-900"
                  )} />
                </Link>
              ))}
            </nav>

            {/* Icons */}
            <div className="flex items-center space-x-2 md:space-x-4 z-50">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "hover:bg-black/5 transition-colors rounded-full",
                  isAtTop ? "text-white hover:bg-white/10" : "text-gray-900"
                )}
              >
                <Search className="h-5 w-5" />
              </Button>
              <Link href="/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "relative hover:bg-black/5 transition-colors rounded-full",
                    isAtTop ? "text-white hover:bg-white/10" : "text-gray-900"
                  )}
                >
                  <ShoppingBag className="h-5 w-5" />
                  {itemCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 bg-luxe-gold text-black text-[10px] h-4 w-4 flex items-center justify-center rounded-full border-none">
                      {itemCount}
                    </Badge>
                  )}
                </Button>
              </Link>
              
              <div className={cn(
                isAtTop ? "text-white" : "text-gray-900"
              )}>
                <UserMenu />
              </div>

              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "md:hidden hover:bg-black/5 rounded-full",
                  isAtTop ? "text-white hover:bg-white/10" : "text-gray-900"
                )}
                onClick={toggleMenu}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              onClick={toggleMenu}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-white z-50 md:hidden shadow-2xl flex flex-col"
            >
              <div className="p-4 flex justify-between items-center border-b border-gray-100">
                 <Image
                    src="/assets/arome-luxe-logo.png"
                    alt="Aromé Luxe"
                    width={120}
                    height={40}
                    className="h-8 w-auto object-contain"
                  />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMenu}
                  className="text-black hover:bg-black/5 rounded-full"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <nav className="p-8 flex flex-col space-y-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-2xl font-serif font-bold text-gray-900 hover:text-luxe-gold transition-colors"
                    onClick={toggleMenu}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto p-8 bg-gray-50">
                <p className="text-sm text-gray-500 text-center">
                  © 2025 Aromé Luxe
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
