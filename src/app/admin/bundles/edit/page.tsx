"use client"

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { fetchBundleRowById, BundleRow } from '@/lib/bundle-service'
import { supabase } from '@/lib/supabase'
import { BundleForm } from '@/components/admin/bundle-form'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface BundleItemRow {
  product_id: string
  quantity: number
  sort_order: number
}

function EditBundleContent() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [bundle, setBundle] = useState<(BundleRow & { items: BundleItemRow[] }) | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }
    const load = async () => {
      try {
        const row = await fetchBundleRowById(id)
        const { data: items } = await supabase
          .from('bundle_items')
          .select('product_id, quantity, sort_order')
          .eq('bundle_id', id)
          .order('sort_order', { ascending: true })
        setBundle({ ...row, items: (items as BundleItemRow[]) || [] })
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to load bundle')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (!id) return <p className="text-muted-foreground">No bundle ID provided.</p>

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!bundle) return <p className="text-muted-foreground">Bundle not found.</p>

  return <BundleForm bundle={bundle} />
}

export default function EditBundlePage() {
  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-gray-900 mb-6">
        Edit Bundle
      </h1>
      <Suspense fallback={<div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>}>
        <EditBundleContent />
      </Suspense>
    </div>
  )
}
