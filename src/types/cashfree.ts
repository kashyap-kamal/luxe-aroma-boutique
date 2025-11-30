/**
 * Cashfree TypeScript Interfaces
 * Provides type safety for Cashfree One Click Checkout integration
 * Based on Cashfree API documentation: https://www.cashfree.com/docs/payments/checkout/one-click-checkout
 */

// Cashfree Order Creation Request Interface
export interface CashfreeOrderRequest {
  order_amount: number; // Amount in smallest currency unit (paise for INR)
  order_currency: string; // Currency code (e.g., "INR")
  customer_details: {
    customer_id: string; // Unique customer identifier
    customer_name: string;
    customer_email: string;
    customer_phone: string;
  };
  order_meta: {
    return_url: string; // URL to redirect after payment
    notify_url?: string; // Webhook URL for payment notifications
  };
  products?: {
    one_click_checkout?: {
      enabled: boolean;
      conditions?: Array<{
        action: "ALLOW" | "DENY";
        values: string[];
        key: "features";
      }>;
    };
  };
  cart_details: {
    cart_items: CashfreeCartItem[];
  };
}

// Cart Item Interface for Cashfree
export interface CashfreeCartItem {
  item_id: string;
  item_name: string;
  item_description?: string;
  item_details_url?: string;
  item_image_url?: string;
  item_original_unit_price: number; // Price in smallest currency unit
  item_discounted_unit_price: number; // Discounted price in smallest currency unit
  item_quantity: number;
  item_currency: string;
}

// Cashfree Order Response Interface
export interface CashfreeOrderResponse {
  order_id: string;
  order_token: string;
  payment_session_id: string;
  order_amount: number;
  order_currency: string;
  order_status: string;
  payment_session_id_expiry: string;
}

// Cashfree Payment Status Response
export interface CashfreePaymentStatus {
  order_id: string;
  order_amount: number;
  order_currency: string;
  order_status: "PAID" | "ACTIVE" | "EXPIRED";
  payment_session_id: string;
  payment_details?: {
    payment_method: string;
    payment_status: string;
    payment_message: string;
    payment_amount: number;
    payment_currency: string;
    payment_time: string;
    payment_id?: string;
  };
  customer_details?: {
    customer_id: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
  };
  shipping_address?: {
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  billing_address?: {
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
}

// Cashfree Checkout Options Interface
export interface CashfreeCheckoutOptions {
  paymentSessionId: string;
  redirectTarget?: "_self" | "_blank";
  onSuccess?: (response: CashfreePaymentStatus) => void;
  onFailure?: (error: Error) => void;
  onExit?: () => void; // Callback when user exits/cancels checkout
}

// Payment Status Enum (keeping same as before for compatibility)
export enum PaymentStatus {
  PENDING = "pending",
  SUCCESS = "success",
  FAILED = "failed",
  CANCELLED = "cancelled",
}

// Order Details Interface (keeping same structure for compatibility)
export interface OrderDetails {
  id: string;
  customerInfo: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  orderDate: Date;
  notes?: string;
}

// Customer Information Interface
export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

// Order Item Interface
export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  total: number;
}

// Cashfree Window Interface (for global Cashfree object)
declare global {
  interface Window {
    Cashfree: (config: { mode: "production" | "sandbox" }) => {
      checkout: (options: CashfreeCheckoutOptions) => void;
    };
  }
}





