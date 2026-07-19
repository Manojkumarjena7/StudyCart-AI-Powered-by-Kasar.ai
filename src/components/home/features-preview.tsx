import { CheckCircle2, XCircle, MinusCircle, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/shared/ui/card";
import { Badge } from "@/components/shared/ui/badge";

const features = [
  "Real candidate & exam information extraction",
  "Correct, wrong, and skipped question detection",
  "Automatic marking-scheme resolution",
  "Subject-wise accuracy and score breakdown",
  "Question-by-question detailed analysis",
  "Downloadable result report",
];

export function FeaturesPreview() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="text-2xl font-semibold text-text-primary sm:text-3xl">
            Exam Analysis Features
          </h2>
          <ul className="mt-6 space-y-3">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 text-sm text-text-secondary">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <Card className="relative overflow-hidden">
          <div className="absolute right-4 top-4">
            <Badge variant="neutral">Sample Preview</Badge>
          </div>
          <CardContent className="space-y-4">
            <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
              Performance Analysis Preview
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { icon: Sparkles, label: "Final Score", value: "72.5", color: "text-brand-cyan-light" },
                { icon: CheckCircle2, label: "Correct", value: "58", color: "text-success" },
                { icon: XCircle, label: "Wrong", value: "22", color: "text-error" },
                { icon: MinusCircle, label: "Skipped", value: "20", color: "text-text-secondary" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-lg border border-border-subtle bg-bg-secondary p-3">
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  <p className={`mt-2 text-lg font-semibold ${stat.color}`}>{stat.value}</p>
                  <p className="text-[11px] text-text-secondary">{stat.label}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-text-secondary">
              Illustrative example only — your real result will show your actual scores.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
