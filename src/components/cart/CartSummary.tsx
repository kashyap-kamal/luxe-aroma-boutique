import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface CartSummaryProps {
  subtotal: number;
}

const CartSummary: React.FC<CartSummaryProps> = ({ subtotal }) => {
  // Constants for shipping and tax
  const SHIPPING_COST = subtotal > 2000 ? 0 : 150;
  const TAX_RATE = 0.18; // 18% GST

  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax + SHIPPING_COST;

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-medium mb-4">Order Summary</h3>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span>₹{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span>
            {SHIPPING_COST === 0 ? (
              <span className="text-green-600">Free</span>
            ) : (
              `₹${SHIPPING_COST.toLocaleString()}`
            )}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Tax (18% GST)</span>
          <span>₹{tax.toLocaleString()}</span>
        </div>
        <div className="border-t pt-3 mt-3">
          <div className="flex justify-between font-medium text-lg">
            <span>Total</span>
            <span>₹{total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t">
        <Link to="/checkout">
          <Button asChild className="w-full bg-luxe-blue hover:bg-luxe-violet">
            <span>Proceed to Checkout</span>
          </Button>
        </Link>
      </div>

      <div className="mt-4 text-sm text-gray-500 text-center">
        <p>Free shipping on orders over ₹2000</p>
      </div>
    </div>
  );
};

export default CartSummary;
