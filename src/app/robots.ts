import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://sachinpc202.netlify.app'
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/*', // Block API routes
        '/_next/*', // Block Next.js internals
        '/admin/*', // Block any admin routes if you add them later
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
} 