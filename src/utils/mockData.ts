
import { Product } from '@/contexts/CartContext';

export const products: Product[] = [
  {
    id: '1',
    name: 'Royal Oud',
    price: 4999,
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: "Men's Collection",
    size: '100ml',
    description: 'A sophisticated blend of rare oud wood, sandalwood, and musk, creating a rich and long-lasting fragrance perfect for special occasions.'
  },
  {
    id: '2',
    name: 'Midnight Rose',
    price: 3999,
    image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: "Women's Collection",
    size: '75ml',
    description: 'An enchanting floral fragrance with notes of Bulgarian rose, black currant, and patchouli, ideal for evening wear.'
  },
  {
    id: '3',
    name: 'Citrus Ocean',
    price: 2999,
    image: 'https://images.unsplash.com/photo-1616697539697-99aa3e3b2dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'Unisex Collection',
    size: '50ml',
    description: 'A refreshing blend of citrus, ocean breeze, and light woods, perfect for casual, everyday wear.'
  },
  {
    id: '4',
    name: 'Amber Mystic',
    price: 5999,
    image: 'https://images.unsplash.com/photo-1544468266-6a8948003cd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: "Men's Collection",
    size: '100ml',
    description: 'A warm and spicy fragrance with notes of amber, cardamom, and cedarwood, creating a mysterious and masculine scent.'
  },
  {
    id: '5',
    name: 'Velvet Orchid',
    price: 4499,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: "Women's Collection", 
    size: '75ml',
    description: 'An elegant and luxurious fragrance featuring rare orchid, warm vanilla, and sandalwood, designed for the sophisticated woman.'
  },
  {
    id: '6',
    name: 'Fresh Bliss',
    price: 1999,
    image: 'https://images.unsplash.com/photo-1615634376658-c80abf877da2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'Unisex Collection',
    size: '50ml',
    description: 'A light and refreshing scent with notes of bergamot, green tea, and white musk, perfect for everyday wear.'
  },
  {
    id: '7',
    name: 'Saffron Gold',
    price: 6999,
    image: 'https://images.unsplash.com/photo-1617897903246-719242758050?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: "Men's Collection",
    size: '100ml',
    description: 'A luxury fragrance featuring rare saffron, leather, and smoky woods, creating a bold and distinctive scent for confident men.'
  },
  {
    id: '8',
    name: 'Jasmine Dreams',
    price: 3599,
    image: 'https://images.unsplash.com/photo-1580331451678-64cfd90d62e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: "Women's Collection",
    size: '75ml',
    description: 'A delicate floral fragrance centered around jasmine, ylang-ylang, and vanilla, creating a dreamy and romantic aura.'
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductCategories = (): string[] => {
  return Array.from(new Set(products.map(product => product.category)));
};

export const getMaxPrice = (): number => {
  return Math.max(...products.map(product => product.price));
};

export const filterProducts = (
  categoryFilter: string,
  priceRange: [number, number]
): Product[] => {
  return products.filter(product => {
    const matchesCategory = categoryFilter ? product.category === categoryFilter : true;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesCategory && matchesPrice;
  });
};
