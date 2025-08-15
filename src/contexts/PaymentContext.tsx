/**
 * Payment Context for managing payment state
 * Provides payment functionality throughout the application
 */

"use client"

import React, { createContext, useContext, useState, useCallback } from "react"
import { paymentService } from "@/services/paymentService"
import type {
  OrderDetails,
  PaymentStatus,
  CustomerInfo,
} from "@/types/razorpay"

// Payment Context State Interface
interface PaymentState {
  isProcessing: boolean
  currentOrder: OrderDetails | null
  paymentStatus: PaymentStatus | null
  error: string | null
}

// Payment Context Interface
interface PaymentContextType extends PaymentState {
  // Payment operations
  processPayment: (
    amount: number,
    customerInfo: CustomerInfo,
    orderDetails: Omit<OrderDetails, "id" | "paymentStatus" | "orderDate">,
  ) => Promise<{ success: boolean; orderId?: string }>

  // State management
  clearPaymentState: () => void
  setPaymentError: (error: string | null) => void

  // Order management
  getOrderHistory: () => OrderDetails[]
  getOrderById: (orderId: string) => OrderDetails | null
}

// Create context
const PaymentContext = createContext<PaymentContextType | undefined>(undefined)

// Initial state
const initialState: PaymentState = {
  isProcessing: false,
  currentOrder: null,
  paymentStatus: null,
  error: null,
}

/**
 * Payment Provider Component
 * Wraps the application to provide payment functionality
 */
export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<PaymentState>(initialState)

  /**
   * Process payment with comprehensive error handling
   */
  const processPayment = useCallback(
    async (
      amount: number,
      customerInfo: CustomerInfo,
      orderDetails: Omit<OrderDetails, "id" | "paymentStatus" | "orderDate">,
    ): Promise<{ success: boolean; orderId?: string }> => {
      try {
        // Set processing state
        setState((prev) => ({
          ...prev,
          isProcessing: true,
          error: null,
          paymentStatus: null,
        }))

        // Validate input
        if (amount <= 0) {
          throw new Error("Invalid payment amount")
        }

        if (
          !customerInfo.email ||
          !customerInfo.firstName ||
          !customerInfo.phone
        ) {
          throw new Error("Customer information is incomplete")
        }

        // Prepare customer info for payment service
        const paymentCustomerInfo = {
          name: `${customerInfo.firstName} ${customerInfo.lastName}`.trim(),
          email: customerInfo.email,
          contact: customerInfo.phone,
        }

        // Process payment using the payment service
        const result = await paymentService.processPayment(
          amount,
          paymentCustomerInfo,
          orderDetails,
        )

        if (result.success && result.orderId) {
          // Update state with success
          setState((prev) => ({
            ...prev,
            isProcessing: false,
            paymentStatus: "success" as PaymentStatus,
            currentOrder: {
              ...orderDetails,
              id: result.orderId!,
              paymentStatus: "success" as PaymentStatus,
              orderDate: new Date(),
            },
            error: null,
          }))

          return { success: true, orderId: result.orderId }
        } else {
          // Handle payment failure
          const errorMessage = result.error || "Payment failed"
          setState((prev) => ({
            ...prev,
            isProcessing: false,
            paymentStatus: "failed" as PaymentStatus,
            error: errorMessage,
          }))

          return { success: false }
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Payment processing failed"

        // Update state with error
        setState((prev) => ({
          ...prev,
          isProcessing: false,
          paymentStatus: "failed" as PaymentStatus,
          error: errorMessage,
        }))

        console.error("Payment processing error:", error)
        return { success: false }
      }
    },
    [],
  )

  /**
   * Clear payment state
   */
  const clearPaymentState = useCallback(() => {
    setState(initialState)
  }, [])

  /**
   * Set payment error
   */
  const setPaymentError = useCallback((error: string | null) => {
    setState((prev) => ({
      ...prev,
      error,
    }))
  }, [])

  /**
   * Get order history from localStorage
   */
  const getOrderHistory = useCallback((): OrderDetails[] => {
    try {
      const orders = localStorage.getItem("orders")
      if (!orders) return []

      const parsedOrders = JSON.parse(orders)

      // Fix Date deserialization - convert date strings back to Date objects
      return parsedOrders.map((order: any) => ({
        ...order,
        orderDate: new Date(order.orderDate),
      }))
    } catch (error) {
      console.error("Error loading order history:", error)
      return []
    }
  }, [])

  /**
   * Get specific order by ID
   */
  const getOrderById = useCallback(
    (orderId: string): OrderDetails | null => {
      try {
        const orders = getOrderHistory()
        return orders.find((order) => order.id === orderId) || null
      } catch (error) {
        console.error("Error loading order:", error)
        return null
      }
    },
    [getOrderHistory],
  )

  // Context value
  const value: PaymentContextType = {
    // State
    ...state,

    // Operations
    processPayment,
    clearPaymentState,
    setPaymentError,

    // Order management
    getOrderHistory,
    getOrderById,
  }

  return (
    <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>
  )
}

/**
 * Custom hook to use payment context
 * Provides easy access to payment functionality
 */
export const usePayment = () => {
  const context = useContext(PaymentContext)
  if (context === undefined) {
    throw new Error("usePayment must be used within a PaymentProvider")
  }
  return context
}

/**
 * HOC to provide payment functionality to components
 */
export const withPayment = <P extends object>(
  Component: React.ComponentType<P>,
) => {
  return (props: P) => (
    <PaymentProvider>
      <Component {...props} />
    </PaymentProvider>
  )
}
