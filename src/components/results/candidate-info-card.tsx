import { Card, CardContent } from "@/components/shared/ui/card";
import type { CandidateInfo, ExamInfo } from "@/types/domain";

/**
 * Only renders fields that actually contain extracted values —
 * never shows empty placeholders per the product spec.
 */
export function CandidateInfoCard({
  candidate,
  exam,
}: {
  candidate: CandidateInfo;
  exam: ExamInfo;
}) {
  const fields: { label: string; value?: string }[] = [
    { label: "Candidate Name", value: candidate.name },
    { label: "Roll Number", value: candidate.rollNumber },
    { label: "Application Number", value: candidate.applicationNumber },
    { label: "Exam Name", value: exam.examName },
    { label: "Post", value: exam.post },
    { label: "Exam Date", value: exam.examDate },
    { label: "Shift", value: exam.shift },
    { label: "Centre", value: exam.centre },
    { label: "Category", value: candidate.category },
  ].filter((f) => Boolean(f.value));

  if (fields.length === 0) return null;

  return (
    <Card>
      <CardContent className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
        {fields.map((field) => (
          <div key={field.label}>
            <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
              {field.label}
            </p>
            <p className="mt-1 text-sm font-medium text-text-primary">{field.value}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
