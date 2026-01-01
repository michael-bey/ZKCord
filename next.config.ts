import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Externalize heavy packages from server bundles
  serverExternalPackages: [],

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

    // Provide Buffer globally using the standard buffer package
    // The buffer-shim.ts import will patch the prototype at runtime
    const webpack = require('webpack');
    config.plugins = config.plugins || [];
    config.plugins.push(
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      })
    );

    // Set fallback for buffer
    config.resolve = config.resolve || {};
    config.resolve.fallback = {
      ...config.resolve.fallback,
      buffer: require.resolve('buffer/'),
    };

    return config;
  },
};

export default nextConfig;

