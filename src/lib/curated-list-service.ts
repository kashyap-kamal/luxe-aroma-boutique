import { supabase } from './supabase'

export interface CuratedListRow {
  id: string
  slug: string
  name: string
  description: string | null
  product_ids: string[]
  is_active: boolean
  updated_at: string
}

// Public
export async function fetchCuratedList(slug: string): Promise<CuratedListRow | null> {
  const { data, error } = await supabase
    .from('curated_lists')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) return null
  return data as CuratedListRow
}

// Admin
export async function fetchAllCuratedLists(): Promise<CuratedListRow[]> {
  const { data, error } = await supabase
    .from('curated_lists')
    .select('*')
    .order('slug', { ascending: true })

  if (error) throw new Error(error.message)
  return data as CuratedListRow[]
}

export async function updateCuratedList(
  id: string,
  productIds: string[],
  isActive?: boolean
): Promise<CuratedListRow> {
  const update: Record<string, unknown> = { product_ids: productIds, updated_at: new Date().toISOString() }
  if (isActive !== undefined) update.is_active = isActive

  const { data, error } = await supabase
    .from('curated_lists')
    .update(update)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as CuratedListRow
}

// Admin: get product sales frequency from orders for recommendations
export async function fetchSalesRecommendations(limit = 10): Promise<Array<{ productId: string; productName: string; count: number }>> {
  const { data: orders, error } = await supabase
    .from('orders')
    .select('items')
    .eq('payment_status', 'SUCCESS')

  if (error || !orders) return []

  const counts = new Map<string, { name: string; count: number }>()
  for (const order of orders) {
    const items = order.items as Array<{ product_id: string; product_name: string; quantity: number }> | null
    if (!items) continue
    for (const item of items) {
      const existing = counts.get(item.product_id)
      if (existing) {
        existing.count += item.quantity
      } else {
        counts.set(item.product_id, { name: item.product_name, count: item.quantity })
      }
    }
  }

  return Array.from(counts.entries())
    .map(([productId, { name, count }]) => ({ productId, productName: name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}
