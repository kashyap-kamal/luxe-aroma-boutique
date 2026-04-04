import { create, StateCreator } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { billingCalculator, BillingBreakdown, BillingItem } from "@/lib/billing";
import { fetchProducts } from "@/lib/product-service";
import { Bundle } from "@/lib/bundle-service";

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
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  addBundleToCart: (bundle: Bundle, quantity: number) => void;
  removeBundleFromCart: (bundleId: string) => void;
  updateBundleQuantity: (bundleId: string, quantity: number) => void;
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

  addToCart: (product, quantity) => {
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

  clearCart: () => {
    set((state) => {
      state.cartItems.length = 0;
      state.bundleItems.length = 0;
    });
  },

  refreshPrices: async () => {
    const { cartItems } = get();
    if (cartItems.length === 0) return false;

    try {
      const dbProducts = await fetchProducts();
      if (dbProducts.length === 0) return false;

      const productMap = new Map(dbProducts.map((p) => [p.id, p]));
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
      });

      return pricesChanged;
    } catch {
      return false;
    }
  },

  getBillingBreakdown: () => {
    const { cartItems, bundleItems } = get();
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
    return billingCalculator.calculateBilling(billingItems);
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
