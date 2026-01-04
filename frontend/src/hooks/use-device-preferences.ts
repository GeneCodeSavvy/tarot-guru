import { useEffect, useState } from 'react'

interface DevicePreferences {
    isMobile: boolean
    prefersReducedMotion: boolean
}

/**
 * Hook to detect device type and user motion preferences
 * Used to optimize animations and effects for mobile devices and accessibility
 */
export function useDevicePreferences(): DevicePreferences {
    const [isMobile, setIsMobile] = useState(false)
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

    useEffect(() => {
        // Check if device is mobile (touch-based)
        const checkMobile = () => {
            const hasTouch = window.matchMedia('(hover: none)').matches
            const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches
            const userAgent = /iPhone|iPad|Android|Mobile/i.test(navigator.userAgent)

            setIsMobile(hasTouch || hasCoarsePointer || userAgent)
        }

        // Check if user prefers reduced motion
        const checkReducedMotion = () => {
            const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
            setPrefersReducedMotion(mediaQuery.matches)
        }

        checkMobile()
        checkReducedMotion()

        // Listen for changes
        const mobileQuery = window.matchMedia('(hover: none)')
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

        mobileQuery.addEventListener('change', checkMobile)
        motionQuery.addEventListener('change', checkReducedMotion)

        return () => {
            mobileQuery.removeEventListener('change', checkMobile)
            motionQuery.removeEventListener('change', checkReducedMotion)
        }
    }, [])

    return { isMobile, prefersReducedMotion }
}
