"use client";

import { useRef, useState } from "react";
import { FileText, UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface PdfUploadAreaProps {
  file: File | null;
  onChange: (file: File | null) => void;
}

export function PdfUploadArea({ file, onChange }: PdfUploadAreaProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  function handleFiles(files: FileList | null) {
    const selected = files?.[0];
    if (!selected) return;
    if (selected.type !== "application/pdf") return;
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
            "focus-ring flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-8 text-center transition-colors",
            dragActive
              ? "border-brand-cyan-light bg-brand-cyan/5"
              : "border-border-subtle bg-bg-secondary hover:border-brand-cyan/40"
          )}
        >
          <UploadCloud className="h-6 w-6 text-brand-cyan-light" />
          <span className="text-sm font-medium text-text-primary">
            Click to upload or drag your PDF here
          </span>
          <span className="text-xs text-text-secondary">Answer key / response sheet PDF only</span>
        </button>
      )}
    </div>
  );
}
