// src/app/contact/page.tsx
'use client'

import { FaFacebookF, FaLinkedinIn, FaGithub, FaEnvelope, FaMapMarkerAlt, FaPhone, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import AnimatedBackground from '@/components/AnimatedBackground'
import { useAnalytics } from '@/components/Analytics'

const socialLinks = [
  { icon: <FaFacebookF />, href: "https://www.facebook.com/sachin.chettri2", label: "Facebook" },
  { icon: <FaLinkedinIn />, href: "https://www.linkedin.com/in/sachin-chhetri-475831199/", label: "LinkedIn" },
  { icon: <FaGithub />, href: "https://github.com/sachinchhetri202", label: "GitHub" }
]

const contactInfo = [
  { 
    icon: <FaEnvelope className="text-green-400 text-xl" />, 
    label: "Email",
    value: "sachinpc202@gmail.com",
    link: "mailto:sachinpc202@gmail.com",
    description: "Feel free to email me anytime"
  },
  { 
    icon: <FaMapMarkerAlt className="text-green-400 text-xl" />, 
    label: "Location",
    value: "Ogden, UT",
    description: "Currently based in"
  },
  { 
    icon: <FaPhone className="text-green-400 text-xl" />, 
    label: "Phone",
    value: "Available on request",
    description: "For direct communication"
  }
]

export default function ContactPage() {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const { trackEvent } = useAnalytics();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  
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
        trackEvent('Contact Form Submitted', { 
          form: 'main_contact_form'
        });
        form.reset();
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setFormStatus('idle'), 5000);
      } else {
        setFormStatus('error');
        setTimeout(() => setFormStatus('idle'), 5000);
      }
    } catch (_error) {
      setFormStatus('error');
      setTimeout(() => setFormStatus('idle'), 5000);
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
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-300 drop-shadow-lg">Let&apos;s Connect</h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-sm sm:text-base">
            I&apos;m always interested in hearing about new projects and opportunities. Whether you have a question or just want to say hi, I&apos;ll try my best to get back to you!
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
              
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.div 
                    key={info.label}
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="bg-green-500/20 p-3 rounded-full">
                      {info.icon}
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">{info.label}</p>
                      {info.link ? (
                        <a 
                          href={info.link} 
                          className="text-green-200 hover:text-white transition-colors block"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-green-200">{info.value}</p>
                      )}
                      <p className="text-gray-500 text-xs mt-1">{info.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Social Links */}
              <div className="pt-6 border-t border-gray-700">
                <h4 className="text-lg font-medium text-green-300 mb-4">Connect with me</h4>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-800 p-3 rounded-full text-green-400 hover:text-white hover:bg-green-600 transition-all duration-300"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {social.icon}
                    </motion.a>
                  ))}
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
                      value={formData.name}
                      onChange={handleChange}
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
                      value={formData.email}
                      onChange={handleChange}
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
                    required
                    value={formData.subject}
                    onChange={handleChange}
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
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Your message here..."
                    className="bg-gray-800/80 border border-gray-700 text-green-200 placeholder-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 resize-none"
                  />
                </div>

                <div className="relative">
                  <button
                    type="submit"
                    disabled={formStatus === 'submitting'}
                    className={`w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                      formStatus === 'submitting' ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                  >
                    {formStatus === 'submitting' ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </button>

                  <AnimatePresence>
                    {(formStatus === 'success' || formStatus === 'error') && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`absolute -bottom-12 left-0 right-0 text-center text-sm font-medium ${
                          formStatus === 'success' ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {formStatus === 'success' ? (
                          <span className="flex items-center justify-center gap-2">
                            <FaCheckCircle />
                            Message sent successfully!
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            <FaExclamationCircle />
                            Something went wrong. Please try again.
                          </span>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
