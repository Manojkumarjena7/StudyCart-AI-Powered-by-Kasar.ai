import { TrendingUp, TrendingDown, AlertTriangle, Target } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/shared/ui/card";
import type { ScoreSummary, SubjectPerformance } from "@/types/domain";

/**
 * Insights derived purely from the already-calculated scoring data —
 * no AI-generated or speculative claims, only arithmetic facts about
 * this result.
 */
export function PerformanceInsights({
  summary,
  subjects,
}: {
  summary: ScoreSummary;
  subjects: SubjectPerformance[];
}) {
  const withAttempts = subjects.filter((s) => s.correct + s.wrong > 0);
  const strongest = withAttempts.length
    ? withAttempts.reduce((best, s) => (s.accuracy > best.accuracy ? s : best))
    : null;
  const weakest = withAttempts.length
    ? withAttempts.reduce((worst, s) => (s.accuracy < worst.accuracy ? s : worst))
    : null;

  const attemptRate =
    summary.totalQuestions > 0 ? Math.round((summary.attempted / summary.totalQuestions) * 100) : 0;

  const insights = [
    strongest && {
      icon: TrendingUp,
      color: "text-success",
      bg: "bg-success/10",
      label: "Strongest subject",
      value: `${strongest.subject} (${strongest.accuracy}% accuracy)`,
    },
    weakest && {
      icon: TrendingDown,
      color: "text-warning",
      bg: "bg-warning/10",
      label: "Needs the most attention",
      value: `${weakest.subject} (${weakest.accuracy}% accuracy)`,
    },
    {
      icon: AlertTriangle,
      color: "text-error",
      bg: "bg-error/10",
      label: "Marks lost to negative marking",
      value: `${summary.negativeMarks} marks (${summary.wrong} wrong answers)`,
    },
    {
      icon: Target,
      color: "text-brand-cyan-light",
      bg: "bg-brand-cyan/10",
      label: "Questions attempted",
      value: `${summary.attempted} of ${summary.totalQuestions} (${attemptRate}%)`,
    },
  ].filter((i): i is NonNullable<typeof i> => Boolean(i));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          {insights.map((insight) => (
            <div key={insight.label} className="flex items-start gap-3">
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${insight.bg}`}>
                <insight.icon className={`h-4.5 w-4.5 ${insight.color}`} />
              </span>
              <div>
                <p className="text-xs text-text-secondary">{insight.label}</p>
                <p className="text-sm font-medium text-text-primary">{insight.value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
