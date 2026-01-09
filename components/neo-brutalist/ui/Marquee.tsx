"use client";

import React from "react";
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
