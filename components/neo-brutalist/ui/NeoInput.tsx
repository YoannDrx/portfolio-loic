"use client";

import { cn } from '@/lib/utils';
import { forwardRef, InputHTMLAttributes } from 'react';

interface NeoInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  variant?: 'default' | 'underline' | 'filled';
}

export const NeoInput = forwardRef<HTMLInputElement, NeoInputProps>(({
  label,
  error,
  variant = 'default',
  className,
  id,
  ...props
}, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  const variantStyles = {
    default: cn(
      'border-2 border-neo-border bg-neo-surface px-4 py-3',
      'focus:border-neo-accent focus:shadow-[4px_4px_0px_0px_var(--neo-accent)]'
    ),
    underline: cn(
      'border-b-2 border-neo-border bg-transparent px-0 py-3',
      'focus:border-neo-accent'
    ),
    filled: cn(
      'border-2 border-neo-border bg-neo-bg-alt px-4 py-3',
      'focus:border-neo-accent focus:bg-neo-surface'
    ),
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label
          htmlFor={inputId}
          className="font-mono text-xs font-bold uppercase tracking-wider text-neo-text"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={cn(
          'w-full text-neo-text placeholder:text-neo-text/40',
          'font-mono text-sm',
          'outline-none transition-all duration-200',
          variantStyles[variant],
          error && 'border-error focus:border-error',
          className
        )}
        {...props}
      />
      {error && (
        <span className="font-mono text-xs text-error">{error}</span>
      )}
    </div>
  );
});

NeoInput.displayName = 'NeoInput';

export default NeoInput;
