import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: true,
  images: {
    unoptimized: true
  },
  devIndicators: {
    appIsrStatus: false
  }
};

export default nextConfig;