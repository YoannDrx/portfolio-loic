'use client';

import { motion } from 'framer-motion';

export default function ThreeLoader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-obsidian z-20">
      <div className="text-center">
        {/* Animated dots */}
        <div className="flex items-center justify-center gap-3 mb-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-4 h-4 rounded-full bg-gradient-to-r from-neon-cyan to-neon-magenta"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {/* Loading text */}
        <motion.p
          className="text-sm text-gray-400 uppercase tracking-wider"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          Chargement...
        </motion.p>
      </div>
    </div>
  );
}
