import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import { Badge } from "@/components/shared/ui/badge";
import type { TrendingExam } from "@/types/domain";

/**
 * Renders whatever active trending exam the trendingExamsRepository
 * returns. Content is designed to be Supabase-driven from day one —
 * this component never hardcodes exam-specific copy itself.
 */
export function TrendingBanner({ exam }: { exam: TrendingExam | null }) {
  if (!exam) return null;

  return (
    <div className="border-b border-border-subtle bg-gradient-to-r from-bg-secondary via-bg-secondary to-brand-blue/10">
      <Link
        href={exam.ctaHref}
        className="focus-ring group mx-auto flex max-w-7xl flex-col items-start gap-2 px-4 py-3 sm:flex-row sm:items-center sm:gap-4 sm:px-6 lg:px-8"
      >
        <Badge variant="trending" className="shrink-0">
          <Flame className="h-3 w-3" />
          {exam.label}
        </Badge>
        <p className="text-sm text-text-primary">
          <span className="font-semibold">{exam.title}.</span>{" "}
          <span className="text-text-secondary">{exam.description}</span>
        </p>
        <span className="ml-auto flex shrink-0 items-center gap-1 text-sm font-medium text-brand-cyan-light transition-transform group-hover:translate-x-0.5">
          {exam.ctaLabel}
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </Link>
    </div>
  );
}
