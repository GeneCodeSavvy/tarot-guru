import type React from 'react'
import { motion } from 'framer-motion'
import { useBlurReveal } from '@/hooks/use-blur-reveal'
import { cn, shouldReduceMotion } from '@/lib/utils'

interface DivinationTextProps {
  children: React.ReactNode
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div'
  delay?: number
  threshold?: number
  className?: string
  triggerOnce?: boolean
}

/**
 * Divination Text Component
 * Creates mystical blur-to-focus reveal animation with gold-to-white color shift
 * Simulates the feeling of "vision clearing" in tarot readings
 */
export function DivinationText({
  children,
  as = 'div',
  delay = 0,
  threshold = 0.3,
  className,
  triggerOnce = true,
}: DivinationTextProps) {
  const { ref, isVisible } = useBlurReveal({ threshold, delay, triggerOnce })
  const MotionComponent = motion[as] as typeof motion.div
  const reducedMotion = shouldReduceMotion()

  return (
    <MotionComponent
      ref={ref as any}
      className={cn(className)}
      initial={
        reducedMotion
          ? { opacity: 1 }
          : {
              filter: 'blur(10px)',
              opacity: 0,
              y: 20,
            }
      }
      animate={
        reducedMotion
          ? { opacity: 1 }
          : isVisible
            ? {
                filter: 'blur(0px)',
                opacity: 1,
                y: 0,
              }
            : {
                filter: 'blur(10px)',
                opacity: 0,
                y: 20,
              }
      }
      transition={{
        type: 'spring',
        stiffness: 120,
        damping: 20,
        mass: 1.2,
        duration: 0.8,
      }}
      data-text="true"
    >
      <motion.span
        className="inline-block"
        initial={reducedMotion ? {} : { color: '#d4af37' }}
        animate={
          reducedMotion
            ? {}
            : isVisible
              ? { color: '#f5f5f4' }
              : { color: '#d4af37' }
        }
        transition={{
          duration: 0.8,
          delay: 0.2,
        }}
      >
        {children}
      </motion.span>
    </MotionComponent>
  )
}

export default DivinationText
