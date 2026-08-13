"use client";

import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useEcosystemTheme } from "./EcosystemThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useEcosystemTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="eco-glass relative flex h-10 w-10 items-center justify-center rounded-full border"
      style={{ borderColor: "var(--eco-border-strong)", background: "var(--eco-card)" }}
    >
      <motion.span
        key={theme}
        initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        {isDark ? (
          <Moon className="h-4.5 w-4.5" style={{ color: "var(--eco-text-primary)" }} />
        ) : (
          <Sun className="h-4.5 w-4.5" style={{ color: "var(--eco-text-primary)" }} />
        )}
      </motion.span>
    </button>
  );
}
