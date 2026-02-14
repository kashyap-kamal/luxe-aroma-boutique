"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useUser } from "@/stores/auth-store";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  ShoppingBag,
  Calendar,
  IndianRupee,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Clock,
  XCircle,
  Truck,
  MapPin,
  ExternalLink,
} from "lucide-react";
import OrderTracker from "@/components/order-tracker";

interface Order {
  id: string;
  cashfree_order_id: string;
  customer_email: string;
  customer_name: string;
  customer_phone: string;
  order_amount: number;
  order_currency: string;
  order_status: string;
  payment_status: string | null;
  payment_method: string | null;
  items: Array<{
    product_id: string;
    product_name: string;
    price: number;
    quantity: number;
    total: number;
  }>;
  shipping_address: {
    address_line1?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
  } | null;
  billing_address: {
    address_line1?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
  } | null;
  shiprocket_status: string | null;
  shiprocket_awb: string | null;
  shiprocket_courier_name: string | null;
  shiprocket_order_id: string | null;
  created_at: string;
  updated_at: string;
}

const OrdersPage = () => {
  const user = useUser();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch orders for the current user
        // RLS policy ensures users can only see their own orders
        const { data, error: fetchError } = await supabase
          .from("orders")
          .select("*")
          .eq("customer_email", user.email)
          .in("order_status", ["PAID", "SHIPPED", "DELIVERED"])
          .order("created_at", { ascending: false });

        if (fetchError) {
          throw fetchError;
        }

        setOrders(data || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.email]);

  const getStatusBadge = (status: string, paymentStatus: string | null) => {
    if (paymentStatus === "SUCCESS" || status === "PAID") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle2 className="h-3 w-3" />
          Paid
        </span>
      );
    }
    if (status === "ACTIVE") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock className="h-3 w-3" />
          Pending
        </span>
      );
    }
    if (status === "EXPIRED" || status === "CANCELLED") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="h-3 w-3" />
          {status === "EXPIRED" ? "Expired" : "Cancelled"}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        {status}
      </span>
    );
  };

  const getShippingBadge = (order: Order) => {
    const status = order.shiprocket_status;
    if (!status || status === "pending") return null;

    const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
      created: { label: "Order Created", color: "bg-blue-100 text-blue-800", icon: <Package className="h-3 w-3" /> },
      pickup_scheduled: { label: "Pickup Scheduled", color: "bg-blue-100 text-blue-800", icon: <Package className="h-3 w-3" /> },
      picked_up: { label: "Picked Up", color: "bg-indigo-100 text-indigo-800", icon: <Truck className="h-3 w-3" /> },
      dispatched: { label: "Dispatched", color: "bg-orange-100 text-orange-800", icon: <Truck className="h-3 w-3" /> },
      in_transit: { label: "In Transit", color: "bg-orange-100 text-orange-800", icon: <Truck className="h-3 w-3" /> },
      out_for_delivery: { label: "Out for Delivery", color: "bg-purple-100 text-purple-800", icon: <MapPin className="h-3 w-3" /> },
      delivered: { label: "Delivered", color: "bg-green-100 text-green-800", icon: <CheckCircle2 className="h-3 w-3" /> },
      failed: { label: "Shipment Failed", color: "bg-red-100 text-red-800", icon: <XCircle className="h-3 w-3" /> },
      rto: { label: "Returned", color: "bg-red-100 text-red-800", icon: <XCircle className="h-3 w-3" /> },
    };

    const config = statusConfig[status] || { label: status, color: "bg-gray-100 text-gray-800", icon: <Package className="h-3 w-3" /> };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <ProtectedRoute>
      <main className="flex-grow pt-24 pb-8">
        <div className="luxury-container">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <ShoppingBag className="h-8 w-8" />
              <div>
                <h1 className="text-3xl font-serif font-bold">My Orders</h1>
                <p className="text-gray-600 mt-1">
                  View and track all your orders
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-brown-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading your orders...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <Card className="mb-6 border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <p className="text-red-800">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {!loading && !error && orders.length === 0 && (
            <Card className="mb-6">
              <CardContent className="pt-12 pb-12 text-center">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-medium mb-2">No Orders Yet</h2>
                <p className="text-gray-600 mb-6">
                  You haven&apos;t placed any orders yet. Start shopping to see
                  your orders here!
                </p>
                <Button onClick={() => router.push("/products")}>
                  Browse Products
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Orders List */}
          {!loading && !error && orders.length > 0 && (
            <div className="space-y-6">
              {orders.map((order) => (
                <Card
                  key={order.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <CardTitle className="flex items-center gap-2 flex-wrap">
                          Order #{order.cashfree_order_id}
                          {getStatusBadge(
                            order.order_status,
                            order.payment_status
                          )}
                          {getShippingBadge(order)}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-2">
                          <Calendar className="h-4 w-4" />
                          {formatDate(order.created_at)}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold flex items-center gap-1">
                          <IndianRupee className="h-5 w-5" />
                          {order.order_amount.toFixed(2)}
                        </div>
                        <p className="text-sm text-gray-600">
                          {order.items.length} item
                          {order.items.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Order Items */}
                    <div className="mb-4">
                      <h3 className="font-medium mb-3">Order Items</h3>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center py-2 border-b last:border-0"
                          >
                            <div className="flex-grow">
                              <p className="font-medium">{item.product_name}</p>
                              <p className="text-sm text-gray-600">
                                Quantity: {item.quantity} × ₹
                                {item.price.toFixed(2)}
                              </p>
                            </div>
                            <p className="font-medium">
                              ₹{item.total.toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator className="my-4" />

                    {/* Order Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium mb-1">Payment Method</p>
                        <p className="text-gray-600 capitalize">
                          {order.payment_method || "Online Payment"}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium mb-1">Shipping Address</p>
                        {order.shipping_address ? (
                          <p className="text-gray-600">
                            {order.shipping_address.address_line1 || ""}
                            {order.shipping_address.city
                              ? `, ${order.shipping_address.city}`
                              : ""}
                            {order.shipping_address.state
                              ? `, ${order.shipping_address.state}`
                              : ""}
                            {order.shipping_address.pincode
                              ? ` - ${order.shipping_address.pincode}`
                              : ""}
                          </p>
                        ) : (
                          <p className="text-gray-600">
                            {order.customer_name}
                            <br />
                            {order.customer_phone}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Shipping & Tracking */}
                    {order.shiprocket_status && order.shiprocket_status !== "pending" && order.shiprocket_status !== "failed" && (
                      <>
                        <Separator className="my-4" />
                        <div className="space-y-3">
                          <h3 className="font-medium flex items-center gap-2">
                            <Truck className="h-4 w-4" />
                            Shipping Details
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            {order.shiprocket_courier_name && (
                              <div>
                                <p className="font-medium mb-1">Courier</p>
                                <p className="text-gray-600">{order.shiprocket_courier_name}</p>
                              </div>
                            )}
                            {order.shiprocket_awb && (
                              <div>
                                <p className="font-medium mb-1">AWB / Tracking Number</p>
                                <p className="text-gray-600 font-mono">{order.shiprocket_awb}</p>
                              </div>
                            )}
                            {order.shiprocket_order_id && (
                              <div>
                                <p className="font-medium mb-1">Shiprocket Order</p>
                                <p className="text-gray-600">#{order.shiprocket_order_id}</p>
                              </div>
                            )}
                          </div>

                          {/* Inline tracking */}
                          {order.shiprocket_awb && trackingOrderId === order.id && (
                            <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                              <OrderTracker initialWaybill={order.shiprocket_awb} />
                            </div>
                          )}
                        </div>
                      </>
                    )}

                    {/* Action Buttons */}
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Button
                        variant="outline"
                        onClick={() =>
                          router.push(
                            `/order-success?order_id=${order.cashfree_order_id}`
                          )
                        }
                        className="sm:w-auto"
                      >
                        View Details
                      </Button>
                      {order.shiprocket_awb && (
                        <Button
                          variant="outline"
                          onClick={() =>
                            setTrackingOrderId(
                              trackingOrderId === order.id ? null : order.id
                            )
                          }
                          className="sm:w-auto flex items-center gap-2"
                        >
                          <MapPin className="h-4 w-4" />
                          {trackingOrderId === order.id ? "Hide Tracking" : "Track Order"}
                        </Button>
                      )}
                      {order.shiprocket_awb && (
                        <Button
                          variant="ghost"
                          onClick={() =>
                            window.open(
                              `https://www.shiprocket.in/shipment-tracking/${order.shiprocket_awb}`,
                              "_blank"
                            )
                          }
                          className="sm:w-auto flex items-center gap-2 text-sm"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Track on Shiprocket
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
};

export default OrdersPage;
