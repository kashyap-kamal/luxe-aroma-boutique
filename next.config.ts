import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configure for static export to Hostinger
  output: "export",
  
  // Only set basePath and assetPrefix for production builds
  // This prevents CORS issues during development
  basePath: process.env.NODE_ENV === "production" && process.env.BASE_PATH ? process.env.BASE_PATH : "",
  assetPrefix: process.env.NODE_ENV === "production" && process.env.URL ? process.env.URL : undefined,
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  
  // Disable trailing slash for better compatibility
  trailingSlash: false,
  
  // Add headers for CORS (useful for development)
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
