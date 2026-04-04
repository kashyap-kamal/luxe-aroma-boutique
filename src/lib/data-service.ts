import { cache } from 'react';
import { products as staticProducts } from './mock-data';
import { fetchProducts as fetchProductsFromDb, fetchFeaturedProducts as fetchFeaturedFromDb, fetchProductById as fetchProductByIdFromDb } from './product-service';
import { Product } from '@/stores/cart-store';

// Re-export Product type for convenience
export type { Product };

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}

export interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  comment: string;
  image: string;
  verified: boolean;
}

// Cache configuration
const CACHE_DURATION = {
  PRODUCTS: 60 * 60 * 24, // 24 hours
  CATEGORIES: 60 * 60 * 24, // 24 hours
  TESTIMONIALS: 60 * 60 * 12, // 12 hours
} as const;

// In-memory cache for development (in production, use Redis or similar)
const cacheStore = new Map<string, { data: unknown; timestamp: number }>();

// Cache helper function
function getCachedData<T>(key: string, fetcher: () => T, ttl: number): T {
  const cached = cacheStore.get(key);
  const now = Date.now();

  if (cached && (now - cached.timestamp) < ttl * 1000) {
    return cached.data as T;
  }

  const data = fetcher();
  cacheStore.set(key, { data, timestamp: now });
  return data;
}

// Fetch products from Supabase with static fallback
async function resolveProducts(): Promise<Product[]> {
  try {
    const dbProducts = await fetchProductsFromDb();
    if (dbProducts.length > 0) return dbProducts;
  } catch {
    // Supabase unavailable — use static catalog
  }
  return staticProducts;
}

// Data fetching functions with caching
// Used at build time by server components (home page, generateStaticParams)
export const getProducts = cache(async (): Promise<Product[]> => {
  return resolveProducts();
});

export const getProductById = cache(async (id: string): Promise<Product | null> => {
  try {
    const product = await fetchProductByIdFromDb(id);
    if (product) return product;
  } catch {
    // Fall back to static
  }
  const allProducts = staticProducts;
  return allProducts.find(product => product.id === id) || null;
});

export const getProductsByCategory = cache(async (category: string): Promise<Product[]> => {
  const allProducts = await getProducts();
  return allProducts.filter(product =>
    product.category.toLowerCase().includes(category.toLowerCase())
  );
});

export const getFeaturedProducts = cache(async (limit: number = 4): Promise<Product[]> => {
  try {
    const featured = await fetchFeaturedFromDb(limit);
    if (featured.length > 0) return featured;
  } catch {
    // Fall back to static
  }
  const allProducts = await getProducts();
  return allProducts.slice(0, limit);
});

export const getCategories = cache(async (): Promise<Category[]> => {
  const allProducts = await resolveProducts();
  const categoryMap = new Map<string, Category>();

  allProducts.forEach(product => {
    const categoryName = product.category;
    if (!categoryMap.has(categoryName)) {
      categoryMap.set(categoryName, {
        id: categoryName.toLowerCase().replace(/\s+/g, '-'),
        name: categoryName,
        slug: categoryName.toLowerCase().replace(/\s+/g, '-'),
        description: `Explore our ${categoryName} collection`,
        image: `/images/categories/${categoryName.toLowerCase().replace(/\s+/g, '-')}.jpg`,
        productCount: 0,
      });
    }

    const category = categoryMap.get(categoryName)!;
    category.productCount++;
  });

  return Array.from(categoryMap.values());
});

export const getTestimonials = cache(async (): Promise<Testimonial[]> => {
  return getCachedData('testimonials', () => [
    {
      id: 1,
      name: "Priya Sharma",
      location: "Mumbai, Maharashtra",
      rating: 5,
      comment: "Absolutely love the Aventus fragrance! The quality is exceptional and the scent lasts all day. Arome Luxe has become my go-to for premium perfumes.",
      image: "\u{1F469}\u200D\u{1F4BC}",
      verified: true,
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      location: "Delhi, NCR",
      rating: 5,
      comment: "The Cool Water perfume exceeded my expectations. Great value for money and the packaging was beautiful. Will definitely order again!",
      image: "\u{1F468}\u200D\u{1F4BC}",
      verified: true,
    },
    {
      id: 3,
      name: "Anita Patel",
      location: "Bangalore, Karnataka",
      rating: 5,
      comment: "Fast delivery and amazing customer service. The Hawas fragrance is perfect for special occasions. Highly recommend Arome Luxe!",
      image: "\u{1F469}\u200D\u{1F3A8}",
      verified: true,
    },
    {
      id: 4,
      name: "Suresh Reddy",
      location: "Hyderabad, Telangana",
      rating: 5,
      comment: "Excellent collection and competitive prices. The customer support team was very helpful in choosing the right fragrance.",
      image: "\u{1F468}\u200D\u{1F4BC}",
      verified: true,
    },
    {
      id: 5,
      name: "Meera Joshi",
      location: "Pune, Maharashtra",
      rating: 5,
      comment: "Love the packaging and the fragrance quality. Fast shipping and great customer service. Will definitely shop again!",
      image: "\u{1F469}\u200D\u{1F4BC}",
      verified: true,
    },
  ], CACHE_DURATION.TESTIMONIALS);
});

// Search functionality
export const searchProducts = cache(async (query: string): Promise<Product[]> => {
  const allProducts = await getProducts();
  const searchTerm = query.toLowerCase();

  return allProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm) ||
    product.description?.toLowerCase().includes(searchTerm) ||
    product.tags?.some(tag => tag.toLowerCase().includes(searchTerm)) ||
    product.category.toLowerCase().includes(searchTerm)
  );
});

// Analytics and insights
export const getProductInsights = cache(async () => {
  const allProducts = await getProducts();

  return {
    totalProducts: allProducts.length,
    averagePrice: allProducts.reduce((sum, product) => sum + product.price.current, 0) / allProducts.length,
    averageRating: allProducts.reduce((sum, product) => sum + (product?.rating?.stars || 0), 0) / allProducts.length,
    inStockCount: allProducts.filter(product => product.status === 'in_stock').length,
    onSaleCount: allProducts.filter(product => product.price.on_sale).length,
    categories: [...new Set(allProducts.map(product => product.category))],
  };
});

// Preload critical data
export const preloadCriticalData = cache(async () => {
  // Preload essential data for better performance
  await Promise.all([
    getProducts(),
    getCategories(),
    getFeaturedProducts(),
    getTestimonials(),
  ]);
});

// Clear cache function (useful for development)
export const clearCache = (key?: string) => {
  if (key) {
    cacheStore.delete(key);
  } else {
    cacheStore.clear();
  }
};
