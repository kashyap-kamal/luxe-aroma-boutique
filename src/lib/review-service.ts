import { supabase } from './supabase'

export interface ReviewRow {
  id: string
  customer_name: string
  customer_location: string | null
  rating: number
  comment: string
  product_name: string | null
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface ReviewFormData {
  customer_name: string
  customer_location?: string
  rating: number
  comment: string
  product_name?: string
  is_active?: boolean
  display_order?: number
}

// Public: fetch active reviews for storefront
export async function fetchActiveReviews(): Promise<ReviewRow[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching reviews:', error)
    return []
  }
  return data as ReviewRow[]
}

// Admin: fetch all reviews
export async function fetchAllReviews(): Promise<ReviewRow[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) throw new Error(error.message)
  return data as ReviewRow[]
}

export async function fetchReviewById(id: string): Promise<ReviewRow> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return data as ReviewRow
}

export async function createReview(formData: ReviewFormData): Promise<ReviewRow> {
  const { data, error } = await supabase
    .from('reviews')
    .insert(formData)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as ReviewRow
}

export async function updateReview(id: string, formData: Partial<ReviewFormData>): Promise<ReviewRow> {
  const { data, error } = await supabase
    .from('reviews')
    .update(formData)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as ReviewRow
}

export async function deleteReview(id: string): Promise<void> {
  const { error } = await supabase.from('reviews').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function toggleReviewActive(id: string, is_active: boolean): Promise<void> {
  const { error } = await supabase
    .from('reviews')
    .update({ is_active })
    .eq('id', id)

  if (error) throw new Error(error.message)
}
