
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductGrid from '@/components/product/ProductGrid';
import ProductFilter from '@/components/product/ProductFilter';
import { 
  filterProducts, 
  getProductCategories, 
  getMaxPrice, 
  products as allProducts 
} from '@/utils/mockData';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  
  const categories = getProductCategories();
  const maxPrice = getMaxPrice();
  
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice]);
  const [filteredProducts, setFilteredProducts] = useState(allProducts);

  // Update filtered products when filters change
  useEffect(() => {
    const filtered = filterProducts(selectedCategory, priceRange);
    setFilteredProducts(filtered);
    
    // Update URL params
    if (selectedCategory) {
      searchParams.set('category', selectedCategory);
    } else {
      searchParams.delete('category');
    }
    setSearchParams(searchParams);
  }, [selectedCategory, priceRange, searchParams, setSearchParams]);

  // Reset filters
  const handleReset = () => {
    setSelectedCategory('');
    setPriceRange([0, maxPrice]);
  };

  return (
    <div className="min-h-screen flex flex-col">
      
      <main className="flex-grow py-8">
        <div className="luxury-container">
          <h1 className="text-3xl font-serif font-bold mb-8">Our Perfume Collection</h1>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Filters sidebar */}
            <div className="w-full md:w-64 flex-shrink-0">
              <ProductFilter 
                categories={categories}
                selectedCategory={selectedCategory}
                priceRange={priceRange}
                maxPrice={maxPrice}
                onCategoryChange={setSelectedCategory}
                onPriceChange={setPriceRange}
                onReset={handleReset}
              />
            </div>
            
            {/* Products grid */}
            <div className="flex-grow">
              {filteredProducts.length > 0 ? (
                <>
                  <p className="mb-6 text-gray-600">
                    Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                  </p>
                  <ProductGrid products={filteredProducts} />
                </>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No products found</h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your filters to find what you're looking for.
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
        </div>
      </main>
      
    </div>
  );
};

export default Products;
