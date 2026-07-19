import { notFound } from "next/navigation";
import { studentResultsRepository } from "@/lib/supabase/repositories/studentResults.repository";
import { PageNav } from "@/components/shared/page-nav";
import { PerformanceInsights } from "@/components/results/performance-insights";
import { QuestionAnalysisList } from "@/components/results/question-analysis-list";
import { EmptyState } from "@/components/shared/empty-state";
import { FileQuestion } from "lucide-react";

export default async function DetailedAnalysisPage({
  params,
}: {
  params: Promise<{ resultId: string }>;
}) {
  const { resultId } = await params;
  const result = await studentResultsRepository.getById(resultId);

  if (!result) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-12 sm:px-6 lg:px-8">
      <PageNav backHref={`/result/${result.id}`} backLabel="Back to Result" showBrowserBack={false} />

      <div>
        <h1 className="text-2xl font-semibold text-text-primary sm:text-3xl">Detailed Analysis</h1>
        <p className="mt-1 text-sm text-text-secondary">{result.examName}</p>
      </div>

      <PerformanceInsights summary={result.scoreSummary} subjects={result.subjectPerformance} />

      <div>
        <h2 className="mb-3 text-lg font-semibold text-text-primary">Question-Wise Analysis</h2>
        {result.questions.length > 0 ? (
          <QuestionAnalysisList questions={result.questions} />
        ) : (
          <EmptyState
            icon={FileQuestion}
            title="No question-level detail available"
            description="This result doesn't have per-question data available for detailed breakdown."
          />
        )}
      </div>
    </div>
  );
}
