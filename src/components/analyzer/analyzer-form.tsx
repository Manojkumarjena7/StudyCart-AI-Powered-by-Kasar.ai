"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Link2, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/shared/ui/card";
import { Button } from "@/components/shared/ui/button";
import { Input } from "@/components/shared/ui/input";
import { Select } from "@/components/shared/ui/select";
import { Checkbox } from "@/components/shared/ui/checkbox";
import { PdfUploadArea } from "@/components/analyzer/pdf-upload-area";
import { ProcessingOverlay } from "@/components/analyzer/processing-overlay";
import { categoryOptions, genderOptions } from "@/config/site";
import { submitAnalysis } from "@/features/analyzer/submitAnalysis";
import type { Category, Gender } from "@/types/domain";
import { cn } from "@/lib/utils/cn";

type SourceMode = "url" | "pdf";

export function AnalyzerForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [sourceMode, setSourceMode] = useState<SourceMode>("url");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState<Category | "">("");
  const [gender, setGender] = useState<Gender | "">("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  function validate(): string | null {
    if (sourceMode === "url" && !url.trim()) {
      return "Please paste your response sheet or answer key URL.";
    }
    if (sourceMode === "pdf" && !file) {
      return "Please upload your response sheet PDF.";
    }
    if (!category) {
      return "Please select your category.";
    }
    if (!consent) {
      return "Please agree to result processing and anonymous community ranking.";
    }
    return null;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setProcessing(true);

    startTransition(async () => {
      // Small artificial delay so the processing UI always gets to play
      // out its full step sequence, even though the mock parser is fast.
      const [result] = await Promise.all([
        submitAnalysis({
          sourceType: sourceMode,
          url: sourceMode === "url" ? url.trim() : undefined,
          file: sourceMode === "pdf" ? (file ?? undefined) : undefined,
          category: category as Category,
          gender: gender ? (gender as Gender) : undefined,
          consentGiven: consent,
        }),
        new Promise((resolve) => setTimeout(resolve, 4200)),
      ]);

      if (!result.ok || !result.resultId) {
        setProcessing(false);
        setError(result.error ?? "Something went wrong. Please try again.");
        return;
      }

      router.push(`/result/${result.resultId}`);
    });
  }

  return (
    <>
      {processing && <ProcessingOverlay />}
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Universal Answer Key Analyzer</CardTitle>
          <CardDescription>
            Paste your response sheet link or upload the PDF — no manual data entry required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div>
              <div className="mb-3 inline-flex rounded-lg border border-border-subtle bg-bg-secondary p-1">
                {(["url", "pdf"] as SourceMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setSourceMode(mode)}
                    className={cn(
                      "focus-ring rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
                      sourceMode === mode
                        ? "bg-brand-blue text-white"
                        : "text-text-secondary hover:text-text-primary"
                    )}
                  >
                    {mode === "url" ? "Paste URL" : "Upload PDF"}
                  </button>
                ))}
              </div>

              {sourceMode === "url" ? (
                <div className="relative">
                  <Link2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
                  <Input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://response-sheet-portal.example/your-key"
                    className="pl-10"
                    aria-label="Response sheet URL"
                  />
                </div>
              ) : (
                <PdfUploadArea file={file} onChange={setFile} />
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-primary">
                  Category
                </label>
                <Select
                  options={[...categoryOptions]}
                  placeholder="Select category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  aria-label="Category"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-primary">
                  Gender <span className="text-text-secondary">(optional)</span>
                </label>
                <Select
                  options={[...genderOptions]}
                  placeholder="Select gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Gender)}
                  aria-label="Gender"
                />
              </div>
            </div>

            <label className="flex cursor-pointer items-start gap-3">
              <Checkbox checked={consent} onChange={(e) => setConsent(e.target.checked)} />
              <span className="text-sm text-text-secondary">
                I agree to result processing and anonymous community ranking.
              </span>
            </label>

            {error && (
              <p role="alert" className="rounded-lg bg-error/10 px-4 py-3 text-sm text-error">
                {error}
              </p>
            )}

            <Button type="submit" variant="gradient" size="lg" className="w-full" disabled={isPending}>
              Analyze My Result
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
