"use client";

import { useState } from "react";
import { getPublishedResumeExamples, type ResumeExample } from "@/config/resume-examples";
import { ResumeExamplesCarousel } from "@/components/resume/resume-examples-carousel";
import { ResumePdfViewerModal } from "@/components/resume/resume-pdf-viewer-modal";

export function ResumeExamplesSection() {
  const [activeExample, setActiveExample] = useState<ResumeExample | null>(null);
  const examples = getPublishedResumeExamples();

  return (
    <section id="examples" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-cyan-light">
        Resume Examples
      </p>
      <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
        Explore Professional Resume Examples
      </h2>
      <p className="mt-3 max-w-2xl text-base text-text-secondary">
        Study real resume structure from IT professionals — clean formatting, relevant
        keywords, and measurable impact. View them in the browser or download for your
        own reference.
      </p>

      <div className="mt-10">
        <ResumeExamplesCarousel examples={examples} onView={setActiveExample} />
      </div>

      <ResumePdfViewerModal example={activeExample} onClose={() => setActiveExample(null)} />
    </section>
  );
}
