"use client"

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { fetchAllCuratedLists, updateCuratedList, fetchSalesRecommendations, CuratedListRow } from '@/lib/curated-list-service'
import { fetchProductRows, ProductRow } from '@/lib/product-service'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Loader2, TrendingUp, Plus, X } from 'lucide-react'
import { toast } from 'sonner'

function EditCuratedContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const id = searchParams.get('id')

  const [list, setList] = useState<CuratedListRow | null>(null)
  const [allProducts, setAllProducts] = useState<ProductRow[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isActive, setIsActive] = useState(true)
  const [recommendations, setRecommendations] = useState<Array<{ productId: string; productName: string; count: number }>>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!id) { setLoading(false); return }
    Promise.all([
      fetchAllCuratedLists(),
      fetchProductRows(),
      fetchSalesRecommendations(10),
    ]).then(([lists, products, recs]) => {
      const found = lists.find((l) => l.id === id)
      if (found) {
        setList(found)
        setSelectedIds(found.product_ids)
        setIsActive(found.is_active)
      }
      setAllProducts(products)
      setRecommendations(recs)
    }).catch((err) => toast.error(err.message))
      .finally(() => setLoading(false))
  }, [id])

  const toggleProduct = (pid: string) => {
    setSelectedIds((prev) =>
      prev.includes(pid) ? prev.filter((p) => p !== pid) : [...prev, pid]
    )
  }

  const addFromRec = (pid: string) => {
    if (!selectedIds.includes(pid)) {
      setSelectedIds((prev) => [...prev, pid])
    }
  }

  const handleSave = async () => {
    if (!list) return
    setSaving(true)
    try {
      await updateCuratedList(list.id, selectedIds, isActive)
      toast.success(`${list.name} updated`)
      router.push('/admin/curated')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed')
    } finally { setSaving(false) }
  }

  if (!id) return <p className="text-muted-foreground">No list ID provided.</p>
  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
  if (!list) return <p className="text-muted-foreground">List not found.</p>

  const productMap = new Map(allProducts.map((p) => [p.id, p]))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{list.name}</h2>
          <p className="text-sm text-muted-foreground">{list.description} &middot; <span className="font-mono">{list.slug}</span></p>
        </div>
        <div className="flex items-center gap-3">
          <Label htmlFor="active" className="text-sm">Active</Label>
          <Switch id="active" checked={isActive} onCheckedChange={setIsActive} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Selected products */}
        <div className="lg:col-span-2 bg-white rounded-lg border p-4">
          <h3 className="font-semibold text-sm mb-3">Selected Products ({selectedIds.length})</h3>
          {selectedIds.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">No products selected. Pick from the list below or add from recommendations.</p>
          ) : (
            <div className="space-y-2">
              {selectedIds.map((pid, i) => {
                const p = productMap.get(pid)
                return (
                  <div key={pid} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                    <span className="text-xs text-muted-foreground w-5">{i + 1}.</span>
                    <span className="flex-1 text-sm font-medium">{p?.name || pid}</span>
                    <Badge variant="secondary" className="text-xs capitalize">{p?.category}</Badge>
                    <span className="text-xs text-muted-foreground">{p?.currency}{Number(p?.price_current).toLocaleString('en-IN')}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toggleProduct(pid)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )
              })}
            </div>
          )}

          {/* All products checklist */}
          <h3 className="font-semibold text-sm mt-6 mb-3">All Products</h3>
          <div className="space-y-1 max-h-[300px] overflow-y-auto">
            {allProducts.map((p) => (
              <label key={p.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <Checkbox checked={selectedIds.includes(p.id)} onCheckedChange={() => toggleProduct(p.id)} />
                <span className="text-sm flex-1">{p.name}</span>
                <Badge variant="secondary" className="text-xs capitalize">{p.category}</Badge>
              </label>
            ))}
          </div>
        </div>

        {/* Recommendations panel */}
        <div className="bg-white rounded-lg border p-4">
          <h3 className="font-semibold text-sm mb-1 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-600" /> Sales Recommendations
          </h3>
          <p className="text-xs text-muted-foreground mb-4">Based on order history. Click + to add.</p>
          {recommendations.length === 0 ? (
            <p className="text-xs text-muted-foreground">No sales data yet.</p>
          ) : (
            <div className="space-y-2">
              {recommendations.map((rec) => (
                <div key={rec.productId} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <span className="flex-1 text-sm">{rec.productName}</span>
                  <Badge variant="secondary" className="text-xs">{rec.count} sold</Badge>
                  {!selectedIds.includes(rec.productId) ? (
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => addFromRec(rec.productId)}>
                      <Plus className="h-3 w-3" />
                    </Button>
                  ) : (
                    <span className="text-xs text-green-600">Added</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          Save Changes
        </Button>
        <Button variant="outline" onClick={() => router.push('/admin/curated')}>Cancel</Button>
      </div>
    </div>
  )
}

export default function EditCuratedPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/curated"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <h1 className="text-2xl font-serif font-bold text-gray-900">Edit Curated List</h1>
      </div>
      <Suspense fallback={<div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>}>
        <EditCuratedContent />
      </Suspense>
    </div>
  )
}
