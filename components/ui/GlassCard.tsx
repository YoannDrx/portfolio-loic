import type { ReactNode } from 'react';
import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'neon' | 'subtle';
  hover?: boolean;
  onClick?: () => void;
}

/**
 * GlassCard - Glassmorphism card component with neon accents
 *
 * Variants:
 * - default: Standard glass card with subtle border
 * - neon: Glass card with neon gradient border and glow
 * - subtle: Minimal glass effect with less opacity
 */
export function GlassCard({
  children,
  className,
  variant = 'default',
  hover = false,
  onClick
}: GlassCardProps) {
  const baseStyles = 'relative overflow-hidden rounded-2xl backdrop-blur-xl transition-all duration-300';

  const variants = {
    default: 'glass-card',
    neon: 'glass-card-neon',
    subtle: 'glass-card-subtle',
  };

  const hoverEffect = hover
    ? 'hover:scale-[1.02] hover:shadow-2xl hover:shadow-neon-cyan/20 cursor-pointer'
    : '';

  return (
    <div
      className={cn(
        baseStyles,
        variants[variant],
        hoverEffect,
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      {children}
    </div>
  );
}

/**
 * GlassCardHeader - Header section for GlassCard
 */
export function GlassCardHeader({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('px-6 py-4 border-b border-white/10', className)}>
      {children}
    </div>
  );
}

/**
 * GlassCardContent - Content section for GlassCard
 */
export function GlassCardContent({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('px-6 py-4', className)}>
      {children}
    </div>
  );
}

/**
 * GlassCardFooter - Footer section for GlassCard
 */
export function GlassCardFooter({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('px-6 py-4 border-t border-white/10', className)}>
      {children}
    </div>
  );
}
