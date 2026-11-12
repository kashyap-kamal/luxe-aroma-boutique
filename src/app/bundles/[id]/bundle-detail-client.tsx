"use client";

import React, { useEffect, useState } from "react";
import { trackEvent } from "@/lib/analytics-service";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus } from "lucide-react";
import { Bundle } from "@/lib/bundle-service";
import { useCartStore } from "@/stores/cart-store";
import { toast } from "sonner";
import { TAG_META, tagLabel } from "@/lib/utils";
import { PLATE_BG } from "@/components/plate-card";

const INK = "#0E0E0C";
const CREAM = "#F2EDE4";
const SAFFRON = "#E8763A";
const MONO = "var(--font-jetbrains-mono), monospace";
const SERIF = "var(--font-fraunces), serif";

interface BundleDetailClientProps {
  bundle: Bundle;
}

export default function BundleDetailClient({ bundle }: BundleDetailClientProps) {
  const { addBundleToCart } = useCartStore();
  const router = useRouter();

  // Collect unique scent + occasion tags from all products in the bundle
  const bundleTags = [
    ...new Set(
      bundle.items
        .flatMap((item) => item.product.tags ?? [])
        .filter((t) => TAG_META[t]?.group === "scent" || TAG_META[t]?.group === "occasion")
    ),
  ];
  const [quantity, setQuantity] = useState(1);

  const currentPrice = bundle.price.current;

  useEffect(() => {
    trackEvent({
      eventType: "product_view",
      bundleId: bundle.id,
      itemName: bundle.name,
      valueInr: currentPrice,
    });
  }, [bundle.id, bundle.name, currentPrice]);
  const [added, setAdded] = useState(false);
  // Mobile buy bar turns into "View bag" after the first add
  const [inBag, setInBag] = useState(false);

  const discountPercent =
    bundle.price.original && bundle.price.original > bundle.price.current
      ? Math.round(
          ((bundle.price.original - bundle.price.current) /
            bundle.price.original) *
            100
        )
      : 0;

  const handleAddToCart = () => {
    if (added) return;
    addBundleToCart(bundle, quantity);
    setAdded(true);
    setInBag(true);
    setTimeout(() => setAdded(false), 1500);
    toast("Added to bag", {
      description: `${bundle.name} ×${quantity}`,
      duration: 3000,
    });
  };

  const handleBuyNow = () => {
    addBundleToCart(bundle, quantity);
    router.push("/cart");
  };

  const count = bundle.items.length;
  const label = `${bundle.bundleType.replace(/_/g, " ")} · ${count} fragrance${count === 1 ? "" : "s"}`;
  const fmt = (v: number) => `${bundle.price.currency}${v.toLocaleString("en-IN")}`;
  const price = (size: number) => (
    <span style={{ fontFamily: SERIF, fontWeight: 300, fontSize: size }}>
      {fmt(bundle.price.current)}
      {discountPercent > 0 && bundle.price.original && (
        <span style={{ fontSize: "0.7em", opacity: 0.45, textDecoration: "line-through", marginLeft: 8 }}>{fmt(bundle.price.original)}</span>
      )}
    </span>
  );
  const eyebrow: React.CSSProperties = { fontFamily: MONO, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.6 };

  // The set as a bottle line-up on a warm plate (or the uploaded set photo)
  const plate = (height: number | string) => (
    <div className="relative overflow-hidden" style={{ height, background: PLATE_BG }}>
      {bundle.imageUrl ? (
        <Image src={bundle.imageUrl} alt={bundle.name} fill priority sizes="(max-width: 768px) 100vw, 50vw" className="object-contain mix-blend-multiply" />
      ) : (
        <div className="absolute inset-0 flex items-center" style={{ padding: "0 6%" }}>
          {bundle.items.slice(0, 5).map((item, i) => (
            <div key={item.product.id} className="relative h-[78%] flex-1 min-w-0" style={{ marginLeft: i > 0 ? "-5%" : 0 }}>
              <Image src={item.product.image} alt={item.product.name} fill priority sizes="25vw" className="object-contain mix-blend-multiply" />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const inside = (
    <div>
      <div style={{ ...eyebrow, marginBottom: 8 }}>What&apos;s inside</div>
      <div style={{ borderTop: "1px solid rgba(14,14,12,0.14)" }}>
        {bundle.items.map((item) => (
          <Link
            key={item.product.id}
            href={`/products/${item.product.id}`}
            className="grid items-center"
            style={{ gridTemplateColumns: "56px 1fr auto", gap: 14, padding: "10px 0", borderBottom: "1px solid rgba(14,14,12,0.14)", color: INK }}
          >
            <span className="relative block" style={{ width: 56, height: 68, background: PLATE_BG }}>
              <Image src={item.product.image} alt="" fill sizes="56px" className="object-contain mix-blend-multiply p-1.5" />
            </span>
            <span className="min-w-0">
              <span className="block" style={{ fontFamily: SERIF, fontWeight: 300, fontSize: 18, lineHeight: 1.15 }}>{item.product.name}</span>
              <span className="block truncate" style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.55, marginTop: 3 }}>
                {(item.product.fragrance_notes?.top ?? []).slice(0, 3).join(" · ") || item.product.size || "50 ml"}
              </span>
            </span>
            <span style={{ fontFamily: MONO, fontSize: 10, opacity: 0.6 }}>{item.quantity > 1 ? `×${item.quantity}` : "→"}</span>
          </Link>
        ))}
      </div>
    </div>
  );

  const tags = bundleTags.length > 0 && (
    <div className="flex flex-wrap" style={{ gap: 6 }}>
      {bundleTags.map((tag) => (
        <Link
          key={tag}
          href={`/products?tag=${tag}`}
          className="inline-flex items-center"
          style={{ height: 32, padding: "0 12px", border: "1px solid rgba(14,14,12,0.3)", fontFamily: MONO, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: INK }}
        >
          {tagLabel(tag)}
        </Link>
      ))}
    </div>
  );

  const about = bundle.description && (
    <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 15, lineHeight: 1.65, opacity: 0.8, margin: 0 }}>{bundle.description}</p>
  );

  return (
    <main style={{ background: CREAM, color: INK }}>
      {/* Breadcrumb */}
      <div className="hidden md:flex items-center" style={{ gap: 12, padding: "16px 48px", borderBottom: `1px solid ${INK}`, fontFamily: MONO, fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase" }}>
        <Link href="/bundles" style={{ color: INK, opacity: 0.5 }}>Discovery sets</Link>
        <span style={{ opacity: 0.3 }}>→</span>
        <span>{bundle.name}</span>
      </div>

      {/* Desktop: plate left, details right */}
      <div className="hidden md:grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div style={{ borderRight: `1px solid ${INK}` }}>{plate("100%")}</div>
        <div className="flex flex-col" style={{ padding: 48, gap: 26 }}>
          <div className="flex flex-col" style={{ gap: 12 }}>
            <span style={{ ...eyebrow, opacity: 1, color: SAFFRON }}>{label}</span>
            <h1 style={{ fontFamily: SERIF, fontSize: "clamp(2.5rem, 4vw, 3.5rem)", fontWeight: 300, lineHeight: 0.95, letterSpacing: "-0.03em", margin: 0 }}>{bundle.name}</h1>
            {price(30)}
            {bundle.short_description && <p style={{ fontSize: 15, lineHeight: 1.6, opacity: 0.75, margin: 0 }}>{bundle.short_description}</p>}
          </div>
          {inside}
          {about}
          {tags}
          <div className="flex flex-col" style={{ gap: 14, paddingTop: 24, borderTop: `1px solid ${INK}` }}>
            <div className="flex items-center" style={{ gap: 16 }}>
              <span style={{ ...eyebrow, width: 60 }}>Qty</span>
              <div className="flex items-center">
                <button type="button" aria-label="Decrease quantity" onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="grid place-items-center" style={{ width: 36, height: 36, border: `1px solid ${INK}` }}>
                  <Minus className="h-3 w-3" />
                </button>
                <span className="grid place-items-center" style={{ width: 44, height: 36, borderTop: `1px solid ${INK}`, borderBottom: `1px solid ${INK}`, fontFamily: MONO, fontSize: 12 }}>{quantity}</span>
                <button type="button" aria-label="Increase quantity" onClick={() => setQuantity((q) => q + 1)} className="grid place-items-center" style={{ width: 36, height: 36, border: `1px solid ${INK}` }}>
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            </div>
            <div className="flex" style={{ gap: 12 }}>
              <button type="button" onClick={handleBuyNow} style={{ flex: 1, height: 56, background: SAFFRON, color: INK, fontFamily: MONO, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" }}>
                Buy now →
              </button>
              <button type="button" onClick={handleAddToCart} style={{ flex: 1, height: 56, background: added ? "transparent" : INK, color: added ? INK : CREAM, border: `1px solid ${INK}`, fontFamily: MONO, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" }}>
                {added ? "Added ✓" : "Add to bag"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: plate, title, contents, one buy bar */}
      <div className="flex flex-col md:hidden">
        {plate(320)}
        <div className="flex flex-col" style={{ padding: "22px 20px 32px", gap: 22 }}>
          <div className="flex flex-col" style={{ gap: 8 }}>
            <span style={eyebrow}>{label}</span>
            <h1 style={{ fontFamily: SERIF, fontSize: "2.2rem", fontWeight: 300, lineHeight: 1, letterSpacing: "-0.02em", margin: 0 }}>{bundle.name}</h1>
            {price(22)}
          </div>
          {bundle.short_description && <p style={{ fontSize: 15, lineHeight: 1.6, opacity: 0.8, margin: 0 }}>{bundle.short_description}</p>}
          {inside}
          {about}
          {tags}
        </div>
      </div>

      {/* Clears the fixed mobile buy bar */}
      <div className="md:hidden" style={{ height: "calc(80px + env(safe-area-inset-bottom))" }} />

      {/* Fixed mobile buy bar: the only fixed bar on this page */}
      <div
        className="fixed left-0 right-0 bottom-0 md:hidden z-[41] grid items-center"
        style={{
          gridTemplateColumns: "auto 1fr",
          gap: 14,
          padding: "12px max(16px, env(safe-area-inset-right)) calc(12px + env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left))",
          background: "rgba(242,237,228,0.94)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderTop: "1px solid rgba(14,14,12,0.12)",
        }}
      >
        {price(22)}
        {inBag ? (
          <Link href="/cart" className="grid place-items-center" style={{ height: 52, background: SAFFRON, color: INK, fontFamily: MONO, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase" }}>
            View bag →
          </Link>
        ) : (
          <button type="button" onClick={handleAddToCart} style={{ height: 52, background: INK, color: CREAM, fontFamily: MONO, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase" }}>
            Add to bag
          </button>
        )}
      </div>
    </main>
  );
}
