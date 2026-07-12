"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

export const ImmersivePageAtmosphere = () => {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const firstOrbY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 320]);
  const secondOrbY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -240]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <motion.div
        className="fixed left-0 top-0 z-[60] h-1 w-full origin-left bg-neo-accent"
        style={{ scaleX: scrollYProgress }}
      />
      <motion.div
        className="absolute -left-24 top-[18vh] h-64 w-64 rounded-full bg-neo-accent/10 blur-3xl md:h-96 md:w-96"
        style={{ y: firstOrbY }}
      />
      <motion.div
        className="absolute -right-32 top-[65vh] h-72 w-72 rotate-45 border-[28px] border-neo-accent/5 blur-sm md:h-[30rem] md:w-[30rem]"
        style={{ y: secondOrbY }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(var(--neo-accent-rgb),0.06),transparent_42%)]" />
    </div>
  );
};
