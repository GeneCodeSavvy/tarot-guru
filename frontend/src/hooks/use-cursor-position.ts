import { useEffect, useState } from 'react'
import { useMotionValue, type MotionValue } from 'framer-motion'

type CursorState = 'idle' | 'text' | 'card'

interface CursorPosition {
    x: MotionValue<number>
    y: MotionValue<number>
    state: CursorState
    isDesktop: boolean
}

/**
 * Custom hook to track cursor position with spring physics for desktop devices
 * Returns motion values for smooth cursor following and contextual state
 */
export function useCursorPosition(): CursorPosition | null {
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const [state, setState] = useState<CursorState>('idle')
    const [isDesktop, setIsDesktop] = useState(false)

    useEffect(() => {
        // Check if device supports fine pointer (desktop/mouse)
        const checkDesktop = () => {
            const hasHover = window.matchMedia('(hover: hover)').matches
            const hasFinePointer = window.matchMedia('(pointer: fine)').matches
            setIsDesktop(hasHover && hasFinePointer)
        }

        checkDesktop()

        // Listen for changes in pointer type (e.g., switching to touch screen)
        const hoverQuery = window.matchMedia('(hover: hover)')
        const pointerQuery = window.matchMedia('(pointer: fine)')

        hoverQuery.addEventListener('change', checkDesktop)
        pointerQuery.addEventListener('change', checkDesktop)

        return () => {
            hoverQuery.removeEventListener('change', checkDesktop)
            pointerQuery.removeEventListener('change', checkDesktop)
        }
    }, [])

    useEffect(() => {
        if (!isDesktop) return

        let rafId: number | null = null
        let lastUpdate = 0
        const throttleMs = 16 // ~60fps

        const updateCursorPosition = (event: MouseEvent) => {
            const now = Date.now()

            if (now - lastUpdate < throttleMs) {
                return
            }

            if (rafId !== null) {
                cancelAnimationFrame(rafId)
            }

            rafId = requestAnimationFrame(() => {
                x.set(event.clientX)
                y.set(event.clientY)
                lastUpdate = now

                // Detect element type under cursor
                const target = event.target as HTMLElement

                if (!target) {
                    setState('idle')
                    return
                }

                // Check for card element (higher priority)
                if (target.closest('[data-card="true"]')) {
                    setState('card')
                }
                // Check for text elements
                else if (
                    target.closest('[data-text="true"]') ||
                    target.tagName.match(/^(P|H1|H2|H3|H4|H5|H6|SPAN|A|BUTTON)$/i)
                ) {
                    setState('text')
                }
                // Default idle state
                else {
                    setState('idle')
                }
            })
        }

        // Track cursor movement
        window.addEventListener('mousemove', updateCursorPosition)

        return () => {
            window.removeEventListener('mousemove', updateCursorPosition)
            if (rafId !== null) {
                cancelAnimationFrame(rafId)
            }
        }
    }, [isDesktop, x, y])

    // Return null for non-desktop devices
    if (!isDesktop) {
        return null
    }

    return { x, y, state, isDesktop }
}
