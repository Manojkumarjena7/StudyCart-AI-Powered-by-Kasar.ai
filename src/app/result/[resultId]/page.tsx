import { notFound } from "next/navigation";
import { studentResultsRepository } from "@/lib/supabase/repositories/studentResults.repository";
import { CandidateInfoCard } from "@/components/results/candidate-info-card";
import { SummaryCards } from "@/components/results/summary-cards";
import { OverallPerformanceTable } from "@/components/results/overall-performance-table";
import { SubjectWisePerformanceTable } from "@/components/results/subject-wise-performance-table";
import { PerformanceCharts } from "@/components/results/performance-charts";
import { CommunityRankCard } from "@/components/ranking/community-rank-card";
import { Module2Cta } from "@/components/results/module2-cta";
import { DownloadResultButton } from "@/components/results/download-result-button";
import { PageNav } from "@/components/shared/page-nav";

export default async function ResultPage({
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
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-12 sm:px-6 lg:px-8">
      <PageNav showBrowserBack={false} />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary sm:text-3xl">Your Result</h1>
          <p className="mt-1 text-sm text-text-secondary">{result.examName}</p>
        </div>
        <DownloadResultButton result={result} />
      </div>

      <CandidateInfoCard candidate={result.candidate} exam={result.exam} />
      <SummaryCards summary={result.scoreSummary} />
      <div className="grid gap-6 lg:grid-cols-2">
        <OverallPerformanceTable summary={result.scoreSummary} />
        <CommunityRankCard
          ranking={result.ranking}
          category={result.candidate.category}
          gender={result.candidate.gender}
        />
      </div>
      <SubjectWisePerformanceTable subjects={result.subjectPerformance} />
      <PerformanceCharts summary={result.scoreSummary} subjects={result.subjectPerformance} />
      <Module2Cta resultId={result.id} />
    </div>
  );
}
