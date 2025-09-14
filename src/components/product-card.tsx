"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Zap } from "lucide-react";
import { Product, useCartStore } from "@/stores/cart-store";
import Image from "next/image";
import { categoryNameMap } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCartStore();
  const router = useRouter();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    router.push("/cart");
  };

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md group p-0">
      <CardContent className="p-0">
        <Link href={`/products/${product.id}`} className="block">
          <div className="relative aspect-square overflow-hidden bg-gray-100">
            <Image
              src={product.image}
              alt={product.name}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              width={400}
              height={640}
            />
            <div className="absolute inset-0 bg-luxe-blue/0 group-hover:bg-luxe-blue/10 transition-all duration-300"></div>
          </div>
          <div className="p-4">
            <div className="text-sm text-gray-500 mb-1">
              {categoryNameMap(product.category)}
            </div>
            <h3 className="font-serif text-lg font-medium mb-2 group-hover:text-luxe-blue transition-colors">
              {product.name}
            </h3>
            <div className="flex flex-col space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="font-medium text-lg">
                    {product.price.currency}
                    {product.price.current.toLocaleString()}
                  </span>
                  {product.price.on_sale && (
                    <span className="text-sm text-gray-500 line-through">
                      {product.price.currency}
                      {product.price.original.toLocaleString()}
                    </span>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full hover:bg-luxe-blue hover:text-white"
                  onClick={handleAddToCart}
                >
                  <ShoppingBag className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              <Button
                size="sm"
                className="w-full bg-black hover:bg-luxe-blue text-white rounded-lg"
                onClick={handleBuyNow}
              >
                <Zap className="h-4 w-4 mr-2" />
                Buy Now
              </Button>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
