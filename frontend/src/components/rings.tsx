import { motion, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { getAnyCardHoveredValue } from "@/lib/card-hover-store";

export function EtherealPortal() {
    const [isAnyCardHovered, setIsAnyCardHovered] = useState(false);
    
    // Subscribe to global card hover state
    useMotionValueEvent(getAnyCardHoveredValue(), "change", (latest) => {
        setIsAnyCardHovered(latest);
    });

    return (
        <div className="relative flex items-center justify-center w-auto h-auto">
            {/* 
                SVG Container 
                We use a large viewBox to ensure the glow/blur doesn't get cut off.
            */}
            <svg
                width="100%"
                height="100%"
                viewBox="0 0 400 400"
                xmlns="http://www.w3.org/2000/svg"
                className="overflow-visible z-10"
            >
                {/* 
                   1. DEFINITIONS 
                   Here we create the "Magic" filters.
                */}
                <defs>
                    {/* Filter 1: The Wispy Smoke Effect */}
                    <filter id="elegantSmoke" x="-50%" y="-50%" width="200%" height="200%">
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.012"
                            numOctaves="4"
                            result="noise"
                        />
                        <feDisplacementMap
                            in="SourceGraphic"
                            in2="noise"
                            scale="70"
                        />
                        <feGaussianBlur stdDeviation="4" />
                    </filter>

                    {/* Filter 2: The Glow */}
                    <filter id="glowFilter">
                        <feGaussianBlur stdDeviation="8" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    {/* Filter 3: Gold Glow (activated on card hover) */}
                    <filter id="purpleGlowFilter" x="-50%" y="-50%" width="200%" height="200%">
                        <feColorMatrix
                            type="matrix"
                            values="0.831 0 0 0 0
                                    0 0.686 0 0 0
                                    0 0 0.216 0 0
                                    0 0 0 1 0"
                            result="gold"
                        />
                        <feGaussianBlur stdDeviation="12" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                </defs>

                {/* 
                   2. THE RINGS 
                   We layer multiple circles with different animations.
                */}

                {/* LAYER 1: Deep Amber Base (Broken Arcs) */}
                <motion.g
                    style={{ originX: "200px", originY: "200px" }}
                    filter="url(#elegantSmoke)"
                >
                    {[
                        { r: 250, rotate: 0, dash: "320 10000", width: 70, opacity: 0.4 },
                        { r: 220, rotate: 45, dash: "320 10000", width: 70, opacity: 0.6 },
                        { r: 240, rotate: 90, dash: "340 10000", width: 70, opacity: 0.3 },
                        { r: 217, rotate: 135, dash: "350 10000", width: 70, opacity: 0.7 },
                        { r: 230, rotate: 180, dash: "310 10000", width: 70, opacity: 0.4 },
                        { r: 250, rotate: 225, dash: "300 10000", width: 70, opacity: 0.5 },
                        { r: 245, rotate: 270, dash: "300 10000", width: 70, opacity: 0.3 },
                        { r: 250, rotate: 315, dash: "300 10000", width: 70, opacity: 0.6 },
                    ].map((arc, i) => (
                        <motion.circle
                            key={i}
                            cx="200"
                            cy="200"
                            r={arc.r - 40}
                            stroke="#9D845E"
                            strokeWidth={40}
                            fill="transparent"
                            strokeDasharray={arc.dash}
                            strokeLinecap="round"
                            initial={{ rotate: arc.rotate }}
                            animate={{ rotate: arc.rotate + 360 }}
                            transition={{
                                duration: 80 + i,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                            style={{
                                opacity: arc.opacity,
                                originX: "200px",
                                originY: "200px",
                            }}
                        />
                    ))}
                </motion.g>

                {/* LAYER 2: Rune with Smoke Effect */}
                <g>
                    <image
                        href="/rune.webp"
                        x="-400"
                        y="-400"
                        width="1200"
                        height="1200"
                        opacity="0.9"
                        style={{ 
                            mixBlendMode: 'screen',
                            filter: isAnyCardHovered 
                                ? 'url(#purpleGlowFilter)' 
                                : 'none',
                            transition: 'filter 0.5s ease-in-out'
                        }}
                    />
                    <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 200 200"
                        to="360 200 200"
                        dur="60s"
                        repeatCount="indefinite"
                    />
                </g>
            </svg>
        </div>
    );
};
