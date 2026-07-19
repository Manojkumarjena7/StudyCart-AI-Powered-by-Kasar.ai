"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Progress } from "@/components/shared/ui/progress";
import { PROCESSING_STEPS } from "@/types/domain";

export function ProcessingOverlay() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (stepIndex >= PROCESSING_STEPS.length - 1) return;
    const timer = setTimeout(() => setStepIndex((i) => i + 1), 550);
    return () => clearTimeout(timer);
  }, [stepIndex]);

  const progress = ((stepIndex + 1) / PROCESSING_STEPS.length) * 100;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-bg-primary/95 backdrop-blur-sm">
      <div className="w-full max-w-md px-6">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-cyan-light" />
          <h2 className="text-lg font-semibold text-text-primary">Analyzing your result</h2>
          <p className="text-sm text-text-secondary">This usually takes a few seconds.</p>
        </div>

        <Progress value={progress} className="mb-6" />

        <ul className="space-y-3">
          {PROCESSING_STEPS.map((step, i) => {
            const done = i < stepIndex;
            const active = i === stepIndex;
            return (
              <li key={step} className="flex items-center gap-3 text-sm">
                {done ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                ) : active ? (
                  <Loader2 className="h-4 w-4 shrink-0 animate-spin text-brand-cyan-light" />
                ) : (
                  <span className="h-4 w-4 shrink-0 rounded-full border border-border-subtle" />
                )}
                <span
                  className={
                    done
                      ? "text-text-secondary line-through"
                      : active
                      ? "font-medium text-text-primary"
                      : "text-text-secondary/60"
                  }
                >
                  {step}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
