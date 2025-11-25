"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/* ============================================
   PROGRESS VARIANTS
   ============================================ */

const progressVariants = cva(
  "relative w-full overflow-hidden rounded-full bg-neutral-800",
  {
    variants: {
      size: {
        sm: "h-1",
        default: "h-2",
        lg: "h-3",
        xl: "h-4",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

const progressIndicatorVariants = cva(
  "h-full w-full flex-1 transition-all duration-normal",
  {
    variants: {
      variant: {
        default: "bg-primary",
        gradient: "bg-gradient-brand",
        success: "bg-success",
        warning: "bg-warning",
        error: "bg-error",
        info: "bg-info",
      },
      animated: {
        true: "animate-pulse",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      animated: false,
    },
  }
)

/* ============================================
   PROGRESS COMPONENT
   ============================================ */

interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants>,
    VariantProps<typeof progressIndicatorVariants> {
  showValue?: boolean
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(
  (
    { className, value, size, variant, animated, showValue = false, ...props },
    ref
  ) => (
    <div className="relative">
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(progressVariants({ size }), className)}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(progressIndicatorVariants({ variant, animated }))}
          style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
      </ProgressPrimitive.Root>
      {showValue && (
        <span className="absolute right-0 -top-6 text-xs text-neutral-400">
          {value}%
        </span>
      )}
    </div>
  )
)
Progress.displayName = ProgressPrimitive.Root.displayName

/* ============================================
   PROGRESS WITH LABEL
   ============================================ */

interface ProgressWithLabelProps extends ProgressProps {
  label?: string
}

const ProgressWithLabel = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressWithLabelProps
>(({ label, value, className, ...props }, ref) => (
  <div className={cn("space-y-2", className)}>
    <div className="flex justify-between text-sm">
      {label && <span className="text-foreground">{label}</span>}
      <span className="text-neutral-400">{value}%</span>
    </div>
    <Progress ref={ref} value={value} {...props} />
  </div>
))
ProgressWithLabel.displayName = "ProgressWithLabel"

/* ============================================
   CIRCULAR PROGRESS
   ============================================ */

interface CircularProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  size?: "sm" | "default" | "lg" | "xl"
  variant?: "default" | "gradient" | "success" | "warning" | "error" | "info"
  strokeWidth?: number
  showValue?: boolean
}

const CircularProgress = React.forwardRef<HTMLDivElement, CircularProgressProps>(
  (
    {
      value = 0,
      size = "default",
      variant = "default",
      strokeWidth = 4,
      showValue = false,
      className,
      ...props
    },
    ref
  ) => {
    const sizeMap = {
      sm: 32,
      default: 48,
      lg: 64,
      xl: 96,
    }

    const variantColors = {
      default: "stroke-primary",
      gradient: "stroke-primary",
      success: "stroke-success",
      warning: "stroke-warning",
      error: "stroke-error",
      info: "stroke-info",
    }

    const dimension = sizeMap[size]
    const radius = (dimension - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (value / 100) * circumference

    return (
      <div
        ref={ref}
        className={cn("relative inline-flex items-center justify-center", className)}
        {...props}
      >
        <svg
          width={dimension}
          height={dimension}
          viewBox={`0 0 ${dimension} ${dimension}`}
          className="-rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            className="stroke-neutral-800"
          />
          {/* Progress circle */}
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={cn(
              variantColors[variant],
              "transition-all duration-normal"
            )}
          />
        </svg>
        {showValue && (
          <span className="absolute text-xs font-medium text-foreground">
            {Math.round(value)}%
          </span>
        )}
      </div>
    )
  }
)
CircularProgress.displayName = "CircularProgress"

export { Progress, ProgressWithLabel, CircularProgress }
