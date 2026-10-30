"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, DollarSign, TrendingUp, AlertTriangle, ShoppingBag, IndianRupee, Star, Ticket, Truck, Sparkles, BarChart3, Users, Eye } from 'lucide-react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { fetchProductStats, fetchProducts } from '@/lib/product-service'
import { Product } from '@/stores/cart-store'
import { fetchOrders, fetchOrderStats, OrderRow, OrderStats } from '@/lib/order-admin-service'
import { fetchAnalyticsFunnel } from '@/lib/analytics-service'
import { buildIstRevenueSeries, computeTopSoldItems, summarizeAnalyticsFunnel, type AnalyticsFunnelSummary } from '@/lib/admin-reporting'
import { fetchAllCoupons, CouponRow } from '@/lib/coupon-service'
import { fetchAllReviews, ReviewRow } from '@/lib/review-service'
import { getFreeShipping, getShippingRate, getSetting, updateSetting, FreeShippingSetting, ShippingRateSetting } from '@/lib/settings-service'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

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
  const [freeShipping, setFreeShipping] = useState<FreeShippingSetting>({ enabled: true, threshold: 0 })
  const [shippingRate, setShippingRate] = useState<ShippingRateSetting>({ amount: 49, currency: '₹' })
  const [savingShipping, setSavingShipping] = useState(false)
  const [loading, setLoading] = useState(true)
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [spotlightId, setSpotlightId] = useState<string>('')
  const [savingSpotlight, setSavingSpotlight] = useState(false)
  const [recentOrders, setRecentOrders] = useState<OrderRow[]>([])
  const [chartDays, setChartDays] = useState<7 | 30>(7)
  const [funnel, setFunnel] = useState<AnalyticsFunnelSummary>(() => summarizeAnalyticsFunnel([]))

  useEffect(() => {
    Promise.all([
      fetchProductStats().then((d) => setProductStats(d as ProductStats)).catch(() => {}),
      fetchOrderStats().then(setOrderStats).catch(() => {}),
      fetchAllCoupons().then(setCoupons).catch(() => {}),
      fetchAllReviews().then(setReviews).catch(() => {}),
      getFreeShipping().then(setFreeShipping).catch(() => {}),
      getShippingRate().then(setShippingRate).catch(() => {}),
      fetchProducts().then(setAllProducts).catch(() => {}),
      getSetting<string>('spotlight_product_id').then((id) => { if (id) setSpotlightId(id) }).catch(() => {}),
      fetchOrders({ dateRange: 'month' }).then(setRecentOrders).catch(() => {}),
      fetchAnalyticsFunnel(30).then(setFunnel).catch(() => {}),
    ]).finally(() => setLoading(false))
  }, [])

  const handleFreeShippingToggle = async (enabled: boolean) => {
    setSavingShipping(true)
    const updated = { ...freeShipping, enabled }
    setFreeShipping(updated)
    try {
      await updateSetting('free_shipping', updated)
    } catch { /* revert on error */ setFreeShipping((prev) => ({ ...prev, enabled: !enabled })) }
    finally { setSavingShipping(false) }
  }

  const handleShippingThreshold = async (threshold: number) => {
    const updated = { ...freeShipping, threshold }
    setFreeShipping(updated)
    try { await updateSetting('free_shipping', updated) } catch {}
  }

  const handleShippingRate = async (amount: number) => {
    const updated = { ...shippingRate, amount }
    setShippingRate(updated)
    try { await updateSetting('shipping_rate', updated) } catch {}
  }

  const handleSpotlightSave = async () => {
    setSavingSpotlight(true)
    try { await updateSetting('spotlight_product_id', spotlightId) } catch {}
    finally { setSavingSpotlight(false) }
  }

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
  const revenueSeries = buildIstRevenueSeries(recentOrders as unknown as Record<string, unknown>[], chartDays)
  const periodRevenue = revenueSeries.reduce((sum, b) => sum + b.revenue, 0)
  const topSoldItems = computeTopSoldItems(recentOrders as unknown as Record<string, unknown>[], 5)

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

      {/* Paid Revenue Chart (IST) & Storefront Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-emerald-600" />
                Paid Revenue (IST)
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Last {chartDays} days: ₹{periodRevenue.toLocaleString('en-IN')} across paid orders only
              </p>
            </div>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant={chartDays === 7 ? 'default' : 'outline'}
                onClick={() => setChartDays(7)}
              >
                7D
              </Button>
              <Button
                size="sm"
                variant={chartDays === 30 ? 'default' : 'outline'}
                onClick={() => setChartDays(30)}
              >
                30D
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueSeries} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${v}`} width={60} />
                  <Tooltip
                    formatter={(value: number) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Paid Revenue']}
                  />
                  <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-4 w-4 text-indigo-600" />
              30D Visitor Funnel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Unique Visitors</span>
                <span className="font-semibold">{funnel.uniqueVisitors}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Product / Bundle Views</span>
                <span className="font-semibold">{funnel.productViews}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Added to Cart</span>
                <span className="font-semibold">{funnel.addToCarts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Checkout Started</span>
                <span className="font-semibold">{funnel.checkoutsStarted}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Completed Purchases</span>
                <span className="font-semibold text-emerald-600">{funnel.purchases}</span>
              </div>
              <div className="pt-2 border-t flex justify-between">
                <span className="text-muted-foreground">Visitor to Paid Rate</span>
                <span className="font-semibold">{funnel.conversionRate}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top 5 Sold & Top 5 Viewed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              Top 5 Best Sellers (30D Paid)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topSoldItems.length === 0 ? (
              <p className="text-sm text-muted-foreground">No paid items recorded in the last 30 days.</p>
            ) : (
              <div className="space-y-2 text-sm">
                {topSoldItems.map((item) => (
                  <div key={item.name} className="flex justify-between items-center py-1 border-b last:border-0">
                    <span className="truncate pr-3 font-medium">{item.name}</span>
                    <span className="text-muted-foreground whitespace-nowrap">
                      {item.units} sold · ₹{item.revenue.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Eye className="h-4 w-4 text-blue-600" />
              Top 5 Most Viewed (30D)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {funnel.topViewed.length === 0 ? (
              <p className="text-sm text-muted-foreground">Views will populate as shoppers browse product pages.</p>
            ) : (
              <div className="space-y-2 text-sm">
                {funnel.topViewed.map((item) => (
                  <div key={item.name} className="flex justify-between items-center py-1 border-b last:border-0">
                    <span className="truncate pr-3 font-medium">{item.name}</span>
                    <span className="text-muted-foreground whitespace-nowrap">{item.views} views</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
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

      {/* Shipping Settings */}
      <div className="mb-6">
        <Card>
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Truck className="h-4 w-4 text-blue-500" />Shipping Settings</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="flex items-center gap-3">
                <Switch
                  id="free-shipping"
                  checked={freeShipping.enabled}
                  onCheckedChange={handleFreeShippingToggle}
                  disabled={savingShipping}
                />
                <Label htmlFor="free-shipping" className="cursor-pointer font-medium">
                  Free shipping for all customers
                </Label>
              </div>
              {!freeShipping.enabled && (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="threshold" className="text-sm text-muted-foreground whitespace-nowrap">Free above ₹</Label>
                    <Input
                      id="threshold"
                      type="number"
                      min={0}
                      className="w-24 h-8"
                      value={freeShipping.threshold}
                      onChange={(e) => handleShippingThreshold(Number(e.target.value))}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="rate" className="text-sm text-muted-foreground whitespace-nowrap">Flat rate ₹</Label>
                    <Input
                      id="rate"
                      type="number"
                      min={0}
                      className="w-24 h-8"
                      value={shippingRate.amount}
                      onChange={(e) => handleShippingRate(Number(e.target.value))}
                    />
                  </div>
                </div>
              )}
              <span className="text-xs text-muted-foreground">
                {freeShipping.enabled
                  ? 'All orders ship free'
                  : freeShipping.threshold > 0
                    ? `Free above ₹${freeShipping.threshold}, otherwise ₹${shippingRate.amount}`
                    : `Flat ₹${shippingRate.amount} per order`}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Spotlight Product */}
      <div className="mb-6">
        <Card>
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Sparkles className="h-4 w-4 text-amber-500" />Homepage Spotlight Product</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <Label htmlFor="spotlight-select" className="text-sm text-muted-foreground mb-2 block">Featured product on homepage</Label>
                <Select value={spotlightId} onValueChange={setSpotlightId}>
                  <SelectTrigger id="spotlight-select" className="w-full sm:max-w-xs">
                    <SelectValue placeholder="Select a product…" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Default (first featured product)</SelectItem>
                    {allProducts.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSpotlightSave} disabled={savingSpotlight} className="sm:self-end">
                {savingSpotlight ? 'Saving…' : 'Save'}
              </Button>
              {spotlightId && (
                <span className="text-xs text-muted-foreground">
                  {allProducts.find((p) => p.id === spotlightId)?.name ?? spotlightId}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
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
