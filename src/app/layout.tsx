// src/app/layout.tsx
import type { Metadata, Viewport } from "next"
import { Inter, Roboto_Mono, Montserrat } from "next/font/google"
import "./globals.css"
import Nav from "../components/Nav"
import Footer from "../components/Footer"
import type { ReactNode } from "react"
import { ChatBot } from "../components/chat/ChatBot"
import { ErrorBoundary } from "../components/ErrorBoundary"
import PlausibleProvider from 'next-plausible'

// Load your Google fonts as CSS variables
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})
const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
})
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#0F172A', // matches new dark theme (slate-900)
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://sachinpc202.netlify.app'),
  title: {
    default: "Sachin Chhetri | AI Engineer",
    template: "%s | Sachin Chhetri"
  },
  description: "AI Engineer specializing in Python, Machine Learning, and modern AI technologies. Experienced in full-stack development and AI integration.",
  authors: [{ name: "Sachin Chhetri", url: "https://sachinpc202.netlify.app/" }],
  keywords: [
    "AI Engineer",
    "Machine Learning Engineer",
    "Software Engineer",
    "Full Stack Developer",
    "Python Developer",
    "AI Developer",
    "Node.js",
    "React",
    "Web Development",
    "API Design",
    "Database Engineering"
  ],
  creator: "Sachin Chhetri",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sachinpc202.netlify.app",
    siteName: "Sachin Chhetri",
    title: "Sachin Chhetri | AI Engineer",
    description: "AI Engineer specializing in Python, Machine Learning, and modern AI technologies",
    images: [
      {
        url: "/og-image.jpg", // You'll need to add this image
        width: 1200,
        height: 630,
        alt: "Sachin Chhetri - AI Engineer"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Sachin Chhetri | AI Engineer",
    description: "AI Engineer specializing in Python, Machine Learning, and modern AI technologies",
    images: ["/og-image.jpg"], // Same image as OpenGraph
    creator: "@sachinchhetri202" 
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  }
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <PlausibleProvider domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || 'sachinpc202.netlify.app'}>
      <html
        lang="en"
        className={`${inter.variable} ${robotoMono.variable} ${montserrat.variable}`}
      >
        <body className="
          bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950
          text-slate-100 
          font-sans               /* uses --font-geist-sans */
          flex flex-col min-h-screen
        ">
        <Nav />

        <ErrorBoundary>
          <main className="
            flex-grow 
            max-w-4xl mx-auto 
            px-4 sm:px-6 md:px-8 
            py-4 sm:py-8
          ">
            {children}
          </main>
        </ErrorBoundary>

        <Footer />
        <ErrorBoundary>
          <ChatBot />
        </ErrorBoundary>
        </body>
      </html>
    </PlausibleProvider>
  )
}
