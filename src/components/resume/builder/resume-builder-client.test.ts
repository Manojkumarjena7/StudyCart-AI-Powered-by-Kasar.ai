import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { resolvePostUploadStep } from "./resume-builder-client";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Phase 5c editor consolidation: every entry mode now lands on the same
 * canonical ResumeWorkspace (see resume-workspace.tsx) — only "analyze" has an
 * intermediate stop. `resolvePostUploadStep` is a pure function extracted
 * specifically so this is testable without simulating a real file upload /
 * Server Action round trip (which needs a real browser — see the Phase 5c
 * manual verification report in docs/RESUME-ENHANCEMENT.md §Resume Builder —
 * Phase 5c).
 */
describe("resolvePostUploadStep", () => {
  it("analyze mode goes to the analysis (ATS results) step", () => {
    expect(resolvePostUploadStep("analyze")).toBe("analysis");
  });

  it("enhance mode goes straight to the canonical workspace", () => {
    expect(resolvePostUploadStep("enhance")).toBe("workspace");
  });

  it("no mode (direct/bookmarked visit) also goes straight to the canonical workspace — no separate review step anymore", () => {
    expect(resolvePostUploadStep(null)).toBe("workspace");
  });
});

describe("resume-builder-client — analysis -> improve keeps the same ResumeData (no re-upload)", () => {
  const source = readFileSync(path.join(dirname, "resume-builder-client.tsx"), "utf-8");

  it("handleImproveFromAnalysis never resets or re-fetches resume data", () => {
    const match = source.match(/function handleImproveFromAnalysis\(\)\s*\{[^}]*\}/);
    expect(match).not.toBeNull();
    const body = match![0];
    expect(body).not.toMatch(/setResumeData|setUncertainFields|createEmptyResumeData|extractResumeFromUpload/);
  });

  it("ResumeAnalysisStep and ResumeWorkspace are both given the same resumeData state variable", () => {
    const analysisPropsMatch = source.match(/<ResumeAnalysisStep\s+([^/]*)\/>/);
    const workspacePropsMatch = source.match(/<ResumeWorkspace\s+([^/]*)\/>/);
    expect(analysisPropsMatch).not.toBeNull();
    expect(workspacePropsMatch).not.toBeNull();
    expect(analysisPropsMatch![1]).toMatch(/resumeData=\{resumeData\}/);
    expect(workspacePropsMatch![1]).toMatch(/resumeData=\{resumeData\}/);
  });

  it("there is exactly one place this component renders an editor/workspace (no second editor step)", () => {
    // Phases 1–5b had ResumeReviewEditor + TemplatePickerStep as separate
    // steps; both were retired in Phase 5c. Guard against either reappearing.
    expect(source).not.toContain("ResumeReviewEditor");
    expect(source).not.toContain("TemplatePickerStep");
    expect(source).not.toContain("ResumeBuildStep");
  });
});
