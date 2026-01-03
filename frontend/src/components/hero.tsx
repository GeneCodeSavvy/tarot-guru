import { motion } from "framer-motion"
import { InteractiveCard } from "./interactive-card"
import { DivinationText } from "./ui/divination-text"
import { GoldLeafButton } from "./ui/gold-leaf-button"

const CARD_IMAGE = "/card.webp"

export function Hero() {
    const handleBeginReading = () => {
        console.log("Draw Your Cards clicked - ready for future implementation")
    }

    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-20 px-4 bg-[#0c0a09]">
            <div className="absolute top-0 bottom-0 left-1/2 w-px bg-linear-to-b from-transparent via-primary/20 to-transparent pointer-events-none" />

            {/* Background Ambience */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-gold/5 blur-[120px] rounded-full" />
            </div>

            <div className="container max-w-5xl mx-auto flex flex-col items-center z-10 text-center">
                {/* Top Tag */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex items-center gap-2 text-primary uppercase tracking-[0.4em] text-[10px] font-bold mb-8"
                    data-text="true"
                >
                    <span className="text-primary">★</span>
                    YOUR SPIRITUAL JOURNEY
                    <span className="text-primary">★</span>
                </motion.div>

                {/* Main Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="font-serif text-5xl md:text-7xl lg:text-8xl text-foreground mb-6 tracking-wide leading-tight"
                    data-text="true"
                >
                    CLARITY IN A <br />
                    CHAOTIC WORLD
                </motion.h1>

                {/* Subheading with Divination Text Effect */}
                <DivinationText
                    as="p"
                    delay={400}
                    threshold={0.2}
                    className="text-muted-foreground text-lg md:text-xl max-w-xl mb-24 font-light tracking-wide"
                >
                    Tarot reading is the ancient wisdom you need
                </DivinationText>

                {/* Card Stack */}
                <div className="relative w-64 h-96 flex items-center justify-center">
                    {/* Multiple cards in a stack that fan out */}
                    {[-1, 0, 1].map((i) => (
                        <InteractiveCard key={i} index={i} imageSrc={CARD_IMAGE} className="w-full h-full" />
                    ))}
                </div>

                {/* Call to Action Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5, duration: 0.8 }}
                    className="mt-24"
                >
                    <GoldLeafButton onClick={handleBeginReading} ariaLabel="Begin your tarot card reading">
                        Draw Your Cards
                    </GoldLeafButton>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 1 }}
                    className="mt-12"
                >
                    <div className="w-px h-32 bg-linear-to-b from-primary/40 to-transparent mx-auto" />
                </motion.div>
            </div>
        </section>
    )
}
