"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, XCircle, MinusCircle } from "lucide-react";
import { Card, CardContent } from "@/components/shared/ui/card";
import { cn } from "@/lib/utils/cn";
import type { QuestionResult, QuestionOutcome } from "@/types/domain";

type FilterValue = "all" | QuestionOutcome;

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "correct", label: "Correct" },
  { value: "wrong", label: "Wrong" },
  { value: "skipped", label: "Skipped" },
];

const OUTCOME_STYLES: Record<QuestionOutcome, { icon: typeof CheckCircle2; text: string; bg: string }> = {
  correct: { icon: CheckCircle2, text: "text-success", bg: "bg-success/10" },
  wrong: { icon: XCircle, text: "text-error", bg: "bg-error/10" },
  skipped: { icon: MinusCircle, text: "text-text-secondary", bg: "bg-white/5" },
};

export function QuestionAnalysisList({ questions }: { questions: QuestionResult[] }) {
  const [filter, setFilter] = useState<FilterValue>("all");

  const filtered = useMemo(
    () => (filter === "all" ? questions : questions.filter((q) => q.outcome === filter)),
    [questions, filter]
  );

  const counts = useMemo(
    () => ({
      all: questions.length,
      correct: questions.filter((q) => q.outcome === "correct").length,
      wrong: questions.filter((q) => q.outcome === "wrong").length,
      skipped: questions.filter((q) => q.outcome === "skipped").length,
    }),
    [questions]
  );

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              "focus-ring rounded-lg border px-3.5 py-1.5 text-sm font-medium transition-colors",
              filter === f.value
                ? "border-brand-cyan/50 bg-brand-cyan/10 text-brand-cyan-light"
                : "border-border-subtle text-text-secondary hover:text-text-primary"
            )}
          >
            {f.label} <span className="ml-1 text-xs text-text-secondary">({counts[f.value]})</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-text-secondary">
            No questions match this filter.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((q) => {
            const style = OUTCOME_STYLES[q.outcome];
            const Icon = style.icon;
            return (
              <Card key={q.questionNumber}>
                <CardContent className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={cn("flex h-7 w-7 items-center justify-center rounded-full", style.bg)}>
                        <Icon className={cn("h-4 w-4", style.text)} />
                      </span>
                      <span className="text-sm font-medium text-text-primary">
                        Q{q.questionNumber}
                        {q.questionId && (
                          <span className="ml-1.5 text-xs text-text-secondary">({q.questionId})</span>
                        )}
                      </span>
                      <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-text-secondary">
                        {q.subject}
                      </span>
                    </div>
                    <span className={cn("text-sm font-semibold", style.text)}>
                      {q.marksAwarded > 0 ? "+" : ""}
                      {q.marksAwarded} marks
                    </span>
                  </div>

                  {q.questionText && <p className="text-sm text-text-primary">{q.questionText}</p>}

                  {q.options && q.options.length > 0 && (
                    <ul className="grid gap-1.5 sm:grid-cols-2">
                      {q.options.map((opt) => {
                        const isSelected = opt === q.selectedAnswer;
                        const isCorrect = opt === q.correctAnswer;
                        return (
                          <li
                            key={opt}
                            className={cn(
                              "rounded-md border px-3 py-1.5 text-xs",
                              isCorrect
                                ? "border-success/40 bg-success/10 text-success"
                                : isSelected
                                ? "border-error/40 bg-error/10 text-error"
                                : "border-border-subtle text-text-secondary"
                            )}
                          >
                            {opt}
                            {isCorrect && " ✓"}
                            {isSelected && !isCorrect && " (your answer)"}
                          </li>
                        );
                      })}
                    </ul>
                  )}

                  {(!q.options || q.options.length === 0) && (q.selectedAnswer || q.correctAnswer) && (
                    <div className="flex flex-wrap gap-4 text-xs text-text-secondary">
                      {q.selectedAnswer && (
                        <span>
                          Your answer: <span className="font-medium text-text-primary">{q.selectedAnswer}</span>
                        </span>
                      )}
                      {q.correctAnswer && (
                        <span>
                          Correct answer:{" "}
                          <span className="font-medium text-success">{q.correctAnswer}</span>
                        </span>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
