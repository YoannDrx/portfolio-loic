"use client";

import { cn } from '@/lib/utils';
import type { TextareaHTMLAttributes } from 'react';
import { forwardRef } from 'react';

interface NeoTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  variant?: 'default' | 'underline' | 'filled';
}

export const NeoTextarea = forwardRef<HTMLTextAreaElement, NeoTextareaProps>(({
  label,
  error,
  variant = 'default',
  className,
  id,
  rows = 4,
  ...props
}, ref) => {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

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
          htmlFor={textareaId}
          className="font-mono text-xs font-bold uppercase tracking-wider text-neo-text"
        >
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        className={cn(
          'w-full text-neo-text placeholder:text-neo-text/40',
          'font-mono text-sm',
          'outline-none transition-all duration-200 resize-none',
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

NeoTextarea.displayName = 'NeoTextarea';

export default NeoTextarea;
