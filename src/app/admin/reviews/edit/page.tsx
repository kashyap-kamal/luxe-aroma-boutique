"use client"

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { fetchReviewById, ReviewRow } from '@/lib/review-service'
import { ReviewForm } from '@/components/admin/review-form'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

function EditReviewContent() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [review, setReview] = useState<ReviewRow | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) { setLoading(false); return }
    fetchReviewById(id)
      .then(setReview)
      .catch((err) => toast.error(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false))
  }, [id])

  if (!id) return <p className="text-muted-foreground">No review ID provided.</p>
  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
  if (!review) return <p className="text-muted-foreground">Review not found.</p>

  return <ReviewForm review={review} />
}

export default function EditReviewPage() {
  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-gray-900 mb-6">Edit Review</h1>
      <Suspense fallback={<div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>}>
        <EditReviewContent />
      </Suspense>
    </div>
  )
}
