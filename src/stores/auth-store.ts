import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@supabase/supabase-js'

// Auth state interface
interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

// Auth store with persistence
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      isLoading: true,
      isAuthenticated: false,

      // Actions
      setUser: (user) => 
        set({ 
          user, 
          isAuthenticated: !!user,
          isLoading: false 
        }),

      setLoading: (loading) => 
        set({ isLoading: loading }),

      logout: () => 
        set({ 
          user: null, 
          isAuthenticated: false, 
          isLoading: false 
        }),
    }),
    {
      name: 'auth-storage', // unique name for localStorage key
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      }), // only persist user and auth status
    }
  )
)

// Selector hooks for better performance
export const useUser = () => useAuthStore((state) => state.user)
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated)
export const useIsLoading = () => useAuthStore((state) => state.isLoading)

// Individual action hooks to prevent infinite loops
export const useSetUser = () => useAuthStore((state) => state.setUser)
export const useSetLoading = () => useAuthStore((state) => state.setLoading)
export const useLogout = () => useAuthStore((state) => state.logout)

