import Link from "next/link";
import type { LibraryContentPillar } from "@/lib/library/types";
import { LibraryIcon } from "@/components/library/library-icon";

export function LibraryCategoryCards({ pillars }: { pillars: LibraryContentPillar[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {pillars.map((pillar) => (
        <Link
          key={pillar.id}
          href={pillar.href}
          className="focus-ring group rounded-2xl border border-border-subtle bg-bg-card p-4 shadow-card transition-colors hover:border-brand-cyan/40 sm:p-5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-overlay-soft text-brand-blue transition-colors group-hover:bg-brand-blue group-hover:text-white">
            <LibraryIcon name={pillar.icon} className="h-5 w-5" />
          </div>
          <p className="mt-3 text-sm font-semibold text-text-primary">{pillar.title}</p>
          <p className="mt-1 text-xs text-text-secondary">{pillar.description}</p>
        </Link>
      ))}
    </div>
  );
}
