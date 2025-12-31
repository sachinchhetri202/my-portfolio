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
  // Externalize large packages - they'll be available in node_modules at runtime
  // This prevents them from being bundled into the serverless function
  serverComponentsExternalPackages: [
    '@huggingface/inference',
  ],
  // Configure webpack to externalize packages for API routes
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Mark large packages as external for API routes
      // They will be loaded from node_modules at runtime
      config.externals = config.externals || [];
      if (typeof config.externals === 'object' && !Array.isArray(config.externals)) {
        config.externals = [config.externals];
      }
      config.externals.push({
        '@huggingface/inference': 'commonjs @huggingface/inference',
      });
    }
    return config;
  },
  // Reduce function size by excluding unnecessary files from serverless functions
  experimental: {
    outputFileTracingExcludes: {
      // API route specific exclusions (most aggressive)
      '/api/chat': [
        // Exclude large AI packages - they're dynamically imported
        'node_modules/@huggingface/**',
        // Exclude platform-specific binaries
        'node_modules/@swc/**',
        'node_modules/@next/swc/**',
        // Exclude build tools
        'node_modules/esbuild/**',
        'node_modules/webpack/**',
        'node_modules/@types/**',
        // Exclude dev dependencies
        'node_modules/typescript/**',
        'node_modules/eslint/**',
        'node_modules/tailwindcss/**',
        'node_modules/postcss/**',
        'node_modules/autoprefixer/**',
        // Exclude client-only libraries
        'node_modules/framer-motion/**',
        'node_modules/react-icons/**',
        'node_modules/@headlessui/**',
        'node_modules/@heroicons/**',
        'node_modules/react-markdown/**',
        // Exclude documentation and tests
        'node_modules/**/README.md',
        'node_modules/**/CHANGELOG.md',
        'node_modules/**/LICENSE',
        'node_modules/**/examples/**',
        'node_modules/**/test/**',
        'node_modules/**/tests/**',
        'node_modules/**/__tests__/**',
        'node_modules/**/__mocks__/**',
        'node_modules/**/spec/**',
        'node_modules/**/docs/**',
        'node_modules/**/*.map',
      ],
      // Global exclusions for all routes
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
        // Exclude development dependencies
        'node_modules/typescript/**',
        'node_modules/eslint/**',
        'node_modules/@eslint/**',
        'node_modules/tailwindcss/**',
        'node_modules/postcss/**',
        'node_modules/autoprefixer/**',
        'node_modules/framer-motion/**',
        // Exclude optional dependencies and large packages that aren't needed in serverless
        'node_modules/.cache/**',
        'node_modules/.bin/**',
        // Exclude documentation and examples
        'node_modules/**/README.md',
        'node_modules/**/CHANGELOG.md',
        'node_modules/**/LICENSE',
        'node_modules/**/examples/**',
        'node_modules/**/test/**',
        'node_modules/**/tests/**',
        'node_modules/**/__tests__/**',
        'node_modules/**/__mocks__/**',
        'node_modules/**/spec/**',
        'node_modules/**/docs/**',
        // Exclude source maps for dependencies
        'node_modules/**/*.map',
        // Exclude test files from our codebase
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


