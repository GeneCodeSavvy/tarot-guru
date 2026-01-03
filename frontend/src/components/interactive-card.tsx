import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import type React from "react"
import { useRef, useState } from "react"
import { CardParticles } from "./effects/card-particles"

interface InteractiveCardProps {
    imageSrc: string
    className?: string
    index?: number
}

const HOVER_PADDING = 0 // pixels inside the card

export function InteractiveCard({ imageSrc, className, index = 0 }: InteractiveCardProps) {
    const ref = useRef<HTMLDivElement>(null)
    const [isHovered, setIsHovered] = useState(false)

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

        setIsHovered(isInsideInnerArea)

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

    const handleMouseLeave = () => {
        x.set(0)
        y.set(0)
        setIsHovered(false)
    }

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            initial={{ rotate: index * 5, x: index * 10, opacity: 0 }}
            animate={{
                rotate: isHovered ? 0 : index * 8,
                x: isHovered ? 0 : index * 30,
                y: isHovered ? -40 : 0,
                scale: isHovered ? 1.1 : 1,
                opacity: 1,
                filter: isHovered
                    ? "drop-shadow(0 20px 40px rgba(212, 175, 55, 0.3))"
                    : "drop-shadow(0 10px 20px rgba(0, 0, 0, 0.5))",
                transition: { type: "spring", stiffness: 300, damping: 20 },
            }}
            className={`absolute cursor-pointer transition-shadow duration-500 ${className}`}
            data-card="true"
        >
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
                <img src={imageSrc || "/placeholder.svg"} alt="Tarot Card" className="w-full h-full object-cover" />

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

                {/* SVG Particle System */}
                <CardParticles isActive={isHovered} count={12} />
            </div>
        </motion.div>
    )
}
