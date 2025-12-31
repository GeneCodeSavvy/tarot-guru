import type React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GoldLeafButtonProps {
  children?: React.ReactNode
  onClick?: () => void
  size?: 'md' | 'lg'
  disabled?: boolean
  className?: string
  ariaLabel?: string
}

/**
 * Gold Leaf Button Component
 * Features embossed gold foil aesthetic with metallic sheen animation
 * Follows "Digital Tactility" design philosophy
 */
export function GoldLeafButton({
  children = 'Begin Reading',
  onClick,
  size = 'md',
  disabled = false,
  className,
  ariaLabel,
}: GoldLeafButtonProps) {
  const sizeClasses = {
    md: 'px-8 py-4 text-lg',
    lg: 'px-12 py-6 text-xl',
  }

  return (
    <motion.button
      className={cn(
        'relative overflow-hidden isolate',
        sizeClasses[size],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onClick={disabled ? undefined : onClick}
      whileHover={disabled ? undefined : 'hover'}
      whileTap={disabled ? undefined : 'tap'}
      initial="initial"
      disabled={disabled}
      aria-label={ariaLabel}
      style={{
        background: '#0c0a09',
      }}
    >
      {/* 1. The Gold Border (Double line for elegance) */}
      <div className="absolute inset-0 border border-[#d4af37]/30" />
      <div className="absolute inset-[3px] border border-[#d4af37]/60" />

      {/* 2. The "Sheen" Effect (Animated gradient overlay) */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-[#d4af37]/20 to-transparent -skew-x-12 z-0"
        variants={{
          initial: { x: '-150%' },
          hover: {
            x: '150%',
            transition: {
              duration: 0.8,
              ease: 'easeInOut',
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 1,
            },
          },
          tap: { opacity: 0 },
        }}
      />

      {/* 3. The Text Content */}
      <motion.span
        className="relative z-10 font-serif text-[#d4af37] tracking-[0.2em] uppercase font-medium block"
        variants={{
          initial: { letterSpacing: '0.2em', color: '#d4af37' },
          hover: {
            letterSpacing: '0.3em',
            textShadow: '0 0 8px rgba(212, 175, 55, 0.5)',
            transition: { duration: 0.4, ease: 'easeOut' },
          },
          tap: { scale: 0.95, color: '#f5f5f4' }, // Turns white on press
        }}
      >
        {children}
      </motion.span>

      {/* 4. The "Press" Physics (Background depression) */}
      <motion.div
        className="absolute inset-0 bg-[#d4af37] opacity-0 z-[-1]"
        variants={{
          tap: { opacity: 0.1 },
        }}
      />
    </motion.button>
  )
}

export default GoldLeafButton
