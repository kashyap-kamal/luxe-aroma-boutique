'use client'

import { useAuthStore } from '@/stores/auth-store'

// Custom hook that provides authentication state from Zustand store
export function useAuth() {
  const { user, isAuthenticated, isLoading } = useAuthStore()

  return {
    user,
    isAuthenticated,
    isLoading,
  }
}

