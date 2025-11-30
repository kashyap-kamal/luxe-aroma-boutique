"use client";

import React, { useState, useEffect, Suspense } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

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
    <div className="flex flex-col lg:flex-row gap-10 relative">
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-6">
        <Button 
          onClick={() => setIsMobileFilterOpen(true)}
          variant="outline"
          className="w-full flex items-center justify-center gap-2 border-gray-300"
        >
          <Filter className="h-4 w-4" />
          Filter & Sort
        </Button>
      </div>

      {/* Filters Sidebar - Desktop */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:block w-64 flex-shrink-0"
      >
        <div className="sticky top-24">
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
      </motion.div>

      {/* Mobile Filter Sidebar (Drawer) */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-xs bg-white z-50 lg:hidden shadow-2xl p-6 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-serif font-bold">Filters</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileFilterOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
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
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Products Grid */}
      <div className="flex-grow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
        {filteredProducts.length > 0 ? (
          <>
              <p className="mb-6 text-gray-500 text-sm uppercase tracking-wider">
                Showing <span className="text-gray-900 font-bold">{filteredProducts.length}</span>{" "}
                {filteredProducts.length === 1 ? "fragrance" : "fragrances"}
              </p>
              
              {/* We wrap ProductGrid in a motion component for staggering children if possible, 
                  but ProductGrid currently maps directly. 
                  Ideally, update ProductGrid to use framer-motion or wrap it here.
                  For now, simple fade in.
              */}
            <ProductGrid products={filteredProducts} />
          </>
        ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 bg-gray-50 rounded-2xl"
            >
              <div className="text-6xl mb-4 opacity-20">🔍</div>
              <h3 className="text-2xl font-serif font-medium mb-2 text-gray-900">No fragrances found</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                We couldn't find any perfumes matching your current filters. Try adjusting your search criteria.
              </p>
              <Button
                onClick={handleReset}
                variant="default"
                className="bg-luxe-gold text-black hover:bg-amber-400"
            >
              Reset all filters
              </Button>
            </motion.div>
        )}
        </motion.div>
      </div>
    </div>
  );
};

// Loading component for Suspense fallback
const ProductsLoading = () => (
  <div className="flex flex-col lg:flex-row gap-10">
    <div className="hidden lg:block w-64 flex-shrink-0">
      <div className="animate-pulse space-y-8">
        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    </div>
    <div className="flex-grow">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-32 mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Main Products component with Suspense boundary
const Products = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="bg-luxe-cream py-16 md:py-24 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-luxe-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-luxe-blue/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
        
        <div className="luxury-container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-luxe-gold text-sm font-bold uppercase tracking-widest mb-3 block">
              The Collection
            </span>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-6">
              Exquisite Fragrances
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Discover our curated selection of premium perfumes, crafted to evoke emotion and capture memories.
            </p>
          </motion.div>
        </div>
      </div>

      <main className="flex-grow py-12 md:py-16">
        <div className="luxury-container">
          <Suspense fallback={<ProductsLoading />}>
            <ProductsContent />
          </Suspense>
        </div>
      </main>
    </div>
  );
};

export default Products;
