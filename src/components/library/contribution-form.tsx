"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/shared/ui/input";
import { Select } from "@/components/shared/ui/select";
import { Checkbox } from "@/components/shared/ui/checkbox";
import { Button } from "@/components/shared/ui/button";
import { Card, CardContent } from "@/components/shared/ui/card";
import { PdfUploadDropzone } from "@/components/library/pdf-upload-dropzone";
import { submitContributionAction } from "@/lib/library/contribution-actions";
import type { LibraryCategory } from "@/lib/library/types";

interface ContributionFormProps {
  categories: LibraryCategory[];
}

export function ContributionForm({ categories }: ContributionFormProps) {
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [topic, setTopic] = useState("");
  const [contributorName, setContributorName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function validate(): string | null {
    if (!title.trim()) return "Please enter a resource title.";
    if (!description.trim()) return "Please enter a short description.";
    if (!categoryId) return "Please select a category.";
    if (!file) return "Please upload a PDF file.";
    if (!agreed) return "Please confirm you have the right to share this document.";
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

    startTransition(async () => {
      const result = await submitContributionAction({
        title: title.trim(),
        description: description.trim(),
        categoryId,
        topic: topic.trim() || undefined,
        contributorName: contributorName.trim() || undefined,
        file: file as File,
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSubmitted(true);
    });
  }

  if (submitted) {
    return (
      <Card className="mx-auto max-w-xl">
        <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
            <CheckCircle2 className="h-6 w-6 text-success" />
          </span>
          <h2 className="text-xl font-semibold text-text-primary">Submitted — Pending Review</h2>
          <p className="max-w-sm text-sm text-text-secondary">
            Thanks for contributing! Your resource has been submitted and will appear in
            Study Materials once it&apos;s reviewed and approved.
          </p>
          <Link href="/library" className="focus-ring mt-2">
            <Button variant="secondary">Back to Library</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-xl">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label htmlFor="contribution-title" className="mb-1.5 block text-sm font-medium text-text-primary">
              Resource Title *
            </label>
            <Input
              id="contribution-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Java Interview Questions PDF"
              maxLength={120}
            />
          </div>

          <div>
            <label htmlFor="contribution-description" className="mb-1.5 block text-sm font-medium text-text-primary">
              Description *
            </label>
            <textarea
              id="contribution-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write a short description about this resource..."
              rows={3}
              maxLength={400}
              className="focus-ring w-full rounded-lg border border-border-subtle bg-bg-secondary px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/70 transition-colors focus-visible:border-brand-cyan-light/60"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="contribution-category" className="mb-1.5 block text-sm font-medium text-text-primary">
                Category *
              </label>
              <Select
                id="contribution-category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                placeholder="Select category"
                options={categories.map((c) => ({ value: c.id, label: c.label }))}
              />
            </div>
            <div>
              <label htmlFor="contribution-topic" className="mb-1.5 block text-sm font-medium text-text-primary">
                Topic
              </label>
              <Input
                id="contribution-topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Spring Boot"
                maxLength={60}
              />
            </div>
          </div>

          <div>
            <label htmlFor="contribution-name" className="mb-1.5 block text-sm font-medium text-text-primary">
              Contributor Name (optional)
            </label>
            <Input
              id="contribution-name"
              value={contributorName}
              onChange={(e) => setContributorName(e.target.value)}
              placeholder="e.g. Alex"
              maxLength={80}
            />
          </div>

          <div>
            <p className="mb-1.5 text-sm font-medium text-text-primary">PDF Upload *</p>
            <PdfUploadDropzone file={file} onChange={setFile} />
          </div>

          <label className="flex items-start gap-2.5 text-sm text-text-secondary">
            <Checkbox checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5" />
            I confirm I have the right to share this document and agree it will be
            reviewed before it appears in the Library.
          </label>

          {error && (
            <p className="flex items-center gap-1.5 text-sm text-error">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </p>
          )}

          <Button type="submit" variant="gradient" className="w-full" disabled={isPending}>
            {isPending ? "Submitting..." : "Submit for Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
