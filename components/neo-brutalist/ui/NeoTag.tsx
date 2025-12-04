"use client";

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

type NeoTagVariant = 'default' | 'accent' | 'outline' | 'inverted';
type NeoTagSize = 'sm' | 'md' | 'lg';

interface NeoTagProps {
  children: ReactNode;
  variant?: NeoTagVariant;
  size?: NeoTagSize;
  className?: string;
  icon?: ReactNode;
}

const variantStyles: Record<NeoTagVariant, string> = {
  default: 'bg-neo-text text-neo-accent',
  accent: 'bg-neo-accent text-neo-text-inverse',
  outline: 'bg-transparent text-neo-text border-2 border-neo-border',
  inverted: 'bg-neo-surface text-neo-text border-2 border-neo-border',
};

const sizeStyles: Record<NeoTagSize, string> = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-3 py-1 text-xs',
  lg: 'px-4 py-1.5 text-sm',
};

export const NeoTag = ({
  children,
  variant = 'default',
  size = 'md',
  className,
  icon,
}: NeoTagProps) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5',
        'font-mono font-bold uppercase tracking-wider',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
};

export default NeoTag;
