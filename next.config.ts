import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['buffer'],

  // Proof verification (only /api/verify) loads @aztec/bb.js and the v4 alias the SDK also uses at runtime.
  // Ship their Node builds and the Linux x64 binary; the other platform binaries alone would blow the
  // 250 MB function limit.
  outputFileTracingIncludes: {
    '/api/verify': [
      'node_modules/@aztec/bb.js*/package.json',
      'node_modules/@aztec/bb.js*/dest/node*/**/*',
      'node_modules/@aztec/bb.js*/build/amd64-linux/**/*',
    ],
  },
  outputFileTracingExcludes: {
    '*': [
      'node_modules/@aztec/bb.js*/dest/browser/**/*',
      'node_modules/@aztec/bb.js*/build/{arm64-macos,amd64-macos,arm64-linux}/**/*',
    ],
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
