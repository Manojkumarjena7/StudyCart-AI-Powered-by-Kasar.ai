import { LayoutList, KeyRound, TrendingUp, Code2, Sparkles, ArrowRight } from "lucide-react";

const STEPS = [
  {
    number: "01",
    title: "Structure",
    description: "Keep your resume clear, concise, and well organized.",
    icon: LayoutList,
  },
  {
    number: "02",
    title: "Keywords",
    description: "Use relevant technical skills and keywords for the role.",
    icon: KeyRound,
  },
  {
    number: "03",
    title: "Impact",
    description: "Show measurable achievements, not just responsibilities.",
    icon: TrendingUp,
  },
  {
    number: "04",
    title: "Projects",
    description: "Explain projects with clear technical detail.",
    icon: Code2,
  },
  {
    number: "05",
    title: "Polish",
    description: "Proofread and keep formatting clean and consistent.",
    icon: Sparkles,
  },
];

export function ResumeGuideSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-cyan-light">
        Resume Guide
      </p>
      <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
        How to Improve Your Resume
      </h2>
      <p className="mt-3 max-w-xl text-base text-text-secondary">
        Follow these key principles to create a strong, ATS-friendly resume.
      </p>

      <div className="mt-12 flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-2">
        {STEPS.map((step, i) => (
          <div key={step.number} className="flex flex-1 items-start gap-4 lg:flex-col lg:items-start lg:gap-3">
            <div className="flex items-center gap-3 lg:flex-col lg:items-start lg:gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-cyan/10 text-brand-cyan-light">
                <step.icon className="h-5 w-5" />
              </span>
              <span className="text-xs font-mono text-text-secondary lg:hidden">{step.number}</span>
            </div>
            <div className="flex-1 lg:mt-1">
              <p className="text-sm font-semibold text-text-primary">
                <span className="mr-1.5 hidden font-mono text-xs text-text-secondary lg:inline">
                  {step.number}
                </span>
                {step.title}
              </p>
              <p className="mt-1 max-w-[16rem] text-xs text-text-secondary">{step.description}</p>
            </div>

            {i < STEPS.length - 1 && (
              <ArrowRight className="mt-2 hidden h-4 w-4 shrink-0 text-border-subtle lg:mt-4 lg:block" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
