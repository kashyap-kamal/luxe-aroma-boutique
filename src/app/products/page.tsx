"use client";

import React, { useState, useEffect, Suspense } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import {
  filterProducts,
  getProductCategories,
  getMaxPrice,
  sortProducts,
  SortOption,
  products as allProducts,
} from "@/lib/mock-data";
import ProductGrid from "@/components/product-grid";
import ProductFilter from "@/components/product-filter";

// Component that uses useSearchParams - needs to be wrapped in Suspense
const ProductsContent = () => {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const initialCategory = searchParams.get("category") || "";

  const categories = getProductCategories();
  const maxPrice = getMaxPrice();

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice]);
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [filteredProducts, setFilteredProducts] = useState(allProducts);

  // Update filtered products when filters change
  useEffect(() => {
    const filtered = filterProducts(selectedCategory, priceRange);
    const sorted = sortProducts(filtered, sortBy);
    setFilteredProducts(sorted);

    const params = new URLSearchParams();
    // Update URL params
    if (selectedCategory) {
      params.set("category", selectedCategory);
    } else {
      params.delete("category");
    }
    if (sortBy !== "default") {
      params.set("sort", sortBy);
    } else {
      params.delete("sort");
    }
    replace(`${pathname}?${params.toString()}`);
  }, [selectedCategory, priceRange, sortBy, searchParams, replace, pathname]);

  // Reset filters
  const handleReset = () => {
    setSelectedCategory("");
    setPriceRange([0, maxPrice]);
    setSortBy("default");
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Filters sidebar */}
      <div className="w-full md:w-64 flex-shrink-0">
        <ProductFilter
          categories={categories}
          selectedCategory={selectedCategory}
          priceRange={priceRange}
          maxPrice={maxPrice}
          sortBy={sortBy}
          onCategoryChange={setSelectedCategory}
          onPriceChange={setPriceRange}
          onSortChange={setSortBy}
          onReset={handleReset}
        />
      </div>

      {/* Products grid */}
      <div className="flex-grow">
        {filteredProducts.length > 0 ? (
          <>
            <p className="mb-6 text-gray-600">
              Showing {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "product" : "products"}
            </p>
            <ProductGrid products={filteredProducts} />
          </>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters to find what you&apos;re looking for.
            </p>
            <button
              onClick={handleReset}
              className="text-luxe-purple hover:underline"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Loading component for Suspense fallback
const ProductsLoading = () => (
  <div className="flex flex-col md:flex-row gap-8">
    <div className="w-full md:w-64 flex-shrink-0">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
    <div className="flex-grow">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Main Products component with Suspense boundary
const Products = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow py-8">
        <div className="luxury-container">
          <h1 className="text-3xl text-luxe-blue font-serif font-bold mb-8">
            Our Perfume Collection
          </h1>

          <Suspense fallback={<ProductsLoading />}>
            <ProductsContent />
          </Suspense>
        </div>
      </main>
    </div>
  );
};

export default Products;
