import { createElement, type ComponentType } from "react";
import type { ResumeData } from "@/lib/resume/types";
import { Template01Renderer } from "./template-01/template-01-renderer";

/**
 * Small template registry/factory — the seam future Template 02/03 renderers plug
 * into without touching the builder UI or ResumeData. See
 * docs/RESUME-ENHANCEMENT.md §Resume Builder — Phase 2.
 *
 * ResumeData -> TemplateRenderer -> Template0NRenderer. Adding a new template is a
 * new `template-0N/` renderer + one entry here — the picker, live-preview panel,
 * and editor are all unaware of which templates exist beyond this list.
 */

export type ResumeTemplateId = "template-01" | "template-02" | "template-03";

export interface ResumeTemplateDefinition {
  id: ResumeTemplateId;
  name: string;
  description: string;
  status: "available" | "coming-soon";
  /** Existing static /resume gallery preview asset, reused read-only purely as a
   * thumbnail in the template picker — never modified. */
  previewImagePath: string;
  Renderer?: ComponentType<{ data: ResumeData }>;
}

export const RESUME_TEMPLATES: ResumeTemplateDefinition[] = [
  {
    id: "template-01",
    name: "Template 01",
    description: "Two-column layout with an accent contact row — well suited for freshers and QA/testing roles.",
    status: "available",
    previewImagePath: "/resumes/template-01/preview.png",
    Renderer: Template01Renderer,
  },
  {
    id: "template-02",
    name: "Template 02",
    description: "Centered single-column layout for multi-project experience.",
    status: "coming-soon",
    previewImagePath: "/resumes/template-02/preview.png",
  },
  {
    id: "template-03",
    name: "Template 03",
    description: "Bold section-banner layout for experienced engineers.",
    status: "coming-soon",
    previewImagePath: "/resumes/template-03/preview.png",
  },
];

export function getResumeTemplate(id: string): ResumeTemplateDefinition | undefined {
  return RESUME_TEMPLATES.find((t) => t.id === id);
}

/** Returns the renderer only for a template that exists AND is actually available
 * — an unknown id, or a real but not-yet-built template (e.g. template-02), both
 * safely return null rather than throwing. */
export function getTemplateRenderer(id: string): ComponentType<{ data: ResumeData }> | null {
  const definition = getResumeTemplate(id);
  if (!definition || definition.status !== "available" || !definition.Renderer) return null;
  return definition.Renderer;
}

export function TemplateRenderer({ templateId, data }: { templateId: string; data: ResumeData }) {
  const Renderer = getTemplateRenderer(templateId);
  if (!Renderer) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-dashed border-border-subtle bg-bg-secondary p-8 text-center text-sm text-text-secondary">
        This template isn&apos;t available yet. Please pick another one.
      </div>
    );
  }
  // createElement rather than JSX: `Renderer` is a stable reference resolved from
  // the static registry above, not a component defined during this render.
  return createElement(Renderer, { data });
}
