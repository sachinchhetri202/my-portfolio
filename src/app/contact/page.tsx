// src/app/contact/page.tsx
'use client'

import { FaFacebookF, FaLinkedinIn, FaGithub, FaEnvelope, FaMapMarkerAlt, FaPhone } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { useState } from 'react'
import AnimatedBackground from '@/components/AnimatedBackground'

export default function ContactPage() {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: form.method,
        body: formData,
        headers: {
          Accept: 'application/json'
        }
      });
      
      if (response.ok) {
        setFormStatus('success');
        form.reset();
      } else {
        setFormStatus('error');
      }
    } catch (error) {
      setFormStatus('error');
    }
  };
  
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
      
      <div className="relative z-10 max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <motion.header 
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-green-300 drop-shadow-lg">Let's Connect</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Get in touch if you want to collaborate on a project or need my expertise in software development, marketing, or community management.
          </p>
        </motion.header>

        {/* Contact Sections - Vertical Layout */}
        <div className="flex flex-col gap-8">
          {/* Contact Info */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-green-900/30 hover:border-green-400 hover:shadow-green-900/20 transition-all duration-300 space-y-6">
              <h3 className="text-2xl font-bold text-green-300">Contact Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-green-500/20 p-3 rounded-full">
                    <FaEnvelope className="text-green-400 text-xl" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <a href="mailto:sachinpc202@gmail.com" className="text-green-200 hover:text-white transition-colors">sachinpc202@gmail.com</a>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="bg-green-500/20 p-3 rounded-full">
                    <FaMapMarkerAlt className="text-green-400 text-xl" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Location</p>
                    <p className="text-green-200">Ogden, Utah</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="bg-green-500/20 p-3 rounded-full">
                    <FaPhone className="text-green-400 text-xl" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Phone</p>
                    <p className="text-green-200">Available on request</p>
                  </div>
                </div>
              </div>
              
              {/* Social Links */}
              <div className="pt-4 border-t border-gray-700">
                <h4 className="text-lg font-medium text-green-300 mb-4">Connect with me</h4>
                <div className="flex space-x-4">
                  <motion.a
                    href="https://www.facebook.com/sachin.chettri2"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-800 p-3 rounded-full text-green-400 hover:text-white hover:bg-green-600 transition-all duration-300"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <FaFacebookF />
                  </motion.a>
                  <motion.a
                    href="https://www.linkedin.com/in/sachin-chhetri-475831199/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-800 p-3 rounded-full text-green-400 hover:text-white hover:bg-green-600 transition-all duration-300"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <FaLinkedinIn />
                  </motion.a>
                  <motion.a
                    href="https://github.com/sachinchhetri202"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-800 p-3 rounded-full text-green-400 hover:text-white hover:bg-green-600 transition-all duration-300"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <FaGithub />
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Form */}
          <motion.div
            className=""
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-green-900/30 hover:border-green-400 hover:shadow-green-900/20 transition-all duration-300">
              <h3 className="text-2xl font-bold text-green-300 mb-6">Send Me a Message</h3>
              
              <form
                action="https://formspree.io/f/mjkborvb"
                method="POST"
                className="grid grid-cols-1 gap-6"
                onSubmit={handleSubmit}
              >
                {/* Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col">
                    <label htmlFor="name" className="mb-2 text-green-300 font-medium">Name</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Your full name"
                      className="bg-gray-800/80 border border-gray-700 text-green-200 placeholder-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="email" className="mb-2 text-green-300 font-medium">Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="you@domain.com"
                      className="bg-gray-800/80 border border-gray-700 text-green-200 placeholder-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div className="flex flex-col">
                  <label htmlFor="subject" className="mb-2 text-green-300 font-medium">Subject</label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="Brief subject"
                    className="bg-gray-800/80 border border-gray-700 text-green-200 placeholder-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                {/* Message */}
                <div className="flex flex-col">
                  <label htmlFor="message" className="mb-2 text-green-300 font-medium">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    placeholder="Your message..."
                    className="bg-gray-800/80 border border-gray-700 text-green-200 placeholder-gray-500 rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-2">
                  <motion.button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-gray-900 font-semibold rounded-lg py-3 transition-all duration-300 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={formStatus === 'submitting'}
                  >
                    {formStatus === 'submitting' ? (
                      <>
                        <span className="animate-spin h-4 w-4 border-2 border-gray-900 rounded-full border-t-transparent"></span>
                        <span>Sending...</span>
                      </>
                    ) : formStatus === 'success' ? (
                      'Message Sent! ✓'
                    ) : (
                      'Send Message'
                    )}
                  </motion.button>
                  <motion.button
                    type="reset"
                    className="flex-1 border-2 border-green-500 hover:bg-gray-800 text-green-300 hover:text-white font-semibold rounded-lg py-3 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFormStatus('idle')}
                    disabled={formStatus === 'submitting'}
                  >
                    Clear Form
                  </motion.button>
                </div>
                
                {formStatus === 'error' && (
                  <motion.div 
                    className="bg-red-900/30 border border-red-500 text-red-200 p-3 rounded-lg text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    Something went wrong. Please try again or contact me directly.
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
