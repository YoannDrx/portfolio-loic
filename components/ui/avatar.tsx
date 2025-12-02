"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/* ============================================
   AVATAR VARIANTS
   ============================================ */

const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full",
  {
    variants: {
      size: {
        xs: "h-6 w-6",
        sm: "h-8 w-8",
        default: "h-10 w-10",
        lg: "h-12 w-12",
        xl: "h-16 w-16",
        "2xl": "h-20 w-20",
      },
      ring: {
        none: "",
        default: "ring-2 ring-border ring-offset-2 ring-offset-background",
        primary: "ring-2 ring-primary ring-offset-2 ring-offset-background",
      },
    },
    defaultVariants: {
      size: "default",
      ring: "none",
    },
  }
)

const avatarFallbackVariants = cva(
  "flex h-full w-full items-center justify-center rounded-full bg-surface font-medium",
  {
    variants: {
      size: {
        xs: "text-[10px]",
        sm: "text-xs",
        default: "text-sm",
        lg: "text-base",
        xl: "text-lg",
        "2xl": "text-xl",
      },
      variant: {
        default: "bg-surface text-muted-foreground",
        primary: "bg-primary/10 text-primary",
        muted: "bg-muted text-muted-foreground",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
)

/* ============================================
   AVATAR COMPONENTS
   ============================================ */

interface AvatarProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarVariants> {}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, size, ring, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(avatarVariants({ size, ring }), className)}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full object-cover", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

interface AvatarFallbackProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>,
    VariantProps<typeof avatarFallbackVariants> {}

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  AvatarFallbackProps
>(({ className, size, variant, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(avatarFallbackVariants({ size, variant }), className)}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

/* ============================================
   AVATAR WITH STATUS
   ============================================ */

interface AvatarWithStatusProps extends AvatarProps {
  src?: string
  alt?: string
  fallback: string
  status?: "online" | "offline" | "away" | "busy"
}

const AvatarWithStatus = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarWithStatusProps
>(({ src, alt, fallback, status, size, className, ...props }, ref) => {
  const statusColors = {
    online: "bg-success",
    offline: "bg-neutral-500",
    away: "bg-warning",
    busy: "bg-error",
  }

  const statusSizes = {
    xs: "h-1.5 w-1.5",
    sm: "h-2 w-2",
    default: "h-2.5 w-2.5",
    lg: "h-3 w-3",
    xl: "h-3.5 w-3.5",
    "2xl": "h-4 w-4",
  }

  return (
    <div className="relative inline-block">
      <Avatar ref={ref} size={size} className={className} {...props}>
        {src && <AvatarImage src={src} alt={alt} />}
        <AvatarFallback size={size}>{fallback}</AvatarFallback>
      </Avatar>
      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full ring-2 ring-background",
            statusColors[status],
            statusSizes[size || "default"]
          )}
        />
      )}
    </div>
  )
})
AvatarWithStatus.displayName = "AvatarWithStatus"

/* ============================================
   AVATAR GROUP
   ============================================ */

interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  max?: number
  size?: AvatarProps["size"]
}

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ children, max = 4, size = "default", className, ...props }, ref) => {
    const childrenArray = React.Children.toArray(children)
    const visibleAvatars = childrenArray.slice(0, max)
    const remainingCount = childrenArray.length - max

    return (
      <div
        ref={ref}
        className={cn("flex -space-x-2", className)}
        {...props}
      >
        {visibleAvatars.map((child, index) => (
          <div key={index} className="relative" style={{ zIndex: visibleAvatars.length - index }}>
            {React.isValidElement(child)
              ? React.cloneElement(child as React.ReactElement<AvatarProps>, { size, ring: "default" })
              : child}
          </div>
        ))}
        {remainingCount > 0 && (
          <Avatar size={size} ring="default" className="relative" style={{ zIndex: 0 }}>
            <AvatarFallback size={size} variant="muted">
              +{remainingCount}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    )
  }
)
AvatarGroup.displayName = "AvatarGroup"

export { Avatar, AvatarImage, AvatarFallback, AvatarWithStatus, AvatarGroup }
