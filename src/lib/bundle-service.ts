import { supabase } from './supabase'
import { Product } from '@/stores/cart-store'
import { toProduct, ProductRow } from './product-service'

export type BundleType = 'discovery_set' | 'duo' | 'trio' | 'collection'
export type BundleStatus = 'active' | 'pre_order' | 'sold_out'

export interface BundleRow {
  id: string
  name: string
  slug: string
  description: string | null
  short_description: string | null
  bundle_type: BundleType
  price_original: number | null
  price_current: number
  currency: string
  image_url: string | null
  status: BundleStatus
  featured: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface BundleItemRow {
  id: string
  bundle_id: string
  product_id: string
  quantity: number
  sort_order: number
}

export interface Bundle {
  id: string
  name: string
  slug: string
  description: string | null
  short_description: string | null
  bundleType: BundleType
  price: {
    original: number | null
    current: number
    currency: string
  }
  imageUrl: string | null
  status: BundleStatus
  featured: boolean
  displayOrder: number
  items: Array<{ product: Product; quantity: number }>
}

export interface BundleFormData {
  name: string
  slug: string
  description?: string
  short_description?: string
  bundle_type: BundleType
  price_original?: number
  price_current: number
  currency?: string
  image_url?: string
  status?: BundleStatus
  featured?: boolean
  display_order?: number
  product_ids: Array<{ product_id: string; quantity: number; sort_order: number }>
}

function toBundle(row: BundleRow, items: Array<{ product: Product; quantity: number }>): Bundle {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    short_description: row.short_description,
    bundleType: row.bundle_type,
    price: {
      original: row.price_original !== null ? Number(row.price_original) : null,
      current: Number(row.price_current),
      currency: row.currency,
    },
    imageUrl: row.image_url,
    status: row.status,
    featured: row.featured,
    displayOrder: row.display_order,
    items,
  }
}

// ============================================================
// PUBLIC READ OPERATIONS
// ============================================================

export async function fetchBundles(): Promise<Bundle[]> {
  const { data: bundleRows, error } = await supabase
    .from('product_bundles')
    .select('*, bundle_items(product_id, quantity, sort_order, products(*))')
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching bundles:', error)
    return []
  }

  return (bundleRows as (BundleRow & {
    bundle_items: Array<{ product_id: string; quantity: number; sort_order: number; products: ProductRow }>
  })[]).map((row) => {
    const items = (row.bundle_items || [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((item) => ({
        product: toProduct(item.products),
        quantity: item.quantity,
      }))
    return toBundle(row, items)
  })
}

export async function fetchFeaturedBundles(limit = 4): Promise<Bundle[]> {
  const { data: bundleRows, error } = await supabase
    .from('product_bundles')
    .select('*, bundle_items(product_id, quantity, sort_order, products(*))')
    .eq('featured', true)
    .eq('status', 'active')
    .order('display_order', { ascending: true })
    .limit(limit)

  if (error) {
    console.error('Error fetching featured bundles:', error)
    return []
  }

  return (bundleRows as (BundleRow & {
    bundle_items: Array<{ product_id: string; quantity: number; sort_order: number; products: ProductRow }>
  })[]).map((row) => {
    const items = (row.bundle_items || [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((item) => ({
        product: toProduct(item.products),
        quantity: item.quantity,
      }))
    return toBundle(row, items)
  })
}

export async function fetchBundleById(id: string): Promise<Bundle | null> {
  const { data, error } = await supabase
    .from('product_bundles')
    .select('*, bundle_items(product_id, quantity, sort_order, products(*))')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching bundle:', error)
    return null
  }

  const row = data as BundleRow & {
    bundle_items: Array<{ product_id: string; quantity: number; sort_order: number; products: ProductRow }>
  }
  const items = (row.bundle_items || [])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((item) => ({ product: toProduct(item.products), quantity: item.quantity }))
  return toBundle(row, items)
}

// ============================================================
// ADMIN CRUD OPERATIONS
// ============================================================

export async function fetchBundleRows(): Promise<BundleRow[]> {
  const { data, error } = await supabase
    .from('product_bundles')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) throw new Error(error.message)
  return data as BundleRow[]
}

export async function fetchBundleRowById(id: string): Promise<BundleRow> {
  const { data, error } = await supabase
    .from('product_bundles')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return data as BundleRow
}

export async function createBundle(formData: BundleFormData): Promise<BundleRow> {
  const { product_ids, ...bundleData } = formData

  const { data, error } = await supabase
    .from('product_bundles')
    .insert(bundleData)
    .select()
    .single()

  if (error) throw new Error(error.message)
  const bundle = data as BundleRow

  if (product_ids.length > 0) {
    const items = product_ids.map((item) => ({
      bundle_id: bundle.id,
      product_id: item.product_id,
      quantity: item.quantity,
      sort_order: item.sort_order,
    }))
    const { error: itemError } = await supabase.from('bundle_items').insert(items)
    if (itemError) throw new Error(itemError.message)
  }

  return bundle
}

export async function updateBundle(id: string, formData: Partial<BundleFormData>): Promise<BundleRow> {
  const { product_ids, ...bundleData } = formData

  const { data, error } = await supabase
    .from('product_bundles')
    .update(bundleData)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)

  if (product_ids !== undefined) {
    // Replace all items
    const { error: deleteError } = await supabase
      .from('bundle_items')
      .delete()
      .eq('bundle_id', id)
    if (deleteError) throw new Error(deleteError.message)

    if (product_ids.length > 0) {
      const items = product_ids.map((item) => ({
        bundle_id: id,
        product_id: item.product_id,
        quantity: item.quantity,
        sort_order: item.sort_order,
      }))
      const { error: insertError } = await supabase.from('bundle_items').insert(items)
      if (insertError) throw new Error(insertError.message)
    }
  }

  return data as BundleRow
}

export async function deleteBundle(id: string): Promise<void> {
  const { error } = await supabase
    .from('product_bundles')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
}

// ============================================================
// IMAGE UPLOAD (to Supabase Storage)
// ============================================================

export async function uploadBundleImage(file: File, slug: string): Promise<string> {
  const ext = file.name.split('.').pop() || 'png'
  const fileName = `${slug}-${Date.now()}.${ext}`
  const filePath = `bundles/${fileName}`

  const { error } = await supabase.storage
    .from('product-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) throw new Error(error.message)

  const { data: urlData } = supabase.storage
    .from('product-images')
    .getPublicUrl(filePath)

  return urlData.publicUrl
}
