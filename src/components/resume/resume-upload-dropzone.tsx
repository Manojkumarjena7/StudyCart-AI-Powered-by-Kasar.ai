"use client";

import { useRef, useState } from "react";
import { FileText, UploadCloud, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

// 4MB, matches resume-actions.ts's own limit and the on-page copy — kept below
// Vercel's ~4.5MB hard request-body ceiling for Node.js Serverless Functions.
const MAX_SIZE_BYTES = 4 * 1024 * 1024;

interface ResumeUploadDropzoneProps {
  file: File | null;
  onChange: (file: File | null) => void;
}

export function ResumeUploadDropzone({ file, onChange }: ResumeUploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFiles(files: FileList | null) {
    const selected = files?.[0];
    if (!selected) return;
    if (selected.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }
    if (selected.size > MAX_SIZE_BYTES) {
      setError("File is too large — please keep it under 4MB.");
      return;
    }
    setError(null);
    onChange(selected);
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {file ? (
        <div className="flex items-center justify-between rounded-lg border border-border-subtle bg-bg-secondary px-4 py-3.5">
          <div className="flex min-w-0 items-center gap-3">
            <FileText className="h-5 w-5 shrink-0 text-brand-cyan-light" />
            <span className="truncate text-sm text-text-primary">{file.name}</span>
          </div>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="focus-ring rounded-md p-1 text-text-secondary hover:text-error"
            aria-label="Remove file"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            handleFiles(e.dataTransfer.files);
          }}
          className={cn(
            "focus-ring flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-10 text-center transition-colors",
            dragActive
              ? "border-brand-cyan-light bg-brand-cyan/5"
              : "border-border-subtle bg-bg-secondary hover:border-brand-cyan/40"
          )}
        >
          <UploadCloud className="h-6 w-6 text-brand-cyan-light" />
          <span className="text-sm font-medium text-text-primary">
            Drag &amp; drop your resume PDF here
          </span>
          <span className="text-xs text-text-secondary">or click to browse · PDF only, max 4MB</span>
        </button>
      )}

      {error && (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-error">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
