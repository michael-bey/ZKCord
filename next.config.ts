import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@zkpassport/sdk", "@aztec/bb.js"],
  transpilePackages: ["buffer"],
  turbopack: {
    resolveAlias: {
      buffer: "./src/lib/buffer-shim.ts",
    },
  },
};

export default nextConfig;
