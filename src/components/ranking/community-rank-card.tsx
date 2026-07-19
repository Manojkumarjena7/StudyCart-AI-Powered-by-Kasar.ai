import { Trophy, Users, Info } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/shared/ui/card";
import { rankingDisclaimer } from "@/config/site";
import type { Category, Gender, RankingResult } from "@/types/domain";

export function CommunityRankCard({
  ranking,
  category,
  gender,
}: {
  ranking: RankingResult;
  category?: Category;
  gender?: Gender;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Community Rank</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 rounded-xl border border-border-subtle bg-bg-secondary p-5">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-cyan/10">
            <Trophy className="h-6 w-6 text-brand-cyan-light" />
          </span>
          <div>
            <p className="text-2xl font-semibold text-text-primary">
              #{ranking.overallRank.toLocaleString("en-IN")}
            </p>
            <p className="flex items-center gap-1.5 text-sm text-text-secondary">
              <Users className="h-3.5 w-3.5" />
              Among {ranking.totalCandidates.toLocaleString("en-IN")} analyzed results
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <RankStat label="Overall Rank" rank={ranking.overallRank} total={ranking.totalCandidates} />
          {category && ranking.categoryRank && (
            <RankStat
              label={`Category Rank (${category})`}
              rank={ranking.categoryRank}
              total={ranking.categoryTotalCandidates}
            />
          )}
          {gender && ranking.genderRank && (
            <RankStat
              label="Gender Rank"
              rank={ranking.genderRank}
              total={ranking.genderTotalCandidates}
            />
          )}
        </div>

        <p className="mt-5 flex items-start gap-2 text-xs text-text-secondary">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {rankingDisclaimer}
        </p>
      </CardContent>
    </Card>
  );
}

function RankStat({ label, rank, total }: { label: string; rank: number; total?: number }) {
  return (
    <div className="rounded-lg border border-border-subtle bg-bg-secondary/60 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">{label}</p>
      <p className="mt-1 text-lg font-semibold text-text-primary">
        #{rank.toLocaleString("en-IN")}
        {total && (
          <span className="ml-1 text-xs font-normal text-text-secondary">
            / {total.toLocaleString("en-IN")}
          </span>
        )}
      </p>
    </div>
  );
}
