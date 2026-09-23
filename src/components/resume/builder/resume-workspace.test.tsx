import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createEmptyResumeData, type ResumeData } from "@/lib/resume/types";
import { ResumeWorkspace } from "./resume-workspace";

/**
 * The canonical Resume Workspace — Phase 5d document-editor redesign.
 * Structural/initial-render checks only (no click simulation — see the
 * project's established react-dom/server-only testing approach); actual
 * interaction (tab switching, accordion expand/collapse, template switching,
 * ATS/Improve-click-to-scroll, zoom controls) is covered by the Phase 5d
 * manual browser verification report. See docs/RESUME-ENHANCEMENT.md §Resume
 * Builder — Phase 5d.
 */
const SAMPLE: ResumeData = { ...createEmptyResumeData(), personalInfo: { fullName: "Riley Chen", links: [] } };

function render(props: Partial<Parameters<typeof ResumeWorkspace>[0]> = {}) {
  return renderToStaticMarkup(
    <ResumeWorkspace
      resumeData={SAMPLE}
      onChange={() => {}}
      uncertainFields={[]}
      templateId="template-01"
      onChangeTemplateId={() => {}}
      {...props}
    />
  );
}

describe("ResumeWorkspace — tabs (Edit / Design / ATS / Improve, + Preview on mobile)", () => {
  const html = render();

  it("renders all five tab labels", () => {
    for (const label of ["Edit", "Design", "ATS", "Improve", "Preview"]) {
      expect(html).toContain(`>${label}<`);
    }
  });

  it("renders Download PDF in the top bar — no separate template-choice step", () => {
    expect(html).toContain("Download PDF");
    expect(html).not.toContain("Choose a template");
  });

  it("defaults to the Edit tab: the left pane has no `hidden` class", () => {
    expect(html).toContain('class="lg:block min-h-0 overflow-y-auto pr-1"');
  });

  it("defaults to the Edit tab: the preview pane starts with a `hidden` class (shown unconditionally only at lg:)", () => {
    expect(html).toMatch(/class="hidden lg:block min-h-0 overflow-hidden"/);
  });
});

describe("ResumeWorkspace — Edit tab is a document-editor accordion, not a long form", () => {
  const html = render();

  it("Personal Info is expanded by default and shows the extracted name in an editable field", () => {
    expect(html).toMatch(/<input[^>]*value="Riley Chen"/);
  });

  it("other sections start collapsed, showing a compact summary instead of their full fields", () => {
    // Experience is not the active section by default, so its full field
    // inputs (e.g. a "Role / Job title" placeholder) should not be present —
    // only its collapsed empty-state summary text.
    expect(html).toContain("No work experience yet.");
    expect(html).not.toContain("Role / Job title");
  });
});

describe("ResumeWorkspace — live preview", () => {
  it("renders the same ResumeData in the live preview pane", () => {
    const html = render();
    expect(html).toContain("Riley Chen");
  });
});

describe("ResumeWorkspace — uncertain fields", () => {
  it("shows a notice when fields need review", () => {
    const html = render({ uncertainFields: ["summary", "experience"] });
    expect(html).toContain("Please check");
  });

  it("shows no notice when everything was extracted confidently", () => {
    const html = render({ uncertainFields: [] });
    expect(html).not.toContain("we weren&#x27;t fully confident");
  });
});
