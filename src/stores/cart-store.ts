import { create, StateCreator } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

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
  // subtotal: number;
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
