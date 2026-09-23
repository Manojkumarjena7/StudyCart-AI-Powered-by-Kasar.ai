import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createEmptyResumeData, type ResumeData } from "@/lib/resume/types";
import { ResumeAtsPanel } from "./resume-ats-panel";

/**
 * Phase 5b addition: an optional click-to-jump-to-section affordance on top of
 * the unchanged Phase 3 ATS checklist (see docs/RESUME-ENHANCEMENT.md §Resume
 * Builder — Phase 5b). Still no numeric score anywhere.
 */
const PARTIALLY_COMPLETE: ResumeData = {
  ...createEmptyResumeData(),
  personalInfo: { fullName: "Jordan Lee", email: "jordan@example.com", links: [] },
  experience: [{ id: "e1", role: "Engineer", company: "Acme", bullets: ["Shipped a feature"] }],
  education: [{ id: "ed1", institution: "State University", degree: "B.Sc." }],
  skills: [{ id: "s1", items: ["TypeScript"] }],
};

describe("ResumeAtsPanel", () => {
  it("never renders a numeric score", () => {
    const html = renderToStaticMarkup(<ResumeAtsPanel resumeData={PARTIALLY_COMPLETE} />);
    expect(html).not.toMatch(/\d+%/);
  });

  it("without onSelectCheck, renders plain non-interactive list items", () => {
    const html = renderToStaticMarkup(<ResumeAtsPanel resumeData={PARTIALLY_COMPLETE} />);
    expect(html).not.toContain("<button");
  });

  it("with onSelectCheck, a non-passing check becomes a clickable button", () => {
    const html = renderToStaticMarkup(<ResumeAtsPanel resumeData={PARTIALLY_COMPLETE} onSelectCheck={() => {}} />);
    expect(html).toContain("<button");
    // Summary is empty in PARTIALLY_COMPLETE, so it should fail/warn and be clickable.
    expect(html).toMatch(/<button[^]*?Professional summary/);
  });

  it("a passing check is never clickable even when onSelectCheck is provided", () => {
    const html = renderToStaticMarkup(<ResumeAtsPanel resumeData={PARTIALLY_COMPLETE} onSelectCheck={() => {}} />);
    // "Contact information" passes (name + email present) — must not be wrapped in a button.
    const contactMatch = html.match(/<li[^]*?Contact information[^]*?<\/li>/);
    expect(contactMatch).not.toBeNull();
    expect(contactMatch![0]).not.toContain("<button");
  });
});
