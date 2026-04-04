import { supabase } from './supabase'

export async function subscribeEmail(
  email: string,
  source = 'homepage'
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('newsletter_subscribers')
    .insert({ email: email.trim().toLowerCase(), source })

  if (error) {
    // 23505 = unique_violation → already subscribed, treat as success
    if (error.code === '23505') {
      return { success: true }
    }
    return { success: false, error: error.message }
  }
  return { success: true }
}
