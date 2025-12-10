"use client";

import React from "react";
import { motion } from "framer-motion";

interface NeoLogoProps {
  className?: string;
}

export const NeoLogo = ({ className = "w-12 h-12" }: NeoLogoProps) => {
  return (
    <div className={`relative ${className} group cursor-pointer`}>
      {/* Background Shadow Layer (Offset) */}
      <div className="absolute inset-0 bg-neo-accent translate-x-1 translate-y-1 border-2 border-neo-border transition-all duration-300 group-hover:translate-x-2 group-hover:translate-y-2 group-hover:bg-neo-text-inverse group-hover:border-neo-accent" />

      {/* Foreground Layer (Main) */}
      <motion.div
        className="absolute inset-0 bg-neo-bg text-neo-text border-2 border-neo-border flex items-center justify-center font-black text-xl z-10 select-none"
        whileHover={{ rotate: 180 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        LG
      </motion.div>
    </div>
  );
};
