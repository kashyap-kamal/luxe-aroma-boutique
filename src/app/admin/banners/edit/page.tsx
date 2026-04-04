"use client"

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { fetchBannerById, BannerRow } from '@/lib/banner-service'
import { BannerForm } from '@/components/admin/banner-form'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

function EditBannerContent() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [banner, setBanner] = useState<BannerRow | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) { setLoading(false); return }
    fetchBannerById(id)
      .then(setBanner)
      .catch((err) => toast.error(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false))
  }, [id])

  if (!id) return <p className="text-muted-foreground">No banner ID provided.</p>
  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
  if (!banner) return <p className="text-muted-foreground">Banner not found.</p>

  return <BannerForm banner={banner} />
}

export default function EditBannerPage() {
  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-gray-900 mb-6">Edit Banner</h1>
      <Suspense fallback={<div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>}>
        <EditBannerContent />
      </Suspense>
    </div>
  )
}
