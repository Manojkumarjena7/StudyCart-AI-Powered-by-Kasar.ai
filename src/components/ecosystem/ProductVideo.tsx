"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { ProductDemo } from "@/config/ecosystem/products";

export function ProductVideo({ demo, productName }: { demo: ProductDemo; productName: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "150px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const hasVideo = demo.webm || demo.mp4;

  return (
    <div
      ref={containerRef}
      className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border"
      style={{ borderColor: "var(--eco-border)" }}
    >
      {inView && hasVideo && (
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          aria-label={`${productName} product demo`}
        >
          {demo.webm && <source src={demo.webm} type="video/webm" />}
          {demo.mp4 && <source src={demo.mp4} type="video/mp4" />}
        </video>
      )}
      {inView && !hasVideo && demo.gif && (
        <Image src={demo.gif} alt={`${productName} product demo`} fill className="object-cover" loading="lazy" />
      )}
    </div>
  );
}
