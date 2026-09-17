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
- `SupportModal` (`support-modal.tsx`) — reusable support/donation modal with two
  content variants via a `context` prop (`"kasartech"` | `"studycart"`); see
  [RESUME-ENHANCEMENT.md](./RESUME-ENHANCEMENT.md) §Support popups. No QR code
  renders unless `NEXT_PUBLIC_SUPPORT_QR_IMAGE` is configured with a real asset.
- `SupportFab` (`support-fab.tsx`) — small persistent "❤️ Support StudyCart" button,
  fixed bottom-right on every page (rendered once, in `src/app/layout.tsx`); opens
  `SupportModal` with `context="studycart"`.

## Resume module (`src/components/resume/`)

See [RESUME-ENHANCEMENT.md](./RESUME-ENHANCEMENT.md) for the product/status context.

| Component | Purpose |
|---|---|
| `resume-hero.tsx` / `resume-hero-mockup.tsx` | `/resume` hero section and its illustrative CSS-built resume mockup |
| `resume-examples-section.tsx` | Owns "which template is open in the viewer" and "which download is pending support-prompt confirmation" state; renders the grid + both modals |
| `resume-examples-grid.tsx` | Balanced, non-scrolling responsive grid (1/2/3 columns) for the (currently 3) resume templates — replaced the old horizontal scroll-snap carousel, which existed to handle more items than fit on screen; not needed for a small fixed count |
| `resume-example-card.tsx` | One template card: thumbnail, title, badges, View / Download PDF / Download Word |
| `resume-pdf-viewer-modal.tsx` | Accessible modal (focus trap, Escape-to-close, restores focus) embedding the PDF in an `<iframe>` — relies on the browser's native PDF viewer for zoom/page-nav/print, not a bundled PDF-rendering library. Its own Download PDF/Word buttons route through the same support-download flow as the card. |
| `resume-upload-dropzone.tsx` | Drag-and-drop / click-to-browse PDF upload with client-side type + 5MB size validation |
| `resume-analyzer-section.tsx` | "Check Your Resume" — upload UI + 3-step explainer + the honest "not live yet" post-upload state (never a fabricated score) |
| `resume-guide-section.tsx` | "How to Improve Your Resume" — 5-step horizontal editorial guide, not a card grid |
| `support-studycart-section.tsx` | Config-driven "Support StudyCart" donation prompt (separate, page-level section — not the same UI as `SupportModal`) |

## Home module (`src/components/home/`)

See `docs/ROADMAP.md` Phase 2 and `docs/CHANGELOG.md` for what's there — hero carousel,
showcase sections (`section-shell.tsx` is the shared alternating two-column layout used
by four of them), and `mockups/*` (illustrative product mockups reused between the hero
and showcase sections).

## Config (`src/config/`)

- `platform.ts` — domain pillar metadata (nav/footer source of truth)
- `resume-examples.ts` — the 3 public-safe resume templates shown on `/resume` (each with a `pdfPath` and `docxPath`)
- `navigation.ts` — non-pillar nav (legal, community)
- `brand.ts`, `site.ts` — brand/site constants
- `ecosystem/products.ts` — KasarTech ecosystem showcase data (unrelated to the domain split)

## Utilities (`src/lib/utils/`)

- `cn.ts` — className merge helper
- `interview-management.ts` — `getInterviewManagementUrl()`, reads
  `NEXT_PUBLIC_INTERVIEW_MANAGEMENT_URL`
- `support.ts` — `getSupportPaytmUrl()` (reads `NEXT_PUBLIC_SUPPORT_PAYTM_URL`) and
  `getSupportQrImageSrc()` (reads `NEXT_PUBLIC_SUPPORT_QR_IMAGE`) — both `null` until
  a real value is configured; never fabricated
- `download-file.ts` — `downloadFile()`, triggers a same-origin file download via a
  transient `<a download>` click; used by `resume-examples-section.tsx` after the
  `SupportModal`'s "kasartech" variant closes, regardless of which button downloaded it

## Scripts (`scripts/`)

- `generate-resume-examples.mjs` — **dormant/unused as of the public-safe template
  swap** (see `docs/CHANGELOG.md`). Generated the 3 earlier fictional demo PDFs, which
  have been replaced by the 3 templates from `Public-Safe-Resume-Templates.zip`. Left
  in place (not deleted) since it's still valid, working code — just not referenced by
  `resume-examples.ts` today.
- `generate-resume-previews.mjs` (`npm run generate:resume-previews`) — renders page 1
  of each `public/resumes/template-0N/resume.pdf` to `preview.png` using `pdfjs-dist` +
  `@napi-rs/canvas` (both already project dependencies — no new one added). Re-run this
  after replacing any template's PDF so its card preview stays in sync.
