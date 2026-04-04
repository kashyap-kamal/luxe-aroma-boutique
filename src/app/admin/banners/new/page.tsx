"use client"

import { BannerForm } from '@/components/admin/banner-form'

export default function NewBannerPage() {
  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-gray-900 mb-6">
        Add New Banner
      </h1>
      <BannerForm />
    </div>
  )
}
