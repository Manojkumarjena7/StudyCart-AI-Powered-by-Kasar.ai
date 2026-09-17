# StudyCart — Design System

This documents what is **actually implemented** as of Phase 1. It replaces the
aspirational theme description previously in `AI-AGENT-GUIDE.md` (which described a
light/dark system that didn't exist in code until now).

## Brand identity (KasarTech.ai rebrand)

As of the branding phase in `feature/kasartech-branding`, the site's **primary,
site-wide displayed identity** is **KasarTech.ai** (`brandConfig.siteName`), positioned
as **"AI Interview Support"** (`brandConfig.sitePositioning`). This drives:

- Browser tab title (`src/app/layout.tsx`): "KasarTech.ai — AI Interview Support"
- Navbar and footer brand mark (`src/components/layout/navbar.tsx`,
  `src/components/layout/footer.tsx`)
- Favicon / app icon (`src/app/favicon.ico`, `src/app/apple-icon.png`, plus explicit
  16/32/48px sizes wired via `metadata.icons` in `layout.tsx`)
- Footer copyright line

**`brandConfig.productName`/`productShortName` ("StudyCart") were deliberately left
unchanged** — they are still read by `src/features/reports/reportGenerator.ts` (printed
on generated analyzer PDF reports), `src/config/site.ts`'s `rankingDisclaimer`, and the
About page's origin-story narrative (which specifically distinguishes "the platform"
from "StudyCart, the first product built on it"). Renaming those fields would have
silently changed protected analyzer/report output and made the About page's own
narrative self-contradictory. **StudyCart remains the specific product name** for that
narrower scope — see `docs/PRODUCT.md`. Per-page `<title>` tags outside the root layout
(e.g. `/resume`, `/analyzer`, `/about`) and homepage/resume-page body copy were left
untouched for the same reason, and because this phase is branding-only, not a content
redesign.

### Brand assets

`public/brand/` is the **single production brand asset location** — there is
intentionally only one. It currently holds the assets from
`KasarTech-Selected-Brand-Pack.zip` ("Package 2"), the approved/latest visual
direction, which superseded an earlier `KasarTech-Brand-Assets.zip` ("Package 1")
pack. Package 1's zip remains untouched at the project root as a historical/safety
copy, but nothing in the app references it anymore — do not reintroduce it.

- `public/brand/logo/` — `kasartech-symbol.svg` (transparent, mark-only — **use this
  for all in-app UI placements**: navbar, footer, ecosystem card), `-black`/`-white`
  variants, `kasartech-wordmark.svg`, and `kasartech-logo-{light,white,dark}.svg` (full
  lockups with the wordmark set in Inter — still **do not use these for in-app UI
  text**; prefer the symbol + live HTML text, per the pack's own `docs/USAGE.md`).
  **Never use `kasartech-logo-dark.svg`** — it renders dark navy text on a dark
  background and is illegible as shipped (a defect present in both packs). Use
  `kasartech-logo-white.svg` wherever a full lockup on a dark surface is needed.
- `public/brand/icons/` — favicon/app-icon PNGs (`favicon-{16,32,48}.png`,
  `icon-{180,192,512}.png`, `icon-{white,dark}-512.png`) and `favicon.ico`.
- `public/brand/social/og-image.png` — Open Graph image (1200×630), wired via
  `metadata.openGraph.images` in `layout.tsx`. New in Package 2; Package 1 had no
  equivalent.
- `public/brand/{docs/USAGE.md,brand-assets.json,brand-colors.txt}` — the pack's own
  provenance/reference files, kept as-is.

Do not redraw, recolor, or regenerate any of these — use them as supplied.

### Brand colors — the theme system's actual color values

Unlike the first branding pass (which scoped KasarTech green to one ecosystem card),
these colors are now the app's **primary theme palette** — see §Theme system below.

| Color | Hex | Role |
|---|---|---|
| Primary Green | `#0E7A5F` | `--color-blue` in Green/Day themes — primary accent/CTA |
| Accent Green | `#20D39A` | `--color-cyan` in all three themes — secondary accent, gradient end |
| Dark Background | `#071A17` | Night theme's `--color-bg-primary` |
| Text | `#0F172A` | `--color-text-primary` in Green/Day themes |
| Muted | `#64748B` | Reference value; Green theme uses it as `--color-text-secondary`, Day uses a slightly cooler `#475569` for a more neutral-gray feel |

`viewport.themeColor` in `layout.tsx` uses the Primary Green (`#0E7A5F`).

### Legacy brand fields (unchanged)

- Name: **StudyCart**, endorsement: **Powered by Kasar.ai**
- Product identity: **StudyCart AI Interview Support**
- Tagline: "Your AI-Powered IT Interview & Career Support" (`brandConfig.tagline`,
  still used verbatim in the footer — it doesn't name-check either brand, so it reads
  correctly under both)
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

## Theme system — three modes

The app has exactly **three** visual modes, chosen via `src/components/shared/
theme-toggle.tsx` (a dropdown in the navbar, not a binary toggle):

| Mode | `data-theme` | Feel |
|---|---|---|
| **KasarTech Green** | *(none — the default)* | Off-white surface + dark navy type + green CTA/glow. The primary brand experience. |
| **Day** | `"day"` | Clean, neutral light mode. Same green accent as Green, but gray (not green-tinted) borders/overlays — deliberately more restrained/neutral overall. |
| **Night** | `"night"` | Dark green-black (`#071A17`), soft-white text, brighter accent green leading on CTAs for contrast. Intentionally designed, not Day inverted — its own border/overlay tint, its own muted-text color. |

**KasarTech Green is the default a first-time visitor sees** — this is a deliberate
choice, not an accident of implementation order: it's the strongest expression of the
approved brand identity, and per the branding brief every new visitor should land on
it before any Day/Night preference exists. It requires no `data-theme` attribute
(mirrors how "dark" used to be the zero-attribute default pre-rebrand), so there's no
extra cost to making it the default.

- `src/components/shared/theme-provider.tsx` — `ThemeProvider` + `useTheme()`
  (`{ theme, setTheme }`), persists the choice to `localStorage` (`studycart-theme`
  key, kept from the pre-existing implementation). Any stored value other than
  `"day"`/`"night"`/`"green"` — including the old two-mode `"light"`/`"dark"` values —
  is treated as absent and falls back to the Green default; there's no migration
  mapping between the old and new mode names.
- `src/components/shared/theme-toggle.tsx` — `ThemeToggle`, a small accessible
  dropdown (`role="menu"`/`"menuitemradio"`, closes on outside-click or Escape,
  restores focus to the trigger) showing all three options with a check mark on the
  active one: ☀ Day, 🌙 Night, and a green gradient dot for KasarTech Green (matching
  the 🟢 notation in the brief — a color swatch, not an icon metaphor).
- An inline script in `src/app/layout.tsx` `<head>` applies a saved `"day"`/`"night"`
  preference before hydration, avoiding a flash of the Green default when a visitor
  has actually chosen something else.
- `html { color-scheme: light }` / `html[data-theme="night"] { color-scheme: dark }`
  keeps native form controls theme-correct — Green and Day are both "light-family"
  themes, only Night is "dark-family."

**Known, deliberate consequence:** the Government Job Platform's `/analyzer`,
`/result/[resultId]`, and `/analysis/[resultId]` pages now default to Green (off-white)
instead of the old dark-navy default, since their UI is built entirely from the same
semantic tokens (`bg-bg-primary`, `text-text-secondary`, `bg-overlay-soft`, etc.) as
the rest of the app — no analyzer code changed, but the theme it renders against did.
Verified readable/functional in all three modes during this phase's browser pass; no
analyzer/parser/scoring/ranking/report logic was touched.

### Known scope limit (resolved in Phase 2, pre-rebrand)

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

`public/resumes/` is different from the three above: it holds **real, downloadable
PDF/DOCX content** (the 3 public-safe resume templates — see
[RESUME-ENHANCEMENT.md](./RESUME-ENHANCEMENT.md)), not decorative image/video/mockup
assets. Each template's card preview (`public/resumes/template-0N/preview.png`) is a
**real page-1 render of that template's actual PDF** — generated via
`npm run generate:resume-previews` (`scripts/generate-resume-previews.mjs`, using
`pdfjs-dist` + `@napi-rs/canvas`, both already project dependencies). This is
intentionally different from the homepage mockups above: a resume template gallery
needs to show the *real* design so a visitor can compare templates before choosing
one — a hand-built CSS approximation (the previous approach) can't do that
faithfully, which is why this is the one place in the app that renders a real
document image rather than an illustrative component.

## Navigation

`src/components/layout/navbar.tsx` renders nav items from `platformPillars`, not a
hardcoded list — adding/removing a primary domain is a one-line change in
`platform.ts`. `src/config/navigation.ts` retains only non-pillar nav (legal, community
links). Interview Support renders disabled with a "Soon" badge until
`NEXT_PUBLIC_INTERVIEW_MANAGEMENT_URL` is set (see
[INTERVIEW-MANAGEMENT.md](./INTERVIEW-MANAGEMENT.md)).
