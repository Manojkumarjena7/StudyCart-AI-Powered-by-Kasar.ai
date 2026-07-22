"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Send, GraduationCap } from "lucide-react";
import { mainNav } from "@/config/navigation";
import { brandConfig } from "@/config/brand";
import { Button } from "@/components/shared/ui/button";
import { cn } from "@/lib/utils/cn";
import { LayoutGroup, motion } from "framer-motion";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border-subtle bg-bg-primary/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 focus-ring rounded-md">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-blue to-brand-cyan-light">
            <GraduationCap className="h-4.5 w-4.5 text-white" />
          </span>
          <span className="text-sm font-semibold text-text-primary sm:text-base">
            {brandConfig.productShortName}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-2xl border border-white/5 bg-white/5 p-1 backdrop-blur-md lg:flex">
  {mainNav.map((item) => {
    const active = pathname === item.href;

    return (
      <Link
        key={item.href}
        href={item.href}
        className="
        group
        relative
        rounded-xl
        px-4
        py-2
        text-sm
        font-medium
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:-translate-y-0.5
        hover:shadow-[0_0_18px_rgba(34,211,238,0.15)]
        "
      >
        {active && (
          <motion.div
            layoutId="navbar-pill"
            transition={{
              type: "spring",
              stiffness: 450,
              damping: 32,
            }}
            className="
              absolute
              inset-0
              -z-10
              rounded-xl
              border
              border-cyan-400/20
              bg-gradient-to-r
              from-cyan-500/10
              via-cyan-400/20
              to-cyan-500/10
              backdrop-blur-md
              shadow-[0_0_25px_rgba(34,211,238,0.18)]
            "
          />
        )}

        <span
          className={cn(
            "relative z-10 transition-colors duration-300",
            active
              ? "text-brand-cyan-light"
              : "text-text-secondary hover:text-brand-cyan-light"
          )}
        >
          {item.label}
        </span>
        <span
          className="
            pointer-events-none
            absolute
            inset-0
            rounded-xl
            bg-gradient-to-r
            from-cyan-400/0
            via-cyan-400/10
            to-cyan-400/0
            opacity-0
            blur-xl
            transition-opacity
            duration-300
            group-hover:opacity-100
        "
        />
      </Link>
    );
  })}
</nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href={brandConfig.socialLinks.telegram}
            target="_blank"
            rel="noreferrer"
            className="focus-ring flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-text-secondary transition-colors hover:text-brand-cyan-light"
          >
            <Send className="h-4 w-4" />
            Telegram
          </Link>
          <Link href="/analyzer">
            <Button variant="gradient" size="sm">
              Analyze Result
            </Button>
          </Link>
        </div>

        <button
          className="focus-ring rounded-lg p-2 text-text-primary lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border-subtle bg-bg-primary px-4 pb-5 pt-3 lg:hidden">
          <nav className="flex flex-col gap-1">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="focus-ring rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary hover:bg-white/5 hover:text-text-primary"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={brandConfig.socialLinks.telegram}
              target="_blank"
              rel="noreferrer"
              className="focus-ring flex items-center gap-1.5 rounded-lg px-3 py-2.5 text-sm text-text-secondary hover:bg-white/5 hover:text-text-primary"
            >
              <Send className="h-4 w-4" /> Telegram
            </Link>
            <Link href="/analyzer" onClick={() => setOpen(false)} className="mt-2">
              <Button variant="gradient" className="w-full">
                Analyze Result
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
