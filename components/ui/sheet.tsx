"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

/* ============================================
   SHEET VARIANTS
   ============================================ */

const sheetContentVariants = cva(
  [
    "fixed z-modal gap-4 bg-surface-elevated p-6 shadow-lg",
    "transition ease-in-out",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:duration-300 data-[state=open]:duration-500",
  ],
  {
    variants: {
      side: {
        top: [
          "inset-x-0 top-0 border-b border-border",
          "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        ],
        bottom: [
          "inset-x-0 bottom-0 border-t border-border",
          "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        ],
        left: [
          "inset-y-0 left-0 h-full w-3/4 border-r border-border sm:max-w-sm",
          "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
        ],
        right: [
          "inset-y-0 right-0 h-full w-3/4 border-l border-border sm:max-w-sm",
          "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
        ],
      },
      size: {
        default: "",
        sm: "",
        lg: "",
        xl: "",
        full: "",
      },
    },
    compoundVariants: [
      { side: "left", size: "sm", className: "sm:max-w-xs" },
      { side: "left", size: "lg", className: "sm:max-w-lg" },
      { side: "left", size: "xl", className: "sm:max-w-2xl" },
      { side: "left", size: "full", className: "w-full max-w-none" },
      { side: "right", size: "sm", className: "sm:max-w-xs" },
      { side: "right", size: "lg", className: "sm:max-w-lg" },
      { side: "right", size: "xl", className: "sm:max-w-2xl" },
      { side: "right", size: "full", className: "w-full max-w-none" },
      { side: "top", size: "sm", className: "max-h-1/4" },
      { side: "top", size: "default", className: "max-h-1/3" },
      { side: "top", size: "lg", className: "max-h-1/2" },
      { side: "top", size: "xl", className: "max-h-2/3" },
      { side: "top", size: "full", className: "h-full max-h-none" },
      { side: "bottom", size: "sm", className: "max-h-1/4" },
      { side: "bottom", size: "default", className: "max-h-1/3" },
      { side: "bottom", size: "lg", className: "max-h-1/2" },
      { side: "bottom", size: "xl", className: "max-h-2/3" },
      { side: "bottom", size: "full", className: "h-full max-h-none" },
    ],
    defaultVariants: {
      side: "right",
      size: "default",
    },
  }
)

/* ============================================
   SHEET COMPONENTS
   ============================================ */

const Sheet = SheetPrimitive.Root

const SheetTrigger = SheetPrimitive.Trigger

const SheetClose = SheetPrimitive.Close

const SheetPortal = SheetPrimitive.Portal

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-modal-backdrop",
      "bg-overlay backdrop-blur-sm",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetContentVariants> {
  hideCloseButton?: boolean
}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side, size, className, children, hideCloseButton = false, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(sheetContentVariants({ side, size }), className)}
      {...props}
    >
      {children}
      {!hideCloseButton && (
        <SheetPrimitive.Close
          className={cn(
            "absolute right-4 top-4",
            "rounded-md p-1",
            "text-muted-foreground hover:text-foreground",
            "opacity-70 hover:opacity-100",
            "transition-all duration-fast",
            "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-surface-elevated",
            "disabled:pointer-events-none"
          )}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      )}
    </SheetPrimitive.Content>
  </SheetPortal>
))
SheetContent.displayName = SheetPrimitive.Content.displayName

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
SheetHeader.displayName = "SheetHeader"

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
      className
    )}
    {...props}
  />
)
SheetFooter.displayName = "SheetFooter"

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props}
  />
))
SheetTitle.displayName = SheetPrimitive.Title.displayName

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
SheetDescription.displayName = SheetPrimitive.Description.displayName

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
