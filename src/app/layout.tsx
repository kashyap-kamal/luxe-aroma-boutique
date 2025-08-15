import type { Metadata } from 'next'
import './globals.css'
import { TooltipProvider } from "@/components/ui/tooltip"
import QueryProvider from "@/components/providers/QueryProvider"
import ToastProvider from "@/components/providers/ToastProvider"
import { CartProvider } from "@/contexts/CartContext"
import { PaymentProvider } from "@/contexts/PaymentContext"
import ErrorBoundary from "@/components/ErrorBoundary"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"

export const metadata: Metadata = {
  title: 'Luxe Aroma Boutique',
  description: 'Premium fragrances and aromatherapy products',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          <QueryProvider>
            <TooltipProvider>
              <CartProvider>
                <PaymentProvider>
                  <div className="min-h-screen flex flex-col">
                    <Navbar />
                    <main className="flex-1">
                      {children}
                    </main>
                    <Footer />
                  </div>
                  <ToastProvider />
                </PaymentProvider>
              </CartProvider>
            </TooltipProvider>
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
} 