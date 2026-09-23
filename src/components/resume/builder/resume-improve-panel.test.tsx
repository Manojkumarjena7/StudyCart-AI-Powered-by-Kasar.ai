import { describe, it, expect, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createEmptyResumeData, type ResumeData } from "@/lib/resume/types";
import { ResumeImprovePanel } from "./resume-improve-panel";

/**
 * Phase 5d Improve tab — reuses the exact same deterministic
 * getAtsChecklist() the ATS tab uses (no second engine, no AI, nothing
 * fabricated), filtered to actionable (non-passing) items only. See
 * docs/RESUME-ENHANCEMENT.md §Resume Builder — Phase 5d.
 */
describe("ResumeImprovePanel", () => {
  it("shows only non-passing checks as suggestions", () => {
    const data: ResumeData = { ...createEmptyResumeData(), personalInfo: { fullName: "Jordan Lee", links: [] } };
    const html = renderToStaticMarkup(<ResumeImprovePanel resumeData={data} onSelectCheck={() => {}} />);
    // Contact fails (no email/phone) even with a name — should appear.
    expect(html).toContain("Contact information");
    // Nothing here is a passing/complete resume, so the "all clear" message
    // should not show.
    expect(html).not.toContain("every ATS check is passing");
  });

  it("shows a clear all-passing message when there is nothing left to suggest", () => {
    const complete: ResumeData = {
      personalInfo: { fullName: "Jordan Lee", email: "jordan@example.com", phone: "+1 555-0000", links: [] },
      summary: "A results-driven engineer with five years of experience shipping web applications end to end.",
      experience: [
        {
          id: "e1",
          role: "Engineer",
          company: "Acme",
          startDate: "Jan 2022",
          current: true,
          bullets: ["Reduced latency by 30% across 3 services", "Automated 40 test cases"],
        },
      ],
      education: [{ id: "ed1", institution: "State University", degree: "B.Sc." }],
      skills: [{ id: "s1", items: ["TypeScript"] }],
      projects: [{ id: "p1", name: "Personal Site", bullets: ["Built with Next.js"] }],
      certifications: [],
      achievements: ["Won 1st place at CodeFest"],
    };
    const html = renderToStaticMarkup(<ResumeImprovePanel resumeData={complete} onSelectCheck={() => {}} />);
    expect(html).toContain("every ATS check is passing");
  });

  it("never renders a numeric score", () => {
    const html = renderToStaticMarkup(<ResumeImprovePanel resumeData={createEmptyResumeData()} onSelectCheck={() => {}} />);
    expect(html).not.toMatch(/\d+%/);
  });

  it("renders suggestions as buttons (clickable), not plain text", () => {
    const onSelectCheck = vi.fn();
    const html = renderToStaticMarkup(<ResumeImprovePanel resumeData={createEmptyResumeData()} onSelectCheck={onSelectCheck} />);
    expect(html).toContain("<button");
  });
});
