import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/shared/ui/button";
import { Badge } from "@/components/shared/ui/badge";
import { ResumeHeroMockup } from "@/components/resume/resume-hero-mockup";

const TRUST_POINTS = ["Real examples", "ATS-focused guidance", "No login required to browse"];

export function ResumeHero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[480px] opacity-60"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 0%, rgba(37,99,235,0.14) 0%, rgba(6,182,212,0.05) 45%, transparent 80%)",
        }}
      />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <Badge variant="neutral" className="mb-4">
              Resume
            </Badge>
            <h1 className="text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-text-primary sm:text-5xl">
              Build a Resume That Gets You Hired
            </h1>
            <p className="mt-5 max-w-lg text-balance text-base text-text-secondary sm:text-lg">
              Explore professional IT resume examples, check your own resume, and learn
              how to present your skills, projects, and experience better.
            </p>

            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
              {TRUST_POINTS.map((point) => (
                <li key={point} className="flex items-center gap-1.5 text-xs text-text-secondary">
                  <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                  {point}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="#examples">
                <Button variant="gradient" size="lg" className="w-full sm:w-auto">
                  Explore Resume Examples
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#analyzer">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Analyze My Resume
                </Button>
              </Link>
            </div>

            <p className="mt-4 text-xs text-text-secondary">
              Guidance and structure — not a guarantee of ATS approval or a job offer.
            </p>
          </div>

          <div className="flex justify-center lg:justify-end">
            <ResumeHeroMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
