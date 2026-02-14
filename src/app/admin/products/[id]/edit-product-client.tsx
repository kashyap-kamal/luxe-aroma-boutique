"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { fetchProductRowById, ProductRow } from '@/lib/product-service'
import { ProductForm } from '@/components/admin/product-form'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function EditProductClient() {
  const params = useParams()
  const id = params.id as string
  const [product, setProduct] = useState<ProductRow | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProductRowById(id)
      .then(setProduct)
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false))
  }, [id])

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
