"use client";

import { useEffect, useRef, useState } from "react";
import { Sun, Moon, Check } from "lucide-react";
import { useTheme, type SiteTheme } from "@/components/shared/theme-provider";
import { cn } from "@/lib/utils/cn";

const THEME_OPTIONS: { value: SiteTheme; label: string }[] = [
  { value: "day", label: "Day" },
  { value: "night", label: "Night" },
  { value: "green", label: "KasarTech Green" },
];

/** Small colored dot standing in for the 🟢 KasarTech Green option — a color choice, not an icon metaphor like Sun/Moon. */
function GreenDot({ className }: { className?: string }) {
  return (
    <span
      className={cn("inline-block rounded-full", className)}
      style={{ background: "linear-gradient(135deg, #0E7A5F, #20D39A)" }}
    />
  );
}

function ThemeGlyph({ value, className }: { value: SiteTheme; className?: string }) {
  if (value === "day") return <Sun className={className} />;
  if (value === "night") return <Moon className={className} />;
  return <GreenDot className={className} />;
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const current = THEME_OPTIONS.find((o) => o.value === theme) ?? THEME_OPTIONS[2];

  return (
    <div className="relative" ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Theme: ${current.label}. Open theme menu.`}
        className="focus-ring flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle bg-overlay-soft transition-colors hover:border-brand-blue/40"
      >
        <ThemeGlyph value={current.value} className="h-4 w-4 text-text-secondary" />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Choose theme"
          className="absolute right-0 top-11 z-50 w-48 overflow-hidden rounded-xl border border-border-subtle bg-bg-card py-1 shadow-card"
        >
          {THEME_OPTIONS.map((opt) => {
            const isActive = opt.value === theme;
            return (
              <button
                key={opt.value}
                type="button"
                role="menuitemradio"
                aria-checked={isActive}
                onClick={() => {
                  setTheme(opt.value);
                  setOpen(false);
                }}
                className={cn(
                  "focus-ring flex w-full items-center gap-2.5 px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "font-medium text-brand-blue"
                    : "text-text-secondary hover:bg-overlay-soft hover:text-text-primary"
                )}
              >
                <ThemeGlyph value={opt.value} className="h-3.5 w-3.5" />
                {opt.label}
                {isActive && <Check className="ml-auto h-3.5 w-3.5" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
