import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: true,
  devIndicators: {
    appIsrStatus: false
  }
};

export default nextConfig;