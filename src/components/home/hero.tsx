"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/shared/ui/button";
import { brandConfig } from "@/config/brand";
import { CareerDashboardMockup } from "@/components/home/mockups/career-dashboard-mockup";
import { ResumeAnalysisMockup } from "@/components/home/mockups/resume-analysis-mockup";
import { LearningLibraryMockup } from "@/components/home/mockups/learning-library-mockup";
import { JobListingMockup } from "@/components/home/mockups/job-listing-mockup";
import { InterviewTrackerMockup } from "@/components/home/mockups/interview-tracker-mockup";
import { EcosystemMockup } from "@/components/home/mockups/ecosystem-mockup";

const AUTO_ADVANCE_MS = 6000;

const SLIDES = [
  {
    eyebrow: "StudyCart AI Interview Support",
    title: "Your AI-Powered IT Interview & Career Support",
    description:
      "One platform to strengthen your resume, learn what actually helps you get hired, and find IT jobs with referral support.",
    cta: { label: "Get Started", href: "/resume" },
    Visual: CareerDashboardMockup,
  },
  {
    eyebrow: "Resume",
    title: "Improve Your Resume",
    description:
      "Upload your resume and see it checked against a curated reference library — clear issues, clear suggestions.",
    cta: { label: "Improve My Resume", href: "/resume" },
    Visual: ResumeAnalysisMockup,
  },
  {
    eyebrow: "Learn",
    title: "Learn What Helps You Get Hired",
    description:
      "A curated library of automation, testing, AI, and programming content — built for interview readiness, not just theory.",
    cta: { label: "Explore the Library", href: "/library" },
    Visual: LearningLibraryMockup,
  },
  {
    eyebrow: "Get Hired",
    title: "Find IT Jobs & Opportunities",
    description: "Browse IT job listings with referral support, then apply directly with the company.",
    cta: { label: "Browse Jobs", href: "/jobs" },
    Visual: JobListingMockup,
  },
  {
    eyebrow: "Interview",
    title: "Prepare. Practice. Track.",
    description:
      "Track interview stages, HR feedback, and outcomes through Interview Management — our dedicated interview-tracking application.",
    cta: { label: "See Interview Support", href: "#interview-support" },
    Visual: InterviewTrackerMockup,
  },
  {
    eyebrow: "One Platform",
    title: "One Platform for Your Career Journey",
    description: "Resume, Learn, Get Hired, and Interview Support — working together, in one place.",
    cta: { label: "Explore StudyCart", href: "#how-it-helps" },
    Visual: EcosystemMockup,
  },
];

export function Hero() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((i: number) => {
    setIndex(((i % SLIDES.length) + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (paused || reduceMotion) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, AUTO_ADVANCE_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, reduceMotion]);

  const slide = SLIDES[index];
  const Visual = slide.Visual;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="StudyCart product overview"
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px] opacity-60"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 0%, rgba(37,99,235,0.16) 0%, rgba(6,182,212,0.06) 45%, transparent 80%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-brand-cyan-light">
          {brandConfig.productShortName} · {brandConfig.endorsementText}
        </p>

        <div className="mt-10 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="text-center lg:text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-secondary">
                  {slide.eyebrow}
                </p>
                <h1 className="mt-3 text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
                  {slide.title}
                </h1>
                <p className="mx-auto mt-5 max-w-xl text-balance text-base text-text-secondary sm:text-lg lg:mx-0">
                  {slide.description}
                </p>
                <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                  <Link href={slide.cta.href}>
                    <Button variant="gradient" size="lg">
                      {slide.cta.label}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/analyzer">
                    <Button variant="outline" size="lg">
                      Try AI Result Analyzer
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-9 flex items-center justify-center gap-2 lg:justify-start">
              <button
                type="button"
                aria-label="Previous slide"
                onClick={() => goTo(index - 1)}
                className="focus-ring flex h-8 w-8 items-center justify-center rounded-full border border-border-subtle text-text-secondary hover:text-brand-cyan-light"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-1.5" role="tablist" aria-label="Slides">
                {SLIDES.map((s, i) => (
                  <button
                    key={s.title}
                    type="button"
                    role="tab"
                    aria-selected={i === index}
                    aria-label={`Go to slide ${i + 1}: ${s.title}`}
                    onClick={() => goTo(i)}
                    className={`focus-ring h-1.5 rounded-full transition-all duration-300 ${
                      i === index ? "w-6 bg-brand-cyan-light" : "w-1.5 bg-overlay-strong hover:bg-brand-cyan/40"
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                aria-label="Next slide"
                onClick={() => goTo(index + 1)}
                className="focus-ring flex h-8 w-8 items-center justify-center rounded-full border border-border-subtle text-text-secondary hover:text-brand-cyan-light"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mx-auto w-full max-w-md lg:max-w-none">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={reduceMotion ? undefined : { opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <Visual />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
