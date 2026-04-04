"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, DollarSign, TrendingUp, AlertTriangle, ShoppingBag, IndianRupee, Star, Ticket } from 'lucide-react'
import { fetchProductStats } from '@/lib/product-service'
import { fetchOrderStats, OrderStats } from '@/lib/order-admin-service'
import { fetchAllCoupons, CouponRow } from '@/lib/coupon-service'
import { fetchAllReviews, ReviewRow } from '@/lib/review-service'
import { Skeleton } from '@/components/ui/skeleton'

interface ProductStats {
  total_products: number
  in_stock_count: number
  out_of_stock_count: number
  on_sale_count: number
  featured_count: number
  men_count: number
  women_count: number
  unisex_count: number
  average_price: number
  min_price: number
  max_price: number
}

export default function AdminDashboard() {
  const [productStats, setProductStats] = useState<ProductStats | null>(null)
  const [orderStats, setOrderStats] = useState<OrderStats | null>(null)
  const [coupons, setCoupons] = useState<CouponRow[]>([])
  const [reviews, setReviews] = useState<ReviewRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetchProductStats().then((d) => setProductStats(d as ProductStats)).catch(() => {}),
      fetchOrderStats().then(setOrderStats).catch(() => {}),
      fetchAllCoupons().then(setCoupons).catch(() => {}),
      fetchAllReviews().then(setReviews).catch(() => {}),
    ]).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-serif font-bold text-gray-900 mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i}><CardHeader className="pb-2"><Skeleton className="h-4 w-24" /></CardHeader><CardContent><Skeleton className="h-8 w-16" /></CardContent></Card>
          ))}
        </div>
      </div>
    )
  }

  const activeCoupons = coupons.filter((c) => c.is_active && (!c.ends_at || new Date(c.ends_at) > new Date())).length
  const activeReviews = reviews.filter((r) => r.is_active).length

  const topCards = [
    { title: 'Total Revenue', value: `₹${Number(orderStats?.total_revenue ?? 0).toLocaleString('en-IN')}`, icon: IndianRupee, color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Total Orders', value: orderStats?.total_orders ?? 0, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Orders This Week', value: orderStats?.orders_this_week ?? 0, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'Avg Order Value', value: `₹${Math.round(Number(orderStats?.average_order_value ?? 0)).toLocaleString('en-IN')}`, icon: DollarSign, color: 'text-amber-600', bg: 'bg-amber-50' },
  ]

  const bottomCards = [
    { title: 'Total Products', value: productStats?.total_products ?? 0, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'In Stock', value: productStats?.in_stock_count ?? 0, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Out of Stock', value: productStats?.out_of_stock_count ?? 0, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
    { title: 'On Sale', value: productStats?.on_sale_count ?? 0, icon: DollarSign, color: 'text-amber-600', bg: 'bg-amber-50' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Revenue & Orders */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {topCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bg}`}><Icon className={`h-4 w-4 ${stat.color}`} /></div>
              </CardHeader>
              <CardContent><div className="text-2xl font-bold">{stat.value}</div></CardContent>
            </Card>
          )
        })}
      </div>

      {/* Products */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {bottomCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bg}`}><Icon className={`h-4 w-4 ${stat.color}`} /></div>
              </CardHeader>
              <CardContent><div className="text-2xl font-bold">{stat.value}</div></CardContent>
            </Card>
          )
        })}
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Star className="h-4 w-4 text-amber-500" />Reviews</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between"><span className="text-sm text-muted-foreground">Total</span><span className="font-medium">{reviews.length}</span></div>
              <div className="flex justify-between"><span className="text-sm text-muted-foreground">Active</span><span className="font-medium text-green-600">{activeReviews}</span></div>
              <div className="flex justify-between"><span className="text-sm text-muted-foreground">Hidden</span><span className="font-medium text-gray-400">{reviews.length - activeReviews}</span></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Ticket className="h-4 w-4 text-purple-500" />Coupons</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between"><span className="text-sm text-muted-foreground">Total</span><span className="font-medium">{coupons.length}</span></div>
              <div className="flex justify-between"><span className="text-sm text-muted-foreground">Active</span><span className="font-medium text-green-600">{activeCoupons}</span></div>
              <div className="flex justify-between"><span className="text-sm text-muted-foreground">Total Uses</span><span className="font-medium">{coupons.reduce((s, c) => s + c.usage_count, 0)}</span></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">Categories</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { label: 'Men', count: productStats?.men_count ?? 0 },
                { label: 'Women', count: productStats?.women_count ?? 0 },
                { label: 'Unisex', count: productStats?.unisex_count ?? 0 },
              ].map((cat) => (
                <div key={cat.label} className="flex justify-between"><span className="text-sm text-muted-foreground">{cat.label}</span><span className="font-medium">{cat.count}</span></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
