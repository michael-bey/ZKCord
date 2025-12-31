import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@zkpassport/sdk", "@aztec/bb.js"],
  transpilePackages: ["buffer"],
};

export default nextConfig;
