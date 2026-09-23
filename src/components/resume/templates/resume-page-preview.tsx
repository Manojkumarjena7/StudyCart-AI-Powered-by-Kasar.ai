"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Minus, Plus, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const A4_WIDTH_PX = 794; // 210mm @ 96dpi — the template's own CSS module also sizes to 210mm.
const ZOOM_MIN = 50;
const ZOOM_MAX = 150;
const ZOOM_STEP = 10;

type ZoomState = { mode: "fit" } | { mode: "manual"; percent: number };

/**
 * Wraps a template renderer as a document canvas with its own zoom controls
 * (− / percentage / + / Fit), Phase 5d. Zoom only ever affects this canvas via
 * a CSS `transform: scale()` on the page element — it never touches the
 * surrounding application layout, and it is never implemented via the
 * browser's own page zoom.
 *
 * Stability fix (Phase 5d): this component's auto-"Fit" scale is derived from
 * its container's measured width via ResizeObserver. Previously that container
 * sat inside a `min-h-screen` page that could grow taller than the viewport,
 * so the browser's own scrollbar toggled on/off as content height crossed that
 * boundary — which changed this container's width — which changed the
 * computed scale — which changed this component's own height — which could
 * flip the scrollbar again. That was the source of the reported
 * blinking/reflow. The fix lives in the parent shell (see
 * resume-workspace.tsx / app/resume/build/page.tsx, both now fixed to the
 * viewport with their own contained scroll areas) — this component doesn't
 * need to know about that, but only behaves correctly because of it.
 */
export function ResumePagePreview({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const [fitScale, setFitScale] = useState(1);
  const [contentHeight, setContentHeight] = useState<number | undefined>(undefined);
  const [zoom, setZoom] = useState<ZoomState>({ mode: "fit" });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const updateFitScale = () => {
      const width = container.clientWidth;
      setFitScale(width > 0 ? Math.min(1, width / A4_WIDTH_PX) : 1);
    };
    updateFitScale();
    const observer = new ResizeObserver(updateFitScale);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;
    const updateHeight = () => setContentHeight(page.scrollHeight);
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(page);
    return () => observer.disconnect();
  }, [children]);

  const activeScale = zoom.mode === "fit" ? fitScale : zoom.percent / 100;
  const displayPercent = Math.round(activeScale * 100);

  function zoomBy(delta: number) {
    setZoom((prev) => {
      const current = prev.mode === "fit" ? Math.round(fitScale * 100) : prev.percent;
      const next = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, current + delta));
      return { mode: "manual", percent: next };
    });
  }

  return (
    <div className="flex h-full flex-col">
      <div ref={containerRef} className="min-h-0 flex-1 overflow-auto">
        <div style={{ height: contentHeight ? contentHeight * activeScale : undefined }}>
          <div
            ref={pageRef}
            style={{ width: A4_WIDTH_PX, transform: `scale(${activeScale})`, transformOrigin: "top center" }}
          >
            {children}
          </div>
        </div>
      </div>

      <div className="mt-2 flex shrink-0 items-center justify-center gap-1 border-t border-border-subtle pt-2">
        <button
          type="button"
          onClick={() => zoomBy(-ZOOM_STEP)}
          disabled={displayPercent <= ZOOM_MIN}
          aria-label="Zoom out"
          className="focus-ring flex h-7 w-7 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-overlay-soft disabled:opacity-40"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="w-11 text-center text-xs font-medium text-text-secondary">{displayPercent}%</span>
        <button
          type="button"
          onClick={() => zoomBy(ZOOM_STEP)}
          disabled={displayPercent >= ZOOM_MAX}
          aria-label="Zoom in"
          className="focus-ring flex h-7 w-7 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-overlay-soft disabled:opacity-40"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
        <div className="mx-1 h-4 w-px bg-border-subtle" />
        <button
          type="button"
          onClick={() => setZoom({ mode: "fit" })}
          className={cn(
            "focus-ring flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors hover:bg-overlay-soft",
            zoom.mode === "fit" ? "text-brand-cyan-light" : "text-text-secondary"
          )}
        >
          <Maximize2 className="h-3 w-3" />
          Fit
        </button>
      </div>
    </div>
  );
}
