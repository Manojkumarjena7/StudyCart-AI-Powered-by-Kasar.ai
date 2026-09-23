"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/shared/ui/button";
import type { ResumeData } from "@/lib/resume/types";
import { ResumeAtsPanel } from "./resume-ats-panel";

interface ResumeAnalysisStepProps {
  resumeData: ResumeData;
  onBack: () => void;
  onImprove: () => void;
}

/**
 * The "Analyze My Resume" entry mode's first stop after upload: the same
 * ResumeAtsPanel used inside the Build step, reused as-is (no second ATS
 * implementation), shown on its own with one clear next action. Clicking
 * "Improve Your Resume" reuses the exact same ResumeData already in state — no
 * re-upload, no re-parsing. See resume-builder-client.tsx and
 * docs/RESUME-ENHANCEMENT.md §Resume Builder — Phase 5a.
 */
export function ResumeAnalysisStep({ resumeData, onBack, onImprove }: ResumeAnalysisStepProps) {
  return (
    <div className="mx-auto max-w-2xl">
      <button
        type="button"
        onClick={onBack}
        className="focus-ring flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-text-secondary transition-colors hover:text-brand-cyan-light"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Upload a different file
      </button>

      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-text-primary">
        Here&apos;s how your resume reads today
      </h1>
      <p className="mt-2 text-sm text-text-secondary">
        We checked it against the same ATS Readiness checklist used throughout the
        builder — a plain checklist, not a score.
      </p>

      <div className="mt-6">
        <ResumeAtsPanel resumeData={resumeData} />
      </div>

      <div className="mt-8 flex flex-col items-center gap-2 border-t border-border-subtle pt-6 text-center">
        <p className="max-w-md text-xs text-text-secondary">
          Ready to fix what&apos;s flagged above? Keep this exact resume — nothing
          to re-upload.
        </p>
        <Button type="button" variant="gradient" onClick={onImprove}>
          Improve Your Resume
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
