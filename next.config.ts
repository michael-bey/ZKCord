import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['buffer'],

  // Server-side proof verification loads @aztec/bb.js WASM at runtime; make sure it ships with the functions.
  outputFileTracingIncludes: {
    '/api/**/*': ['node_modules/@aztec/bb.js/**/*'],
  },

  // Builds use webpack (see package.json) so the browser bundle gets a global Buffer.
  webpack: (config, { isServer, webpack }) => {
    if (isServer) {
      config.externals.push({ '@aztec/bb.js': 'commonjs @aztec/bb.js' });
    }
    config.experiments = { ...config.experiments, asyncWebAssembly: true };
    config.plugins.push(new webpack.ProvidePlugin({ Buffer: ['buffer', 'Buffer'] }));
    config.resolve.fallback = { ...config.resolve.fallback, buffer: require.resolve('buffer/') };
    return config;
  },
};

export default nextConfig;
