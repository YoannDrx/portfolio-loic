"use client";

import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { CustomCursor } from "./ui/CustomCursor";
import { Marquee } from "./ui/Marquee";
import { FilmBanner } from "./FilmBanner";
import { NeoNavbar } from "./NeoNavbar";
import { NeoSplitHero } from "./NeoSplitHero";
import { NeoFooter } from "./NeoFooter";
import { GridBackground } from "./ui/GridBackground";

// Partner logos for the marquee
const partnerLogos = [
  {
    src: "/img/partners/cezame-music-agency-logo.webp",
    alt: "Cezame Music Agency",
    width: 263,
    height: 60,
  },
  { src: "/img/partners/gum-logo.webp", alt: "GUM", width: 181, height: 283 },
  {
    src: "/img/partners/myma-music-agency-logo.webp",
    alt: "MYMA Music Agency",
    width: 266,
    height: 62,
  },
  {
    src: "/img/partners/superpitch-logo.webp",
    alt: "SuperPitch",
    width: 406,
    height: 406,
  },
  {
    src: "/img/partners/universal-production-music-logo.webp",
    alt: "Universal Production Music",
    width: 171,
    height: 68,
  },
  {
    src: "/img/partners/infinity-scores-logo.webp",
    alt: "Infinity Scores",
    width: 656,
    height: 280,
  },
  {
    src: "/img/partners/superama-records-logo.webp",
    alt: "Superama Records",
    width: 360,
    height: 360,
  },
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
      <GridBackground />

      <NeoNavbar />

      <main className="relative z-10 pt-16 md:pt-20">
        <NeoSplitHero />

        {/* Partners Section */}
        <section>
          <Marquee logos={partnerLogos} direction={-1} />
        </section>

        {/* Films Section */}
        <section>
          <FilmBanner />
        </section>

        <NeoFooter />
      </main>
    </div>
  );
}
