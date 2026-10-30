import { create, StateCreator } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { billingCalculator, BillingBreakdown, BillingItem } from "@/lib/billing";
import { fetchProducts } from "@/lib/product-service";
import { Bundle, fetchBundles } from "@/lib/bundle-service";
import type { CouponRow } from "@/lib/coupon-service";
import { calculateCouponDiscount, roundCurrency } from "@/lib/checkout-pricing";
import { trackEvent } from "@/lib/analytics-service";

export interface Product {
  id: string;
  name: string;
  price: {
    original: number;
    current: number;
    currency: string;
    on_sale: boolean;
  };
  image: string;
  category: string;
  size?: string;
  description?: string;
  url?: string;
  tags?: string[];
  fragrance_notes?: {
    top: string[];
    middle: string[];
    base: string[];
  };
  rating?: {
    stars: number;
    out_of: number;
  };
  featured?: boolean;
  status: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface BundleCartItem {
  bundle: Bundle;
  quantity: number;
}

interface CartStore {
  cartItems: CartItem[];
  bundleItems: BundleCartItem[];
  appliedCoupon: CouponRow | null;
  sidebarOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  addBundleToCart: (bundle: Bundle, quantity: number) => void;
  removeBundleFromCart: (bundleId: string) => void;
  updateBundleQuantity: (bundleId: string, quantity: number) => void;
  applyCoupon: (coupon: CouponRow) => void;
  removeCoupon: () => void;
  clearCart: () => void;
  refreshPrices: () => Promise<boolean>;
  getBillingBreakdown: () => BillingBreakdown;
  getBillingItems: () => BillingItem[];
}

const createCartStore: StateCreator<
  CartStore,
  [["zustand/persist", unknown], ["zustand/immer", never]]
> = (set, get) => ({
  cartItems: [],
  bundleItems: [],
  appliedCoupon: null,
  sidebarOpen: false,
  openSidebar: () => set((state) => { state.sidebarOpen = true; }),
  closeSidebar: () => set((state) => { state.sidebarOpen = false; }),

  addToCart: (product, quantity) => {
    trackEvent({ eventType: "add_to_cart", productId: product.id, itemName: product.name, valueInr: product.price.current * quantity });
    set((state) => {
      const existingItem = (state.cartItems as CartItem[]).find(
        (i) => i.product.id === product.id,
      );
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.cartItems.push({ product, quantity });
      }
    });
  },

  removeFromCart: (productId) => {
    set((state) => {
      const idx = (state.cartItems as CartItem[]).findIndex(
        (item) => item.product.id === productId,
      );
      if (idx !== -1) {
        state.cartItems.splice(idx, 1);
      }
    });
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }
    set((state) => {
      const item = (state.cartItems as CartItem[]).find(
        (i) => i.product.id === productId,
      );
      if (item) {
        item.quantity = quantity;
      }
    });
  },

  addBundleToCart: (bundle, quantity) => {
    trackEvent({ eventType: "add_to_cart", bundleId: bundle.id, itemName: bundle.name, valueInr: bundle.price.current * quantity });
    set((state) => {
      const existing = (state.bundleItems as BundleCartItem[]).find(
        (i) => i.bundle.id === bundle.id,
      );
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.bundleItems.push({ bundle, quantity });
      }
    });
  },

  removeBundleFromCart: (bundleId) => {
    set((state) => {
      const idx = (state.bundleItems as BundleCartItem[]).findIndex(
        (i) => i.bundle.id === bundleId,
      );
      if (idx !== -1) {
        state.bundleItems.splice(idx, 1);
      }
    });
  },

  updateBundleQuantity: (bundleId, quantity) => {
    if (quantity <= 0) {
      get().removeBundleFromCart(bundleId);
      return;
    }
    set((state) => {
      const item = (state.bundleItems as BundleCartItem[]).find(
        (i) => i.bundle.id === bundleId,
      );
      if (item) {
        item.quantity = quantity;
      }
    });
  },

  applyCoupon: (coupon) => {
    set((state) => {
      state.appliedCoupon = coupon;
    });
  },

  removeCoupon: () => {
    set((state) => {
      state.appliedCoupon = null;
    });
  },

  clearCart: () => {
    set((state) => {
      state.cartItems.length = 0;
      state.bundleItems.length = 0;
      state.appliedCoupon = null;
    });
  },

  refreshPrices: async () => {
    const { cartItems, bundleItems } = get();
    if (cartItems.length === 0 && bundleItems.length === 0) return false;

    try {
      const [dbProducts, dbBundles] = await Promise.all([
        cartItems.length > 0 ? fetchProducts() : Promise.resolve([]),
        bundleItems.length > 0 ? fetchBundles() : Promise.resolve([]),
      ]);

      const productMap = new Map(dbProducts.map((p) => [p.id, p]));
      const bundleMap = new Map(dbBundles.map((b) => [b.id, b]));
      let pricesChanged = false;

      set((state) => {
        for (const item of state.cartItems as CartItem[]) {
          const dbProduct = productMap.get(item.product.id);
          if (dbProduct) {
            if (
              item.product.price.current !== dbProduct.price.current ||
              item.product.price.original !== dbProduct.price.original
            ) {
              pricesChanged = true;
            }
            item.product.price = dbProduct.price;
            item.product.status = dbProduct.status;
          }
        }
        for (const item of state.bundleItems as BundleCartItem[]) {
          const dbBundle = bundleMap.get(item.bundle.id);
          if (dbBundle) {
            if (
              item.bundle.price.current !== dbBundle.price.current ||
              item.bundle.price.original !== dbBundle.price.original
            ) {
              pricesChanged = true;
            }
            item.bundle = dbBundle;
          }
        }
      });

      return pricesChanged;
    } catch {
      return false;
    }
  },

  getBillingBreakdown: () => {
    const { cartItems, bundleItems, appliedCoupon } = get();
    const billingItems: BillingItem[] = [
      ...cartItems.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price.current,
        quantity: item.quantity,
        category: item.product.category,
        hsnCode: "3303",
      })),
      ...bundleItems.map((item) => ({
        id: item.bundle.id,
        name: item.bundle.name,
        price: item.bundle.price.current,
        quantity: item.quantity,
        category: "bundle",
        hsnCode: "3303",
      })),
    ];
    const base = billingCalculator.calculateBilling(billingItems);
    const couponCheck = calculateCouponDiscount(base.subtotal, appliedCoupon);
    const discount = couponCheck.valid ? couponCheck.discount : 0;
    const discountPercentage = base.subtotal > 0 ? roundCurrency((discount / base.subtotal) * 100) : 0;
    const total = roundCurrency(Math.max(0, base.subtotal - discount) + base.tax + base.shipping);
    return {
      ...base,
      discount,
      discountPercentage,
      total,
    };
  },

  getBillingItems: () => {
    const { cartItems, bundleItems } = get();
    return [
      ...cartItems.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price.current,
        quantity: item.quantity,
        category: item.product.category,
        hsnCode: "3303",
      })),
      ...bundleItems.map((item) => ({
        id: item.bundle.id,
        name: item.bundle.name,
        price: item.bundle.price.current,
        quantity: item.quantity,
        category: "bundle",
        hsnCode: "3303",
      })),
    ];
  },
});

export const useCartStore = create<CartStore>()(
  persist(immer(createCartStore), {
    name: "cart-store",
    storage: createJSONStorage(() => sessionStorage),
    partialize: (state) => ({
      cartItems: state.cartItems,
      bundleItems: state.bundleItems,
      appliedCoupon: state.appliedCoupon,
    }),
  }),
);

export const useCartSubtotal = () => {
  const { cartItems, bundleItems } = useCartStore();

  const productTotal = cartItems.reduce(
    (sum, item) => sum + item.product.price.current * item.quantity,
    0,
  );
  const bundleTotal = bundleItems.reduce(
    (sum, item) => sum + item.bundle.price.current * item.quantity,
    0,
  );

  return productTotal + bundleTotal;
};
