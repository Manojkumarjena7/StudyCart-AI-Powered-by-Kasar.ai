import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import ResumeBuilderPage, { resolveEntryMode } from "./page";

/**
 * Entry-mode wiring at the route boundary. See docs/RESUME-ENHANCEMENT.md
 * §Resume Builder — Phase 5a/5b.
 */
describe("resolveEntryMode", () => {
  it("accepts analyze, enhance, and create", () => {
    expect(resolveEntryMode("analyze")).toBe("analyze");
    expect(resolveEntryMode("enhance")).toBe("enhance");
    expect(resolveEntryMode("create")).toBe("create");
  });

  it("falls back to null for anything else (undefined, unknown, empty)", () => {
    expect(resolveEntryMode(undefined)).toBeNull();
    expect(resolveEntryMode("")).toBeNull();
    expect(resolveEntryMode("delete-everything")).toBeNull();
  });
});

describe("ResumeBuilderPage", () => {
  it("renders the onboarding step for an unrecognized/missing mode (existing /resume/build behavior preserved)", async () => {
    const element = await ResumeBuilderPage({ searchParams: Promise.resolve({}) });
    const html = renderToStaticMarkup(element);
    expect(html).toContain("Create your resume");
  });

  it("still renders the onboarding step first for analyze/enhance modes (upload always comes before either mode branches)", async () => {
    const analyzeElement = await ResumeBuilderPage({ searchParams: Promise.resolve({ mode: "analyze" }) });
    expect(renderToStaticMarkup(analyzeElement)).toContain("Create your resume");

    const enhanceElement = await ResumeBuilderPage({ searchParams: Promise.resolve({ mode: "enhance" }) });
    expect(renderToStaticMarkup(enhanceElement)).toContain("Create your resume");
  });

  it("create mode skips onboarding entirely and mounts straight into the workspace", async () => {
    const element = await ResumeBuilderPage({ searchParams: Promise.resolve({ mode: "create" }) });
    const html = renderToStaticMarkup(element);
    expect(html).not.toContain("Create your resume");
    // The workspace (Phase 5d): Edit/Design/ATS/Improve tabs + the accordion
    // editor's Personal Info section, expanded by default.
    expect(html).toContain(">Edit<");
    expect(html).toContain("Personal Info");
    expect(html).toContain("Download PDF");
  });

  it("always renders the lightweight workspace header, not the full site nav", async () => {
    const element = await ResumeBuilderPage({ searchParams: Promise.resolve({}) });
    const html = renderToStaticMarkup(element);
    expect(html).toContain("Exit to Resume home");
  });
});
