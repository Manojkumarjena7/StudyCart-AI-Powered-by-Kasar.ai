import * as React from "react";
import { cn } from "@/lib/utils/cn";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "focus-ring flex w-full rounded-lg border border-border-subtle bg-bg-secondary px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/70 transition-colors focus-visible:border-brand-cyan-light/60",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
