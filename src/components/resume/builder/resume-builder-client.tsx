"use client";

import { useState, useTransition } from "react";
import { createEmptyResumeData, type ResumeData } from "@/lib/resume/types";
import { extractResumeFromUpload } from "@/lib/resume/resume-actions";
import type { ResumeTemplateId } from "@/components/resume/templates/registry";
import { ResumeUploadStep } from "@/components/resume/builder/resume-upload-step";
import { ResumeAnalysisStep } from "@/components/resume/builder/resume-analysis-step";
import { ResumeWorkspace } from "@/components/resume/builder/resume-workspace";

type BuilderStep = "upload" | "analysis" | "workspace";

/** How the user entered the builder, from the /resume product home's entry
 * actions (see src/app/resume/build/page.tsx and
 * resume-builder-entry-section.tsx). `null` covers any direct/bookmarked visit
 * to /resume/build with no mode. See docs/RESUME-ENHANCEMENT.md §Resume
 * Builder — Phase 5c. */
export type ResumeBuilderEntryMode = "analyze" | "enhance" | "create" | null;

/** Template 01 is the only shipped template (see templates/registry.tsx), so
 * every path defaults to it — the user can still change it from the
 * workspace's Design tab at any time. There is no longer a separate
 * "choose a template" step to route to first. */
const DEFAULT_TEMPLATE_ID: ResumeTemplateId = "template-01";

/** Pure routing decision for what happens right after a successful upload —
 * extracted so it's unit-testable without needing to simulate a real file
 * upload/Server Action round trip. See resume-builder-client.test.ts. Only
 * "analyze" gets an intermediate stop (the ATS results screen); every other
 * path — "enhance", "create", and no mode — goes straight to the one canonical
 * workspace, consistent with there being exactly one editor now. */
export function resolvePostUploadStep(mode: ResumeBuilderEntryMode): "analysis" | "workspace" {
  return mode === "analyze" ? "analysis" : "workspace";
}

interface ResumeBuilderClientProps {
  initialMode?: ResumeBuilderEntryMode;
}

/**
 * Owns the Resume Builder flow. Every entry mode shares the exact same state
 * and lands on the exact same canonical ResumeWorkspace — see
 * docs/RESUME-ENHANCEMENT.md §Resume Builder — Phase 5c:
 *
 * - "analyze": upload -> ATS Readiness results (resume-analysis-step.tsx) -> one
 *   "Improve Your Resume" click -> the workspace, with the SAME ResumeData
 *   already reflected in the SAME ATS panel component.
 * - "enhance" / "create" / no mode: straight to the workspace (upload first for
 *   "enhance"/no-mode; immediately, with a blank ResumeData, for "create").
 *
 * There is exactly one ResumeData state, one editor (ResumeEditorPanel, via
 * ResumeWorkspace), and one getAtsChecklist() call site (inside
 * resume-ats-panel.tsx) — no second upload, no duplicated parsing, no second
 * editor, no second ATS implementation. Phases 1–5b had a separate standalone
 * "review" editor and a separate "choose a template" step for the no-mode
 * path; both were retired this phase in favor of always landing here.
 */
export function ResumeBuilderClient({ initialMode = null }: ResumeBuilderClientProps) {
  const [step, setStep] = useState<BuilderStep>(initialMode === "create" ? "workspace" : "upload");
  const [mode] = useState<ResumeBuilderEntryMode>(initialMode);
  const [resumeData, setResumeData] = useState<ResumeData>(createEmptyResumeData());
  const [uncertainFields, setUncertainFields] = useState<string[]>([]);
  const [templateId, setTemplateId] = useState<ResumeTemplateId>(DEFAULT_TEMPLATE_ID);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleUpload(file: File) {
    setError(null);
    startTransition(async () => {
      const result = await extractResumeFromUpload(file);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      const { extraction } = result;
      setResumeData({ ...createEmptyResumeData(), ...extraction.data });
      setUncertainFields(extraction.uncertainFields);
      setStep(resolvePostUploadStep(mode));
    });
  }

  function handleStartFromScratch() {
    setError(null);
    setResumeData(createEmptyResumeData());
    setUncertainFields([]);
    setStep("workspace");
  }

  function handleBackToUpload() {
    setStep("upload");
    setError(null);
  }

  function handleImproveFromAnalysis() {
    setStep("workspace");
  }

  // The workspace owns its own internal scroll containers (editor pane,
  // preview pane) and needs to fill the fixed-height shell exactly — see
  // page.tsx's h-screen fix. Upload/analysis are short, simple screens that
  // scroll normally, so they get their own single top-level scroll container
  // with the usual page padding instead.
  if (step === "workspace") {
    return (
      <ResumeWorkspace
        resumeData={resumeData}
        onChange={setResumeData}
        uncertainFields={uncertainFields}
        templateId={templateId}
        onChangeTemplateId={setTemplateId}
      />
    );
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {step === "analysis" ? (
          <ResumeAnalysisStep
            resumeData={resumeData}
            onBack={handleBackToUpload}
            onImprove={handleImproveFromAnalysis}
          />
        ) : (
          <ResumeUploadStep
            isPending={isPending}
            error={error}
            onUpload={handleUpload}
            onStartFromScratch={handleStartFromScratch}
          />
        )}
      </div>
    </div>
  );
}
