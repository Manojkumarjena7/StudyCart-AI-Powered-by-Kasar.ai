import Link from "next/link";
import { ArrowRight, Upload, FilePlus2 } from "lucide-react";

/**
 * The Resume product home's masthead + primary actions — replaces both the old
 * marketing-style ResumeHero (deleted; see resume-hero.tsx history) and the
 * Phase 5a analyzer-entry-section. Deliberately compact: no two-column hero, no
 * illustration, no trust-badge row, no feature-card grid — /resume should read
 * as a product start screen, not a landing page. See
 * docs/RESUME-ENHANCEMENT.md §Resume Builder — Phase 5b.
 *
 * "Upload your resume" and "Start from scratch" are the two dominant actions per
 * the approved brief; the Analyze/ATS-check entry point from Phase 5a is kept as
 * a smaller, secondary link rather than a third equally-weighted button — it's
 * still one click away, just not competing with the two primary actions.
 * Keeps the `id="analyzer"` anchor from Phase 5a for any existing in-page link.
 */
export function ResumeBuilderEntrySection() {
  return (
    <section id="analyzer" className="border-b border-border-subtle bg-bg-card">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-cyan-light">
          KasarTech Resume
        </p>
        <h1 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          Create a resume that gets you hired
        </h1>
        <p className="mt-3 max-w-lg text-sm text-text-secondary sm:text-base">
          Upload your existing resume or start from scratch. Improve your
          content, check ATS readiness, and choose a professional design — all
          in one place.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link href="/resume/build?mode=enhance" className="w-full sm:w-auto">
            <span className="focus-ring flex w-full items-center justify-center gap-2 rounded-lg bg-brand-blue px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 sm:w-auto">
              <Upload className="h-4 w-4" />
              Upload your resume
            </span>
          </Link>
          <Link href="/resume/build?mode=create" className="w-full sm:w-auto">
            <span className="focus-ring flex w-full items-center justify-center gap-2 rounded-lg border border-border-subtle px-5 py-3 text-sm font-semibold text-text-primary transition-colors hover:border-brand-cyan/50 sm:w-auto">
              <FilePlus2 className="h-4 w-4" />
              Start from scratch
            </span>
          </Link>
        </div>

        <Link
          href="/resume/build?mode=analyze"
          className="focus-ring mt-4 inline-flex items-center gap-1 rounded text-xs font-medium text-text-secondary transition-colors hover:text-brand-cyan-light"
        >
          Just want an ATS check first? Analyze your resume
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </section>
  );
}
