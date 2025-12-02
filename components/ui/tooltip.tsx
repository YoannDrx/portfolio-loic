"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/* ============================================
   TOOLTIP VARIANTS
   ============================================ */

const tooltipContentVariants = cva(
  [
    "z-tooltip overflow-hidden rounded-md px-3 py-1.5",
    "text-xs font-medium",
    "animate-in fade-in-0 zoom-in-95",
    "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
    "data-[side=bottom]:slide-in-from-top-2",
    "data-[side=left]:slide-in-from-right-2",
    "data-[side=right]:slide-in-from-left-2",
    "data-[side=top]:slide-in-from-bottom-2",
  ],
  {
    variants: {
      variant: {
        default: "bg-neutral-800 text-foreground border border-border",
        dark: "bg-neutral-950 text-foreground border border-neutral-800",
        primary: "bg-primary text-foreground",
        inverted: "bg-foreground text-background",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

/* ============================================
   TOOLTIP COMPONENTS
   ============================================ */

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

interface TooltipContentProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>,
    VariantProps<typeof tooltipContentVariants> {}

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(({ className, variant, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(tooltipContentVariants({ variant }), className)}
      {...props}
    />
  </TooltipPrimitive.Portal>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

/* ============================================
   SIMPLE TOOLTIP WRAPPER
   ============================================ */

interface SimpleTooltipProps {
  children: React.ReactNode
  content: React.ReactNode
  variant?: TooltipContentProps["variant"]
  side?: "top" | "right" | "bottom" | "left"
  align?: "start" | "center" | "end"
  delayDuration?: number
  skipDelayDuration?: number
}

function SimpleTooltip({
  children,
  content,
  variant = "default",
  side = "top",
  align = "center",
  delayDuration = 200,
  skipDelayDuration = 300,
}: SimpleTooltipProps) {
  return (
    <TooltipProvider delayDuration={delayDuration} skipDelayDuration={skipDelayDuration}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent variant={variant} side={side} align={align}>
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  SimpleTooltip,
}
