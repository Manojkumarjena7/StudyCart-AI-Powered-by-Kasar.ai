import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createEmptyResumeData } from "@/lib/resume/types";
import { getResumeTemplate, getTemplateRenderer, RESUME_TEMPLATES, TemplateRenderer } from "./registry";
import { Template01Renderer } from "./template-01/template-01-renderer";

describe("template registry", () => {
  it("resolves Template 01's renderer", () => {
    const renderer = getTemplateRenderer("template-01");
    expect(renderer).toBe(Template01Renderer);
  });

  it("lists template-01 as available and template-02/03 as coming-soon", () => {
    expect(getResumeTemplate("template-01")?.status).toBe("available");
    expect(getResumeTemplate("template-02")?.status).toBe("coming-soon");
    expect(getResumeTemplate("template-03")?.status).toBe("coming-soon");
  });

  it("does not expose a renderer for a coming-soon template", () => {
    expect(getTemplateRenderer("template-02")).toBeNull();
    expect(getTemplateRenderer("template-03")).toBeNull();
  });

  it("fails safely (returns null, does not throw) for an unknown template id", () => {
    expect(() => getTemplateRenderer("template-99")).not.toThrow();
    expect(getTemplateRenderer("template-99")).toBeNull();
  });

  it("every registry entry has a distinct id and a preview image path", () => {
    const ids = RESUME_TEMPLATES.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const t of RESUME_TEMPLATES) {
      expect(t.previewImagePath).toMatch(/^\/resumes\//);
    }
  });
});

describe("TemplateRenderer", () => {
  it("renders Template 01's output for a known available template id", () => {
    const data = { ...createEmptyResumeData(), personalInfo: { fullName: "Riley Chen", links: [] } };
    const html = renderToStaticMarkup(TemplateRenderer({ templateId: "template-01", data }));
    expect(html).toContain("Riley Chen");
  });

  it("renders a safe fallback instead of crashing for an unavailable/unknown template", () => {
    const data = createEmptyResumeData();
    const html = renderToStaticMarkup(TemplateRenderer({ templateId: "template-02", data }));
    expect(html).toContain("isn&#x27;t available yet");

    const unknownHtml = renderToStaticMarkup(TemplateRenderer({ templateId: "not-a-real-template", data }));
    expect(unknownHtml).toContain("isn&#x27;t available yet");
  });
});
