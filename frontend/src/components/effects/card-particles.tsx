import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { generateParticle } from '@/lib/utils'
import { useDevicePreferences } from '@/hooks/use-device-preferences'

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
 * Optimized for mobile devices and reduced motion preferences
 */
export function CardParticles({
  isActive,
  count = 60,
  color = '#d4af37',
  duration = 2000,
}: CardParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([])
  const { prefersReducedMotion } = useDevicePreferences()

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

  // Create a four-pointed star path centered at origin
  const createStarPath = (size: number) => {
    const points = 4
    const outerRadius = size
    const innerRadius = size * 0.4
    let path = ''

    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius
      const angle = (Math.PI * i) / points
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      path += `${i === 0 ? 'M' : 'L'} ${x} ${y} `
    }
    path += 'Z'
    return path
  }

  return (
    <svg
      className="absolute inset-0 pointer-events-none overflow-visible"
      style={{ zIndex: 5 }}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <defs>
        {/* Golden shine filter with strong glow effect */}
        <filter id="golden-shine" x="-200%" y="-200%" width="400%" height="400%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="0.3" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0
                    0.84 0 0 0 0
                    0 0 0 0 0
                    0 0 0 1 0"
            result="glow1"
          />
          <feGaussianBlur in="SourceAlpha" stdDeviation="0.6" result="blur2" />
          <feColorMatrix
            in="blur2"
            type="matrix"
            values="1 0 0 0 0
                    0.92 0 0 0 0
                    0.2 0 0 0 0
                    0 0 0 0.6 0"
            result="glow2"
          />
          <feMerge>
            <feMergeNode in="glow2" />
            <feMergeNode in="glow1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
          <feComponentTransfer>
            <feFuncA type="linear" slope="1.5" />
          </feComponentTransfer>
        </filter>
      </defs>
      {particles.map((particle) => (
        <motion.g
          key={particle.id}
          transform={`translate(${particle.x}, 100)`}
        >
          <motion.path
            d={createStarPath(particle.size * 0.8)}
            fill={color}
            filter="url(#golden-shine)"
            initial={{
              y: 0,
              opacity: 0,
            }}
            animate={{
              y: -100,
              opacity: [0, particle.opacity * 1.2, particle.opacity, 0],
              x: particle.drift / 10,
            }}
            transition={
              prefersReducedMotion
                ? { duration: 0.2 }
                : {
                  duration: particle.duration,
                  delay: particle.delay,
                  ease: 'easeOut',
                }
            }
            style={{
              filter: 'brightness(1.5)',
            }}
          />
        </motion.g>
      ))}
    </svg>
  )
}

export default CardParticles
