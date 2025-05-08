// src/app/services/page.tsx
'use client'

import {
  FiCode,
  FiDatabase,
  FiServer,
  FiTool,
  FiLayers,
} from 'react-icons/fi'
import { FaUsers, FaLightbulb } from 'react-icons/fa'
import { motion } from 'framer-motion'
import AnimatedBackground from '@/components/AnimatedBackground'

const technicalServices = [
  {
    icon: <FiServer size={28} />,
    title: 'Backend Development',
    items: ['Python & Django', 'REST API design', 'FastAPI'],
  },
  {
    icon: <FiLayers size={28} />,
    title: 'Web Design & Front-End',
    items: ['Next.js/React', 'Tailwind CSS', 'Figma & Adobe XD'],
  },
  {
    icon: <FiCode size={28} />,
    title: 'API Development',
    items: ['Django REST Framework', 'Postman & RESTer testing'],
  },
  {
    icon: <FiDatabase size={28} />,
    title: 'Data Engineering',
    items: ['SQL schema design', 'ETL pipelines'],
  },
  {
    icon: <FiTool size={28} />,
    title: 'DevOps & Deployment',
    items: ['Docker containers', 'CI/CD with GitHub Actions'],
  },
]

const softSkills = [
  { icon: <FaUsers size={24} />, label: 'Mentoring & Training' },
  { icon: <FaLightbulb size={24} />, label: 'Problem Solving' },
  { icon: <FaLightbulb size={24} />, label: 'Creative Thinking' },
  { icon: <FaUsers size={24} />, label: 'Team Collaboration' },
]



export default function ServicesPage() {
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
      <div className="relative z-10 max-w-6xl mx-auto space-y-20">
        {/* Technical Services */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-4xl font-bold mb-8 text-center text-green-300 drop-shadow-lg">What I Do</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {technicalServices.map(({ icon, title, items }, idx) => (
              <motion.div
                key={title}
                className="group bg-gray-900/80 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-green-900/30 hover:border-green-400 hover:shadow-green-900/20 transition-all duration-300 flex flex-col items-start"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 + 0.2 }}
                whileHover={{ scale: 1.04 }}
              >
                <div className="text-green-400 mb-4 group-hover:text-green-300 text-4xl transition-colors duration-300 animate-pulse">
                  {icon}
                </div>
                <h3 className="text-2xl font-semibold mb-2 group-hover:text-white transition-colors duration-300">
                  {title}
                </h3>
                <ul className="list-disc pl-5 text-green-200/90 text-sm space-y-1 mt-2">
                  {items.map((item, i) => (
                    <motion.li key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Soft Skills */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-20"
        >
          <h2 className="text-3xl font-bold mb-8 text-center text-green-200 drop-shadow">Soft Skills</h2>
          <div className="flex flex-wrap justify-center gap-6">
            {softSkills.map(({ icon, label }, idx) => (
              <motion.div
                key={label}
                className="flex items-center gap-3 bg-gray-900/80 backdrop-blur-md rounded-full px-6 py-3 shadow-lg border border-green-900/30 hover:border-green-400 hover:shadow-green-900/20 transition-all duration-300 text-green-100 text-lg font-medium"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 + 0.2 }}
                whileHover={{ scale: 1.06, backgroundColor: "#166534" }}
              >
                <span className="text-green-400 text-2xl">{icon}</span>
                {label}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
