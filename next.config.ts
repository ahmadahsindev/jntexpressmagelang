import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    cssChunking: "strict", // Prevent CSS merging issues that cause styles to not load on some devices
  },
};

export default nextConfig;
