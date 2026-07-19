import Link from "next/link";
import { Card } from "@/components/shared/ui/card";
import { Badge } from "@/components/shared/ui/badge";
import { ecosystemModules } from "@/config/site";

export function EcosystemPreview() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <h2 className="text-center text-2xl font-semibold text-text-primary sm:text-3xl">
        The Growing Student Ecosystem
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-center text-sm text-text-secondary">
        Exam Analyzer is the first piece. Here&apos;s what&apos;s planned next.
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ecosystemModules.map((mod) => (
          <Link key={mod.label} href={mod.href}>
            <Card className="h-full p-5 transition-colors hover:border-brand-cyan/40">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-text-primary">{mod.label}</h3>
                <Badge variant={mod.status === "live" ? "success" : "neutral"} className="shrink-0">
                  {mod.status === "live" ? "Live" : "Coming Soon"}
                </Badge>
              </div>
              <p className="mt-2 text-sm text-text-secondary">{mod.description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
