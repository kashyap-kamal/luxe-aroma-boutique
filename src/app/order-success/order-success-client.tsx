"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { usePaymentStore } from "@/stores/payment-store";
import { useCartStore } from "@/stores/cart-store";
import { verifyPaymentStatus } from "@/types/services/cashfree-services";
import { trackEvent } from "@/lib/analytics-service";
import {
  CheckCircle,
  Clock,
  Package,
  Truck,
  MapPin,
  Phone,
  Mail,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import type { OrderDetails, OrderItem } from "@/types/cashfree";
import { PaymentStatus } from "@/types/cashfree";
import OrderTracker from "@/components/order-tracker";

interface OrderSuccessClientProps {
  orderId: string | null;
}

const OrderSuccessClient: React.FC<OrderSuccessClientProps> = ({
  orderId: initialOrderId,
}) => {
  const router = useRouter();
  const { markOrderPaid } = usePaymentStore();
  const { clearCart } = useCartStore();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingState, setPendingState] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(initialOrderId);
  const [shiprocketAwb, setShiprocketAwb] = useState<string | null>(null);
  const [shiprocketStatus, setShiprocketStatus] = useState<string | null>(null);

  useEffect(() => {
    let id = initialOrderId;
    if (!id && typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      id = urlParams.get("order_id") || sessionStorage.getItem("pending_cashfree_order_id");
      if (id) setOrderId(id);
    }
  }, [initialOrderId]);

  const verifyAndLoadOrder = useCallback(async () => {
    if (!orderId) {
      setLoading(false);
      setError("Order ID is missing. Please check your order confirmation email.");
      return;
    }

    setLoading(true);
    setError(null);
    setPendingState(null);

    try {
      const paymentStatus = await verifyPaymentStatus(orderId);

      if (paymentStatus.order_status !== "PAID") {
        setPendingState(paymentStatus.order_status);
        setLoading(false);
        return;
      }

      let pendingSnapshot: {
        customerInfo?: OrderDetails["customerInfo"];
        orderItems?: OrderItem[];
        couponCode?: string | null;
        billing?: { subtotal?: number; discount?: number; shipping?: number; total?: number };
      } | null = null;

      if (typeof window !== "undefined") {
        try {
          const raw = sessionStorage.getItem("pending_order_details");
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed?.orderId === orderId) {
              pendingSnapshot = parsed;
            }
          }
        } catch {
          pendingSnapshot = null;
        }
      }

      const dbSummary = paymentStatus.db_order;
      const items: OrderItem[] =
        dbSummary && Array.isArray(dbSummary.items) && dbSummary.items.length > 0
          ? dbSummary.items.map((item) => {
              const price = Number(item.price || 0);
              const quantity = Number(item.quantity || 1);
              return {
                productId: item.product_id || "",
                bundleId: item.bundle_id,
                itemType: item.type,
                productName: item.product_name || "Fragrance",
                price,
                quantity,
                total: Math.round(price * quantity * 100) / 100,
              };
            })
          : pendingSnapshot?.orderItems ?? [];

      const fullName = paymentStatus.customer_details?.customer_name || "";
      const shipAddr = (paymentStatus.shipping_address ?? {}) as Record<string, string | undefined>;

      const verifiedOrder: OrderDetails = {
        id: paymentStatus.order_id,
        customerInfo: pendingSnapshot?.customerInfo ?? {
          firstName: fullName.split(" ")[0] || "",
          lastName: fullName.split(" ").slice(1).join(" ") || "",
          email: paymentStatus.customer_details?.customer_email || "",
          phone: paymentStatus.customer_details?.customer_phone || "",
          address: shipAddr.address_line1 || shipAddr.address || "",
          city: shipAddr.city || "",
          state: shipAddr.state || "",
          postalCode: shipAddr.pincode || "",
          country: shipAddr.country || "India",
        },
        items,
        subtotal: Number(
          dbSummary?.subtotal_amount ??
            pendingSnapshot?.billing?.subtotal ??
            paymentStatus.order_amount
        ),
        discount: Number(
          dbSummary?.discount_amount ?? pendingSnapshot?.billing?.discount ?? 0
        ),
        couponCode: dbSummary?.coupon_code ?? pendingSnapshot?.couponCode ?? null,
        tax: 0,
        shipping: Number(
          dbSummary?.shipping_amount ?? pendingSnapshot?.billing?.shipping ?? 0
        ),
        total: Number(paymentStatus.order_amount),
        paymentMethod:
          paymentStatus.payment_details?.payment_method ||
          dbSummary?.payment_method ||
          "online",
        paymentStatus: PaymentStatus.SUCCESS,
        orderDate: dbSummary?.created_at ? new Date(dbSummary.created_at) : new Date(),
        notes: dbSummary?.notes ?? undefined,
      };

      if (dbSummary?.shiprocket_awb) {
        setShiprocketAwb(dbSummary.shiprocket_awb);
        setShiprocketStatus(dbSummary.shiprocket_status || "created");
      }

      clearCart();
      markOrderPaid(orderId, verifiedOrder);
      if (typeof window !== "undefined") {
        const dedupeKey = `aromeluxe_tracked_purchase_${orderId}`;
        if (!sessionStorage.getItem(dedupeKey)) {
          sessionStorage.setItem(dedupeKey, "1");
          trackEvent({
            eventType: "purchase",
            orderId,
            valueInr: verifiedOrder.total,
          });
        }
      }
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("pending_cashfree_order_id");
        sessionStorage.removeItem("pending_cashfree_session_id");
        sessionStorage.removeItem("pending_order_details");
      }

      setOrder(verifiedOrder);
      setLoading(false);
    } catch (err) {
      console.error("Error verifying order:", err);
      setError("Unable to verify payment status right now. Your cart has been preserved.");
      setLoading(false);
    }
  }, [orderId, clearCart, markOrderPaid]);

  useEffect(() => {
    if (orderId) {
      void verifyAndLoadOrder();
    } else {
      setLoading(false);
    }
  }, [orderId, verifyAndLoadOrder]);

  if (loading) {
    return (
      <main className="flex-grow flex items-center justify-center py-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Verifying payment with Cashfree...</p>
        </div>
      </main>
    );
  }

  if (pendingState) {
    return (
      <main className="flex-grow flex items-center justify-center py-24 px-4">
        <div className="text-center max-w-md">
          <Clock className="h-16 w-16 text-amber-500 mx-auto mb-4" />
          <h1 className="text-2xl font-serif font-bold mb-2">
            {pendingState === "ACTIVE" ? "Payment Pending" : "Payment Not Completed"}
          </h1>
          <p className="text-gray-600 mb-2">
            {pendingState === "ACTIVE"
              ? "We have not received payment confirmation from Cashfree yet. Your cart items are still saved."
              : `This payment session ended with status: ${pendingState}. Your cart items are still saved.`}
          </p>
          {orderId && <p className="text-xs text-gray-500 font-mono mb-6">Order ID: {orderId}</p>}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => void verifyAndLoadOrder()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Check Again
            </Button>
            <Button variant="outline" onClick={() => router.push("/checkout")}>
              Return to Checkout
            </Button>
          </div>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="flex-grow flex items-center justify-center py-24 px-4">
        <div className="text-center max-w-md">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">
            {error ? "Order Verification Failed" : "Order Not Found"}
          </h1>
          <p className="text-gray-600 mb-4">
            {error || "Please check your order confirmation email or return to checkout."}
          </p>
          {orderId && <p className="text-xs text-gray-500 font-mono mb-6">Order ID: {orderId}</p>}
          <div className="flex gap-4 justify-center">
            <Button onClick={() => router.push("/")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
            <Button variant="outline" onClick={() => router.push("/checkout")}>
              Back to Checkout
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow pt-24 pb-8">
      <div className="luxury-container">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-3xl font-serif font-bold mb-2">Payment Successful!</h1>
          <p className="text-lg text-gray-600">
            Thank you for your purchase. Your order has been confirmed.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h2 className="text-xl font-medium mb-1">Order #{order.id}</h2>
              <p className="text-gray-600">
                Placed on{" "}
                {order.orderDate instanceof Date && !isNaN(order.orderDate.getTime())
                  ? order.orderDate.toLocaleDateString("en-IN", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : new Date().toLocaleDateString("en-IN")}
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className="bg-green-50 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Payment Confirmed
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-4">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2">
                  <div className="flex-grow">
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity} × ₹{item.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="font-medium">₹{item.total.toFixed(2)}</p>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{order.subtotal.toFixed(2)}</span>
              </div>
              {(order.discount ?? 0) > 0 && (
                <div className="flex justify-between text-sm text-amber-700">
                  <span>Discount{order.couponCode ? ` (${order.couponCode})` : ""}</span>
                  <span>-₹{(order.discount ?? 0).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span>{order.shipping > 0 ? `₹${order.shipping.toFixed(2)}` : "FREE"}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>GST</span>
                <span>Included</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-medium">
                <span>Total Paid</span>
                <span>₹{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Shipping Address</h3>
            <div className="text-gray-600">
              <p>
                {order.customerInfo.firstName} {order.customerInfo.lastName}
              </p>
              <p>{order.customerInfo.address}</p>
              <p>
                {order.customerInfo.city}, {order.customerInfo.state}{" "}
                {order.customerInfo.postalCode}
              </p>
              <p>{order.customerInfo.country}</p>
              <div className="flex items-center gap-4 mt-2 flex-wrap">
                <span className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  {order.customerInfo.phone}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {order.customerInfo.email}
                </span>
              </div>
            </div>
          </div>
        </div>

        {shiprocketAwb && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="bg-green-100 rounded-full p-2 flex-shrink-0">
                <Truck className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-grow">
                <h3 className="font-medium mb-1">Shipment Created</h3>
                <p className="text-sm text-gray-700">
                  AWB: <span className="font-mono">{shiprocketAwb}</span> ({shiprocketStatus || "created"})
                </p>
              </div>
            </div>
            <OrderTracker initialWaybill={shiprocketAwb} />
          </div>
        )}

        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <Truck className="h-5 w-5" />
            What happens next?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 rounded-full p-2 flex-shrink-0">
                <Package className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Order Processing</p>
                <p className="text-xs text-gray-600">
                  Prepared within 1 to 2 business days
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 rounded-full p-2 flex-shrink-0">
                <Truck className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Shipping</p>
                <p className="text-xs text-gray-600">
                  Dispatched within 3 to 5 business days
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 rounded-full p-2 flex-shrink-0">
                <MapPin className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Delivery</p>
                <p className="text-xs text-gray-600">
                  Delivered within 5 to 7 business days
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="outline" className="flex-1" onClick={() => router.push("/products")}>
            Continue Shopping
          </Button>
          <Button className="flex-1" onClick={() => router.push("/orders")}>
            View My Orders
          </Button>
        </div>
      </div>
    </main>
  );
};

export default OrderSuccessClient;
