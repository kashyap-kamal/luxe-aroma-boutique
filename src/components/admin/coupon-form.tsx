"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createCoupon, updateCoupon, CouponRow, CouponFormData } from '@/lib/coupon-service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface CouponFormProps {
  coupon?: CouponRow
}

export function CouponForm({ coupon }: CouponFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    code: coupon?.code ?? '',
    description: coupon?.description ?? '',
    discount_type: coupon?.discount_type ?? 'percentage',
    discount_value: coupon?.discount_value != null ? String(coupon.discount_value) : '',
    min_order_amount: coupon?.min_order_amount != null ? String(coupon.min_order_amount) : '',
    max_discount_amount: coupon?.max_discount_amount != null ? String(coupon.max_discount_amount) : '',
    usage_limit: coupon?.usage_limit != null ? String(coupon.usage_limit) : '',
    is_active: coupon?.is_active ?? true,
    starts_at: coupon?.starts_at ? coupon.starts_at.slice(0, 16) : '',
    ends_at: coupon?.ends_at ? coupon.ends_at.slice(0, 16) : '',
  })

  const handleField = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.code || !form.discount_value) {
      toast.error('Code and discount value are required')
      return
    }
    setSaving(true)
    try {
      const data: CouponFormData = {
        code: form.code,
        description: form.description || undefined,
        discount_type: form.discount_type as CouponFormData['discount_type'],
        discount_value: Number(form.discount_value),
        min_order_amount: form.min_order_amount ? Number(form.min_order_amount) : undefined,
        max_discount_amount: form.max_discount_amount ? Number(form.max_discount_amount) : undefined,
        usage_limit: form.usage_limit ? Number(form.usage_limit) : undefined,
        is_active: form.is_active,
        starts_at: form.starts_at || undefined,
        ends_at: form.ends_at || undefined,
      }
      if (coupon?.id) {
        await updateCoupon(coupon.id, data)
        toast.success('Coupon updated')
      } else {
        await createCoupon(data)
        toast.success('Coupon created')
      }
      router.push('/admin/coupons')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed')
    } finally { setSaving(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Preview */}
      <div className="p-4 rounded-lg border bg-gray-50 text-sm">
        <span className="font-mono font-bold text-lg">{form.code.toUpperCase() || 'CODE'}</span>
        <span className="ml-3 text-muted-foreground">
          {form.discount_type === 'percentage' ? `${form.discount_value || '0'}% off` : `₹${form.discount_value || '0'} off`}
          {form.min_order_amount && ` on orders above ₹${form.min_order_amount}`}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="code">Coupon Code *</Label>
          <Input id="code" value={form.code} onChange={(e) => handleField('code', e.target.value.toUpperCase())} placeholder="LUXE10" required className="font-mono uppercase" />
        </div>
        <div className="space-y-1.5">
          <Label>Discount Type</Label>
          <Select value={form.discount_type} onValueChange={(v) => handleField('discount_type', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">Percentage (%)</SelectItem>
              <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={2} value={form.description} onChange={(e) => handleField('description', e.target.value)} placeholder="10% off your order" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="discount_value">Discount Value *</Label>
          <Input id="discount_value" type="number" min={0} step={1} value={form.discount_value} onChange={(e) => handleField('discount_value', e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="min_order_amount">Min Order (₹)</Label>
          <Input id="min_order_amount" type="number" min={0} value={form.min_order_amount} onChange={(e) => handleField('min_order_amount', e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="max_discount_amount">Max Discount (₹)</Label>
          <Input id="max_discount_amount" type="number" min={0} value={form.max_discount_amount} onChange={(e) => handleField('max_discount_amount', e.target.value)} placeholder="% coupons only" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="usage_limit">Usage Limit</Label>
          <Input id="usage_limit" type="number" min={0} value={form.usage_limit} onChange={(e) => handleField('usage_limit', e.target.value)} placeholder="Unlimited" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="starts_at">Starts At</Label>
          <Input id="starts_at" type="datetime-local" value={form.starts_at} onChange={(e) => handleField('starts_at', e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ends_at">Ends At</Label>
          <Input id="ends_at" type="datetime-local" value={form.ends_at} onChange={(e) => handleField('ends_at', e.target.value)} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox id="is_active" checked={form.is_active} onCheckedChange={(v) => handleField('is_active', Boolean(v))} />
        <Label htmlFor="is_active" className="cursor-pointer">Active</Label>
      </div>

      {coupon && (
        <div className="text-sm text-muted-foreground">
          Used {coupon.usage_count} time{coupon.usage_count !== 1 ? 's' : ''}
          {coupon.usage_limit ? ` / ${coupon.usage_limit} limit` : ' (unlimited)'}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          {coupon ? 'Update Coupon' : 'Create Coupon'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push('/admin/coupons')}>Cancel</Button>
      </div>
    </form>
  )
}
