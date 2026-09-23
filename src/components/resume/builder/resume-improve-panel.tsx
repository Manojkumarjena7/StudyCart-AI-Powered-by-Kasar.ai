"use client";

import { useMemo } from "react";
import { Sparkles, TriangleAlert, X } from "lucide-react";
import type { ResumeData } from "@/lib/resume/types";
import { getAtsChecklist, type AtsCheckStatus } from "@/lib/resume/ats-checklist";
import { cn } from "@/lib/utils/cn";

interface ResumeImprovePanelProps {
  resumeData: ResumeData;
  onSelectCheck: (checkId: string) => void;
}

const STATUS_ICON_STYLES: Record<Exclude<AtsCheckStatus, "pass">, { icon: typeof X; iconClass: string }> = {
  warning: { icon: TriangleAlert, iconClass: "text-warning" },
  fail: { icon: X, iconClass: "text-error" },
};

/**
 * The Improve tab — Phase 5d. Reuses the exact same deterministic
 * `getAtsChecklist()` the ATS tab uses (no second engine, no AI, nothing
 * fabricated — see docs/RESUME-ENHANCEMENT.md §NO ATS SCORE), filtered down to
 * only the checks that aren't already passing, framed as actionable
 * suggestions rather than a full readiness report. Clicking one expands and
 * scrolls to the relevant editor section, same as the ATS tab.
 *
 * This is intentionally *not* a place for AI-generated rewrites, bullet
 * improvement, or JD matching — none of that exists yet, and this panel never
 * claims otherwise. It's the natural home for those features once they're
 * actually built.
 */
export function ResumeImprovePanel({ resumeData, onSelectCheck }: ResumeImprovePanelProps) {
  const suggestions = useMemo(() => getAtsChecklist(resumeData).checks.filter((c) => c.status !== "pass"), [resumeData]);

  return (
    <div className="rounded-2xl border border-border-subtle bg-bg-card p-4 sm:p-5">
      <h2 className="text-sm font-semibold text-text-primary">Improve</h2>
      <p className="mt-1 text-xs text-text-secondary">
        Actionable suggestions from your ATS Readiness checklist — click one to jump to that section.
      </p>

      {suggestions.length === 0 ? (
        <div className="mt-4 flex items-start gap-2.5 rounded-lg bg-success/5 px-3 py-3 text-xs text-text-secondary">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-success" />
          Nothing to suggest right now — every ATS check is passing.
        </div>
      ) : (
        <ul className="mt-3">
          {suggestions.map((check) => {
            const { icon: Icon, iconClass } = STATUS_ICON_STYLES[check.status as Exclude<AtsCheckStatus, "pass">];
            return (
              <li key={check.id} className="border-b border-border-subtle/60 last:border-b-0">
                <button
                  type="button"
                  onClick={() => onSelectCheck(check.id)}
                  className="focus-ring flex w-full items-start gap-2.5 rounded-md px-1.5 py-2.5 text-left transition-colors hover:bg-overlay-soft"
                >
                  <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", iconClass)} aria-hidden />
                  <div>
                    <p className="text-xs font-semibold text-text-primary">{check.title}</p>
                    <p className="mt-0.5 text-xs text-text-secondary">{check.message}</p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
