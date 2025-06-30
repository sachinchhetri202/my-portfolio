// src/components/Footer.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useAnimation, useInView } from 'framer-motion'
import { FaGithub, FaLinkedin, FaEnvelope, FaCode, FaHeart } from 'react-icons/fa'
import { FaFacebook, FaXTwitter } from 'react-icons/fa6'
import { SiPython, SiReact, SiNextdotjs, SiTailwindcss, SiTypescript, SiJavascript, SiCplusplus, SiDjango, SiDocker, SiGit } from 'react-icons/si'
import Link from 'next/link'

const TechWave = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    let width = canvas.width = canvas.offsetWidth
    const height = canvas.height = 80
    
    const waves = [
      { y: height / 2, length: 0.5, amplitude: 20, speed: 0.01, color: 'rgba(74, 222, 128, 0.2)' },
      { y: height / 2, length: 0.7, amplitude: 15, speed: 0.015, color: 'rgba(74, 222, 128, 0.15)' },
      { y: height / 2, length: 0.3, amplitude: 25, speed: 0.02, color: 'rgba(74, 222, 128, 0.1)' },
    ]
    
    let time = 0
    
    const animate = () => {
      ctx.clearRect(0, 0, width, height)
      
      waves.forEach(wave => {
        ctx.beginPath()
        ctx.moveTo(0, wave.y)
        
        for (let x = 0; x < width; x++) {
          const dx = x / width
          const angle = (dx * Math.PI * 2 / wave.length) + time * wave.speed
          const y = wave.y + Math.sin(angle) * wave.amplitude
          
          ctx.lineTo(x, y)
        }
        
        ctx.lineTo(width, height)
        ctx.lineTo(0, height)
        ctx.closePath()
        ctx.fillStyle = wave.color
        ctx.fill()
      })
      
      time += 0.05
      requestAnimationFrame(animate)
    }
    
    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth
    }
    
    window.addEventListener('resize', handleResize)
    animate()
    
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  
  return <canvas ref={canvasRef} className="w-full absolute top-0 left-0 -mt-20 pointer-events-none" />
}

const TechStack = () => {
  const techIcons = [
    { icon: <SiReact className="text-blue-400" />, name: 'React' },
    { icon: <SiNextdotjs className="text-white" />, name: 'Next.js' },
    { icon: <SiTailwindcss className="text-cyan-400" />, name: 'Tailwind' },
    { icon: <SiTypescript className="text-blue-500" />, name: 'TypeScript' },
    { icon: <SiJavascript className="text-yellow-400" />, name: 'JavaScript' },
    { icon: <SiPython className="text-yellow-300" />, name: 'Python' },
    { icon: <SiCplusplus className="text-blue-600" />, name: 'C++' },
    { icon: <SiDjango className="text-green-600" />, name: 'Django' },
    { icon: <SiDocker className="text-blue-500" />, name: 'Docker' },
    { icon: <SiGit className="text-orange-500" />, name: 'Git' },
  ]
  
  return (
    <div className="flex flex-wrap justify-center gap-4 my-6">
      {techIcons.map((tech, index) => (
        <motion.div
          key={tech.name}
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.2, y: -5 }}
        >
          <div className="text-2xl md:text-3xl">{tech.icon}</div>
          <span className="text-xs mt-1 text-gray-400">{tech.name}</span>
        </motion.div>
      ))}
    </div>
  )
}

export default function Footer() {
  const [year] = useState(new Date().getFullYear())
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null)
  const footerRef = useRef(null)
  const isInView = useInView(footerRef, { once: true })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, staggerChildren: 0.1 }
      })
    }
  }, [isInView, controls])

  const socialLinks = [
    { icon: <FaEnvelope size={20} />, href: "mailto:sachinpc202@gmail.com", label: "Email", name: "email" },
    { icon: <FaGithub size={20} />, href: "https://github.com/sachinchhetri202", label: "GitHub", name: "github" },
    { icon: <FaLinkedin size={20} />, href: "https://www.linkedin.com/in/sachin-chhetri-475831199/", label: "LinkedIn", name: "linkedin" },
    { icon: <FaFacebook size={20} />, href: "https://www.facebook.com/sachin.chettri2/", label: "Facebook", name: "facebook" },
    { icon: <FaXTwitter size={20} />, href: "https://x.com/ghost__rider7", label: "Twitter", name: "twitter" }
  ]

  const quickLinks = [
    { text: "Home", href: "/" },
    { text: "Projects", href: "/projects" },
    { text: "About", href: "/about" },
    { text: "Services", href: "/services" },
    { text: "Contact", href: "/contact" }
  ]

  return (
    <footer ref={footerRef} className="relative w-full bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-green-200 pt-16 pb-8 px-4 sm:px-6 shadow-2xl mt-12 overflow-hidden">
      {/* Animated Wave Effect */}
      <TechWave />
      
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* About Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            className="space-y-4 md:col-span-2"
          >
            <h3 className="text-xl font-bold text-green-300 border-b border-green-500/30 pb-2">About This Site</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              This portfolio showcases my journey as a developer, featuring projects and skills I&apos;ve acquired along the way. Built with modern web technologies and a passion for clean code. I specialize in creating efficient, scalable, and user-friendly applications using cutting-edge technologies.
            </p>
            <div className="pt-2 space-y-2">
              <Link 
                href="/contact"
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg text-sm font-medium transition-all duration-300 group"
              >
                <FaEnvelope className="text-green-500" />
                <span>Get in touch</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </motion.div>
          
          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold text-green-300 border-b border-green-500/30 pb-2">Quick Links</h3>
            <nav className="space-y-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-gray-300 hover:text-green-400 transition-colors duration-300 text-sm py-1"
                >
                  {link.text}
                </Link>
              ))}
            </nav>
          </motion.div>
          
          {/* Connect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold text-green-300 border-b border-green-500/30 pb-2">Connect</h3>
            <div className="grid grid-cols-3 gap-3 pt-2">
              {socialLinks.map((social) => (
                <motion.a 
                  key={social.name}
                  href={social.href}
                  className="flex items-center justify-center bg-gray-800 hover:bg-green-600 p-3 rounded-xl text-green-400 hover:text-white transition-all duration-300 shadow-lg"
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  onHoverStart={() => setHoveredIcon(social.name)}
                  onHoverEnd={() => setHoveredIcon(null)}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          transition={{ delay: 0.3 }}
          className="border-t border-green-500/10 pt-8 pb-4"
        >
          <h3 className="text-xl font-bold text-green-300 mb-6 text-center">Tech Stack</h3>
          <TechStack />
        </motion.div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={controls}
          transition={{ delay: 0.4 }}
          className="text-center pt-8 border-t border-green-500/10 text-sm text-gray-400"
        >
          <p className="flex items-center justify-center gap-2">
            <span>© {year} Sachin Chhetri. Built with</span>
            <FaHeart className="text-green-500 animate-pulse" />
            <span>using</span>
            <FaCode className="text-green-400" />
          </p>
        </motion.div>
      </div>
    </footer>
  )
}