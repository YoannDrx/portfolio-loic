import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-admin-border dark:border-dark-admin-border bg-white dark:bg-dark-admin-bg-tertiary px-3 py-1 text-base text-gray-900 dark:text-dark-admin-text-primary shadow-sm transition-colors duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground dark:file:text-dark-admin-text-primary placeholder:text-admin-text-tertiary dark:placeholder:text-dark-admin-text-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-primary-500 dark:focus-visible:ring-admin-primary-600 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
