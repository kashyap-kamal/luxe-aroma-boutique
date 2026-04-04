"use client"

import { BundleForm } from '@/components/admin/bundle-form'

export default function NewBundlePage() {
  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-gray-900 mb-6">
        Add New Bundle
      </h1>
      <BundleForm />
    </div>
  )
}
