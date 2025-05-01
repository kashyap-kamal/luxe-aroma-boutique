import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { Product, useCart } from "@/contexts/CartContext";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md group">
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
        </div>
        <CardContent className="p-4">
          <div className="text-sm text-gray-500 mb-1">{product.category}</div>
          <h3 className="font-serif text-lg font-medium mb-2 group-hover:text-luxe-blue transition-colors">
            {product.name}
          </h3>
          <div className="flex justify-between items-center">
            <span className="font-medium text-lg">
              ₹{product.price.toLocaleString()}
            </span>
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
        </CardContent>
      </Link>
    </Card>
  );
};

export default ProductCard;
