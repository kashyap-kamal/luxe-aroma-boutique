import { supabase } from './supabase'

export interface FreeShippingSetting {
  enabled: boolean
  threshold: number // 0 = free for all, >0 = free above this amount
}

export interface ShippingRateSetting {
  amount: number
  currency: string
}

export async function getSetting<T>(key: string): Promise<T | null> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', key)
    .single()

  if (error || !data) return null
  return data.value as T
}

export async function updateSetting(key: string, value: unknown): Promise<void> {
  const { error } = await supabase
    .from('site_settings')
    .upsert({ key, value, updated_at: new Date().toISOString() })

  if (error) throw new Error(error.message)
}

export async function getFreeShipping(): Promise<FreeShippingSetting> {
  const setting = await getSetting<FreeShippingSetting>('free_shipping')
  return setting ?? { enabled: true, threshold: 0 }
}

export async function getShippingRate(): Promise<ShippingRateSetting> {
  const setting = await getSetting<ShippingRateSetting>('shipping_rate')
  return setting ?? { amount: 49, currency: '₹' }
}
