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
  themeColor: '#111827', // matches your dark theme
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://sachinchhetri.com'),
  title: {
    default: "Sachin Chhetri | Backend Developer",
    template: "%s | Sachin Chhetri"
  },
  description: "Backend Developer specializing in Python, Django, and modern web technologies. Experienced in full-stack development and API design.",
  authors: [{ name: "Sachin Chhetri", url: "https://sachinchhetri.com" }],
  keywords: [
    "Backend Developer",
    "Software Engineer",
    "Full Stack Developer",
    "Python Developer",
    "Django Developer",
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
    url: "https://sachinchhetri.com",
    siteName: "Sachin Chhetri",
    title: "Sachin Chhetri | Backend Developer",
    description: "Backend Developer specializing in Python, Django, and modern web technologies",
    images: [
      {
        url: "/og-image.jpg", // You'll need to add this image
        width: 1200,
        height: 630,
        alt: "Sachin Chhetri - Backend Developer"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Sachin Chhetri | Backend Developer",
    description: "Backend Developer specializing in Python, Django, and modern web technologies",
    images: ["/og-image.jpg"], // Same image as OpenGraph
    creator: "@sachinchhetri" // Replace with your Twitter handle if you have one
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
          bg-gray-950 
          text-green-300 
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
