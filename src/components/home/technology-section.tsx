import { ScanSearch, BookMarked, Lightbulb } from "lucide-react";

const STEPS = [
  {
    icon: ScanSearch,
    title: "Analyze",
    description: "Your resume or response sheet is parsed for real — content is extracted directly, not guessed.",
  },
  {
    icon: BookMarked,
    title: "Match against references",
    description: "Findings are compared against a curated library of reviewed examples and rules, kept current by our team.",
  },
  {
    icon: Lightbulb,
    title: "Recommend",
    description: "You get specific, actionable suggestions — not a vague score with no explanation.",
  },
];

export function TechnologySection() {
  return (
    <section className="bg-bg-secondary/50 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-cyan-light">How it works</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
            AI-assisted, reference-backed — not a black box
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-text-secondary sm:text-base">
            StudyCart doesn&apos;t pretend a model can replace a real review. Analysis is grounded in a
            curated reference library that our team maintains and improves over time.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.title} className="rounded-2xl border border-border-subtle bg-bg-card p-6 text-center">
              <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-brand-cyan/10">
                <step.icon className="h-5 w-5 text-brand-cyan-light" />
              </span>
              <h3 className="mt-4 text-sm font-semibold text-text-primary">{step.title}</h3>
              <p className="mt-2 text-sm text-text-secondary">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
