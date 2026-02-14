"use client"

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  createProduct,
  updateProduct,
  uploadProductImage,
  ProductRow,
  ProductFormData,
} from '@/lib/product-service'
import { useAdminStore } from '@/stores/admin-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Upload, X, ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
  description: z.string().optional(),
  short_description: z.string().optional(),
  price_original: z.number().positive('Must be a positive number'),
  price_current: z.number().positive('Must be a positive number'),
  category: z.enum(['men', 'women', 'unisex']),
  size: z.string().optional(),
  status: z.enum(['in_stock', 'out_of_stock', 'discontinued']),
  on_sale: z.boolean().optional(),
  featured: z.boolean().optional(),
  display_order: z.number().int().min(0).optional(),
})

type ProductFormValues = z.infer<typeof productSchema>

interface ProductFormProps {
  product?: ProductRow
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter()
  const { addProductToList, updateProductInList } = useAdminStore()
  const [saving, setSaving] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(
    product?.image_url || null
  )
  const [tags, setTags] = useState<string[]>(product?.tags || [])
  const [tagInput, setTagInput] = useState('')
  const [fragranceNotes, setFragranceNotes] = useState<{
    top: string[]
    middle: string[]
    base: string[]
  }>(
    product?.fragrance_notes || { top: [], middle: [], base: [] }
  )
  const [noteInputs, setNoteInputs] = useState({ top: '', middle: '', base: '' })

  const isEditing = !!product

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      slug: product?.slug || '',
      description: product?.description || '',
      short_description: product?.short_description || '',
      price_original: product ? Number(product.price_original) : 0,
      price_current: product ? Number(product.price_current) : 0,
      category: product?.category || 'men',
      size: product?.size || '50ml',
      status: product?.status || 'in_stock',
      on_sale: product?.on_sale || false,
      featured: product?.featured || false,
      display_order: product?.display_order || 0,
    },
  })

  const watchName = watch('name')
  const watchOnSale = watch('on_sale')
  const watchFeatured = watch('featured')

  // Auto-generate slug from name
  const generateSlug = useCallback(() => {
    const slug = watchName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
    setValue('slug', slug)
  }, [watchName, setValue])

  // Image handling
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB')
      return
    }

    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(product?.image_url || null)
  }

  // Tag handling
  const addTag = () => {
    const tag = tagInput.trim()
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag])
    }
    setTagInput('')
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  // Fragrance note handling
  const addNote = (type: 'top' | 'middle' | 'base') => {
    const note = noteInputs[type].trim()
    if (note && !fragranceNotes[type].includes(note)) {
      setFragranceNotes({
        ...fragranceNotes,
        [type]: [...fragranceNotes[type], note],
      })
    }
    setNoteInputs({ ...noteInputs, [type]: '' })
  }

  const removeNote = (type: 'top' | 'middle' | 'base', note: string) => {
    setFragranceNotes({
      ...fragranceNotes,
      [type]: fragranceNotes[type].filter((n) => n !== note),
    })
  }

  // Submit
  const onSubmit = async (values: ProductFormValues) => {
    setSaving(true)
    try {
      let imageUrl = product?.image_url || undefined

      // Upload image if new file selected
      if (imageFile) {
        imageUrl = await uploadProductImage(imageFile, values.slug)
      }

      const formData: ProductFormData = {
        ...values,
        currency: '₹',
        tags,
        fragrance_notes: fragranceNotes,
        image_url: imageUrl,
      }

      if (isEditing) {
        const updated = await updateProduct(product.id, formData)
        updateProductInList(updated)
        toast.success('Product updated')
      } else {
        const created = await createProduct(formData)
        addProductToList(created)
        toast.success('Product created')
      }

      router.push('/admin/products')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Fields - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  {...register('name')}
                  onBlur={() => {
                    if (!isEditing) generateSlug()
                  }}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="slug">Slug *</Label>
                <div className="flex gap-2">
                  <Input id="slug" {...register('slug')} />
                  {!isEditing && (
                    <Button type="button" variant="outline" size="sm" onClick={generateSlug}>
                      Generate
                    </Button>
                  )}
                </div>
                {errors.slug && (
                  <p className="text-sm text-red-500 mt-1">{errors.slug.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={4}
                  {...register('description')}
                />
              </div>

              <div>
                <Label htmlFor="short_description">Short Description</Label>
                <Input id="short_description" {...register('short_description')} />
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price_original">Original Price (₹) *</Label>
                  <Input
                    id="price_original"
                    type="number"
                    step="0.01"
                    {...register('price_original', { valueAsNumber: true })}
                  />
                  {errors.price_original && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.price_original.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="price_current">Current Price (₹) *</Label>
                  <Input
                    id="price_current"
                    type="number"
                    step="0.01"
                    {...register('price_current', { valueAsNumber: true })}
                  />
                  {errors.price_current && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.price_current.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={watchOnSale}
                  onCheckedChange={(val) => setValue('on_sale', val)}
                />
                <Label>On Sale</Label>
              </div>
            </CardContent>
          </Card>

          {/* Fragrance Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Fragrance Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(['top', 'middle', 'base'] as const).map((type) => (
                <div key={type}>
                  <Label className="capitalize mb-2 block">{type} Notes</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      placeholder={`Add ${type} note...`}
                      value={noteInputs[type]}
                      onChange={(e) =>
                        setNoteInputs({ ...noteInputs, [type]: e.target.value })
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addNote(type)
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addNote(type)}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {fragranceNotes[type].map((note) => (
                      <Badge key={note} variant="secondary" className="gap-1">
                        {note}
                        <button
                          type="button"
                          onClick={() => removeNote(type, note)}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-3">
                <Input
                  placeholder="Add tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addTag()
                    }
                  }}
                />
                <Button type="button" variant="outline" size="sm" onClick={addTag}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Product Image</CardTitle>
            </CardHeader>
            <CardContent>
              {imagePreview ? (
                <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3">
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
                <label className="flex flex-col items-center justify-center aspect-square rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors mb-3">
                  <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Click to upload</span>
                  <span className="text-xs text-gray-400 mt-1">PNG, JPG, WebP (max 5MB)</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}
              {imagePreview && (
                <label className="w-full">
                  <Button type="button" variant="outline" size="sm" className="w-full gap-2" asChild>
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
            </CardContent>
          </Card>

          {/* Classification */}
          <Card>
            <CardHeader>
              <CardTitle>Classification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Category *</Label>
                <Select
                  defaultValue={product?.category || 'men'}
                  onValueChange={(val) =>
                    setValue('category', val as 'men' | 'women' | 'unisex')
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="men">Men</SelectItem>
                    <SelectItem value="women">Women</SelectItem>
                    <SelectItem value="unisex">Unisex</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Status *</Label>
                <Select
                  defaultValue={product?.status || 'in_stock'}
                  onValueChange={(val) =>
                    setValue(
                      'status',
                      val as 'in_stock' | 'out_of_stock' | 'discontinued'
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in_stock">In Stock</SelectItem>
                    <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                    <SelectItem value="discontinued">Discontinued</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="size">Size</Label>
                <Input id="size" {...register('size')} />
              </div>

              <div>
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  {...register('display_order', { valueAsNumber: true })}
                />
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  checked={watchFeatured}
                  onCheckedChange={(val) => setValue('featured', val)}
                />
                <Label>Featured Product</Label>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <Button type="submit" disabled={saving} className="w-full">
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {isEditing ? 'Update Product' : 'Create Product'}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => router.push('/admin/products')}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
