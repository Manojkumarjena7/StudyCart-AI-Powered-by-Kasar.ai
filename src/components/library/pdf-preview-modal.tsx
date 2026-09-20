"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Download, ExternalLink } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

interface PdfPreviewModalProps {
  title: string | null;
  pdfPath: string | null;
  onClose: () => void;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/**
 * Generic PDF preview modal for the Library — same native-browser-PDF-viewer-via-
 * iframe approach as src/components/resume/resume-pdf-viewer-modal.tsx, kept as a
 * separate library-scoped component since that one is typed to the Resume domain's
 * ResumeExample and the Resume domain must not be modified. No new PDF-rendering
 * dependency was added. Used both for previewing a pending/approved contribution in
 * the Local Contribution Review and for viewing an approved resource in
 * /library/materials.
 */
export function PdfPreviewModal({ title, pdfPath, onClose }: PdfPreviewModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();
  const open = Boolean(pdfPath);

  useEffect(() => {
    if (!open) return;
    triggerRef.current = document.activeElement as HTMLElement;
    closeButtonRef.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      triggerRef.current?.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {pdfPath && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-6"
          initial={reduceMotion ? undefined : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="pdf-preview-title"
            className="flex h-full w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-border-subtle bg-bg-card shadow-card"
            initial={reduceMotion ? undefined : { opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between gap-3 border-b border-border-subtle px-4 py-3 sm:px-5">
              <h2 id="pdf-preview-title" className="min-w-0 truncate text-sm font-semibold text-text-primary">
                {title ?? "Preview"}
              </h2>
              <div className="flex shrink-0 items-center gap-2">
                <a
                  href={pdfPath}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Open PDF in new tab"
                  className="focus-ring flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary hover:bg-overlay-soft hover:text-text-primary"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
                <a
                  href={pdfPath}
                  download
                  aria-label="Download PDF"
                  className="focus-ring flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary hover:bg-overlay-soft hover:text-text-primary"
                >
                  <Download className="h-4 w-4" />
                </a>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={onClose}
                  aria-label="Close preview"
                  className="focus-ring flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary hover:bg-overlay-soft hover:text-text-primary"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="relative flex-1 bg-bg-secondary">
              <iframe src={`${pdfPath}#view=FitH`} title={title ?? "PDF preview"} className="h-full w-full" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
