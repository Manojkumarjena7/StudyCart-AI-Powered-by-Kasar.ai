import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ResumeDesignPanel } from "./resume-design-panel";
import { RESUME_TEMPLATES } from "@/components/resume/templates/registry";

/** Phase 5d Design tab — reuses the real template registry, no invented
 * templates, no marketplace grid. See docs/RESUME-ENHANCEMENT.md §Resume
 * Builder — Phase 5d. */
describe("ResumeDesignPanel", () => {
  it("lists every template from the real registry", () => {
    const html = renderToStaticMarkup(<ResumeDesignPanel templateId="template-01" onChange={() => {}} />);
    for (const template of RESUME_TEMPLATES) {
      expect(html).toContain(template.name);
    }
  });

  it("marks the currently selected template", () => {
    const html = renderToStaticMarkup(<ResumeDesignPanel templateId="template-01" onChange={() => {}} />);
    // The selected row renders a check icon inside a success-tinted circle;
    // unavailable rows render a "Coming soon" badge instead.
    expect(html).toMatch(/lucide-check/);
    expect(html).toContain("Coming soon");
  });

  it("disables unavailable templates (Template 02/03)", () => {
    const html = renderToStaticMarkup(<ResumeDesignPanel templateId="template-01" onChange={() => {}} />);
    const disabledCount = (html.match(/disabled=""/g) ?? []).length;
    expect(disabledCount).toBe(RESUME_TEMPLATES.filter((t) => t.status !== "available").length);
  });
});
