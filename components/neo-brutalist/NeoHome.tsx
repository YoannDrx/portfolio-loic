"use client";

import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { CustomCursor } from "./ui/CustomCursor";
import { Marquee } from "./ui/Marquee";
import { NeoNavbar } from "./NeoNavbar";
import { NeoHero } from "./NeoHero";
import { NeoStreaming } from "./NeoStreaming";
import { NeoFooter } from "./NeoFooter";

export default function NeoHome() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <div className="min-h-screen bg-neo-bg text-neo-text font-sans selection:bg-neo-text selection:text-neo-accent overflow-x-hidden">
      <CustomCursor />

      {/* Top Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-neo-accent origin-left z-50"
        style={{ scaleX }}
      />

      {/* Grid Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(var(--neo-border) 1px, transparent 1px), linear-gradient(90deg, var(--neo-border) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <NeoNavbar />

      <main className="relative z-10 pt-32">
        <NeoHero />
        <Marquee text="SOUNDTRACK — ORIGINAL SCORE — AUDIO BRANDING — MIXING —" />
        <NeoStreaming />
        <NeoFooter />
      </main>
    </div>
  );
}
