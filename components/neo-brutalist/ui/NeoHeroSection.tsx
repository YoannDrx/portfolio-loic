"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { NeoTag } from "./NeoTag";

interface NeoHeroSectionProps {
  badge?: string;
  badgeNumber?: string;
  title: string;
  subtitle?: string;
  description?: string;
  children?: ReactNode;
  variant?: "default" | "dark" | "accent";
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
  fullViewport?: boolean;
}

const variantStyles = {
  default: "text-neo-text",
  dark: "bg-neo-text text-neo-text-inverse",
  accent: "bg-neo-accent text-neo-text-inverse",
};

export const NeoHeroSection = ({
  badge,
  badgeNumber,
  title,
  subtitle,
  description,
  children,
  variant = "default",
  align = "left",
  className,
  titleClassName,
  fullViewport = false,
}: NeoHeroSectionProps) => {
  return (
    <section
      className={cn(
        fullViewport ? "min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-80px)]" : "min-h-[50vh]",
        "flex flex-col justify-start md:justify-center pt-8 pb-16 md:py-32 px-4 md:px-8",
        variantStyles[variant],
        align === "center" && "items-center text-center",
        className
      )}
    >
      <div
        className={cn(
          "max-w-6xl mx-auto w-full",
          align === "center" && "flex flex-col items-center"
        )}
      >
        {/* Badge */}
        {(badge || badgeNumber) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 flex items-center gap-3"
          >
            {badgeNumber && (
              <span className="font-mono text-sm font-bold bg-neo-text text-neo-accent px-2 py-1">
                {badgeNumber}
              </span>
            )}
            {badge && <NeoTag variant={variant === "dark" ? "accent" : "default"}>{badge}</NeoTag>}
          </motion.div>
        )}

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={cn(
            "text-[12vw] md:text-[8vw] lg:text-[6vw] font-black leading-[0.85] tracking-tighter uppercase",
            titleClassName
          )}
        >
          {title}
        </motion.h1>

        {/* Subtitle */}
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-xl md:text-2xl font-mono opacity-70"
          >
            {subtitle}
          </motion.p>
        )}

        {/* Description */}
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={cn(
              "mt-6 text-lg max-w-2xl",
              variant === "default" ? "text-neo-text/70" : "opacity-80"
            )}
          >
            {description}
          </motion.p>
        )}

        {/* Children (CTAs, etc.) */}
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8"
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default NeoHeroSection;
