import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
    domains: [],
  },
  trailingSlash: false,
  experimental: {
    optimizePackageImports: [],
  },
};

export default nextConfig;
