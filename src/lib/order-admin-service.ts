import { supabase } from './supabase'

export interface OrderRow {
  id: string
  cashfree_order_id: string
  customer_email: string
  customer_name: string
  customer_phone: string
  order_amount: number
  order_currency: string
  order_status: string
  payment_status: string | null
  payment_method: string | null
  payment_details: Record<string, unknown> | null
  shipping_address: Record<string, unknown> | null
  items: Array<{ product_id: string; product_name: string; price: number; quantity: number }>
  notes: string | null
  shiprocket_order_id: string | null
  shiprocket_status: string | null
  shiprocket_awb: string | null
  shiprocket_courier_name: string | null
  created_at: string
  updated_at: string
}

export interface OrderFilters {
  dateRange?: 'today' | 'week' | 'month' | 'all'
  dateFrom?: string
  dateTo?: string
  search?: string
  status?: string
}

export interface OrderStats {
  total_orders: number
  total_revenue: number
  paid_orders: number
  average_order_value: number
  orders_this_week: number
}

function getDateRange(range: string): { from: string; to: string } | null {
  const now = new Date()
  const to = now.toISOString()

  switch (range) {
    case 'today': {
      const from = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
      return { from, to }
    }
    case 'week': {
      const from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
      return { from, to }
    }
    case 'month': {
      const from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
      return { from, to }
    }
    default:
      return null
  }
}

export async function fetchOrders(filters: OrderFilters = {}): Promise<OrderRow[]> {
  let query = supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  // Date range filter
  if (filters.dateRange && filters.dateRange !== 'all') {
    const range = getDateRange(filters.dateRange)
    if (range) {
      query = query.gte('created_at', range.from).lte('created_at', range.to)
    }
  } else if (filters.dateFrom && filters.dateTo) {
    query = query.gte('created_at', filters.dateFrom).lte('created_at', filters.dateTo)
  }

  // Status filter
  if (filters.status) {
    query = query.eq('payment_status', filters.status)
  }

  // Search by order ID or email
  if (filters.search) {
    const s = filters.search.trim()
    query = query.or(`cashfree_order_id.ilike.%${s}%,customer_email.ilike.%${s}%,customer_name.ilike.%${s}%`)
  }

  const { data, error } = await query.limit(200)
  if (error) throw new Error(error.message)
  return data as OrderRow[]
}

export async function fetchOrderById(id: string): Promise<OrderRow> {
  const { data, error } = await supabase.from('orders').select('*').eq('id', id).single()
  if (error) throw new Error(error.message)
  return data as OrderRow
}

export async function fetchOrderStats(): Promise<OrderStats> {
  // Use the existing order_statistics view
  const { data: stats, error: statsError } = await supabase
    .from('order_statistics')
    .select('*')
    .single()

  if (statsError) {
    console.error('Error fetching order stats:', statsError)
  }

  // Orders this week
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const { count: weekCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', weekAgo)

  return {
    total_orders: stats?.total_orders ?? 0,
    total_revenue: stats?.total_revenue ?? 0,
    paid_orders: stats?.paid_orders ?? 0,
    average_order_value: stats?.average_order_value ?? 0,
    orders_this_week: weekCount ?? 0,
  }
}
