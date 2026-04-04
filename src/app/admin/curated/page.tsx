"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { fetchAllCuratedLists, CuratedListRow } from '@/lib/curated-list-service'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Pencil, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminCuratedPage() {
  const router = useRouter()
  const [lists, setLists] = useState<CuratedListRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAllCuratedLists()
      .then(setLists)
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-serif font-bold text-gray-900">Curated Lists</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manually pick products for Bestsellers, mood categories, and more. Sales-based recommendations shown when editing.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lists.map((list) => (
                <TableRow key={list.id}>
                  <TableCell>
                    <div className="font-medium">{list.name}</div>
                    {list.description && <div className="text-xs text-muted-foreground">{list.description}</div>}
                  </TableCell>
                  <TableCell className="font-mono text-xs">{list.slug}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{list.product_ids.length} products</Badge>
                  </TableCell>
                  <TableCell>
                    {list.is_active ? (
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-600">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => router.push(`/admin/curated/edit?id=${list.id}`)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
