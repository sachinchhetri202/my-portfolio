/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',  // Static HTML export for Netlify - Commented out to allow dynamic API routes
  images: {
    unoptimized: true, // Required for static export
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  reactStrictMode: true,
  // Configure webpack to optimize bundle size
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Mark large packages as external for serverless functions
      // They will be loaded dynamically at runtime
      config.externals = config.externals || [];
      // Don't bundle @huggingface/inference - it's loaded dynamically
      // This reduces the serverless function size significantly
    }
    return config;
  },
  // Reduce function size by excluding unnecessary files from serverless functions
  experimental: {
    outputFileTracingExcludes: {
      '*': [
        // Exclude platform-specific SWC binaries (only need Linux for Netlify)
        'node_modules/@swc/core-linux-x64-gnu/**',
        'node_modules/@swc/core-linux-x64-musl/**',
        'node_modules/@swc/core-darwin-x64/**',
        'node_modules/@swc/core-darwin-arm64/**',
        'node_modules/@swc/core-win32-x64-msvc/**',
        'node_modules/@next/swc-linux-x64-gnu/**',
        'node_modules/@next/swc-linux-x64-musl/**',
        'node_modules/@next/swc-darwin-x64/**',
        'node_modules/@next/swc-darwin-arm64/**',
        'node_modules/@next/swc-win32-x64-msvc/**',
        // Exclude build tools not needed in production
        'node_modules/esbuild/**',
        'node_modules/webpack/**',
        'node_modules/@types/**',
        // Note: AI packages (@huggingface/inference, @google/generative-ai) 
        // are loaded dynamically, so they won't be in the initial bundle
        // but they still need to be available in node_modules at runtime
        // Exclude test files
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/*.test.js',
        '**/*.test.jsx',
        '**/*.spec.ts',
        '**/*.spec.tsx',
        '**/__tests__/**',
        '**/__mocks__/**',
      ],
    },
  },
};

module.exports = nextConfig;


