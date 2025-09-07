import React from "react";
import OrderSuccessClient from "./order-success-client";

// Generate static params for order success page (required for static export)
// Since this is a dynamic route, we'll generate some sample order IDs
export async function generateStaticParams() {
  // Generate sample order IDs for static export
  // In a real app, you might want to generate IDs based on actual orders
  const sampleOrderIds = [
    "ORD-001",
    "ORD-002", 
    "ORD-003",
    "ORD-004",
    "ORD-005"
  ];
  
  return sampleOrderIds.map((orderId) => ({
    orderId: orderId,
  }));
}

// Server component that handles static generation
const OrderSuccess = async ({ params }: { params: Promise<{ orderId: string }> }) => {
  const { orderId } = await params;
  return <OrderSuccessClient orderId={orderId} />;
};

export default OrderSuccess;