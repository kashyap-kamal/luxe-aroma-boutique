import { create } from 'zustand'
import { ProductRow } from '@/lib/product-service'

interface AdminStore {
  products: ProductRow[]
  isLoading: boolean
  error: string | null
  isAdmin: boolean
  isAdminChecked: boolean

  setProducts: (products: ProductRow[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setIsAdmin: (isAdmin: boolean) => void
  setIsAdminChecked: (checked: boolean) => void
  removeProduct: (id: string) => void
  updateProductInList: (product: ProductRow) => void
  addProductToList: (product: ProductRow) => void
}

export const useAdminStore = create<AdminStore>()((set) => ({
  products: [],
  isLoading: false,
  error: null,
  isAdmin: false,
  isAdminChecked: false,

  setProducts: (products) => set({ products }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setIsAdmin: (isAdmin) => set({ isAdmin }),
  setIsAdminChecked: (checked) => set({ isAdminChecked: checked }),

  removeProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),

  updateProductInList: (product) =>
    set((state) => ({
      products: state.products.map((p) => (p.id === product.id ? product : p)),
    })),

  addProductToList: (product) =>
    set((state) => ({
      products: [...state.products, product],
    })),
}))
