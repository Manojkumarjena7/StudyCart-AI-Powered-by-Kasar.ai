import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ResumeRecentList } from "./resume-recent-list";

/**
 * No persistence layer exists (ResumeData is client-side-only through Phases
 * 1–5), so this must render an honest empty state — never fabricated sample
 * resumes/ATS percentages, even though the Phase 5b visual reference shows
 * some. See docs/RESUME-ENHANCEMENT.md §Resume Builder — Phase 5b.
 */
describe("ResumeRecentList", () => {
  const html = renderToStaticMarkup(<ResumeRecentList />);

  it("renders an honest empty state, not fabricated resume rows", () => {
    expect(html).toContain("haven&#x27;t saved a resume here yet");
  });

  it("never fabricates a filename or an ATS percentage", () => {
    expect(html).not.toMatch(/\.pdf/i);
    expect(html).not.toMatch(/\d+%/);
  });

  it("offers a way to get started from the empty state", () => {
    expect(html).toContain('href="/resume/build?mode=enhance"');
  });
});
