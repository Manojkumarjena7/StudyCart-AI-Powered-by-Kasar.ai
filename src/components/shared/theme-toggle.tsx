"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/shared/theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="focus-ring flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle bg-overlay-soft transition-colors hover:border-brand-cyan-light/50"
    >
      {isDark ? (
        <Moon className="h-4 w-4 text-text-secondary" />
      ) : (
        <Sun className="h-4 w-4 text-text-secondary" />
      )}
    </button>
  );
}
