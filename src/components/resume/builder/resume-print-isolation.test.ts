import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { createEmptyResumeData } from "@/lib/resume/types";
import { RESUME_PRINT_TARGET_CLASS } from "@/components/resume/templates/printable-resume";
import { ResumeAtsPanel } from "./resume-ats-panel";
import { ResumeEditorPanel } from "./resume-editor-panel";
import { ResumeDesignPanel } from "./resume-design-panel";

/**
 * Phase 4 print-isolation contract — see docs/RESUME-ENHANCEMENT.md §Resume
 * Builder — Phase 4 §Testing for why this is the available substitute for
 * executing real @media print rules (no browser/CSSOM in this test environment):
 *
 * 1. Every non-resume surface (editor, ATS panel, design panel) never renders
 *    the `.resume-print-target` marker itself — i.e. none of them ever wraps
 *    its own output in the printable target, which is the structural
 *    precondition the global CSS in globals.css relies on to hide them
 *    (they're siblings of the print target in resume-workspace.tsx, not
 *    descendants of it). Phase 5d's ResumeDesignPanel replaces the Phase
 *    5c TemplateSwitcher dropdown checked here previously.
 * 2. The actual isolation rule (hide everything except `.resume-print-target`)
 *    and the resume page's own overflow/height rules are asserted by reading the
 *    real CSS source, since no CSSOM exists here to evaluate them against.
 *
 * Whether the app's Navbar/Footer/SupportFab and the rest of the page chrome
 * genuinely disappear when printing is a real-browser question, verified manually
 * — see the Phase 4 manual verification report, not by a test here.
 */

const dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(dirname, "../../../..");

function readSource(relativePath: string): string {
  return readFileSync(path.join(projectRoot, relativePath), "utf-8");
}

describe("print isolation — non-resume surfaces never carry the print-target marker", () => {
  it("ResumeEditorPanel's own output never contains the print-target class", () => {
    const html = renderToStaticMarkup(
      createElement(ResumeEditorPanel, {
        resumeData: createEmptyResumeData(),
        onChange: () => {},
        uncertainFields: [],
        activeSection: "contact",
        onActiveSectionChange: () => {},
      })
    );
    expect(html).not.toContain(RESUME_PRINT_TARGET_CLASS);
  });

  it("ResumeAtsPanel's own output never contains the print-target class", () => {
    const html = renderToStaticMarkup(createElement(ResumeAtsPanel, { resumeData: createEmptyResumeData() }));
    expect(html).not.toContain(RESUME_PRINT_TARGET_CLASS);
  });

  it("ResumeDesignPanel's own output never contains the print-target class", () => {
    const html = renderToStaticMarkup(createElement(ResumeDesignPanel, { templateId: "template-01", onChange: () => {} }));
    expect(html).not.toContain(RESUME_PRINT_TARGET_CLASS);
  });
});

describe("print isolation — global CSS rule (source-level check)", () => {
  const css = readSource("src/app/globals.css");

  it("hides everything under @media print except .resume-print-target", () => {
    expect(css).toMatch(/@media print/);
    expect(css).toMatch(/body \*\s*\{[^}]*visibility:\s*hidden/);
    expect(css).toContain(".resume-print-target");
    expect(css).toMatch(/\.resume-print-target,\s*\n?\s*\.resume-print-target \*\s*\{[^}]*visibility:\s*visible/);
  });

  it("repositions the print target to the page origin without using `fixed` (which can fail to paginate)", () => {
    const printTargetRuleMatch = css.match(/\.resume-print-target\s*\{[^}]*\}/);
    expect(printTargetRuleMatch).not.toBeNull();
    expect(printTargetRuleMatch?.[0]).toMatch(/position:\s*absolute/);
    expect(printTargetRuleMatch?.[0]).not.toMatch(/position:\s*fixed/);
  });
});

describe("print isolation — resume page allows natural multi-page overflow (source-level check)", () => {
  const css = readSource("src/components/resume/templates/template-01/template-01.module.css");

  it("the page has a min-height (one page baseline) but no max-height or clipping overflow", () => {
    const pageRuleMatch = css.match(/\.page\s*\{[^}]*\}/);
    expect(pageRuleMatch).not.toBeNull();
    const rule = pageRuleMatch![0];
    expect(rule).toMatch(/min-height:\s*297mm/);
    expect(rule).not.toMatch(/max-height/);
    expect(rule).not.toMatch(/overflow:\s*hidden/);
  });

  it("declares an A4 @page size for print", () => {
    expect(css).toMatch(/@page\s*\{[^}]*size:\s*A4/);
  });
});
