import React, { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface FilterButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  children: React.ReactNode;
  count?: number;
}

/**
 * FilterButton - Button component for filtering content
 *
 * Used in Albums and Videos pages to filter by category/genre
 * Shows active state with neon glow when selected
 */
export function FilterButton({
  active = false,
  children,
  count,
  className,
  ...props
}: FilterButtonProps) {
  return (
    <button
      className={cn(
        'relative rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200',
        'border backdrop-blur-sm',
        active
          ? 'border-neon-cyan bg-neon-cyan/20 text-neon-cyan shadow-[0_0_15px_rgba(0,240,255,0.5)]'
          : 'border-white/20 bg-white/5 text-gray-400 hover:border-white/30 hover:bg-white/10 hover:text-gray-300',
        className
      )}
      {...props}
    >
      <span className="flex items-center gap-2">
        {children}
        {count !== undefined && (
          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-xs font-bold',
              active
                ? 'bg-neon-cyan/30 text-neon-cyan'
                : 'bg-white/10 text-gray-500'
            )}
          >
            {count}
          </span>
        )}
      </span>
    </button>
  );
}

/**
 * FilterButtonGroup - Container for multiple FilterButtons
 */
export function FilterButtonGroup({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-3',
        className
      )}
    >
      {children}
    </div>
  );
}
