"use client";

import { FileText, AlertTriangle, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const ISSUES = [
  "Missing measurable impact in experience bullets",
  "Weak action verbs in the summary",
  "Formatting may not parse cleanly in ATS systems",
];

/** Illustrative resume-analysis panel — see docs/DESIGN-SYSTEM.md §Assets. */
export function ResumeAnalysisMockup() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="grid w-full gap-4 sm:grid-cols-[minmax(0,180px)_1fr]">
      <div className="relative overflow-hidden rounded-2xl border border-border-subtle bg-bg-card p-4 shadow-card">
        <FileText className="h-6 w-6 text-text-secondary" />
        <div className="mt-4 space-y-2">
          {[100, 85, 92, 70, 88, 60].map((w, i) => (
            <div key={i} className="h-1.5 rounded-full bg-overlay-soft" style={{ width: `${w}%` }} />
          ))}
        </div>
        {!reduceMotion && (
          <motion.div
            className="pointer-events-none absolute inset-x-0 h-10 bg-gradient-to-b from-brand-cyan/0 via-brand-cyan/15 to-brand-cyan/0"
            animate={{ top: ["0%", "95%", "0%"] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
          />
        )}
      </div>

      <div className="rounded-2xl border border-border-subtle bg-bg-card p-4 shadow-card">
        <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">Detected issues</p>
        <ul className="mt-3 space-y-2">
          {ISSUES.map((issue) => (
            <li
              key={issue}
              className="flex items-start gap-2 rounded-lg border border-warning/25 bg-warning/10 px-3 py-2 text-xs text-text-primary"
            >
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" />
              {issue}
            </li>
          ))}
        </ul>
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-brand-cyan/25 bg-brand-cyan/10 px-3 py-2 text-xs text-brand-cyan-light">
          <Sparkles className="h-3.5 w-3.5 shrink-0" />
          3 suggestions ready based on our reference library
        </div>
      </div>
    </div>
  );
}
