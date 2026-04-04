import { supabase } from './supabase'

export interface BannerRow {
  id: string
  title: string
  text: string
  link_url: string | null
  link_label: string | null
  position: 'top' | 'hero' | 'collections' | 'custom'
  background_color: string
  text_color: string
  is_active: boolean
  display_order: number
  starts_at: string | null
  ends_at: string | null
  created_at: string
  updated_at: string
}

export interface BannerFormData {
  title: string
  text: string
  link_url?: string
  link_label?: string
  position?: 'top' | 'hero' | 'collections' | 'custom'
  background_color?: string
  text_color?: string
  is_active?: boolean
  display_order?: number
  starts_at?: string
  ends_at?: string
}

// Public: fetch active banners for a given position
export async function fetchActiveBanners(position: string = 'top'): Promise<BannerRow[]> {
  const now = new Date().toISOString()
  const { data, error } = await supabase
    .from('banners')
    .select('*')
    .eq('position', position)
    .eq('is_active', true)
    .or(`starts_at.is.null,starts_at.lte.${now}`)
    .or(`ends_at.is.null,ends_at.gte.${now}`)
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching banners:', error)
    return []
  }
  return data as BannerRow[]
}

// Admin: fetch all banners
export async function fetchAllBanners(): Promise<BannerRow[]> {
  const { data, error } = await supabase
    .from('banners')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) throw new Error(error.message)
  return data as BannerRow[]
}

export async function fetchBannerById(id: string): Promise<BannerRow> {
  const { data, error } = await supabase
    .from('banners')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return data as BannerRow
}

export async function createBanner(formData: BannerFormData): Promise<BannerRow> {
  const { data, error } = await supabase
    .from('banners')
    .insert(formData)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as BannerRow
}

export async function updateBanner(id: string, formData: Partial<BannerFormData>): Promise<BannerRow> {
  const { data, error } = await supabase
    .from('banners')
    .update(formData)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as BannerRow
}

export async function deleteBanner(id: string): Promise<void> {
  const { error } = await supabase
    .from('banners')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
}
