import Link from "next/link";
import { Users } from "lucide-react";
import { Button } from "@/components/shared/ui/button";

export function ContributeCta() {
  return (
    <section id="contribute" className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-border-subtle bg-bg-card px-6 py-8 text-center shadow-card sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <div className="flex items-start gap-3 sm:items-center">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-overlay-soft text-brand-blue">
            <Users className="h-4.5 w-4.5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-text-primary">Have a useful resource?</p>
            <p className="mt-1 max-w-md text-xs text-text-secondary">
              Share notes, cheat sheets, or guides with the KasarTech.ai community.
            </p>
          </div>
        </div>

        <Link href="/library/contribute" className="shrink-0">
          <Button type="button" variant="gradient">
            Contribute to the Library
          </Button>
        </Link>
      </div>
    </section>
  );
}
