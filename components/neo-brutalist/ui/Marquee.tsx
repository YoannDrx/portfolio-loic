"use client";

import React from "react";
import { motion } from "framer-motion";

interface MarqueeProps {
  items: string[];
  direction?: 1 | -1;
}

export const Marquee: React.FC<MarqueeProps> = ({ items, direction = 1 }) => {
  const repeatedItems = React.useMemo(
    () => Array.from({ length: 6 }, () => (items.length ? items : [""])).flat(),
    [items]
  );

  return (
    <div className="relative flex overflow-hidden border-y-4 border-neo-border bg-neo-surface py-4 select-none">
      <motion.div
        className="flex whitespace-nowrap font-black text-4xl md:text-8xl uppercase tracking-tighter text-neo-text"
        animate={{ x: direction === 1 ? [0, -1000] : [-1000, 0] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
      >
        {repeatedItems.map((item, index) => (
          <span key={`${item}-${index}`} className="flex items-center">
            <span className="mx-4 md:mx-8">{item}</span>
            <span className="w-4 h-4 md:w-8 md:h-8 bg-neo-accent block rounded-full" />
          </span>
        ))}
      </motion.div>
    </div>
  );
};
