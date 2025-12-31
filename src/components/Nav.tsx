// src/components/Nav.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiMenu,
  FiX,
  FiTerminal,
  FiCode,
  FiDatabase,
  FiGitBranch,
  FiChevronDown,
  FiExternalLink,
  FiGithub,
  FiLinkedin,
  FiMail
} from 'react-icons/fi'

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)
  const pathname = usePathname()
  
  // Track scroll position to adjust nav transparency
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY
      if (offset > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !(event.target as Element).closest('nav')) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const links = [
    { href: '/',         icon: <FiTerminal />,  label: 'home',     description: 'Main terminal' },
    { href: '/about',    icon: <FiCode />,      label: 'about',    description: 'Developer info' },
    { href: '/services', icon: <FiDatabase />,  label: 'services', description: 'Tech stack' },
    { href: '/projects', icon: <FiGitBranch />, label: 'projects', description: 'Portfolio' },
  ]

  const socialLinks = [
    { href: 'https://github.com/sachinchhetri202', icon: <FiGithub />, label: 'GitHub', external: true },
    { href: 'https://www.linkedin.com/in/sachin-chhetri-475831199/', icon: <FiLinkedin />, label: 'LinkedIn', external: true },
    { href: '/contact', icon: <FiMail />, label: 'Contact', external: false },
  ]

  // We'll use this function in the mobile menu div
  const handleEscapeKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') setIsOpen(false)
  }

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.1
      }
    }
  }

  const linkVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    open: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  }

  return (
    <motion.nav 
      variants={navVariants}
      initial="hidden"
      animate="visible"
      className={`fixed top-0 left-0 right-0 w-full px-4 sm:px-8 py-3 sm:py-4 z-50 transition-all duration-500 ease-out ${
        scrolled 
          ? 'glass-morphism-dark shadow-2xl border-b border-blue-500/30' 
          : 'glass-morphism-dark shadow-lg border-b border-blue-500/10'
      }`}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5 opacity-0 hover:opacity-100 transition-opacity duration-700" />
      
      <div className="relative max-w-7xl mx-auto flex items-center justify-between">
        {/* Enhanced Brand area */}
        <motion.div 
          variants={linkVariants}
          className="flex flex-col sm:flex-row sm:items-center group"
        >
          <Link 
            href="/" 
            className="flex items-baseline font-mono transition-all duration-300 hover:scale-105 relative"
          >
            <span className="text-sm sm:text-lg font-bold ml-1 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              Sachin Chhetri
            </span>
          </Link>
          <motion.span 
            variants={linkVariants}
            className="text-[10px] sm:text-xs inline-block bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-300 rounded-full px-2 sm:px-3 py-1 sm:py-1.5 font-sans sm:ml-3 border border-blue-500/30 shadow-lg backdrop-blur-sm"
            whileHover={{ scale: 1.05, y: -1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            AI Engineer
          </motion.span>
        </motion.div>

        {/* Enhanced Desktop Links */}
        <motion.ul 
          variants={linkVariants}
          className="hidden lg:flex items-center space-x-8"
        >
          {links.map(({ href, icon, label, description }) => (
            <motion.li 
              key={href}
              variants={linkVariants}
              onHoverStart={() => setHoveredLink(href)}
              onHoverEnd={() => setHoveredLink(null)}
            >
              <Link
                href={href}
                className={`relative flex items-center space-x-2 font-medium transition-all duration-300 group ${
                  pathname === href 
                    ? 'text-white font-semibold' 
                    : 'text-slate-300/80 hover:text-white'
                }`}
                aria-current={pathname === href ? 'page' : undefined}
              >
                {/* Animated icon */}
                <motion.span 
                  className="text-lg text-blue-400 group-hover:text-purple-400"
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {icon}
                </motion.span>
                <span className="relative">
                  {label.charAt(0).toUpperCase() + label.slice(1)}
                  {/* Active indicator */}
                  {pathname === href && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </span>
                
                {/* Hover tooltip */}
                <AnimatePresence>
                  {hoveredLink === href && (
                    <motion.div
                      initial={{ opacity: 0, y: 5, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-slate-800/95 backdrop-blur-sm text-blue-300 text-xs px-2 py-1.5 rounded border border-blue-500/30 whitespace-nowrap z-50 shadow-lg"
                    >
                      {description}
                      <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-slate-800/95 border-l border-t border-blue-500/30 rotate-45" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Link>
            </motion.li>
          ))}
          
          {/* Enhanced dropdown */}
          <motion.li 
            variants={linkVariants}
            className="relative"
          >
            <button
              className="flex items-center space-x-2 hover:text-white transition-all duration-300 font-mono focus:outline-none group"
              onClick={() => setDropdownOpen((o) => !o)}
              onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            >
              <motion.span 
                className="text-xl"
                animate={{ rotate: dropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <FiChevronDown />
              </motion.span>
              <span>More</span>
            </button>
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-3 w-48 bg-slate-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-blue-500/20 py-2 z-50"
                >
                  {socialLinks.map(({ href, icon, label, external }) => (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center justify-between px-4 py-3 hover:bg-blue-600/20 hover:text-white text-blue-300 font-medium transition-all duration-200 group"
                      target={external ? '_blank' : undefined}
                      rel={external ? 'noopener noreferrer' : undefined}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg group-hover:scale-110 transition-transform duration-200">
                          {icon}
                        </span>
                        <span>{label}</span>
                      </div>
                      {external && (
                        <FiExternalLink className="text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      )}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.li>
        </motion.ul>

        {/* Enhanced Mobile toggle button */}
        <motion.button
          variants={linkVariants}
          onClick={() => setIsOpen((o) => !o)}
          className="lg:hidden relative p-2 rounded-lg hover:bg-blue-500/10 transition-colors duration-200 group"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={isOpen ? "open" : "closed"}
            className="relative w-6 h-6"
          >
            <motion.span
              variants={{
                closed: { rotate: 0, y: 0 },
                open: { rotate: 45, y: 6 }
              }}
              className="absolute w-6 h-0.5 bg-blue-400 rounded-full"
            />
            <motion.span
              variants={{
                closed: { opacity: 1 },
                open: { opacity: 0 }
              }}
              className="absolute w-6 h-0.5 bg-blue-400 rounded-full top-2"
            />
            <motion.span
              variants={{
                closed: { rotate: 0, y: 0 },
                open: { rotate: -45, y: -6 }
              }}
              className="absolute w-6 h-0.5 bg-blue-400 rounded-full top-4"
            />
          </motion.div>
        </motion.button>
      </div>

      {/* Enhanced Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="lg:hidden absolute top-full left-0 w-full bg-slate-900/95 backdrop-blur-xl shadow-2xl border-t border-blue-500/20 overflow-hidden"
            onKeyDown={handleEscapeKey}
            tabIndex={isOpen ? 0 : -1}
          >
            <div className="p-6 space-y-6">
              {/* Main navigation links */}
              <div className="space-y-4">
                <h3 className="text-blue-400 font-medium text-sm uppercase tracking-wider mb-4">
                  Navigation
                </h3>
                {links.map(({ href, icon, label, description }) => (
                  <motion.div
                    key={href}
                    variants={linkVariants}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <Link
                      href={href}
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 font-medium ${
                        pathname === href
                          ? 'bg-blue-600/20 text-white border border-blue-500/30'
                          : 'text-slate-300/80 hover:bg-blue-500/10 hover:text-white'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="text-xl text-blue-400">{icon}</span>
                      <div className="flex-1">
                        <div className="font-semibold">{label.charAt(0).toUpperCase() + label.slice(1)}</div>
                        <div className="text-xs text-blue-300/60">{description}</div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Social links */}
              <div className="space-y-4 pt-4 border-t border-blue-500/20">
                <h3 className="text-blue-400 font-medium text-sm uppercase tracking-wider mb-4">
                  Connect
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {socialLinks.map(({ href, icon, label, external }) => (
                    <motion.div
                      key={href}
                      variants={linkVariants}
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      <Link
                        href={href}
                        className="flex items-center space-x-3 p-3 rounded-lg text-blue-400/80 hover:bg-blue-500/10 hover:text-white transition-all duration-200 font-medium"
                        onClick={() => setIsOpen(false)}
                        target={external ? '_blank' : undefined}
                        rel={external ? 'noopener noreferrer' : undefined}
                      >
                        <span className="text-xl">{icon}</span>
                        <span className="flex-1">{label}</span>
                        {external && <FiExternalLink className="text-sm" />}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
