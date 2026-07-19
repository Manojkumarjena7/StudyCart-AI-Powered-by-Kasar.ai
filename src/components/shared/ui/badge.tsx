import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide",
  {
    variants: {
      variant: {
        trending: "bg-brand-cyan/15 text-brand-cyan-light border border-brand-cyan/30",
        success: "bg-success/15 text-success border border-success/30",
        error: "bg-error/15 text-error border border-error/30",
        warning: "bg-warning/15 text-warning border border-warning/30",
        neutral: "bg-white/5 text-text-secondary border border-border-subtle",
      },
    },
    defaultVariants: { variant: "neutral" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
