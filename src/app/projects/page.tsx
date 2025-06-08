// src/app/projects/page.tsx
'use client'

import Link from 'next/link'
import { FaGithub, FaExternalLinkAlt, FaStar, FaCodeBranch, FaEye, FaCalendarAlt } from 'react-icons/fa'
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
  watchers_count: number;
  language: string | null;
  updated_at: string;
  created_at: string;
  topics: string[];
  homepage: string | null;
  size: number;
  default_branch: string;
  archived: boolean;
  fork: boolean;
  private: boolean;
}

// Configuration for featured projects and filtering
const GITHUB_CONFIG = {
  username: 'sachinchhetri202',
  maxRepos: 12,
  // Repositories to exclude (forks, archived, or specific repos you don't want to show)
  excludeRepos: ['sachinchhetri202', 'config-files', 'dotfiles'],
  // Featured repositories (will be shown first)
  featuredRepos: ['HomeExpenseTracker', 'my-portfolio'],
  // Minimum stars to show (set to 0 to show all)
  minStars: 0,
  // Show forks (set to false to hide forked repositories)
  showForks: false,
  // Cache duration in minutes
  cacheMinutes: 30
}

export default function ProjectsPage() {
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [lastFetch, setLastFetch] = useState<Date | null>(null)

  const getCachedRepos = () => {
    try {
      const cached = localStorage.getItem('github-repos')
      const cacheTime = localStorage.getItem('github-repos-time')
      
      if (cached && cacheTime) {
        const cacheDate = new Date(cacheTime)
        const now = new Date()
        const diffMinutes = (now.getTime() - cacheDate.getTime()) / (1000 * 60)
        
        if (diffMinutes < GITHUB_CONFIG.cacheMinutes) {
          return JSON.parse(cached)
        }
      }
    } catch (error) {
      console.error('Error reading cache:', error)
    }
    return null
  }

  const setCachedRepos = (repos: GitHubRepo[]) => {
    try {
      localStorage.setItem('github-repos', JSON.stringify(repos))
      localStorage.setItem('github-repos-time', new Date().toISOString())
    } catch (error) {
      console.error('Error setting cache:', error)
    }
  }

  const filterAndSortRepos = (repos: GitHubRepo[]): GitHubRepo[] => {
    return repos
      .filter(repo => {
        // Exclude specific repositories
        if (GITHUB_CONFIG.excludeRepos.includes(repo.name)) return false
        
        // Exclude forks if configured
        if (!GITHUB_CONFIG.showForks && repo.fork) return false
        
        // Exclude archived repositories
        if (repo.archived) return false
        
        // Exclude repositories with insufficient stars
        if (repo.stargazers_count < GITHUB_CONFIG.minStars) return false
        
        return true
      })
      .sort((a, b) => {
        // Featured repositories first
        const aFeatured = GITHUB_CONFIG.featuredRepos.includes(a.name)
        const bFeatured = GITHUB_CONFIG.featuredRepos.includes(b.name)
        
        if (aFeatured && !bFeatured) return -1
        if (!aFeatured && bFeatured) return 1
        
        // Then sort by stars, then by update date
        if (a.stargazers_count !== b.stargazers_count) {
          return b.stargazers_count - a.stargazers_count
        }
        
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      })
      .slice(0, GITHUB_CONFIG.maxRepos)
  }

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        // Check cache first
        const cachedRepos = getCachedRepos()
        if (cachedRepos) {
          setRepos(filterAndSortRepos(cachedRepos))
          setIsLoading(false)
          setLastFetch(new Date(localStorage.getItem('github-repos-time') || ''))
          return
        }

        const res = await fetch(
          `https://api.github.com/users/${GITHUB_CONFIG.username}/repos?per_page=100&sort=updated&type=owner`,
          {
            headers: {
              'Accept': 'application/vnd.github.v3+json',
            }
          }
        )
        
        if (!res.ok) {
          throw new Error(`GitHub API error: ${res.status} ${res.statusText}`)
        }
        
        const data: GitHubRepo[] = await res.json()
        
        // Cache the raw data
        setCachedRepos(data)
        
        // Filter and sort for display
        const filteredRepos = filterAndSortRepos(data)
        setRepos(filteredRepos)
        setLastFetch(new Date())
        
      } catch (err) {
        setError('Failed to load projects from GitHub. Please try again later.')
        console.error('GitHub API Error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRepos()
  }, [])

  const getProjectDisplayName = (name: string) => {
    return name
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
  }

  const getProjectLinks = (repo: GitHubRepo) => {
    const links = []
    
    // GitHub link
    links.push({
      url: repo.html_url,
      label: 'View Code',
      icon: FaGithub,
      primary: false
    })
    
    // Live demo link (from homepage field)
    if (repo.homepage && repo.homepage.trim()) {
      let homepage = repo.homepage.trim()
      if (!homepage.startsWith('http')) {
        homepage = `https://${homepage}`
      }
      links.push({
        url: homepage,
        label: 'Live Demo',
        icon: FaExternalLinkAlt,
        primary: true
      })
    }
    
    return links
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

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
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-green-300 drop-shadow-lg mb-4">
            My Projects
          </h1>
          <p className="text-gray-400 text-lg">
            Automatically synced from GitHub • {repos.length} projects shown
          </p>
          {lastFetch && (
            <p className="text-gray-500 text-sm mt-2">
              Last updated: {formatDate(lastFetch.toISOString())}
            </p>
          )}
        </motion.div>
        
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        )}
        
        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-red-400 py-10 bg-red-900/20 rounded-lg border border-red-800/30"
          >
            <p className="text-lg font-semibold mb-2">Unable to load projects</p>
            <p className="text-sm">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {!isLoading && !error && repos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {repos.map((repo, idx: number) => {
              const isFeatured = GITHUB_CONFIG.featuredRepos.includes(repo.name)
              const links = getProjectLinks(repo)
              
              return (
                <motion.div
                  key={repo.id}
                  className={`group bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 shadow-2xl border transition-all duration-300 overflow-hidden relative ${
                    isFeatured 
                      ? 'border-green-400/50 hover:border-green-400 hover:shadow-green-900/30' 
                      : 'border-green-900/30 hover:border-green-400/70 hover:shadow-green-900/20'
                  }`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 + 0.2 }}
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Featured Badge */}
                  {isFeatured && (
                    <div className="absolute top-4 right-4 bg-green-500 text-gray-900 text-xs font-bold px-2 py-1 rounded-full">
                      Featured
                    </div>
                  )}
                  
                  {/* Title */}
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold group-hover:text-white transition-colors duration-300 mb-2">
                      {getProjectDisplayName(repo.name)}
                    </h2>
                    
                    {/* Topics/Tags */}
                    {repo.topics && repo.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {repo.topics.slice(0, 3).map((topic) => (
                          <span
                            key={topic}
                            className="px-2 py-1 bg-gray-800/70 rounded-full text-xs text-green-300 font-mono"
                          >
                            {topic}
                          </span>
                        ))}
                        {repo.topics.length > 3 && (
                          <span className="px-2 py-1 bg-gray-800/70 rounded-full text-xs text-gray-400 font-mono">
                            +{repo.topics.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-gray-400 mb-4 line-clamp-3 text-sm leading-relaxed">
                    {repo.description || 'No description provided.'}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-green-200/80 mb-4">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <FaStar className="text-yellow-400" />
                        {repo.stargazers_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaCodeBranch />
                        {repo.forks_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaEye />
                        {repo.watchers_count}
                      </span>
                    </div>
                    
                    {repo.language && (
                      <span className="px-2 py-1 bg-gray-800/70 rounded-full text-xs text-green-300 font-mono">
                        {repo.language}
                      </span>
                    )}
                  </div>

                  {/* Date */}
                  <div className="flex items-center text-xs text-gray-400 mb-4">
                    <FaCalendarAlt className="mr-1" />
                    Updated {formatDate(repo.updated_at)}
                  </div>

                  {/* Action Links */}
                  <div className="flex gap-2">
                    {links.map((link, linkIdx) => (
                      <Link
                        key={linkIdx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          link.primary
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                        }`}
                      >
                        <link.icon className="text-sm" />
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        )}
        
        {!isLoading && !error && repos.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-400 py-10"
          >
            No repositories found matching the criteria.
          </motion.div>
        )}

        <div className="text-center mt-12">
          <Link
            href={`https://github.com/${GITHUB_CONFIG.username}?tab=repositories`}
            target="_blank"
            className="inline-flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-gray-900 font-semibold py-3 px-6 rounded-lg transition shadow-lg"
          >
            <FaGithub />
            <span>View All on GitHub</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
