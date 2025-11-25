import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const inputVariants = cva(
  'flex w-full rounded-md border bg-transparent px-3 py-2 text-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        // Default input
        default:
          'border-border bg-surface text-foreground focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary/50',
        // Neon - with glow focus
        neon: 'border-neutral-700 bg-neutral-900 text-foreground focus-visible:border-primary focus-visible:shadow-glow-primary-sm',
        // Ghost - minimal border
        ghost:
          'border-transparent bg-neutral-800/50 text-foreground focus-visible:bg-neutral-800 focus-visible:border-neutral-700',
        // Underline - bottom border only
        underline:
          'border-0 border-b border-neutral-700 rounded-none bg-transparent text-foreground focus-visible:border-primary',
        // Error state
        error:
          'border-error/50 bg-error/5 text-foreground focus-visible:ring-2 focus-visible:ring-error/50 focus-visible:border-error',
      },
      inputSize: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-4 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'md',
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  /** Error message to display */
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, inputSize, error, ...props }, ref) => {
    // Auto-switch to error variant if error prop is provided
    const effectiveVariant = error ? 'error' : variant;

    return (
      <div className="relative">
        <input
          type={type}
          className={cn(
            inputVariants({ variant: effectiveVariant, inputSize }),
            className
          )}
          ref={ref}
          aria-invalid={!!error}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs text-error">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input, inputVariants };
