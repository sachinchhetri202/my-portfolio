'use client'
// src/app/page.tsx
import Image from 'next/image'
import Link from 'next/link'
import { SiPython, SiDocker, SiPostgresql, SiCloudflare, SiGit } from 'react-icons/si'
import { motion } from 'framer-motion'
import AnimatedBackground from '../components/AnimatedBackground'

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950">
      <AnimatedBackground />
      <div className="relative flex flex-col items-center text-center space-y-12 py-24 px-4 sm:px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-transparent to-green-500/10"
        />
        <div className="relative z-10 flex flex-col items-center space-y-8">
          {/* Profile */}
          <div className="relative w-48 h-48 rounded-full ring-4 ring-green-500 overflow-hidden">
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
            Software Engineer & Backend Developer
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
            className="relative"
          >
            <pre className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 font-mono text-left w-full whitespace-pre-wrap break-words shadow-xl">
              <code className="block text-sm sm:text-base text-green-200">
                {`def introduce_myself():
    return "Hello, I am Sachin Chhetri, A Software Engineer."`}
              </code>
            </pre>
          </motion.div>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="flex space-x-4"
          >
            <Link
              href="/projects"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-8 py-3 text-base font-medium text-white transition-all duration-300 hover:scale-105"
            >
              <span className="relative z-10">&lt;/&gt; Projects</span>
            </Link>
            <Link
              href="/about"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg border-2 border-green-500 px-8 py-3 text-base font-medium text-green-500 transition-all duration-300 hover:bg-green-700 hover:border-green-700 hover:text-white hover:scale-105"
            >
              <span className="relative z-10">About Me</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
