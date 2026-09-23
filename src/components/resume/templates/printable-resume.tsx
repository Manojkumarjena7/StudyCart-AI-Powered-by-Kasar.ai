import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Marks the one subtree that should survive printing/"Save as PDF" — see
 * docs/RESUME-ENHANCEMENT.md §Resume Builder — Phase 4. The global print rule in
 * src/app/globals.css hides everything on the page except `.resume-print-target`
 * and its descendants, then repositions this wrapper to the page origin so
 * whatever else it was nested under (editor column, sticky preview panel, site
 * nav/footer) doesn't offset or clip it.
 *
 * On screen this wrapper is not rendered at all (`hidden print:block` where it's
 * mounted) — it exists purely so a *second*, unscaled instance of the exact same
 * `<TemplateRenderer>` + `ResumeData` used for the live preview can be printed
 * without fighting the live preview's shrink-to-fit CSS transform. Same component,
 * same data, two mount points — not a second rendering engine.
 */
export const RESUME_PRINT_TARGET_CLASS = "resume-print-target";

// `hidden` (display:none) keeps this second, unscaled instance out of the layout
// entirely on screen; `print:block` is the only thing that reveals it, and only
// inside @media print.
export function PrintableResume({ children }: { children: ReactNode }) {
  return <div className={cn("hidden print:block", RESUME_PRINT_TARGET_CLASS)}>{children}</div>;
}
