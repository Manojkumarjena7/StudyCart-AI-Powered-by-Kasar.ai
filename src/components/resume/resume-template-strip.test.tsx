import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ResumeTemplateStrip } from "./resume-template-strip";
import { RESUME_TEMPLATES } from "@/components/resume/templates/registry";

/**
 * Reuses the real template registry — no invented templates. See
 * docs/RESUME-ENHANCEMENT.md §Resume Builder — Phase 5b.
 */
describe("ResumeTemplateStrip", () => {
  const html = renderToStaticMarkup(<ResumeTemplateStrip />);

  it("renders every template from the real registry, and nothing else", () => {
    for (const template of RESUME_TEMPLATES) {
      expect(html).toContain(template.name);
    }
  });

  it("Template 01 is a clickable link into the enhance flow", () => {
    const template01 = RESUME_TEMPLATES.find((t) => t.id === "template-01")!;
    expect(template01.status).toBe("available");
    expect(html).toContain('href="/resume/build?mode=enhance"');
  });

  it("unavailable templates are marked Coming soon and are not links", () => {
    const comingSoonTemplates = RESUME_TEMPLATES.filter((t) => t.status !== "available");
    expect(comingSoonTemplates.length).toBeGreaterThan(0);
    for (const template of comingSoonTemplates) {
      const idx = html.indexOf(template.name);
      expect(idx).toBeGreaterThan(-1);
      // The nearest enclosing interactive wrapper for a coming-soon card should
      // be a plain aria-disabled div, not an <a>.
      const before = html.slice(Math.max(0, idx - 400), idx);
      expect(before).toContain('aria-disabled="true"');
    }
    expect(html).toContain("Soon");
  });
});
