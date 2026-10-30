import { supabase } from "./supabase";
import { calculateCouponDiscount } from "./checkout-pricing";

export interface CouponRow {
  id: string;
  code: string;
  description: string | null;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_order_amount: number | null;
  max_discount_amount: number | null;
  usage_limit: number | null;
  usage_count: number;
  is_active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CouponFormData {
  code: string;
  description?: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_order_amount?: number;
  max_discount_amount?: number;
  usage_limit?: number;
  is_active?: boolean;
  starts_at?: string;
  ends_at?: string;
}

export interface CouponUsageRow {
  id: string;
  coupon_id: string;
  order_id: string | null;
  customer_email: string;
  discount_applied: number;
  used_at: string;
}

export async function validateCoupon(
  code: string,
  cartTotal: number
): Promise<{ valid: boolean; coupon?: CouponRow; error?: string; discount?: number }> {
  const normalized = code.toUpperCase().trim();
  if (!normalized) {
    return { valid: false, error: "Please enter a coupon code" };
  }

  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("code", normalized)
    .single();

  if (error || !data) {
    return { valid: false, error: "Invalid coupon code" };
  }

  const coupon = data as CouponRow;
  const check = calculateCouponDiscount(cartTotal, coupon);
  if (!check.valid) {
    return { valid: false, error: check.error || "Coupon is not eligible for this order" };
  }

  return { valid: true, coupon, discount: check.discount };
}

export async function fetchAllCoupons(): Promise<CouponRow[]> {
  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as CouponRow[];
}

export async function fetchCouponById(id: string): Promise<CouponRow> {
  const { data, error } = await supabase.from("coupons").select("*").eq("id", id).single();
  if (error) throw new Error(error.message);
  return data as CouponRow;
}

export async function createCoupon(formData: CouponFormData): Promise<CouponRow> {
  const { data, error } = await supabase
    .from("coupons")
    .insert({ ...formData, code: formData.code.toUpperCase().trim() })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as CouponRow;
}

export async function updateCoupon(
  id: string,
  formData: Partial<CouponFormData>
): Promise<CouponRow> {
  const payload = { ...formData };
  if (payload.code) payload.code = payload.code.toUpperCase().trim();

  const { data, error } = await supabase
    .from("coupons")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as CouponRow;
}

export async function deleteCoupon(id: string): Promise<void> {
  const { error } = await supabase.from("coupons").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function fetchCouponHistory(couponId?: string): Promise<CouponUsageRow[]> {
  let query = supabase
    .from("coupon_usage")
    .select("*")
    .order("used_at", { ascending: false });

  if (couponId) query = query.eq("coupon_id", couponId);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data as CouponUsageRow[];
}
