"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

const NotFound = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Check if this is an old order success URL format: /order-success/order_xxx
    // Redirect to new query parameter format: /order-success?order_id=order_xxx
    if (pathname && pathname.startsWith("/order-success/")) {
      const pathParts = pathname.split("/");
      const orderId = pathParts[pathParts.length - 1];
      
      // If it looks like an order ID (starts with "order_")
      if (orderId && orderId.startsWith("order_")) {
        setIsRedirecting(true);
        // Redirect to query parameter format
        router.replace(`/order-success?order_id=${encodeURIComponent(orderId)}`);
        return;
      }
    }

    console.error(
      "404 Error: User attempted to access non-existent route:",
      pathname,
    );
  }, [pathname, router]);

  // Show loading state while redirecting
  if (isRedirecting) {
    return (
      <main className="flex items-center justify-center px-5" style={{ minHeight: "60vh", background: "#F2EDE4", color: "#0E0E0C" }}>
        <p className="animate-pulse" style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.6 }}>
          Opening your order
        </p>
      </main>
    );
  }

  return (
    <main className="flex flex-col justify-center px-5 md:px-12" style={{ minHeight: "60vh", padding: "64px 20px", gap: 18, background: "#F2EDE4", color: "#0E0E0C" }}>
      <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E8763A" }}>
        Error 404
      </span>
      <h1 style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 300, fontSize: "clamp(2.6rem, 8vw, 5rem)", lineHeight: 0.95, letterSpacing: "-0.03em", margin: 0 }}>
        This page has <em>evaporated.</em>
      </h1>
      <p style={{ fontSize: 15, lineHeight: 1.6, opacity: 0.7, maxWidth: "38ch", margin: 0 }}>
        The link may be old, or the bottle has moved. The full collection is one tap away.
      </p>
      <div className="flex flex-col sm:flex-row" style={{ gap: 10, marginTop: 8 }}>
        <Link href="/products" className="flex items-center justify-between" style={{ height: 54, padding: "0 20px", minWidth: 240, background: "#0E0E0C", color: "#F2EDE4", fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" }}>
          Browse fragrances <span aria-hidden>→</span>
        </Link>
        <Link href="/" className="flex items-center justify-center" style={{ height: 54, padding: "0 20px", border: "1px solid #0E0E0C", color: "#0E0E0C", fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" }}>
          Home
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
