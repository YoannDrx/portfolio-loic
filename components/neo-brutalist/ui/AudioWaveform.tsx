"use client";

import React from 'react';
import { motion } from 'framer-motion';

export const AudioWaveform = () => {
  return (
    <div className="flex items-end gap-[2px] h-8">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-neo-orange"
          animate={{ height: ["20%", "100%", "20%"] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.1
          }}
        />
      ))}
    </div>
  );
};
