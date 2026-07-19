import { CheckCircle2, XCircle, MinusCircle, Target, TrendingDown, Sparkles } from "lucide-react";
import { Card } from "@/components/shared/ui/card";
import { cn } from "@/lib/utils/cn";
import type { ScoreSummary } from "@/types/domain";

export function SummaryCards({ summary }: { summary: ScoreSummary }) {
  const cards = [
    {
      label: "Final Score",
      value: summary.finalScore,
      icon: Sparkles,
      accent: "text-brand-cyan-light",
      bg: "bg-brand-cyan/10",
    },
    {
      label: "Correct",
      value: summary.correct,
      icon: CheckCircle2,
      accent: "text-success",
      bg: "bg-success/10",
    },
    {
      label: "Wrong",
      value: summary.wrong,
      icon: XCircle,
      accent: "text-error",
      bg: "bg-error/10",
    },
    {
      label: "Skipped",
      value: summary.skipped,
      icon: MinusCircle,
      accent: "text-text-secondary",
      bg: "bg-white/5",
    },
    {
      label: "Accuracy",
      value: `${summary.accuracy}%`,
      icon: Target,
      accent: "text-brand-cyan-light",
      bg: "bg-brand-cyan/10",
    },
    {
      label: "Negative Marks",
      value: `-${summary.negativeMarks}`,
      icon: TrendingDown,
      accent: "text-warning",
      bg: "bg-warning/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {cards.map(({ label, value, icon: Icon, accent, bg }) => (
        <Card key={label} className="p-4">
          <span className={cn("mb-3 flex h-8 w-8 items-center justify-center rounded-lg", bg)}>
            <Icon className={cn("h-4 w-4", accent)} />
          </span>
          <p className={cn("text-2xl font-semibold", accent)}>{value}</p>
          <p className="mt-0.5 text-xs text-text-secondary">{label}</p>
        </Card>
      ))}
    </div>
  );
}
