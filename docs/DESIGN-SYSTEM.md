# StudyCart — Design System

This documents what is **actually implemented** as of Phase 1. It replaces the
aspirational theme description previously in `AI-AGENT-GUIDE.md` (which described a
light/dark system that didn't exist in code until now).

## Brand

- Name: **StudyCart**, endorsement: **Powered by Kasar.ai**
- Product identity: **StudyCart AI Interview Support**
- Tagline: "Your AI-Powered IT Interview & Career Support" (`brandConfig.tagline`)
- Typeface: **Inter** (`--font-system` in `globals.css`), with a standard system-font
  fallback stack. No new font dependency was added.

## Color tokens

All colors are CSS custom properties defined in `src/app/globals.css`, exposed to
Tailwind via `@theme inline` (Tailwind v4). **Never hardcode hex/rgb colors in
components** — use the semantic Tailwind classes below so theme switching works
automatically.

| CSS variable | Tailwind class | Purpose |
|---|---|---|
| `--color-bg-primary` | `bg-bg-primary` | Page background |
| `--color-bg-secondary` | `bg-bg-secondary` | Section/footer background |
| `--color-bg-card` | `bg-bg-card` | Card/panel surfaces |
| `--color-text-primary` | `text-text-primary` | Primary text |
| `--color-text-secondary` | `text-text-secondary` | Secondary/muted text |
| `--color-border` | `border-border-subtle` | Hairline borders |
| `--color-overlay-soft` / `--color-overlay-strong` | `bg-overlay-soft` / `bg-overlay-strong` (and `border-overlay-*`) | Glass/hover overlays — **use these instead of `bg-white/5`-style literals**, which do not adapt between themes |
| `--color-blue` | `text-brand-blue` / `bg-brand-blue` | Primary accent |
| `--color-cyan` | `text-brand-cyan` / `bg-brand-cyan` | Secondary accent |
| `--color-cyan-light` | `text-brand-cyan-light` | Accent text/active states |
| `--color-success` / `--color-error` / `--color-warning` | `text-success` etc. | Status colors |
| `--shadow-card` | `.shadow-card` utility | Elevated card shadow, theme-aware |

## Light / dark theme

- **Dark is the default** (no `data-theme` attribute needed) — this exactly matches
  the site's pre-existing appearance, so nothing that was already shipped (analyzer,
  results, homepage) changes visually by default.
- Setting `data-theme="light"` on `<html>` switches to the light palette. This is
  applied by:
  - `src/components/shared/theme-provider.tsx` — `ThemeProvider` + `useTheme()`,
    persists the choice to `localStorage` (`studycart-theme`).
  - `src/components/shared/theme-toggle.tsx` — `ThemeToggle`, the sun/moon control in
    the navbar.
  - An inline script in `src/app/layout.tsx` `<head>` applies a saved `"light"`
    preference before hydration, avoiding a flash of the wrong theme.
- `html { color-scheme: dark }` / `html[data-theme="light"] { color-scheme: light }`
  keeps native form controls (scrollbars, checkboxes, etc.) theme-correct too.

### Known scope limit (resolved in Phase 2)

As of Phase 2, `results/summary-cards.tsx`, `results/question-analysis-list.tsx`, and
`shared/ui/progress.tsx` were switched from literal `bg-white/5` to the theme-aware
`bg-overlay-soft` token — the analyzer results view is now light/dark-correct like the
rest of the app. The `ecosystem/*` showcase still has its own separate, already-working
scoped theme system (`--eco-*` variables) and was intentionally left alone — it isn't
part of this token system.

## Typography scale

No new typography utilities were introduced — use Tailwind's built-in text-size scale
directly, per this convention:

| Use | Classes |
|---|---|
| Hero / display headline | `text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight` |
| Section heading | `text-3xl sm:text-4xl font-semibold tracking-tight` |
| Card/subsection heading | `text-xl font-semibold` |
| Body | `text-base text-text-secondary` |
| Small / caption | `text-sm text-text-secondary` |

## Radii & spacing

No new radius/spacing tokens were introduced. Existing convention, kept as-is:
`rounded-lg` for buttons/inputs, `rounded-xl`/`rounded-2xl` for cards/panels/nav pills.
Use Tailwind's default spacing scale; don't invent arbitrary pixel values without a
reason (existing arbitrary `h-4.5`/`h-13`-style utilities in this codebase predate
Phase 1 and were left as-is).

## Motion

`framer-motion` (already a dependency) for layout/fade/reveal transitions. Respect
`prefers-reduced-motion` — already handled globally in `globals.css`. Avoid continuous
or bouncing animation.

## Shared UI primitives

`src/components/shared/ui/` — `Button`, `Badge`, `Card`, `Checkbox`, `Input`,
`Progress`, `Select`. `Button` and `Badge` were updated in Phase 1 to use the new
overlay tokens (`bg-overlay-soft`) instead of literal `bg-white/5`; this is a pure
theme-correctness fix with no visible change under the default dark theme.

`src/components/shared/pillar-icon.tsx` — resolves the string `icon` keys used in
`src/config/platform.ts` to Lucide icon components. Add new icons here, not by
importing icon components directly in config or page files.

## Service catalog (`src/config/platform.ts`)

Single source of truth for the primary product's domain pillars (Resume, Learning
Library, IT Jobs, Interview Support, Government Jobs). See
[ARCHITECTURE.md](./ARCHITECTURE.md) §Service catalog model for the full contract.
Phase 1 populates pillar-level metadata only; per-pillar `services` arrays are filled in
as each domain is actually built (Phases 3–5).

## Assets (`public/images`, `public/videos`, `public/mockups`, `public/resumes`)

These directories exist (Phase 2) for real product screenshots/videos when they're
ready. Until then, homepage "mockups" are **hand-built React components**
(`src/components/home/mockups/*`) styled entirely from design tokens — not images, and
not stock photography. This keeps the homepage honest (no fake screenshots) while
looking like a real product.

When a real asset is ready:
- Static images → `public/images/`, referenced with `next/image` (not a raw `<img>`),
  never a hardcoded external URL.
- Video → `public/videos/`, with a poster image from `public/images/` and lazy loading;
  avoid autoplaying more than one video at once.
- Finished product mockup exports (e.g. a designed PNG of a real screen) → `public/mockups/`.
- Swap the corresponding component in `src/components/home/mockups/` to render the real
  asset instead of the illustrative markup — the section components that consume them
  (`resume-showcase.tsx`, etc.) don't need to change.
- Add descriptive `alt` text; respect `prefers-reduced-motion` for any video/animation.

`public/resumes/` (added in the Resume MVP) is different from the three above: it holds
**real, downloadable PDF content** (the 3 curated example resumes), not decorative
image/video/mockup assets. Generated via `npm run generate:resume-examples`
(`scripts/generate-resume-examples.mjs`, using `jsPDF`). Card thumbnails for these are
still CSS-built components (`resume-thumbnail.tsx`) — the PDF itself is never loaded
just to render a thumbnail. See [RESUME-ENHANCEMENT.md](./RESUME-ENHANCEMENT.md).

## Navigation

`src/components/layout/navbar.tsx` renders nav items from `platformPillars`, not a
hardcoded list — adding/removing a primary domain is a one-line change in
`platform.ts`. `src/config/navigation.ts` retains only non-pillar nav (legal, community
links). Interview Support renders disabled with a "Soon" badge until
`NEXT_PUBLIC_INTERVIEW_MANAGEMENT_URL` is set (see
[INTERVIEW-MANAGEMENT.md](./INTERVIEW-MANAGEMENT.md)).
