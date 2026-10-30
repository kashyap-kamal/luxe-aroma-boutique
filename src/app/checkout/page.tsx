"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { usePaymentStore } from "@/stores/payment-store";
import { Loader2, Lock } from "lucide-react";
import type { CustomerInfo, OrderItem } from "@/types/cashfree";
import { useCartStore } from "@/stores/cart-store";
import { billingCalculator, type BillingBreakdown } from "@/lib/billing";
import { validateCoupon } from "@/lib/coupon-service";
import {
  calculateShippingCharge,
  computeCheckoutTotals,
  formatBundleOrderLineName,
} from "@/lib/checkout-pricing";
import { getFreeShipping, getShippingRate, type FreeShippingSetting, type ShippingRateSetting } from "@/lib/settings-service";
import { toast } from "sonner";
import Script from "next/script";
import PincodeChecker from "@/components/pincode-checker";

const INK = "#0E0E0C";
const CREAM = "#F2EDE4";
const SAFFRON = "#E8763A";
const DARK = "#1A0908";

const fieldStyle: React.CSSProperties = {
  width: "100%",
  background: "transparent",
  border: `1px solid ${INK}`,
  padding: "12px 14px",
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: 14,
  color: INK,
  outline: "none",
  borderRadius: 0,
  appearance: "none",
};

const fieldErrorStyle: React.CSSProperties = {
  ...fieldStyle,
  borderColor: SAFFRON,
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-jetbrains-mono), monospace",
  fontSize: 10,
  letterSpacing: "0.18em",
  textTransform: "uppercase" as const,
  color: INK,
  marginBottom: 6,
};

const errorTextStyle: React.CSSProperties = {
  fontFamily: "var(--font-jetbrains-mono), monospace",
  fontSize: 9,
  letterSpacing: "0.12em",
  color: SAFFRON,
  marginTop: 4,
};

const panelStyle: React.CSSProperties = {
  border: `1px solid ${INK}`,
  marginBottom: 2,
};

const sectionHeadStyle: React.CSSProperties = {
  fontFamily: "var(--font-jetbrains-mono), monospace",
  fontSize: 10,
  letterSpacing: "0.2em",
  textTransform: "uppercase" as const,
  color: SAFFRON,
  marginBottom: 20,
};

// Order Summary Component
const OrderSummary: React.FC<{
  billing: BillingBreakdown;
  shippingCharge: number;
  shippingLabel: string;
  appliedCouponCode: string | null;
  onApplyCoupon: (code: string) => Promise<void>;
  onRemoveCoupon: () => void;
  lineItems: Array<{ key: string; name: string; quantity: number; lineTotal: number }>;
}> = ({
  billing,
  shippingCharge,
  shippingLabel,
  appliedCouponCode,
  onApplyCoupon,
  onRemoveCoupon,
  lineItems,
}) => {
  const [couponInput, setCouponInput] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const totalWithShipping = billing.total + shippingCharge;

  const submitCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setApplyingCoupon(true);
    try {
      await onApplyCoupon(couponInput);
      setCouponInput("");
    } finally {
      setApplyingCoupon(false);
    }
  };

  return (
    <div style={{ border: `1px solid ${INK}`, background: CREAM }}>
      <div style={{ padding: "20px 24px", borderBottom: `1px solid ${INK}` }}>
        <div style={{ ...sectionHeadStyle, marginBottom: 0 }}>ORDER SUMMARY</div>
      </div>

      <div style={{ padding: "20px 24px" }}>
        {lineItems.length > 0 && (
          <div style={{ marginBottom: 16, paddingBottom: 14, borderBottom: `1px dotted ${INK}`, display: "flex", flexDirection: "column", gap: 8 }}>
            {lineItems.map((li) => (
              <div key={li.key} style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 12 }}>
                <span style={{ fontFamily: "var(--font-inter), sans-serif", color: INK, opacity: 0.85 }}>
                  {li.name} × {li.quantity}
                </span>
                <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 11, whiteSpace: "nowrap" }}>
                  {billingCalculator.formatCurrency(li.lineTotal)}
                </span>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginBottom: 16, paddingBottom: 14, borderBottom: `1px dotted ${INK}` }}>
          {appliedCouponCode && billing.discount > 0 ? (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, letterSpacing: "0.14em", color: SAFFRON }}>
                COUPON: {appliedCouponCode}
              </span>
              <button
                type="button"
                onClick={onRemoveCoupon}
                style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: INK, textDecoration: "underline", opacity: 0.7 }}
              >
                REMOVE
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 6 }}>
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    void submitCoupon(e);
                  }
                }}
                placeholder="COUPON CODE"
                aria-label="Coupon code"
                style={{ flex: 1, background: "transparent", border: `1px solid ${INK}`, padding: "9px 10px", fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, letterSpacing: "0.14em", color: INK, outline: "none" }}
              />
              <button
                type="button"
                disabled={applyingCoupon || !couponInput.trim()}
                onClick={(e) => void submitCoupon(e)}
                style={{ background: INK, color: CREAM, border: "none", padding: "9px 14px", fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", cursor: applyingCoupon || !couponInput.trim() ? "not-allowed" : "pointer", opacity: applyingCoupon || !couponInput.trim() ? 0.5 : 1 }}
              >
                {applyingCoupon ? "..." : "APPLY"}
              </button>
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, color: INK, opacity: 0.7 }}>Subtotal</span>
            <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 12 }}>{billingCalculator.formatCurrency(billing.subtotal)}</span>
          </div>

          {billing.discount > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, color: INK, opacity: 0.7 }}>
                Discount ({billing.discountPercentage.toFixed(0)}%)
              </span>
              <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 12, color: SAFFRON }}>
                -{billingCalculator.formatCurrency(billing.discount)}
              </span>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, color: INK, opacity: 0.7 }}>GST</span>
            <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 12, opacity: 0.5 }}>INCLUDED</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, color: INK, opacity: 0.7 }}>Shipping</span>
            <span style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 12,
              color: shippingCharge === 0 && shippingLabel !== "Check pincode" ? SAFFRON : INK,
            }}>
              {shippingLabel}
            </span>
          </div>

          <div style={{ borderTop: `1px solid ${INK}`, marginTop: 4, paddingTop: 16, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 18, fontWeight: 300 }}>Total</span>
            <span style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 22, fontWeight: 300 }}>{billingCalculator.formatCurrency(totalWithShipping)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const CheckoutContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    cartItems,
    bundleItems,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    getBillingBreakdown,
    refreshPrices,
  } = useCartStore();
  const hasCartEntries = cartItems.length > 0 || bundleItems.length > 0;
  const {
    processPayment,
    isProcessing,
    clearPaymentState,
    error: paymentError,
  } = usePaymentStore();

  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    if (paymentStatus === "cancelled") {
      toast.info("Payment Cancelled", {
        description: "You can continue shopping or try again when ready.",
      });
      router.replace("/checkout");
    }
  }, [searchParams, router]);

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
  const [freeShippingSetting, setFreeShippingSetting] = useState<FreeShippingSetting>({ enabled: true, threshold: 0 });
  const [shippingRateSetting, setShippingRateSetting] = useState<ShippingRateSetting>({ amount: 49, currency: "₹" });

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

  useEffect(() => {
    Promise.all([getFreeShipping(), getShippingRate()]).then(([fs, sr]) => {
      setFreeShippingSetting(fs);
      setShippingRateSetting(sr);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    setIsMounted(true);
    refreshPrices().then((pricesChanged) => {
      if (pricesChanged) {
        toast.info("Prices Updated", {
          description: "Some prices in your cart have been updated to reflect the latest changes.",
        });
      }
      const breakdown = getBillingBreakdown();
      setBilling(breakdown);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isMounted) {
      const breakdown = getBillingBreakdown();
      setBilling(breakdown);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems, bundleItems, appliedCoupon, isMounted]);

  const computeShippingCharge = (shiprocketPrepaid: number): number => {
    return calculateShippingCharge(
      billing.total,
      freeShippingSetting,
      shippingRateSetting,
      shiprocketPrepaid
    );
  };

  const alwaysFreeShipping = freeShippingSetting.enabled && freeShippingSetting.threshold <= 0;

  const shippingLabel = (() => {
    if (alwaysFreeShipping) return "FREE";
    if (!isPincodeServiceable && computeShippingCharge(shippingCharge) !== 0) return "Check pincode";
    const effective = computeShippingCharge(shippingCharge);
    if (effective === 0) return "FREE";
    return billingCalculator.formatCurrency(effective);
  })();

  const effectiveShippingCharge = alwaysFreeShipping
    ? 0
    : computeShippingCharge(shippingCharge);

  const summaryLines = [
    ...cartItems.map((item) => ({
      key: `p-${item.product.id}`,
      name: item.product.name,
      quantity: item.quantity,
      lineTotal: item.product.price.current * item.quantity,
    })),
    ...bundleItems.map((item) => ({
      key: `b-${item.bundle.id}`,
      name: formatBundleOrderLineName(
        item.bundle.name,
        item.bundle.items.map((bi) => ({ name: bi.product.name, quantity: bi.quantity }))
      ),
      quantity: item.quantity,
      lineTotal: item.bundle.price.current * item.quantity,
    })),
  ];

  const handleCheckoutCouponApply = async (code: string) => {
    const subtotalNow = getBillingBreakdown().subtotal;
    const res = await validateCoupon(code, subtotalNow);
    if (res.valid && res.coupon) {
      applyCoupon(res.coupon);
      toast.success(`Coupon ${res.coupon.code} applied`);
    } else {
      toast.error(res.error || "Invalid coupon code");
    }
  };

  const handlePincodeServiceabilityChange = (
    isServiceable: boolean,
    info?: {
      pincode: string;
      serviceable: boolean;
      deliveryTime?: string;
      charges?: { cod: number; prepaid: number };
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

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!customerInfo.firstName.trim()) errors.firstName = "First name is required";
    if (!customerInfo.lastName.trim()) errors.lastName = "Last name is required";
    if (!customerInfo.email.trim()) errors.email = "Email is required";
    if (!customerInfo.phone.trim()) errors.phone = "Phone number is required";
    if (!customerInfo.address.trim()) errors.address = "Address is required";
    if (!customerInfo.city.trim()) errors.city = "City is required";
    if (!customerInfo.state.trim()) errors.state = "State is required";
    if (!customerInfo.postalCode.trim()) errors.postalCode = "Postal code is required";

    if (customerInfo.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(customerInfo.email.trim())) {
        errors.email = "Please enter a valid email address";
      }
    }

    if (customerInfo.phone.trim()) {
      const cleanPhone = customerInfo.phone.replace(/\D/g, "");
      if (cleanPhone.length === 10) {
        if (!/^[6-9]/.test(cleanPhone)) errors.phone = "Indian mobile numbers should start with 6, 7, 8, or 9";
      } else if (cleanPhone.length === 12) {
        if (!/^91[6-9]/.test(cleanPhone)) errors.phone = "Please enter a valid Indian mobile number (91XXXXXXXXXX)";
      } else if (cleanPhone.length < 10) {
        errors.phone = "Phone number is too short";
      } else {
        errors.phone = "Please enter a valid 10-digit mobile number";
      }
    }

    if (!acceptTerms) errors.terms = "Please accept the terms and conditions";

    if (!alwaysFreeShipping && !isPincodeServiceable) {
      errors.pincode = "Please check pincode serviceability before proceeding";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearPaymentState();

    if (!hasCartEntries) {
      toast.error("Cart is empty", { description: "Please add items to your cart before checking out." });
      return;
    }

    const isValid = validateForm();
    if (!isValid) {
      toast.error("Form validation failed", { description: "Please correct the errors highlighted below and try again." });
      const firstErrorField = Object.keys(formErrors)[0];
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField);
        if (element) { element.scrollIntoView({ behavior: "smooth", block: "center" }); element.focus(); }
      }
      return;
    }

    try {
      const preflight = computeCheckoutTotals({
        productLines: cartItems.map((ci) => ({
          id: ci.product.id,
          name: ci.product.name,
          price: ci.product.price.current,
          quantity: ci.quantity,
          inStock: ci.product.status !== "out_of_stock" && ci.product.status !== "discontinued",
        })),
        bundleLines: bundleItems.map((bi) => ({
          id: bi.bundle.id,
          name: bi.bundle.name,
          price: bi.bundle.price.current,
          quantity: bi.quantity,
          active: bi.bundle.status === "active",
          constituents: bi.bundle.items.map((c) => ({
            name: c.product.name,
            quantity: c.quantity,
            inStock: c.product.status !== "out_of_stock" && c.product.status !== "discontinued",
          })),
        })),
        coupon: appliedCoupon,
        freeShipping: freeShippingSetting,
        shippingRate: shippingRateSetting,
        shiprocketPrepaid: shippingCharge,
      });

      if (preflight.availabilityError) {
        toast.error("Item Unavailable", { description: preflight.availabilityError });
        return;
      }

      const orderItems: OrderItem[] = [
        ...cartItems.map((item) => ({
          productId: item.product.id,
          itemType: "product" as const,
          productName: item.product.name,
          price: item.product.price.current,
          quantity: item.quantity,
          total: item.product.price.current * item.quantity,
        })),
        ...bundleItems.map((item) => ({
          productId: item.bundle.id,
          bundleId: item.bundle.id,
          itemType: "bundle" as const,
          productName: formatBundleOrderLineName(
            item.bundle.name,
            item.bundle.items.map((bi) => ({ name: bi.product.name, quantity: bi.quantity }))
          ),
          price: item.bundle.price.current,
          quantity: item.quantity,
          total: item.bundle.price.current * item.quantity,
        })),
      ];

      const activeCouponCode =
        appliedCoupon && billing.discount > 0 ? appliedCoupon.code : null;
      const totalWithShipping = billing.total + effectiveShippingCharge;
      const orderDetails = {
        customerInfo,
        items: orderItems,
        subtotal: billing.subtotal,
        discount: billing.discount,
        couponCode: activeCouponCode,
        tax: billing.tax,
        shipping: effectiveShippingCharge,
        total: totalWithShipping,
        paymentMethod: "online",
        notes: activeCouponCode
          ? `Order placed via web checkout. Coupon: ${activeCouponCode}`
          : "Order placed via web checkout.",
      };

      const result = await processPayment(totalWithShipping, customerInfo, orderDetails, {
        bundleItems: bundleItems.map((b) => ({
          bundleId: b.bundle.id,
          quantity: b.quantity,
        })),
        couponCode: activeCouponCode,
        shiprocketPrepaid: shippingCharge,
      });

      if (result.success && result.orderId) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem(
            "pending_order_details",
            JSON.stringify({
              orderId: result.orderId,
              customerInfo,
              orderItems,
              couponCode: activeCouponCode,
              billing: {
                ...billing,
                shipping: effectiveShippingCharge,
                total: totalWithShipping,
              },
            })
          );
        }
        toast.info("Redirecting to payment...", {
          description: "Please complete your payment on the next page.",
        });
      } else {
        toast.error("Payment Failed", { description: paymentError || "Please try again or contact support if the issue persists." });
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Checkout Error", { description: "An unexpected error occurred. Please try again." });
    }
  };

  const Field = ({
    id,
    label,
    children,
    colSpan,
  }: {
    id: string;
    label: string;
    children: React.ReactNode;
    colSpan?: boolean;
  }) => (
    <div style={colSpan ? { gridColumn: "1 / -1" } : {}}>
      <label htmlFor={id} style={labelStyle}>{label}</label>
      {children}
      {formErrors[id] && <div style={errorTextStyle}>{formErrors[id]}</div>}
    </div>
  );

  return (
    <>
      {/* Hero header */}
      <div style={{ background: DARK, color: CREAM, borderBottom: `1px solid ${INK}` }} className="px-5 md:px-12" >
        <div style={{ paddingTop: 40, paddingBottom: 40 }}>
          <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: SAFFRON, marginBottom: 10 }}>
            SECURE CHECKOUT
          </div>
          <h1 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 300, lineHeight: 0.9, letterSpacing: "-0.03em", margin: 0 }}>
            Your <em style={{ color: SAFFRON }}>order.</em>
          </h1>
        </div>
      </div>

      <main style={{ background: CREAM, color: INK }} className="px-5 md:px-12">
        <div style={{ paddingTop: 40, paddingBottom: 80 }}>
          {/* Form-level errors */}
          {Object.keys(formErrors).length > 0 && (
            <div style={{ border: `1px solid ${SAFFRON}`, padding: "16px 20px", marginBottom: 24, background: "rgba(232,118,58,0.06)" }}>
              <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: SAFFRON, marginBottom: 8 }}>
                PLEASE FIX THE FOLLOWING
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {Object.entries(formErrors).map(([field, message]) => (
                  <li key={field} style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, color: INK, opacity: 0.8, marginBottom: 4 }}>
                    <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, textTransform: "capitalize" }}>
                      {field.replace(/([A-Z])/g, " $1").trim()}:
                    </span>{" "}
                    {message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Left: form */}
            <div className="w-full lg:w-2/3">
              {!hasCartEntries ? (
                <div style={{ ...panelStyle, padding: "48px 32px", textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "2rem", fontWeight: 300, marginBottom: 12 }}>
                    Your cart is <em style={{ color: SAFFRON }}>empty.</em>
                  </div>
                  <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 14, opacity: 0.6, marginBottom: 24 }}>
                    Please add items to your cart before checking out.
                  </p>
                  <button
                    onClick={() => router.push("/products")}
                    style={{ background: INK, color: CREAM, border: "none", padding: "16px 32px", fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", cursor: "pointer" }}
                  >
                    BROWSE FRAGRANCES →
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {/* Shipping Information */}
                  <div style={panelStyle}>
                    <div style={{ padding: "20px 24px", borderBottom: `1px solid ${INK}` }}>
                      <div style={sectionHeadStyle}>01 / SHIPPING INFORMATION</div>
                    </div>
                    <div style={{ padding: "24px" }}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field id="firstName" label="First Name *">
                          <input id="firstName" value={customerInfo.firstName} onChange={(e) => handleInputChange("firstName", e.target.value)} style={formErrors.firstName ? fieldErrorStyle : fieldStyle} required />
                        </Field>
                        <Field id="lastName" label="Last Name *">
                          <input id="lastName" value={customerInfo.lastName} onChange={(e) => handleInputChange("lastName", e.target.value)} style={formErrors.lastName ? fieldErrorStyle : fieldStyle} required />
                        </Field>
                        <Field id="email" label="Email Address *">
                          <input id="email" type="email" value={customerInfo.email} onChange={(e) => handleInputChange("email", e.target.value)} style={formErrors.email ? fieldErrorStyle : fieldStyle} required />
                        </Field>
                        <Field id="phone" label="Phone Number *">
                          <input id="phone" value={customerInfo.phone} onChange={(e) => handleInputChange("phone", e.target.value)} placeholder="+91 98765 43210" style={formErrors.phone ? fieldErrorStyle : fieldStyle} required />
                        </Field>
                        <Field id="address" label="Address *" colSpan>
                          <input id="address" value={customerInfo.address} onChange={(e) => handleInputChange("address", e.target.value)} style={formErrors.address ? fieldErrorStyle : fieldStyle} required />
                        </Field>
                        <Field id="city" label="City *">
                          <input id="city" value={customerInfo.city} onChange={(e) => handleInputChange("city", e.target.value)} style={formErrors.city ? fieldErrorStyle : fieldStyle} required />
                        </Field>
                        <Field id="state" label="State *">
                          <input id="state" value={customerInfo.state} onChange={(e) => handleInputChange("state", e.target.value)} style={formErrors.state ? fieldErrorStyle : fieldStyle} required />
                        </Field>
                        <Field id="postalCode" label="Postal Code *">
                          <input id="postalCode" value={customerInfo.postalCode} onChange={(e) => handleInputChange("postalCode", e.target.value)} style={formErrors.postalCode ? fieldErrorStyle : fieldStyle} required />
                        </Field>
                        <Field id="country" label="Country">
                          <input id="country" value={customerInfo.country} onChange={(e) => handleInputChange("country", e.target.value)} style={fieldStyle} required />
                        </Field>
                      </div>
                    </div>
                  </div>

                  {/* Pincode check */}
                  <div style={{ ...panelStyle, marginTop: 2 }}>
                    <div style={{ padding: "20px 24px", borderBottom: `1px solid ${INK}` }}>
                      <div style={sectionHeadStyle}>02 / DELIVERY CHECK</div>
                    </div>
                    <div style={{ padding: "24px" }}>
                      <PincodeChecker onServiceabilityChange={handlePincodeServiceabilityChange} initialPincode={customerInfo.postalCode} />
                      {formErrors.pincode && <div style={{ ...errorTextStyle, marginTop: 8 }}>{formErrors.pincode}</div>}
                    </div>
                  </div>

                  {/* Payment info */}
                  <div style={{ ...panelStyle, marginTop: 2, background: DARK, color: CREAM }}>
                    <div style={{ padding: "20px 24px" }}>
                      <div style={{ ...sectionHeadStyle, marginBottom: 10 }}>03 / PAYMENT</div>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <Lock style={{ width: 14, height: 14, flexShrink: 0, marginTop: 2, color: SAFFRON }} strokeWidth={1.5} />
                        <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, lineHeight: 1.6, opacity: 0.75, margin: 0 }}>
                          All payments are processed securely through Cashfree. Choose UPI, Card, or Net Banking on the next page.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Terms */}
                  <div style={{ ...panelStyle, marginTop: 2, padding: "20px 24px" }}>
                    <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        id="acceptTerms"
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        style={{ marginTop: 3, width: 14, height: 14, accentColor: INK, flexShrink: 0 }}
                      />
                      <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, lineHeight: 1.5, color: INK, opacity: 0.8 }}>
                        I agree to the{" "}
                        <Link href="/terms-of-service" style={{ color: INK, textDecoration: "underline" }}>Terms of Service</Link>{" "}
                        and{" "}
                        <Link href="/privacy-policy" style={{ color: INK, textDecoration: "underline" }}>Privacy Policy</Link>
                      </span>
                    </label>
                    {formErrors.terms && <div style={{ ...errorTextStyle, marginTop: 8 }}>{formErrors.terms}</div>}
                  </div>

                  {/* Mobile order summary */}
                  <div className="lg:hidden" style={{ marginTop: 2 }}>
                    <OrderSummary billing={billing} shippingCharge={effectiveShippingCharge} shippingLabel={shippingLabel} appliedCouponCode={appliedCoupon?.code ?? null} onApplyCoupon={handleCheckoutCouponApply} onRemoveCoupon={removeCoupon} lineItems={summaryLines} />
                  </div>

                  {/* Action buttons */}
                  <div style={{ marginTop: 2, display: "flex", gap: 2 }} className="flex-col sm:flex-row">
                    <button
                      type="button"
                      onClick={() => router.push("/cart")}
                      disabled={isProcessing}
                      style={{ flex: 1, background: "transparent", color: INK, border: `1px solid ${INK}`, padding: "18px 24px", fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", cursor: "pointer", opacity: isProcessing ? 0.5 : 1 }}
                    >
                      ← BACK TO CART
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessing || !hasCartEntries}
                      style={{ flex: 1, background: isProcessing || !hasCartEntries ? "#3A3833" : SAFFRON, color: INK, border: "none", padding: "18px 24px", fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", cursor: isProcessing || !hasCartEntries ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 style={{ width: 14, height: 14, animation: "spin 1s linear infinite" }} />
                          PROCESSING...
                        </>
                      ) : (
                        `PAY ${billingCalculator.formatCurrency(billing.total + effectiveShippingCharge)} →`
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Desktop order summary */}
            <div className="hidden lg:block lg:w-1/3">
              <div style={{ position: "sticky", top: 90 }}>
                <OrderSummary billing={billing} shippingCharge={effectiveShippingCharge} shippingLabel={shippingLabel} appliedCouponCode={appliedCoupon?.code ?? null} onApplyCoupon={handleCheckoutCouponApply} onRemoveCoupon={removeCoupon} lineItems={summaryLines} />
              </div>
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
        <main style={{ background: CREAM, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
          <div style={{ textAlign: "center" }}>
            <Loader2 style={{ width: 32, height: 32, margin: "0 auto 16px", color: SAFFRON, animation: "spin 1s linear infinite" }} />
            <p style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: INK, opacity: 0.5 }}>
              LOADING CHECKOUT...
            </p>
          </div>
        </main>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
};

export default Checkout;
