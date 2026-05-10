"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, X, Search, User, ChevronDown, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";
import { useUser, useLogout } from "@/stores/auth-store";
import { signOut } from "@/lib/auth-service";
import { UserMenu } from "@/components/auth/user-menu";
import { useUIStore } from "@/stores/ui-store";
import {
  motion,
  AnimatePresence,
} from "framer-motion";

const moodSubLinks = [
  { href: "/products?tag=fresh", label: "Fresh & Citrus" },
  { href: "/products?tag=woody", label: "Woody & Spicy" },
  { href: "/products?tag=date-night", label: "Date Night" },
  { href: "/products?tag=office-wear", label: "Office Wear" },
  { href: "/products?tag=everyday-fresh", label: "Everyday Fresh" },
  { href: "/products", label: "All Fragrances" },
];

const categoryLinks = [
  { href: "/products?category=men", label: "MEN" },
  { href: "/products?category=women", label: "WOMEN" },
];

const rightLinks = [
  { href: "/products?category=unisex", label: "UNISEX" },
  { href: "/products?featured=true", label: "BESTSELLERS" },
];


const Navbar = () => {
  const [moodOpen, setMoodOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { cartItems, bundleItems } = useCartStore();
  const user = useUser();
  const logout = useLogout();
  const router = useRouter();
  const { navDrawerOpen, closeNavDrawer } = useUIStore();

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setSearchValue("");
    }
  }, [isSearchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchValue.trim();
    if (q) {
      router.push(`/products?q=${encodeURIComponent(q)}`);
    } else {
      router.push("/products");
    }
    setIsSearchOpen(false);
  };

  const itemCount =
    cartItems.reduce((t, i) => t + i.quantity, 0) +
    bundleItems.reduce((t, i) => t + i.quantity, 0);

  const navLinkClass =
    "transition-all duration-200 whitespace-nowrap";

  return (
    <>
      {/* Sticky navbar — Saffron Press editorial wordmark */}
      <header
        className="sticky top-0 z-50"
        style={{
          background: "#F2EDE4",
          borderBottom: "1px solid #0E0E0C",
        }}
      >
        {/* Desktop nav: 3-column wordmark layout */}
        <nav className="hidden lg:grid grid-cols-[1fr_auto_1fr] items-center px-8 xl:px-12 py-4 xl:py-5">
          {/* Left links */}
          <div className="flex gap-6 xl:gap-8 items-center">
            {/* SHOP BY MOOD — dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setMoodOpen(true)}
              onMouseLeave={() => setMoodOpen(false)}
            >
              <button
                className={`${navLinkClass} flex items-center gap-1`}
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: "11px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#0E0E0C",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                SHOP BY MOOD
                <ChevronDown className="h-3 w-3 transition-transform" style={{ transform: moodOpen ? "rotate(180deg)" : "" }} />
              </button>
              <AnimatePresence>
                {moodOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.12 }}
                    className="absolute top-full left-0 mt-0 py-1 min-w-[180px] z-50"
                    style={{
                      background: "#F2EDE4",
                      border: "1px solid #0E0E0C",
                      borderTop: "none",
                    }}
                  >
                    {moodSubLinks.map((link) => (
                      <Link
                        key={link.href + link.label}
                        href={link.href}
                        className="block px-4 py-2 transition-colors hover:bg-[#0E0E0C] hover:text-[#F2EDE4]"
                        style={{
                          fontFamily: "var(--font-jetbrains-mono), monospace",
                          fontSize: "10px",
                          letterSpacing: "0.15em",
                          textTransform: "uppercase",
                          color: "#0E0E0C",
                        }}
                        onClick={() => setMoodOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* MEN / WOMEN */}
            {categoryLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={navLinkClass}
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: "11px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#0E0E0C",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Center logo — editorial Fraunces wordmark */}
          <Link href="/" className="px-6 xl:px-10">
            <h1
              className="font-serif whitespace-nowrap"
              style={{
                fontSize: "clamp(1.4rem, 2vw, 2rem)",
                fontWeight: 300,
                letterSpacing: "-0.03em",
                color: "#0E0E0C",
                fontFamily: "var(--font-fraunces), serif",
                fontVariationSettings: '"opsz" 72',
              }}
            >
              Aromé <em style={{ fontStyle: "italic" }}>Luxe</em>
            </h1>
          </Link>

          {/* Right links + icons */}
          <div className="flex items-center justify-end gap-6 xl:gap-8">
            {rightLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={navLinkClass}
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: "11px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: link.label === "BESTSELLERS" ? "#E8763A" : "#0E0E0C",
                  textDecoration: link.label === "BESTSELLERS" ? "underline" : "none",
                }}
              >
                {link.label}
              </Link>
            ))}

            <div className="flex items-center gap-4 ml-2" style={{ color: "#0E0E0C" }}>
              <button className="transition-opacity hover:opacity-60" aria-label="Search" onClick={() => setIsSearchOpen(true)}>
                <Search className="h-[17px] w-[17px]" strokeWidth={1.5} />
              </button>
              {user ? (
                <UserMenu />
              ) : (
                <Link href="/auth/signin" className="transition-opacity hover:opacity-60" aria-label="Sign in">
                  <User className="h-[17px] w-[17px]" strokeWidth={1.5} />
                </Link>
              )}
              <Link href="/cart" className="relative transition-opacity hover:opacity-60" aria-label="Cart">
                <ShoppingBag className="h-[17px] w-[17px]" strokeWidth={1.5} />
                {itemCount > 0 && (
                  <Badge
                    className="absolute -top-1.5 -right-2 text-[9px] h-4 min-w-4 flex items-center justify-center border-none p-0"
                    style={{
                      background: "#E8763A",
                      color: "#F2EDE4",
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                      borderRadius: 0,
                    }}
                  >
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
              className="font-serif"
              style={{
                fontSize: "1.25rem",
                fontWeight: 300,
                letterSpacing: "-0.02em",
                color: "#0E0E0C",
                fontFamily: "var(--font-fraunces), serif",
              }}
            >
              Aromé <em style={{ fontStyle: "italic" }}>Luxe</em>
            </h1>
          </Link>
          <div className="flex items-center gap-4" style={{ color: "#0E0E0C" }}>
            <button aria-label="Search" onClick={() => setIsSearchOpen(true)}>
              <Search className="h-[17px] w-[17px]" strokeWidth={1.5} />
            </button>
            <Link href="/cart" className="relative" aria-label="Cart">
              <ShoppingBag className="h-[17px] w-[17px]" strokeWidth={1.5} />
              {itemCount > 0 && (
                <Badge
                  className="absolute -top-1.5 -right-2 text-[9px] h-4 min-w-4 flex items-center justify-center border-none p-0"
                  style={{
                    background: "#E8763A",
                    color: "#F2EDE4",
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    borderRadius: 0,
                  }}
                >
                  {itemCount}
                </Badge>
              )}
            </Link>
          </div>
        </nav>
      </header>

      {/* Search overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            key="search-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[60] flex flex-col"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsSearchOpen(false)}
            />
            {/* Search bar panel */}
            <div
              className="relative z-10 w-full px-4 sm:px-8 pt-5 pb-4"
              style={{
                background: "#F2EDE4",
                borderBottom: "1px solid #0E0E0C",
              }}
            >
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-3 max-w-2xl mx-auto">
                <Search className="h-5 w-5 flex-shrink-0" style={{ color: "#0E0E0C" }} strokeWidth={1.5} />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Escape" && setIsSearchOpen(false)}
                  placeholder="Search fragrances..."
                  className="flex-1 bg-transparent outline-none"
                  style={{
                    fontSize: "1rem",
                    color: "#0E0E0C",
                    fontFamily: "var(--font-inter), sans-serif",
                  }}
                  autoFocus
                />
                {searchValue && (
                  <button type="button" onClick={() => setSearchValue("")} aria-label="Clear">
                    <X className="h-4 w-4" style={{ color: "#0E0E0C" }} />
                  </button>
                )}
                <button type="button" onClick={() => setIsSearchOpen(false)} aria-label="Close search" className="ml-1">
                  <X className="h-5 w-5" style={{ color: "#0E0E0C" }} strokeWidth={1.5} />
                </button>
              </form>
              <p
                className="text-center mt-2.5"
                style={{
                  fontSize: "10px",
                  color: "#3A3833",
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
              >
                Press Enter to search &nbsp;·&nbsp; Esc to close
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile drawer — fullscreen, slides from LEFT */}
      <AnimatePresence>
        {navDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              onClick={closeNavDrawer}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="fixed top-0 left-0 bottom-0 w-full z-50 flex flex-col overflow-y-auto"
              style={{ background: "#F2EDE4" }}
            >
              {/* Drawer header */}
              <div
                className="flex justify-between items-center px-6 py-5 flex-shrink-0"
                style={{ borderBottom: "1px solid #0E0E0C" }}
              >
                <h2
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: 300,
                    letterSpacing: "-0.02em",
                    color: "#0E0E0C",
                    fontFamily: "var(--font-fraunces), serif",
                  }}
                >
                  Aromé <em style={{ fontStyle: "italic" }}>Luxe</em>
                </h2>
                <Button variant="ghost" size="icon" onClick={closeNavDrawer} aria-label="Close menu">
                  <X className="h-5 w-5" style={{ color: "#0E0E0C" }} />
                </Button>
              </div>

              {/* Login / Account block */}
              <div className="px-6 pt-5 pb-5 flex-shrink-0" style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 flex-shrink-0" style={{ color: "#E8763A" }} />
                      <p className="font-sans text-sm font-medium" style={{ color: "#0E0E0C", fontFamily: "var(--font-inter), sans-serif" }}>
                        Hello, {user.user_metadata?.full_name?.split(" ")[0] || user.email}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href="/orders"
                        onClick={closeNavDrawer}
                        className="flex-1 py-2 text-center font-sans text-xs tracking-widest uppercase transition-opacity hover:opacity-70"
                        style={{ background: "rgba(232,118,58,0.1)", color: "#E8763A", border: "1px solid rgba(232,118,58,0.3)", fontFamily: "var(--font-jetbrains-mono), monospace" }}
                      >
                        My Orders
                      </Link>
                      <button
                        onClick={async () => {
                          await signOut();
                          logout();
                          closeNavDrawer();
                          router.push("/");
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 font-sans text-xs tracking-widest uppercase transition-opacity hover:opacity-70"
                        style={{ background: "transparent", color: "#0E0E0C", border: "1px solid rgba(14,14,12,0.2)", fontFamily: "var(--font-jetbrains-mono), monospace" }}
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 flex-shrink-0" style={{ color: "#0E0E0C", opacity: 0.5 }} />
                      <p className="font-sans text-xs" style={{ color: "#0E0E0C", opacity: 0.6, fontFamily: "var(--font-inter), sans-serif" }}>
                        Sign in for order tracking &amp; exclusive offers
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href="/auth/signin"
                        onClick={closeNavDrawer}
                        className="flex-1 py-2 text-center text-xs tracking-widest uppercase transition-opacity hover:opacity-80"
                        style={{ background: "#0E0E0C", color: "#F2EDE4", fontFamily: "var(--font-jetbrains-mono), monospace" }}
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/auth/signup"
                        onClick={closeNavDrawer}
                        className="flex-1 py-2 text-center text-xs tracking-widest uppercase transition-opacity hover:opacity-80"
                        style={{ background: "transparent", color: "#0E0E0C", border: "1px solid #0E0E0C", fontFamily: "var(--font-jetbrains-mono), monospace" }}
                      >
                        Create Account
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Nav links */}
              <nav className="flex-shrink-0 px-6 py-4 flex flex-col gap-1">
                {/* Shop by Mood — expandable */}
                <div>
                  <button
                    className="w-full flex items-center justify-between py-3 uppercase tracking-widest transition-opacity hover:opacity-60"
                    style={{ fontSize: "11px", color: "#0E0E0C", fontFamily: "var(--font-jetbrains-mono), monospace", borderBottom: "1px solid rgba(14,14,12,0.1)" }}
                    onClick={() => setMobileExpanded(!mobileExpanded)}
                  >
                    Shop by Mood
                    <ChevronDown className="h-3 w-3 transition-transform" style={{ transform: mobileExpanded ? "rotate(180deg)" : "" }} />
                  </button>
                  {mobileExpanded && (
                    <div className="pl-4 pb-2 space-y-0">
                      {moodSubLinks.map((link) => (
                        <Link
                          key={link.href + link.label}
                          href={link.href}
                          className="block py-2 text-xs tracking-wider uppercase transition-opacity hover:opacity-60"
                          style={{ color: "#0E0E0C", opacity: 0.7, fontFamily: "var(--font-jetbrains-mono), monospace" }}
                          onClick={closeNavDrawer}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                {[
                  { href: "/products?category=men", label: "Men" },
                  { href: "/products?category=women", label: "Women" },
                  { href: "/products?category=unisex", label: "Unisex" },
                  { href: "/products?featured=true", label: "Bestsellers" },
                  { href: "/quiz", label: "Scent Quiz" },
                  { href: "/about", label: "About" },
                  { href: "/contact", label: "Contact" },
                ].map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (i + 1) * 0.04, duration: 0.22 }}
                  >
                    <Link
                      href={link.href}
                      className="block py-3 uppercase tracking-widest transition-opacity hover:opacity-60"
                      style={{ fontSize: "11px", color: "#0E0E0C", fontFamily: "var(--font-jetbrains-mono), monospace", borderBottom: "1px solid rgba(14,14,12,0.07)" }}
                      onClick={closeNavDrawer}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="px-6 py-5 flex-shrink-0" style={{ borderTop: "1px solid rgba(14,14,12,0.1)" }}>
                <p className="uppercase" style={{ fontSize: "10px", letterSpacing: "0.15em", color: "#0E0E0C", opacity: 0.4, fontFamily: "var(--font-jetbrains-mono), monospace" }}>
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
