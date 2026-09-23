import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createEmptyResumeData, type ResumeData } from "@/lib/resume/types";
import { ResumeEditorPanel, EDITOR_SECTION_IDS, type EditorSectionKey } from "./resume-editor-panel";

/**
 * Phase 5d document-editor accordion: exactly one section's full fields are
 * shown at a time (controlled via `activeSection`); the rest collapse to a
 * compact one-line summary. `activeSection` is a controlled prop specifically
 * so resume-workspace.tsx can expand a section from outside (ATS/Improve
 * suggestion clicks) — these tests exercise that contract directly by passing
 * different `activeSection` values, standing in for the click that would
 * change it in a real browser. See docs/RESUME-ENHANCEMENT.md §Resume Builder
 * — Phase 5d.
 */
const SAMPLE: ResumeData = {
  ...createEmptyResumeData(),
  personalInfo: { fullName: "Jordan Lee", email: "jordan@example.com", links: [] },
  summary: "An experienced engineer.",
  experience: [{ id: "e1", role: "QA Engineer", company: "Acme Corp", bullets: [] }],
};

function render(activeSection: EditorSectionKey | null) {
  return renderToStaticMarkup(
    <ResumeEditorPanel
      resumeData={SAMPLE}
      onChange={() => {}}
      uncertainFields={[]}
      activeSection={activeSection}
      onActiveSectionChange={() => {}}
    />
  );
}

describe("ResumeEditorPanel — accordion", () => {
  it("all eight section ids are present for scroll targeting regardless of which is active", () => {
    const html = render("contact");
    for (const id of Object.values(EDITOR_SECTION_IDS)) {
      expect(html).toContain(`id="${id}"`);
    }
  });

  it("when 'contact' is active, its full fields render and other sections show a collapsed summary", () => {
    const html = render("contact");
    expect(html).toMatch(/<input[^>]*value="Jordan Lee"/);
    // Experience is collapsed: its compact summary line shows, not the full
    // "Role / Job title" input placeholder.
    expect(html).toContain("QA Engineer, Acme Corp");
    expect(html).not.toContain("Role / Job title");
  });

  it("when 'experience' is active, its full fields render instead of the summary", () => {
    const html = render("experience");
    expect(html).toContain("Role / Job title");
    // Contact is now collapsed — its input fields are gone, replaced by a
    // one-line summary of name/email.
    expect(html).not.toMatch(/<input[^>]*value="Jordan Lee"/);
    expect(html).toContain("Jordan Lee · jordan@example.com");
  });

  it("when nothing is active (activeSection: null), every section is collapsed", () => {
    const html = render(null);
    expect(html).not.toMatch(/<input[^>]*value="Jordan Lee"/);
    expect(html).not.toContain("Role / Job title");
    expect(html).toContain("Jordan Lee · jordan@example.com");
    expect(html).toContain("QA Engineer, Acme Corp");
  });
});
