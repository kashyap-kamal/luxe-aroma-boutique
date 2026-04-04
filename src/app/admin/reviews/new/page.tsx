"use client"
import { ReviewForm } from '@/components/admin/review-form'

export default function NewReviewPage() {
  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-gray-900 mb-6">Add Review</h1>
      <ReviewForm />
    </div>
  )
}
