import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/shared/ui/button";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24">
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[420px] opacity-60"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 100%, rgba(6,182,212,0.14) 0%, rgba(37,99,235,0.06) 45%, transparent 80%)",
        }}
      />
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-balance text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          Build your career. Get hired. Grow.
        </h2>
        <p className="mt-4 text-balance text-base text-text-secondary sm:text-lg">
          Resume support, a learning library, and IT jobs with referral support — one platform for your
          career journey.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/resume">
            <Button variant="gradient" size="lg">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/library">
            <Button variant="outline" size="lg">
              Explore the Library
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
