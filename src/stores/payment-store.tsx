import { create, StateCreator } from "zustand";
import { OrderDetails, PaymentStatus, CustomerInfo } from "@/types/cashfree";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { cashfreePaymentService } from "@/types/services/cashfree-services";
import { orderManager } from "@/lib/order-management";

export interface PaymentState {
  isProcessing: boolean;
  currentOrder: OrderDetails | null;
  paymentStatus: PaymentStatus | null;
  error: string | null;
}

export interface ProcessPaymentExtras {
  bundleItems?: Array<{ bundleId: string; quantity: number }>;
  couponCode?: string | null;
  shiprocketPrepaid?: number;
}

interface PaymentStoreType extends PaymentState {
  processPayment: (
    amount: number,
    customerInfo: CustomerInfo,
    orderDetails: Omit<OrderDetails, "id" | "paymentStatus" | "orderDate">,
    extras?: ProcessPaymentExtras
  ) => Promise<{ success: boolean; orderId?: string }>;
  markOrderPaid: (orderId: string, verifiedOrder?: OrderDetails) => void;
  clearPaymentState: () => void;
  setPaymentError: (error: string | null) => void;
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
    orderDetails: Omit<OrderDetails, "id" | "paymentStatus" | "orderDate">,
    extras?: ProcessPaymentExtras
  ): Promise<{ success: boolean; orderId?: string }> => {
    set((s) => {
      s.isProcessing = true;
      s.error = null;
      s.paymentStatus = null;
    });

    try {
      if (amount <= 0) throw new Error("Invalid payment amount");
      if (!customerInfo.email || !customerInfo.firstName || !customerInfo.phone) {
        throw new Error("Customer information is incomplete");
      }

      const paymentCustomerInfo = {
        name: `${customerInfo.firstName} ${customerInfo.lastName ?? ""}`.trim(),
        email: customerInfo.email,
        contact: customerInfo.phone,
        address: customerInfo.address,
        city: customerInfo.city,
        state: customerInfo.state,
        postalCode: customerInfo.postalCode,
        country: customerInfo.country || "India",
      };

      const productCartItems = orderDetails.items
        .filter((item) => item.itemType !== "bundle")
        .map((item) => ({
          productId: item.productId,
          productName: item.productName,
          price: item.price,
          quantity: item.quantity,
          imageUrl: undefined,
        }));

      const result = await cashfreePaymentService.processPayment(
        amount,
        paymentCustomerInfo,
        orderDetails,
        productCartItems,
        extras
      );

      if (result.success && result.orderId) {
        const billingItems = orderDetails.items.map((item) => ({
          id: item.productId,
          name: item.productName,
          price: item.price,
          quantity: item.quantity,
          category: item.itemType === "bundle" ? "bundle" : "Perfume",
          hsnCode: "3303",
        }));

        orderManager.createOrder({
          customerInfo: {
            firstName: customerInfo.firstName,
            lastName: customerInfo.lastName || "",
            email: customerInfo.email,
            phone: customerInfo.phone,
            address: customerInfo.address || "",
            city: customerInfo.city || "",
            state: customerInfo.state || "",
            postalCode: customerInfo.postalCode || "",
            country: customerInfo.country || "India",
          },
          items: billingItems,
          paymentMethod: orderDetails.paymentMethod || "online",
          cashfreeOrderId: result.orderId,
          notes: orderDetails.notes,
        });

        // Keep PENDING until Cashfree redirect returns and verify-cashfree-payment confirms PAID
        set((s) => {
          s.isProcessing = false;
          s.paymentStatus = PaymentStatus.PENDING;
          s.currentOrder = {
            ...orderDetails,
            id: result.orderId!,
            paymentStatus: PaymentStatus.PENDING,
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
      const msg = err instanceof Error ? err.message : "Payment processing failed";
      set((s) => {
        s.isProcessing = false;
        s.paymentStatus = PaymentStatus.FAILED;
        s.error = msg;
      });
      console.error("Payment processing error:", err);
      return { success: false };
    }
  },
  markOrderPaid: (orderId, verifiedOrder) => {
    try {
      const localOrders = orderManager.getAllOrders();
      const matched = localOrders.find((o) => o.payment?.cashfreeOrderId === orderId || o.id === orderId);
      if (matched) {
        orderManager.updateOrder(matched.id, {
          status: "confirmed",
          paymentStatus: "completed",
        });
      }
    } catch (e) {
      console.error("Error updating local order status:", e);
    }

    set((s) => {
      s.paymentStatus = PaymentStatus.SUCCESS;
      if (verifiedOrder) {
        s.currentOrder = verifiedOrder;
      } else if (s.currentOrder && s.currentOrder.id === orderId) {
        s.currentOrder.paymentStatus = PaymentStatus.SUCCESS;
      }
    });
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
      const parsedOrders = JSON.parse(orders) as Array<OrderDetails & { orderDate: string }>;
      return parsedOrders.map((order) => ({
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
      return (
        orders.find(
          (order) =>
            order.id === orderId ||
            (order as OrderDetails & { cashfreeOrderId?: string }).cashfreeOrderId === orderId
        ) || null
      );
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
