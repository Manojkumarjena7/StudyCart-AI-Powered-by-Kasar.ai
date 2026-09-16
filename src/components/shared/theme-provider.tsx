"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type SiteTheme = "dark" | "light";

const STORAGE_KEY = "studycart-theme";

interface ThemeContextValue {
  theme: SiteTheme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(theme: SiteTheme) {
  // Dark has no attribute value (matches the pre-existing site-wide default in
  // globals.css), so only "light" needs to be reflected on the root element.
  if (theme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Dark by default — matches current production behavior exactly until a saved
  // preference says otherwise, so there's no visual regression for existing pages
  // that were only ever styled against the dark palette (see docs/DESIGN-SYSTEM.md).
  const [theme, setTheme] = useState<SiteTheme>("dark");

  // Reading a persisted preference after mount avoids an SSR/client hydration
  // mismatch (localStorage doesn't exist on the server). The inline script in
  // layout.tsx already applied the saved theme synchronously before paint, so this
  // just brings React state in sync with what's already on the page.
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
      applyTheme(next);
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // ignore
      }
      return next;
    });
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}

// Inline script source, applied in layout.tsx <head> before hydration so a saved
// "light" preference doesn't flash dark on first paint. Kept as a plain string (not a
// component) because it must run as a blocking, pre-hydration script.
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${STORAGE_KEY}");if(t==="light"){document.documentElement.setAttribute("data-theme","light");}}catch(e){}})();`;
