// src/app/projects/page.tsx
'use client'

import Link from 'next/link'
import { FaGithub, FaExternalLinkAlt, FaStar, FaCodeBranch } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import AnimatedBackground from '@/components/AnimatedBackground'

interface GitHubRepo {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
}

export default function ProjectsPage() {
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const res = await fetch(
          'https://api.github.com/users/sachinchhetri202/repos?per_page=8&sort=updated'
        )
        if (!res.ok) throw new Error('Failed to fetch repositories')
        const data = await res.json()
        setRepos(data)
      } catch (err) {
        setError('Failed to load projects. Please try again later.')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRepos()
  }, [])

  return (
    <section className="relative min-h-screen py-20 px-4 sm:px-6 lg:px-16 overflow-hidden">
      {/* Animated Particle Background */}
      <AnimatedBackground />
      
      {/* Gradient Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-gradient-to-br from-gray-950/90 via-gray-900/90 to-gray-950/90 -z-5"
      />
      
      {/* Animated Background Accent */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-br from-green-500/20 via-green-400/10 to-transparent rounded-full blur-3xl opacity-70 animate-pulse"></div>
      </div>
      <div className="relative z-10 max-w-6xl mx-auto space-y-16">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl font-bold text-green-300 drop-shadow-lg text-center mb-8"
        >
          Highlighted Projects
        </motion.h1>
        
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        )}
        
        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-red-400 py-10"
          >
            {error}
          </motion.div>
        )}

        {!isLoading && !error && repos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-10"
          >
          {repos.map((repo, idx: number) => (
            <motion.div
              key={repo.id}
              className="group bg-gray-900/80 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-green-900/30 hover:border-green-400 hover:shadow-green-900/20 transition-all duration-300 overflow-hidden relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 + 0.2 }}
              whileHover={{ scale: 1.03 }}
            >
              <Link
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block focus:outline-none"
              >
                {/* Title */}
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-xl md:text-2xl font-semibold group-hover:text-white break-words whitespace-normal transition-colors duration-300">
                    {repo.name.replace(/[-_]/g, ' ')}
                  </h2>
                  <FaExternalLinkAlt className="mt-1 text-green-400 group-hover:text-green-200 transition-colors duration-300" />
                </div>

                {/* Description */}
                <p className="text-gray-400 mb-4 line-clamp-3 break-words whitespace-normal text-sm sm:text-base">
                  {repo.description || 'No description provided.'}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-green-200/80 mt-4">
                  <span className="flex items-center gap-2">
                    <FaStar className="text-yellow-400" /> <span>{repo.stargazers_count}</span>
                    <FaCodeBranch className="ml-3" /> <span>{repo.forks_count}</span>
                  </span>
                  <span className="flex items-center gap-2">
                    {repo.language && (
                      <span className="px-2 py-1 bg-gray-800/70 rounded-full text-xs text-green-300 font-mono">
                        {repo.language}
                      </span>
                    )}
                    <span className="ml-2 text-gray-400 font-mono">{new Date(repo.updated_at).toLocaleDateString()}</span>
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
          </motion.div>
        )}
        
        {!isLoading && !error && repos.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-400 py-10"
          >
            No repositories found.
          </motion.div>
        )}

        <div className="text-center mt-8">
          <Link
            href="https://github.com/sachinchhetri202?tab=repositories"
            target="_blank"
            className="inline-flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-gray-900 font-semibold py-2 px-4 rounded transition shadow-lg"
          >
            <FaGithub />
            <span>View All on GitHub</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
