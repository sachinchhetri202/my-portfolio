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
  FiChevronDown
} from 'react-icons/fi'

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
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

  const links = [
    { href: '/',         icon: <FiTerminal />,  label: 'home'     },
    { href: '/about',    icon: <FiCode />,      label: 'about'    },
    { href: '/services', icon: <FiDatabase />,  label: 'services' },
    { href: '/projects', icon: <FiGitBranch />, label: 'projects' },
  ]

  // Keyboard accessibility for mobile menu
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') setIsOpen(false)
  }

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 w-full px-8 py-4 z-50 backdrop-blur shadow-lg transition-all duration-300 ${scrolled ? 'bg-gray-900/60 text-green-400/80' : 'bg-gray-900/90 text-green-400'} hover:bg-gray-900/90 hover:text-green-400`}>
    
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Brand area */}
        <div className="flex items-center space-x-4">
          <span className="font-mono font-bold text-green-400">$</span>
          <Link href="/" className="font-mono font-bold text-lg hover:text-white transition">
            SachinChhetri
          </Link>
          <span className="bg-gray-800 text-sm text-green-300 rounded-full px-3 py-1 font-sans">
            Software Eng.
          </span>
        </div>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center space-x-6">
          {links.map(({ href, icon, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`flex items-center space-x-1 font-mono transition ${pathname === href ? 'text-white font-bold underline underline-offset-4' : 'hover:text-white'}`}
                aria-current={pathname === href ? 'page' : undefined}
              >
                <span className="text-xl">{icon}</span>
                <span>/{label}</span>
              </Link>
            </li>
          ))}
          {/* Example dropdown */}
          <li className="relative">
            <button
              className="flex items-center space-x-1 hover:text-white transition font-mono focus:outline-none"
              onClick={() => setDropdownOpen((o) => !o)}
              onBlur={() => setDropdownOpen(false)}
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            >
              <span className="text-xl"><FiChevronDown /></span>
              <span>More</span>
            </button>
            <AnimatePresence>
              {dropdownOpen && (
                <motion.ul
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 mt-2 w-40 bg-gray-800 rounded-lg shadow-lg py-2 z-50"
                >
                  <li>
                    <Link
                      href="/contact"
                      className="block px-4 py-2 hover:bg-green-600 hover:text-white text-green-300 font-mono"
                    >
                      contact.py
                    </Link>
                  </li>
                </motion.ul>
              )}
            </AnimatePresence>
          </li>
        </ul>

        {/* Mobile toggle button */}
        <button
          onClick={() => setIsOpen((o) => !o)}
          className="md:hidden text-2xl p-1"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`
          md:hidden absolute top-full left-0 w-full bg-gray-900 shadow-lg
          ${isOpen ? 'block' : 'hidden'}
        `}
      >
        <ul className="flex flex-col items-start space-y-4 p-6">
          {links.map(({ href, icon, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="flex items-center space-x-2 hover:text-white transition font-mono"
                onClick={() => setIsOpen(false)}
              >
                <span className="text-xl">{icon}</span>
                <span>/{label}</span>
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/contact"
              className="block w-full text-center bg-green-500 hover:bg-green-600 text-gray-900 font-mono font-semibold py-2 px-4 rounded transition"
              onClick={() => setIsOpen(false)}
            >
              contact.py
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}
