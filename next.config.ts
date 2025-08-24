import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // ❌ ESLint errors won’t break production builds
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
