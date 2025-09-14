import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configure for static export to Hostinger
  output: "export",
  // Only set basePath and assetPrefix for production builds
  basePath: process.env.NODE_ENV === "production" && process.env.BASE_PATH ? process.env.BASE_PATH : "",
  assetPrefix: process.env.NODE_ENV === "production" && process.env.URL ? process.env.URL : undefined,
  
  // Image optimization for static export
  images: {
    unoptimized: true,
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Disable trailing slash for better compatibility
  trailingSlash: false,
  
  // Experimental features for better performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  
  // Turbopack configuration (moved from experimental)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle size
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            enforce: true,
          },
        },
      };
    }
    
    return config;
  },
  
  // Headers for performance and security (disabled for static export)
  // Note: Headers don't work with static export, configure them on your hosting provider
  // async headers() {
  //   return [
  //     {
  //       source: "/(.*)",
  //       headers: [
  //         {
  //           key: "X-DNS-Prefetch-Control",
  //           value: "on"
  //         },
  //         {
  //           key: "X-XSS-Protection",
  //           value: "1; mode=block"
  //         },
  //         {
  //           key: "X-Frame-Options",
  //           value: "SAMEORIGIN"
  //         },
  //         {
  //           key: "X-Content-Type-Options",
  //           value: "nosniff"
  //         },
  //         {
  //           key: "Referrer-Policy",
  //           value: "origin-when-cross-origin"
  //         },
  //         {
  //           key: "Access-Control-Allow-Origin",
  //           value: "*",
  //         },
  //         {
  //           key: "Access-Control-Allow-Methods",
  //           value: "GET, POST, PUT, DELETE, OPTIONS",
  //         },
  //         {
  //           key: "Access-Control-Allow-Headers",
  //           value: "Content-Type, Authorization",
  //         },
  //       ],
  //     },
  //     {
  //       source: "/api/(.*)",
  //       headers: [
  //         {
  //           key: "Cache-Control",
  //           value: "public, max-age=300, s-maxage=300, stale-while-revalidate=86400",
  //         },
  //       ],
  //     },
  //     {
  //       source: "/(.*\\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot))",
  //       headers: [
  //         {
  //           key: "Cache-Control",
  //           value: "public, max-age=31536000, immutable",
  //         },
  //       ],
  //     },
  //   ];
  // },
  
  // Redirects for SEO (disabled for static export)
  // Note: Redirects don't work with static export, configure them on your hosting provider
  // async redirects() {
  //   return [
  //     {
  //       source: '/home',
  //       destination: '/',
  //       permanent: true,
  //     },
  //   ];
  // },
};

export default nextConfig;
