"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { cva, type VariantProps } from "class-variance-authority"
import { Circle } from "lucide-react"

import { cn } from "@/lib/utils"

/* ============================================
   RADIO GROUP VARIANTS
   ============================================ */

const radioGroupVariants = cva("grid gap-2", {
  variants: {
    orientation: {
      vertical: "grid-cols-1",
      horizontal: "grid-flow-col auto-cols-max",
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
})

const radioGroupItemVariants = cva(
  [
    "aspect-square rounded-full border",
    "transition-all duration-fast",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:cursor-not-allowed disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        default: [
          "border-border text-primary",
          "hover:border-border-strong",
          "data-[state=checked]:border-primary",
        ],
        outline: [
          "border-primary/50 text-primary",
          "hover:border-primary",
          "data-[state=checked]:border-primary data-[state=checked]:bg-primary/10",
        ],
      },
      size: {
        sm: "h-3.5 w-3.5",
        default: "h-4 w-4",
        lg: "h-5 w-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/* ============================================
   RADIO GROUP COMPONENT
   ============================================ */

interface RadioGroupProps
  extends Omit<React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>, 'orientation'>,
    VariantProps<typeof radioGroupVariants> {}

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(({ className, orientation, ...props }, ref) => (
  <RadioGroupPrimitive.Root
    ref={ref}
    className={cn(radioGroupVariants({ orientation }), className)}
    {...props}
  />
))
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

/* ============================================
   RADIO GROUP ITEM
   ============================================ */

interface RadioGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
    VariantProps<typeof radioGroupItemVariants> {}

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, variant, size, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(radioGroupItemVariants({ variant, size }), className)}
    {...props}
  >
    <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
      <Circle
        className={cn(
          "fill-current text-current",
          size === "sm" ? "h-2 w-2" : size === "lg" ? "h-3 w-3" : "h-2.5 w-2.5"
        )}
      />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
))
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

/* ============================================
   RADIO GROUP ITEM WITH LABEL
   ============================================ */

interface RadioGroupItemWithLabelProps extends RadioGroupItemProps {
  label: string
  description?: string
}

const RadioGroupItemWithLabel = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemWithLabelProps
>(({ label, description, className, id, ...props }, ref) => {
  const generatedId = React.useId()
  const radioId = id || generatedId

  return (
    <div className="flex items-start gap-3">
      <RadioGroupItem ref={ref} id={radioId} className={className} {...props} />
      <div className="grid gap-0.5 leading-none">
        <label
          htmlFor={radioId}
          className="text-sm font-medium text-foreground cursor-pointer"
        >
          {label}
        </label>
        {description && (
          <p className="text-xs text-neutral-400">{description}</p>
        )}
      </div>
    </div>
  )
})
RadioGroupItemWithLabel.displayName = "RadioGroupItemWithLabel"

/* ============================================
   RADIO GROUP CARD
   ============================================ */

interface RadioGroupCardProps extends RadioGroupItemProps {
  label: string
  description?: string
  icon?: React.ReactNode
}

const RadioGroupCard = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupCardProps
>(({ label, description, icon, className, id, value, ...props }, ref) => {
  const generatedId = React.useId()
  const radioId = id || generatedId

  return (
    <div className="relative">
      <RadioGroupPrimitive.Item
        ref={ref}
        id={radioId}
        value={value}
        className={cn(
          "peer sr-only",
          className
        )}
        {...props}
      />
      <label
        htmlFor={radioId}
        className={cn(
          "flex cursor-pointer flex-col gap-2 rounded-lg border border-border bg-surface p-4",
          "transition-all duration-fast",
          "hover:border-border-strong hover:bg-surface-hover",
          "peer-focus-visible:ring-2 peer-focus-visible:ring-primary/50 peer-focus-visible:ring-offset-2",
          "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5",
          "peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
        )}
      >
        <div className="flex items-center gap-3">
          {icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-elevated text-primary">
              {icon}
            </div>
          )}
          <div className="flex-1">
            <div className="text-sm font-medium text-foreground">{label}</div>
            {description && (
              <div className="text-xs text-neutral-400">{description}</div>
            )}
          </div>
          <div
            className={cn(
              "h-4 w-4 rounded-full border-2",
              "transition-all duration-fast",
              "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary",
              "peer-data-[state=unchecked]:border-neutral-600"
            )}
          >
            <div className="flex h-full items-center justify-center">
              <div
                className={cn(
                  "h-1.5 w-1.5 rounded-full bg-neutral-950",
                  "scale-0 transition-transform duration-fast",
                  "peer-data-[state=checked]:scale-100"
                )}
              />
            </div>
          </div>
        </div>
      </label>
    </div>
  )
})
RadioGroupCard.displayName = "RadioGroupCard"

export { RadioGroup, RadioGroupItem, RadioGroupItemWithLabel, RadioGroupCard }
