/**
 * Browser print-to-PDF trigger — Phase 4's export mechanism. Deliberately not a
 * second PDF-rendering engine: it just calls the browser's own print dialog
 * against the printable subtree (see printable-resume.tsx / globals.css), which
 * is how "what you see in the preview = what's in the PDF" is guaranteed without
 * re-implementing layout in jsPDF. See docs/RESUME-ENHANCEMENT.md §Resume Builder
 * — Phase 4.
 */

/** Pure and unit-testable on its own — the side-effecting parts (document.title,
 * window.print) live only in printResume() below, which needs a real browser. */
export function buildPrintDocumentTitle(fullName: string | undefined | null): string {
  const safeName = (fullName ?? "")
    .trim()
    .replace(/[^a-zA-Z0-9 _-]/g, "")
    .replace(/\s+/g, "-");
  return `KasarTech-Resume-${safeName || "Draft"}`;
}

/**
 * Temporarily renames the document so a browser's "Save as PDF" dialog suggests a
 * sensible filename — browsers vary in whether they honor this, so it's a best
 * effort, never a guarantee. Restores the original title via the `afterprint`
 * event, which fires whether the user prints, saves, or cancels.
 */
export function printResume(fullName: string | undefined | null): void {
  if (typeof window === "undefined") return;

  const previousTitle = document.title;
  document.title = buildPrintDocumentTitle(fullName);

  const restoreTitle = () => {
    document.title = previousTitle;
    window.removeEventListener("afterprint", restoreTitle);
  };
  window.addEventListener("afterprint", restoreTitle);

  window.print();
}
