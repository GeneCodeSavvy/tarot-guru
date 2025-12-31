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
                {/* The Seeker / Focus Ring */}
                <motion.div
                    className="relative w-5 h-5"
                    animate={{
                        scale: state === 'idle' ? [1, 1.05, 1] : 1,
                    }}
                    transition={{
                        duration: 3,
                        repeat: state === 'idle' ? Number.POSITIVE_INFINITY : 0,
                        ease: 'easeInOut',
                    }}
                >
                    {/* Outer Ring (The Seeker) */}
                    {state !== 'text' && (
                        <motion.div
                            className="absolute inset-0 rounded-full border-4 border-[#d4af37]"
                            style={{
                                filter: 'drop-shadow(0 0 2px rgba(0, 0, 0, 0.5))'
                            }}
                            animate={{
                                opacity: state === 'idle' ? 0.8 : 0.6,
                            }}
                        />
                    )}

                    {/* Inner Dot (Focus state) */}
                    {state === 'text' && (
                        <motion.div
                            className="absolute inset-0 rounded-full bg-[#d4af37]"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                                type: 'spring',
                                stiffness: 600,
                                damping: 25,
                            }}
                        />
                    )}

                    {/* God Ray Glow (Potential state for cards) */}
                    {state === 'card' && (
                        <motion.div
                            className="absolute inset-0 rounded-full"
                            style={{
                                background:
                                    'radial-gradient(circle, rgba(212, 175, 55, 0.6) 0%, rgba(212, 175, 55, 0.3) 40%, transparent 70%)',
                                filter: `blur(${variant.blur}px)`,
                                width: '100%',
                                height: '100%',
                            }}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                                type: 'spring',
                                stiffness: 300,
                                damping: 20,
                            }}
                        />
                    )}
                </motion.div>
            </motion.div>
        </>
    )
}

export default TorchlightCursor
