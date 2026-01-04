import { motion } from "framer-motion";

export function EtherealPortal() {
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
                    {/* <filter id="glowFilter"> */}
                    {/*     <feGaussianBlur stdDeviation="8" result="coloredBlur" /> */}
                    {/*     <feMerge> */}
                    {/*         <feMergeNode in="coloredBlur" /> */}
                    {/*         <feMergeNode in="SourceGraphic" /> */}
                    {/*     </feMerge> */}
                    {/* </filter> */}

                    {/* Gradient: Gold to Transparent for the trails */}
                    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#F59E0B" stopOpacity="0" />
                        <stop offset="50%" stopColor="#FCD34D" stopOpacity="1" />
                        <stop offset="100%" stopColor="#FFFBEB" stopOpacity="0" />
                    </linearGradient>
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
                            r={arc.r - 50}
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

                {/* LAYER 2: The Main Gold Portal (Bright, defined) */}
                <motion.circle
                    cx="200"
                    cy="200"
                    r="200"
                    stroke="url(#goldGradient)"
                    strokeWidth="4"
                    fill="transparent"
                    filter="url(#glowFilter)"
                    strokeLinecap="round"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: -360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                />

                {/* LAYER 3: The "Broken" Particles (Fast, wispy details) */}
                {/* <motion.circle */}
                {/*     cx="200" */}
                {/*     cy="200" */}
                {/*     r="135" */}
                {/*     stroke="#FEF3C7" */}
                {/*     strokeWidth="2" */}
                {/*     fill="transparent" */}
                {/*     strokeDasharray="10 40 20 60" */}
                {/*     filter="url(#wispyFilter)" */}
                {/*     opacity="0.6" */}
                {/*     animate={{ rotate: 360, scale: [1, 1.05, 1] }} */}
                {/*     transition={{ */}
                {/*         rotate: { duration: 30, repeat: Infinity, ease: "linear" }, */}
                {/*         scale: { duration: 5, repeat: Infinity, ease: "easeInOut" } */}
                {/*     }} */}
                {/* /> */}
            </svg>

            {/* Optional: Center Glow Overlay (CSS) to enhance depth */}
            <div className="absolute inset-0 bg-amber-500/10 blur-3xl rounded-full pointer-events-none mix-blend-screen" />
        </div>
    );
};
