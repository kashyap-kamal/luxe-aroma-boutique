"use client"
import { CouponForm } from '@/components/admin/coupon-form'

export default function NewCouponPage() {
  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-gray-900 mb-6">Add Coupon</h1>
      <CouponForm />
    </div>
  )
}
