import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Check if user prefers reduced motion
 */
export function shouldReduceMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Generate random particle configuration for card effects
 */
export function generateParticle(index: number, totalParticles: number) {
  const baseDelay = (index / totalParticles) * 0.5 // Stagger over 500ms
  
  return {
    id: `particle-${index}-${Date.now()}`,
    x: Math.random() * 100, // Random X position (0-100%)
    size: Math.random() * 2 + 2, // Random size (2-4px)
    opacity: Math.random() * 0.3 + 0.4, // Random opacity (0.4-0.7)
    drift: (Math.random() - 0.5) * 20, // Horizontal drift (±10px)
    delay: baseDelay,
    duration: Math.random() * 0.5 + 1.5, // Random duration (1.5-2s)
  }
}

/**
 * Map cursor state to visual variant
 */
export type CursorState = 'idle' | 'text' | 'card'

export function getCursorVariant(state: CursorState) {
  const variants = {
    idle: {
      scale: 1,
      opacity: 1.0,
      blur: 0,
    },
    text: {
      scale: 0.3,
      opacity: 1,
      blur: 0,
    },
    card: {
      scale: 2.2, // 40-45px from 20px base
      opacity: 0.6,
      blur: 8,
    },
  }
  
  return variants[state]
}
