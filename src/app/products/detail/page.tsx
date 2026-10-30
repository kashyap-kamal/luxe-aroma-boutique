"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { fetchProductById } from "@/lib/product-service";
import type { Product } from "@/stores/cart-store";
import ProductDetailClient from "../[id]/product-detail-client";
import Loading from "@/components/ui/loading";

function ProductDetailFallbackContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    fetchProductById(id)
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <Loading text="Loading product..." className="py-24 min-h-[60vh]" />;
  }

  if (!id || !product) {
    return (
      <main className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-lg font-serif">Product not found</p>
        <Link href="/products" className="underline text-sm">
          Back to collection
        </Link>
      </main>
    );
  }

  return <ProductDetailClient product={product} />;
}

export default function ProductDetailFallbackPage(): React.JSX.Element {
  return (
    <Suspense
      fallback={<Loading text="Loading product..." className="py-24 min-h-[60vh]" />}
    >
      <ProductDetailFallbackContent />
    </Suspense>
  );
}
