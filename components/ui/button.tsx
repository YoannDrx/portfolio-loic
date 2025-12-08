import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, type HTMLMotionProps } from 'framer-motion';

import { cn } from '@/lib/utils';
import { hoverScale, tapScale } from '@/lib/animations';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        /* ===== NEON VARIANTS (site public) ===== */
        // Primary neon - bright yellow
        neon: 'bg-primary text-foreground font-semibold tracking-wide shadow-glow-primary-sm hover:shadow-glow-primary hover:bg-primary-300',
        // Neon outline - border only
        'neon-outline':
          'border-2 border-primary text-primary bg-transparent hover:bg-primary/10 shadow-glow-primary-sm hover:shadow-glow-primary',
        // Neon ghost - minimal
        'neon-ghost': 'text-primary hover:bg-primary/10 hover:text-primary-300',
        // Neon subtle - softer presence
        'neon-subtle':
          'bg-primary/15 text-primary border border-primary/30 hover:bg-primary/25 hover:border-primary/50',
        // Green accent
        'neon-green':
          'bg-green text-foreground font-semibold shadow-glow-green-sm hover:shadow-glow-green hover:bg-green-300',
        // Emerald accent
        'neon-emerald':
          'bg-emerald text-white font-semibold shadow-glow-emerald-sm hover:shadow-glow-emerald hover:bg-emerald-300',
        // Teal accent
        'neon-teal':
          'bg-teal text-white font-semibold shadow-glow-teal-sm hover:shadow-glow-teal hover:bg-teal-300',
        // Ocean accent
        'neon-ocean':
          'bg-ocean text-white font-semibold shadow-glow-ocean-sm hover:shadow-glow-ocean hover:bg-ocean-300',
        // Gradient - primary to emerald
        gradient:
          'bg-gradient-primary text-foreground font-semibold shadow-glow-primary-sm hover:shadow-glow-primary',
        // Gradient - emerald to ocean
        'gradient-teal':
          'bg-gradient-teal text-white font-semibold shadow-glow-emerald-sm hover:shadow-glow-emerald',

        /* ===== STANDARD VARIANTS ===== */
        // Default - primary color
        default:
          'bg-primary text-foreground shadow-sm hover:bg-primary-300',
        // Destructive - error color
        destructive:
          'bg-error text-white shadow-sm hover:bg-error-dark',
        // Outline - bordered
        outline:
          'border border-border bg-transparent text-foreground shadow-sm hover:bg-surface-hover hover:border-border-strong',
        // Secondary - muted
        secondary:
          'bg-surface text-foreground shadow-sm hover:bg-surface-hover',
        // Ghost - minimal
        ghost: 'text-foreground hover:bg-surface-hover',
        // Link - underlined
        link: 'text-emerald underline-offset-4 hover:underline hover:text-emerald-300',
      },
      size: {
        default: 'h-10 px-5 py-2 text-sm rounded-lg',
        sm: 'h-8 px-3 text-xs rounded-md',
        lg: 'h-12 px-8 text-base rounded-xl',
        xl: 'h-14 px-10 text-lg rounded-xl',
        icon: 'h-10 w-10 rounded-lg',
        'icon-sm': 'h-8 w-8 rounded-md',
        'icon-lg': 'h-12 w-12 rounded-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  /** Enable Framer Motion animations (hover/tap) */
  animated?: boolean;
  /** Show loading state */
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      animated = false,
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    // Animated version with Framer Motion
    if (animated && !asChild) {
      return (
        <motion.button
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          disabled={isDisabled}
          whileHover={!isDisabled ? hoverScale : undefined}
          whileTap={!isDisabled ? tapScale : undefined}
          {...(props as HTMLMotionProps<'button'>)}
        >
          {loading ? (
            <>
              <LoadingSpinner />
              <span className="sr-only">Loading...</span>
              {children}
            </>
          ) : (
            children
          )}
        </motion.button>
      );
    }

    // Standard version (or asChild)
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {loading ? (
          <>
            <LoadingSpinner />
            <span className="sr-only">Loading...</span>
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

// Loading spinner component
function LoadingSpinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export { Button, buttonVariants };
