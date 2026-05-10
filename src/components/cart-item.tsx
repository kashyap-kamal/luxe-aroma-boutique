import React from "react";
import Link from "next/link";
import { CartItem as CartItemType, useCartStore } from "@/stores/cart-store";
import { Minus, Plus, X } from "lucide-react";
import Image from "next/image";

const INK = "#0E0E0C";
const CREAM = "#F2EDE4";
const SAFFRON = "#E8763A";

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCartStore();
  const { product, quantity } = item;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "80px 1fr auto",
        gap: 16,
        padding: "20px 0",
        borderBottom: `1px solid ${INK}`,
        alignItems: "start",
      }}
    >
      {/* Image */}
      <Link href={`/products/${product.id}`}>
        <div style={{ background: "#EDE9E0", aspectRatio: "1", overflow: "hidden" }}>
          <Image
            src={product.image}
            alt={product.name}
            width={80}
            height={80}
            className="object-cover w-full h-full"
          />
        </div>
      </Link>

      {/* Info */}
      <div>
        <Link href={`/products/${product.id}`}>
          <div
            style={{
              fontFamily: "var(--font-fraunces), serif",
              fontSize: "1rem",
              fontWeight: 300,
              color: INK,
              letterSpacing: "-0.01em",
              marginBottom: 4,
            }}
          >
            {product.name}
          </div>
        </Link>
        {product.size && (
          <div
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 9,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              opacity: 0.5,
              color: INK,
              marginBottom: 12,
            }}
          >
            {product.size}
          </div>
        )}

        {/* Qty controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
          <button
            onClick={() => quantity > 1 ? updateQuantity(product.id, quantity - 1) : removeFromCart(product.id)}
            style={{
              width: 28,
              height: 28,
              border: `1px solid ${INK}`,
              background: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Minus style={{ width: 10, height: 10 }} />
          </button>
          <div
            style={{
              width: 36,
              height: 28,
              border: `1px solid ${INK}`,
              borderLeft: "none",
              borderRight: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 11,
              color: INK,
            }}
          >
            {quantity}
          </div>
          <button
            onClick={() => updateQuantity(product.id, quantity + 1)}
            style={{
              width: 28,
              height: 28,
              border: `1px solid ${INK}`,
              background: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Plus style={{ width: 10, height: 10 }} />
          </button>
        </div>
      </div>

      {/* Price + remove */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
        <button
          onClick={() => removeFromCart(product.id)}
          style={{ background: "none", border: "none", cursor: "pointer", opacity: 0.4, padding: 0 }}
        >
          <X style={{ width: 14, height: 14, color: INK }} />
        </button>
        <div
          style={{
            fontFamily: "var(--font-fraunces), serif",
            fontSize: "1rem",
            fontWeight: 300,
            color: INK,
          }}
        >
          {product.price.currency}{(product.price.current * quantity).toLocaleString("en-IN")}
        </div>
        {product.price.on_sale && (
          <div
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 9,
              textDecoration: "line-through",
              opacity: 0.4,
              color: INK,
            }}
          >
            {product.price.currency}{(product.price.original * quantity).toLocaleString("en-IN")}
          </div>
        )}
      </div>
    </div>
  );
};

export default CartItem;
