"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { usePaymentStore } from "@/stores/payment-store";
import { Loader2, CreditCard, Smartphone, ShoppingBag } from "lucide-react";
import type { CustomerInfo, OrderItem } from "@/types/razorpay";
import { useCartStore, useCartSubtotal } from "@/stores/cart-store";
import { toast } from "sonner";
import Script from "next/script";

// Order Summary Component
const OrderSummary: React.FC<{
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}> = ({ subtotal, shipping, tax, total }) => (
  <div className="bg-white rounded-lg shadow-sm p-6 h-fit">
    <h2 className="text-xl font-medium mb-4">Order Summary</h2>

    <div className="space-y-3">
      <div className="flex justify-between">
        <span>Subtotal</span>
        <span>₹{subtotal.toFixed(2)}</span>
      </div>

      <div className="flex justify-between">
        <span>Shipping</span>
        <span>{shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}</span>
      </div>

      <div className="flex justify-between">
        <span>Tax (18% GST)</span>
        <span>₹{tax.toFixed(2)}</span>
      </div>

      <Separator />

      <div className="flex justify-between text-lg font-medium">
        <span>Total</span>
        <span>₹{total.toFixed(2)}</span>
      </div>
    </div>
  </div>
);

const Checkout: React.FC = () => {
  const router = useRouter();
  const { cartItems, clearCart } = useCartStore();
  const subtotal = useCartSubtotal();
  const { processPayment, isProcessing, error, clearPaymentState } =
    usePaymentStore();

  // Environment validation
  const razorpayKeyId = process.env.VITE_RAZORPAY_KEY_ID;
  // const isEnvironmentConfigured = Boolean(razorpayKeyId);

  // Form state
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: "test",
    lastName: "test",
    email: "test@gmail.com",
    phone: "9123456780",
    address: "test",
    city: "test",
    state: "test",
    postalCode: "test",
    country: "India",
  });

  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [upiId, setUpiId] = useState("");

  // Shipping and tax calculation
  const SHIPPING_COST = subtotal > 2000 ? 0 : 150;
  const TAX_RATE = 0.18; // 18% GST
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax + SHIPPING_COST;

  /**
   * Validate form data
   */
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Required field validation
    if (!customerInfo.firstName.trim()) {
      errors.firstName = "First name is required";
    }
    if (!customerInfo.lastName.trim()) {
      errors.lastName = "Last name is required";
    }
    if (!customerInfo.email.trim()) {
      errors.email = "Email is required";
    }
    if (!customerInfo.phone.trim()) {
      errors.phone = "Phone number is required";
    }
    if (!customerInfo.address.trim()) {
      errors.address = "Address is required";
    }
    if (!customerInfo.city.trim()) {
      errors.city = "City is required";
    }
    if (!customerInfo.state.trim()) {
      errors.state = "State is required";
    }
    if (!customerInfo.postalCode.trim()) {
      errors.postalCode = "Postal code is required";
    }

    // Email validation (only if email is provided)
    if (customerInfo.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(customerInfo.email.trim())) {
        errors.email = "Please enter a valid email address";
      }
    }

    // Phone validation (more forgiving - accepts various formats)
    if (customerInfo.phone.trim()) {
      // Remove all non-digit characters for validation
      const cleanPhone = customerInfo.phone.replace(/\D/g, "");

      // Check if it's a valid Indian mobile number
      // Accept 10 digits (without country code) or 12 digits (with 91)
      if (cleanPhone.length === 10) {
        // 10 digit number should start with 6-9
        if (!/^[6-9]/.test(cleanPhone)) {
          errors.phone =
            "Indian mobile numbers should start with 6, 7, 8, or 9";
        }
      } else if (cleanPhone.length === 12) {
        // 12 digit number should start with 91 followed by 6-9
        if (!/^91[6-9]/.test(cleanPhone)) {
          errors.phone =
            "Please enter a valid Indian mobile number (91XXXXXXXXXX)";
        }
      } else if (cleanPhone.length < 10) {
        errors.phone = "Phone number is too short";
      } else {
        errors.phone = "Please enter a valid 10-digit mobile number";
      }
    }

    // Terms acceptance
    if (!acceptTerms) {
      errors.terms = "Please accept the terms and conditions";
    }

    // UPI ID validation (only if UPI payment method is selected and UPI ID is provided)
    if (paymentMethod === "upi" && upiId.trim()) {
      const upiRegex = /^[\w.-]+@[\w.-]+$/;
      if (!upiRegex.test(upiId.trim())) {
        errors.upiId =
          "Please enter a valid UPI ID (e.g., user@paytm, user@phonepe)";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handle input changes
   */
  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  /**
   * Handle form submission and payment processing
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous payment state
    clearPaymentState();

    // Validate cart
    if (cartItems.length === 0) {
      toast.error("Cart is empty", {
        description: "Please add items to your cart before checking out.",
      });
      return;
    }

    // Validate form
    const isValid = validateForm();

    if (!isValid) {
      toast.error("Form validation failed", {
        description:
          "Please correct the errors highlighted below and try again.",
      });

      // Scroll to first error
      const firstErrorField = Object.keys(formErrors)[0];
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          element.focus();
        }
      }
      return;
    }

    // // Check environment variables
    // const razorpayKeyId = process.env.VITE_RAZORPAY_KEY_ID;
    //
    // if (!razorpayKeyId) {
    //   toast.error("Configuration Error", {
    //     description:
    //       "Payment system is not properly configured. Please contact support.",
    //   });
    //   return;
    // }

    try {
      // Prepare order items
      const orderItems: OrderItem[] = cartItems.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        total: item.product.price * item.quantity,
      }));

      // Prepare order details
      const orderDetails = {
        customerInfo,
        items: orderItems,
        subtotal,
        tax,
        shipping: SHIPPING_COST,
        total,
        paymentMethod,
        notes: `Payment method: ${paymentMethod}. Order placed via web checkout.`,
      };

      // Process payment
      const result = await processPayment(total, customerInfo, orderDetails);

      if (result.success) {
        // Success toast
        toast.success("Payment Successful! 🎉", {
          description: `Order #${result.orderId} has been placed successfully.`,
        });

        // Clear cart
        clearCart();

        // Navigate to success page
        router.push(`/order-success/${result.orderId}`);
      } else {
        // Payment failed toast
        toast.error("Payment Failed", {
          description:
            "Please try again or contact support if the issue persists.",
        });
      }
    } catch (error) {
      console.error("💥 Checkout error:", error);
      toast.error("Checkout Error", {
        description: "An unexpected error occurred. Please try again.",
      });
    }
  };

  return (
    <>
      <main className="flex-grow py-8">
        <div className="luxury-container">
          <div className="flex items-center gap-2 mb-6">
            <ShoppingBag className="h-6 w-6" />
            <h1 className="text-3xl font-serif font-bold">Secure Checkout</h1>
          </div>

          {/* Display form validation errors */}
          {Object.keys(formErrors).length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-red-800 mb-2">
                Please fix the following errors:
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                {Object.entries(formErrors).map(([field, message]) => (
                  <li key={field}>
                    <span className="font-medium capitalize">
                      {field.replace(/([A-Z])/g, " $1").trim()}:
                    </span>{" "}
                    {message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Checkout Form */}
            <div className="w-full lg:w-2/3">
              {cartItems.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                  <h2 className="text-xl font-medium mb-4">
                    Your Cart is Empty
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Please add some products to your cart before proceeding to
                    checkout.
                  </p>
                  <Button
                    onClick={() => router.push("/products")}
                    className="bg-brown-600 hover:bg-brown-700"
                  >
                    Browse Products
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {/* Shipping Information */}
                  <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-xl font-medium mb-4">
                      Shipping Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={customerInfo.firstName}
                          onChange={(e) =>
                            handleInputChange("firstName", e.target.value)
                          }
                          className={
                            formErrors.firstName ? "border-red-500" : ""
                          }
                          required
                        />
                        {formErrors.firstName && (
                          <p className="text-sm text-red-500">
                            {formErrors.firstName}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={customerInfo.lastName}
                          onChange={(e) =>
                            handleInputChange("lastName", e.target.value)
                          }
                          className={
                            formErrors.lastName ? "border-red-500" : ""
                          }
                          required
                        />
                        {formErrors.lastName && (
                          <p className="text-sm text-red-500">
                            {formErrors.lastName}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={customerInfo.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          className={formErrors.email ? "border-red-500" : ""}
                          required
                        />
                        {formErrors.email && (
                          <p className="text-sm text-red-500">
                            {formErrors.email}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          value={customerInfo.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          className={formErrors.phone ? "border-red-500" : ""}
                          placeholder="+91 98765 43210"
                          required
                        />
                        {formErrors.phone && (
                          <p className="text-sm text-red-500">
                            {formErrors.phone}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address">Address *</Label>
                        <Input
                          id="address"
                          value={customerInfo.address}
                          onChange={(e) =>
                            handleInputChange("address", e.target.value)
                          }
                          className={formErrors.address ? "border-red-500" : ""}
                          required
                        />
                        {formErrors.address && (
                          <p className="text-sm text-red-500">
                            {formErrors.address}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={customerInfo.city}
                          onChange={(e) =>
                            handleInputChange("city", e.target.value)
                          }
                          className={formErrors.city ? "border-red-500" : ""}
                          required
                        />
                        {formErrors.city && (
                          <p className="text-sm text-red-500">
                            {formErrors.city}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          value={customerInfo.state}
                          onChange={(e) =>
                            handleInputChange("state", e.target.value)
                          }
                          className={formErrors.state ? "border-red-500" : ""}
                          required
                        />
                        {formErrors.state && (
                          <p className="text-sm text-red-500">
                            {formErrors.state}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="postalCode">Postal Code *</Label>
                        <Input
                          id="postalCode"
                          value={customerInfo.postalCode}
                          onChange={(e) =>
                            handleInputChange("postalCode", e.target.value)
                          }
                          className={
                            formErrors.postalCode ? "border-red-500" : ""
                          }
                          required
                        />
                        {formErrors.postalCode && (
                          <p className="text-sm text-red-500">
                            {formErrors.postalCode}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          value={customerInfo.country}
                          onChange={(e) =>
                            handleInputChange("country", e.target.value)
                          }
                          required
                        />
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
                      <div className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-gray-50">
                        <RadioGroupItem value="upi" id="payment-upi" />
                        <Label
                          htmlFor="payment-upi"
                          className="flex-grow cursor-pointer flex items-center gap-2"
                        >
                          <Smartphone className="h-4 w-4" />
                          UPI Payment (Recommended)
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-gray-50">
                        <RadioGroupItem value="card" id="payment-card" />
                        <Label
                          htmlFor="payment-card"
                          className="flex-grow cursor-pointer flex items-center gap-2"
                        >
                          <CreditCard className="h-4 w-4" />
                          Credit/Debit Card
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-gray-50">
                        <RadioGroupItem
                          value="netbanking"
                          id="payment-netbanking"
                        />
                        <Label
                          htmlFor="payment-netbanking"
                          className="flex-grow cursor-pointer"
                        >
                          Net Banking
                        </Label>
                      </div>
                    </RadioGroup>

                    {/* Payment method info */}
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Secure Payment:</strong> All payments are
                        processed securely through Razorpay.
                        {paymentMethod === "upi" &&
                          " You can pay using any UPI app like Google Pay, PhonePe, or Paytm."}
                      </p>
                    </div>

                    {/* UPI ID Input (Optional) */}
                    {paymentMethod === "upi" && (
                      <div className="mt-4">
                        <Label htmlFor="upiId" className="text-sm font-medium">
                          UPI ID (Optional)
                        </Label>
                        <Input
                          id="upiId"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="yourname@paytm, yourname@phonepe"
                          className={`mt-1 ${
                            formErrors.upiId ? "border-red-500" : ""
                          }`}
                        />
                        {formErrors.upiId && (
                          <p className="text-sm text-red-500 mt-1">
                            {formErrors.upiId}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          If provided, we'll pre-fill this in the payment page
                          for your convenience.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Terms and Conditions */}
                  <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-start space-x-2">
                      <input
                        type="checkbox"
                        id="acceptTerms"
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        className="mt-1"
                      />
                      <Label
                        htmlFor="acceptTerms"
                        className="text-sm cursor-pointer"
                      >
                        I agree to the{" "}
                        <Link
                          href="/terms-of-service"
                          className="text-brown-600 underline"
                        >
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/privacy-policy"
                          className="text-brown-600 underline"
                        >
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>
                    {formErrors.terms && (
                      <p className="text-sm text-red-500 mt-2">
                        {formErrors.terms}
                      </p>
                    )}
                  </div>

                  {/* Mobile Order Summary */}
                  <div className="lg:hidden mb-6">
                    <OrderSummary
                      subtotal={subtotal}
                      shipping={SHIPPING_COST}
                      tax={tax}
                      total={total}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => router.push("/cart")}
                      disabled={isProcessing}
                    >
                      Back to Cart
                    </Button>

                    <Button
                      type="submit"
                      className="flex-1 bg-luxe-blue hover:bg-luxe-violet text-white font-semibold py-3 px-6 rounded-lg shadow-md"
                      style={{
                        backgroundColor: "#623cea",
                        color: "white",
                        border: "2px solid #623cea",
                      }}
                      disabled={isProcessing || cartItems.length === 0}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing Payment...
                        </>
                      ) : (
                        `Pay ₹${total.toFixed(2)}`
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>

            {/* Desktop Order Summary */}
            <div className="hidden lg:block w-1/3">
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
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
    </>
  );
};

export default Checkout;
