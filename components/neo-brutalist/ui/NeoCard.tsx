"use client";

import { cn } from '@/lib/utils';
import type { HTMLMotionProps } from 'framer-motion';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { forwardRef } from 'react';

type NeoCardVariant = 'default' | 'accent' | 'inverted' | 'ghost' | 'dark-ghost';
type NeoCardHover = 'lift' | 'scale' | 'glow' | 'none';

interface NeoCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  variant?: NeoCardVariant;
  hover?: NeoCardHover;
  border?: 'thin' | 'medium' | 'thick';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

const variantStyles: Record<NeoCardVariant, string> = {
  default: 'bg-neo-surface text-neo-text border-neo-border',
  accent: 'bg-neo-accent text-neo-text-inverse border-neo-border',
  inverted: 'bg-neo-text text-neo-bg border-neo-border',
  ghost: 'bg-transparent text-neo-text border-neo-border',
  'dark-ghost': 'bg-white/5 text-white border-white/20',
};

const borderStyles: Record<string, string> = {
  thin: 'border',
  medium: 'border-2',
  thick: 'border-4',
};

const paddingStyles: Record<string, string> = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-8',
};

const hoverStyles: Record<NeoCardHover, string> = {
  lift: 'hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_var(--neo-shadow)]',
  scale: 'hover:scale-[1.02]',
  glow: 'hover:shadow-[0_0_20px_rgba(var(--neo-accent-rgb),0.4)]',
  none: '',
};

export const NeoCard = forwardRef<HTMLDivElement, NeoCardProps>(({
  children,
  variant = 'default',
  hover = 'lift',
  border = 'medium',
  padding = 'md',
  className,
  ...props
}, ref) => {
  return (
    <motion.div
      ref={ref}
      className={cn(
        'transition-all duration-200',
        'shadow-[4px_4px_0px_0px_var(--neo-shadow)]',
        variantStyles[variant],
        borderStyles[border],
        paddingStyles[padding],
        hoverStyles[hover],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
});

NeoCard.displayName = 'NeoCard';

export default NeoCard;
