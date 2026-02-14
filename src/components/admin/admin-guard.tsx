"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useIsAuthenticated, useIsLoading } from '@/stores/auth-store'
import { useAdminStore } from '@/stores/admin-store'
import { checkIsAdmin } from '@/lib/product-service'
import { Loader2 } from 'lucide-react'

interface AdminGuardProps {
  children: React.ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const isAuthenticated = useIsAuthenticated()
  const isLoading = useIsLoading()
  const router = useRouter()
  const { isAdmin, isAdminChecked, setIsAdmin, setIsAdminChecked } = useAdminStore()

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated) {
      router.push('/auth/signin?redirect=/admin')
      return
    }

    if (!isAdminChecked) {
      checkIsAdmin().then((admin) => {
        setIsAdmin(admin)
        setIsAdminChecked(true)
        if (!admin) {
          router.push('/')
        }
      })
    }
  }, [isAuthenticated, isLoading, isAdminChecked, router, setIsAdmin, setIsAdminChecked])

  if (isLoading || !isAdminChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return <>{children}</>
}
