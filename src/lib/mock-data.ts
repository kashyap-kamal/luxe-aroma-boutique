import { Product } from "@/stores/cart-store";
import productsData from "@/products.json";

// Transform the JSON data to match our Product interface
export const products: Product[] = productsData.products.map((product) => ({
  id: product.id.toString(),
  name: product.name,
  price: {
    original: product.price.original,
    current: product.price.current,
    currency: product.price.currency,
    on_sale: product.price.on_sale,
  },
  image: `/assets/perfumes/${product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace('-edp', '')}.png`,
  category: product.category,
  size: "100ml", // Default size since not specified in JSON
  description: `Premium ${product.name} fragrance - a luxurious scent perfect for any occasion.`,
  tags: product.tags || [],
  rating: product.rating,
  status: product.status,
}));

export const getProductById = (id: string): Product | undefined => {
  return products.find((product) => product.id === id);
};

export const getProductCategories = (): string[] => {
  return Array.from(new Set(products.map((product) => product.category)));
};

export const getMaxPrice = (): number => {
  return Math.max(...products.map((product) => product.price.current));
};

export const filterProducts = (
  categoryFilter: string,
  priceRange: [number, number],
): Product[] => {
  return products.filter((product) => {
    const matchesCategory = categoryFilter
      ? product.category === categoryFilter
      : true;
    const matchesPrice =
      product.price.current >= priceRange[0] && product.price.current <= priceRange[1];
    return matchesCategory && matchesPrice;
  });
};

// Sorting options based on the JSON data
export type SortOption = 
  | "default"
  | "popularity" 
  | "rating" 
  | "latest" 
  | "price-low-high" 
  | "price-high-low";

export const sortProducts = (products: Product[], sortBy: SortOption): Product[] => {
  const sortedProducts = [...products];
  
  switch (sortBy) {
    case "popularity":
      // Sort by rating (higher rating = more popular)
      return sortedProducts.sort((a, b) => (b.rating?.stars || 0) - (a.rating?.stars || 0));
    
    case "rating":
      // Sort by rating (higher rating first)
      return sortedProducts.sort((a, b) => (b.rating?.stars || 0) - (a.rating?.stars || 0));
    
    case "latest":
      // Sort by ID (higher ID = newer, assuming IDs are sequential)
      return sortedProducts.sort((a, b) => parseInt(b.id) - parseInt(a.id));
    
    case "price-low-high":
      // Sort by current price (low to high)
      return sortedProducts.sort((a, b) => a.price.current - b.price.current);
    
    case "price-high-low":
      // Sort by current price (high to low)
      return sortedProducts.sort((a, b) => b.price.current - a.price.current);
    
    case "default":
    default:
      // Return products in original order
      return sortedProducts;
  }
};

// Get all available sorting options
export const getSortingOptions = (): { value: SortOption; label: string }[] => {
  return [
    { value: "default", label: "Default sorting" },
    { value: "popularity", label: "Sort by popularity" },
    { value: "rating", label: "Sort by average rating" },
    { value: "latest", label: "Sort by latest" },
    { value: "price-low-high", label: "Sort by price: low to high" },
    { value: "price-high-low", label: "Sort by price: high to low" },
  ];
};
