"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Check, Plus } from "lucide-react";
import { toast } from "sonner";
import { Product, useCartStore } from "@/stores/cart-store";

const INK = "#0E0E0C";
const CREAM = "#F2EDE4";

/** Warm studio plate the bottle photos sit on (white photo backgrounds multiply into it). */
export const PLATE_BG = "radial-gradient(120% 80% at 50% 55%, #F7F2EA 0%, #EAE3D7 70%)";

export function PriceLine({ product, size = 15 }: { product: Product; size?: number }): React.JSX.Element {
  const { currency, current, original, on_sale } = product.price;
  return (
    <span style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 300, fontSize: size, color: INK }}>
      {currency}
      {current.toLocaleString("en-IN")}
      {on_sale && original > current && (
        <span style={{ fontSize: "0.78em", textDecoration: "line-through", opacity: 0.45, marginLeft: 6 }}>
          {currency}
          {original.toLocaleString("en-IN")}
        </span>
      )}
    </span>
  );
}

/** Square "+" that adds one unit to the bag; sits on a product image. */
export function AddButton({ product, className = "" }: { product: Product; className?: string }): React.JSX.Element {
  const { addToCart } = useCartStore();
  const [added, setAdded] = useState(false);

  const add = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (added) return;
    addToCart(product, 1);
    setAdded(true);
    toast.success(`${product.name} added to bag`);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <button
      type="button"
      onClick={add}
      aria-label={`Add ${product.name} to bag`}
      className={`grid place-items-center ${className}`}
      style={{ width: 40, height: 40, background: added ? INK : CREAM, color: added ? CREAM : INK, border: "1px solid rgba(14,14,12,0.18)" }}
    >
      {added ? <Check className="h-4 w-4" strokeWidth={1.5} /> : <Plus className="h-4 w-4" strokeWidth={1.5} />}
    </button>
  );
}

/** Mobile product card: bottle on a plate, quiet add button, notes, name, price. */
export default function PlateCard({
  product,
  imageHeight = 230,
  className = "",
}: {
  product: Product;
  imageHeight?: number;
  className?: string;
}): React.JSX.Element {
  const notes = (product.fragrance_notes?.top ?? []).slice(0, 3).join(" · ");
  const href = `/products/${product.id}`;

  return (
    <div className={`flex flex-col gap-2.5 ${className}`}>
      <div className="relative overflow-hidden" style={{ height: imageHeight, background: PLATE_BG }}>
        <Link href={href} aria-label={product.name} className="absolute inset-0">
          {product.image && (
            <Image src={product.image} alt={product.name} fill sizes="60vw" loading="lazy" className="object-contain mix-blend-multiply p-4" />
          )}
        </Link>
        <AddButton product={product} className="absolute right-2.5 bottom-2.5" />
      </div>
      <Link href={href} className="flex flex-col gap-1" style={{ color: INK }}>
        <span
          style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.55, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", minHeight: 13 }}
        >
          {notes}
        </span>
        <span style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 300, fontSize: 18, lineHeight: 1.15, letterSpacing: "-0.01em" }}>
          {product.name}
        </span>
        <PriceLine product={product} size={15} />
      </Link>
    </div>
  );
}
