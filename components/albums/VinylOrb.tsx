"use client";

import { motion } from "framer-motion";

/* ============================================
   VINYL ORB COMPONENT
   Orbe visuelle CSS représentant un vinyl stylisé
   avec effets de glow magenta et particules
   ============================================ */

export default function VinylOrb() {
  return (
    <div className="relative w-full aspect-square max-w-md mx-auto">
      {/* Outer magenta glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(255, 0, 110, 0.25), rgba(139, 92, 246, 0.15), transparent 70%)",
          filter: "blur(40px)",
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.5, 0.9, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Vinyl disc outer ring */}
      <motion.div
        className="absolute inset-[10%] rounded-full border-4 border-white/10"
        style={{
          background:
            "conic-gradient(from 0deg, rgba(10, 10, 15, 0.95), rgba(30, 30, 40, 0.9), rgba(10, 10, 15, 0.95), rgba(40, 40, 50, 0.9), rgba(10, 10, 15, 0.95))",
          boxShadow: "inset 0 0 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(255, 0, 110, 0.3)",
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
        {/* Vinyl grooves - concentric circles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full border border-white/5"
            style={{
              inset: `${12 + i * 5}%`,
            }}
          />
        ))}
      </motion.div>

      {/* Middle gradient ring */}
      <motion.div
        className="absolute inset-[25%] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(255, 0, 110, 0.4), rgba(139, 92, 246, 0.2), transparent 70%)",
          filter: "blur(15px)",
        }}
        animate={{
          scale: [1, 1.1, 0.95, 1],
          rotate: [0, -180],
        }}
        transition={{
          scale: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          },
          rotate: {
            duration: 12,
            repeat: Infinity,
            ease: "linear",
          },
        }}
      />

      {/* Center label - Vinyl center */}
      <motion.div
        className="absolute inset-[38%] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 40% 40%, rgba(255, 0, 110, 0.9), rgba(139, 92, 246, 0.7), rgba(255, 0, 110, 0.5))",
          boxShadow: "0 0 50px rgba(255, 0, 110, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.1)",
        }}
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Center hole */}
      <motion.div
        className="absolute inset-[46%] rounded-full bg-obsidian-950"
        style={{
          boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.8), 0 0 20px rgba(255, 0, 110, 0.3)",
        }}
      />

      {/* Floating sound particles around vinyl */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: "50%",
            top: "50%",
            background:
              i % 3 === 0
                ? "rgba(255, 0, 110, 0.8)"
                : i % 3 === 1
                  ? "rgba(139, 92, 246, 0.8)"
                  : "rgba(255, 255, 255, 0.6)",
            boxShadow:
              i % 3 === 0
                ? "0 0 10px rgba(255, 0, 110, 0.6)"
                : i % 3 === 1
                  ? "0 0 10px rgba(139, 92, 246, 0.6)"
                  : "0 0 10px rgba(255, 255, 255, 0.4)",
          }}
          animate={{
            x: [0, Math.cos((i * Math.PI * 2) / 8) * 140, 0],
            y: [0, Math.sin((i * Math.PI * 2) / 8) * 140, 0],
            opacity: [0, 0.9, 0],
            scale: [0, 1.2, 0],
          }}
          transition={{
            duration: 3 + i * 0.4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.25,
          }}
        />
      ))}

      {/* Sparkle effects */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute w-1 h-1 rounded-full bg-white"
          style={{
            left: `${30 + i * 15}%`,
            top: `${25 + (i % 2) * 50}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Sound wave rings emanating */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`wave-${i}`}
          className="absolute inset-[20%] rounded-full border border-neon-magenta/30"
          animate={{
            scale: [1, 2.5],
            opacity: [0.4, 0],
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
