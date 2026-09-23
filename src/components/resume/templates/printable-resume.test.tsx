import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createEmptyResumeData, type ResumeData } from "@/lib/resume/types";
import { PrintableResume, RESUME_PRINT_TARGET_CLASS } from "./printable-resume";
import { Template01Renderer } from "./template-01/template-01-renderer";

/**
 * Structural tests only — see docs/RESUME-ENHANCEMENT.md §Resume Builder — Phase 4
 * for why: jsdom/react-dom/server has no real CSSOM or @media print evaluation, so
 * whether `.resume-print-target` actually becomes visible while everything else
 * hides is not something this test environment can execute. What IS verified here
 * is the structural contract the CSS in globals.css depends on: the wrapper
 * carries the expected marker class, is hidden by default on screen, and actually
 * contains Template 01's rendered output when used as the spec's example shows.
 * Real @media print behavior is verified manually in a browser — see the Phase 4
 * manual verification report.
 */

describe("PrintableResume", () => {
  it("renders the print-target marker class", () => {
    const html = renderToStaticMarkup(<PrintableResume>content</PrintableResume>);
    expect(html).toContain(RESUME_PRINT_TARGET_CLASS);
  });

  it("is hidden by default on screen (display:none via the `hidden` utility)", () => {
    const html = renderToStaticMarkup(<PrintableResume>content</PrintableResume>);
    expect(html).toMatch(/class="[^"]*\bhidden\b[^"]*"/);
  });

  it("is only revealed under @media print (the `print:block` utility)", () => {
    const html = renderToStaticMarkup(<PrintableResume>content</PrintableResume>);
    expect(html).toMatch(/class="[^"]*print:block[^"]*"/);
  });

  it("contains Template 01's rendered output when used as the intended wrapper", () => {
    const data: ResumeData = {
      ...createEmptyResumeData(),
      personalInfo: { fullName: "Morgan Lee", email: "morgan@example.com", links: [] },
      experience: [{ id: "e1", role: "QA Engineer", company: "Acme", bullets: ["Tested releases"] }],
    };
    const html = renderToStaticMarkup(
      <PrintableResume>
        <Template01Renderer data={data} />
      </PrintableResume>
    );
    expect(html).toContain(RESUME_PRINT_TARGET_CLASS);
    expect(html).toContain("Morgan Lee");
    expect(html).toContain("QA Engineer");
  });

  it("renders without crashing when Template 01 is given empty ResumeData", () => {
    const html = renderToStaticMarkup(
      <PrintableResume>
        <Template01Renderer data={createEmptyResumeData()} />
      </PrintableResume>
    );
    expect(html).toContain(RESUME_PRINT_TARGET_CLASS);
    expect(html).toContain("Your Name");
  });
});
