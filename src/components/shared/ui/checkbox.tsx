import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">;

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, ...props }, ref) => (
    <span className="relative inline-flex h-5 w-5 shrink-0 items-center justify-center">
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        className={cn(
          "focus-ring peer h-5 w-5 shrink-0 cursor-pointer appearance-none rounded-md border border-border-subtle bg-bg-secondary transition-colors checked:border-brand-cyan checked:bg-brand-cyan",
          className
        )}
        {...props}
      />
      <Check className="pointer-events-none absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100" />
    </span>
  )
);
Checkbox.displayName = "Checkbox";
