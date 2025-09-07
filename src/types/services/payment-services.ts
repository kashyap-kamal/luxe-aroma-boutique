import type {
  OrderRequest,
  OrderResponse,
  PaymentVerification,
  OrderDetails,
  RazorpayOptions,
  RazorpayResponse,
  PaymentErrorResponse,
} from "@/types/razorpay";
import { PaymentStatus } from "@/types/razorpay";
import { toast } from "sonner";
import ky from "ky";

/**
 * Configuration for Razorpay
 * Uses environment variables for security
 */
const RAZORPAY_CONFIG = {
  keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
  testMode: process.env.RAZORPAY_TEST_MODE === "true",
  appName: process.env.NEXT_PUBLIC_APP_NAME || "Luxe Aroma Boutique",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:5173",
} as const;

/**
 * Utility function to convert rupees to paise
 * Razorpay expects amount in smallest currency unit
 * Handles floating point precision issues
 */
export const convertToPaise = (amount: number): number => {
  // Handle floating point precision by using parseFloat and toFixed
  const rupees = parseFloat(amount.toFixed(2));
  return Math.round(rupees * 100);
};

/**
 * Utility function to convert paise to rupees
 */
export const convertToRupees = (paise: number): number => {
  return paise / 100;
};

/**
 * Generate unique receipt ID for orders
 */
export const generateReceiptId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `ORDER_${timestamp}_${random}`;
};

/**
 * Validate environment configuration
 */
export const validateRazorpayConfig = (): boolean => {
  if (!RAZORPAY_CONFIG.keyId) {
    console.error("Razorpay Key ID not found in environment variables");
    return false;
  }
  return true;
};

/**
 * Create Razorpay order
 * This would typically be done on the server-side for security
 * For demo purposes, we're simulating the order creation
 */
export const createRazorpayOrder = async (
  amount: number,
  currency: string = "INR",
  receipt?: string,
): Promise<OrderResponse> => {
  try {
    // In production, this should be an API call to your backend
    // Your backend should create the order using Razorpay's server-side API

    // Simulated API response for demo

    const rpOrderResponse = await ky
      .post<OrderResponse>("/api/checkout", {
        json: {
          amount,
        },
      })
      .json();

    if (Object.hasOwn(rpOrderResponse, "error")) {
      throw new Error("Failed to create payment order. Please try again.");
    }

    return rpOrderResponse;
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    throw new Error("Failed to create payment order. Please try again.");
  }
};

/**
 * Initialize Razorpay payment
 * Opens the Razorpay checkout modal
 */
export const initializePayment = (
  orderData: OrderResponse,
  customerInfo: {
    name: string;
    email: string;
    contact: string;
  },
  onSuccess: (response: RazorpayResponse) => void,
  onError: (error: Error) => void,
  onDismiss?: () => void,
): void => {
  try {
    // Validate Razorpay configuration
    if (!validateRazorpayConfig()) {
      throw new Error("Razorpay configuration is invalid");
    }

    // Check if Razorpay is loaded
    if (typeof window.Razorpay === "undefined") {
      throw new Error("Razorpay SDK not loaded. Please refresh the page.");
    }

    const options: RazorpayOptions = {
      key: RAZORPAY_CONFIG.keyId,
      amount: orderData.amount,
      currency: orderData.currency,
      name: RAZORPAY_CONFIG.appName,
      description: "Purchase from Luxe Aroma Boutique",
      order_id: orderData.id,

      // Customer prefill information
      prefill: {
        name: customerInfo.name,
        email: customerInfo.email,
        contact: customerInfo.contact,
      },

      // Order notes
      notes: {
        ...orderData.notes,
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
      },

      // UI customization
      theme: {
        color: "#8B4513", // Brown theme matching the boutique
      },

      // Payment method preferences (UPI enabled)
      method: {
        upi: true,
        card: true,
        netbanking: true,
        wallet: true,
      },

      // Success handler
      handler: (response: RazorpayResponse) => {
        console.log("Payment successful:", response);
        onSuccess(response);
      },

      // Modal dismiss handler
      modal: {
        ondismiss: () => {
          console.log("Payment modal dismissed");
          if (onDismiss) {
            onDismiss();
          }
        },
      },
    };

    // Create and open Razorpay instance
    const razorpayInstance = new window.Razorpay(options);

    // Handle payment failures
    // @ts-ignore
    razorpayInstance.on("payment.failed", (response: PaymentErrorResponse) => {
      console.error("Payment failed:", response.error);
      onError(new Error("Payment failed. Please try again."));
    });

    // Open payment modal
    razorpayInstance.open();
  } catch (error) {
    console.error("Error initializing payment:", error);
    onError(
      error instanceof Error
        ? error
        : new Error("Payment initialization failed"),
    );
  }
};

/**
 * Verify payment signature
 * This should be done on the server-side for security
 * For demo purposes, we're simulating verification
 */
export const verifyPaymentSignature = async (
  paymentData: PaymentVerification,
): Promise<boolean> => {
  try {
    // In production, send this data to your backend for verification
    // Your backend should verify the signature using Razorpay's webhook secret

    console.log("Verifying payment signature:", paymentData);

    const res = await ky
      .post<{ success: boolean; error: string }>("/api/store-payment", {
        json: paymentData,
      })
      .json();

    if (res.error) {
      throw new Error(res.error);
    }

    return res.success;
  } catch (error) {
    console.error("Error verifying payment:", error);
    return false;
  }
};

/**
 * Save order details after successful payment
 * This would typically save to a database
 */
export const saveOrderDetails = async (
  orderDetails: OrderDetails,
): Promise<string> => {
  try {
    // In production, save to your database
    // For demo purposes, save to localStorage

    const orderId = `ORDER_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 8)}`;
    const orderWithId = { ...orderDetails, id: orderId };

    // Save to localStorage (for demo)
    const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    existingOrders.push(orderWithId);
    localStorage.setItem("orders", JSON.stringify(existingOrders));

    console.log("Order saved successfully:", orderWithId);
    return orderId;
  } catch (error) {
    console.error("Error saving order:", error);
    throw new Error("Failed to save order details");
  }
};

/**
 * Load Razorpay SDK dynamically
 * Ensures the SDK is loaded before payment initialization
 */
// export const loadRazorpaySDK = (retryCount: number = 0): Promise<void> => {
//   return new Promise((resolve, reject) => {
//     // Check if already loaded
//     if (typeof window.Razorpay !== "undefined") {
//       resolve();
//       return;
//     }
//
//     // Check if script is already being loaded
//     const existingScript = document.querySelector(
//       'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
//     );
//     if (existingScript) {
//       // Script is already being loaded, wait for it
//       existingScript.addEventListener("load", () => resolve());
//       existingScript.addEventListener("error", () => {
//         if (retryCount < 3) {
//           console.warn(
//             `Razorpay SDK load failed, retrying... (${retryCount + 1}/3)`,
//           );
//           // Remove failed script
//           existingScript.remove();
//           // Retry after delay
//           setTimeout(
//             () => {
//               loadRazorpaySDK(retryCount + 1)
//                 .then(resolve)
//                 .catch(reject);
//             },
//             1000 * (retryCount + 1),
//           );
//         } else {
//           reject(new Error("Failed to load Razorpay SDK after 3 attempts"));
//         }
//       });
//       return;
//     }
//
//     // Create script element
//     const script = document.createElement("script");
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.async = true;
//
//     // Handle successful load
//     script.onload = () => {
//       console.log("Razorpay SDK loaded successfully");
//       resolve();
//     };
//
//     // Handle load error with retry logic
//     script.onerror = () => {
//       console.error("Failed to load Razorpay SDK");
//       script.remove(); // Clean up failed script
//
//       if (retryCount < 3) {
//         console.warn(`Retrying Razorpay SDK load... (${retryCount + 1}/3)`);
//         setTimeout(
//           () => {
//             loadRazorpaySDK(retryCount + 1)
//               .then(resolve)
//               .catch(reject);
//           },
//           1000 * (retryCount + 1),
//         ); // Exponential backoff
//       } else {
//         reject(new Error("Failed to load Razorpay SDK after 3 attempts"));
//       }
//     };
//
//     // Append to document
//     document.head.appendChild(script);
//   });
// };

/**
 * Payment service class for managing payment operations
 */
export class PaymentService {
  private static instance: PaymentService;

  // Singleton pattern
  public static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  /**
   * Process payment with comprehensive error handling
   */
  public async processPayment(
    amount: number,
    customerInfo: {
      name: string;
      email: string;
      contact: string;
    },
    orderDetails: Omit<OrderDetails, "id" | "paymentStatus" | "orderDate">,
  ): Promise<{ success: boolean; orderId?: string; error?: string }> {
    try {
      // Step 1: Load Razorpay SDK
      // await loadRazorpaySDK();

      // Step 2: Create order
      const order = await createRazorpayOrder(amount);

      // Step 3: Initialize payment
      return new Promise((resolve) => {
        initializePayment(
          order,
          customerInfo,
          // Success handler
          async (response: RazorpayResponse) => {
            try {
              // Verify payment
              const isVerified = await verifyPaymentSignature({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              });

              if (isVerified) {
                // Save order details
                const completeOrderDetails: OrderDetails = {
                  ...orderDetails,
                  id: order.id,
                  paymentStatus: PaymentStatus.SUCCESS,
                  orderDate: new Date(),
                };

                const orderId = await saveOrderDetails(completeOrderDetails);
                resolve({ success: true, orderId });
              } else {
                resolve({
                  success: false,
                  error: "Payment verification failed",
                });
              }
            } catch (error) {
              console.error("Error in payment success handler:", error);
              resolve({
                success: false,
                error: "Failed to process successful payment",
              });
            }
          },
          // Error handler
          (error: Error) => {
            resolve({ success: false, error: error.message });
          },
          // Dismiss handler
          () => {
            resolve({ success: false, error: "Payment cancelled by user" });
          },
        );
      });
    } catch (error) {
      console.error("Error in payment process:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Payment process failed",
      };
    }
  }
}

// Export singleton instance
export const paymentService = PaymentService.getInstance();
