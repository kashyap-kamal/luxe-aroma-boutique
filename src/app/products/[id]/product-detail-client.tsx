"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/data-service";
import { useCartStore } from "@/stores/cart-store";
import { useProductById } from "@/hooks/use-products";
import { toast } from "sonner";
import Image from "next/image";
import { TAG_META, tagLabel } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const INK = "#0E0E0C";
const CREAM = "#F2EDE4";
const SAFFRON = "#E8763A";

const NOTE_COLORS: Record<string, string> = {
  Top: SAFFRON,
  Heart: "#E8B4B8",
  Base: "#C7905C",
};

interface ProductDetailClientProps {
  product: Product;
}

const ProductDetailClient: React.FC<ProductDetailClientProps> = ({ product: initialProduct }) => {
  const { product: hydratedProduct } = useProductById(initialProduct.id, initialProduct);
  const product = hydratedProduct ?? initialProduct;

  const router = useRouter();
  const { addToCart } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const discountPercent =
    product.price.on_sale && product.price.original > 0
      ? Math.round(((product.price.original - product.price.current) / product.price.original) * 100)
      : 0;

  const handleAddToCart = () => {
    if (added) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
    toast("Added to cart", {
      description: `${product.name} ×${quantity} added to your collection.`,
    });
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push("/cart");
  };

  const scentTags = product.tags?.filter((t) => TAG_META[t]?.group === "scent") ?? [];
  const occasionTags = product.tags?.filter((t) => TAG_META[t]?.group === "occasion") ?? [];

  return (
    <main style={{ background: CREAM, color: INK, minHeight: "100vh" }}>
      {/* Breadcrumb */}
      <div
        style={{
          padding: "16px 48px",
          borderBottom: `1px solid ${INK}`,
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: 9,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          gap: 12,
          alignItems: "center",
        }}
        className="hidden md:flex"
      >
        <Link href="/products" style={{ color: INK, opacity: 0.5, textDecoration: "none" }}>
          THE COLLECTION
        </Link>
        <span style={{ opacity: 0.3 }}>→</span>
        <span>{product.name.toUpperCase()}</span>
      </div>

      {/* Desktop: 2-column grid */}
      <div
        style={{ gridTemplateColumns: "1fr 1fr" }}
        className="hidden md:grid"
      >
        {/* Image panel */}
        <div
          style={{
            borderRight: `1px solid ${INK}`,
            position: "relative",
            background: "#EDE9E0",
            minHeight: 560,
          }}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="50vw"
            className="object-contain"
            style={{ padding: 48 }}
          />
          {discountPercent > 0 && (
            <div
              style={{
                position: "absolute",
                top: 24,
                right: 24,
                background: SAFFRON,
                color: INK,
                padding: "4px 10px",
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 10,
                letterSpacing: "0.15em",
              }}
            >
              {discountPercent}% OFF
            </div>
          )}
          <div
            style={{
              position: "absolute",
              bottom: 24,
              left: 24,
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 9,
              letterSpacing: "0.2em",
              color: INK,
              opacity: 0.4,
            }}
          >
            {product.size || "50ML"} · EAU DE PARFUM
          </div>
        </div>

        {/* Info panel */}
        <div style={{ padding: "48px" }}>
          <div
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: SAFFRON,
              marginBottom: 16,
            }}
          >
            {product.category.toUpperCase()} · AROMÉ LUXE
          </div>

          <h1
            style={{
              fontFamily: "var(--font-fraunces), serif",
              fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
              fontWeight: 300,
              lineHeight: 0.92,
              letterSpacing: "-0.03em",
              marginBottom: 24,
            }}
          >
            {product.name}
          </h1>

          {/* Price */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 12,
              marginBottom: 32,
              paddingBottom: 32,
              borderBottom: `1px solid ${INK}`,
            }}
          >
            <span style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "2rem", fontWeight: 300 }}>
              {product.price.currency}{product.price.current.toLocaleString("en-IN")}
            </span>
            {product.price.on_sale && (
              <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 13, textDecoration: "line-through", opacity: 0.4 }}>
                {product.price.currency}{product.price.original.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {product.description && (
            <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 14, lineHeight: 1.7, opacity: 0.8, marginBottom: 32 }}>
              {product.description}
            </p>
          )}

          {/* Notes grid */}
          {product.fragrance_notes && (
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 14, opacity: 0.5 }}>
                FRAGRANCE NOTES
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", border: `1px solid ${INK}` }}>
                {[
                  { tier: "Top", notes: product.fragrance_notes.top },
                  { tier: "Heart", notes: product.fragrance_notes.middle },
                  { tier: "Base", notes: product.fragrance_notes.base },
                ].map(({ tier, notes }, i) =>
                  notes?.length ? (
                    <div key={tier} style={{ padding: "14px 16px", borderRight: i < 2 ? `1px solid ${INK}` : "none" }}>
                      <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 8, letterSpacing: "0.2em", textTransform: "uppercase", color: NOTE_COLORS[tier], marginBottom: 6 }}>
                        {tier}
                      </div>
                      <div style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "0.95rem", fontWeight: 300, fontStyle: "italic", lineHeight: 1.4 }}>
                        {notes.join(", ")}
                      </div>
                    </div>
                  ) : null
                )}
              </div>
            </div>
          )}

          {/* Tags */}
          {(scentTags.length > 0 || occasionTags.length > 0) && (
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10, opacity: 0.5 }}>
                CHARACTER
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {[...scentTags, ...occasionTags].map((tag) => (
                  <Link
                    key={tag}
                    href={`/products?tag=${tag}`}
                    style={{ padding: "4px 10px", border: `1px solid ${INK}`, fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 8, letterSpacing: "0.15em", textTransform: "uppercase", color: INK, textDecoration: "none" }}
                  >
                    {tagLabel(tag)}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Qty + CTA */}
          <div style={{ paddingTop: 28, borderTop: `1px solid ${INK}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", opacity: 0.5, width: 60 }}>QTY</div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} style={{ width: 32, height: 32, border: `1px solid ${INK}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Minus style={{ width: 10, height: 10 }} />
                </button>
                <div style={{ width: 40, height: 32, border: `1px solid ${INK}`, borderLeft: "none", borderRight: "none", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 12 }}>
                  {quantity}
                </div>
                <button onClick={() => setQuantity((q) => q + 1)} style={{ width: 32, height: 32, border: `1px solid ${INK}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Plus style={{ width: 10, height: 10 }} />
                </button>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={handleBuyNow} style={{ flex: 1, background: SAFFRON, color: INK, border: "none", padding: "18px 24px", fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer" }}>
                BUY NOW →
              </button>
              <button onClick={handleAddToCart} disabled={added} style={{ flex: 1, background: added ? "transparent" : INK, color: added ? SAFFRON : CREAM, border: added ? `1px solid ${SAFFRON}` : `1px solid ${INK}`, padding: "18px 24px", fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", cursor: added ? "default" : "pointer", transition: "all 150ms" }}>
                <AnimatePresence mode="wait" initial={false}>
                  {added ? (
                    <motion.span key="added" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>ADDED ✓</motion.span>
                  ) : (
                    <motion.span key="add" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>ADD TO COLLECTION</motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="flex flex-col md:hidden">
        <div style={{ position: "relative", aspectRatio: "1", background: "#EDE9E0", borderBottom: `1px solid ${INK}` }}>
          <Image src={product.image} alt={product.name} fill sizes="100vw" className="object-contain" style={{ padding: 32 }} />
          {discountPercent > 0 && (
            <div style={{ position: "absolute", top: 16, right: 16, background: SAFFRON, color: INK, padding: "3px 8px", fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 9, letterSpacing: "0.15em" }}>
              {discountPercent}% OFF
            </div>
          )}
        </div>

        <div style={{ padding: "24px 20px 100px" }}>
          <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: SAFFRON, marginBottom: 10 }}>
            {product.category.toUpperCase()} · AROMÉ LUXE
          </div>
          <h1 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "2.2rem", fontWeight: 300, lineHeight: 0.92, letterSpacing: "-0.03em", marginBottom: 20 }}>
            {product.name}
          </h1>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 24, paddingBottom: 24, borderBottom: `1px solid ${INK}` }}>
            <span style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "1.6rem", fontWeight: 300 }}>
              {product.price.currency}{product.price.current.toLocaleString("en-IN")}
            </span>
            {product.price.on_sale && (
              <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 11, textDecoration: "line-through", opacity: 0.4 }}>
                {product.price.currency}{product.price.original.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {product.description && (
            <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, lineHeight: 1.7, opacity: 0.8, marginBottom: 24 }}>
              {product.description}
            </p>
          )}

          {product.fragrance_notes && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 8, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.5, marginBottom: 10 }}>NOTES</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", border: `1px solid ${INK}` }}>
                {[
                  { tier: "Top", notes: product.fragrance_notes.top },
                  { tier: "Heart", notes: product.fragrance_notes.middle },
                  { tier: "Base", notes: product.fragrance_notes.base },
                ].map(({ tier, notes }, i) =>
                  notes?.length ? (
                    <div key={tier} style={{ padding: "10px 12px", borderRight: i < 2 ? `1px solid ${INK}` : "none" }}>
                      <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 7, letterSpacing: "0.2em", textTransform: "uppercase", color: NOTE_COLORS[tier], marginBottom: 4 }}>{tier}</div>
                      <div style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "0.85rem", fontWeight: 300, fontStyle: "italic" }}>{(notes ?? []).slice(0, 2).join(", ")}</div>
                    </div>
                  ) : null
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sticky CTA */}
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: CREAM, borderTop: `1px solid ${INK}`, padding: "12px 20px", display: "flex", gap: 10, zIndex: 40 }}>
          <button onClick={handleBuyNow} style={{ flex: 1, background: SAFFRON, color: INK, border: "none", padding: "14px", fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}>
            BUY NOW →
          </button>
          <button onClick={handleAddToCart} disabled={added} style={{ flex: 1, background: added ? "transparent" : INK, color: added ? SAFFRON : CREAM, border: added ? `1px solid ${SAFFRON}` : "none", padding: "14px", fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", cursor: added ? "default" : "pointer", transition: "all 150ms" }}>
            {added ? "ADDED ✓" : "ADD TO CART"}
          </button>
        </div>
      </div>
    </main>
  );
};

export default ProductDetailClient;
