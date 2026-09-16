"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ResumeExampleCard } from "@/components/resume/resume-example-card";
import type { ResumeExample } from "@/config/resume-examples";

interface ResumeExamplesCarouselProps {
  examples: ResumeExample[];
  onView: (example: ResumeExample) => void;
}

export function ResumeExamplesCarousel({ examples, onView }: ResumeExamplesCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  function updateEdges() {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }

  function scrollByCard(direction: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-resume-card]");
    const amount = (card?.offsetWidth ?? el.clientWidth * 0.85) + 16;
    el.scrollBy({ left: direction * amount, behavior: "smooth" });
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          disabled={atStart}
          aria-label="Previous resume examples"
          className="focus-ring flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle text-text-secondary transition-colors hover:text-brand-cyan-light disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          disabled={atEnd}
          aria-label="Next resume examples"
          className="focus-ring flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle text-text-secondary transition-colors hover:text-brand-cyan-light disabled:opacity-30"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div
        ref={trackRef}
        onScroll={updateEdges}
        role="region"
        aria-label="Resume examples"
        className="scrollbar-thin flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2"
      >
        {examples.map((example) => (
          <div
            key={example.id}
            data-resume-card
            className="w-[85%] shrink-0 snap-center sm:w-[46%] lg:w-[calc(25%-0.75rem)]"
          >
            <ResumeExampleCard example={example} onView={onView} />
          </div>
        ))}
      </div>
    </div>
  );
}
