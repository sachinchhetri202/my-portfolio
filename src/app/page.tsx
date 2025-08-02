'use client'
// src/app/page.tsx
import Image from 'next/image'
import Link from 'next/link'
import { SiPython, SiCloudflare, SiGit, SiReact, SiNextdotjs, SiTailwindcss, SiJavascript, SiTypescript, SiMongodb, SiVercel } from 'react-icons/si'
import { FiArrowRight, FiDownload, FiGithub, FiLinkedin, FiMail, FiExternalLink } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import AnimatedBackground from '../components/AnimatedBackground'
import { PersonSchema, WebsiteSchema } from '../components/SchemaMarkup'
import { useResumeDownload } from '../components/Analytics'

// Client-side only clock component
function Clock() {
  const [currentTime, setCurrentTime] = useState('--:--:--')
  
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString())
    }
    
    updateTime() // Set initial time
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])
  
  return <span className="text-green-300/60"># {currentTime}</span>
}

export default function HomePage() {
  const trackResumeDownload = useResumeDownload()

  const techStack = [
    { icon: <SiPython />, name: 'Python', category: 'Language' },
    { icon: <SiReact />, name: 'React', category: 'Frontend' },
    { icon: <SiNextdotjs />, name: 'Next.js', category: 'Frontend' },
    { icon: <SiJavascript />, name: 'JavaScript', category: 'Language' },
    { icon: <SiTypescript />, name: 'TypeScript', category: 'Language' },
    { icon: <SiMongodb />, name: 'MongoDB', category: 'Database' },
    { icon: <SiTailwindcss />, name: 'Tailwind CSS', category: 'Styling' },
    { icon: <SiGit />, name: 'Git', category: 'Version Control' },
    { icon: <SiVercel />, name: 'Vercel', category: 'Deployment' },
    { icon: <SiCloudflare />, name: 'Cloudflare', category: 'CDN' },
  ]

  const stats = [
    { number: '4+', label: 'Years Experience' },
    { number: '3+', label: 'Languages' },
    { number: 'MS', label: 'Computer Science' },
    { number: 'AI', label: 'Specialist' },
  ]

  const socialLinks = [
    { href: 'https://github.com/sachinchhetri202', icon: <FiGithub />, label: 'GitHub' },
    { href: 'https://www.linkedin.com/in/sachin-chhetri-475831199/', icon: <FiLinkedin />, label: 'LinkedIn' },
    { href: '/contact', icon: <FiMail />, label: 'Contact' },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }

  return (
    <>
      <PersonSchema />
      <WebsiteSchema />
      <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950">
        <AnimatedBackground />
        
        {/* Hero Section */}
        <section className="relative flex items-center justify-center min-h-screen pt-24 sm:pt-12 pb-8 sm:py-12 px-4 sm:px-6 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-transparent to-green-500/10"
          />
          
          <div className="relative z-10 flex flex-col items-center space-y-6 sm:space-y-8 text-center max-w-6xl mx-auto">
            {/* Profile with enhanced styling */}
            <motion.div 
              className="relative w-32 h-32 sm:w-48 sm:h-48 rounded-full ring-4 ring-green-500 overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Image
                src="https://i.postimg.cc/0jbHD5jm/05ae2658-aec3-4526-9e97-1bfe5f5b60f8.jpg"
                alt="Sachin Chhetri"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>

            {/* Terminal command with time */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-mono text-green-400 text-sm sm:text-base flex items-center space-x-4"
            >
              <span>$ python manage.py runserver</span>
              <Clock />
            </motion.div>

            {/* Enhanced Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white"
            >
              <span className="bg-gradient-to-r from-green-300 via-green-400 to-green-200 bg-clip-text text-transparent">
                AI Engineer
              </span>
              <br />
              <span className="bg-gradient-to-r from-green-200 via-green-300 to-green-400 bg-clip-text text-transparent">
                & Software Developer
              </span>
            </motion.h1>

            {/* Enhanced subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg sm:text-xl text-gray-300 max-w-3xl leading-relaxed"
            >
              Building intelligent applications with Python and modern frameworks. 
              Currently pursuing MS in Computer Science, specializing in AI-powered solutions.
            </motion.p>

            {/* Enhanced Icons row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-wrap justify-center gap-6 text-3xl sm:text-4xl text-green-400"
            >
              {techStack.slice(0, 5).map((tech, index) => (
                <motion.div
                  key={tech.name}
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="group relative"
                >
                  {tech.icon}
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-green-300 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                    {tech.name}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Enhanced Code snippet */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="relative w-full max-w-2xl mx-4 group"
            >
              <pre className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 font-mono text-left w-full whitespace-pre-wrap break-words shadow-xl overflow-x-auto border border-green-500/20 hover:border-green-400/40 transition-colors duration-300">
                <code className="block text-xs sm:text-sm md:text-base text-green-200">
                  {`class AIEngineer:
    def __init__(self):
        self.name = "Sachin Chhetri"
        self.role = "AI Engineer & Software Developer"
        self.skills = ["Python", "React", "Next.js", "MongoDB"]
        self.education = "MS Computer Science"
        self.passion = "Building AI-powered solutions"
    
    def introduce(self):
        return f"Hello, I'm {self.name}, {self.role}"
    
    def get_skills(self):
        return self.skills`}
                </code>
              </pre>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </motion.div>

            {/* Enhanced Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
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
                  <span className="font-medium bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">View Projects</span>
                  <FiArrowRight className="text-green-400 group-hover:translate-x-1 transition-transform duration-200" />
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
                  <FiDownload className="text-green-400" />
                  <span className="font-medium bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">Download CV</span>
                </div>
                <div className="absolute inset-x-0 h-[2px] bottom-0 bg-gradient-to-r from-transparent via-green-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </a>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="flex space-x-6"
            >
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith('http') ? '_blank' : undefined}
                  rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="text-green-400 hover:text-white transition-colors duration-300 p-2 rounded-lg hover:bg-green-500/10"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="relative py-16 px-4 sm:px-6 md:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="max-w-6xl mx-auto"
          >
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  variants={itemVariants}
                  className="text-center group"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* Tech Stack Section */}
        <section className="relative py-16 px-4 sm:px-6 md:px-8 bg-gray-900/50">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="max-w-6xl mx-auto"
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent"
            >
              Skills & Technologies
            </motion.h2>
            
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6"
            >
              {techStack.map((tech, index) => (
                <motion.div
                  key={tech.name}
                  variants={itemVariants}
                  className="group relative p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800/80 transition-all duration-300 border border-transparent hover:border-green-500/30"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="text-3xl text-green-400 mb-3 group-hover:scale-110 transition-transform duration-300">
                    {tech.icon}
                  </div>
                  <div className="text-sm font-medium text-white">{tech.name}</div>
                  <div className="text-xs text-green-300/60">{tech.category}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="relative py-16 px-4 sm:px-6 md:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent"
            >
              Let's Build Something Together
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto"
            >
              Whether you need a web application, AI integration, or software solution, 
              I'm here to help bring your ideas to life with modern technologies.
            </motion.p>
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/contact"
                className="group relative flex items-center justify-center rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium px-8 py-3 transition-all duration-300 hover:scale-105"
              >
                <span>Get In Touch</span>
                <FiExternalLink className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <Link
                href="/services"
                className="group relative flex items-center justify-center rounded-xl bg-gray-800 hover:bg-gray-700 text-green-400 font-medium px-8 py-3 border border-green-500/30 hover:border-green-400 transition-all duration-300 hover:scale-105"
              >
                <span>View Services</span>
                <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </motion.div>
          </motion.div>
        </section>
      </div>
    </>
  )
}
