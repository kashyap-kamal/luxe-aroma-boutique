import { create, StateCreator } from "zustand";
import { OrderDetails, PaymentStatus, CustomerInfo } from "@/types/razorpay";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { paymentService } from "@/types/services/payment-services";

export interface PaymentState {
  isProcessing: boolean;
  currentOrder: OrderDetails | null;
  paymentStatus: PaymentStatus | null;
  error: string | null;
}

// Payment Context Interface
interface PaymentStoreType extends PaymentState {
  // Payment operations
  processPayment: (
    amount: number,
    customerInfo: CustomerInfo,
    orderDetails: Omit<OrderDetails, "id" | "paymentStatus" | "orderDate">
  ) => Promise<{ success: boolean; orderId?: string }>;

  // State management
  clearPaymentState: () => void;
  setPaymentError: (error: string | null) => void;

  // Order management
  getOrderHistory: () => OrderDetails[];
  getOrderById: (orderId: string) => OrderDetails | null;
}

const createPaymentStore: StateCreator<
  PaymentStoreType,
  [["zustand/persist", unknown], ["zustand/immer", never]]
> = (set, get, store) => ({
  isProcessing: false,
  currentOrder: null,
  paymentStatus: null,
  error: null,
  processPayment: async (
    amount: number,
    customerInfo: CustomerInfo,
    orderDetails: Omit<OrderDetails, "id" | "paymentStatus" | "orderDate">
  ): Promise<{ success: boolean; orderId?: string }> => {
    set((s) => {
      s.isProcessing = true;
      s.error = null;
      s.paymentStatus = null;
    });

    try {
      // validate
      if (amount <= 0) throw new Error("Invalid payment amount");
      if (
        !customerInfo.email ||
        !customerInfo.firstName ||
        !customerInfo.phone
      ) {
        throw new Error("Customer information is incomplete");
      }

      const paymentCustomerInfo = {
        name: `${customerInfo.firstName} ${customerInfo.lastName ?? ""}`.trim(),
        email: customerInfo.email,
        contact: customerInfo.phone,
      };

      // call service
      const result = await paymentService.processPayment(
        amount,
        paymentCustomerInfo,
        orderDetails
      );

      if (result.success && result.orderId) {
        set((s) => {
          s.isProcessing = false;
          s.paymentStatus = PaymentStatus.SUCCESS;
          s.currentOrder = {
            ...orderDetails,
            id: result.orderId!,
            paymentStatus: PaymentStatus.SUCCESS,
            orderDate: new Date(),
          };
          s.error = null;
        });
        return { success: true, orderId: result.orderId };
      } else {
        const errorMessage = result.error || "Payment failed";
        set((s) => {
          s.isProcessing = false;
          s.paymentStatus = PaymentStatus.FAILED;
          s.error = errorMessage;
        });
        return { success: false };
      }
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Payment processing failed";
      set((s) => {
        s.isProcessing = false;
        s.paymentStatus = PaymentStatus.FAILED;
        s.error = msg;
      });
      console.error("Payment processing error:", err);
      return { success: false };
    }
  },
  clearPaymentState: () => {
    set(store.getInitialState(), true);
  },
  setPaymentError: (error) => {
    set((s) => {
      s.error = error;
    });
  },
  getOrderHistory: () => {
    try {
      const orders = localStorage.getItem("orders");
      if (!orders) return [];

      const parsedOrders = JSON.parse(orders);

      // Fix Date deserialization - convert date strings back to Date objects
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return parsedOrders.map((order: any) => ({
        ...order,
        orderDate: new Date(order.orderDate),
      }));
    } catch (error) {
      console.error("Error loading order history:", error);
      return [];
    }
  },
  getOrderById: (orderId) => {
    try {
      const orders = get().getOrderHistory();
      return orders.find((order) => order.id === orderId) || null;
    } catch (error) {
      console.error("Error loading order:", error);
      return null;
    }
  },
});

export const usePaymentStore = create<PaymentStoreType>()(
  persist(immer(createPaymentStore), {
    name: "payment-store",
    storage: createJSONStorage(() => sessionStorage),
  })
);
