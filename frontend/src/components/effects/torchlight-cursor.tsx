import type React from 'react'
import { motion, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useCursorPosition } from '@/hooks/use-cursor-position'
import { getCursorVariant } from '@/lib/utils'

interface TorchlightCursorProps {
    children: React.ReactNode
}

/**
 * Torchlight Cursor Component
 * Creates a custom cursor that acts as a "lantern" illuminating the dark UI
 * Three states: The Seeker (idle), Focus (text), Potential (card)
 * Desktop-only with automatic fallback
 */
export function TorchlightCursor({ children }: TorchlightCursorProps) {
    const cursorData = useCursorPosition()
    const [mounted, setMounted] = useState(false)

    // Smooth cursor following with spring physics
    const springConfig = { damping: 25, stiffness: 300, mass: 0.5 }
    const cursorX = useSpring(0, springConfig)
    const cursorY = useSpring(0, springConfig)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!cursorData) return

        // Update spring values when cursor position changes
        const unsubscribeX = cursorData.x.on('change', (latest) => {
            cursorX.set(latest as number)
        })

        const unsubscribeY = cursorData.y.on('change', (latest) => {
            cursorY.set(latest as number)
        })

        return () => {
            unsubscribeX()
            unsubscribeY()
        }
    }, [cursorData, cursorX, cursorY])

    // Add custom cursor class to body for desktop
    useEffect(() => {
        if (cursorData?.isDesktop) {
            document.body.classList.add('custom-cursor-active')
        } else {
            document.body.classList.remove('custom-cursor-active')
        }

        return () => {
            document.body.classList.remove('custom-cursor-active')
        }
    }, [cursorData?.isDesktop])

    // Don't render cursor on mobile or during SSR
    if (!mounted || !cursorData) {
        return <>{children}</>
    }

    const { state } = cursorData
    const variant = getCursorVariant(state)

    return (
        <>
            {children}

            {/* Custom Cursor Element */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-9999"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                animate={{
                    scale: variant.scale,
                    opacity: variant.opacity,
                }}
                transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 28,
                    mass: 0.5,
                }}
            >
                {/* Solid Circle Cursor */}
                <motion.div
                    className="w-5 h-5 rounded-full bg-[#d4af37]"
                    animate={{
                        scale: state === 'card' ? 1.2 : state === 'text' ? 0.8 : 1,
                    }}
                    transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 25,
                    }}
                />
            </motion.div>
        </>
    )
}

export default TorchlightCursor
