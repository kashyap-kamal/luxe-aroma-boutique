import React from "react";
import { products } from "@/lib/mock-data";
import ProductDetailClient from "./product-detail-client";

// Generate static params for all products (required for static export)
export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

// Server component that handles static generation
const ProductDetail = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <ProductDetailClient id={id} />;
};

export default ProductDetail;
