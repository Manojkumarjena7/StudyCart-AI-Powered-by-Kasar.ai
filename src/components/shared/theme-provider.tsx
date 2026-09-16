"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type SiteTheme = "green" | "day" | "night";

const STORAGE_KEY = "studycart-theme";
const VALID_THEMES: readonly SiteTheme[] = ["green", "day", "night"];

interface ThemeContextValue {
  theme: SiteTheme;
  setTheme: (theme: SiteTheme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(theme: SiteTheme) {
  // "green" has no attribute value (it's the default, matching globals.css :root),
  // so only "day"/"night" need to be reflected on the root element.
  if (theme === "green") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", theme);
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // KasarTech Green by default — the primary brand experience every first-time
  // visitor sees, per the approved branding direction. See docs/DESIGN-SYSTEM.md.
  const [theme, setThemeState] = useState<SiteTheme>("green");

  // Reading a persisted preference after mount avoids an SSR/client hydration
  // mismatch (localStorage doesn't exist on the server). The inline script in
  // layout.tsx already applied the saved theme synchronously before paint, so this
  // just brings React state in sync with what's already on the page.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved && (VALID_THEMES as string[]).includes(saved)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setThemeState(saved as SiteTheme);
      }
    } catch {
      // localStorage unavailable (e.g. privacy mode) — silently keep the default.
    }
  }, []);

  function setTheme(next: SiteTheme) {
    setThemeState(next);
    applyTheme(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}

// Inline script source, applied in layout.tsx <head> before hydration so a saved
// "day"/"night" preference doesn't flash the KasarTech Green default on first paint.
// Kept as a plain string (not a component) because it must run as a blocking,
// pre-hydration script. Anything other than a recognized theme value (including
// legacy "light"/"dark" from before the three-mode system) falls back to the
// KasarTech Green default, matching the first-time-visitor requirement.
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${STORAGE_KEY}");if(t==="day"||t==="night"){document.documentElement.setAttribute("data-theme",t);}}catch(e){}})();`;
