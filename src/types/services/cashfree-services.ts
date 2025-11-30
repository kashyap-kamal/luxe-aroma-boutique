/**
 * Cashfree Payment Service
 * Handles all Cashfree One Click Checkout operations
 * Uses Supabase for backend logic and secure API key storage
 */

import type {
  CashfreeOrderRequest,
  CashfreeOrderResponse,
  CashfreePaymentStatus,
  CashfreeCheckoutOptions,
  OrderDetails,
  PaymentStatus,
} from "@/types/cashfree";
import ky from "ky";

/**
 * Configuration for Cashfree
 * Uses environment variables for security
 * NOTE: Secret key is NEVER exposed to frontend - all API calls use Supabase Edge Functions
 */
const CASHFREE_CONFIG = {
  // Only client ID is public (safe to expose)
  clientId: process.env.NEXT_PUBLIC_CASHFREE_CLIENT_ID || "",
  environment: (process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT || "sandbox") as "sandbox" | "production",
  appName: process.env.NEXT_PUBLIC_APP_NAME || "Aromé Luxe",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
} as const;

/**
 * Get Cashfree API base URL based on environment
 */
const getCashfreeApiUrl = (): string => {
  return CASHFREE_CONFIG.environment === "production"
    ? "https://api.cashfree.com"
    : "https://sandbox.cashfree.com";
};

/**
 * Validate Cashfree configuration
 * Note: Client ID is optional - not needed since we use Supabase Edge Functions
 * Only environment is needed for SDK initialization (has default: "sandbox")
 */
export const validateCashfreeConfig = (): boolean => {
  // Client ID is not required - we use Supabase Edge Functions for all API calls
  // Environment has a default value, so validation always passes
  // Only Supabase config is validated in the actual API calls
  return true;
};

/**
 * Convert rupees to paise (smallest currency unit)
 * Cashfree expects amount in smallest currency unit
 */
export const convertToPaise = (amount: number): number => {
  const rupees = parseFloat(amount.toFixed(2));
  return Math.round(rupees * 100);
};

/**
 * Convert paise to rupees
 */
export const convertToRupees = (paise: number): number => {
  return paise / 100;
};

/**
 * Create Cashfree order
 * This calls our backend API which securely creates the order using Cashfree API
 */
export const createCashfreeOrder = async (
  amount: number,
  customerInfo: {
    name: string;
    email: string;
    contact: string;
  },
  cartItems: Array<{
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    imageUrl?: string;
  }>,
  returnUrl: string
): Promise<CashfreeOrderResponse> => {
  try {
    // Validate Supabase configuration (required for Edge Function calls)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Supabase configuration is missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY");
    }

    // Call Supabase Edge Function to create order
    // Supabase securely handles Cashfree API calls with API keys stored in secrets
    // Note: Cashfree client ID is NOT needed here - all API calls go through Supabase

    const response = await ky
      .post<CashfreeOrderResponse>(
        `${supabaseUrl}/functions/v1/create-cashfree-order`,
        {
          headers: {
            Authorization: `Bearer ${supabaseAnonKey}`,
            "Content-Type": "application/json",
          },
          json: {
            amount,
            customerInfo,
            cartItems,
            returnUrl,
          },
        }
      )
      .json();

    if (!response.order_id || !response.payment_session_id) {
      throw new Error("Failed to create payment order. Invalid response.");
    }

    return response;
  } catch (error) {
    console.error("Error creating Cashfree order:", error);
    throw new Error("Failed to create payment order. Please try again.");
  }
};

/**
 * Initialize Cashfree payment checkout
 * Opens the Cashfree checkout page
 */
export const initializeCashfreeCheckout = (
  paymentSessionId: string,
  onSuccess?: (response: CashfreePaymentStatus) => void,
  onFailure?: (error: Error) => void
): void => {
  try {
    // Check if Cashfree SDK is loaded
    if (typeof window.Cashfree === "undefined") {
      throw new Error("Cashfree SDK not loaded. Please refresh the page.");
    }

    // Initialize Cashfree instance
    // Only environment mode is needed (has default: "sandbox")
    // Client ID is not required - payment session ID is sufficient
    const cashfree = window.Cashfree({
      mode: CASHFREE_CONFIG.environment, // Defaults to "sandbox" if not set
    });

    // Configure checkout options
    const checkoutOptions: CashfreeCheckoutOptions = {
      paymentSessionId,
      redirectTarget: "_self", // Open in same window
      onSuccess: (response) => {
        console.log("Payment successful:", response);
        if (onSuccess) {
          onSuccess(response);
        }
      },
      onFailure: (error) => {
        console.error("Payment failed or cancelled:", error);
        // Redirect back to checkout page on failure/cancel
        if (typeof window !== "undefined") {
          // Clean up session storage
          sessionStorage.removeItem("pending_cashfree_order_id");
          sessionStorage.removeItem("pending_cashfree_session_id");
          sessionStorage.removeItem("pending_order_details");
          // Redirect to checkout page
          window.location.href = `${CASHFREE_CONFIG.appUrl}/checkout?payment=cancelled`;
        }
        if (onFailure) {
          onFailure(error);
        }
      },
      // Handle user exit/cancel from Cashfree UI
      onExit: () => {
        console.log("User exited Cashfree checkout");
        // Redirect back to checkout page when user exits
        if (typeof window !== "undefined") {
          // Clean up session storage
          sessionStorage.removeItem("pending_cashfree_order_id");
          sessionStorage.removeItem("pending_cashfree_session_id");
          sessionStorage.removeItem("pending_order_details");
          // Redirect to checkout page
          window.location.href = `${CASHFREE_CONFIG.appUrl}/checkout?payment=cancelled`;
        }
      },
    };

    // Open Cashfree checkout
    cashfree.checkout(checkoutOptions);
  } catch (error) {
    console.error("Error initializing Cashfree checkout:", error);
    if (onFailure) {
      onFailure(
        error instanceof Error
          ? error
          : new Error("Payment initialization failed")
      );
    }
  }
};

/**
 * Verify payment status
 * Calls backend API to verify payment with Cashfree
 */
export const verifyPaymentStatus = async (
  orderId: string
): Promise<CashfreePaymentStatus> => {
  try {
    // Call Supabase Edge Function to verify payment
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Supabase configuration is missing");
    }

    const response = await ky
      .post<{ success: boolean; data?: CashfreePaymentStatus; error?: string }>(
        `${supabaseUrl}/functions/v1/verify-cashfree-payment`,
        {
          headers: {
            Authorization: `Bearer ${supabaseAnonKey}`,
            "Content-Type": "application/json",
          },
          json: { orderId },
        }
      )
      .json();

    if (!response.success || !response.data) {
      throw new Error(response.error || "Payment verification failed");
    }

    return response.data;
  } catch (error) {
    console.error("Error verifying payment:", error);
    throw new Error("Failed to verify payment status");
  }
};

/**
 * Load Cashfree SDK dynamically
 * Ensures the SDK is loaded before payment initialization
 */
export const loadCashfreeSDK = (retryCount: number = 0): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (typeof window.Cashfree !== "undefined") {
      resolve();
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector(
      'script[src="https://sdk.cashfree.com/js/v3/cashfree.js"]'
    );
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve());
      existingScript.addEventListener("error", () => {
        if (retryCount < 3) {
          console.warn(
            `Cashfree SDK load failed, retrying... (${retryCount + 1}/3)`
          );
          existingScript.remove();
          setTimeout(
            () => {
              loadCashfreeSDK(retryCount + 1)
                .then(resolve)
                .catch(reject);
            },
            1000 * (retryCount + 1)
          );
        } else {
          reject(new Error("Failed to load Cashfree SDK after 3 attempts"));
        }
      });
      return;
    }

    // Create script element
    const script = document.createElement("script");
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.async = true;

    // Handle successful load
    script.onload = () => {
      console.log("Cashfree SDK loaded successfully");
      resolve();
    };

    // Handle load error with retry logic
    script.onerror = () => {
      console.error("Failed to load Cashfree SDK");
      script.remove();

      if (retryCount < 3) {
        console.warn(`Retrying Cashfree SDK load... (${retryCount + 1}/3)`);
        setTimeout(
          () => {
            loadCashfreeSDK(retryCount + 1)
              .then(resolve)
              .catch(reject);
          },
          1000 * (retryCount + 1)
        );
      } else {
        reject(new Error("Failed to load Cashfree SDK after 3 attempts"));
      }
    };

    // Append to document
    document.head.appendChild(script);
  });
};

/**
 * Payment service class for managing payment operations
 */
export class CashfreePaymentService {
  private static instance: CashfreePaymentService;

  // Singleton pattern
  public static getInstance(): CashfreePaymentService {
    if (!CashfreePaymentService.instance) {
      CashfreePaymentService.instance = new CashfreePaymentService();
    }
    return CashfreePaymentService.instance;
  }

  /**
   * Process payment with comprehensive error handling
   * Note: With redirectTarget: "_self", Cashfree redirects the page, so we don't wait for Promise resolution
   * The payment result is handled via the return URL redirect
   */
  public async processPayment(
    amount: number,
    customerInfo: {
      name: string;
      email: string;
      contact: string;
    },
    orderDetails: Omit<OrderDetails, "id" | "paymentStatus" | "orderDate">,
    cartItems: Array<{
      productId: string;
      productName: string;
      price: number;
      quantity: number;
      imageUrl?: string;
    }>
  ): Promise<{ success: boolean; orderId?: string; error?: string }> {
    try {
      // Step 1: Load Cashfree SDK
      await loadCashfreeSDK();

      // Step 2: Create order
      // Use query parameter instead of dynamic route for static export compatibility
      const returnUrl = `${CASHFREE_CONFIG.appUrl}/order-success?order_id={order_id}`;
      const order = await createCashfreeOrder(
        amount,
        customerInfo,
        cartItems,
        returnUrl
      );

      // Step 3: Store order ID in sessionStorage for use after redirect
      // This allows us to track the order even after Cashfree redirects the page
      if (typeof window !== "undefined") {
        sessionStorage.setItem("pending_cashfree_order_id", order.order_id);
        sessionStorage.setItem("pending_cashfree_session_id", order.payment_session_id);
      }

      // Step 4: Initialize payment checkout
      // With redirectTarget: "_self", Cashfree will redirect the entire page
      // We don't wait for Promise resolution - the redirect happens immediately
      initializeCashfreeCheckout(
        order.payment_session_id,
        // Success handler (may not be called if redirect happens immediately)
        async (response: CashfreePaymentStatus) => {
          console.log("Payment success callback:", response);
          // This callback may not execute if page redirects immediately
        },
        // Error handler
        (error: Error) => {
          console.error("Payment error callback:", error);
          // Remove pending order on error
          if (typeof window !== "undefined") {
            sessionStorage.removeItem("pending_cashfree_order_id");
            sessionStorage.removeItem("pending_cashfree_session_id");
          }
        }
      );

      // Return immediately - don't wait for checkout to complete
      // The actual payment result will be handled via the return URL
      return {
        success: true,
        orderId: order.order_id,
      };
    } catch (error) {
      console.error("Error in payment process:", error);
      // Clean up on error
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("pending_cashfree_order_id");
        sessionStorage.removeItem("pending_cashfree_session_id");
      }
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Payment process failed",
      };
    }
  }
}

// Export singleton instance
export const cashfreePaymentService = CashfreePaymentService.getInstance();

