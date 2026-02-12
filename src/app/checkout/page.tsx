"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { usePaymentStore } from "@/stores/payment-store";
import { Loader2, ShoppingBag } from "lucide-react";
import type { CustomerInfo, OrderItem } from "@/types/cashfree";
import { useCartStore } from "@/stores/cart-store";
import { billingCalculator, type BillingBreakdown } from "@/lib/billing";
import { toast } from "sonner";
import Script from "next/script";
import PincodeChecker from "@/components/pincode-checker";

// Order Summary Component
const OrderSummary: React.FC<{
  billing: {
    subtotal: number;
    discount: number;
    discountPercentage: number;
    tax: number;
    taxPercentage: number;
    shipping: number;
    total: number;
    currency: string;
  };
  shippingCharge: number;
}> = ({ billing, shippingCharge }) => {
  const totalWithShipping = billing.total + shippingCharge;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 h-fit">
      <h2 className="text-xl font-medium mb-4">Order Summary</h2>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{billingCalculator.formatCurrency(billing.subtotal)}</span>
        </div>

        {billing.discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount ({billing.discountPercentage.toFixed(0)}%)</span>
            <span>-{billingCalculator.formatCurrency(billing.discount)}</span>
          </div>
        )}

        <div className="flex justify-between text-sm text-gray-600">
          <span>GST</span>
          <span>Included</span>
        </div>

        <div className="flex justify-between text-sm text-gray-600">
          <span>Shipping</span>
          <span>
            {shippingCharge > 0
              ? billingCalculator.formatCurrency(shippingCharge)
              : "Check pincode"}
          </span>
        </div>

        <Separator />

        <div className="flex justify-between text-lg font-medium">
          <span>Total</span>
          <span>{billingCalculator.formatCurrency(totalWithShipping)}</span>
        </div>
      </div>
    </div>
  );
};

const CheckoutContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cartItems, clearCart, getBillingBreakdown } = useCartStore();
  const {
    processPayment,
    isProcessing,
    clearPaymentState,
    error: paymentError,
  } = usePaymentStore();

  // Check if user was redirected back from cancelled payment
  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    if (paymentStatus === "cancelled") {
      toast.info("Payment Cancelled", {
        description: "You can continue shopping or try again when ready.",
      });
      // Clean up URL
      router.replace("/checkout");
    }
  }, [searchParams, router]);

  // Form state - empty initial values for production
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isPincodeServiceable, setIsPincodeServiceable] = useState(false);
  const [shippingCharge, setShippingCharge] = useState(0);

  // Billing state - initialized after hydration to prevent SSR mismatch
  // Cart data comes from sessionStorage which is not available during SSR
  const [billing, setBilling] = useState<BillingBreakdown>({
    subtotal: 0,
    discount: 0,
    discountPercentage: 0,
    tax: 0,
    taxPercentage: 0,
    shipping: 0,
    total: 0,
    currency: "INR",
  });
  const [isMounted, setIsMounted] = useState(false);

  // Update billing after component mounts (client-side only)
  // This prevents hydration mismatch since cart data comes from sessionStorage
  useEffect(() => {
    setIsMounted(true);
    // Calculate billing breakdown after mount
    const breakdown = getBillingBreakdown();
    setBilling(breakdown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Update billing whenever cart items change (after mount)
  useEffect(() => {
    if (isMounted) {
      const breakdown = getBillingBreakdown();
      setBilling(breakdown);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems, isMounted]); // Update when cart items change

  // Handle pincode serviceability change
  const handlePincodeServiceabilityChange = (
    isServiceable: boolean,
    info?: {
      pincode: string;
      serviceable: boolean;
      deliveryTime?: string;
      charges?: {
        cod: number;
        prepaid: number;
      };
      error?: string;
    }
  ) => {
    setIsPincodeServiceable(isServiceable);

    if (isServiceable && info?.charges) {
      setShippingCharge(info.charges.prepaid);
    } else {
      setShippingCharge(0);
    }
  };

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

    // Pincode serviceability check
    if (!isPincodeServiceable) {
      errors.pincode = "Please check pincode serviceability before proceeding";
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
        price: item.product.price.current,
        quantity: item.quantity,
        total: item.product.price.current * item.quantity,
      }));

      // Prepare order details with shipping from Shiprocket
      const totalWithShipping = billing.total + shippingCharge;
      const orderDetails = {
        customerInfo,
        items: orderItems,
        subtotal: billing.subtotal,
        discount: billing.discount,
        tax: billing.tax,
        shipping: shippingCharge,
        total: totalWithShipping,
        paymentMethod: "online",
        notes: "Order placed via web checkout.",
      };

      // Process payment with shipping included in total
      // Note: With Cashfree redirectTarget: "_self", the page will redirect to Cashfree checkout
      // The Promise returns immediately after opening checkout, not after payment completes
      const result = await processPayment(
        totalWithShipping,
        customerInfo,
        orderDetails
      );

      if (result.success && result.orderId) {
        // Store order details in sessionStorage for use after Cashfree redirect
        // The order success page will handle payment verification
        if (typeof window !== "undefined") {
          sessionStorage.setItem(
            "pending_order_details",
            JSON.stringify({
              orderId: result.orderId,
              customerInfo,
              orderItems,
              billing: {
                ...billing,
                shipping: shippingCharge,
                total: billing.total + shippingCharge,
              },
            })
          );
        }

        // Clear cart before redirect (Cashfree will redirect the page)
        clearCart();

        // Note: We don't navigate here - Cashfree will redirect to the return URL
        // The return URL is set in the order creation: /order-success/{order_id}
        // Cashfree will replace {order_id} with the actual order ID
        toast.info("Redirecting to payment...", {
          description: "Please complete your payment on the next page.",
        });

        // The page will redirect automatically via Cashfree checkout
        // No need to manually navigate - Cashfree handles the redirect
      } else {
        // Payment initialization failed
        toast.error("Payment Failed", {
          description:
            paymentError ||
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
      <main className="flex-grow pt-24 pb-8">
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

                    {/* Pincode Serviceability Check */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium mb-3">
                        Check Delivery Availability
                      </h3>
                      <PincodeChecker
                        onServiceabilityChange={
                          handlePincodeServiceabilityChange
                        }
                        initialPincode={customerInfo.postalCode}
                      />
                      {formErrors.pincode && (
                        <p className="text-sm text-red-500 mt-2">
                          {formErrors.pincode}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Secure Payment:</strong> All payments are
                        processed securely through Cashfree. You&apos;ll be able to choose
                        your preferred payment method (UPI, Card, Net Banking) on the next page.
                      </p>
                    </div>
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
                    <OrderSummary billing={billing} shippingCharge={shippingCharge} />
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
                        `Pay ${billingCalculator.formatCurrency(billing.total + shippingCharge)}`
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>

            {/* Desktop Order Summary */}
            <div className="hidden lg:block w-1/3">
              <OrderSummary billing={billing} shippingCharge={shippingCharge} />
            </div>
          </div>
        </div>
      </main>
      <Script src="https://sdk.cashfree.com/js/v3/cashfree.js" />
    </>
  );
};

const Checkout: React.FC = () => {
  return (
    <Suspense
      fallback={
        <main className="flex-grow flex items-center justify-center py-8">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-brown-600 mx-auto mb-4" />
            <p>Loading checkout...</p>
          </div>
        </main>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
};

export default Checkout;
