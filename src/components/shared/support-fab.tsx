"use client";

import { useState } from "react";
import { SupportModal } from "@/components/shared/support-modal";

/**
 * Small, persistent, site-wide support entry point (bottom-right, above page
 * content, below the support modal itself). Always opens the "studycart" variant —
 * per-page contextual triggers (e.g. resume downloads) open "kasartech" separately
 * via their own state. See docs/RESUME-ENHANCEMENT.md §Support popups.
 */
export function SupportFab() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="focus-ring fixed bottom-4 right-4 z-40 flex items-center gap-1.5 rounded-full border border-border-subtle bg-bg-card px-4 py-2.5 text-xs font-medium text-text-secondary shadow-card transition-colors hover:text-text-primary sm:bottom-6 sm:right-6"
      >
        <span aria-hidden="true">❤️</span>
        Support StudyCart
      </button>

      <SupportModal context={open ? "studycart" : null} onClose={() => setOpen(false)} />
    </>
  );
}
