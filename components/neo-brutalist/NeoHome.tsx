"use client";

import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { CustomCursor } from "./ui/CustomCursor";
import { Marquee } from "./ui/Marquee";
import { FilmBanner } from "./FilmBanner";
import { NeoNavbar } from "./NeoNavbar";
import { NeoSplitHero } from "./NeoSplitHero";
import { NeoFooter } from "./NeoFooter";

// Partner logos for the marquee
const partnerLogos = [
  { src: "/img/partners/cezame-logo.png", alt: "Cezame Music Agency", size: "large" as const },
  { src: "/img/partners/gum-logo.png", alt: "GUM", size: "large" as const },
  { src: "/img/partners/myma-logo.png", alt: "MYMA", size: "normal" as const },
  { src: "/img/partners/superpitch-logo.png", alt: "Superpitch", size: "normal" as const },
  {
    src: "/img/partners/universal-production.png",
    alt: "Universal Production Music",
    size: "large" as const,
  },
  { src: "/img/partners/infinity-scores.jpeg", alt: "Infinity Scores", size: "normal" as const },
  { src: "/img/partners/superama-records.jpg", alt: "Superama Records", size: "normal" as const },
];

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

      <main className="relative z-10 pt-16 md:pt-20">
        <NeoSplitHero />
        <Marquee logos={partnerLogos} />
        <FilmBanner />
        <NeoFooter />
      </main>
    </div>
  );
}
