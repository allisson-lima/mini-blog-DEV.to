import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [new URL("https://media2.dev.to/**"), new URL("https://dev-to-uploads.s3.amazonaws.com/**")],
  },
};

export default nextConfig;
