import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['buffer'],

  // Proof verification (only /api/verify) loads @aztec/bb.js and the v4 alias the SDK also uses at runtime.
  // Ship only their Node builds. Leaving out the native `bb` binaries (build/) matters twice: they would
  // blow the 250 MB function limit, and when present bb.js runs them in preference to WASM, and they
  // write their CRS cache to ./.bb-crs, which is read-only on Vercel. The WASM backend honors /tmp.
  outputFileTracingIncludes: {
    '/api/verify': ['node_modules/@aztec/bb.js*/package.json', 'node_modules/@aztec/bb.js*/dest/node*/**/*'],
  },
  outputFileTracingExcludes: {
    '*': ['node_modules/@aztec/bb.js*/dest/browser/**/*', 'node_modules/@aztec/bb.js*/build/**/*'],
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
