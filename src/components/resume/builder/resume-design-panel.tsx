"use client";

import { Check } from "lucide-react";
import { Badge } from "@/components/shared/ui/badge";
import { cn } from "@/lib/utils/cn";
import { RESUME_TEMPLATES, type ResumeTemplateId } from "@/components/resume/templates/registry";

interface ResumeDesignPanelProps {
  templateId: ResumeTemplateId;
  onChange: (id: ResumeTemplateId) => void;
}

/**
 * The Design tab — Phase 5d. A professional document-design control area, not
 * a template marketplace grid: a plain vertical list (name + status), reusing
 * the exact same `RESUME_TEMPLATES` registry as everywhere else in the builder
 * (no rewrite, no second list). Template 01 is selectable; 02/03 show as
 * disabled "Coming soon" rows. Selecting a template only calls `onChange` —
 * it never navigates away from the workspace or touches ResumeData. See
 * docs/RESUME-ENHANCEMENT.md §Resume Builder — Phase 5d.
 */
export function ResumeDesignPanel({ templateId, onChange }: ResumeDesignPanelProps) {
  return (
    <div className="rounded-2xl border border-border-subtle bg-bg-card p-4 sm:p-5">
      <h2 className="text-sm font-semibold text-text-primary">Design</h2>
      <p className="mt-1 text-xs text-text-secondary">Choose the template used for your live preview and PDF.</p>

      <ul className="mt-3">
        {RESUME_TEMPLATES.map((template) => {
          const isAvailable = template.status === "available";
          const isSelected = template.id === templateId;
          return (
            <li key={template.id} className="border-b border-border-subtle/60 last:border-b-0">
              <button
                type="button"
                disabled={!isAvailable}
                onClick={() => isAvailable && onChange(template.id)}
                className={cn(
                  "flex w-full items-center justify-between gap-3 py-3 text-left transition-colors",
                  isAvailable ? "hover:bg-overlay-soft" : "cursor-not-allowed opacity-60"
                )}
              >
                <div>
                  <p className="text-sm font-medium text-text-primary">{template.name}</p>
                  <p className="mt-0.5 text-xs text-text-secondary">{template.description}</p>
                </div>
                {isSelected ? (
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                ) : !isAvailable ? (
                  <Badge variant="neutral" className="shrink-0 px-2 py-0.5 text-[10px]">
                    Coming soon
                  </Badge>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
