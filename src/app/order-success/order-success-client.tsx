"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { usePaymentStore } from "@/stores/payment-store";
import { verifyPaymentStatus } from "@/types/services/cashfree-services";
import { supabase } from "@/lib/supabase";
import {
  CheckCircle,
  Package,
  Truck,
  MapPin,
  Phone,
  Mail,
  Download,
  ArrowLeft,
} from "lucide-react";
import type { OrderDetails } from "@/types/cashfree";
import OrderTracker from "@/components/order-tracker";
import { toast } from "sonner";

interface OrderSuccessClientProps {
  orderId: string | null;
}

const OrderSuccessClient: React.FC<OrderSuccessClientProps> = ({ orderId: initialOrderId }) => {
  const router = useRouter();
  const { getOrderById } = usePaymentStore();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(initialOrderId);
  const [delhiveryWaybill, setDelhiveryWaybill] = useState<string | null>(null);
  const [delhiveryStatus, setDelhiveryStatus] = useState<string | null>(null);

  // Extract order ID from URL or sessionStorage
  useEffect(() => {
    let id = initialOrderId;
    
    // If no order ID in URL, try to get from sessionStorage
    if (!id && typeof window !== "undefined") {
      const storedOrderId = sessionStorage.getItem("pending_cashfree_order_id");
      if (storedOrderId) {
        id = storedOrderId;
        setOrderId(storedOrderId);
      }
    }
    
    // If still no order ID, check URL params directly (fallback)
    if (!id && typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const urlOrderId = urlParams.get("order_id");
      if (urlOrderId) {
        id = urlOrderId;
        setOrderId(urlOrderId);
      }
    }
  }, [initialOrderId]);

  useEffect(() => {
    const fetchOrderData = async () => {
      if (!orderId) {
        setLoading(false);
        setError("Order ID is missing. Please check your order confirmation email.");
        return;
      }

      try {
        // First, try to get order from localStorage (if available from checkout)
        const orderDetails = getOrderById(orderId);
        
        if (orderDetails) {
          setOrder(orderDetails);
          setLoading(false);
          return;
        }

        // If not in localStorage, try to fetch from Supabase database
        const { data: dbOrder, error: dbError } = await supabase
          .from("orders")
          .select("*")
          .eq("cashfree_order_id", orderId)
          .single();

        if (dbOrder && !dbError) {
          // Convert database order to OrderDetails format
          const orderDetails: OrderDetails = {
            id: dbOrder.cashfree_order_id,
            customerInfo: {
              firstName: dbOrder.customer_name?.split(" ")[0] || "",
              lastName: dbOrder.customer_name?.split(" ").slice(1).join(" ") || "",
              email: dbOrder.customer_email || "",
              phone: dbOrder.customer_phone || "",
              address: dbOrder.shipping_address?.address_line1 || "",
              city: dbOrder.shipping_address?.city || "",
              state: dbOrder.shipping_address?.state || "",
              postalCode: dbOrder.shipping_address?.pincode || "",
              country: dbOrder.shipping_address?.country || "India",
            },
            items: (dbOrder.items || []).map((item: any) => ({
              productId: item.product_id || "",
              productName: item.product_name || "",
              price: item.price || 0,
              quantity: item.quantity || 0,
              total: item.total || 0,
            })),
            subtotal: dbOrder.order_amount || 0,
            tax: 0, // Calculate from items if needed
            shipping: 0,
            total: dbOrder.order_amount || 0,
            paymentMethod: dbOrder.payment_method || "online",
            paymentStatus: dbOrder.payment_status === "SUCCESS" ? "success" : "pending",
            orderDate: new Date(dbOrder.created_at),
            notes: dbOrder.notes,
          };

          // Set Delhivery tracking info if available
          if (dbOrder.delhivery_waybill) {
            setDelhiveryWaybill(dbOrder.delhivery_waybill);
            setDelhiveryStatus(dbOrder.delhivery_status || "created");
          }

          setOrder(orderDetails);
          setLoading(false);
          return;
        }

        // If not in database, verify payment status with Cashfree
        try {
          const paymentStatus = await verifyPaymentStatus(orderId);
          
          if (paymentStatus.order_status === "PAID") {
            // Payment successful - create order details from Cashfree response
            const orderDetails: OrderDetails = {
              id: paymentStatus.order_id,
              customerInfo: {
                firstName: paymentStatus.customer_details?.customer_name?.split(" ")[0] || "",
                lastName: paymentStatus.customer_details?.customer_name?.split(" ").slice(1).join(" ") || "",
                email: paymentStatus.customer_details?.customer_email || "",
                phone: paymentStatus.customer_details?.customer_phone || "",
                address: paymentStatus.shipping_address?.address_line1 || "",
                city: paymentStatus.shipping_address?.city || "",
                state: paymentStatus.shipping_address?.state || "",
                postalCode: paymentStatus.shipping_address?.pincode || "",
                country: paymentStatus.shipping_address?.country || "India",
              },
              items: [], // Items not available from payment status
              // Cashfree ALWAYS returns order_amount in paise, so always convert to rupees
              // Divide by 100 to convert paise to rupees (e.g., 39900 paise = ₹399)
              subtotal: paymentStatus.order_amount / 100,
              tax: 0,
              shipping: 0,
              total: paymentStatus.order_amount / 100,
              paymentMethod: paymentStatus.payment_details?.payment_method || "online",
              paymentStatus: "success",
              orderDate: new Date(),
            };

            setOrder(orderDetails);
            setLoading(false);
          } else {
            setError("Payment not completed yet");
            setLoading(false);
          }
        } catch (verifyError) {
          console.error("Error verifying payment:", verifyError);
          setError("Unable to verify order. Please contact support.");
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Failed to load order details");
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderData();
    }
  }, [orderId, getOrderById]);

  if (loading) {
    return (
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brown-600 mx-auto mb-4"></div>
          <p>Loading order details...</p>
        </div>
      </main>
    );
  }

  if (!order && !loading) {
    return (
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">
            {error ? "Order Verification Failed" : "Order Not Found"}
          </h1>
          <p className="text-gray-600 mb-4">
            {error || "The order you're looking for doesn't exist or has been removed."}
          </p>
          {error && orderId && (
            <p className="text-sm text-gray-500 mb-4">
              Order ID: {orderId}
            </p>
          )}
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
    <main className="flex-grow py-8">
      <div className="luxury-container">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-3xl font-serif font-bold mb-2">
            Payment Successful! 🎉
          </h1>
          <p className="text-lg text-gray-600">
            Thank you for your purchase. Your order has been confirmed.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h2 className="text-xl font-medium mb-1">Order #{order.id}</h2>
              <p className="text-gray-600">
                Placed on{" "}
                {order.orderDate &&
                order.orderDate instanceof Date &&
                !isNaN(order.orderDate.getTime())
                  ? order.orderDate.toLocaleDateString("en-IN", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : new Date().toLocaleDateString("en-IN", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className="bg-green-50 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Payment Confirmed
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="font-medium mb-4">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2"
                >
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

            {/* Order Summary */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {order.shipping === 0
                    ? "Free"
                    : `₹${order.shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax (18% GST)</span>
                <span>₹{order.tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-medium">
                <span>Total Paid</span>
                <span>₹{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Payment Method</h3>
            <p className="text-gray-600 capitalize">
              {order.paymentMethod} Payment
            </p>
          </div>

          {/* Shipping Address */}
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
              <div className="flex items-center gap-4 mt-2">
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

        {/* What's Next Section */}
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
                  We&apos;ll prepare your items within 1-2 business days
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
                  Your order will be shipped within 3-5 business days
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
                  Expect delivery within 5-7 business days
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => router.push("/products")}
          >
            Continue Shopping
          </Button>
          <Button
            className="flex-1 bg-brown-600 hover:bg-brown-700"
            onClick={() => {
              // Generate a simple receipt/invoice
              const receiptData = {
                orderId: order.id,
                customerName: `${order.customerInfo.firstName} ${order.customerInfo.lastName}`,
                email: order.customerInfo.email,
                date: order.orderDate.toLocaleDateString(),
                items: order.items,
                total: order.total,
                paymentMethod: order.paymentMethod,
              };

              console.log("Receipt data:", receiptData);

              // In a real app, you would generate and download a PDF
              alert("Receipt feature will be implemented in the next update!");
            }}
          >
            <Download className="mr-2 h-4 w-4" />
            Download Receipt
          </Button>
        </div>

        {/* Delhivery Shipment Info */}
        {delhiveryWaybill && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-3">
              <div className="bg-green-100 rounded-full p-2 flex-shrink-0">
                <Truck className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-grow">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  Shipment Created
                </h3>
                <p className="text-sm text-gray-700 mb-2">
                  Your order has been shipped via Delhivery. Use the waybill number below to track your shipment.
                </p>
                <div className="bg-white rounded-lg p-3 border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Waybill Number</p>
                      <p className="font-mono font-semibold text-lg text-green-700">
                        {delhiveryWaybill}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-1">Status</p>
                      <p className="text-sm font-medium capitalize text-green-700">
                        {delhiveryStatus === "created" ? "Shipment Created" : delhiveryStatus || "Processing"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Order Tracking */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Track Your Order
          </h3>
          {delhiveryWaybill ? (
            <>
              <p className="text-sm text-gray-600 mb-4">
                Your waybill number is pre-filled below. Click Track to see the latest status.
              </p>
              <OrderTracker initialWaybill={delhiveryWaybill} />
            </>
          ) : (
            <>
              <p className="text-sm text-gray-600 mb-4">
                {delhiveryStatus === "failed" 
                  ? "Shipment creation is in progress. Please check back in a few minutes or enter your waybill number manually once you receive it."
                  : "Your shipment is being prepared. Enter your waybill number once you receive it to track your order status."}
              </p>
              <OrderTracker />
            </>
          )}
        </div>

        {/* Contact Support */}
        <div className="text-center mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Need help with your order?{" "}
            <Link
              href="/contact"
              className="text-brown-600 underline font-medium"
            >
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default OrderSuccessClient;

