"use client";

import { useState } from "react";
import { getPublishedResumeExamples, type ResumeExample } from "@/config/resume-examples";
import { ResumeExamplesGrid } from "@/components/resume/resume-examples-grid";
import { ResumePdfViewerModal } from "@/components/resume/resume-pdf-viewer-modal";
import { SupportModal } from "@/components/shared/support-modal";
import { downloadFile } from "@/lib/utils/download-file";

interface PendingDownload {
  example: ResumeExample;
  format: "pdf" | "docx";
}

export function ResumeExamplesSection() {
  const [activeExample, setActiveExample] = useState<ResumeExample | null>(null);
  const [pendingDownload, setPendingDownload] = useState<PendingDownload | null>(null);
  const examples = getPublishedResumeExamples();

  function requestDownload(example: ResumeExample, format: "pdf" | "docx") {
    setPendingDownload({ example, format });
  }

  function runPendingDownload() {
    if (!pendingDownload) return;
    const { example, format } = pendingDownload;
    const url = format === "pdf" ? example.pdfPath : example.docxPath;
    downloadFile(url, `${example.title.replace(/\s+/g, "-")}.${format}`);
    setPendingDownload(null);
  }

  return (
    <section id="examples" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-cyan-light">
        Resume Templates
      </p>
      <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
        Explore Professional Resume Templates
      </h2>
      <p className="mt-3 max-w-2xl text-base text-text-secondary">
        Real resume structures from IT professionals — clean formatting, relevant
        keywords, and measurable impact. View them in the browser, or download the PDF
        or editable Word version for your own reference.
      </p>

      <div className="mt-10">
        <ResumeExamplesGrid
          examples={examples}
          onView={setActiveExample}
          onRequestDownload={requestDownload}
        />
      </div>

      <ResumePdfViewerModal
        example={activeExample}
        onClose={() => setActiveExample(null)}
        onRequestDownload={requestDownload}
      />

      <SupportModal
        context={pendingDownload ? "kasartech" : null}
        onContinueDownload={runPendingDownload}
        onClose={() => setPendingDownload(null)}
      />
    </section>
  );
}
