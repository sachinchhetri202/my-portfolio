// src/app/layout.tsx
import type { Metadata } from "next"
import { Inter, Roboto_Mono, Montserrat } from "next/font/google"
import "./globals.css"
import Nav from "../components/Nav"
import Footer from "../components/Footer"
import type { ReactNode } from "react"
import { ChatBot } from "../components/chat/ChatBot"

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

export const metadata: Metadata = {
  title: "Sachin Chhetri",
  description: "Sachin Chhetri — Backend Developer",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
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

        <main className="
          flex-grow 
          max-w-4xl mx-auto 
          px-4 sm:px-6 md:px-8 
          py-8
        ">
          {children}
        </main>

        <Footer />
        <ChatBot />
      </body>
    </html>
  )
}
