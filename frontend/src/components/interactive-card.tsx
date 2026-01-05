import { motion, useMotionValue, useMotionValueEvent, useSpring, useTransform } from "framer-motion"
import type React from "react"
import { useRef, useState } from "react"
import { CardParticles } from "./effects/card-particles"
import { useDevicePreferences } from "@/hooks/use-device-preferences"
import { getCardHoverValue, setCardHover } from "@/lib/card-hover-store"

interface InteractiveCardProps {
    imageSrc: string
    className?: string
    index?: number
    isPseudo?: boolean      // marks card as invisible trigger
    triggerIndex?: number   // which card to trigger hover on
}

const HOVER_PADDING = 0 // pixels inside the card

export function InteractiveCard({ imageSrc, className, index = 0, isPseudo = false, triggerIndex }: InteractiveCardProps) {
    const ref = useRef<HTMLDivElement>(null)
    const { isMobile, prefersReducedMotion } = useDevicePreferences()

    // Use shared motion value for hover state (zero re-renders across cards)
    const hoverValue = getCardHoverValue(index)
    const [isHovered, setIsHovered] = useState(false)
    
    // Subscribe to motion value changes (only this card re-renders when its hover state changes)
    useMotionValueEvent(hoverValue, "change", (latest) => {
        setIsHovered(latest)
    })

    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const mouseXSpring = useSpring(x)
    const mouseYSpring = useSpring(y)

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"])
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"])

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return

        const rect = ref.current.getBoundingClientRect()
        const mouseX = event.clientX - rect.left
        const mouseY = event.clientY - rect.top

        const isInsideInnerArea =
            mouseX > HOVER_PADDING &&
            mouseX < rect.width - HOVER_PADDING &&
            mouseY > HOVER_PADDING &&
            mouseY < rect.height - HOVER_PADDING

        // If pseudo card, trigger the neighbor's hover
        if (isPseudo && triggerIndex !== undefined) {
            setCardHover(triggerIndex, isInsideInnerArea)
            // Still update own motion values for smooth animations
            if (!isInsideInnerArea) {
                x.set(0)
                y.set(0)
                return
            }
            const xPct = mouseX / rect.width - 0.5
            const yPct = mouseY / rect.height - 0.5
            x.set(xPct)
            y.set(yPct)
        } else {
            // Regular card behavior - update own hover state
            setCardHover(index, isInsideInnerArea)
            if (!isInsideInnerArea) {
                x.set(0)
                y.set(0)
                return
            }
            const xPct = mouseX / rect.width - 0.5
            const yPct = mouseY / rect.height - 0.5
            x.set(xPct)
            y.set(yPct)
        }
    }

    const handleMouseLeave = () => {
        x.set(0)
        y.set(0)
        
        if (isPseudo && triggerIndex !== undefined) {
            setCardHover(triggerIndex, false)
        } else {
            setCardHover(index, false)
        }
    }

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX: isPseudo ? 0 : rotateX,
                rotateY: isPseudo ? 0 : rotateY,
                transformStyle: "preserve-3d",
                opacity: isPseudo ? 0 : 1,
            }}
            animate={{
                rotate: isHovered ? 0 : index * 8,
                x: isHovered ? 0 : index * 30,
                y: isPseudo ? 0 : (isHovered ? -40 : 0),
                scale: isPseudo ? 1 : (isHovered ? 1.1 : 1),
                opacity: isPseudo ? 0 : 1,
                filter: isPseudo
                    ? "none"
                    : isHovered
                        ? "drop-shadow(0 20px 40px rgba(212, 175, 55, 0.3))"
                        : "drop-shadow(0 10px 20px rgba(0, 0, 0, 0.5))",
                transition: prefersReducedMotion
                    ? { duration: 0.15 }
                    : { type: "spring", stiffness: 300, damping: 20 },
            }}
            className={`absolute cursor-pointer transition-shadow duration-500 ${className}`}
            data-card="true"
            aria-hidden={isPseudo ? "true" : undefined}
        >
            {!isPseudo && (
                <>
                    {/* Existing glow effect */}
                    <motion.div
                        className="absolute inset-0 z-0 bg-primary/30 blur-[40px] rounded-2xl pointer-events-none"
                        animate={{ opacity: isHovered ? 1 : 0 }}
                    />

                    {/* Card content container */}
                    <div
                        className="relative z-10 w-full aspect-[2/3] rounded-2xl overflow-hidden border border-primary/20 shadow-2xl bg-black"
                        style={{ transform: "translateZ(20px)" }}
                    >
                        <picture>
                            <source
                                srcSet="/card-380.webp 380w, /card-512.webp 512w, /card-768.webp 768w, /card-original.webp 1654w"
                                sizes="(max-width: 640px) 192px, 256px"
                                type="image/webp"
                            />
                            <img
                                src={imageSrc || "/placeholder.svg"}
                                alt="Tarot Card"
                                className="w-full h-full object-cover"
                                loading="lazy"
                                decoding="async"
                            />
                        </picture>

                        {/* Existing shine effect */}
                        <motion.div
                            className="absolute inset-0 bg-linear-to-tr from-transparent via-white/5 to-transparent pointer-events-none"
                            style={{
                                transform: "translateZ(30px)",
                                opacity: isHovered ? 0.3 : 0,
                            }}
                        />

                        {/* Gold border glow on hover */}
                        <motion.div
                            className="absolute inset-0 rounded-2xl border-2 pointer-events-none"
                            animate={{
                                borderColor: isHovered
                                    ? "rgba(212, 175, 55, 0.6)"
                                    : "rgba(212, 175, 55, 0)",
                            }}
                            transition={{ duration: 0.3 }}
                        />

                        {/* SVG Particle System - Optimized for mobile and accessibility */}
                        {!prefersReducedMotion && (
                            <CardParticles
                                isActive={isHovered}
                                count={isMobile ? 3 : 12}
                            />
                        )}
                    </div>
                </>
            )}
        </motion.div>
    )
}
