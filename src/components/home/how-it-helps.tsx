"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { platformPillars, type ServiceStatus } from "@/config/platform";
import { PillarIcon } from "@/components/shared/pillar-icon";
import { Badge } from "@/components/shared/ui/badge";

const FLOW_DOMAINS = ["resume", "library", "jobs"] as const;

const STATUS_LABEL: Record<ServiceStatus, string> = {
  LIVE: "Live",
  IN_PROGRESS: "In progress",
  COMING_SOON: "Coming soon",
  PLANNED: "Coming soon",
  PROPOSED: "Planned",
};

export function HowItHelps() {
  const reduceMotion = useReducedMotion();
  const flows = FLOW_DOMAINS.map((domain) => platformPillars.find((p) => p.domain === domain)).filter(
    (p): p is NonNullable<typeof p> => Boolean(p)
  );

  return (
    <section id="how-it-helps" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-cyan-light">
          How StudyCart Helps
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          Three ways to move your career forward
        </h2>
      </div>

      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {flows.map((flow, i) => (
          <motion.div
            key={flow.id}
            initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <Link
              href={flow.href}
              className="focus-ring group flex h-full flex-col rounded-2xl border border-border-subtle bg-bg-card p-6 shadow-card transition-colors hover:border-brand-cyan/40"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-blue/15 to-brand-cyan-light/15">
                  <PillarIcon name={flow.icon} className="h-5 w-5 text-brand-cyan-light" />
                </span>
                <Badge variant="neutral">{STATUS_LABEL[flow.status]}</Badge>
              </div>
              <h3 className="mt-5 text-lg font-semibold text-text-primary">{flow.title}</h3>
              <p className="mt-2 flex-1 text-sm text-text-secondary">{flow.description}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-brand-cyan-light">
                {flow.navLabel}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
