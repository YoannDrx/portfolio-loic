"use client";

import React from "react";
import Image from "next/image";

interface LogoItem {
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface MarqueeProps {
  items?: string[];
  logos?: LogoItem[];
  direction?: 1 | -1;
  speed?: number;
}

export const Marquee: React.FC<MarqueeProps> = ({ items, logos, direction = 1, speed = 30 }) => {
  // If logos are provided, use logo mode
  if (logos && logos.length > 0) {
    return (
      <div className="relative flex overflow-hidden border-y-4 border-neo-border bg-neo-surface py-6 select-none">
        <div
          className="flex animate-marquee"
          style={{
            animationDirection: direction === 1 ? "normal" : "reverse",
            animationDuration: `${speed}s`,
          }}
        >
          {/* First set of logos */}
          {logos.map((logo, index) => (
            <span key={`first-${logo.alt}-${index}`} className="flex items-center shrink-0">
              <span className="mx-5 flex h-24 w-52 items-center justify-center border-2 border-black bg-white px-4 py-2 shadow-[5px_5px_0px_0px_var(--neo-accent)] md:mx-8 md:h-32 md:w-72 md:py-3">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.width}
                  height={logo.height}
                  className="h-full w-full object-contain"
                  sizes="(min-width: 768px) 240px, 176px"
                />
              </span>
              <span className="w-2 h-2 md:w-3 md:h-3 bg-neo-accent block rounded-full shrink-0" />
            </span>
          ))}
        </div>
        {/* Duplicate for seamless loop */}
        <div
          className="flex animate-marquee"
          aria-hidden="true"
          style={{
            animationDirection: direction === 1 ? "normal" : "reverse",
            animationDuration: `${speed}s`,
          }}
        >
          {logos.map((logo, index) => (
            <span key={`second-${logo.alt}-${index}`} className="flex items-center shrink-0">
              <span className="mx-5 flex h-24 w-52 items-center justify-center border-2 border-black bg-white px-4 py-2 shadow-[5px_5px_0px_0px_var(--neo-accent)] md:mx-8 md:h-32 md:w-72 md:py-3">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.width}
                  height={logo.height}
                  className="h-full w-full object-contain"
                  sizes="(min-width: 768px) 240px, 176px"
                />
              </span>
              <span className="w-2 h-2 md:w-3 md:h-3 bg-neo-accent block rounded-full shrink-0" />
            </span>
          ))}
        </div>
      </div>
    );
  }

  // Original text mode
  const displayItems = items?.length ? items : [""];

  return (
    <div className="relative flex overflow-hidden border-y-4 border-neo-border bg-neo-surface py-4 select-none">
      <div
        className="flex animate-marquee font-black text-4xl md:text-8xl uppercase tracking-tighter text-neo-text"
        style={{
          animationDirection: direction === 1 ? "normal" : "reverse",
          animationDuration: `${speed}s`,
        }}
      >
        {displayItems.map((item, index) => (
          <span key={`first-${item}-${index}`} className="flex items-center shrink-0">
            <span className="mx-4 md:mx-8 whitespace-nowrap">{item}</span>
            <span className="w-4 h-4 md:w-8 md:h-8 bg-neo-accent block rounded-full shrink-0" />
          </span>
        ))}
      </div>
      {/* Duplicate for seamless loop */}
      <div
        className="flex animate-marquee font-black text-4xl md:text-8xl uppercase tracking-tighter text-neo-text"
        aria-hidden="true"
        style={{
          animationDirection: direction === 1 ? "normal" : "reverse",
          animationDuration: `${speed}s`,
        }}
      >
        {displayItems.map((item, index) => (
          <span key={`second-${item}-${index}`} className="flex items-center shrink-0">
            <span className="mx-4 md:mx-8 whitespace-nowrap">{item}</span>
            <span className="w-4 h-4 md:w-8 md:h-8 bg-neo-accent block rounded-full shrink-0" />
          </span>
        ))}
      </div>
    </div>
  );
};
