import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-primary-500 dark:focus-visible:ring-admin-primary-600 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-admin-primary-500 dark:bg-admin-primary-600 text-white shadow hover:bg-admin-primary-600 dark:hover:bg-admin-primary-700",
        destructive:
          "bg-admin-danger-500 dark:bg-admin-danger-600 text-white shadow-sm hover:bg-admin-danger-600 dark:hover:bg-admin-danger-700",
        outline:
          "border border-admin-border dark:border-dark-admin-border bg-white dark:bg-dark-admin-bg-secondary shadow-sm hover:bg-admin-bg-secondary dark:hover:bg-dark-admin-bg-tertiary text-admin-text-primary dark:text-dark-admin-text-primary",
        secondary:
          "bg-admin-bg-tertiary dark:bg-dark-admin-bg-tertiary text-admin-text-primary dark:text-dark-admin-text-primary shadow-sm hover:bg-admin-bg-secondary dark:hover:bg-dark-admin-bg",
        ghost: "hover:bg-admin-bg-secondary dark:hover:bg-dark-admin-bg-tertiary text-admin-text-primary dark:text-dark-admin-text-primary",
        link: "text-admin-primary-600 dark:text-admin-primary-400 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
