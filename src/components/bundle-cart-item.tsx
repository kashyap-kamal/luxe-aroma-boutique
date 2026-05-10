import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BundleCartItem as BundleCartItemType, useCartStore } from "@/stores/cart-store";
import { Minus, Plus, Trash2 } from "lucide-react";

interface BundleCartItemProps {
  item: BundleCartItemType;
}

const BundleCartItem: React.FC<BundleCartItemProps> = ({ item }) => {
  const { updateBundleQuantity, removeBundleFromCart } = useCartStore();
  const { bundle, quantity } = item;

  const handleIncrease = () => updateBundleQuantity(bundle.id, quantity + 1);
  const handleDecrease = () => {
    if (quantity > 1) {
      updateBundleQuantity(bundle.id, quantity - 1);
    } else {
      removeBundleFromCart(bundle.id);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center py-4 border-b">
      <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded overflow-hidden mr-4 mb-3 sm:mb-0">
        <Link href={`/bundles/${bundle.id}`}>
          {bundle.imageUrl ? (
            <Image
              src={bundle.imageUrl}
              alt={bundle.name}
              className="w-full h-full object-cover"
              width={96}
              height={96}
            />
          ) : (
            <div className="w-full h-full flex flex-wrap">
              {bundle.items.slice(0, 4).map((bi, i) => (
                <div key={i} className="w-1/2 h-1/2 overflow-hidden bg-gray-200">
                  <Image
                    src={bi.product.image}
                    alt={bi.product.name}
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          )}
        </Link>
      </div>

      <div className="flex-grow">
        <Link href={`/bundles/${bundle.id}`}>
          <h3 className="font-medium text-lg mb-0.5 hover:text-luxe-blue transition-colors">
            {bundle.name}
          </h3>
        </Link>
        <p className="text-gray-500 text-xs mb-2 capitalize">
          {bundle.bundleType.replace(/_/g, " ")} · {bundle.items.length} fragrances
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={handleDecrease}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="text-center w-6">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={handleIncrease}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-red-500"
            onClick={() => removeBundleFromCart(bundle.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-shrink-0 mt-2 sm:mt-0 font-medium text-right">
        {bundle.price.currency}
        {(bundle.price.current * quantity).toLocaleString()}
      </div>
    </div>
  );
};

export default BundleCartItem;
