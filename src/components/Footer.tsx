// src/components/Footer.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useAnimation, useInView } from 'framer-motion'
import { FaGithub, FaLinkedin, FaEnvelope, FaCode, FaHeart, FaArrowRight, FaExternalLinkAlt } from 'react-icons/fa'
import { FaFacebook, FaXTwitter } from 'react-icons/fa6'
import { SiPython, SiReact, SiNextdotjs, SiTailwindcss, SiTypescript, SiJavascript, SiCplusplus, SiDjango, SiDocker, SiGit, SiMongodb, SiVercel, SiCloudflare } from 'react-icons/si'
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
    { icon: <SiReact className="text-blue-400" />, name: 'React', category: 'Frontend' },
    { icon: <SiNextdotjs className="text-white" />, name: 'Next.js', category: 'Framework' },
    { icon: <SiTailwindcss className="text-cyan-400" />, name: 'Tailwind', category: 'Styling' },
    { icon: <SiTypescript className="text-blue-500" />, name: 'TypeScript', category: 'Language' },
    { icon: <SiJavascript className="text-yellow-400" />, name: 'JavaScript', category: 'Language' },
    { icon: <SiPython className="text-yellow-300" />, name: 'Python', category: 'Language' },
    { icon: <SiMongodb className="text-green-400" />, name: 'MongoDB', category: 'Database' },
    { icon: <SiVercel className="text-white" />, name: 'Vercel', category: 'Deployment' },
    { icon: <SiCloudflare className="text-orange-400" />, name: 'Cloudflare', category: 'CDN' },
    { icon: <SiGit className="text-orange-500" />, name: 'Git', category: 'Version Control' },
  ]
  
  return (
    <div className="flex flex-wrap justify-center gap-6 my-8">
      {techIcons.map((tech, index) => (
        <motion.div
          key={tech.name}
          className="group relative flex flex-col items-center p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-all duration-300 border border-transparent hover:border-green-500/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05, y: -2 }}
        >
          <div className="text-2xl md:text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">{tech.icon}</div>
          <span className="text-xs font-medium text-gray-300">{tech.name}</span>
          <span className="text-xs text-green-400/60">{tech.category}</span>
        </motion.div>
      ))}
    </div>
  )
}

const NewsletterSignup = () => {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate newsletter signup
    setIsSubscribed(true)
    setEmail('')
    setTimeout(() => setIsSubscribed(false), 3000)
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-gray-800/50 rounded-xl p-6 border border-green-500/20"
    >
      <h4 className="text-lg font-semibold text-green-300 mb-3">Stay Updated</h4>
      <p className="text-sm text-gray-300 mb-4">Get notified about new projects and tech insights.</p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors duration-300"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-300 flex items-center gap-2"
        >
          <FaArrowRight className="text-sm" />
        </button>
      </form>
      {isSubscribed && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-green-400 text-sm mt-2"
        >
          Thanks for subscribing! 🎉
        </motion.p>
      )}
    </motion.div>
  )
}

export default function Footer() {
  const [year] = useState(new Date().getFullYear())
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null)
  const footerRef = useRef(null)
  const isInView = useInView(footerRef, { once: true, amount: 0.3 })
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
    { icon: <FaEnvelope size={18} />, href: "mailto:sachinpc202@gmail.com", label: "Email", name: "email" },
    { icon: <FaGithub size={18} />, href: "https://github.com/sachinchhetri202", label: "GitHub", name: "github" },
    { icon: <FaLinkedin size={18} />, href: "https://www.linkedin.com/in/sachin-chhetri-475831199/", label: "LinkedIn", name: "linkedin" },
    { icon: <FaFacebook size={18} />, href: "https://www.facebook.com/sachin.chettri2/", label: "Facebook", name: "facebook" },
    { icon: <FaXTwitter size={18} />, href: "https://x.com/ghost__rider7", label: "Twitter", name: "twitter" }
  ]

  const quickLinks = [
    { text: "Home", href: "/", description: "Main page" },
    { text: "Projects", href: "/projects", description: "Portfolio showcase" },
    { text: "About", href: "/about", description: "My background" },
    { text: "Services", href: "/services", description: "What I offer" },
    { text: "Contact", href: "/contact", description: "Get in touch" }
  ]

  const services = [
    { text: "Web Development", description: "Full-stack applications" },
    { text: "AI Integration", description: "Smart solutions" },
    { text: "API Design", description: "RESTful services" },
    { text: "Database Design", description: "Data architecture" }
  ]

  return (
    <footer ref={footerRef} className="relative w-full bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-green-200 pt-20 pb-8 px-4 sm:px-6 shadow-2xl mt-16 overflow-hidden">
      {/* Animated Wave Effect */}
      <TechWave />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-green-500/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          {/* About Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            className="space-y-6 lg:col-span-2"
          >
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-green-300 border-b border-green-500/30 pb-2 flex items-center gap-2">
                <FaCode className="text-green-400" />
                About This Site
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                This portfolio showcases my journey as an AI Engineer and Software Developer, featuring projects and skills I&apos;ve acquired along the way. Built with modern web technologies and a passion for clean code. I specialize in creating efficient, scalable, and user-friendly applications using cutting-edge technologies.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link 
                  href="/contact"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-all duration-300 group shadow-lg"
                >
                  <FaEnvelope className="text-sm" />
                  <span>Get in touch</span>
                  <FaArrowRight className="text-sm transition-transform group-hover:translate-x-1" />
                </Link>
                <Link 
                  href="/resume/Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-green-400 rounded-lg text-sm font-medium transition-all duration-300 group border border-green-500/30"
                >
                  <FaExternalLinkAlt className="text-sm" />
                  <span>Download CV</span>
                </Link>
              </div>
            </div>
            
            {/* Newsletter Signup */}
            <NewsletterSignup />
          </motion.div>
          
          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-bold text-green-300 border-b border-green-500/30 pb-2">Quick Links</h3>
            <nav className="space-y-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center justify-between text-gray-300 hover:text-green-400 transition-colors duration-300 text-sm py-2 px-3 rounded-lg hover:bg-gray-800/30"
                >
                  <div>
                    <div className="font-medium">{link.text}</div>
                    <div className="text-xs text-gray-500">{link.description}</div>
                  </div>
                  <FaArrowRight className="text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              ))}
            </nav>
          </motion.div>
          
          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-bold text-green-300 border-b border-green-500/30 pb-2">Services</h3>
            <div className="space-y-3">
              {services.map((service, index) => (
                <motion.div
                  key={service.text}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-all duration-300 border border-transparent hover:border-green-500/30"
                >
                  <div className="font-medium text-green-300 text-sm">{service.text}</div>
                  <div className="text-xs text-gray-400">{service.description}</div>
                </motion.div>
              ))}
            </div>
            
            {/* Connect */}
            <div className="space-y-4 pt-4">
              <h4 className="text-lg font-semibold text-green-300">Connect</h4>
              <div className="grid grid-cols-3 gap-3">
                {socialLinks.map((social) => (
                  <motion.a 
                    key={social.name}
                    href={social.href}
                    className="flex items-center justify-center bg-gray-800 hover:bg-green-600 p-3 rounded-xl text-green-400 hover:text-white transition-all duration-300 shadow-lg border border-transparent hover:border-green-500/30"
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
            </div>
          </motion.div>
        </div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          transition={{ delay: 0.3 }}
          className="border-t border-green-500/20 pt-8 pb-6"
        >
          <h3 className="text-xl font-bold text-green-300 mb-6 text-center">Technologies I Work With</h3>
          <TechStack />
        </motion.div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={controls}
          transition={{ delay: 0.4 }}
          className="text-center pt-8 border-t border-green-500/20 text-sm text-gray-400"
        >
          <p className="flex items-center justify-center gap-2 mb-2">
            <span>© {year} Sachin Chhetri. Built with</span>
            <FaHeart className="text-green-500 animate-pulse" />
            <span>using modern web technologies</span>
          </p>
          <p className="text-xs text-gray-500">
            AI Engineer & Software Developer | MS Computer Science Student
          </p>
        </motion.div>
      </div>
    </footer>
  )
}