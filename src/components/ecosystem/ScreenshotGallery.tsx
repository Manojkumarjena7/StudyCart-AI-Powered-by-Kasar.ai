"use client";

import { useState } from "react";
import Image from "next/image";

export function ScreenshotGallery({ screenshots, productName }: { screenshots: string[]; productName: string }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (screenshots.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <div
        className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border"
        style={{ borderColor: "var(--eco-border)" }}
      >
        <Image
          src={screenshots[activeIndex]}
          alt={`${productName} screenshot ${activeIndex + 1}`}
          fill
          className="object-cover"
          loading="lazy"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      {screenshots.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {screenshots.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`Show screenshot ${i + 1}`}
              aria-current={activeIndex === i}
              className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md border transition-opacity"
              style={{
                borderColor: activeIndex === i ? "var(--eco-border-strong)" : "var(--eco-border)",
                opacity: activeIndex === i ? 1 : 0.6,
              }}
            >
              <Image src={src} alt="" fill className="object-cover" loading="lazy" sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
