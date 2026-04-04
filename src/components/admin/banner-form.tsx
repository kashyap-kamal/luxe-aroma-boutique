"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBanner, updateBanner, BannerRow, BannerFormData } from '@/lib/banner-service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface BannerFormProps {
  banner?: BannerRow
}

export function BannerForm({ banner }: BannerFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    title: banner?.title ?? '',
    text: banner?.text ?? '',
    link_url: banner?.link_url ?? '',
    link_label: banner?.link_label ?? '',
    position: banner?.position ?? 'top',
    background_color: banner?.background_color ?? '#2d3435',
    text_color: banner?.text_color ?? '#f9f9f9',
    is_active: banner?.is_active ?? true,
    display_order: String(banner?.display_order ?? 0),
    starts_at: banner?.starts_at ? banner.starts_at.slice(0, 16) : '',
    ends_at: banner?.ends_at ? banner.ends_at.slice(0, 16) : '',
  })

  const handleField = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.text) {
      toast.error('Title and text are required')
      return
    }
    setSaving(true)
    try {
      const data: BannerFormData = {
        title: form.title,
        text: form.text,
        link_url: form.link_url || undefined,
        link_label: form.link_label || undefined,
        position: form.position as BannerFormData['position'],
        background_color: form.background_color,
        text_color: form.text_color,
        is_active: form.is_active,
        display_order: Number(form.display_order),
        starts_at: form.starts_at || undefined,
        ends_at: form.ends_at || undefined,
      }
      if (banner?.id) {
        await updateBanner(banner.id, data)
        toast.success('Banner updated')
      } else {
        await createBanner(data)
        toast.success('Banner created')
      }
      router.push('/admin/banners')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Preview */}
      <div
        className="px-4 py-3 text-center font-sans font-medium uppercase"
        style={{
          background: form.background_color,
          color: form.text_color,
          fontSize: '10px',
          letterSpacing: '0.2em',
          borderRadius: '0.25rem',
        }}
      >
        {form.text || 'Banner preview...'}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="title">Title (internal) *</Label>
          <Input
            id="title"
            value={form.title}
            onChange={(e) => handleField('title', e.target.value)}
            placeholder="e.g. Summer Sale"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label>Position</Label>
          <Select value={form.position} onValueChange={(v) => handleField('position', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="top">Top Announcement Bar</SelectItem>
              <SelectItem value="hero">Hero Banner</SelectItem>
              <SelectItem value="collections">Collections Banner</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="text">Banner Text *</Label>
        <Textarea
          id="text"
          rows={2}
          value={form.text}
          onChange={(e) => handleField('text', e.target.value)}
          placeholder="USE CODE LUXE10 FOR 10% OFF • FREE DELIVERY ON ALL ORDERS"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="link_url">Link URL (optional)</Label>
          <Input
            id="link_url"
            value={form.link_url}
            onChange={(e) => handleField('link_url', e.target.value)}
            placeholder="/products"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="link_label">Link Label</Label>
          <Input
            id="link_label"
            value={form.link_label}
            onChange={(e) => handleField('link_label', e.target.value)}
            placeholder="SHOP NOW"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="background_color">Background Color</Label>
          <div className="flex gap-2">
            <Input
              id="background_color"
              value={form.background_color}
              onChange={(e) => handleField('background_color', e.target.value)}
              className="flex-1"
            />
            <input
              type="color"
              value={form.background_color}
              onChange={(e) => handleField('background_color', e.target.value)}
              className="w-10 h-10 rounded cursor-pointer border-0"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="text_color">Text Color</Label>
          <div className="flex gap-2">
            <Input
              id="text_color"
              value={form.text_color}
              onChange={(e) => handleField('text_color', e.target.value)}
              className="flex-1"
            />
            <input
              type="color"
              value={form.text_color}
              onChange={(e) => handleField('text_color', e.target.value)}
              className="w-10 h-10 rounded cursor-pointer border-0"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="display_order">Display Order</Label>
          <Input
            id="display_order"
            type="number"
            min={0}
            value={form.display_order}
            onChange={(e) => handleField('display_order', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="starts_at">Starts At (optional)</Label>
          <Input
            id="starts_at"
            type="datetime-local"
            value={form.starts_at}
            onChange={(e) => handleField('starts_at', e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ends_at">Ends At (optional)</Label>
          <Input
            id="ends_at"
            type="datetime-local"
            value={form.ends_at}
            onChange={(e) => handleField('ends_at', e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="is_active"
          checked={form.is_active}
          onCheckedChange={(v) => handleField('is_active', Boolean(v))}
        />
        <Label htmlFor="is_active" className="cursor-pointer">Active</Label>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          {banner ? 'Update Banner' : 'Create Banner'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push('/admin/banners')}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
