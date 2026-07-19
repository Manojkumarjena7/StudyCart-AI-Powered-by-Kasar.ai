import Link from "next/link";
import { Zap, ShieldCheck, Users, BarChart3 } from "lucide-react";
import { Button } from "@/components/shared/ui/button";
import { trustIndicators } from "@/config/site";
import { brandConfig } from "@/config/brand";

const indicatorIcons = [Zap, ShieldCheck, Users, BarChart3];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] opacity-60"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 0%, rgba(37,99,235,0.16) 0%, rgba(6,182,212,0.06) 45%, transparent 80%)",
        }}
      />
      <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-cyan-light">
          {brandConfig.productName} · {brandConfig.endorsementText}
        </p>
        <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
          Analyze Any Answer Key.
          <br />
          Know Your Real Performance.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-balance text-base text-text-secondary sm:text-lg">
          {brandConfig.productDescription}
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/analyzer">
            <Button variant="gradient" size="lg">
              Analyze My Result
            </Button>
          </Link>
          <Link href="#how-it-works">
            <Button variant="outline" size="lg">
              How It Works
            </Button>
          </Link>
        </div>

        <div className="mx-auto mt-12 grid max-w-2xl grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4">
          {trustIndicators.map((label, i) => {
            const Icon = indicatorIcons[i];
            return (
              <div key={label} className="flex flex-col items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-border-subtle bg-bg-card">
                  <Icon className="h-4.5 w-4.5 text-brand-cyan-light" />
                </span>
                <span className="text-xs font-medium text-text-secondary">{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
