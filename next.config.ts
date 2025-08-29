import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
