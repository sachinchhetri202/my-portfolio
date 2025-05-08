// src/app/layout.tsx
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Nav from "../components/Nav"
import Footer from "../components/Footer"
import type { ReactNode } from "react"

// Load your Google fonts as CSS variables
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "My Portfolio",
  description: "Sachin Chhetri — Backend Developer",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="
        bg-gray-950 
        text-green-300 
        font-sans               /* uses --font-geist-sans */
        flex flex-col min-h-screen
      ">
        <Nav />

        <main className="
          flex-grow 
          max-w-4xl mx-auto 
          px-4 sm:px-6 md:px-8 
          py-8
        ">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  )
}
