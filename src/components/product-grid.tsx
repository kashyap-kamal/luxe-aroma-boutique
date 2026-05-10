import { Product } from "@/stores/cart-store";
import React from "react";
import ProductCard from "./product-card";

const INK = "#0E0E0C";

interface ProductGridProps {
  products: Product[];
  mobileColumns?: 1 | 2;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, mobileColumns = 2 }) => {
  return (
    <div
      style={{ borderTop: `1px solid ${INK}`, borderLeft: `1px solid ${INK}` }}
      className={`grid ${mobileColumns === 1 ? "grid-cols-1" : "grid-cols-2"} md:grid-cols-3 lg:grid-cols-4`}
    >
      {products.map((product) => (
        <div
          key={product.id}
          style={{ borderRight: `1px solid ${INK}`, borderBottom: `1px solid ${INK}` }}
        >
          <ProductCard product={product} fullWidthMobile={mobileColumns === 1} />
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
