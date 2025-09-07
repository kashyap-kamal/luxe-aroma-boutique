import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configure for static export to Hostinger
  output: "export",
  basePath: process.env.BASE_PATH ? process.env.BASE_PATH : "",
  assetPrefix: process.env.URL ? process.env.URL : undefined,
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  
  // Disable trailing slash for better compatibility
  trailingSlash: false,
};

export default nextConfig;
