import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'cyan' | 'magenta' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

/**
 * NeonButton - Button component with neon glow effect
 *
 * Variants:
 * - cyan: Neon cyan accent (default)
 * - magenta: Neon magenta accent
 * - purple: Neon purple accent
 *
 * Sizes:
 * - sm: Small button (px-4 py-2)
 * - md: Medium button (px-8 py-3) - default
 * - lg: Large button (px-12 py-4)
 */
export const NeonButton = forwardRef<HTMLButtonElement, NeonButtonProps>(
  ({
    variant = 'cyan',
    size = 'md',
    fullWidth = false,
    className,
    children,
    disabled,
    ...props
  }, ref) => {
    const baseStyles = 'relative overflow-hidden rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      cyan: 'border-neon-cyan text-neon-cyan hover:shadow-[0_0_20px_rgba(0,240,255,0.8)] hover:bg-neon-cyan/10',
      magenta: 'border-neon-magenta text-neon-magenta hover:shadow-[0_0_20px_rgba(255,0,110,0.8)] hover:bg-neon-magenta/10',
      purple: 'border-neon-purple text-neon-purple hover:shadow-[0_0_20px_rgba(139,92,246,0.8)] hover:bg-neon-purple/10',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-8 py-3 text-base',
      lg: 'px-12 py-4 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          'border bg-transparent',
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled}
        {...props}
      >
        {/* Shimmer effect on hover */}
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] transition-transform duration-700 group-hover:translate-x-[200%]" />

        {/* Button content */}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
      </button>
    );
  }
);

NeonButton.displayName = 'NeonButton';

/**
 * NeonButtonOutline - Outline variant with minimal background
 */
export const NeonButtonOutline = forwardRef<HTMLButtonElement, NeonButtonProps>(
  ({ variant = 'cyan', size = 'md', fullWidth = false, className, children, disabled, ...props }, ref) => {
    const baseStyles = 'relative rounded-lg border-2 bg-transparent font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      cyan: 'border-neon-cyan/50 text-neon-cyan hover:border-neon-cyan hover:bg-neon-cyan/5',
      magenta: 'border-neon-magenta/50 text-neon-magenta hover:border-neon-magenta hover:bg-neon-magenta/5',
      purple: 'border-neon-purple/50 text-neon-purple hover:border-neon-purple hover:bg-neon-purple/5',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-2.5 text-base',
      lg: 'px-10 py-3 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

NeonButtonOutline.displayName = 'NeonButtonOutline';

/**
 * NeonButtonSolid - Solid variant with filled background
 */
export const NeonButtonSolid = forwardRef<HTMLButtonElement, NeonButtonProps>(
  ({ variant = 'cyan', size = 'md', fullWidth = false, className, children, disabled, ...props }, ref) => {
    const baseStyles = 'relative rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      cyan: 'bg-neon-cyan text-obsidian hover:bg-neon-cyan/90 shadow-[0_0_20px_rgba(0,240,255,0.3)]',
      magenta: 'bg-neon-magenta text-white hover:bg-neon-magenta/90 shadow-[0_0_20px_rgba(255,0,110,0.3)]',
      purple: 'bg-neon-purple text-white hover:bg-neon-purple/90 shadow-[0_0_20px_rgba(139,92,246,0.3)]',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-8 py-3 text-base',
      lg: 'px-12 py-4 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

NeonButtonSolid.displayName = 'NeonButtonSolid';
