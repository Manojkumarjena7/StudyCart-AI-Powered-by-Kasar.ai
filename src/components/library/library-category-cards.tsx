import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { LibraryContentPillar } from "@/lib/library/types";
import { LibraryIcon } from "@/components/library/library-icon";

// Presentational-only copy for each pillar's action link — keyed by pillar id, not a
// repository/data field, so this stays a pure UI concern.
const PILLAR_LINK_LABEL: Record<string, string> = {
  courses: "Explore Courses",
  materials: "Browse Materials",
  practice: "Start Practicing",
  community: "Coming Soon",
};

export function LibraryCategoryCards({ pillars }: { pillars: LibraryContentPillar[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4 lg:gap-6">
      {pillars.map((pillar) => (
        <Link
          key={pillar.id}
          href={pillar.href}
          className="focus-ring group rounded-2xl border border-border-subtle bg-bg-card p-5 shadow-card transition-colors hover:border-brand-cyan/40 sm:p-6"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-overlay-soft text-brand-blue transition-colors group-hover:bg-brand-blue group-hover:text-white">
            <LibraryIcon name={pillar.icon} className="h-7 w-7" />
          </div>
          <p className="mt-4 text-lg font-semibold text-text-primary">{pillar.title}</p>
          <p className="mt-1.5 text-sm text-text-secondary">{pillar.description}</p>
          <p className="mt-4 flex items-center gap-1 text-sm font-medium text-brand-blue">
            {PILLAR_LINK_LABEL[pillar.id] ?? "Explore"}
            <ArrowRight className="h-3.5 w-3.5" />
          </p>
        </Link>
      ))}
    </div>
  );
}
