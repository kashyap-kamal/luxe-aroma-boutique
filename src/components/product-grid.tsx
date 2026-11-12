import { Product } from "@/stores/cart-store";
import React from "react";
import ProductCard from "./product-card";
import PlateCard from "./plate-card";

const INK = "#0E0E0C";

interface ProductGridProps {
  products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  return (
    <>
      {/* Phones: two-up plate cards */}
      <div className="grid grid-cols-2 md:hidden" style={{ gap: 1, background: "rgba(14,14,12,0.12)", borderTop: "1px solid rgba(14,14,12,0.12)" }}>
        {products.map((product) => (
          <div key={product.id} style={{ background: "#F2EDE4", paddingBottom: 18 }}>
            <PlateCard product={product} imageHeight={200} className="[&>a]:px-3" />
          </div>
        ))}
      </div>
      <div
        style={{ borderTop: `1px solid ${INK}`, borderLeft: `1px solid ${INK}` }}
        className="hidden md:grid md:grid-cols-3 lg:grid-cols-4"
      >
        {products.map((product) => (
          <div
            key={product.id}
            style={{ borderRight: `1px solid ${INK}`, borderBottom: `1px solid ${INK}` }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </>
  );
};

export default ProductGrid;
