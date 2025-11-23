import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-admin-primary-500 dark:focus:ring-admin-primary-600 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-admin-primary-500 dark:bg-admin-primary-600 text-white shadow hover:bg-admin-primary-600 dark:hover:bg-admin-primary-700",
        secondary:
          "border-transparent bg-admin-bg-tertiary dark:bg-dark-admin-bg-tertiary text-admin-text-primary dark:text-dark-admin-text-primary hover:bg-admin-bg-secondary dark:hover:bg-dark-admin-bg",
        destructive:
          "border-transparent bg-admin-danger-500 dark:bg-admin-danger-600 text-white shadow hover:bg-admin-danger-600 dark:hover:bg-admin-danger-700",
        outline: "border-admin-border dark:border-dark-admin-border text-admin-text-primary dark:text-dark-admin-text-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
