"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="eco-glass relative overflow-hidden rounded-2xl border p-8 text-center sm:p-12"
          style={{ borderColor: "var(--eco-border-strong)" }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{ background: "radial-gradient(60% 80% at 50% 0%, var(--eco-glow-1), transparent 70%)" }}
          />
          <h2 className="text-2xl font-semibold sm:text-3xl" style={{ color: "var(--eco-text-primary)" }}>
            Ready to get started?
          </h2>
          <p className="eco-text-secondary mx-auto mt-2 max-w-md text-sm">
            Try StudyCart today — the first live product in the KasarTech ecosystem.
          </p>
          <Link
            href="/analyzer"
            className="mt-6 inline-flex h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-brand-blue to-brand-cyan-light px-7 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(37,99,235,0.35)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Analyze My Result
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
