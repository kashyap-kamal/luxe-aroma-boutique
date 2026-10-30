"use client"

import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { fetchProductRowById, ProductRow } from '@/lib/product-service'
import { ProductForm } from '@/components/admin/product-form'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

function EditProductContent() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [product, setProduct] = useState<ProductRow | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }
    fetchProductRowById(id)
      .then(setProduct)
      .catch((err: unknown) =>
        toast.error(err instanceof Error ? err.message : 'Failed to load product')
      )
      .finally(() => setLoading(false))
  }, [id])

  if (!id) {
    return <p className="text-muted-foreground">No product ID provided.</p>
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Product not found</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-gray-900 mb-6">
        Edit: {product.name}
      </h1>
      <ProductForm product={product} />
    </div>
  )
}

export default function EditProductPage(): React.JSX.Element {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <EditProductContent />
    </Suspense>
  )
}
