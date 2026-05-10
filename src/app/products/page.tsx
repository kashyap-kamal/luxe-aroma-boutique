"use client";

import React, { useState, useEffect, Suspense, useRef } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { products as staticProducts, sortProducts, SortOption } from "@/lib/mock-data";
import { useProducts } from "@/hooks/use-products";
import { fetchBundles, Bundle } from "@/lib/bundle-service";
import ProductGrid from "@/components/product-grid";
import BundleCard from "@/components/bundle-card";
import { X, Search } from "lucide-react";
import { categoryNameMap } from "@/lib/utils";

const INK = "#0E0E0C";
const CREAM = "#F2EDE4";
const SAFFRON = "#E8763A";

const SCENT_FAMILIES = [
  { label: "Fresh", tag: "fresh" },
  { label: "Aquatic", tag: "aquatic" },
  { label: "Woody", tag: "woody" },
  { label: "Floral", tag: "floral" },
  { label: "Sweet", tag: "sweet" },
  { label: "Oriental", tag: "oriental" },
  { label: "Oud", tag: "oud" },
  { label: "Spicy", tag: "spicy" },
];

const OCCASIONS = [
  { label: "Office", tag: "office-wear" },
  { label: "Date Night", tag: "date-night" },
  { label: "Everyday", tag: "everyday-fresh" },
  { label: "Evening", tag: "evening" },
];

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "Default", value: "default" },
  { label: "Price ↑", value: "price-low-high" },
  { label: "Price ↓", value: "price-high-low" },
  { label: "Popular", value: "popularity" },
  { label: "Top Rated", value: "rating" },
];

const FilterChip = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    style={{
      padding: "5px 12px",
      border: `1px solid ${INK}`,
      background: active ? INK : "transparent",
      color: active ? CREAM : INK,
      fontFamily: "var(--font-jetbrains-mono), monospace",
      fontSize: 9,
      letterSpacing: "0.15em",
      textTransform: "uppercase" as const,
      cursor: "pointer",
      transition: "all 120ms",
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
    }}
  >
    {label}
    {active && <X style={{ width: 9, height: 9 }} />}
  </button>
);

const ProductsContent = () => {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const initialCategory = searchParams.get("category") || "";
  const initialTag = searchParams.get("tag") || "";
  const initialSearch = searchParams.get("q") || "";

  const { products: allProducts } = useProducts(staticProducts);
  const categories = [...new Set(allProducts.map((p) => p.category))];
  const maxPrice = Math.max(...allProducts.map((p) => p.price.current), 0);

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedTag, setSelectedTag] = useState(initialTag);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice]);
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [filteredProducts, setFilteredProducts] = useState(allProducts);
  const [allBundles, setAllBundles] = useState<Bundle[]>([]);
  const [matchingBundles, setMatchingBundles] = useState<Bundle[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [mobileColumns, setMobileColumns] = useState<1 | 2>(2);

  useEffect(() => {
    fetchBundles().then(setAllBundles).catch(() => {});
  }, []);

  useEffect(() => {
    setSelectedCategory(searchParams.get("category") || "");
    setSelectedTag(searchParams.get("tag") || "");
    setSearchQuery(searchParams.get("q") || "");
    const sort = searchParams.get("sort") as SortOption | null;
    if (sort) setSortBy(sort);
  }, [searchParams]);

  useEffect(() => {
    setPriceRange((prev) => [prev[0], maxPrice]);
  }, [maxPrice]);

  useEffect(() => {
    let filtered = allProducts;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
      setMatchingBundles(
        allBundles.filter(
          (b) =>
            b.name.toLowerCase().includes(q) ||
            b.items.some((item) => item.product.name.toLowerCase().includes(q))
        )
      );
    } else {
      setMatchingBundles([]);
    }
    if (selectedCategory) filtered = filtered.filter((p) => p.category === selectedCategory);
    if (selectedTag) filtered = filtered.filter((p) => p.tags?.includes(selectedTag));
    filtered = filtered.filter(
      (p) => p.price.current >= priceRange[0] && p.price.current <= priceRange[1]
    );
    setFilteredProducts(sortProducts(filtered, sortBy));

    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedTag) params.set("tag", selectedTag);
    if (sortBy !== "default") params.set("sort", sortBy);
    replace(`${pathname}?${params.toString()}`);
  }, [searchQuery, selectedCategory, selectedTag, priceRange, sortBy, allProducts, allBundles, replace, pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleReset = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedTag("");
    setPriceRange([0, maxPrice]);
    setSortBy("default");
    replace(pathname);
  };

  const activeFilterCount = [selectedCategory, selectedTag, searchQuery].filter(Boolean).length;

  const pageLabel = (() => {
    if (selectedCategory) return (categoryNameMap(selectedCategory) || selectedCategory).toUpperCase();
    if (selectedTag) return selectedTag.replace(/-/g, " ").toUpperCase();
    if (searchQuery) return `"${searchQuery.toUpperCase()}"`;
    return "ALL FRAGRANCES";
  })();

  return (
    <div style={{ background: CREAM, color: INK, minHeight: "100vh" }}>
      {/* Desktop header */}
      <div
        style={{ padding: "56px 48px 32px", borderBottom: `1px solid ${INK}` }}
        className="hidden md:block"
      >
        <div
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          THE COLLECTION — {filteredProducts.length} FRAGRANCES
        </div>
        <h1
          style={{
            fontFamily: "var(--font-fraunces), serif",
            fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
            fontWeight: 300,
            lineHeight: 0.92,
            letterSpacing: "-0.03em",
          }}
        >
          {pageLabel}
        </h1>
      </div>

      {/* Mobile header */}
      <div
        className="block md:hidden"
        style={{ padding: "28px 20px 20px", borderBottom: `1px solid ${INK}` }}
      >
        <div
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 9,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          THE COLLECTION — {filteredProducts.length}
        </div>
        <h1
          style={{
            fontFamily: "var(--font-fraunces), serif",
            fontSize: "2rem",
            fontWeight: 300,
            lineHeight: 0.92,
            letterSpacing: "-0.03em",
          }}
        >
          {pageLabel}
        </h1>
      </div>

      {/* Search + toolbar */}
      <div
        style={{
          borderBottom: `1px solid ${INK}`,
          display: "flex",
          alignItems: "stretch",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "0 24px",
            borderRight: `1px solid ${INK}`,
          }}
        >
          <Search style={{ width: 13, height: 13, opacity: 0.4, flexShrink: 0 }} />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search fragrances, notes, moods..."
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 10,
              letterSpacing: "0.1em",
              color: INK,
              padding: "18px 0",
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              style={{ background: "none", border: "none", cursor: "pointer", opacity: 0.4 }}
            >
              <X style={{ width: 12, height: 12 }} />
            </button>
          )}
        </div>

        {/* Sort buttons — desktop */}
        <div className="hidden md:flex" style={{ alignItems: "stretch" }}>
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSortBy(opt.value)}
              style={{
                padding: "0 16px",
                background: sortBy === opt.value ? INK : "transparent",
                color: sortBy === opt.value ? CREAM : INK,
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 9,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                cursor: "pointer",
                border: "none",
                borderRight: `1px solid ${INK}`,
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          style={{
            padding: "0 24px",
            background: showFilters ? INK : "transparent",
            color: showFilters ? CREAM : INK,
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 10,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            cursor: "pointer",
            border: "none",
            borderLeft: `1px solid ${INK}`,
            whiteSpace: "nowrap",
          }}
        >
          FILTER {activeFilterCount > 0 && `(${activeFilterCount})`}
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div
          style={{
            borderBottom: `1px solid ${INK}`,
            padding: "24px 48px",
            display: "flex",
            flexWrap: "wrap" as const,
            gap: 28,
          }}
          className="hidden md:flex"
        >
          <div>
            <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase" as const, opacity: 0.5, marginBottom: 8 }}>CATEGORY</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
              {categories.map((cat) => (
                <FilterChip key={cat} label={categoryNameMap(cat) || cat} active={selectedCategory === cat} onClick={() => setSelectedCategory(selectedCategory === cat ? "" : cat)} />
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase" as const, opacity: 0.5, marginBottom: 8 }}>SCENT FAMILY</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
              {SCENT_FAMILIES.map((s) => (
                <FilterChip key={s.tag} label={s.label} active={selectedTag === s.tag} onClick={() => setSelectedTag(selectedTag === s.tag ? "" : s.tag)} />
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase" as const, opacity: 0.5, marginBottom: 8 }}>OCCASION</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
              {OCCASIONS.map((o) => (
                <FilterChip key={o.tag} label={o.label} active={selectedTag === o.tag} onClick={() => setSelectedTag(selectedTag === o.tag ? "" : o.tag)} />
              ))}
            </div>
          </div>
          {activeFilterCount > 0 && (
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button onClick={handleReset} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: SAFFRON, textDecoration: "underline" }}>CLEAR ALL</button>
            </div>
          )}
        </div>
      )}

      {/* Mobile filter panel */}
      {showFilters && (
        <div className="flex md:hidden flex-col" style={{ borderBottom: `1px solid ${INK}`, padding: "20px", gap: 16 }}>
          <div>
            <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase" as const, opacity: 0.5, marginBottom: 8 }}>CATEGORY</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
              {categories.map((cat) => <FilterChip key={cat} label={categoryNameMap(cat) || cat} active={selectedCategory === cat} onClick={() => setSelectedCategory(selectedCategory === cat ? "" : cat)} />)}
            </div>
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase" as const, opacity: 0.5, marginBottom: 8 }}>SCENT</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
              {SCENT_FAMILIES.map((s) => <FilterChip key={s.tag} label={s.label} active={selectedTag === s.tag} onClick={() => setSelectedTag(selectedTag === s.tag ? "" : s.tag)} />)}
            </div>
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase" as const, opacity: 0.5, marginBottom: 8 }}>SORT</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
              {SORT_OPTIONS.map((opt) => <FilterChip key={opt.value} label={opt.label} active={sortBy === opt.value} onClick={() => setSortBy(opt.value)} />)}
            </div>
          </div>
          {activeFilterCount > 0 && <button onClick={handleReset} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: SAFFRON, textDecoration: "underline", textAlign: "left" as const }}>CLEAR ALL</button>}
        </div>
      )}

      {/* Products grid */}
      {filteredProducts.length > 0 ? (
        <>
          <div className="flex md:hidden" style={{ padding: "12px 20px", borderBottom: `1px solid ${INK}`, justifyContent: "flex-end", gap: 0 }}>
            {([1, 2] as const).map((n) => (
              <button key={n} onClick={() => setMobileColumns(n)} style={{ padding: "6px 14px", border: `1px solid ${INK}`, borderRight: n === 1 ? "none" : `1px solid ${INK}`, background: mobileColumns === n ? INK : "transparent", color: mobileColumns === n ? CREAM : INK, fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 9, letterSpacing: "0.15em", cursor: "pointer" }}>
                {n === 1 ? "LIST" : "GRID"}
              </button>
            ))}
          </div>
          <ProductGrid products={filteredProducts} mobileColumns={mobileColumns} />
        </>
      ) : (
        <div style={{ padding: "80px 0", textAlign: "center" as const }} className="px-5 md:px-12">
          <div style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300, fontStyle: "italic", opacity: 0.3, marginBottom: 16 }}>Nothing found.</div>
          <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase" as const, opacity: 0.4, marginBottom: 32 }}>NO FRAGRANCES MATCH YOUR FILTERS</div>
          <button onClick={handleReset} style={{ background: INK, color: CREAM, border: "none", padding: "14px 28px", fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase" as const, cursor: "pointer" }}>RESET FILTERS</button>
        </div>
      )}

      {/* Matching bundles */}
      {matchingBundles.length > 0 && (
        <div style={{ borderTop: `1px solid ${INK}` }}>
          <div style={{ paddingTop: 28, paddingBottom: 20, borderBottom: `1px solid ${INK}`, fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase" as const }} className="px-5 md:px-12">
            MATCHING SETS & BUNDLES — {matchingBundles.length}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4" style={{ borderLeft: `1px solid ${INK}` }}>
            {matchingBundles.map((bundle, i) => (
              <div key={bundle.id} style={{ borderRight: `1px solid ${INK}`, borderBottom: `1px solid ${INK}` }}>
                <BundleCard bundle={bundle} index={i} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ProductsLoading = () => (
  <div style={{ background: "#F2EDE4", minHeight: "100vh" }}>
    <div style={{ padding: "56px 48px 32px", borderBottom: "1px solid #0E0E0C" }}>
      <div style={{ height: 10, background: "#EDE9E0", width: 200, marginBottom: 16 }} />
      <div style={{ height: 48, background: "#EDE9E0", width: "40%" }} />
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderTop: "1px solid #0E0E0C", borderLeft: "1px solid #0E0E0C" }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} style={{ borderRight: "1px solid #0E0E0C", borderBottom: "1px solid #0E0E0C", padding: 24 }}>
          <div style={{ aspectRatio: "3/4", background: "#EDE9E0" }} />
          <div style={{ height: 10, background: "#EDE9E0", marginTop: 14, width: "60%" }} />
          <div style={{ height: 14, background: "#EDE9E0", marginTop: 8, width: "80%" }} />
        </div>
      ))}
    </div>
  </div>
);

const Products = () => (
  <Suspense fallback={<ProductsLoading />}>
    <ProductsContent />
  </Suspense>
);

export default Products;
