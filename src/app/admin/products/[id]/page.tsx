import { getProducts } from '@/lib/data-service'
import EditProductClient from './edit-product-client'

// Pre-generate pages for known products at build time
export async function generateStaticParams() {
  const products = await getProducts()
  return products.map((product) => ({
    id: product.id,
  }))
}

export default function EditProductPage() {
  return <EditProductClient />
}
