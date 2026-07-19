import { LinkIcon, ListChecks, Cpu, LineChart } from "lucide-react";
import { Card } from "@/components/shared/ui/card";

const steps = [
  {
    icon: LinkIcon,
    title: "Paste or upload",
    description: "Paste your response-sheet URL or upload the PDF you downloaded.",
  },
  {
    icon: ListChecks,
    title: "Tell us a bit about you",
    description: "Pick your category, optionally add gender, and consent to processing.",
  },
  {
    icon: Cpu,
    title: "We do the parsing",
    description: "Your candidate, exam, and question data is extracted and scored automatically.",
  },
  {
    icon: LineChart,
    title: "See your real performance",
    description: "Score, accuracy, subject-wise breakdown, and community rank — all in one place.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <h2 className="text-center text-2xl font-semibold text-text-primary sm:text-3xl">How It Works</h2>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <Card key={step.title} className="relative p-5">
            <span className="absolute right-4 top-4 text-3xl font-semibold text-white/5">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-cyan/10">
              <step.icon className="h-5 w-5 text-brand-cyan-light" />
            </span>
            <h3 className="mt-4 text-sm font-semibold text-text-primary">{step.title}</h3>
            <p className="mt-1.5 text-sm text-text-secondary">{step.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
