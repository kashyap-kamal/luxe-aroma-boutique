"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { fetchAllCoupons, deleteCoupon, CouponRow } from '@/lib/coupon-service'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

function isExpired(c: CouponRow): boolean {
  if (c.ends_at && new Date(c.ends_at) < new Date()) return true
  if (c.usage_limit && c.usage_count >= c.usage_limit) return true
  return false
}

function isActiveCoupon(c: CouponRow): boolean {
  return c.is_active && !isExpired(c)
}

export default function AdminCouponsPage() {
  const router = useRouter()
  const [coupons, setCoupons] = useState<CouponRow[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [tab, setTab] = useState<'active' | 'history'>('active')

  useEffect(() => {
    fetchAllCoupons()
      .then(setCoupons)
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      await deleteCoupon(deleteId)
      setCoupons((prev) => prev.filter((c) => c.id !== deleteId))
      toast.success('Coupon deleted')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed')
    } finally { setDeleting(false); setDeleteId(null) }
  }

  const filtered = coupons.filter((c) =>
    tab === 'active' ? isActiveCoupon(c) : !isActiveCoupon(c)
  )

  const activeCount = coupons.filter(isActiveCoupon).length
  const historyCount = coupons.length - activeCount

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-serif font-bold text-gray-900">Coupons</h1>
        <Link href="/admin/coupons/new"><Button className="gap-2"><Plus className="h-4 w-4" />Add Coupon</Button></Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
        <button
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${tab === 'active' ? 'bg-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          onClick={() => setTab('active')}
        >
          Active ({activeCount})
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${tab === 'history' ? 'bg-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          onClick={() => setTab('history')}
        >
          History ({historyCount})
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Min Order</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  {tab === 'active' ? 'No active coupons.' : 'No expired or inactive coupons.'}
                </TableCell></TableRow>
              ) : (
                filtered.map((coupon) => (
                  <TableRow key={coupon.id}>
                    <TableCell className="font-mono font-bold">{coupon.code}</TableCell>
                    <TableCell>
                      {coupon.discount_type === 'percentage'
                        ? `${Number(coupon.discount_value)}%`
                        : `₹${Number(coupon.discount_value).toLocaleString('en-IN')}`}
                      {coupon.max_discount_amount && (
                        <span className="text-xs text-muted-foreground ml-1">(max ₹{Number(coupon.max_discount_amount)})</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {coupon.min_order_amount ? `₹${Number(coupon.min_order_amount).toLocaleString('en-IN')}` : '—'}
                    </TableCell>
                    <TableCell>
                      {coupon.usage_count}{coupon.usage_limit ? ` / ${coupon.usage_limit}` : ' / ∞'}
                    </TableCell>
                    <TableCell>
                      {isActiveCoupon(coupon) ? (
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      ) : isExpired(coupon) ? (
                        <Badge className="bg-gray-100 text-gray-600">Expired</Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-800">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-xs">
                      {coupon.starts_at ? new Date(coupon.starts_at).toLocaleDateString('en-IN') : '—'}
                      {' → '}
                      {coupon.ends_at ? new Date(coupon.ends_at).toLocaleDateString('en-IN') : '∞'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => router.push(`/admin/coupons/edit?id=${coupon.id}`)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => setDeleteId(coupon.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete Coupon</AlertDialogTitle>
            <AlertDialogDescription>This will permanently remove this coupon and its usage history.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-red-600 hover:bg-red-700">
              {deleting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
