"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createReview, updateReview, ReviewRow, ReviewFormData } from '@/lib/review-service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Star, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface ReviewFormProps {
  review?: ReviewRow
}

export function ReviewForm({ review }: ReviewFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    customer_name: review?.customer_name ?? '',
    customer_location: review?.customer_location ?? '',
    rating: String(review?.rating ?? 5),
    comment: review?.comment ?? '',
    product_name: review?.product_name ?? '',
    is_active: review?.is_active ?? true,
    display_order: String(review?.display_order ?? 0),
  })

  const handleField = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.customer_name || !form.comment) {
      toast.error('Name and comment are required')
      return
    }
    setSaving(true)
    try {
      const data: ReviewFormData = {
        customer_name: form.customer_name,
        customer_location: form.customer_location || undefined,
        rating: Number(form.rating),
        comment: form.comment,
        product_name: form.product_name || undefined,
        is_active: form.is_active,
        display_order: Number(form.display_order),
      }
      if (review?.id) {
        await updateReview(review.id, data)
        toast.success('Review updated')
      } else {
        await createReview(data)
        toast.success('Review created')
      }
      router.push('/admin/reviews')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Preview */}
      <div className="p-6 rounded-lg" style={{ background: '#f6f3f2' }}>
        <div className="flex gap-0.5 mb-2">
          {Array.from({ length: Number(form.rating) }).map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5" style={{ color: '#d4af37', fill: '#d4af37' }} />
          ))}
        </div>
        <p className="font-serif italic text-sm mb-2">&ldquo;{form.comment || 'Review preview...'}&rdquo;</p>
        <div className="text-xs"><span className="font-semibold">{form.customer_name || 'Customer Name'}</span> &middot; {form.customer_location || 'Location'} &middot; <span style={{ color: '#735b3a' }}>{form.product_name || 'Product'}</span></div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="customer_name">Customer Name *</Label>
          <Input id="customer_name" value={form.customer_name} onChange={(e) => handleField('customer_name', e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="customer_location">Location</Label>
          <Input id="customer_location" value={form.customer_location} onChange={(e) => handleField('customer_location', e.target.value)} placeholder="Mumbai" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Rating *</Label>
          <Select value={form.rating} onValueChange={(v) => handleField('rating', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {[5, 4, 3, 2, 1].map((r) => (
                <SelectItem key={r} value={String(r)}>{r} Star{r !== 1 ? 's' : ''}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="product_name">Product Name</Label>
          <Input id="product_name" value={form.product_name} onChange={(e) => handleField('product_name', e.target.value)} placeholder="Aventus" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="comment">Comment *</Label>
        <Textarea id="comment" rows={4} value={form.comment} onChange={(e) => handleField('comment', e.target.value)} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="display_order">Display Order</Label>
          <Input id="display_order" type="number" min={0} value={form.display_order} onChange={(e) => handleField('display_order', e.target.value)} />
        </div>
        <div className="flex items-end pb-2">
          <div className="flex items-center gap-2">
            <Checkbox id="is_active" checked={form.is_active} onCheckedChange={(v) => handleField('is_active', Boolean(v))} />
            <Label htmlFor="is_active" className="cursor-pointer">Active (visible on storefront)</Label>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          {review ? 'Update Review' : 'Create Review'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push('/admin/reviews')}>Cancel</Button>
      </div>
    </form>
  )
}
