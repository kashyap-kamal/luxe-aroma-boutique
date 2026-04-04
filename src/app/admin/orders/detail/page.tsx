"use client"

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { fetchOrderById, OrderRow } from '@/lib/order-admin-service'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

function OrderDetailContent() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [order, setOrder] = useState<OrderRow | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) { setLoading(false); return }
    fetchOrderById(id)
      .then(setOrder)
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (!id) return <p className="text-muted-foreground">No order ID provided.</p>
  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
  if (!order) return <p className="text-muted-foreground">Order not found.</p>

  const addr = order.shipping_address as Record<string, string> | null

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order Info */}
        <div className="bg-white rounded-lg border p-6 space-y-3">
          <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Order Info</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Order ID</span><span className="font-mono text-xs">{order.cashfree_order_id}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Amount</span><span className="font-semibold">₹{Number(order.order_amount).toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Payment</span><Badge className={order.payment_status === 'SUCCESS' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>{order.payment_status || 'N/A'}</Badge></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Method</span><span>{order.payment_method || '—'}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span>{new Date(order.created_at).toLocaleString('en-IN')}</span></div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="bg-white rounded-lg border p-6 space-y-3">
          <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Customer</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Name</span><span>{order.customer_name}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span>{order.customer_email}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span>{order.customer_phone}</span></div>
            {addr && (
              <div>
                <span className="text-muted-foreground block mb-1">Shipping Address</span>
                <p className="text-xs">{addr.address}, {addr.city}, {addr.state} {addr.pincode}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Shipping */}
      {order.shiprocket_order_id && (
        <div className="bg-white rounded-lg border p-6 space-y-3">
          <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Shipping</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div><span className="text-muted-foreground block">Status</span>{order.shiprocket_status || '—'}</div>
            <div><span className="text-muted-foreground block">AWB</span>{order.shiprocket_awb || '—'}</div>
            <div><span className="text-muted-foreground block">Courier</span>{order.shiprocket_courier_name || '—'}</div>
            <div><span className="text-muted-foreground block">Shiprocket ID</span>{order.shiprocket_order_id}</div>
          </div>
        </div>
      )}

      {/* Items */}
      <div className="bg-white rounded-lg border p-6 space-y-3">
        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Items</h3>
        <div className="space-y-2">
          {(order.items || []).map((item, i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b last:border-0 text-sm">
              <div>
                <span className="font-medium">{item.product_name}</span>
                <span className="text-muted-foreground ml-2">× {item.quantity}</span>
              </div>
              <span className="font-medium">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function OrderDetailPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/orders"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <h1 className="text-2xl font-serif font-bold text-gray-900">Order Detail</h1>
      </div>
      <Suspense fallback={<div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>}>
        <OrderDetailContent />
      </Suspense>
    </div>
  )
}
