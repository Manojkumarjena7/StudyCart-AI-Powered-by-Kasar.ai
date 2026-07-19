import * as React from "react";
import { cn } from "@/lib/utils/cn";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "focus-ring flex h-11 w-full rounded-lg border border-border-subtle bg-bg-secondary px-4 text-sm text-text-primary placeholder:text-text-secondary/70 transition-colors focus-visible:border-brand-cyan-light/60",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
