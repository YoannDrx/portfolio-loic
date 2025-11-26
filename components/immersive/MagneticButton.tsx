"use client";

import { forwardRef } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useMagnetic } from "@/hooks/useAnimations";
import type { LucideIcon } from "lucide-react";

/* ============================================
   TYPES
   ============================================ */

type ButtonColor = "lime" | "cyan" | "magenta" | "purple" | "emerald" | "teal";
type ButtonVariant = "solid" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg" | "xl";

interface MagneticButtonProps {
  children: ReactNode;
  /** Button color theme */
  color?: ButtonColor;
  /** Button variant */
  variant?: ButtonVariant;
  /** Button size */
  size?: ButtonSize;
  /** Magnetic effect strength (0-1) */
  magneticStrength?: number;
  /** Show glow effect */
  glow?: boolean;
  /** Left icon */
  leftIcon?: LucideIcon;
  /** Right icon */
  rightIcon?: LucideIcon;
  /** Link href (renders as Link) */
  href?: string;
  /** External link */
  external?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Disabled state */
  disabled?: boolean;
  /** Additional class names */
  className?: string;
  /** Full width */
  fullWidth?: boolean;
}

/* ============================================
   COLOR CONFIGURATIONS
   ============================================ */

// Text colors for solid variants with light backgrounds (needs dark text)
const solidTextColors: Partial<Record<ButtonColor, string>> = {
  lime: "#0a0a0f", // obsidian-950
  emerald: "#0a0a0f",
  teal: "#0a0a0f",
};

const colorConfig: Record<
  ButtonColor,
  {
    solid: string;
    outline: string;
    ghost: string;
    glow: string;
  }
> = {
  lime: {
    solid: "bg-gradient-to-r from-neon-lime to-neon-cyan hover:shadow-[0_0_30px_rgba(213,255,10,0.5)]",
    outline: "border-2 border-neon-lime text-neon-lime hover:bg-neon-lime/10 hover:shadow-[0_0_20px_rgba(213,255,10,0.3)]",
    ghost: "text-neon-lime hover:bg-neon-lime/10",
    glow: "shadow-[0_0_20px_rgba(213,255,10,0.4)]",
  },
  cyan: {
    solid: "bg-gradient-to-r from-neon-cyan to-neon-purple text-white hover:shadow-[0_0_30px_rgba(0,240,255,0.5)]",
    outline: "border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10 hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]",
    ghost: "text-neon-cyan hover:bg-neon-cyan/10",
    glow: "shadow-[0_0_20px_rgba(0,240,255,0.4)]",
  },
  magenta: {
    solid: "bg-gradient-to-r from-neon-magenta to-neon-purple text-white hover:shadow-[0_0_30px_rgba(255,0,110,0.5)]",
    outline:
      "border-2 border-neon-magenta text-neon-magenta hover:bg-neon-magenta/10 hover:shadow-[0_0_20px_rgba(255,0,110,0.3)]",
    ghost: "text-neon-magenta hover:bg-neon-magenta/10",
    glow: "shadow-[0_0_20px_rgba(255,0,110,0.4)]",
  },
  purple: {
    solid: "bg-gradient-to-r from-neon-purple to-neon-cyan text-white hover:shadow-[0_0_30px_rgba(181,0,255,0.5)]",
    outline: "border-2 border-neon-purple text-neon-purple hover:bg-neon-purple/10 hover:shadow-[0_0_20px_rgba(181,0,255,0.3)]",
    ghost: "text-neon-purple hover:bg-neon-purple/10",
    glow: "shadow-[0_0_20px_rgba(181,0,255,0.4)]",
  },
  emerald: {
    solid: "bg-gradient-to-r from-emerald-400 to-teal-400 hover:shadow-[0_0_30px_rgba(0,193,139,0.5)]",
    outline: "border-2 border-emerald-400 text-emerald-400 hover:bg-emerald-400/10 hover:shadow-[0_0_20px_rgba(0,193,139,0.3)]",
    ghost: "text-emerald-400 hover:bg-emerald-400/10",
    glow: "shadow-[0_0_20px_rgba(0,193,139,0.4)]",
  },
  teal: {
    solid: "bg-gradient-to-r from-teal-400 to-cyan-400 hover:shadow-[0_0_30px_rgba(0,153,152,0.5)]",
    outline: "border-2 border-teal-400 text-teal-400 hover:bg-teal-400/10 hover:shadow-[0_0_20px_rgba(0,153,152,0.3)]",
    ghost: "text-teal-400 hover:bg-teal-400/10",
    glow: "shadow-[0_0_20px_rgba(0,153,152,0.4)]",
  },
};

const sizeConfig: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm gap-2",
  md: "px-6 py-3 text-base gap-2",
  lg: "px-8 py-4 text-lg gap-3",
  xl: "px-10 py-5 text-xl gap-3",
};

/* ============================================
   MAIN COMPONENT
   ============================================ */

const MagneticButton = forwardRef<HTMLDivElement, MagneticButtonProps>(
  (
    {
      children,
      color = "cyan",
      variant = "solid",
      size = "md",
      magneticStrength = 0.3,
      glow = false,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      href,
      external = false,
      onClick,
      disabled = false,
      className,
      fullWidth = false,
    },
    forwardedRef
  ) => {
    const { ref, x, y } = useMagnetic({ strength: magneticStrength });

    const config = colorConfig[color];

    // Get text color for solid variants with light backgrounds
    const textColor = variant === 'solid' ? solidTextColors[color] : undefined;

    const buttonClasses = cn(
      "relative inline-flex items-center justify-center",
      "font-semibold uppercase tracking-wider",
      "rounded-lg transition-all duration-300",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      sizeConfig[size],
      config[variant],
      glow && config.glow,
      fullWidth && "w-full",
      className
    );

    const contentStyle = textColor ? { color: textColor } : undefined;

    const content = (
      <span style={contentStyle} className="inline-flex items-center gap-2">
        {LeftIcon && <LeftIcon className="w-5 h-5" />}
        <span>{children}</span>
        {RightIcon && <RightIcon className="w-5 h-5" />}
      </span>
    );

    // Render as link
    if (href) {
      if (external) {
        return (
          <motion.div ref={ref} style={{ x, y }} className={fullWidth ? "w-full" : "inline-block"}>
            <motion.a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses}
              style={contentStyle}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {content}
            </motion.a>
          </motion.div>
        );
      }

      return (
        <motion.div ref={ref} style={{ x, y }} className={fullWidth ? "w-full" : "inline-block"}>
          <Link href={href} className={buttonClasses} style={contentStyle}>
            <motion.span
              className="flex items-center justify-center w-full"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {content}
            </motion.span>
          </Link>
        </motion.div>
      );
    }

    // Render as button
    return (
      <motion.div ref={ref} style={{ x, y }} className={fullWidth ? "w-full" : "inline-block"}>
        <motion.button
          onClick={onClick}
          disabled={disabled}
          className={buttonClasses}
          style={contentStyle}
          whileHover={{ scale: disabled ? 1 : 1.02 }}
          whileTap={{ scale: disabled ? 1 : 0.98 }}
        >
          {content}
        </motion.button>
      </motion.div>
    );
  }
);

MagneticButton.displayName = "MagneticButton";

export default MagneticButton;
export type { MagneticButtonProps, ButtonColor, ButtonVariant, ButtonSize };
