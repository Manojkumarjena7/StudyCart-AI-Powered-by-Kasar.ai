import Link from "next/link";
import { ArrowRight, Microscope } from "lucide-react";
import { Card, CardContent } from "@/components/shared/ui/card";
import { Button } from "@/components/shared/ui/button";

export function Module2Cta({ resultId }: { resultId: string }) {
  return (
    <Card className="border-brand-cyan/25 bg-gradient-to-br from-bg-card to-brand-blue/5">
      <CardContent className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-cyan/10">
            <Microscope className="h-5 w-5 text-brand-cyan-light" />
          </span>
          <div>
            <h3 className="text-base font-semibold text-text-primary">
              Want to know exactly where you lost marks?
            </h3>
            <p className="mt-1 max-w-md text-sm text-text-secondary">
              Get question-wise analysis, weak-subject insights, negative-marking analysis, and
              personalized performance recommendations.
            </p>
          </div>
        </div>
        <Link href={`/analysis/${resultId}`} className="w-full sm:w-auto">
          <Button variant="gradient" className="w-full sm:w-auto">
            View Detailed Analysis
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
