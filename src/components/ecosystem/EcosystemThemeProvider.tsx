"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type EcosystemTheme = "dark" | "light";

const STORAGE_KEY = "kasartech-ecosystem-theme";

interface EcosystemThemeContextValue {
  theme: EcosystemTheme;
  toggleTheme: () => void;
}

const EcosystemThemeContext = createContext<EcosystemThemeContextValue | null>(null);

export function EcosystemThemeProvider({ children }: { children: ReactNode }) {
  // Dark by default, per spec — only switches after reading a saved
  // preference, so there's no flash of the wrong theme on first paint.
  const [theme, setTheme] = useState<EcosystemTheme>("dark");

  // Reading a persisted preference from localStorage after mount is the
  // standard, necessary pattern to avoid an SSR/client hydration mismatch
  // (localStorage doesn't exist on the server) — there's no synchronous
  // alternative for this.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "light" || saved === "dark") {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTheme(saved);
      }
    } catch {
      // localStorage unavailable (e.g. privacy mode) — silently keep the default.
    }
  }, []);

  function toggleTheme() {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // ignore
      }
      return next;
    });
  }

  return (
    <EcosystemThemeContext.Provider value={{ theme, toggleTheme }}>
      <div data-ecosystem-theme={theme} className="ecosystem-root">
        {children}
      </div>
    </EcosystemThemeContext.Provider>
  );
}

export function useEcosystemTheme(): EcosystemThemeContextValue {
  const ctx = useContext(EcosystemThemeContext);
  if (!ctx) {
    throw new Error("useEcosystemTheme must be used within EcosystemThemeProvider");
  }
  return ctx;
}
