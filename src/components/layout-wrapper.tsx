"use client"

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { trackEvent } from '@/lib/analytics-service'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import PromoBanner from '@/components/promo-banner'
import CartSidebar from '@/components/cart-sidebar'
import MobileBottomNav from '@/components/mobile-bottom-nav'

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  useEffect(() => {
    if (!isAdmin && pathname) {
      trackEvent({ eventType: 'page_view', pagePath: pathname })
    }
  }, [isAdmin, pathname])

  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <PromoBanner />
      <Navbar />
      {children}
      <Footer />
      {/* Spacer so fixed bottom nav doesn't cover page content on mobile */}
      <div className="h-[68px] lg:hidden flex-shrink-0" aria-hidden="true" />
      <CartSidebar />
      <MobileBottomNav />
    </div>
  )
}
