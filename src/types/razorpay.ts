/**
 * Razorpay TypeScript Interfaces
 * Provides type safety for Razorpay integration
 */

// Razorpay Payment Options Interface
export interface RazorpayOptions {
  key: string
  amount: number // Amount in smallest currency unit (paise)
  currency: string
  name: string
  description: string
  order_id: string
  handler: (response: RazorpayResponse) => void
  prefill: {
    name: string
    email: string
    contact: string
  }
  notes: Record<string, string>
  theme: {
    color: string
  }
  modal: {
    ondismiss: () => void
  }
  method?: {
    upi?: boolean
    card?: boolean
    netbanking?: boolean
    wallet?: boolean
  }
}

// Razorpay Response Interface
export interface RazorpayResponse {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

// Order Creation Interface
export interface OrderRequest {
  amount: number // Amount in paise
  currency: string
  receipt: string
  notes?: Record<string, string>
}

// Order Response Interface
export interface OrderResponse {
  id: string
  entity: string
  amount: number
  amount_paid: number
  amount_due: number
  currency: string
  receipt: string
  status: string
  attempts: number
  notes: Record<string, string>
  created_at: number
}

// Payment Verification Interface
export interface PaymentVerification {
  orderId: string
  paymentId: string
  signature: string
}

// Payment Status Enum
export enum PaymentStatus {
  PENDING = "pending",
  SUCCESS = "success",
  FAILED = "failed",
  CANCELLED = "cancelled",
}

// Order Details Interface
export interface OrderDetails {
  id: string
  customerInfo: CustomerInfo
  items: OrderItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  paymentMethod: string
  paymentStatus: PaymentStatus
  orderDate: Date
  notes?: string
}

// Customer Information Interface
export interface CustomerInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  postalCode: string
  country: string
}

// Order Item Interface
export interface OrderItem {
  productId: string
  productName: string
  price: number
  quantity: number
  total: number
}

// Payment Error Response Interface
export interface PaymentErrorResponse {
  error: {
    code: string
    description: string
    source: string
    step: string
    reason: string
    metadata: Record<string, unknown>
  }
}

// Razorpay Window Interface (for global Razorpay object)
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open(): void
      on(
        event: string,
        handler: (response?: PaymentErrorResponse) => void,
      ): void
    }
  }
}
