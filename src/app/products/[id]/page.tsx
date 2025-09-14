import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductById, getProducts } from "@/lib/data-service";
import { generateProductMetadata } from "@/lib/metadata";
import ProductDetailClient from "./product-detail-client";
import Loading from "@/components/ui/loading";

// Generate static params for all products
export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({
    id: product.id,
  }));
}

// Generate metadata for each product
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return generateProductMetadata(id);
}

// Server component for product detail page
export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <Suspense
      fallback={<Loading text="Loading product..." className="py-16" />}
    >
      <ProductDetailClient product={product} />
    </Suspense>
  );
}
