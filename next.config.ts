import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Externalize heavy packages from server bundles
  serverExternalPackages: [
    "@zkpassport/sdk",
    "@aztec/bb.js",
    "@zkpassport/registry",
    "@zkpassport/utils",
    "@zkpassport/poseidon2",
  ],

  // Only transpile what's necessary
  transpilePackages: ["buffer"],

  // Optimize imports for packages NOT in serverExternalPackages
  experimental: {
    optimizePackageImports: [
      "@noble/curves",
      "@noble/hashes",
      "qrcode.react",
    ],
  },

  // Turbopack: Keep empty to use webpack for production builds
  // Webpack handles Buffer polyfill correctly via ProvidePlugin below
  turbopack: {},

  // Configure webpack to reduce build overhead
  webpack: (config, { isServer }) => {
    // Don't bundle heavy crypto packages on server
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        '@aztec/bb.js': 'commonjs @aztec/bb.js',
      });
    }

    // Reduce WASM processing overhead
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    // Use our custom buffer-shim which includes BigInt polyfills
    const path = require('path');
    const bufferShimPath = path.resolve(__dirname, 'src/lib/buffer-shim.ts');

    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      // All imports of 'buffer' should use our polyfilled version
      buffer: bufferShimPath,
      'buffer/': bufferShimPath,
    };

    // Provide Buffer globally for all modules including dynamically loaded chunks
    // Use our shim so BigInt methods are available everywhere
    const webpack = require('webpack');
    config.plugins = config.plugins || [];
    config.plugins.push(
      new webpack.ProvidePlugin({
        Buffer: [bufferShimPath, 'Buffer'],
      })
    );

    // Also set fallback to use our shim
    config.resolve.fallback = {
      ...config.resolve.fallback,
      buffer: bufferShimPath,
    };

    return config;
  },
};

export default nextConfig;

