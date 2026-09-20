"use client";

import { useRef, useState } from "react";
import { FileText, UploadCloud, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const MAX_SIZE_BYTES = 20 * 1024 * 1024; // 20MB

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface PdfUploadDropzoneProps {
  file: File | null;
  onChange: (file: File | null) => void;
}

/**
 * PDF drag-and-drop upload for the Library Contribution form. Client-side type/size
 * checks are a first line of defense only — the server independently re-validates
 * (including real PDF content sniffing) in src/lib/library/contribution-repository.ts.
 * See docs/LEARNING-LIBRARY.md §Contribution MVP.
 */
export function PdfUploadDropzone({ file, onChange }: PdfUploadDropzoneProps) {
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
      setError("File is too large — please keep it under 20MB.");
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
            <div className="min-w-0">
              <p className="truncate text-sm text-text-primary">{file.name}</p>
              <p className="text-xs text-text-secondary">{formatFileSize(file.size)}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="focus-ring shrink-0 rounded-md p-1 text-text-secondary hover:text-error"
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
            Click to upload or drag and drop
          </span>
          <span className="text-xs text-text-secondary">PDF only, max 20MB</span>
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
