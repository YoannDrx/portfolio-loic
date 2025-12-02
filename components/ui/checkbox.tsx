"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check, Minus } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/* ============================================
   CHECKBOX VARIANTS
   ============================================ */

const checkboxVariants = cva(
  [
    "peer shrink-0 rounded",
    "border transition-all duration-fast",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-foreground",
    "data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-foreground",
  ],
  {
    variants: {
      variant: {
        default: "border-border hover:border-border-strong",
        outline: "border-primary/50 hover:border-primary",
      },
      size: {
        sm: "h-3.5 w-3.5 rounded",
        default: "h-4 w-4 rounded",
        lg: "h-5 w-5 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/* ============================================
   CHECKBOX COMPONENT
   ============================================ */

interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
    VariantProps<typeof checkboxVariants> {}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, variant, size, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(checkboxVariants({ variant, size }), className)}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      {props.checked === "indeterminate" ? (
        <Minus className={cn(size === "sm" ? "h-3 w-3" : size === "lg" ? "h-4 w-4" : "h-3.5 w-3.5")} />
      ) : (
        <Check className={cn(size === "sm" ? "h-3 w-3" : size === "lg" ? "h-4 w-4" : "h-3.5 w-3.5")} />
      )}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

/* ============================================
   CHECKBOX WITH LABEL
   ============================================ */

interface CheckboxWithLabelProps extends CheckboxProps {
  label: string
  description?: string
}

const CheckboxWithLabel = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxWithLabelProps
>(({ label, description, className, id, ...props }, ref) => {
  const generatedId = React.useId()
  const checkboxId = id || generatedId

  return (
    <div className="flex items-start gap-3">
      <Checkbox ref={ref} id={checkboxId} className={className} {...props} />
      <div className="grid gap-1 leading-none">
        <label
          htmlFor={checkboxId}
          className="text-sm font-medium text-foreground cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  )
})
CheckboxWithLabel.displayName = "CheckboxWithLabel"

export { Checkbox, CheckboxWithLabel }
