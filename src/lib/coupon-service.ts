import { supabase } from './supabase'

export interface CouponRow {
  id: string
  code: string
  description: string | null
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  min_order_amount: number | null
  max_discount_amount: number | null
  usage_limit: number | null
  usage_count: number
  is_active: boolean
  starts_at: string | null
  ends_at: string | null
  created_at: string
  updated_at: string
}

export interface CouponFormData {
  code: string
  description?: string
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  min_order_amount?: number
  max_discount_amount?: number
  usage_limit?: number
  is_active?: boolean
  starts_at?: string
  ends_at?: string
}

export interface CouponUsageRow {
  id: string
  coupon_id: string
  order_id: string | null
  customer_email: string
  discount_applied: number
  used_at: string
}

// Public: validate a coupon code against cart total
export async function validateCoupon(
  code: string,
  cartTotal: number
): Promise<{ valid: boolean; coupon?: CouponRow; error?: string; discount?: number }> {
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', code.toUpperCase().trim())
    .single()

  if (error || !data) return { valid: false, error: 'Invalid coupon code' }

  const coupon = data as CouponRow
  const now = new Date()

  if (!coupon.is_active) return { valid: false, error: 'This coupon is no longer active' }
  if (coupon.starts_at && new Date(coupon.starts_at) > now) return { valid: false, error: 'This coupon is not yet active' }
  if (coupon.ends_at && new Date(coupon.ends_at) < now) return { valid: false, error: 'This coupon has expired' }
  if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) return { valid: false, error: 'This coupon has been fully redeemed' }
  if (coupon.min_order_amount && cartTotal < Number(coupon.min_order_amount)) {
    return { valid: false, error: `Minimum order of ₹${Number(coupon.min_order_amount).toLocaleString('en-IN')} required` }
  }

  let discount = 0
  if (coupon.discount_type === 'percentage') {
    discount = cartTotal * (Number(coupon.discount_value) / 100)
    if (coupon.max_discount_amount) {
      discount = Math.min(discount, Number(coupon.max_discount_amount))
    }
  } else {
    discount = Number(coupon.discount_value)
  }

  return { valid: true, coupon, discount: Math.round(discount * 100) / 100 }
}

// Admin: fetch all coupons
export async function fetchAllCoupons(): Promise<CouponRow[]> {
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data as CouponRow[]
}

export async function fetchCouponById(id: string): Promise<CouponRow> {
  const { data, error } = await supabase.from('coupons').select('*').eq('id', id).single()
  if (error) throw new Error(error.message)
  return data as CouponRow
}

export async function createCoupon(formData: CouponFormData): Promise<CouponRow> {
  const { data, error } = await supabase
    .from('coupons')
    .insert({ ...formData, code: formData.code.toUpperCase().trim() })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as CouponRow
}

export async function updateCoupon(id: string, formData: Partial<CouponFormData>): Promise<CouponRow> {
  const payload = { ...formData }
  if (payload.code) payload.code = payload.code.toUpperCase().trim()

  const { data, error } = await supabase.from('coupons').update(payload).eq('id', id).select().single()
  if (error) throw new Error(error.message)
  return data as CouponRow
}

export async function deleteCoupon(id: string): Promise<void> {
  const { error } = await supabase.from('coupons').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

// Admin: fetch usage history for a coupon (or all)
export async function fetchCouponHistory(couponId?: string): Promise<CouponUsageRow[]> {
  let query = supabase
    .from('coupon_usage')
    .select('*')
    .order('used_at', { ascending: false })

  if (couponId) query = query.eq('coupon_id', couponId)

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return data as CouponUsageRow[]
}

// Record coupon usage after payment
export async function recordCouponUsage(
  couponId: string,
  orderId: string | null,
  customerEmail: string,
  discountApplied: number
): Promise<void> {
  const { error: usageError } = await supabase.from('coupon_usage').insert({
    coupon_id: couponId,
    order_id: orderId,
    customer_email: customerEmail,
    discount_applied: discountApplied,
  })
  if (usageError) console.error('Error recording coupon usage:', usageError)

  // Increment usage count
  const { error: countError } = await supabase.rpc('increment_coupon_usage', { coupon_id_input: couponId })
  if (countError) {
    // Fallback: manual increment
    const { data: coupon } = await supabase.from('coupons').select('usage_count').eq('id', couponId).single()
    if (coupon) {
      await supabase.from('coupons').update({ usage_count: coupon.usage_count + 1 }).eq('id', couponId)
    }
  }
}
