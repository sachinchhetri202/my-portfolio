// src/app/about/page.tsx
'use client'
import Image from 'next/image'
import { FaBriefcase, FaGraduationCap, FaMusic, FaCode, FaGamepad, FaBinoculars } from 'react-icons/fa'
import { GiBrain, GiWorld } from 'react-icons/gi'
import AnimatedBackground from '@/components/AnimatedBackground'
import { SiPython, SiJavascript, SiDjango, SiReact, SiDocker, SiPostgresql, SiHtml5, SiCss3, SiTailwindcss } from 'react-icons/si'
import { motion } from 'framer-motion'

export default function AboutPage() {
  const work = [
    {
      title: 'Assistant Manager',
      org: 'Lawson Store, Tokyo',
      date: 'Jan 2016 – Dec 2019',
      bullets: [
        'Organized new-hire training, boosting operational efficiency.',
        'Supervised daily operations and optimized scheduling.',
        'Earned top-100 ranking for cleanliness & service.',
      ],
    },
    {
      title: 'Marketing & CRM Specialist',
      org: 'Weber State ISSC Office',
      date: '2021 – 2024',
      bullets: [
        'Led marketing campaigns, increasing student engagement.',
        'Organized events with an 80% participation-rate boost.',
        'Created social-media templates using HTML/CSS/JS, Canva & Adobe.',
        'Utilized SQL for data extraction and analysis.',
      ],
    },
    {
      title: 'CS Tutor',
      org: 'Weber State University',
      date: 'Oct 2024 – Present',
      bullets: [
        'Assist students with course materials and assignments.',
        'Provide one-on-one tutoring in programming and algorithms.',
        'Help develop study guides and sample problems for exams.',
      ],
    },
  ]

  const education = [
    {
      school: 'Kanto International Senior High School',
      period: 'Apr 2016 – Mar 2019',
    },
    {
      school: 'Utah Valley University',
      period: 'Jan 2020 – Jul 2020',
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
      <div className="max-w-5xl mx-auto bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 items-center px-8 py-16 gap-8"
        >
          {/* Text */}
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
            <p className="text-sm text-green-400 uppercase tracking-wide font-mono">About Me</p>
            <h1 className="text-5xl font-extrabold text-green-300 leading-tight">
              Hello, I’m <span className="text-green-400">Sachin Chhetri</span>
            </h1>
            <p className="mt-4 text-lg text-gray-300">
              I’m a motivated Computer Science major at Weber State University, specializing in
              backend development with Python & Django. With hands-on experience in web development,
              data engineering, and API design.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-3 py-1 rounded-full bg-green-900/40 text-green-300 font-mono text-xs">Full-Stack Web Developer</span>
              <span className="px-3 py-1 rounded-full bg-green-900/40 text-green-300 font-mono text-xs">Software Developer</span>
              <span className="px-3 py-1 rounded-full bg-green-900/40 text-green-300 font-mono text-xs">API Designer</span>
              <span className="px-3 py-1 rounded-full bg-green-900/40 text-green-300 font-mono text-xs">Database Engineer</span>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="flex justify-center md:justify-end">
            <div className="relative group">
              <Image
                src="https://i.postimg.cc/T3n107xp/488623210-9412459178845000-8887513697227636379-n.jpg"
                alt="Sachin Chhetri"
                width={220}
                height={220}
                className="rounded-full ring-4 ring-green-400 object-cover shadow-2xl group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-green-500/90 text-gray-900 px-4 py-1 rounded-full text-xs font-bold shadow-lg">Let's Connect!</span>
            </div>
          </motion.div>
        </motion.section>

        {/* Fun Facts */}
        <motion.section initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="px-8 pb-10">
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
        <motion.section initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="grid grid-cols-1 md:grid-cols-2 gap-8 px-8 py-10">
          <div>
            <h2 className="text-xl font-bold text-green-300 flex items-center gap-2 mb-4"><FaBriefcase /> Work Experience</h2>
            <ul className="space-y-6">
              {work.map((item, idx) => (
                <motion.li
                  key={item.title}
                  className="bg-gray-800/80 rounded-xl p-5 shadow-md border-l-4 border-green-500"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15 }}
                >
                  <h3 className="text-lg font-bold text-green-200">{item.title}</h3>
                  <span className="text-xs text-gray-400 font-mono">{item.org} | {item.date}</span>
                  <ul className="list-disc pl-5 text-sm text-gray-300 mt-2 space-y-1">
                    {item.bullets.map((b, i) => <li key={i}>{b}</li>)}
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
                  className="bg-gray-800/80 rounded-xl p-5 shadow-md border-l-4 border-green-500"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15 }}
                >
                  <h3 className="text-lg font-bold text-green-200">{item.school}</h3>
                  {item.period && (
                    <span className="text-xs text-gray-400 font-mono">{item.period}</span>
                  )}
                  {item.detail && (
                    <div className="text-sm text-gray-300 mt-1">{item.detail}</div>
                  )}
                  {/* Show degrees for Weber State University */}
                  {item.degrees && (
                    <ul className="mt-2 space-y-2">
                      {item.degrees.map((deg, i) => (
                        <li key={deg.title} className="flex items-center gap-2 bg-gray-900/70 rounded-lg px-4 py-2">
                          {deg.icon}
                          <span className="font-bold text-green-200">{deg.title}</span>
                          <span className="text-xs text-gray-400 font-mono ml-2">{deg.period}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.section>

        {/* Skills */}
        <section className="border-t border-gray-700 px-8 py-16">
          <h2 className="flex items-center text-3xl font-bold text-green-300 mb-10">
            <SiPython className="text-green-400 mr-3" /> Skills
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-800/80 rounded-xl p-5 shadow-md border-l-4 border-green-500">
              <h3 className="text-lg font-bold text-green-200">Programming Languages</h3>
              <ul className="list-disc pl-5 text-sm text-gray-300 mt-2 space-y-1">
                <li>Python</li>
                <li>C++</li>
                <li>C#</li>
                <li>SQL</li>
                <li>HTML,CSS,JS</li>
              </ul>
            </div>
            <div className="bg-gray-800/80 rounded-xl p-5 shadow-md border-l-4 border-green-500">
              <h3 className="text-lg font-bold text-green-200">Frameworks & Libraries</h3>
              <ul className="list-disc pl-5 text-sm text-gray-300 mt-2 space-y-1">
                <li>Django</li>
                <li>React</li>
              </ul>
            </div>
            <div className="bg-gray-800/80 rounded-xl p-5 shadow-md border-l-4 border-green-500">
              <h3 className="text-lg font-bold text-green-200">Databases</h3>
              <ul className="list-disc pl-5 text-sm text-gray-300 mt-2 space-y-1">
                <li>MSSQL</li>
                <li>MongoDB</li>
              </ul>
            </div>
            <div className="bg-gray-800/80 rounded-xl p-5 shadow-md border-l-4 border-green-500">
              <h3 className="text-lg font-bold text-green-200">Software & Tools</h3>
              <ul className="list-disc pl-5 text-sm text-gray-300 mt-2 space-y-1">
                <li>MS Office365</li>
                <li>GitHub</li>
                <li>Canva</li>
                <li>Adobe</li>
                <li>Figma</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
