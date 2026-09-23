import type { Metadata } from "next";
import { brandConfig } from "@/config/brand";
import { ResumeBuilderClient, type ResumeBuilderEntryMode } from "@/components/resume/builder/resume-builder-client";
import { ResumeWorkspaceHeader } from "@/components/resume/builder/resume-workspace-header";

export const metadata: Metadata = {
  title: `Resume Builder — ${brandConfig.productName}`,
  description:
    "Upload your resume, review the extracted details, and build a structured draft — the first step of the KasarTech.ai Resume Builder.",
  // Linked from /resume's product home (Phase 5a/5b) — kept unindexed for now
  // since it's a workflow/app screen, not a marketing landing page. See
  // docs/RESUME-ENHANCEMENT.md §Resume Builder.
  robots: { index: false, follow: false },
};

interface ResumeBuilderPageProps {
  searchParams: Promise<{ mode?: string }>;
}

export function resolveEntryMode(mode: string | undefined): ResumeBuilderEntryMode {
  return mode === "analyze" || mode === "enhance" || mode === "create" ? mode : null;
}

/**
 * The Resume Builder workspace. Fixed to the viewport height (`h-screen` +
 * `overflow-hidden`), not `min-h-screen` — this is the Phase 5d fix for the
 * blinking/reflow bug: with `min-h-screen`, the page could grow taller than the
 * viewport and the browser's own scrollbar would toggle on/off as content
 * height crossed that boundary, which changed the live-preview panel's
 * measured width (its ResizeObserver-driven auto-fit scale — see
 * resume-page-preview.tsx), which changed its height, which could re-trigger
 * the same scrollbar toggle — a real layout-thrash loop. Fixing the shell to
 * the viewport means the browser-level scrollbar never appears at all; each
 * step (see resume-builder-client.tsx) owns its own single, intentional scroll
 * container instead. See docs/RESUME-ENHANCEMENT.md §Resume Builder — Phase 5d.
 */
export default async function ResumeBuilderPage({ searchParams }: ResumeBuilderPageProps) {
  const { mode } = await searchParams;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-bg-secondary/40">
      <ResumeWorkspaceHeader />
      <div className="mx-auto flex w-full min-h-0 max-w-[1400px] flex-1 flex-col">
        <ResumeBuilderClient initialMode={resolveEntryMode(mode)} />
      </div>
    </div>
  );
}
