import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ResumeBuilderEntrySection } from "./resume-builder-entry-section";

/**
 * Phase 5b product-home masthead — see docs/RESUME-ENHANCEMENT.md §Resume
 * Builder — Phase 5b. Replaces the Phase 5a "Analyze My Resume" / "Improve My
 * Resume" copy with the approved "Upload your resume" / "Start from scratch"
 * primary actions; Analyze mode is preserved as a smaller secondary link.
 */
describe("ResumeBuilderEntrySection", () => {
  const html = renderToStaticMarkup(<ResumeBuilderEntrySection />);

  it("has an Upload your resume CTA pointing at /resume/build?mode=enhance", () => {
    expect(html).toContain("Upload your resume");
    expect(html).toContain('href="/resume/build?mode=enhance"');
  });

  it("has a Start from scratch CTA pointing at /resume/build?mode=create", () => {
    expect(html).toContain("Start from scratch");
    expect(html).toContain('href="/resume/build?mode=create"');
  });

  it("still exposes the Analyze/ATS-check entry point (Phase 5a preserved), as a secondary link", () => {
    expect(html).toContain('href="/resume/build?mode=analyze"');
  });

  it("never claims the feature is coming soon", () => {
    expect(html).not.toMatch(/coming soon/i);
  });

  it("does not contain the old fake-analysis copy", () => {
    expect(html).not.toContain("isn&#x27;t live yet");
    expect(html).not.toContain("AI Analysis");
  });

  it("keeps the #analyzer anchor so any existing in-page link still resolves", () => {
    expect(html).toContain('id="analyzer"');
  });
});
