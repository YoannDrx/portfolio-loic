"use client";

import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

type BrutalistButtonSize = "sm" | "md" | "lg";
type BrutalistButtonVariant = "primary" | "secondary" | "dark" | "ghost";

interface BrutalistButtonBaseProps {
  variant?: BrutalistButtonVariant;
  size?: BrutalistButtonSize;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  children: React.ReactNode;
  className?: string;
}

interface BrutalistButtonAsButton extends BrutalistButtonBaseProps,
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BrutalistButtonBaseProps> {
  as?: "button";
  href?: never;
}

interface BrutalistButtonAsLink extends BrutalistButtonBaseProps,
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BrutalistButtonBaseProps> {
  as: "link";
  href: string;
}

type BrutalistButtonProps = BrutalistButtonAsButton | BrutalistButtonAsLink;

const sizeStyles: Record<BrutalistButtonSize, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-sm",
};

const variantStyles: Record<BrutalistButtonVariant, string> = {
  primary: cn(
    "bg-neo-accent text-neo-text-inverse",
    "shadow-[6px_6px_0px_0px_var(--neo-shadow)]",
    "hover:bg-neo-accent-hover",
    "hover:translate-x-[-2px] hover:translate-y-[-2px]",
    "hover:shadow-[8px_8px_0px_0px_var(--neo-shadow)]"
  ),
  secondary: cn(
    "bg-neo-surface text-neo-text",
    "shadow-[6px_6px_0px_0px_var(--neo-shadow)]",
    "hover:bg-neo-surface-hover",
    "hover:translate-x-[-2px] hover:translate-y-[-2px]",
    "hover:shadow-[8px_8px_0px_0px_var(--neo-shadow)]"
  ),
  dark: cn(
    "bg-neo-text text-neo-accent",
    "shadow-[6px_6px_0px_0px_var(--neo-accent)]",
    "hover:translate-x-[-2px] hover:translate-y-[-2px]",
    "hover:shadow-[8px_8px_0px_0px_var(--neo-accent)]"
  ),
  ghost: cn(
    "bg-transparent text-neo-text",
    "border-neo-border",
    "hover:bg-neo-text hover:text-neo-text-inverse"
  ),
};

export const BrutalistButton: React.FC<BrutalistButtonProps> = ({
  children,
  className = "",
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "right",
  as = "button",
  ...props
}) => {
  const baseStyles = cn(
    "relative font-mono font-bold uppercase",
    "transition-all duration-150",
    "border-2 border-neo-border",
    "active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
    "cursor-pointer flex items-center gap-3 select-none",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
  );

  const combinedClassName = cn(
    baseStyles,
    sizeStyles[size],
    variantStyles[variant],
    className
  );

  const content = (
    <>
      {icon && iconPosition === "left" && icon}
      {children}
      {icon && iconPosition === "right" && icon}
    </>
  );

  if (as === "link") {
    const { href, ...linkProps } = props as BrutalistButtonAsLink;
    return (
      <Link href={href} className={combinedClassName} {...linkProps}>
        {content}
      </Link>
    );
  }

  return (
    <button className={combinedClassName} {...(props as BrutalistButtonAsButton)}>
      {content}
    </button>
  );
};

export default BrutalistButton;
