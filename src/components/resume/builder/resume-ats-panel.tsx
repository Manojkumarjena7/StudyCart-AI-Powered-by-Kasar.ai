"use client";

import { useMemo } from "react";
import { Check, TriangleAlert, X } from "lucide-react";
import type { ResumeData } from "@/lib/resume/types";
import { getAtsChecklist, type AtsCheckStatus } from "@/lib/resume/ats-checklist";
import { cn } from "@/lib/utils/cn";

interface ResumeAtsPanelProps {
  resumeData: ResumeData;
  /** Optional — when provided, a check that isn't passing becomes clickable and
   * calls this with the check's id (e.g. "summary"), so the caller can jump the
   * user to that section of the editor. Omitted entirely on the standalone
   * Analyze results screen (resume-analysis-step.tsx), where there's no editor
   * next to it to jump to. */
  onSelectCheck?: (checkId: string) => void;
}

const STATUS_ICON_STYLES: Record<AtsCheckStatus, { icon: typeof Check; iconClass: string }> = {
  pass: { icon: Check, iconClass: "text-success" },
  warning: { icon: TriangleAlert, iconClass: "text-warning" },
  fail: { icon: X, iconClass: "text-error" },
};

/**
 * ATS Readiness panel — Phase 3, extended in Phase 5b with an optional
 * click-to-jump-to-section affordance, restyled in Phase 5c (a plain divided
 * list with color-coded icons, not ten separately bordered/tinted boxes — see
 * docs/RESUME-ENHANCEMENT.md §Resume Builder — Phase 5c "visual quality").
 * Still no numeric score — see that doc's §NO ATS SCORE; no approved scoring
 * model exists. Recomputes `getAtsChecklist(resumeData)` on every render, so
 * it's always derived from the exact same ResumeData object the editor and
 * template preview use — no separate copy, no refresh needed to see a change.
 */
export function ResumeAtsPanel({ resumeData, onSelectCheck }: ResumeAtsPanelProps) {
  const { checks } = useMemo(() => getAtsChecklist(resumeData), [resumeData]);

  return (
    <section className="rounded-2xl border border-border-subtle bg-bg-card p-4 sm:p-5">
      <h2 className="text-sm font-semibold text-text-primary">ATS Readiness</h2>
      <p className="mt-1 text-xs text-text-secondary">Review these checks before downloading your resume.</p>

      <ul className="mt-3">
        {checks.map((check) => {
          const { icon: Icon, iconClass } = STATUS_ICON_STYLES[check.status];
          const clickable = check.status !== "pass" && Boolean(onSelectCheck);
          const content = (
            <>
              <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", iconClass)} aria-hidden />
              <div>
                <p className="text-xs font-semibold text-text-primary">{check.title}</p>
                <p className="mt-0.5 text-xs text-text-secondary">{check.message}</p>
              </div>
            </>
          );

          if (clickable) {
            return (
              <li key={check.id} className="border-b border-border-subtle/60 last:border-b-0">
                <button
                  type="button"
                  onClick={() => onSelectCheck?.(check.id)}
                  className="focus-ring flex w-full items-start gap-2.5 rounded-md px-1.5 py-2.5 text-left transition-colors hover:bg-overlay-soft"
                >
                  {content}
                </button>
              </li>
            );
          }

          return (
            <li key={check.id} className="flex items-start gap-2.5 border-b border-border-subtle/60 px-1.5 py-2.5 last:border-b-0">
              {content}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
