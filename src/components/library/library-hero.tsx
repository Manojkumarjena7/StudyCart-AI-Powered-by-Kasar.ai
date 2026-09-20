import { Badge } from "@/components/shared/ui/badge";
import { LibrarySearch } from "@/components/library/library-search";

export function LibraryHero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] opacity-60"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 0%, rgba(14,122,95,0.14) 0%, rgba(32,211,154,0.06) 45%, transparent 80%)",
        }}
      />
      <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
        <Badge variant="neutral">Learning Library</Badge>
        <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-text-primary sm:text-5xl">
          Learning Library
        </h1>
        <p className="mt-5 text-balance text-base text-text-secondary sm:text-lg">
          Learn practical skills, prepare for interviews, and grow your career with
          curated resources.
        </p>

        <div className="mx-auto mt-8 max-w-xl">
          <LibrarySearch />
        </div>
      </div>
    </section>
  );
}
