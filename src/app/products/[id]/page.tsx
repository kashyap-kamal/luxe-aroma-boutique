"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { getProductById } from "@/lib/mock-data";
import { useCartStore } from "@/stores/cart-store";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const router.to = useRouter();
  const { addToCart } = useCartStore();
  const [quantity, setQuantity] = useState(1);

  const product = id ? getProductById(id) : undefined;

  if (!product) {
    return (
      <main className="flex-grow py-16">
        <div className="luxury-container text-center">
          <h1 className="text-2xl font-medium mb-4">Product Not Found</h1>
          <p className="mb-8">
            Sorry, we couldn't find the product you were looking for.
          </p>
          <Button asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </main>
    );
  }

  const handleIncreaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast("Added to cart", {
      description: `${product.name} (${quantity}) has been added to your cart.`,
      duration: 3000,
    });
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.to.push("/cart");
  };

  return (
    <main className="flex-grow py-8">
      <div className="luxury-container">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Product Image */}
          <div className="w-full lg:w-1/2">
            <div className="bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-auto object-cover aspect-square"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="w-full lg:w-1/2">
            <div className="flex items-center mb-4">
              <Link href="/products" className="text-luxe-blue hover:underline">
                Back to Products
              </Link>
            </div>

            <h1 className="text-3xl font-serif font-bold mb-2">
              {product.name}
            </h1>
            <div className="flex items-center mb-4">
              <div className="text-2xl font-medium">
                ₹{product.price.toLocaleString()}
              </div>
              <div className="ml-4 inline-block px-4 py-2 border border-luxe-blue rounded-md bg-luxe-blue/10 text-luxe-blue">
                In Stock
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Description</h3>
              <p className="text-gray-700">{product.description}</p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Size</h3>
              <div className="inline-block px-4 py-2 border border-luxe-blue rounded-md bg-luxe-blue/10 text-luxe-blue">
                {product.size}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-medium mb-2">Quantity</h3>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleDecreaseQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleIncreaseQuantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                className="flex-1 bg-amber-600/0 text-luxe-black hover:bg-amber-600 cursor-pointer"
                size="lg"
                onClick={handleBuyNow}
              >
                Buy Now
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-luxe-blue text-luxe-blue hover:bg-luxe-blue hover:text-white"
                size="lg"
                onClick={handleAddToCart}
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetail;
