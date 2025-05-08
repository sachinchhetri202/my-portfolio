/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Static HTML export for Netlify
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
  swcMinify: true,
};

module.exports = nextConfig;
