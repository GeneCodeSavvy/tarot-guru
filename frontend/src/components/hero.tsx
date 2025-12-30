import { motion } from "framer-motion"
import { InteractiveCard } from "./interactive-card"

const CARD_IMAGE = "/card.webp"

export function Hero() {
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
        >
          <span className="text-primary">★</span>
          YOUR SPIRITUAL JOURNEY
          <span className="text-primary">★</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-serif text-5xl md:text-7xl lg:text-8xl text-foreground mb-6 tracking-wide leading-tight"
        >
          CLARITY IN A <br />
          CHAOTIC WORLD
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-muted-foreground text-lg md:text-xl max-w-xl mb-24 font-light tracking-wide"
        >
          ancient wisdom is the way
        </motion.p>

        <div className="relative w-64 h-96 flex items-center justify-center">
          {/* We render multiple cards in a stack that fan out */}
          {[-2, -1, 0, 1, 2].map((i) => (
            <InteractiveCard key={i} index={i} imageSrc={CARD_IMAGE} className="w-full h-full" />
          ))}
        </div>

        {/* Call to Action Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-24 text-center"
        >
          <p className="font-serif italic text-primary/80 text-xl md:text-2xl tracking-widest">Draw your path...</p>
          <div className="w-px h-32 bg-linear-to-b from-primary/40 to-transparent mx-auto mt-6" />
        </motion.div>
      </div>
    </section>
  )
}
