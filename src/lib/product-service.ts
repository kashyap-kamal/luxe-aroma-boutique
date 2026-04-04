import { supabase } from './supabase'
import { Product } from '@/stores/cart-store'

// Database row type matching the products table
export interface ProductRow {
  id: string
  name: string
  slug: string
  description: string | null
  short_description: string | null
  price_original: number
  price_current: number
  currency: string
  on_sale: boolean
  category: 'men' | 'women' | 'unisex'
  tags: string[]
  size: string
  fragrance_notes: { top: string[]; middle: string[]; base: string[] }
  image_url: string | null
  image_urls: string[]
  status: 'in_stock' | 'out_of_stock' | 'discontinued'
  featured: boolean
  display_order: number
  rating_stars: number
  rating_count: number
  created_at: string
  updated_at: string
}

// Form data for creating/updating a product
export interface ProductFormData {
  name: string
  slug: string
  description?: string
  short_description?: string
  price_original: number
  price_current: number
  currency?: string
  on_sale?: boolean
  category: 'men' | 'women' | 'unisex'
  tags?: string[]
  size?: string
  fragrance_notes?: { top: string[]; middle: string[]; base: string[] }
  image_url?: string
  image_urls?: string[]
  status?: 'in_stock' | 'out_of_stock' | 'discontinued'
  featured?: boolean
  display_order?: number
}

// Convert database row to frontend Product interface
export function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    price: {
      original: Number(row.price_original),
      current: Number(row.price_current),
      currency: row.currency,
      on_sale: row.on_sale,
    },
    image: row.image_url || `/assets/perfumes/${row.slug}.png`,
    category: row.category,
    size: row.size,
    description: row.description || `Premium ${row.name} fragrance - a luxurious scent perfect for any occasion.`,
    tags: row.tags || [],
    fragrance_notes: row.fragrance_notes || undefined,
    rating: {
      stars: Number(row.rating_stars),
      out_of: 5,
    },
    status: row.status,
  }
}

// ============================================================
// PUBLIC READ OPERATIONS (used by storefront)
// ============================================================

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return (data as ProductRow[]).map(toProduct)
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching product:', error)
    return null
  }

  return toProduct(data as ProductRow)
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching product:', error)
    return null
  }

  return toProduct(data as ProductRow)
}

export async function fetchProductsByCategory(category: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return (data as ProductRow[]).map(toProduct)
}

export async function fetchFeaturedProducts(limit = 4): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('featured', true)
    .eq('status', 'in_stock')
    .order('display_order', { ascending: true })
    .limit(limit)

  if (error) {
    console.error('Error fetching featured products:', error)
    return []
  }

  return (data as ProductRow[]).map(toProduct)
}

// ============================================================
// ADMIN CRUD OPERATIONS (protected by RLS - requires admin role)
// ============================================================

export async function fetchProductRows(): Promise<ProductRow[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) throw new Error(error.message)
  return data as ProductRow[]
}

export async function fetchProductRowById(id: string): Promise<ProductRow> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return data as ProductRow
}

export async function createProduct(formData: ProductFormData): Promise<ProductRow> {
  const { data, error } = await supabase
    .from('products')
    .insert(formData)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as ProductRow
}

export async function updateProduct(id: string, formData: Partial<ProductFormData>): Promise<ProductRow> {
  const { data, error } = await supabase
    .from('products')
    .update(formData)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as ProductRow
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
}

// ============================================================
// IMAGE UPLOAD (to Supabase Storage)
// ============================================================

export async function uploadProductImage(file: File, slug: string): Promise<string> {
  const ext = file.name.split('.').pop() || 'png'
  const fileName = `${slug}-${Date.now()}.${ext}`
  const filePath = `products/${fileName}`

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

export async function deleteProductImage(imageUrl: string): Promise<void> {
  // Extract the file path from the full URL
  const match = imageUrl.match(/product-images\/(.+)$/)
  if (!match) return

  const { error } = await supabase.storage
    .from('product-images')
    .remove([match[1]])

  if (error) throw new Error(error.message)
}

// ============================================================
// ADMIN AUTH CHECK
// ============================================================

export async function checkIsAdmin(): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (error || !data) return false
  return data.role === 'admin'
}

export async function fetchProductStats() {
  const { data, error } = await supabase
    .from('product_statistics')
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return data
}
