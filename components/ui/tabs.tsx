"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/* ============================================
   TABS VARIANTS
   ============================================ */

const tabsListVariants = cva(
  "inline-flex items-center justify-center",
  {
    variants: {
      variant: {
        default: "rounded-lg bg-surface p-1 text-neutral-400",
        pills: "gap-2 p-0 bg-transparent",
        underline: "gap-4 p-0 bg-transparent border-b border-border",
      },
      size: {
        sm: "h-8",
        default: "h-10",
        lg: "h-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const tabsTriggerVariants = cva(
  [
    "inline-flex items-center justify-center whitespace-nowrap",
    "font-medium transition-all duration-fast",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        default: [
          "rounded-md px-3 py-1.5 text-sm",
          "data-[state=active]:bg-surface-elevated data-[state=active]:text-foreground data-[state=active]:shadow-sm",
          "data-[state=inactive]:text-neutral-400 data-[state=inactive]:hover:text-neutral-300",
        ],
        pills: [
          "rounded-full px-4 py-1.5 text-sm",
          "data-[state=active]:bg-primary data-[state=active]:text-neutral-950",
          "data-[state=inactive]:text-neutral-400 data-[state=inactive]:hover:bg-surface-hover data-[state=inactive]:hover:text-neutral-300",
        ],
        underline: [
          "px-1 pb-2 text-sm border-b-2 -mb-px rounded-none",
          "data-[state=active]:border-primary data-[state=active]:text-foreground",
          "data-[state=inactive]:border-transparent data-[state=inactive]:text-neutral-400 data-[state=inactive]:hover:text-neutral-300 data-[state=inactive]:hover:border-border",
        ],
      },
      size: {
        sm: "text-xs",
        default: "text-sm",
        lg: "text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/* ============================================
   CONTEXT FOR VARIANT PROPAGATION
   ============================================ */

type TabsVariant = "default" | "pills" | "underline"
type TabsSize = "sm" | "default" | "lg"

const TabsContext = React.createContext<{
  variant: TabsVariant
  size: TabsSize
}>({
  variant: "default",
  size: "default",
})

/* ============================================
   COMPONENTS
   ============================================ */

const Tabs = TabsPrimitive.Root

interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsListVariants> {}

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, variant = "default", size = "default", ...props }, ref) => (
  <TabsContext.Provider value={{ variant: variant!, size: size! }}>
    <TabsPrimitive.List
      ref={ref}
      className={cn(tabsListVariants({ variant, size }), className)}
      {...props}
    />
  </TabsContext.Provider>
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => {
  const { variant, size } = React.useContext(TabsContext)
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(tabsTriggerVariants({ variant, size }), className)}
      {...props}
    />
  )
})
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-4",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      "data-[state=inactive]:hidden",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
