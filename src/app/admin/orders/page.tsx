"use client"

import { useEffect, useState } from 'react'
import { fetchOrders, OrderRow, OrderFilters } from '@/lib/order-admin-service'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Search, Loader2, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [dateRange, setDateRange] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const loadOrders = () => {
    setLoading(true)
    const filters: OrderFilters = { search: search || undefined, status: statusFilter || undefined }
    if (dateRange === 'custom' && dateFrom && dateTo) {
      filters.dateFrom = new Date(dateFrom).toISOString()
      filters.dateTo = new Date(dateTo + 'T23:59:59').toISOString()
    } else if (dateRange !== 'all') {
      filters.dateRange = dateRange as OrderFilters['dateRange']
    }
    fetchOrders(filters)
      .then(setOrders)
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadOrders() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    loadOrders()
  }

  const paymentColor = (s: string | null) => {
    switch (s) {
      case 'SUCCESS': return 'bg-green-100 text-green-800'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'FAILED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-gray-900 mb-6">Orders</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by order ID, email, or name..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
        <Select value={dateRange} onValueChange={(v) => { setDateRange(v); }}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Date range" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
        {dateRange === 'custom' && (
          <>
            <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-[150px]" />
            <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-[150px]" />
          </>
        )}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all_statuses">All Statuses</SelectItem>
            <SelectItem value="SUCCESS">Paid</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="FAILED">Failed</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={loadOrders} variant="outline">Apply</Button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Shipping</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="text-xs font-mono">{order.cashfree_order_id}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-sm">{order.customer_name}</div>
                      <div className="text-xs text-muted-foreground">{order.customer_email}</div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ₹{Number(order.order_amount).toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell>
                      <Badge className={paymentColor(order.payment_status)}>
                        {order.payment_status || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs">{order.shiprocket_status || '—'}</div>
                      {order.shiprocket_awb && (
                        <div className="text-xs text-muted-foreground">AWB: {order.shiprocket_awb}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-xs">{new Date(order.created_at).toLocaleDateString('en-IN')}</div>
                      <div className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <a href={`/admin/orders/detail?id=${order.id}`}>
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <div className="px-4 py-3 text-xs text-muted-foreground border-t">
            Showing {orders.length} order{orders.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
  )
}
