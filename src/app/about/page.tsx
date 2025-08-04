// src/app/about/page.tsx
'use client'
import Image from 'next/image'
import { FaBriefcase, FaGraduationCap, FaMusic, FaCode, FaGamepad, FaBinoculars } from 'react-icons/fa'
import { GiWorld } from 'react-icons/gi'
import AnimatedBackground from '@/components/AnimatedBackground'
import { SiPython } from 'react-icons/si'
import { motion } from 'framer-motion'

export default function AboutPage() {
  const work = [
    {
      title: 'Assistant Manager',
      org: 'Lawson Store, Tokyo',
      date: 'Jan 2016 – Dec 2019',
      bullets: [
        'Organized new-hire training, boosting operational efficiency.',
        'Supervised daily operations and optimized scheduling.',
        'Earned top-100 ranking for cleanliness & service.',
      ],
    },
    {
      title: 'Marketing & CRM Specialist',
      org: 'Weber State ISSC Office',
      date: '2021 – 2024',
      bullets: [
        'Led marketing campaigns, increasing student engagement.',
        'Organized events with an 80% participation-rate boost.',
        'Created social-media templates using HTML/CSS/JS, Canva & Adobe.',
        'Utilized SQL for data extraction and analysis.',
      ],
    },
    {
      title: 'Field Trip & Club Travel Assistant',
      org: 'Weber State University, Study Abroad Office',
      date: '2025 – Present',
      bullets: [
        'Assisting the Director of Study Abroad with trip planning and execution.',
        'Coordinating with faculty, department chairs, and Risk Management to ensure university-wide compliance.',
        'Managing documentation by gathering necessary signatures from designated signatories.',
        'Maintaining a comprehensive database of all university field trips.',
      ],
    },
    {
      title: 'Computer Science Tutor',
      org: 'Weber State University, Engineering, Applied Science and Technology',
      date: '2024 – 2025',
      bullets: [
        'Provided one-on-one and group tutoring for students in CS, NET, and WEB courses.',
        'Supported students in foundational and intermediate Computer Science courses (CS 1400, 1410, 2550, 2420).',
        'Emphasized troubleshooting, problem-solving, and practical coding skills.',
      ],
    },
  ]

  const education = [
    {
      school: 'Kanto International Senior High School',
      period: 'Apr 2016 – Mar 2019',
    },
    {
      school: 'Utah Valley University',
      period: 'Jan 2020 – Jul 2020',
      detail: 'General Studies',
    },
    {
      school: 'Weber State University',
      degrees: [
        {
          title: 'B.S. in Computer Science',
          period: '2021 – 2024',
          icon: <FaGraduationCap className="inline text-green-400 mr-1" />,
        },
        {
          title: 'M.S. in Computer Science',
          period: '2025 – Expected 2026',
          icon: <FaGraduationCap className="inline text-green-400 mr-1" />,
        },
      ],
    },
  ]

  return (
    <div className="relative min-h-screen py-16">
      {/* Animated Particle Background */}
      <AnimatedBackground />
      
      {/* Gradient Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-gradient-to-br from-gray-950/90 via-gray-900/90 to-gray-950/90 -z-5"
      />
      <div className="max-w-5xl mx-auto bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden mx-4 sm:mx-auto">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 items-center px-4 sm:px-8 py-8 sm:py-16 gap-8"
        >
          {/* Text */}
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-4 order-2 md:order-1">
            <p className="text-sm text-green-400 uppercase tracking-wide font-mono">About Me</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-green-300 leading-tight">
              Hello, I'm <span className="text-green-400">Sachin Chhetri</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-gray-300">
              AI Engineer with 4+ years of experience building intelligent applications. I specialize in crafting AI-powered solutions using Python and modern frameworks, from real-time music classifiers to Gemini-powered chatbots. Currently pursuing an MS in Computer Science, I combine technical expertise with a passion for turning complex data into practical solutions that drive business value.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-3 py-1 rounded-full bg-green-900/40 text-green-300 font-mono text-xs">Software Developer</span>
              <span className="px-3 py-1 rounded-full bg-green-900/40 text-green-300 font-mono text-xs">Full-Stack Web Developer</span>
              <span className="px-3 py-1 rounded-full bg-green-900/40 text-green-300 font-mono text-xs">AI Engineer</span>
              <span className="px-3 py-1 rounded-full bg-green-900/40 text-green-300 font-mono text-xs">API Designer</span>
              <span className="px-3 py-1 rounded-full bg-green-900/40 text-green-300 font-mono text-xs">Prompt Engineering Expert</span>
              <span className="px-3 py-1 rounded-full bg-green-900/40 text-green-300 font-mono text-xs">Cloud Solutions Architect</span>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="flex justify-center md:justify-end order-1 md:order-2">
            <div className="relative group">
              <Image
                src="https://i.postimg.cc/KjP39B1y/22aa6ca8-f7ad-4cff-8d98-b1b5b39c830b.jpg"
                alt="Sachin Chhetri"
                width={280}
                height={310}
                className="w-64 h-64 sm:w-80 sm:h-80 md:w-[350px] md:h-[390px] rounded-full ring-4 ring-green-400 object-cover shadow-2xl group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-green-500/90 text-gray-900 px-4 py-1 rounded-full text-xs font-bold shadow-lg">Let&apos;s Connect!</span>
            </div>
          </motion.div>
        </motion.section>

        {/* Fun Facts */}
        <motion.section initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="px-4 sm:px-8 pb-10">
          <h2 className="text-xl font-bold text-green-300 mb-4">Fun Facts</h2>
          <div className="flex flex-wrap gap-3">
            <motion.span whileHover={{ scale: 1.1 }} className="bg-green-900/50 text-green-200 px-4 py-2 rounded-full font-mono text-sm flex items-center gap-2"><FaMusic /> Music lover</motion.span>
            <motion.span whileHover={{ scale: 1.1 }} className="bg-green-900/50 text-green-200 px-4 py-2 rounded-full font-mono text-sm flex items-center gap-2"><FaCode /> Coder</motion.span>
            <motion.span whileHover={{ scale: 1.1 }} className="bg-green-900/50 text-green-200 px-4 py-2 rounded-full font-mono text-sm flex items-center gap-2"><GiWorld /> Multilingual: EN, JP, NP</motion.span>
            <motion.span whileHover={{ scale: 1.1 }} className="bg-green-900/50 text-green-200 px-4 py-2 rounded-full font-mono text-sm flex items-center gap-2"><FaGamepad /> Avid gamer</motion.span>
            <motion.span whileHover={{ scale: 1.1 }} className="bg-green-900/50 text-green-200 px-4 py-2 rounded-full font-mono text-sm flex items-center gap-2"><FaBinoculars /> Site seeing</motion.span>
          </div>
        </motion.section>

        {/* Work & Education Timeline */}
        <motion.section initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 sm:px-8 py-10">
          <div>
            <h2 className="text-xl font-bold text-green-300 flex items-center gap-2 mb-4"><FaBriefcase /> Work Experience</h2>
            <ul className="space-y-6">
              {work.map((item, idx) => (
                <motion.li
                  key={item.title}
                  className="bg-gray-800/80 rounded-xl p-5 shadow-md border-l-4 border-green-500 relative group transition-all duration-300 hover:bg-gray-800/95 hover:shadow-xl hover:shadow-green-900/20"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15 }}
                  whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                >
                  <div className="absolute inset-x-0 h-[2px] bottom-0 bg-gradient-to-r from-transparent via-green-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                  <div className="absolute top-0 left-0 w-full h-full bg-green-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl" />
                  <h3 className="text-lg font-bold text-green-200 group-hover:text-green-300 transition-colors">{item.title}</h3>
                  <span className="text-xs text-gray-400 font-mono group-hover:text-gray-300 transition-colors">{item.org} | {item.date}</span>
                  <ul className="list-disc pl-5 text-sm text-gray-300 mt-2 space-y-1">
                    {item.bullets.map((b, i) => (
                      <motion.li 
                        key={i}
                        initial={{ opacity: 0.8 }}
                        whileHover={{ opacity: 1, x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        {b}
                      </motion.li>
                    ))}
                  </ul>
                </motion.li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-bold text-green-300 flex items-center gap-2 mb-4"><FaGraduationCap /> Education</h2>
            <ul className="space-y-6">
              {education.map((item, idx) => (
                <motion.li
                  key={item.school}
                  className="bg-gray-800/80 rounded-xl p-5 shadow-md border-l-4 border-green-500 relative group transition-all duration-300 hover:bg-gray-800/95 hover:shadow-xl hover:shadow-green-900/20"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15 }}
                  whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                >
                  <div className="absolute inset-x-0 h-[2px] bottom-0 bg-gradient-to-r from-transparent via-green-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                  <div className="absolute top-0 left-0 w-full h-full bg-green-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl" />
                  <h3 className="text-lg font-bold text-green-200 group-hover:text-green-300 transition-colors">{item.school}</h3>
                  {item.period && (
                    <span className="text-xs text-gray-400 font-mono group-hover:text-gray-300 transition-colors">{item.period}</span>
                  )}
                  {item.detail && (
                    <div className="text-sm text-gray-300 mt-1 group-hover:text-gray-200 transition-colors">{item.detail}</div>
                  )}
                  {item.degrees && (
                    <ul className="mt-2 space-y-2">
                      {item.degrees.map((deg) => (
                        <motion.li 
                          key={deg.title} 
                          className="flex items-center gap-2 bg-gray-900/70 rounded-lg px-4 py-2 group/degree hover:bg-gray-900/90 transition-all duration-300"
                          whileHover={{ x: 5 }}
                        >
                          <motion.span
                            animate={{ rotate: [0, 15, -15, 0] }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                          >
                            {deg.icon}
                          </motion.span>
                          <span className="font-bold text-green-200 group-hover/degree:text-green-300 transition-colors">{deg.title}</span>
                          <span className="text-xs text-gray-400 font-mono ml-2 group-hover/degree:text-gray-300 transition-colors">{deg.period}</span>
                        </motion.li>
                      ))}
                    </ul>
                  )}
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.section>

        {/* Skills */}
        <section className="border-t border-gray-700 px-4 sm:px-8 py-16">
          <h2 className="flex items-center text-2xl sm:text-3xl font-bold text-green-300 mb-10">
            <motion.span
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <SiPython className="text-green-400 mr-3" />
            </motion.span>
            Skills
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div 
              className="bg-gray-800/80 rounded-xl p-5 shadow-md border-l-4 border-green-500 relative group transition-all duration-300 hover:bg-gray-800/95 hover:shadow-xl hover:shadow-green-900/20"
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
            >
              <div className="absolute inset-x-0 h-[2px] bottom-0 bg-gradient-to-r from-transparent via-green-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              <div className="absolute top-0 left-0 w-full h-full bg-green-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl" />
              <h3 className="text-lg font-bold text-green-200 group-hover:text-green-300 transition-colors">Programming Languages</h3>
              <ul className="list-disc pl-5 text-sm text-gray-300 mt-2 space-y-1">
                {["Python", "C++", "C#", "SQL", "HTML,CSS,JS"].map((skill, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0.8 }}
                    whileHover={{ opacity: 1, x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {skill}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            <motion.div 
              className="bg-gray-800/80 rounded-xl p-5 shadow-md border-l-4 border-green-500 relative group transition-all duration-300 hover:bg-gray-800/95 hover:shadow-xl hover:shadow-green-900/20"
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
            >
              <div className="absolute inset-x-0 h-[2px] bottom-0 bg-gradient-to-r from-transparent via-green-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              <div className="absolute top-0 left-0 w-full h-full bg-green-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl" />
              <h3 className="text-lg font-bold text-green-200 group-hover:text-green-300 transition-colors">Frameworks & Libraries</h3>
              <ul className="list-disc pl-5 text-sm text-gray-300 mt-2 space-y-1">
                {["Django", "React"].map((skill, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0.8 }}
                    whileHover={{ opacity: 1, x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {skill}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            <motion.div 
              className="bg-gray-800/80 rounded-xl p-5 shadow-md border-l-4 border-green-500 relative group transition-all duration-300 hover:bg-gray-800/95 hover:shadow-xl hover:shadow-green-900/20"
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
            >
              <div className="absolute inset-x-0 h-[2px] bottom-0 bg-gradient-to-r from-transparent via-green-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              <div className="absolute top-0 left-0 w-full h-full bg-green-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl" />
              <h3 className="text-lg font-bold text-green-200 group-hover:text-green-300 transition-colors">Databases</h3>
              <ul className="list-disc pl-5 text-sm text-gray-300 mt-2 space-y-1">
                {["MSSQL", "MongoDB"].map((skill, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0.8 }}
                    whileHover={{ opacity: 1, x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {skill}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            <motion.div 
              className="bg-gray-800/80 rounded-xl p-5 shadow-md border-l-4 border-green-500 relative group transition-all duration-300 hover:bg-gray-800/95 hover:shadow-xl hover:shadow-green-900/20"
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
            >
              <div className="absolute inset-x-0 h-[2px] bottom-0 bg-gradient-to-r from-transparent via-green-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              <div className="absolute top-0 left-0 w-full h-full bg-green-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl" />
              <h3 className="text-lg font-bold text-green-200 group-hover:text-green-300 transition-colors">Software & Tools</h3>
              <ul className="list-disc pl-5 text-sm text-gray-300 mt-2 space-y-1">
                {["MS Office365", "GitHub", "Canva", "Adobe", "Figma"].map((skill, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0.8 }}
                    whileHover={{ opacity: 1, x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {skill}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            <motion.div 
              className="bg-gray-800/80 rounded-xl p-5 shadow-md border-l-4 border-green-500 relative group transition-all duration-300 hover:bg-gray-800/95 hover:shadow-xl hover:shadow-green-900/20"
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
            >
              <div className="absolute inset-x-0 h-[2px] bottom-0 bg-gradient-to-r from-transparent via-green-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              <div className="absolute top-0 left-0 w-full h-full bg-green-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl" />
              <h3 className="text-lg font-bold text-green-200 group-hover:text-green-300 transition-colors">Prompt Engineering</h3>
              <ul className="list-disc pl-5 text-sm text-gray-300 mt-2 space-y-1">
                {[
                  "Crafting effective prompts for AI models",
                  "Optimizing AI responses for specific use cases",
                  "Experience with GPT-based models"
                ].map((skill, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0.8 }}
                    whileHover={{ opacity: 1, x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {skill}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  )
}
