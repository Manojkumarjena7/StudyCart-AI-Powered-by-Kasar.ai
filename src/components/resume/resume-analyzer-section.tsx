"use client";

import { useState } from "react";
import { CheckCircle2, Sparkles } from "lucide-react";
import { Badge } from "@/components/shared/ui/badge";
import { Button } from "@/components/shared/ui/button";
import { ResumeUploadDropzone } from "@/components/resume/resume-upload-dropzone";

const WHATS_INCLUDED = [
  "Resume structure review",
  "ATS-focused feedback",
  "Skills & keyword suggestions",
  "Experience feedback",
  "Project feedback",
];

const STEPS = [
  { step: "1", title: "Upload", description: "Add your resume PDF." },
  { step: "2", title: "AI Analysis", description: "We check structure, content, and ATS readiness." },
  { step: "3", title: "Get Insights", description: "See what to improve with clear suggestions." },
];

export function ResumeAnalyzerSection() {
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="analyzer" className="bg-bg-secondary/50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-cyan-light">
                Resume Analyzer
              </p>
              <Badge variant="neutral" className="px-2 py-0.5 text-[10px]">
                Coming soon
              </Badge>
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
              Check Your Resume
            </h2>
            <p className="mt-4 max-w-md text-base text-text-secondary">
              Upload your resume and discover what you can improve with practical,
              ATS-focused feedback — no AI jargon, just clear next steps.
            </p>

            <div className="mt-7 max-w-md">
              {!submitted ? (
                <>
                  <ResumeUploadDropzone file={file} onChange={setFile} />
                  <Button
                    variant="gradient"
                    className="mt-4 w-full"
                    disabled={!file}
                    onClick={() => setSubmitted(true)}
                  >
                    Analyze My Resume
                  </Button>
                </>
              ) : (
                <div className="rounded-xl border border-brand-cyan/25 bg-brand-cyan/5 p-5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 shrink-0 text-brand-cyan-light" />
                    <p className="text-sm font-semibold text-text-primary">
                      Thanks — resume analysis isn&apos;t live yet
                    </p>
                  </div>
                  <p className="mt-2 text-xs text-text-secondary">
                    We&apos;re building real, ATS-focused scoring — not a placeholder
                    number. Your file wasn&apos;t uploaded or stored anywhere. In the
                    meantime, study the resume examples above or the guide below.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFile(null);
                    }}
                    className="focus-ring mt-3 text-xs font-medium text-brand-cyan-light hover:underline"
                  >
                    Choose a different file
                  </button>
                </div>
              )}
            </div>

            <ul className="mt-7 grid max-w-md grid-cols-1 gap-2 sm:grid-cols-2">
              {WHATS_INCLUDED.map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs text-text-secondary">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col justify-center gap-5">
            {STEPS.map((s) => (
              <div key={s.step} className="flex items-start gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brand-cyan/30 bg-brand-cyan/10 text-sm font-semibold text-brand-cyan-light">
                  {s.step}
                </span>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{s.title}</p>
                  <p className="mt-0.5 text-xs text-text-secondary">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
