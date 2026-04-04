import { create, StateCreator } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { billingCalculator, BillingBreakdown, BillingItem } from "@/lib/billing";
import { fetchProducts } from "@/lib/product-service";

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
  rating?: {
    stars: number;
    out_of: number;
  };

  status: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartStore {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
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
  // subtotal: 0,
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
  clearCart: () => {
    set((state) => {
      state.cartItems.length = 0;
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
    const { cartItems } = get();
    const billingItems = cartItems.map(item => ({
      id: item.product.id,
      name: item.product.name,
      price: item.product.price.current,
      quantity: item.quantity,
      category: item.product.category,
      hsnCode: '3303', // HSN code for perfumes
    }));
    return billingCalculator.calculateBilling(billingItems);
  },
  getBillingItems: () => {
    const { cartItems } = get();
    return cartItems.map(item => ({
      id: item.product.id,
      name: item.product.name,
      price: item.product.price.current,
      quantity: item.quantity,
      category: item.product.category,
      hsnCode: '3303', // HSN code for perfumes
    }));
  },
});

export const useCartStore = create<CartStore>()(
  persist(immer(createCartStore), {
    name: "cart-store",
    storage: createJSONStorage(() => sessionStorage),
  }),
);

export const useCartSubtotal = () => {
  const { cartItems } = useCartStore();

  // Calculate subtotal using current price
  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price.current * item.quantity,
    0,
  );

  return total;
};
