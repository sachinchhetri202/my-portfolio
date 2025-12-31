'use client'
// src/app/page.tsx
import Image from 'next/image'
import Link from 'next/link'
import { SiPython, SiCloudflare, SiGit, SiReact, SiNextdotjs, SiTailwindcss, SiJavascript, SiTypescript, SiMongodb, SiVercel } from 'react-icons/si'
import { FiArrowRight, FiDownload, FiGithub, FiLinkedin, FiMail, FiExternalLink } from 'react-icons/fi'
import { motion } from 'framer-motion'
import AnimatedBackground from '../components/AnimatedBackground'
import { PersonSchema, WebsiteSchema } from '../components/SchemaMarkup'
import { useResumeDownload } from '../components/Analytics'

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
      <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <AnimatedBackground />
        
        {/* Hero Section */}
        <section className="relative flex items-center justify-center min-h-screen pt-24 sm:pt-12 pb-8 sm:py-12 px-4 sm:px-6 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/5 to-blue-600/10"
          />
          
          <div className="relative z-10 flex flex-col items-center space-y-6 sm:space-y-8 text-center max-w-6xl mx-auto">
            {/* Profile with enhanced styling */}
            <motion.div 
              className="relative w-32 h-32 sm:w-48 sm:h-48 rounded-full ring-4 ring-blue-500/50 overflow-hidden group shadow-2xl shadow-blue-500/20"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Image
                src="https://i.postimg.cc/0jbHD5jm/05ae2658-aec3-4526-9e97-1bfe5f5b60f8.jpg"
                alt="Sachin Chhetri"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 via-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>

            {/* Professional tagline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 backdrop-blur-sm"
            >
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm text-blue-300 font-medium">Building Intelligent Solutions</span>
            </motion.div>

            {/* Enhanced Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
            >
              <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-purple-400 bg-clip-text text-transparent animate-gradient">
                AI Engineer
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-blue-300 bg-clip-text text-transparent">
                & Software Developer
              </span>
            </motion.h1>

            {/* Enhanced subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg sm:text-xl text-slate-300 max-w-3xl leading-relaxed"
            >
              Building intelligent applications with Python and modern frameworks. 
              Currently pursuing MS in Computer Science, specializing in AI-powered solutions.
            </motion.p>

            {/* Enhanced Icons row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-wrap justify-center gap-6 text-3xl sm:text-4xl"
            >
              {techStack.slice(0, 5).map((tech, index) => (
                <motion.div
                  key={tech.name}
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="group relative text-blue-400 hover:text-purple-400 transition-colors duration-300"
                >
                  {tech.icon}
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-slate-800/95 backdrop-blur-sm text-blue-300 text-xs px-2 py-1 rounded border border-blue-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10 shadow-lg">
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
              <pre className="bg-slate-900/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 font-mono text-left w-full whitespace-pre-wrap break-words shadow-2xl overflow-x-auto border border-blue-500/20 hover:border-purple-500/40 transition-all duration-300">
                <code className="block text-xs sm:text-sm md:text-base">
                  <span className="text-blue-400">class</span> <span className="text-purple-400">AIEngineer</span><span className="text-slate-400">:</span>
                  <br />
                  <span className="text-blue-400 ml-4">def</span> <span className="text-yellow-300">__init__</span><span className="text-slate-400">(</span><span className="text-blue-300">self</span><span className="text-slate-400">):</span>
                  <br />
                  <span className="text-blue-300 ml-8">self</span><span className="text-slate-400">.</span><span className="text-purple-300">name</span> <span className="text-slate-400">=</span> <span className="text-green-400">"Sachin Chhetri"</span>
                  <br />
                  <span className="text-blue-300 ml-8">self</span><span className="text-slate-400">.</span><span className="text-purple-300">role</span> <span className="text-slate-400">=</span> <span className="text-green-400">"AI Engineer & Software Developer"</span>
                  <br />
                  <span className="text-blue-300 ml-8">self</span><span className="text-slate-400">.</span><span className="text-purple-300">skills</span> <span className="text-slate-400">=</span> <span className="text-slate-300">[</span><span className="text-green-400">"Python"</span><span className="text-slate-400">,</span> <span className="text-green-400">"React"</span><span className="text-slate-400">,</span> <span className="text-green-400">"Next.js"</span><span className="text-slate-400">,</span> <span className="text-green-400">"MongoDB"</span><span className="text-slate-300">]</span>
                  <br />
                  <span className="text-blue-300 ml-8">self</span><span className="text-slate-400">.</span><span className="text-purple-300">education</span> <span className="text-slate-400">=</span> <span className="text-green-400">"MS Computer Science"</span>
                  <br />
                  <span className="text-blue-300 ml-8">self</span><span className="text-slate-400">.</span><span className="text-purple-300">passion</span> <span className="text-slate-400">=</span> <span className="text-green-400">"Building AI-powered solutions"</span>
                </code>
              </pre>
              <div className="absolute top-3 right-3 flex space-x-1.5">
                <div className="w-2.5 h-2.5 bg-red-500/80 rounded-full"></div>
                <div className="w-2.5 h-2.5 bg-yellow-500/80 rounded-full"></div>
                <div className="w-2.5 h-2.5 bg-green-500/80 rounded-full"></div>
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
                className="group relative flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium px-8 py-3.5 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_2rem_-0.5rem_rgba(59,130,246,0.5)] w-full sm:w-auto"
                role="button"
                aria-label="View Projects"
              >
                <div className="relative flex w-full items-center justify-center space-x-3">
                  <span>&lt;/&gt;</span>
                  <span>View Projects</span>
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </Link>

              <Link
                href="/about"
                className="group relative flex items-center justify-center rounded-xl bg-slate-800/50 border-2 border-blue-500/30 hover:border-purple-500/50 backdrop-blur-sm text-slate-100 font-medium px-8 py-3.5 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_2rem_-0.5rem_rgba(168,85,247,0.3)] w-full sm:w-auto"
                role="button"
                aria-label="About Me"
              >
                <span>About Me</span>
              </Link>

              <a
                href="/resume/Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackResumeDownload('homepage_hero')}
                className="group relative flex items-center justify-center rounded-xl bg-slate-800/50 border-2 border-blue-500/30 hover:border-purple-500/50 backdrop-blur-sm text-slate-100 font-medium px-8 py-3.5 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_2rem_-0.5rem_rgba(168,85,247,0.3)] w-full sm:w-auto"
                role="button"
                aria-label="Download CV"
              >
                <div className="relative flex w-full items-center justify-center space-x-3">
                  <FiDownload className="text-blue-400" />
                  <span>Download CV</span>
                </div>
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
                  className="text-blue-400 hover:text-purple-400 transition-colors duration-300 p-3 rounded-lg hover:bg-blue-500/10 border border-blue-500/20 hover:border-purple-500/40"
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
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-slate-400 text-sm font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* Tech Stack Section */}
        <section className="relative py-16 px-4 sm:px-6 md:px-8 bg-slate-900/30 backdrop-blur-sm">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="max-w-6xl mx-auto"
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent"
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
                  className="group relative p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800/80 transition-all duration-300 border border-slate-700/50 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="text-3xl text-blue-400 mb-3 group-hover:text-purple-400 group-hover:scale-110 transition-all duration-300">
                    {tech.icon}
                  </div>
                  <div className="text-sm font-medium text-white">{tech.name}</div>
                  <div className="text-xs text-blue-300/60">{tech.category}</div>
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
              className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent"
            >
              Let's Build Something Together
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto"
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
                className="group relative flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium px-8 py-3 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50"
              >
                <span>Get In Touch</span>
                <FiExternalLink className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <Link
                href="/services"
                className="group relative flex items-center justify-center rounded-xl bg-slate-800/50 hover:bg-slate-800/70 text-blue-400 font-medium px-8 py-3 border border-blue-500/30 hover:border-purple-500/50 backdrop-blur-sm transition-all duration-300 hover:scale-105"
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
