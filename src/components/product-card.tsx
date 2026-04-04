"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Check } from "lucide-react";
import { Product, useCartStore } from "@/stores/cart-store";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCartStore();
  const [added, setAdded] = useState(false);

  const discountPercent =
    product.price.on_sale && product.price.original > 0
      ? Math.round(
          ((product.price.original - product.price.current) /
            product.price.original) *
            100
        )
      : 0;

  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      addToCart(product, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    },
    [addToCart, product]
  );


  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md group p-0">
      <CardContent className="p-0">
        <Link href={`/products/${product.id}`} className="block">
          <div className="relative aspect-square overflow-hidden bg-gray-50">
            <Image
              src={product.image}
              alt={product.name}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              width={400}
              height={640}
            />
            <div className="absolute inset-0 bg-luxe-blue/0 group-hover:bg-luxe-blue/5 transition-all duration-300" />
            {discountPercent > 0 && (
              <span className="absolute top-2 left-2 bg-green-100 text-green-700 text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 rounded">
                {discountPercent}% OFF
              </span>
            )}
          </div>
          <div className="p-3 sm:p-4">
            <h3 className="font-serif text-sm sm:text-lg font-medium mb-2 group-hover:text-luxe-blue transition-colors line-clamp-1 sm:line-clamp-2">
              {product.name}
            </h3>

            {/* Price */}
            <div className="flex items-baseline gap-1.5 mb-2">
              <span className="font-semibold text-base sm:text-lg">
                {product.price.currency}
                {product.price.current.toLocaleString()}
              </span>
              {product.price.on_sale && (
                <span className="text-[10px] sm:text-sm text-gray-400 line-through">
                  {product.price.currency}
                  {product.price.original.toLocaleString()}
                </span>
              )}
            </div>

            {/* Full-width Add to Bag */}
            <motion.div
              animate={added ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <Button
                size="sm"
                className={`w-full rounded-lg min-h-[40px] sm:min-h-[44px] text-xs sm:text-sm transition-all duration-300 ${
                  added
                    ? "bg-green-50 text-green-700 border border-green-500 hover:bg-green-50 hover:text-green-700"
                    : "bg-luxe-blue text-white hover:bg-luxe-violet"
                }`}
                onClick={handleAddToCart}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {added ? (
                    <motion.span
                      key="added"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="flex items-center gap-1"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>Added!</span>
                    </motion.span>
                  ) : (
                    <motion.span
                      key="add"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="flex items-center gap-1.5"
                    >
                      <ShoppingBag className="h-3.5 w-3.5" />
                      <span>Add to Bag</span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
