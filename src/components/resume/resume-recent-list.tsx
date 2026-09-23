import Link from "next/link";
import { FileText } from "lucide-react";

/**
 * "Your recent resumes" — the visual reference this phase used shows saved
 * resumes with names and ATS percentages. No persistence layer exists yet
 * (Phases 1–5 explicitly keep ResumeData client-side only, nothing saved to a
 * backend), so this renders an honest empty state rather than inventing sample
 * rows — fabricating data here would contradict this project's own "never
 * invent" rule for anything not actually implemented. See
 * docs/RESUME-ENHANCEMENT.md §Resume Builder — Phase 5b and §Known limitations.
 */
export function ResumeRecentList() {
  return (
    <section className="border-b border-border-subtle bg-bg-card">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <h2 className="text-sm font-semibold text-text-primary">Your recent resumes</h2>
        <div className="mt-4 flex flex-col items-center gap-2 rounded-xl border border-dashed border-border-subtle px-6 py-8 text-center">
          <FileText className="h-5 w-5 text-text-secondary" />
          <p className="text-sm text-text-secondary">
            You haven&apos;t saved a resume here yet. Once you upload or build one,
            it will show up in this list.
          </p>
          <Link
            href="/resume/build?mode=enhance"
            className="focus-ring mt-1 text-xs font-semibold text-brand-cyan-light hover:underline"
          >
            Get started
          </Link>
        </div>
      </div>
    </section>
  );
}
