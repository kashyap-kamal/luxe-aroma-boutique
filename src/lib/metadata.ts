import { Metadata } from 'next';
import { getProducts, getProductById, Product, getProductsByCategory } from './data-service';

// Base metadata configuration
const baseMetadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://aromeluxe.in'),
  title: {
    default: 'Aromé Luxe - Premium Perfumes & Fragrances',
    template: '%s | Aromé Luxe',
  },
  description: 'Discover exquisite fragrances crafted with the finest ingredients. Premium perfumes for men and women with free shipping across India.',
  keywords: [
    'perfumes',
    'fragrances',
    'luxury perfumes',
    'men perfumes',
    'women perfumes',
    'unisex fragrances',
    'premium perfumes India',
    'online perfume store',
    'Aromé Luxe',
  ],
  authors: [{ name: 'Aromé Luxe Team' }],
  creator: 'Aromé Luxe',
  publisher: 'Aromé Luxe',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: '/',
    siteName: 'Aromé Luxe',
    title: 'Aromé Luxe - Premium Perfumes & Fragrances',
    description: 'Discover exquisite fragrances crafted with the finest ingredients. Premium perfumes for men and women with free shipping across India.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Aromé Luxe - Premium Perfumes',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aromé Luxe - Premium Perfumes & Fragrances',
    description: 'Discover exquisite fragrances crafted with the finest ingredients.',
    images: ['/twitter-image.jpg'],
    creator: '@aromeluxe',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION_ID,
    yandex: process.env.YANDEX_VERIFICATION_ID,
    yahoo: process.env.YAHOO_VERIFICATION_ID,
  },
  alternates: {
    canonical: '/',
  },
  category: 'fashion',
};

// Generate metadata for home page
export async function generateHomeMetadata(): Promise<Metadata> {
  const products = await getProducts();

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Aromé Luxe',
    description: 'Premium perfumes and fragrances for men and women',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://aromeluxe.in',
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://aromeluxe.in'}/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-9876543210',
      contactType: 'customer service',
      availableLanguage: ['English', 'Hindi'],
    },
    sameAs: [
      'https://www.facebook.com/aromeluxe',
      'https://www.instagram.com/aromeluxe',
      'https://www.twitter.com/aromeluxe',
    ],
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'INR',
      lowPrice: Math.min(...products.map(p => p.price.current)),
      highPrice: Math.max(...products.map(p => p.price.current)),
      offerCount: products.length,
    },
  };

  return {
    ...baseMetadata,
    other: {
      'application/ld+json': JSON.stringify(structuredData),
    },
  };
}

// Generate metadata for products page
export async function generateProductsMetadata(): Promise<Metadata> {
  const products = await getProducts();

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Perfume Collection',
    description: 'Browse our complete collection of premium perfumes and fragrances',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://aromeluxe.in'}/products`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: products.length,
      itemListElement: products.slice(0, 10).map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Product',
          name: product.name,
          description: product.description,
          image: product.image,
          offers: {
            '@type': 'Offer',
            price: product.price.current,
            priceCurrency: 'INR',
            availability: product.status === 'in_stock' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          },
        },
      })),
    },
  };

  return {
    ...baseMetadata,
    title: 'Perfume Collection - Premium Fragrances',
    description: `Browse our collection of ${products.length} premium perfumes and fragrances. Find your perfect scent from our curated selection.`,
    openGraph: {
      ...baseMetadata.openGraph,
      title: 'Perfume Collection - Premium Fragrances',
      description: `Browse our collection of ${products.length} premium perfumes and fragrances.`,
      url: '/products',
    },
    other: {
      'application/ld+json': JSON.stringify(structuredData),
    },
  };
}

// Generate metadata for individual product page
export async function generateProductMetadata(productId: string): Promise<Metadata> {
  const product = await getProductById(productId);
  
  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.',
    };
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    brand: {
      '@type': 'Brand',
      name: 'Aromé Luxe',
    },
    offers: {
      '@type': 'Offer',
      price: product.price.current,
      priceCurrency: 'INR',
      availability: product.status === 'in_stock' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Aromé Luxe',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.rating?.stars,
    },
    category: product.category,
  };

  return {
    ...baseMetadata,
    title: `${product.name} - Premium Perfume`,
    description: product.description,
    openGraph: {
      ...baseMetadata.openGraph,
      title: `${product.name} - Premium Perfume`,
      description: product.description,
      url: `/products/${productId}`,
      images: [
        {
          url: product.image,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
    twitter: {
      ...baseMetadata.twitter,
      title: `${product.name} - Premium Perfume`,
      description: product.description,
      images: [product.image],
    },
    other: {
      'application/ld+json': JSON.stringify(structuredData),
    },
  };
}

// Generate metadata for category page
export async function generateCategoryMetadata(category: string): Promise<Metadata> {
  const products = await getProductsByCategory(category);
  const categoryName = category.charAt(0).toUpperCase() + category.slice(1);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${categoryName} Perfumes`,
    description: `Explore our ${categoryName} perfume collection`,
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://aromeluxe.in'}/products?category=${category}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: products.length,
      itemListElement: products.map((product: Product, index: number) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Product',
          name: product.name,
          description: product.description,
          image: product.image,
        },
      })),
    },
  };

  return {
    ...baseMetadata,
    title: `${categoryName} Perfumes - Premium Fragrances`,
    description: `Discover our ${categoryName} perfume collection. ${products.length} premium fragrances to choose from.`,
    openGraph: {
      ...baseMetadata.openGraph,
      title: `${categoryName} Perfumes - Premium Fragrances`,
      description: `Discover our ${categoryName} perfume collection.`,
      url: `/products?category=${category}`,
    },
    other: {
      'application/ld+json': JSON.stringify(structuredData),
    },
  };
}

// Generate metadata for checkout page
export function generateCheckoutMetadata(): Metadata {
  return {
    ...baseMetadata,
    title: 'Secure Checkout - Complete Your Order',
    description: 'Complete your perfume purchase with our secure checkout process. Free shipping across India.',
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      ...baseMetadata.openGraph,
      title: 'Secure Checkout - Complete Your Order',
      description: 'Complete your perfume purchase with our secure checkout process.',
      url: '/checkout',
    },
  };
}

// Generate metadata for contact page
export function generateContactMetadata(): Metadata {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Us - Aromé Luxe',
    description: 'Get in touch with Aromé Luxe for any questions about our perfumes and fragrances.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://aromeluxe.in'}/contact`,
    mainEntity: {
      '@type': 'Organization',
      name: 'Aromé Luxe',
      email: 'contact@aromeluxe.in',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+91-9876543210',
        contactType: 'customer service',
        availableLanguage: ['English', 'Hindi'],
      },
    },
  };

  return {
    ...baseMetadata,
    title: 'Contact Us - Get in Touch',
    description: 'Get in touch with Aromé Luxe for any questions about our perfumes and fragrances. We\'re here to help!',
    openGraph: {
      ...baseMetadata.openGraph,
      title: 'Contact Us - Get in Touch',
      description: 'Get in touch with Aromé Luxe for any questions about our perfumes and fragrances.',
      url: '/contact',
    },
    other: {
      'application/ld+json': JSON.stringify(structuredData),
    },
  };
}

export { baseMetadata };
