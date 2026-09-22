import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: { optimizePackageImports: ["@chakra-ui/react"] },
  async rewrites() {
    return [{
      source: "/api/:path*",
      destination: `${process.env.API_URL ?? "http://127.0.0.1:4000"}/:path*`,
    }];
  },
};

export default nextConfig;
