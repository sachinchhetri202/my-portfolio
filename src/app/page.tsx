'use client'
// src/app/page.tsx
import Image from 'next/image'
import Link from 'next/link'
import { SiPython, SiDocker, SiPostgresql, SiCloudflare, SiGit } from 'react-icons/si'
import { motion } from 'framer-motion'
import AnimatedBackground from '../components/AnimatedBackground'
import { PersonSchema, WebsiteSchema } from '../components/SchemaMarkup'
import { useResumeDownload } from '../components/Analytics'

export default function HomePage() {
  const trackResumeDownload = useResumeDownload()
  
  return (
    <>
      <PersonSchema />
      <WebsiteSchema />
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950">
        <AnimatedBackground />
        <div className="relative w-full pt-24 sm:pt-12 pb-8 sm:py-12 px-4 sm:px-6 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-transparent to-green-500/10"
          />
          <div className="relative z-10 flex flex-col items-center space-y-6 sm:space-y-8 text-center">
            {/* Profile */}
            <div className="relative w-32 h-32 sm:w-48 sm:h-48 rounded-full ring-4 ring-green-500 overflow-hidden">
              <Image
                src="https://i.postimg.cc/0jbHD5jm/05ae2658-aec3-4526-9e97-1bfe5f5b60f8.jpg"
                alt="Sachin Chhetri"
                fill
                className="object-cover"
              />
            </div>

            {/* Terminal command */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-mono text-green-400 text-sm sm:text-base"
            >
              $ python manage.py runserver
            </motion.p>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-5xl sm:text-6xl font-bold text-white bg-clip-text bg-gradient-to-r from-green-300 to-green-200"
            >
              Software/AI-Driven Applications Engineer
            </motion.h1>

            {/* Icons row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex space-x-6 text-4xl sm:text-5xl text-green-400"
            >
              <SiPython />
              <SiDocker />
              <SiPostgresql />
              <SiCloudflare />
              <SiGit />
            </motion.div>

            {/* Code snippet */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="relative w-full max-w-lg mx-4"
            >
              <pre className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 font-mono text-left w-full whitespace-pre-wrap break-words shadow-xl overflow-x-auto">
                <code className="block text-xs sm:text-sm md:text-base text-green-200">
                  {`def introduce_myself():
    return "Hello, I am Sachin Chhetri, A Software/AI-Driven Applications Engineer."`}
                </code>
              </pre>
            </motion.div>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl px-4 justify-center items-center"
            >
              <Link
                href="/projects"
                className="group relative flex items-center justify-center rounded-xl bg-gray-900 border-2 border-green-500/30 transition-all duration-300 hover:border-green-400 hover:scale-105 hover:shadow-[0_0_2rem_-0.5rem_#4ade80] w-full sm:w-auto"
                role="button"
                aria-label="View Projects"
              >
                <div className="relative flex w-full items-center justify-center space-x-3 px-8 py-3.5">
                  <code className="text-lg font-semibold bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">&lt;/&gt;</code>
                  <span className="font-medium bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">Projects</span>
                </div>
                <div className="absolute inset-x-0 h-[2px] bottom-0 bg-gradient-to-r from-transparent via-green-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </Link>

              <Link
                href="/about"
                className="group relative flex items-center justify-center rounded-xl bg-gray-900 border-2 border-green-500/30 transition-all duration-300 hover:border-green-400 hover:scale-105 hover:shadow-[0_0_2rem_-0.5rem_#4ade80] w-full sm:w-auto"
                role="button"
                aria-label="About Me"
              >
                <div className="relative flex w-full items-center justify-center px-8 py-3.5">
                  <span className="font-medium bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">About Me</span>
                </div>
                <div className="absolute inset-x-0 h-[2px] bottom-0 bg-gradient-to-r from-transparent via-green-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </Link>

              <a
                href="/resume/Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackResumeDownload('homepage_hero')}
                className="group relative flex items-center justify-center rounded-xl bg-gray-900 border-2 border-green-500/30 transition-all duration-300 hover:border-green-400 hover:scale-105 hover:shadow-[0_0_2rem_-0.5rem_#4ade80] w-full sm:w-auto"
                role="button"
                aria-label="Download CV"
              >
                <div className="relative flex w-full items-center justify-center space-x-3 px-8 py-3.5">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="url(#gradient)"
                  >
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#4ade80" />
                        <stop offset="100%" stopColor="#34d399" />
                      </linearGradient>
                    </defs>
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" 
                    />
                  </svg>
                  <span className="font-medium bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">Download CV</span>
                </div>
                <div className="absolute inset-x-0 h-[2px] bottom-0 bg-gradient-to-r from-transparent via-green-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  )
}
