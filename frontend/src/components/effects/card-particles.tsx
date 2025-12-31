import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { generateParticle } from '@/lib/utils'

interface Particle {
  id: string
  x: number
  size: number
  opacity: number
  drift: number
  delay: number
  duration: number
}

interface CardParticlesProps {
  isActive: boolean
  count?: number
  color?: string
  duration?: number
}

/**
 * SVG-based particle effect system for card hover interactions
 * Creates rising "dust motes" with gold tint and fade-out animation
 */
export function CardParticles({
  isActive,
  count = 12,
  color = '#d4af37',
  duration = 2000,
}: CardParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    if (isActive && particles.length === 0) {
      // Generate particles on first hover
      const newParticles = Array.from({ length: count }, (_, i) =>
        generateParticle(i, count)
      )
      setParticles(newParticles)
    } else if (!isActive && particles.length > 0) {
      // Clear particles when hover ends (after animation completes)
      const timeout = setTimeout(() => {
        setParticles([])
      }, duration)

      return () => clearTimeout(timeout)
    }
  }, [isActive, count, duration, particles.length])

  if (!isActive && particles.length === 0) {
    return null
  }

  return (
    <svg
      className="absolute inset-0 pointer-events-none overflow-visible"
      style={{ zIndex: 5 }}
    >
      {particles.map((particle) => (
        <motion.circle
          key={particle.id}
          cx={`${particle.x}%`}
          cy="100%"
          r={particle.size}
          fill={color}
          initial={{
            cy: '100%',
            opacity: 0,
            x: 0,
          }}
          animate={{
            cy: '0%',
            opacity: [0, particle.opacity, particle.opacity * 0.8, 0],
            x: particle.drift,
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            ease: 'easeOut',
          }}
        />
      ))}
    </svg>
  )
}

export default CardParticles
