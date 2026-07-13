"use client";

import { motion, useReducedMotion } from "framer-motion";

interface SectionTransitionProps {
  inverted?: boolean;
}

export const SectionTransition = ({ inverted = false }: SectionTransitionProps) => {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={`relative h-3 overflow-hidden border-y-2 border-neo-border ${
        inverted ? "bg-neo-text" : "bg-neo-bg"
      }`}
      aria-hidden="true"
    >
      <motion.div
        initial={reduceMotion ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: reduceMotion ? 0 : 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 origin-left bg-neo-accent"
      />
    </div>
  );
};
