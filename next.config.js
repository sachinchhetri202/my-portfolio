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


