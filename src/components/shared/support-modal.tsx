"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, Heart, Gift, CheckCircle2, ShieldCheck } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/shared/ui/button";
import { cn } from "@/lib/utils/cn";
import { getSupportPaytmUrl, getSupportQrImageSrc } from "@/lib/utils/support";

export type SupportContext = "kasartech" | "studycart";

interface SupportModalProps {
  /** Which variant to show; null = closed. */
  context: SupportContext | null;
  onClose: () => void;
  /**
   * Only meaningful for the "kasartech" (resume download) context. Both action
   * buttons call this before closing — support is optional, so neither button
   * blocks the download; only the X/backdrop/Escape close without downloading.
   */
  onContinueDownload?: () => void;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

const KASARTECH_BENEFITS = [
  "Helps us keep the platform free",
  "Supports development of new tools",
  "Helps students and job seekers",
  "Makes a real difference ❤️",
];

const STUDYCART_PILLS = ["Free Career Tools", "For Students & Job Seekers", "Your Support Matters"];

/**
 * Reusable support/donation modal, shared across the site. Two visual/content
 * variants driven by `context` — see docs/RESUME-ENHANCEMENT.md §Support popups:
 * - "kasartech": shown before a resume PDF/Word download (never on View/Preview).
 * - "studycart": informational, opened from the global persistent support button.
 * Payment is always optional: no gateway, no verification, no login, never blocks
 * anything. The QR block only renders when getSupportQrImageSrc() returns a real
 * image (it does by default — see src/lib/utils/support.ts); if that's ever unset,
 * both variants gracefully fall back rather than showing a placeholder/fake QR.
 */
export function SupportModal({ context, onClose, onContinueDownload }: SupportModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const primaryButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();
  const open = Boolean(context);
  const qrSrc = getSupportQrImageSrc();
  const paytmUrl = getSupportPaytmUrl();

  useEffect(() => {
    if (!open) return;
    triggerRef.current = document.activeElement as HTMLElement;
    primaryButtonRef.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (focusable.length === 0) return;
      e.stopPropagation();
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

    document.addEventListener("keydown", handleKeyDown, { capture: true });
    return () => {
      document.removeEventListener("keydown", handleKeyDown, { capture: true });
      document.body.style.overflow = previousOverflow;
      triggerRef.current?.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (typeof document === "undefined") return null;

  function handlePrimaryAction() {
    onContinueDownload?.();
    onClose();
  }

  const qrBlock = qrSrc ? (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-border-subtle bg-bg-secondary p-5">
      <div className="flex h-[220px] w-[220px] items-center justify-center overflow-hidden rounded-xl bg-white p-2 shadow-card">
        <Image src={qrSrc} alt="Paytm / UPI QR code" width={200} height={200} className="h-full w-full object-contain" />
      </div>
      <p className="flex items-center gap-1.5 text-xs text-text-secondary">
        <ShieldCheck className="h-3.5 w-3.5 text-success" />
        Scan with Paytm or any UPI app
      </p>
    </div>
  ) : null;
  // Without a real QR (not configured yet), the kasartech variant has nothing to put
  // in a second column — falling back to a single, narrower centered column instead
  // of leaving a wide empty gap next to the message.
  const kasartechHasSideColumn = Boolean(qrBlock || (!qrSrc && paytmUrl));

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
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
            aria-labelledby="support-modal-title"
            className={cn(
              "relative flex max-h-[90vh] w-full flex-col overflow-y-auto rounded-2xl border border-border-subtle bg-bg-card p-6 shadow-card sm:p-8",
              context === "kasartech" && kasartechHasSideColumn ? "max-w-3xl" : "max-w-md"
            )}
            initial={reduceMotion ? undefined : { opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.2 }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="focus-ring absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary hover:bg-overlay-soft hover:text-text-primary"
            >
              <X className="h-4 w-4" />
            </button>

            {context === "kasartech" ? (
              <div
                className={cn(
                  "grid gap-8",
                  kasartechHasSideColumn && "lg:grid-cols-[1.2fr_1fr] lg:items-start"
                )}
              >
                <div>
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-error/10">
                    <Heart className="h-5 w-5 text-error" />
                  </span>
                  <h2 id="support-modal-title" className="mt-4 text-2xl font-semibold tracking-tight text-text-primary">
                    Support KasarTech.ai ❤️
                  </h2>
                  <p className="mt-3 text-sm text-text-secondary">
                    These resume templates are free to use. If they helped you, you can
                    support us with ₹100 or more. Your support helps us build more free
                    tools, resources and career support.
                  </p>

                  <div className="mt-5 flex items-center gap-3 rounded-xl bg-overlay-soft px-4 py-3">
                    <Gift className="h-5 w-5 shrink-0 text-brand-blue" />
                    <p className="text-sm text-text-primary">
                      <span className="font-semibold">Minimum Support</span>
                      <br />
                      ₹100 or more
                    </p>
                  </div>

                  <ul className="mt-5 space-y-2">
                    {KASARTECH_BENEFITS.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-text-secondary">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-5 rounded-xl bg-overlay-soft px-4 py-3 text-xs text-text-secondary">
                    No payment is required. You can still download for free. Thank you
                    for supporting KasarTech.ai. ❤️
                  </p>

                  <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                    <Button type="button" variant="outline" className="flex-1" onClick={handlePrimaryAction}>
                      Maybe Later
                    </Button>
                    <Button
                      ref={primaryButtonRef}
                      type="button"
                      variant="gradient"
                      className="flex-1"
                      onClick={handlePrimaryAction}
                    >
                      Continue Free Download →
                    </Button>
                  </div>
                </div>

                {qrBlock ?? (
                  paytmUrl && (
                    <div className="flex items-center justify-center rounded-2xl border border-border-subtle bg-bg-secondary p-5">
                      <a
                        href={paytmUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="focus-ring text-sm font-medium text-brand-blue hover:underline"
                      >
                        Support via Paytm
                      </a>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="mx-auto flex max-w-sm flex-col items-center text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-error/10">
                  <Heart className="h-5 w-5 text-error" />
                </span>
                <h2 id="support-modal-title" className="mt-4 text-2xl font-semibold tracking-tight text-text-primary">
                  Support StudyCart ❤️
                </h2>
                <p className="mt-3 text-sm text-text-secondary">
                  We&apos;re building free and affordable career and learning tools for
                  students and job seekers. If StudyCart helps you, consider supporting
                  us.
                </p>

                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  {STUDYCART_PILLS.map((pill) => (
                    <span
                      key={pill}
                      className="rounded-full bg-overlay-soft px-3 py-1 text-xs font-medium text-text-secondary"
                    >
                      {pill}
                    </span>
                  ))}
                </div>

                {qrBlock && <div className="mt-6 w-full">{qrBlock}</div>}
                {!qrSrc && paytmUrl && (
                  <a
                    href={paytmUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="focus-ring mt-6 text-sm font-medium text-brand-blue hover:underline"
                  >
                    Support via Paytm
                  </a>
                )}

                <p className="mt-5 text-xs text-text-secondary">
                  Your support helps us create more useful tools, resources, and
                  opportunities for the IT community.
                </p>

                <p className="mt-4 text-sm font-medium text-text-primary">
                  Thank you! ❤️
                  <br />
                  — StudyCart Team
                </p>

                <Button
                  ref={primaryButtonRef}
                  type="button"
                  variant="secondary"
                  className="mt-6 w-full"
                  onClick={onClose}
                >
                  Close
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
