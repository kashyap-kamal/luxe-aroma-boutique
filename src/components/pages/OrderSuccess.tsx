/**
 * Order Success Page
 * Displays order confirmation after successful payment
 */

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { usePayment } from "@/contexts/PaymentContext"
import {
  CheckCircle,
  Package,
  Truck,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Download,
  ArrowLeft,
} from "lucide-react"
import type { OrderDetails } from "@/types/razorpay"

interface OrderSuccessProps {
  orderId: string;
}

const OrderSuccess: React.FC<OrderSuccessProps> = ({ orderId }) => {
  const router = useRouter()
  const { getOrderById } = usePayment()
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (orderId) {
      // Fetch order details
      const orderDetails = getOrderById(orderId)
      setOrder(orderDetails)
      setLoading(false)

      // If order not found, redirect to home
      if (!orderDetails) {
        setTimeout(() => {
          router.push("/")
        }, 3000)
      }
    } else {
      setLoading(false)
    }
  }, [orderId, getOrderById, navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brown-600 mx-auto mb-4"></div>
            <p>Loading order details...</p>
          </div>
        </main>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Order Not Found</h1>
            <p className="text-gray-600 mb-4">
              The order you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => router.push("/")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
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
                    We'll prepare your items within 1-2 business days
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
                }

                console.log("Receipt data:", receiptData)

                // In a real app, you would generate and download a PDF
                alert("Receipt feature will be implemented in the next update!")
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Receipt
            </Button>
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
    </div>
  )
}

export default OrderSuccess
