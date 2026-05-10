"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  createBundle,
  updateBundle,
  uploadBundleImage,
  BundleRow,
  BundleType,
  BundleStatus,
  BundleFormData,
} from '@/lib/bundle-service'
import { fetchProductRows, ProductRow } from '@/lib/product-service'
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
import { ImageIcon, Loader2, Plus, Trash2, Upload, X } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

interface BundleFormProps {
  bundle?: BundleRow & { items?: Array<{ product_id: string; quantity: number; sort_order: number }> }
}

interface SelectedProduct {
  product_id: string
  quantity: number
  sort_order: number
}

export function BundleForm({ bundle }: BundleFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [allProducts, setAllProducts] = useState<ProductRow[]>([])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(bundle?.image_url ?? null)

  const [form, setForm] = useState({
    name: bundle?.name ?? '',
    slug: bundle?.slug ?? '',
    description: bundle?.description ?? '',
    short_description: bundle?.short_description ?? '',
    bundle_type: (bundle?.bundle_type ?? 'discovery_set') as BundleType,
    price_original: bundle?.price_original != null ? String(bundle.price_original) : '',
    price_current: bundle?.price_current != null ? String(bundle.price_current) : '',
    currency: bundle?.currency ?? '₹',
    image_url: bundle?.image_url ?? '',
    status: (bundle?.status ?? 'active') as BundleStatus,
    featured: bundle?.featured ?? false,
    display_order: bundle?.display_order != null ? String(bundle.display_order) : '0',
  })

  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>(
    bundle?.items ?? []
  )
  const [addProductId, setAddProductId] = useState('')

  useEffect(() => {
    fetchProductRows()
      .then(setAllProducts)
      .catch((err) => toast.error(err.message))
  }, [])

  const handleField = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const autoSlug = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB')
      return
    }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    handleField('image_url', '')
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(bundle?.image_url ?? null)
    handleField('image_url', bundle?.image_url ?? '')
  }

  const addProduct = () => {
    if (!addProductId) return
    if (selectedProducts.find((p) => p.product_id === addProductId)) {
      toast.error('Product already added')
      return
    }
    setSelectedProducts((prev) => [
      ...prev,
      { product_id: addProductId, quantity: 1, sort_order: prev.length },
    ])
    setAddProductId('')
  }

  const removeProduct = (product_id: string) => {
    setSelectedProducts((prev) =>
      prev.filter((p) => p.product_id !== product_id).map((p, i) => ({ ...p, sort_order: i }))
    )
  }

  const updateQty = (product_id: string, qty: number) => {
    setSelectedProducts((prev) =>
      prev.map((p) => (p.product_id === product_id ? { ...p, quantity: Math.max(1, qty) } : p))
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.slug || !form.price_current) {
      toast.error('Name, slug, and current price are required')
      return
    }

    setSaving(true)
    try {
      let imageUrl = form.image_url || undefined
      if (imageFile) {
        imageUrl = await uploadBundleImage(imageFile, form.slug)
      }

      const formData: BundleFormData = {
        name: form.name,
        slug: form.slug,
        description: form.description || undefined,
        short_description: form.short_description || undefined,
        bundle_type: form.bundle_type,
        price_original: form.price_original ? Number(form.price_original) : undefined,
        price_current: Number(form.price_current),
        currency: form.currency,
        image_url: imageUrl,
        status: form.status,
        featured: form.featured,
        display_order: Number(form.display_order),
        product_ids: selectedProducts,
      }

      if (bundle?.id) {
        await updateBundle(bundle.id, formData)
        toast.success('Bundle updated')
      } else {
        await createBundle(formData)
        toast.success('Bundle created')
      }
      router.push('/admin/bundles')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const productMap = new Map(allProducts.map((p) => [p.id, p]))

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Name + Slug */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => {
              handleField('name', e.target.value)
              if (!bundle) handleField('slug', autoSlug(e.target.value))
            }}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="slug">Slug *</Label>
          <Input
            id="slug"
            value={form.slug}
            onChange={(e) => handleField('slug', e.target.value)}
            required
          />
        </div>
      </div>

      {/* Descriptions */}
      <div className="space-y-1.5">
        <Label htmlFor="short_description">Short Description</Label>
        <Input
          id="short_description"
          value={form.short_description}
          onChange={(e) => handleField('short_description', e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          rows={3}
          value={form.description}
          onChange={(e) => handleField('description', e.target.value)}
        />
      </div>

      {/* Bundle Type + Status */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Bundle Type *</Label>
          <Select
            value={form.bundle_type}
            onValueChange={(v) => handleField('bundle_type', v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(['discovery_set', 'duo', 'trio', 'collection'] as BundleType[]).map((t) => (
                <SelectItem key={t} value={t}>
                  {t.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Status</Label>
          <Select
            value={form.status}
            onValueChange={(v) => handleField('status', v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(['active', 'pre_order', 'sold_out'] as BundleStatus[]).map((s) => (
                <SelectItem key={s} value={s}>
                  {s.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Pricing */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="price_current">Current Price (₹) *</Label>
          <Input
            id="price_current"
            type="number"
            min={0}
            step={1}
            value={form.price_current}
            onChange={(e) => handleField('price_current', e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="price_original">Original Price (₹)</Label>
          <Input
            id="price_original"
            type="number"
            min={0}
            step={1}
            value={form.price_original}
            onChange={(e) => handleField('price_original', e.target.value)}
          />
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

      {/* Bundle Image */}
      <div className="space-y-1.5">
        <Label>Bundle Image</Label>
        {imagePreview ? (
          <div className="relative w-40 aspect-[3/4] rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={imagePreview}
              alt="Preview"
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 bg-white/80 rounded-full p-1 hover:bg-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-40 aspect-[3/4] rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
            <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-xs text-gray-500 text-center px-2">Click to upload</span>
            <span className="text-[10px] text-gray-400 mt-1">PNG, JPG, WebP (max 5MB)</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        )}
        {imagePreview && (
          <label className="inline-block">
            <Button type="button" variant="outline" size="sm" className="gap-2" asChild>
              <span>
                <Upload className="h-4 w-4" />
                Change Image
              </span>
            </Button>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        )}
        <p className="text-xs text-muted-foreground">Or paste a URL:</p>
        <Input
          id="image_url"
          value={form.image_url}
          onChange={(e) => {
            handleField('image_url', e.target.value)
            if (e.target.value) {
              setImagePreview(e.target.value)
              setImageFile(null)
            }
          }}
          placeholder="https://..."
        />
      </div>

      {/* Featured */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="featured"
          checked={form.featured}
          onCheckedChange={(v) => handleField('featured', Boolean(v))}
        />
        <Label htmlFor="featured" className="cursor-pointer">
          Featured (show on homepage)
        </Label>
      </div>

      {/* Products in bundle */}
      <div>
        <Label className="mb-2 block">Products in Bundle</Label>

        <div className="flex gap-2 mb-3">
          <Select value={addProductId} onValueChange={setAddProductId}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select a product to add..." />
            </SelectTrigger>
            <SelectContent>
              {allProducts.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name} — {p.currency}{Number(p.price_current).toLocaleString('en-IN')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="button" variant="outline" onClick={addProduct} className="gap-1">
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>

        {selectedProducts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No products added yet.</p>
        ) : (
          <div className="space-y-2">
            {selectedProducts.map((sp) => {
              const p = productMap.get(sp.product_id)
              return (
                <div
                  key={sp.product_id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1 text-sm font-medium">
                    {p ? p.name : sp.product_id}
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`qty-${sp.product_id}`} className="text-xs text-muted-foreground">
                      Qty
                    </Label>
                    <Input
                      id={`qty-${sp.product_id}`}
                      type="number"
                      min={1}
                      value={sp.quantity}
                      onChange={(e) => updateQty(sp.product_id, Number(e.target.value))}
                      className="w-16 h-8 text-sm"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => removeProduct(sp.product_id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          {bundle ? 'Update Bundle' : 'Create Bundle'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/bundles')}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
