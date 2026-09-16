# StudyCart — Component Reference

Non-exhaustive reference for shared/reusable components. Domain-specific one-off
sections (e.g. individual homepage sections) aren't listed here — see the relevant
domain doc instead. Always check this file and the folder itself before creating a new
component; don't duplicate what exists.

## Shared UI primitives (`src/components/shared/ui/`)

`Button`, `Badge`, `Card` (+ `CardHeader`/`CardTitle`/`CardDescription`/`CardContent`),
`Checkbox`, `Input`, `Progress`, `Select`. Token-driven — see
[DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md). Use `bg-overlay-soft`/`bg-overlay-strong`
instead of literal `bg-white/5`-style classes so components stay theme-correct.

## Shared patterns (`src/components/shared/`)

- `ComingSoon` — standard stub page (icon, "Coming Soon" badge, title, description,
  back-to-home button). Used by `/books`, `/jobs`, `/tuition`, `/library`.
- `ThemeProvider` / `useTheme` / `themeInitScript` (`theme-provider.tsx`) and
  `ThemeToggle` (`theme-toggle.tsx`) — site-wide light/dark theme system.
- `PillarIcon` (`pillar-icon.tsx`) — resolves the string `icon` keys in
  `src/config/platform.ts` to Lucide components.
- `PageNav`, `EmptyState` — existing shared patterns (predate this doc).

## Resume module (`src/components/resume/`)

See [RESUME-ENHANCEMENT.md](./RESUME-ENHANCEMENT.md) for the product/status context.

| Component | Purpose |
|---|---|
| `resume-hero.tsx` / `resume-hero-mockup.tsx` | `/resume` hero section and its illustrative CSS-built resume mockup |
| `resume-examples-section.tsx` | Owns the "which example is open in the viewer" state; renders the carousel + modal |
| `resume-examples-carousel.tsx` | Horizontal scroll-snap carousel (desktop ~3-4 visible, mobile one-at-a-time), prev/next buttons |
| `resume-example-card.tsx` | One resume card: thumbnail, title, badges, View/Download |
| `resume-thumbnail.tsx` | CSS-built mini resume preview — never loads the actual PDF just to show a thumbnail |
| `resume-pdf-viewer-modal.tsx` | Accessible modal (focus trap, Escape-to-close, restores focus) embedding the PDF in an `<iframe>` — relies on the browser's native PDF viewer for zoom/page-nav/print, not a bundled PDF-rendering library |
| `resume-upload-dropzone.tsx` | Drag-and-drop / click-to-browse PDF upload with client-side type + 5MB size validation |
| `resume-analyzer-section.tsx` | "Check Your Resume" — upload UI + 3-step explainer + the honest "not live yet" post-upload state (never a fabricated score) |
| `resume-guide-section.tsx` | "How to Improve Your Resume" — 5-step horizontal editorial guide, not a card grid |
| `support-studycart-section.tsx` | Config-driven "Support StudyCart" donation prompt |

## Home module (`src/components/home/`)

See `docs/ROADMAP.md` Phase 2 and `docs/CHANGELOG.md` for what's there — hero carousel,
showcase sections (`section-shell.tsx` is the shared alternating two-column layout used
by four of them), and `mockups/*` (illustrative product mockups reused between the hero
and showcase sections).

## Config (`src/config/`)

- `platform.ts` — domain pillar metadata (nav/footer source of truth)
- `resume-examples.ts` — the 3 curated resume examples shown on `/resume`
- `navigation.ts` — non-pillar nav (legal, community)
- `brand.ts`, `site.ts` — brand/site constants
- `ecosystem/products.ts` — KasarTech ecosystem showcase data (unrelated to the domain split)

## Utilities (`src/lib/utils/`)

- `cn.ts` — className merge helper
- `interview-management.ts` — `getInterviewManagementUrl()`, reads
  `NEXT_PUBLIC_INTERVIEW_MANAGEMENT_URL`
- `support.ts` — `getSupportPaytmUrl()`, reads `NEXT_PUBLIC_SUPPORT_PAYTM_URL`

## Scripts (`scripts/`)

- `generate-resume-examples.mjs` — regenerates the 3 demo resume PDFs under
  `public/resumes/` using `jsPDF`. Run via `npm run generate:resume-examples`.
