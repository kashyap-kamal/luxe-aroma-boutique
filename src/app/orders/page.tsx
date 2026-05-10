"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useUser } from "@/stores/auth-store";
import { supabase } from "@/lib/supabase";
import {
  Package,
  ArrowLeft,
  CheckCircle2,
  Clock,
  MapPin,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import OrderTracker from "@/components/order-tracker";

const INK = "#0E0E0C";
const CREAM = "#F2EDE4";
const SAFFRON = "#E8763A";
const DARK = "#1A0908";

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
  shiprocket_status: string | null;
  shiprocket_awb: string | null;
  shiprocket_courier_name: string | null;
  shiprocket_order_id: string | null;
  created_at: string;
}

const SHIPPING_LABELS: Record<string, { label: string; color: string }> = {
  created: { label: "Order Created", color: "#1D4ED8" },
  pickup_scheduled: { label: "Pickup Scheduled", color: "#1D4ED8" },
  picked_up: { label: "Picked Up", color: "#6D28D9" },
  dispatched: { label: "Dispatched", color: "#D97706" },
  in_transit: { label: "In Transit", color: "#D97706" },
  out_for_delivery: { label: "Out for Delivery", color: SAFFRON },
  delivered: { label: "Delivered", color: "#15803D" },
  failed: { label: "Shipment Failed", color: "#DC2626" },
  rto: { label: "Returned", color: "#DC2626" },
};

const OrdersPage = () => {
  const user = useUser();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.email) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    supabase
      .from("orders")
      .select("*")
      .eq("customer_email", user.email)
      .in("order_status", ["PAID", "SHIPPED", "DELIVERED"])
      .order("created_at", { ascending: false })
      .then(({ data, error: err }) => {
        if (err) setError("Failed to load orders. Please try again.");
        else setOrders(data || []);
        setLoading(false);
      });
  }, [user?.email]);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });

  const formatTime = (dateString: string) =>
    new Date(dateString).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  return (
    <ProtectedRoute>
      <main style={{ background: CREAM, color: INK, minHeight: "100vh" }}>
        {/* Hero */}
        <section style={{ background: DARK, color: CREAM, paddingTop: 80, paddingBottom: 48, borderBottom: `1px solid ${INK}` }} className="px-5 md:px-12">
          <div className="max-w-5xl mx-auto">
            <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.5, marginBottom: 20 }}>
              ACCOUNT / MY ORDERS
            </div>
            <h1 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 300, lineHeight: 0.9, letterSpacing: "-0.03em", margin: 0 }}>
              Your <em style={{ color: SAFFRON }}>orders.</em>
            </h1>
          </div>
        </section>

        {/* Content */}
        <section style={{ paddingTop: 40, paddingBottom: 80 }} className="px-5 md:px-12">
          <div className="max-w-5xl mx-auto">
            <Link
              href="/"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: INK, textDecoration: "none", marginBottom: 32, opacity: 0.6 }}
            >
              <ArrowLeft style={{ width: 12, height: 12 }} />
              Back to Home
            </Link>

            {/* Loading */}
            {loading && (
              <div style={{ padding: "80px 0", textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.5 }}>LOADING ORDERS...</div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div style={{ padding: "20px 24px", border: `1px solid rgba(220,38,38,0.3)`, background: "rgba(220,38,38,0.05)", marginBottom: 24, fontFamily: "var(--font-inter), sans-serif", fontSize: 14, color: "#991b1b" }}>
                {error}
              </div>
            )}

            {/* Empty */}
            {!loading && !error && orders.length === 0 && (
              <div style={{ paddingTop: 80, paddingBottom: 80, textAlign: "center", border: `1px solid ${INK}` }} className="px-5 md:px-12">
                <Package style={{ width: 48, height: 48, marginBottom: 20, opacity: 0.2 }} />
                <h2 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "1.8rem", fontWeight: 300, marginBottom: 12 }}>No orders yet.</h2>
                <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 14, color: "#3A3833", marginBottom: 32 }}>
                  You haven&apos;t placed any orders. Start exploring our collection.
                </p>
                <button
                  onClick={() => router.push("/products")}
                  style={{ background: INK, color: CREAM, border: "none", padding: "16px 28px", fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer" }}
                >
                  BROWSE COLLECTION →
                </button>
              </div>
            )}

            {/* Orders list */}
            {!loading && !error && orders.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {/* Table header — desktop */}
                <div className="hidden md:grid" style={{ gridTemplateColumns: "1fr 160px 120px 120px 48px", borderBottom: `2px solid ${INK}`, padding: "8px 0", marginBottom: 0 }}>
                  {["ORDER", "DATE", "AMOUNT", "STATUS", ""].map((h) => (
                    <div key={h} style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.5, padding: "0 16px" }}>{h}</div>
                  ))}
                </div>

                {orders.map((order) => {
                  const isExpanded = expandedOrderId === order.id;
                  const isTracking = trackingOrderId === order.id;
                  const shipStatus = SHIPPING_LABELS[order.shiprocket_status || ""] || null;
                  const isPaid = order.payment_status === "SUCCESS" || order.order_status === "PAID";

                  return (
                    <div key={order.id} style={{ borderBottom: `1px solid rgba(14,14,12,0.12)` }}>
                      {/* Row */}
                      <div
                        className="hidden md:grid"
                        style={{ gridTemplateColumns: "1fr 160px 120px 120px 48px", alignItems: "center", padding: "20px 0", cursor: "pointer", background: isExpanded ? "rgba(14,14,12,0.03)" : "transparent" }}
                        onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                      >
                        <div style={{ padding: "0 16px" }}>
                          <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 12, letterSpacing: "0.05em", marginBottom: 4 }}>#{order.cashfree_order_id}</div>
                          <div style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 12, color: "#3A3833", opacity: 0.7 }}>
                            {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                          </div>
                        </div>
                        <div style={{ padding: "0 16px", fontFamily: "var(--font-inter), sans-serif", fontSize: 13, color: "#3A3833" }}>
                          {formatDate(order.created_at)}<br />
                          <span style={{ fontSize: 11, opacity: 0.6 }}>{formatTime(order.created_at)}</span>
                        </div>
                        <div style={{ padding: "0 16px", fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 13 }}>
                          ₹{order.order_amount.toFixed(0)}
                        </div>
                        <div style={{ padding: "0 16px" }}>
                          <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", padding: "4px 8px", background: isPaid ? "rgba(21,128,61,0.08)" : "rgba(14,14,12,0.06)", color: isPaid ? "#15803D" : "#3A3833", border: `1px solid ${isPaid ? "rgba(21,128,61,0.25)" : "rgba(14,14,12,0.15)"}`, display: "inline-flex", alignItems: "center", gap: 4 }}>
                            {isPaid ? <><CheckCircle2 style={{ width: 8, height: 8 }} />PAID</> : <><Clock style={{ width: 8, height: 8 }} />PENDING</>}
                          </span>
                          {shipStatus && (
                            <div style={{ marginTop: 6, fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: shipStatus.color }}>{shipStatus.label}</div>
                          )}
                        </div>
                        <div style={{ padding: "0 16px", display: "flex", justifyContent: "center" }}>
                          {isExpanded ? <ChevronUp style={{ width: 14, height: 14, opacity: 0.4 }} /> : <ChevronDown style={{ width: 14, height: 14, opacity: 0.4 }} />}
                        </div>
                      </div>

                      {/* Mobile row */}
                      <div
                        className="flex md:hidden"
                        style={{ padding: "20px 0", cursor: "pointer", flexDirection: "column", gap: 8, background: isExpanded ? "rgba(14,14,12,0.03)" : "transparent" }}
                        onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div>
                            <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 12, letterSpacing: "0.05em", marginBottom: 4 }}>#{order.cashfree_order_id}</div>
                            <div style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 12, color: "#3A3833", opacity: 0.7 }}>{order.items.length} item{order.items.length !== 1 ? "s" : ""} · {formatDate(order.created_at)}</div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 13 }}>₹{order.order_amount.toFixed(0)}</span>
                            {isExpanded ? <ChevronUp style={{ width: 14, height: 14, opacity: 0.4 }} /> : <ChevronDown style={{ width: 14, height: 14, opacity: 0.4 }} />}
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", padding: "3px 8px", background: isPaid ? "rgba(21,128,61,0.08)" : "rgba(14,14,12,0.06)", color: isPaid ? "#15803D" : "#3A3833", border: `1px solid ${isPaid ? "rgba(21,128,61,0.25)" : "rgba(14,14,12,0.15)"}` }}>
                            {isPaid ? "PAID" : "PENDING"}
                          </span>
                          {shipStatus && (
                            <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: shipStatus.color }}>{shipStatus.label}</span>
                          )}
                        </div>
                      </div>

                      {/* Expanded details */}
                      {isExpanded && (
                        <div style={{ padding: "24px 0 32px", borderTop: `1px solid rgba(14,14,12,0.08)`, display: "flex", flexDirection: "column", gap: 24 }}>
                          {/* Items */}
                          <div>
                            <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.5, marginBottom: 12 }}>ORDER ITEMS</div>
                            {order.items.map((item, i) => (
                              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: i < order.items.length - 1 ? `1px solid rgba(14,14,12,0.07)` : "none" }}>
                                <div>
                                  <div style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 14, marginBottom: 3 }}>{item.product_name}</div>
                                  <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 11, opacity: 0.5 }}>{item.quantity} × ₹{item.price.toFixed(0)}</div>
                                </div>
                                <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 13 }}>₹{item.total.toFixed(0)}</div>
                              </div>
                            ))}
                            <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 0 0", marginTop: 4, borderTop: `1px solid rgba(14,14,12,0.15)` }}>
                              <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase" }}>TOTAL</span>
                              <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 14 }}>₹{order.order_amount.toFixed(0)}</span>
                            </div>
                          </div>

                          {/* Shipping address + payment */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {order.shipping_address && (
                              <div>
                                <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.5, marginBottom: 10 }}>SHIPPING ADDRESS</div>
                                <div style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, lineHeight: 1.65, color: "#3A3833" }}>
                                  {order.shipping_address.address_line1 && <>{order.shipping_address.address_line1}<br /></>}
                                  {[order.shipping_address.city, order.shipping_address.state].filter(Boolean).join(", ")}
                                  {order.shipping_address.pincode && <> — {order.shipping_address.pincode}</>}
                                </div>
                              </div>
                            )}
                            <div>
                              <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.5, marginBottom: 10 }}>PAYMENT</div>
                              <div style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, color: "#3A3833", textTransform: "capitalize" }}>
                                {order.payment_method || "Online Payment"}
                              </div>
                            </div>
                          </div>

                          {/* Shipping / tracking */}
                          {order.shiprocket_status && !["pending", "failed"].includes(order.shiprocket_status) && (
                            <div>
                              <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.5, marginBottom: 12 }}>SHIPPING DETAILS</div>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" style={{ marginBottom: 16 }}>
                                {order.shiprocket_courier_name && (
                                  <div>
                                    <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", opacity: 0.5, marginBottom: 4 }}>COURIER</div>
                                    <div style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13 }}>{order.shiprocket_courier_name}</div>
                                  </div>
                                )}
                                {order.shiprocket_awb && (
                                  <div>
                                    <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", opacity: 0.5, marginBottom: 4 }}>AWB NUMBER</div>
                                    <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 12 }}>{order.shiprocket_awb}</div>
                                  </div>
                                )}
                                {order.shiprocket_order_id && (
                                  <div>
                                    <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", opacity: 0.5, marginBottom: 4 }}>SHIPROCKET ID</div>
                                    <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 12 }}>#{order.shiprocket_order_id}</div>
                                  </div>
                                )}
                              </div>

                              {order.shiprocket_awb && isTracking && (
                                <div style={{ marginBottom: 16, padding: "20px 24px", background: "rgba(14,14,12,0.03)", border: `1px solid rgba(14,14,12,0.1)` }}>
                                  <OrderTracker initialWaybill={order.shiprocket_awb} />
                                </div>
                              )}
                            </div>
                          )}

                          {/* Action buttons */}
                          <div style={{ display: "flex", gap: 0, flexWrap: "wrap" }}>
                            <button
                              onClick={() => router.push(`/order-success?order_id=${order.cashfree_order_id}`)}
                              style={{ background: INK, color: CREAM, border: "none", padding: "14px 24px", fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}
                            >
                              VIEW RECEIPT
                            </button>
                            {order.shiprocket_awb && (
                              <button
                                onClick={() => setTrackingOrderId(isTracking ? null : order.id)}
                                style={{ background: "transparent", color: INK, border: `1px solid ${INK}`, borderLeft: "none", padding: "14px 24px", fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                              >
                                <MapPin style={{ width: 11, height: 11 }} />
                                {isTracking ? "HIDE TRACKING" : "TRACK ORDER"}
                              </button>
                            )}
                            {order.shiprocket_awb && (
                              <a
                                href={`https://www.shiprocket.in/shipment-tracking/${order.shiprocket_awb}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ background: "transparent", color: "#3A3833", border: `1px solid rgba(14,14,12,0.2)`, borderLeft: "none", padding: "14px 20px", fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}
                              >
                                <ExternalLink style={{ width: 11, height: 11 }} />
                                SHIPROCKET
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
    </ProtectedRoute>
  );
};

export default OrdersPage;
