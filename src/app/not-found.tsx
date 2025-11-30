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
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brown-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Redirecting to order page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        <Link href="/" className="text-blue-500 hover:text-blue-700 underline">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
