"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/shared/ui/button";
import { Badge } from "@/components/shared/ui/badge";
import { cn } from "@/lib/utils/cn";

interface SectionCta {
  label: string;
  href: string;
  external?: boolean;
  disabled?: boolean;
}

interface SectionShellProps {
  id?: string;
  eyebrow: string;
  title: string;
  description: string;
  visual: ReactNode;
  cta?: SectionCta;
  secondaryCta?: SectionCta;
  badge?: string;
  /** Puts the visual on the left / text on the right at desktop width. */
  reverse?: boolean;
  /** Smaller, single-column, muted treatment for low-priority sections (e.g. Government Jobs). */
  tone?: "default" | "secondary";
}

function CtaButton({ cta, variant }: { cta: SectionCta; variant: "gradient" | "outline" }) {
  if (cta.disabled) {
    return (
      <Button variant={variant} disabled title="Coming soon">
        {cta.label}
        {variant === "gradient" && <ArrowRight className="h-4 w-4" />}
      </Button>
    );
  }
  return (
    <Link href={cta.href} target={cta.external ? "_blank" : undefined} rel={cta.external ? "noreferrer" : undefined}>
      <Button variant={variant}>
        {cta.label}
        {variant === "gradient" && <ArrowRight className="h-4 w-4" />}
      </Button>
    </Link>
  );
}

export function SectionShell({
  id,
  eyebrow,
  title,
  description,
  visual,
  cta,
  secondaryCta,
  badge,
  reverse,
  tone = "default",
}: SectionShellProps) {
  const reduceMotion = useReducedMotion();
  const initial = reduceMotion ? undefined : { opacity: 0, y: 16 };
  const whileInView = reduceMotion ? undefined : { opacity: 1, y: 0 };

  if (tone === "secondary") {
    return (
      <section id={id} className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          initial={initial}
          whileInView={whileInView}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="grid items-center gap-8 rounded-2xl border border-border-subtle bg-bg-secondary/60 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:gap-12"
        >
          <div>
            {badge && (
              <Badge variant="neutral" className="mb-3">
                {badge}
              </Badge>
            )}
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-secondary">{eyebrow}</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-text-primary">{title}</h2>
            <p className="mt-3 max-w-xl text-sm text-text-secondary">{description}</p>
            {cta && (
              <div className="mt-5">
                <CtaButton cta={cta} variant="outline" />
              </div>
            )}
          </div>
          <div className="w-full lg:w-64">{visual}</div>
        </motion.div>
      </section>
    );
  }

  return (
    <section id={id} className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={initial}
          whileInView={whileInView}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className={cn(reverse && "lg:order-2")}
        >
          {badge && (
            <Badge variant="neutral" className="mb-4">
              {badge}
            </Badge>
          )}
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-cyan-light">{eyebrow}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">{title}</h2>
          <p className="mt-4 max-w-lg text-base text-text-secondary">{description}</p>
          {(cta || secondaryCta) && (
            <div className="mt-7 flex flex-wrap gap-3">
              {cta && <CtaButton cta={cta} variant="gradient" />}
              {secondaryCta && <CtaButton cta={secondaryCta} variant="outline" />}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={cn(reverse && "lg:order-1")}
        >
          {visual}
        </motion.div>
      </div>
    </section>
  );
}
