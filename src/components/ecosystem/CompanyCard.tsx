"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { kasarTechCompany } from "@/config/ecosystem/products";

export function CompanyCard({ index }: { index: number }) {
  const company = kasarTechCompany;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="eco-card eco-glass flex h-full flex-col overflow-hidden rounded-2xl border p-5"
    >
      <div className="mb-4">
        <span className="eco-text-secondary inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-semibold">
          COMPANY
        </span>
      </div>

      <div className="mb-4 flex items-start gap-3">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
          style={{ background: `linear-gradient(135deg, ${company.accentFrom}, ${company.accentTo})` }}
        >
          <company.icon className="h-5 w-5 text-white" />
        </span>
        <div>
          <h3 className="text-base font-semibold" style={{ color: "var(--eco-text-primary)" }}>
            {company.name}
          </h3>
          <p className="eco-text-secondary text-xs">{company.tagline}</p>
        </div>
      </div>

      <p className="eco-text-secondary mb-4 text-sm leading-relaxed">{company.description}</p>

      <div
        className="mb-5 flex flex-1 flex-col justify-center rounded-xl border p-5"
        style={{
          borderColor: "var(--eco-border)",
          background: `linear-gradient(135deg, ${company.accentFrom}18, transparent)`,
        }}
      >
        <p className="text-lg font-semibold leading-snug" style={{ color: "var(--eco-text-primary)" }}>
          Building the Future with Technology
        </p>
        <p className="eco-text-secondary mt-1 text-xs">
          We build the software behind every product in this ecosystem.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {company.pillars.map((pillar) => (
            <div key={pillar.label} className="flex items-center gap-1.5">
              <pillar.icon className="h-3.5 w-3.5 text-brand-cyan-light" />
              <span className="eco-text-secondary text-[11px]">{pillar.label}</span>
            </div>
          ))}
        </div>
      </div>

      <Link
        href={company.learnMoreUrl}
        className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
        style={{ background: `linear-gradient(135deg, ${company.accentFrom}, ${company.accentTo})` }}
      >
        Visit {company.name}
        <ArrowUpRight className="h-4 w-4" />
      </Link>
    </motion.article>
  );
}
