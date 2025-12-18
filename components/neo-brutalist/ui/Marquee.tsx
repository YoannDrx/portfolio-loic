"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface LogoItem {
  src: string;
  alt: string;
  size?: "normal" | "large";
}

interface MarqueeProps {
  items?: string[];
  logos?: LogoItem[];
  direction?: 1 | -1;
}

export const Marquee: React.FC<MarqueeProps> = ({ items, logos, direction = 1 }) => {
  // If logos are provided, use logo mode
  if (logos && logos.length > 0) {
    const repeatedLogos = React.useMemo(
      () => Array.from({ length: 6 }, () => logos).flat(),
      [logos]
    );

    return (
      <div className="relative flex overflow-hidden border-y-4 border-neo-border bg-neo-surface py-6 select-none">
        <motion.div
          className="flex whitespace-nowrap items-center"
          animate={{ x: direction === 1 ? [0, -1000] : [-1000, 0] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 10 }}
        >
          {repeatedLogos.map((logo, index) => (
            <span key={`${logo.alt}-${index}`} className="flex items-center">
              <span className="mx-8 md:mx-16 flex items-center justify-center">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.size === "large" ? 350 : 200}
                  height={logo.size === "large" ? 175 : 100}
                  className={`w-auto object-contain ${
                    logo.size === "large" ? "h-28 md:h-44" : "h-16 md:h-24"
                  }`}
                  style={{ maxWidth: logo.size === "large" ? "350px" : "220px" }}
                />
              </span>
              <span className="w-2 h-2 md:w-3 md:h-3 bg-neo-accent block rounded-full" />
            </span>
          ))}
        </motion.div>
      </div>
    );
  }

  // Original text mode
  const repeatedItems = React.useMemo(
    () => Array.from({ length: 6 }, () => (items?.length ? items : [""])).flat(),
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
