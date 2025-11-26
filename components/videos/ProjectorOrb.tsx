"use client";

import { motion } from "framer-motion";

/* ============================================
   PROJECTOR ORB COMPONENT
   Orbe visuelle CSS représentant un projecteur
   de cinéma avec rayons de lumière et lens flares
   ============================================ */

export default function ProjectorOrb() {
  return (
    <div className="relative w-full aspect-square max-w-md mx-auto">
      {/* Outer cyan glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(0, 240, 255, 0.25), rgba(139, 92, 246, 0.15), transparent 70%)",
          filter: "blur(40px)",
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Projector body - dark circle */}
      <motion.div
        className="absolute inset-[15%] rounded-full border-4 border-white/10"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(30, 30, 40, 0.95), rgba(10, 10, 15, 0.98))",
          boxShadow: "inset 0 0 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 240, 255, 0.2)",
        }}
      >
        {/* Lens rings */}
        <motion.div
          className="absolute inset-[20%] rounded-full border-2 border-neon-cyan/30"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute inset-[30%] rounded-full border border-neon-cyan/20"
          animate={{
            scale: [1.05, 1, 1.05],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* Lens center - bright cyan core */}
      <motion.div
        className="absolute inset-[35%] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 40% 40%, rgba(0, 240, 255, 0.9), rgba(139, 92, 246, 0.6), rgba(0, 240, 255, 0.4))",
          boxShadow: "0 0 60px rgba(0, 240, 255, 0.5), inset 0 0 30px rgba(255, 255, 255, 0.2)",
        }}
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Inner bright spot */}
      <motion.div
        className="absolute inset-[44%] rounded-full bg-white"
        style={{
          boxShadow: "0 0 40px rgba(255, 255, 255, 0.8), 0 0 80px rgba(0, 240, 255, 0.6)",
        }}
        animate={{
          opacity: [0.6, 1, 0.6],
          scale: [0.9, 1.1, 0.9],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Light beam rays emanating from center */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`ray-${i}`}
          className="absolute left-1/2 top-1/2 origin-bottom"
          style={{
            width: "2px",
            height: "140px",
            background: `linear-gradient(to top, rgba(0, 240, 255, 0.6), transparent)`,
            transform: `translate(-50%, -100%) rotate(${i * 45}deg)`,
          }}
          animate={{
            opacity: [0.3, 0.7, 0.3],
            scaleY: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Lens flare particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`flare-${i}`}
          className="absolute rounded-full"
          style={{
            left: "50%",
            top: "50%",
            width: i % 2 === 0 ? "8px" : "6px",
            height: i % 2 === 0 ? "8px" : "6px",
            background:
              i % 3 === 0
                ? "rgba(0, 240, 255, 0.8)"
                : i % 3 === 1
                  ? "rgba(255, 0, 110, 0.7)"
                  : "rgba(139, 92, 246, 0.7)",
            boxShadow:
              i % 3 === 0
                ? "0 0 15px rgba(0, 240, 255, 0.6)"
                : i % 3 === 1
                  ? "0 0 15px rgba(255, 0, 110, 0.5)"
                  : "0 0 15px rgba(139, 92, 246, 0.5)",
          }}
          animate={{
            x: [0, Math.cos((i * Math.PI * 2) / 6) * 120, 0],
            y: [0, Math.sin((i * Math.PI * 2) / 6) * 120, 0],
            opacity: [0, 0.9, 0],
            scale: [0, 1.3, 0],
          }}
          transition={{
            duration: 3.5 + i * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3,
          }}
        />
      ))}

      {/* Film reel decorations */}
      <motion.div
        className="absolute -top-4 -right-4 w-12 h-12 rounded-full border-2 border-neon-magenta/40"
        style={{
          background: "radial-gradient(circle, rgba(255, 0, 110, 0.1), transparent)",
        }}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div className="absolute inset-[30%] rounded-full border border-neon-magenta/30" />
      </motion.div>

      <motion.div
        className="absolute -bottom-2 -left-6 w-10 h-10 rounded-full border-2 border-neon-purple/40"
        style={{
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.1), transparent)",
        }}
        animate={{
          rotate: [360, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div className="absolute inset-[30%] rounded-full border border-neon-purple/30" />
      </motion.div>

      {/* Sparkle effects */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute w-1.5 h-1.5 rounded-full bg-white"
          style={{
            left: `${25 + i * 18}%`,
            top: `${20 + (i % 2) * 55}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.2, 0],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Pulsing outer rings */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`ring-${i}`}
          className="absolute inset-[15%] rounded-full border border-neon-cyan/20"
          animate={{
            scale: [1, 2],
            opacity: [0.3, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 1,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}
