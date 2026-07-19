import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  "focus-ring inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-blue text-text-primary hover:bg-blue-600 shadow-[0_0_0_1px_rgba(37,99,235,0.4)]",
        gradient:
          "bg-gradient-to-r from-brand-blue to-brand-cyan text-white hover:opacity-90",
        secondary:
          "bg-bg-card text-text-primary border border-border-subtle hover:border-brand-cyan/50",
        ghost: "text-text-secondary hover:text-text-primary hover:bg-white/5",
        outline:
          "border border-border-subtle text-text-primary hover:border-brand-cyan-light/60 hover:text-brand-cyan-light",
      },
      size: {
        sm: "h-9 px-3.5 text-xs",
        md: "h-11 px-5",
        lg: "h-13 px-7 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
);
Button.displayName = "Button";
