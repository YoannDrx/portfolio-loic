"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/* ============================================
   SWITCH VARIANTS
   ============================================ */

const switchVariants = cva(
  [
    "peer inline-flex shrink-0 cursor-pointer items-center rounded-full",
    "border-2 border-transparent",
    "transition-all duration-fast",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:cursor-not-allowed disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-neutral-700",
          "data-[state=checked]:bg-primary",
        ],
        outline: [
          "bg-transparent border-2 border-neutral-600",
          "data-[state=checked]:border-primary data-[state=checked]:bg-primary/10",
        ],
        success: [
          "bg-neutral-700",
          "data-[state=checked]:bg-success",
        ],
      },
      size: {
        sm: "h-4 w-7",
        default: "h-5 w-9",
        lg: "h-6 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const switchThumbVariants = cva(
  [
    "pointer-events-none block rounded-full bg-foreground shadow-lg",
    "transition-transform duration-fast",
  ],
  {
    variants: {
      size: {
        sm: "h-3 w-3 data-[state=checked]:translate-x-3 data-[state=unchecked]:translate-x-0",
        default: "h-4 w-4 data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0",
        lg: "h-5 w-5 data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
      },
      variant: {
        default: "data-[state=checked]:bg-neutral-950",
        outline: "data-[state=checked]:bg-primary",
        success: "data-[state=checked]:bg-neutral-950",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
)

/* ============================================
   SWITCH COMPONENT
   ============================================ */

interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>,
    VariantProps<typeof switchVariants> {}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(({ className, variant, size, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    className={cn(switchVariants({ variant, size }), className)}
    {...props}
  >
    <SwitchPrimitive.Thumb className={cn(switchThumbVariants({ variant, size }))} />
  </SwitchPrimitive.Root>
))
Switch.displayName = SwitchPrimitive.Root.displayName

/* ============================================
   SWITCH WITH LABEL
   ============================================ */

interface SwitchWithLabelProps extends SwitchProps {
  label: string
  description?: string
  position?: "left" | "right"
}

const SwitchWithLabel = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchWithLabelProps
>(({ label, description, position = "right", className, id, ...props }, ref) => {
  const generatedId = React.useId()
  const switchId = id || generatedId

  const labelContent = (
    <div className="grid gap-0.5 leading-none">
      <label
        htmlFor={switchId}
        className="text-sm font-medium text-foreground cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </label>
      {description && (
        <p className="text-xs text-neutral-400">{description}</p>
      )}
    </div>
  )

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {position === "left" && labelContent}
      <Switch ref={ref} id={switchId} {...props} />
      {position === "right" && labelContent}
    </div>
  )
})
SwitchWithLabel.displayName = "SwitchWithLabel"

export { Switch, SwitchWithLabel }
