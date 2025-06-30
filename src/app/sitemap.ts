import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://sachinpc202.netlify.app'
  
  // Static pages
  const staticPages = [
    '',
    '/about',
    '/projects', 
    '/services',
    '/contact'
  ]

  const staticRoutes = staticPages.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // You can add dynamic routes here later if you have blog posts or dynamic project pages
  // Example:
  // const dynamicRoutes = await fetchProjectSlugs().then(slugs =>
  //   slugs.map(slug => ({
  //     url: `${baseUrl}/projects/${slug}`,
  //     lastModified: new Date(),
  //     changeFrequency: 'weekly' as const,
  //     priority: 0.6,
  //   }))
  // )

  return [
    ...staticRoutes,
    // ...dynamicRoutes, // Uncomment when you have dynamic routes
  ]
} 