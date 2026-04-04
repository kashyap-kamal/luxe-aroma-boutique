"use client"

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { fetchCouponById, CouponRow } from '@/lib/coupon-service'
import { CouponForm } from '@/components/admin/coupon-form'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

function EditCouponContent() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [coupon, setCoupon] = useState<CouponRow | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) { setLoading(false); return }
    fetchCouponById(id)
      .then(setCoupon)
      .catch((err) => toast.error(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false))
  }, [id])

  if (!id) return <p className="text-muted-foreground">No coupon ID provided.</p>
  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
  if (!coupon) return <p className="text-muted-foreground">Coupon not found.</p>

  return <CouponForm coupon={coupon} />
}

export default function EditCouponPage() {
  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-gray-900 mb-6">Edit Coupon</h1>
      <Suspense fallback={<div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>}>
        <EditCouponContent />
      </Suspense>
    </div>
  )
}
