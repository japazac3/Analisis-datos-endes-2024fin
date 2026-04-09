import * as React from "react"

import { cn } from "../../lib/utils"

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "secondary" | "outline" | "destructive"
}

const badgeVariants = {
  secondary: "bg-zinc-100 text-zinc-700",
  outline: "border border-zinc-200 text-zinc-700",
  destructive: "bg-red-600 text-white",
}

function Badge({ className, variant = "secondary", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
