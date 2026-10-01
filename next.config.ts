import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['buffer'],

  // Server-side proof verification loads @aztec/bb.js (and the v4 alias the SDK also uses) WASM at runtime;
  // make sure both ship with the functions.
  outputFileTracingIncludes: {
    '/api/**/*': ['node_modules/@aztec/bb.js/**/*', 'node_modules/@aztec/bb.js-v4/**/*'],
  },

  // Builds use webpack (see package.json) so the browser bundle gets a global Buffer.
  webpack: (config, { isServer, webpack }) => {
    if (isServer) {
      config.externals.push({
        '@aztec/bb.js': 'commonjs @aztec/bb.js',
        '@aztec/bb.js-v4': 'commonjs @aztec/bb.js-v4',
      });
    }
    config.experiments = { ...config.experiments, asyncWebAssembly: true };
    config.plugins.push(new webpack.ProvidePlugin({ Buffer: ['buffer', 'Buffer'] }));
    config.resolve.fallback = { ...config.resolve.fallback, buffer: require.resolve('buffer/') };
    return config;
  },
};

export default nextConfig;
