'use client'

import { useRef, useEffect, FC } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
  opacity: number
}

const AnimatedBackground: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Particle colors with futuristic neon palette
    const colors = [
      'rgba(59, 130, 246, 0.8)',   // blue-500
      'rgba(168, 85, 247, 0.8)',   // purple-500
      'rgba(236, 72, 153, 0.8)',   // pink-500
      'rgba(0, 240, 255, 0.8)',    // cyan
      'rgba(139, 92, 246, 0.8)',   // violet
    ]

    const isMobile = window.innerWidth < 768
    const particleCount = isMobile ? 30 : 60
    const connectionDistance = isMobile ? 120 : 150
    const maxParticleRadius = 3
    const minParticleRadius = 1.5

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = []
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * (maxParticleRadius - minParticleRadius) + minParticleRadius,
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: Math.random() * 0.5 + 0.5,
        })
      }
    }

    initParticles()

    // Mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
      }
    }

    window.addEventListener('mousemove', handleMouseMove)

    // Draw particle with glow effect
    const drawParticle = (particle: Particle) => {
      // Outer glow
      const gradient = ctx.createRadialGradient(
        particle.x,
        particle.y,
        0,
        particle.x,
        particle.y,
        particle.radius * 4
      )
      gradient.addColorStop(0, particle.color.replace('0.8', '0.6'))
      gradient.addColorStop(0.5, particle.color.replace('0.8', '0.3'))
      gradient.addColorStop(1, particle.color.replace('0.8', '0'))

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.radius * 4, 0, Math.PI * 2)
      ctx.fill()

      // Core particle
      ctx.fillStyle = particle.color
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
      ctx.fill()
    }

    // Draw connection line between particles
    const drawConnection = (p1: Particle, p2: Particle, distance: number) => {
      const opacity = (1 - distance / connectionDistance) * 0.3
      
      // Create gradient line
      const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y)
      gradient.addColorStop(0, `rgba(59, 130, 246, ${opacity})`)
      gradient.addColorStop(0.5, `rgba(168, 85, 247, ${opacity * 1.5})`)
      gradient.addColorStop(1, `rgba(59, 130, 246, ${opacity})`)

      ctx.strokeStyle = gradient
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(p1.x, p1.y)
      ctx.lineTo(p2.x, p2.y)
      ctx.stroke()
    }

    // Animate
    const animate = () => {
      // Clear with slight fade for trail effect
      ctx.fillStyle = 'rgba(15, 23, 42, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const particles = particlesRef.current
      const mouse = mouseRef.current

      // Update and draw particles
      particles.forEach((particle, i) => {
        // Update position
        particle.x += particle.vx
        particle.y += particle.vy

        // Mouse interaction - repel particles
        const dx = mouse.x - particle.x
        const dy = mouse.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        if (distance < 150 && distance > 0) {
          const force = (150 - distance) / 150 * 0.1
          particle.vx -= (dx / distance) * force
          particle.vy -= (dy / distance) * force
        }

        // Boundary wrapping
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // Velocity damping
        particle.vx *= 0.99
        particle.vy *= 0.99

        // Limit velocity
        const maxVelocity = 2
        const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy)
        if (speed > maxVelocity) {
          particle.vx = (particle.vx / speed) * maxVelocity
          particle.vy = (particle.vy / speed) * maxVelocity
        }

        drawParticle(particle)

        // Draw connections to nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const other = particles[j]
          const dx = other.x - particle.x
          const dy = other.y - particle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < connectionDistance) {
            drawConnection(particle, other, distance)
          }
        }
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
      style={{ background: 'transparent' }}
    />
  )
}

export default AnimatedBackground
