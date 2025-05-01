import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/components/ui/use-toast";

// For a real implementation, you would integrate an actual payment gateway
const paymentInitiated = () => {
  return new Promise<void>((resolve) => {
    // Simulate payment processing
    setTimeout(() => {
      resolve();
    }, 2000);
  });
};

const Checkout = () => {
  const { cartItems, subtotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");

  // Shipping and tax calculation
  const SHIPPING_COST = subtotal > 2000 ? 0 : 150;
  const TAX_RATE = 0.18; // 18% GST
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax + SHIPPING_COST;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checking out.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // This would be replaced with actual payment gateway integration
      await paymentInitiated();

      toast({
        title: "Order placed successfully!",
        description:
          "Thank you for your purchase. Your order has been received.",
      });

      // Clear cart after successful order
      clearCart();

      // In a real implementation, you would redirect to an order confirmation page
    } catch (error) {
      toast({
        title: "Payment failed",
        description:
          "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-8">
        <div className="luxury-container">
          <h1 className="text-3xl font-serif font-bold mb-8">Checkout</h1>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Checkout Form */}
            <div className="w-full lg:w-2/3">
              <form onSubmit={handleSubmit}>
                {/* Shipping Information */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <h2 className="text-xl font-medium mb-4">
                    Shipping Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" required />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input id="state" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input id="postalCode" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input id="country" defaultValue="India" required />
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <h2 className="text-xl font-medium mb-4">Payment Method</h2>

                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2 rounded-lg border p-4">
                      <RadioGroupItem value="card" id="payment-card" />
                      <Label
                        htmlFor="payment-card"
                        className="flex-grow cursor-pointer"
                      >
                        Credit/Debit Card
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 rounded-lg border p-4">
                      <RadioGroupItem value="upi" id="payment-upi" />
                      <Label
                        htmlFor="payment-upi"
                        className="flex-grow cursor-pointer"
                      >
                        UPI Payment
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 rounded-lg border p-4">
                      <RadioGroupItem value="cod" id="payment-cod" />
                      <Label
                        htmlFor="payment-cod"
                        className="flex-grow cursor-pointer"
                      >
                        Cash on Delivery
                      </Label>
                    </div>
                  </RadioGroup>

                  {paymentMethod === "card" && (
                    <div className="mt-6 grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input id="expiryDate" placeholder="MM/YY" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input id="cvv" placeholder="123" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="nameOnCard">Name on Card</Label>
                        <Input id="nameOnCard" />
                      </div>
                    </div>
                  )}

                  {paymentMethod === "upi" && (
                    <div className="mt-6">
                      <div className="space-y-2">
                        <Label htmlFor="upiId">UPI ID</Label>
                        <Input id="upiId" placeholder="example@upi" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="lg:hidden mb-6">
                  <OrderSummary
                    subtotal={subtotal}
                    shipping={SHIPPING_COST}
                    tax={tax}
                    total={total}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    asChild
                  >
                    <Link to="/cart">Return to Cart</Link>
                  </Button>

                  <Button
                    type="submit"
                    className="flex-1 bg-luxe-blue hover:bg-luxe-violet"
                    disabled={isSubmitting || cartItems.length === 0}
                  >
                    {isSubmitting ? "Processing..." : "Place Order"}
                  </Button>
                </div>
              </form>
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-1/3 hidden lg:block">
              <OrderSummary
                subtotal={subtotal}
                shipping={SHIPPING_COST}
                tax={tax}
                total={total}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

// Order Summary Component
interface OrderSummaryProps {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  subtotal,
  shipping,
  tax,
  total,
}) => {
  const { cartItems } = useCart();

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
      <h2 className="text-xl font-medium mb-4">Order Summary</h2>

      <div className="divide-y">
        {cartItems.map((item) => (
          <div key={item.product.id} className="py-3 flex justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden mr-3">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-medium">{item.product.name}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
            </div>
            <div className="font-medium">
              ₹{(item.product.price * item.quantity).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span>₹{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span>
            {shipping === 0 ? (
              <span className="text-green-600">Free</span>
            ) : (
              `₹${shipping.toLocaleString()}`
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
    </div>
  );
};

export default Checkout;
