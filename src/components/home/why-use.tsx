import { ShieldCheck, Gauge, BarChart3, Users } from "lucide-react";
import { Card, CardContent } from "@/components/shared/ui/card";

const reasons = [
  {
    icon: Gauge,
    title: "Accurate, real scoring",
    description:
      "Your response sheet is parsed for real — candidate details, questions, and answers are extracted directly, not guessed.",
  },
  {
    icon: BarChart3,
    title: "Subject-wise clarity",
    description: "See exactly which subjects you're strong in and where you're losing marks.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy-respecting",
    description: "Your uploaded PDF or response-sheet URL is processed and never permanently stored.",
  },
  {
    icon: Users,
    title: "Know where you stand",
    description: "Compare your score against other analyzed results — anonymously and only if you consent.",
  },
];

export function WhyUse() {
  return (
    <section className="bg-bg-secondary/50 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-semibold text-text-primary sm:text-3xl">
          Why Use This Platform
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason) => (
            <Card key={reason.title} className="p-5">
              <CardContent className="p-0">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-cyan/10">
                  <reason.icon className="h-5 w-5 text-brand-cyan-light" />
                </span>
                <h3 className="mt-4 text-sm font-semibold text-text-primary">{reason.title}</h3>
                <p className="mt-1.5 text-sm text-text-secondary">{reason.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
