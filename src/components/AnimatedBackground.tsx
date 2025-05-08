'use client'

import { useRef, useEffect, FC } from 'react'

interface Particle {
  x: number
  y: number
  speedX: number
  speedY: number
  update(): void
  draw(): void
}

const AnimatedBackground: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const particles: Particle[] = []
    const particleCount = 50
    const particleSize = 2

    class ParticleClass implements Particle {
      x: number
      y: number
      speedX: number
      speedY: number

      constructor() {
        this.x = Math.random() * (canvas?.width || 0)
        this.y = Math.random() * (canvas?.height || 0)
        this.speedX = 0.1 * (Math.random() - 0.5)
        this.speedY = 0.1 * (Math.random() - 0.5)
      }

      update(): void {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x < 0 || this.x > (canvas?.width || 0)) {
          this.x = this.x < 0 ? (canvas?.width || 0) : 0
        }
        if (this.y < 0 || this.y > (canvas?.height || 0)) {
          this.y = this.y < 0 ? (canvas?.height || 0) : 0
        }
      }

      draw(): void {
        if (!ctx) return
        ctx.fillStyle = 'rgba(0, 255, 0, 0.2)'
        ctx.beginPath()
        ctx.arc(this.x, this.y, particleSize, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new ParticleClass())
    }

    const animate = () => {
      if (!ctx || !canvas) return
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      particles.forEach(particle => {
        particle.update()
        particle.draw()
      })

      requestAnimationFrame(animate)
    }

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    window.addEventListener('resize', () => {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    })

    animate()

    return () => {
      window.removeEventListener('resize', () => {})
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
    />
  )
}

export default AnimatedBackground
