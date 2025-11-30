"use client";

import React, { Suspense, useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import OrderSuccessClient from "./order-success-client";

// Component that reads search params and handles old URL format redirect
const OrderSuccessContent = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  
  // Check for order ID in query params (new format)
  const orderIdFromQuery = searchParams.get("order_id");
  
  // Handle old dynamic route format: /order-success/order_xxx
  // Extract order ID from pathname and redirect to query parameter format
  useEffect(() => {
    if (!orderIdFromQuery && typeof window !== "undefined") {
      // Check if URL path contains an order ID (old format: /order-success/order_xxx)
      const pathParts = pathname.split("/");
      const lastPart = pathParts[pathParts.length - 1];
      
      // If last part looks like an order ID (starts with "order_")
      if (lastPart && lastPart.startsWith("order_") && lastPart !== "order-success") {
        // Redirect to query parameter format
        const newUrl = `/order-success?order_id=${encodeURIComponent(lastPart)}`;
        router.replace(newUrl);
        return;
      }
    }
  }, [pathname, orderIdFromQuery, router]);
  
  // If redirecting, show loading state
  if (!orderIdFromQuery && pathname.includes("/order-success/") && pathname !== "/order-success") {
    return (
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brown-600 mx-auto mb-4"></div>
          <p>Redirecting...</p>
        </div>
      </main>
    );
  }
  
  return <OrderSuccessClient orderId={orderIdFromQuery || null} />;
};

// Static page for order success (compatible with output: "export")
// Order ID is passed via query parameter: /order-success?order_id=...
// Also handles old dynamic route format: /order-success/{orderId} -> redirects to query format
const OrderSuccess = () => {
  return (
    <Suspense fallback={
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brown-600 mx-auto mb-4"></div>
          <p>Loading order details...</p>
        </div>
      </main>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
};

export default OrderSuccess;

