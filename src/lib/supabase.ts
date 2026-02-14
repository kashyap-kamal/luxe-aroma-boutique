import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'

// Create Supabase client for client-side operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'customer' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'customer' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'customer' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
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
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          short_description?: string | null
          price_original: number
          price_current: number
          currency?: string
          on_sale?: boolean
          category: 'men' | 'women' | 'unisex'
          tags?: string[]
          size?: string
          fragrance_notes?: { top: string[]; middle: string[]; base: string[] }
          image_url?: string | null
          image_urls?: string[]
          status?: 'in_stock' | 'out_of_stock' | 'discontinued'
          featured?: boolean
          display_order?: number
        }
        Update: {
          name?: string
          slug?: string
          description?: string | null
          short_description?: string | null
          price_original?: number
          price_current?: number
          currency?: string
          on_sale?: boolean
          category?: 'men' | 'women' | 'unisex'
          tags?: string[]
          size?: string
          fragrance_notes?: { top: string[]; middle: string[]; base: string[] }
          image_url?: string | null
          image_urls?: string[]
          status?: 'in_stock' | 'out_of_stock' | 'discontinued'
          featured?: boolean
          display_order?: number
        }
      }
      contact_messages: {
        Row: {
          id: string
          name: string
          email: string
          subject: string
          message: string
          status: 'new' | 'read' | 'replied' | 'closed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          subject: string
          message: string
          status?: 'new' | 'read' | 'replied' | 'closed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          subject?: string
          message?: string
          status?: 'new' | 'read' | 'replied' | 'closed'
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      product_statistics: {
        Row: {
          total_products: number
          in_stock_count: number
          out_of_stock_count: number
          on_sale_count: number
          featured_count: number
          men_count: number
          women_count: number
          unisex_count: number
          average_price: number
          min_price: number
          max_price: number
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Type for the Supabase client with database types
export type SupabaseClient = ReturnType<typeof createClient<Database>>

