import { LibrarySearch } from "@/components/library/library-search";

export function LibraryHero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[480px] opacity-60"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 0%, rgba(14,122,95,0.14) 0%, rgba(32,211,154,0.06) 45%, transparent 80%)",
        }}
      />
      <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-cyan-light">
          Learn · Practice · Grow
        </p>
        <h1 className="mt-4 text-balance text-5xl font-semibold leading-[1.05] tracking-tight text-text-primary sm:text-6xl">
          Learning Library
        </h1>
        <p className="mt-6 text-balance text-lg font-medium text-text-primary sm:text-xl">
          Learn practical skills, prepare for interviews, and grow your career.
        </p>
        <p className="mt-3 text-balance text-sm text-text-secondary sm:text-base">
          Courses, videos, study materials and interview resources — all in one place.
        </p>

        <div className="mx-auto mt-10 max-w-2xl">
          <LibrarySearch />
        </div>
      </div>
    </section>
  );
}
