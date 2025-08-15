import ProductDetail from "@/components/pages/ProductDetail"

interface ProductDetailPageProps {
  params: {
    id: string
  }
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  return <ProductDetail id={params.id} />
} 