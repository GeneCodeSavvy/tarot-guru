import { useEffect, useRef, useState } from 'react'

interface UseBlurRevealOptions {
  threshold?: number
  delay?: number
  triggerOnce?: boolean
}

interface UseBlurRevealReturn {
  ref: React.RefObject<HTMLElement>
  isVisible: boolean
  hasAnimated: boolean
}

/**
 * Custom hook to trigger blur-to-focus reveal animation on viewport entry
 * Uses Intersection Observer for performant scroll-based animations
 */
export function useBlurReveal({
  threshold = 0.3,
  delay = 0,
  triggerOnce = true,
}: UseBlurRevealOptions = {}): UseBlurRevealReturn {
  const ref = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    // If reduced motion is preferred, show content immediately
    if (prefersReducedMotion) {
      setIsVisible(true)
      setHasAnimated(true)
      return
    }

    const element = ref.current
    if (!element) return

    // Don't re-observe if already animated and triggerOnce is true
    if (triggerOnce && hasAnimated) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Apply delay if specified
            if (delay > 0) {
              setTimeout(() => {
                setIsVisible(true)
                setHasAnimated(true)
              }, delay)
            } else {
              setIsVisible(true)
              setHasAnimated(true)
            }

            // Unobserve if triggerOnce is true
            if (triggerOnce) {
              observer.unobserve(entry.target)
            }
          } else if (!triggerOnce) {
            // Reset visibility when out of view if repeatable
            setIsVisible(false)
          }
        })
      },
      {
        threshold,
        rootMargin: '0px',
      }
    )

    observer.observe(element)

    return () => {
      if (element) {
        observer.unobserve(element)
      }
      observer.disconnect()
    }
  }, [threshold, delay, triggerOnce, hasAnimated])

  return { ref, isVisible, hasAnimated }
}
