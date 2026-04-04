"use client";

import { useState, useEffect } from "react";
import { Product } from "@/stores/cart-store";
import {
  fetchProducts,
  fetchProductById,
  fetchFeaturedProducts,
} from "@/lib/product-service";

/**
 * Hydrates build-time products with live data from Supabase.
 * Accepts static products as initial state (zero layout shift),
 * then replaces with DB data on mount.
 */
export function useProducts(
  initialProducts: Product[],
  options?: { featured?: boolean; limit?: number }
) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      try {
        const fetcher = options?.featured
          ? () => fetchFeaturedProducts(options.limit ?? 8)
          : fetchProducts;

        const dbProducts = await fetcher();
        if (!cancelled && dbProducts.length > 0) {
          setProducts(dbProducts);
        }
      } catch {
        // Supabase unreachable — keep build-time data
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    hydrate();
    return () => {
      cancelled = true;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { products, isLoading };
}

/**
 * Hydrates a single build-time product with live data from Supabase.
 */
export function useProductById(
  id: string,
  initialProduct: Product | null
) {
  const [product, setProduct] = useState<Product | null>(initialProduct);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      try {
        const dbProduct = await fetchProductById(id);
        if (!cancelled && dbProduct) {
          setProduct(dbProduct);
        }
      } catch {
        // Keep build-time data
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    hydrate();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return { product, isLoading };
}
