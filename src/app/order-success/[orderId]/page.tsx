import OrderSuccess from "@/components/pages/OrderSuccess"

interface OrderSuccessPageProps {
  params: {
    orderId: string
  }
}

export default function OrderSuccessPage({ params }: OrderSuccessPageProps) {
  return <OrderSuccess orderId={params.orderId} />
} 