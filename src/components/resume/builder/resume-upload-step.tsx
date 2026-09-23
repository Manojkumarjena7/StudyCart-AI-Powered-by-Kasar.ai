"use client";

import { useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/shared/ui/button";
import { ResumeUploadDropzone } from "@/components/resume/resume-upload-dropzone";

interface ResumeUploadStepProps {
  isPending: boolean;
  error: string | null;
  onUpload: (file: File) => void;
  onStartFromScratch: () => void;
}

/**
 * The builder's onboarding screen. No step-count label here (a prior "Step 1 of
 * 2" was stale — the flow has had more than 2 steps since Phase 2, and how many
 * steps a given entry mode takes varies; see resume-builder-client.tsx). Only
 * PDF is actually supported end to end (extraction uses pdf-parse), so the copy
 * says PDF only — no DOCX claim. See docs/RESUME-ENHANCEMENT.md §Resume Builder
 * — Phase 5b.
 */
export function ResumeUploadStep({ isPending, error, onUpload, onStartFromScratch }: ResumeUploadStepProps) {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="mx-auto max-w-xl">
      <div className="rounded-2xl border border-border-subtle bg-bg-card p-6 shadow-card sm:p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
          Create your resume
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          Upload your existing resume and we&apos;ll organize your information for
          you. Nothing is invented — anything we&apos;re not confident about is
          left blank so you can fill it in yourself.
        </p>

        <div className="mt-6">
          <ResumeUploadDropzone file={file} onChange={setFile} />
        </div>

        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-text-primary">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
            <span>{error}</span>
          </div>
        )}

        <Button
          type="button"
          variant="gradient"
          className="mt-5 w-full"
          disabled={!file || isPending}
          onClick={() => file && onUpload(file)}
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Reading your resume…
            </>
          ) : (
            "Upload Resume"
          )}
        </Button>

        <div className="relative mt-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-border-subtle" />
          <span className="text-[11px] uppercase tracking-wide text-text-secondary">or</span>
          <div className="h-px flex-1 bg-border-subtle" />
        </div>

        <button
          type="button"
          onClick={onStartFromScratch}
          disabled={isPending}
          className="focus-ring mt-4 w-full rounded-lg border border-border-subtle px-4 py-2.5 text-center text-sm font-medium text-text-primary transition-colors hover:border-brand-cyan/50 hover:text-brand-cyan-light disabled:opacity-50"
        >
          Start from scratch
        </button>
      </div>
    </div>
  );
}
