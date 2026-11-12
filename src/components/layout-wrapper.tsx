"use client"

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { trackEvent } from '@/lib/analytics-service'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import PromoBanner from '@/components/promo-banner'
import CartSidebar from '@/components/cart-sidebar'
import MobileBagButton from '@/components/mobile-bag-button'
import ScrollReveal from '@/components/scroll-reveal'

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')
  const isStandalone = isAdmin || pathname?.startsWith('/quiz')

  useEffect(() => {
    if (!isAdmin && pathname) {
      trackEvent({ eventType: 'page_view', pagePath: pathname })
    }
  }, [isAdmin, pathname])

  if (isStandalone) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <PromoBanner />
      <Navbar />
      {children}
      <Footer />
      <CartSidebar />
      <MobileBagButton />
      <ScrollReveal />
    </div>
  )
}
