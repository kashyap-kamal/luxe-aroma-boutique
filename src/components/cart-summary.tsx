import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CartSummaryProps {
  subtotal: number;
}

const CartSummary: React.FC<CartSummaryProps> = ({ subtotal }) => {
  // Removed hardcoded shipping and tax - will be calculated at checkout
  // Total shown here is just the subtotal (product prices only)
  const total = subtotal;

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-medium mb-4">Order Summary</h3>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span>₹{subtotal.toLocaleString()}</span>
        </div>
        <div className="border-t pt-3 mt-3">
          <div className="flex justify-between font-medium text-lg">
            <span>Total</span>
            <span>₹{total.toLocaleString()}</span>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          <p>GST & shipping included</p>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t">
        <Link href="/checkout">
          <Button asChild className="w-full bg-luxe-blue hover:bg-luxe-violet">
            <span>Proceed to Checkout</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CartSummary;
