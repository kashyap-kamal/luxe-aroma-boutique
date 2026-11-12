"use client";

import React, { useEffect, useState } from "react";
import { trackEvent } from "@/lib/analytics-service";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/data-service";
import { useCartStore } from "@/stores/cart-store";
import { useProductById, useProducts } from "@/hooks/use-products";
import ProductGrid from "@/components/product-grid";
import { PLATE_BG, PriceLine } from "@/components/plate-card";
import { toast } from "sonner";
import Image from "next/image";
import { TAG_META, tagLabel } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useViewportMode } from "@/hooks/use-viewport-mode";

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
  const { showDesktop, showMobile } = useViewportMode();

  const router = useRouter();
  const { addToCart } = useCartStore();
  const [quantity, setQuantity] = useState(1);

  const currentPrice = product.price.current;

  useEffect(() => {
    trackEvent({
      eventType: "product_view",
      productId: product.id,
      itemName: product.name,
      valueInr: currentPrice,
    });
  }, [product.id, product.name, currentPrice]);
  const [added, setAdded] = useState(false);
  // Mobile buy bar turns into "View bag" once something was added, and stays that way
  const [inBag, setInBag] = useState(false);

  const discountPercent =
    product.price.on_sale && product.price.original > 0
      ? Math.round(((product.price.original - product.price.current) / product.price.original) * 100)
      : 0;

  const handleAddToCart = () => {
    if (added) return;
    addToCart(product, quantity);
    setAdded(true);
    setInBag(true);
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
  const notes = product.fragrance_notes;
  const hasNotes = !!(notes?.top?.length || notes?.middle?.length || notes?.base?.length);

  // Related: same category first, then most shared tags
  const { products: catalogue } = useProducts([]);
  const related = catalogue
    .filter((p) => p.id !== product.id)
    .map((p) => ({
      p,
      score:
        (p.category === product.category ? 2 : 0) +
        (p.tags ?? []).filter((t) => product.tags?.includes(t)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(({ p }) => p);

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
          {showDesktop && (
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="50vw"
              className="object-contain mix-blend-multiply"
              style={{ padding: 48 }}
            />
          )}
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
          {hasNotes && notes && (
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 14, opacity: 0.5 }}>
                FRAGRANCE NOTES
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", border: `1px solid ${INK}` }}>
                {[
                  { tier: "Top", notes: notes.top },
                  { tier: "Heart", notes: notes.middle },
                  { tier: "Base", notes: notes.base },
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

      {/* Mobile layout: plate, title, wear guide, one buy bar */}
      <div className="flex flex-col md:hidden">
        <div className="relative" style={{ height: 380, background: PLATE_BG }}>
          {showMobile && product.image && (
            <Image src={product.image} alt={product.name} fill priority sizes="100vw" className="object-contain mix-blend-multiply" style={{ padding: "28px 0 32px" }} />
          )}
        </div>
        <div className="flex flex-col" style={{ padding: "22px 20px 32px", gap: 22 }}>
          <div className="flex flex-col" style={{ gap: 8 }}>
            <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", opacity: 0.6 }}>
              {product.category} · Eau de parfum · {product.size || "50 ml"}
            </span>
            <h1 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "2.2rem", fontWeight: 300, lineHeight: 1, letterSpacing: "-0.02em", margin: 0 }}>
              {product.name}
            </h1>
            <PriceLine product={product} size={22} />
          </div>
          {product.description && (
            <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 15, lineHeight: 1.6, opacity: 0.8, margin: 0 }}>{product.description}</p>
          )}
          {hasNotes && notes && (
            <div>
              <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", opacity: 0.55, marginBottom: 8 }}>How it wears</div>
              <div style={{ borderTop: "1px solid rgba(14,14,12,0.14)" }}>
                {[
                  { tier: "Top", list: notes.top, when: "0–15 min" },
                  { tier: "Heart", list: notes.middle, when: "to 2 h" },
                  { tier: "Base", list: notes.base, when: "2–10 h" },
                ].filter((r) => r.list?.length).map((r) => (
                  <div key={r.tier} className="grid items-baseline" style={{ gridTemplateColumns: "60px 1fr auto", gap: 10, padding: "12px 0", borderBottom: "1px solid rgba(14,14,12,0.14)" }}>
                    <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: NOTE_COLORS[r.tier] === "#E8B4B8" ? "#B5676D" : NOTE_COLORS[r.tier] }}>{r.tier}</span>
                    <span style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 17, fontStyle: "italic" }}>{(r.list ?? []).join(", ")}</span>
                    <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 9, opacity: 0.5 }}>{r.when}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="grid grid-cols-3" style={{ gap: 1, background: "rgba(14,14,12,0.14)", border: "1px solid rgba(14,14,12,0.14)" }}>
            {[
              ["Strength", "Eau de parfum"],
              ["Size", product.size || "50 ml"],
              ["Delivery", "Free"],
            ].map(([k, v]) => (
              <div key={k} className="flex flex-col" style={{ background: CREAM, padding: 10, gap: 4 }}>
                <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.55 }}>{k}</span>
                <span style={{ fontSize: 13 }}>{v}</span>
              </div>
            ))}
          </div>
          {(scentTags.length > 0 || occasionTags.length > 0) && (
            <div className="flex flex-wrap" style={{ gap: 6 }}>
              {[...scentTags, ...occasionTags].map((tag) => (
                <Link
                  key={tag}
                  href={`/products?tag=${tag}`}
                  style={{ height: 32, padding: "0 12px", display: "inline-flex", alignItems: "center", border: "1px solid rgba(14,14,12,0.3)", fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: INK }}
                >
                  {tagLabel(tag)}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Fixed buy bar: the only fixed bar on this page */}
        <div
          className="grid items-center"
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 41,
            gridTemplateColumns: "auto 1fr",
            gap: 14,
            padding: "12px max(16px, env(safe-area-inset-right)) calc(12px + env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left))",
            background: "rgba(242,237,228,0.94)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            borderTop: "1px solid rgba(14,14,12,0.12)",
          }}
        >
          <PriceLine product={product} size={22} />
          {inBag ? (
            <Link href="/cart" className="grid place-items-center" style={{ height: 52, background: SAFFRON, color: INK, fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase" }}>
              View bag →
            </Link>
          ) : (
            <button type="button" onClick={handleAddToCart} style={{ height: 52, background: INK, color: CREAM, border: "none", fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase" }}>
              Add to bag
            </button>
          )}
        </div>
      </div>

      {/* Related fragrances */}
      {related.length > 0 && (
        <section style={{ borderTop: `1px solid ${INK}` }} data-reveal>
          <div className="px-5 md:px-12 pt-8 md:pt-12 pb-5">
            <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase" }}>
              PAIRINGS / FROM THE SAME SHELF
            </div>
            <h2 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "clamp(2rem, 4vw, 3.25rem)", fontWeight: 300, lineHeight: 0.95, letterSpacing: "-0.03em", marginTop: 10 }}>
              You may also <em>wear.</em>
            </h2>
          </div>
          <ProductGrid products={related} />
        </section>
      )}
      {/* Clears the fixed mobile buy bar */}
      <div className="md:hidden" style={{ height: "calc(80px + env(safe-area-inset-bottom))" }} />
    </main>
  );
};

export default ProductDetailClient;
