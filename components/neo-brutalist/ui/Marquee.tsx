"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface MarqueeProps {
  text: string;
  direction?: 1 | -1;
}

export const Marquee: React.FC<MarqueeProps> = ({ text, direction = 1 }) => {
  return (
    <div className="relative flex overflow-hidden border-y-4 border-neo-black bg-white py-4 select-none">
      <motion.div
        className="flex whitespace-nowrap font-black text-6xl md:text-8xl uppercase tracking-tighter text-neo-black"
        animate={{ x: direction === 1 ? [0, -1000] : [-1000, 0] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
      >
        {Array(8).fill(text).map((item, i) => (
          <span key={i} className="mx-8 flex items-center gap-6">
            {item} <span className="w-8 h-8 bg-neo-orange block rounded-full" />
          </span>
        ))}
      </motion.div>
    </div>
  );
};
