import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [new URL("https://media2.dev.to/**")],
  },
};

export default nextConfig;
