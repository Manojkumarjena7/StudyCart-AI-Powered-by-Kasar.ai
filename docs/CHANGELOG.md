# Changelog

## Real page-1 resume template previews (replacing skeleton thumbnails)

**Scope:** Resume template cards now show a real render of each template's actual
first page instead of a fake CSS/skeleton document. UI-only — the support/download
flow from the previous phase was not touched.

### Added
- `scripts/generate-resume-previews.mjs` (`npm run generate:resume-previews`) —
  renders page 1 of each `public/resumes/template-0N/resume.pdf` to `preview.png`
  using `pdfjs-dist` + `@napi-rs/canvas` (both already project dependencies — no new
  one added; `@napi-rs/canvas` is in fact the exact native canvas backend
  `pdfjs-dist`'s own built-in Node canvas factory uses for this purpose).
- `public/resumes/template-0{1,2,3}/preview.png` — 900×1273px (exact A4 ratio,
  since that's the actual page size scaled to the target width), generated directly
  from each template's real PDF. Not a hand-built recreation.

### Changed
- `src/config/resume-examples.ts` — replaced the `accent` field (only used by the
  removed skeleton) with `previewImagePath`/`previewWidth`/`previewHeight`.
- `src/components/resume/resume-example-card.tsx` — the card's preview area now
  renders the real `preview.png` via `next/image` in an A4-ratio (`aspect-[900/1273]`)
  container with `object-contain object-top` (shows the complete page, never
  stretched/distorted/cropped) and an explicit white background (the resume page is
  real paper, not themed UI chrome — stays a true white rectangle in Day, Night, and
  KasarTech Green alike). A very subtle `scale-[1.03]` hover zoom was added per the
  brief; no other animation.
- `docs/DESIGN-SYSTEM.md`, `docs/COMPONENTS.md`, `docs/RESUME-ENHANCEMENT.md` —
  updated to describe the real-preview pipeline (PDF → page-1 thumbnail → card) and
  the new script.

### Removed
- `src/components/resume/resume-thumbnail.tsx` — the CSS-built skeleton preview.
  Confirmed via search it had no other consumer before deleting.

## Unified support/donation UX (reusable modal + global CTA)

**Scope:** Replaced the resume-specific support popup with a single reusable
`SupportModal` component (two content variants), added a persistent site-wide
"❤️ Support StudyCart" button, and finalized the exact copy/behavior for both
variants per the approved reference designs. No analyzer/parser/scoring/ranking/
reports/Supabase code touched.

### Added
- `src/components/shared/support-modal.tsx` — reusable modal, `context: "kasartech"
  | "studycart"`. Both variants: real focus trap, Escape/backdrop-click to close,
  restores focus, capture-phase Escape handling (safe if ever stacked with another
  modal). Falls back to a single narrower column if no QR/Paytm link is available,
  instead of leaving an empty second column.
- `src/components/shared/support-fab.tsx` — small fixed bottom-right button,
  rendered once in `src/app/layout.tsx`, present on every page; opens
  `SupportModal` with `context="studycart"`.
- `getSupportQrImageSrc()` in `src/lib/utils/support.ts` — defaults to
  `/support/paytm-qr.png` (see below), overridable via
  `NEXT_PUBLIC_SUPPORT_QR_IMAGE`.
- `public/support/paytm-qr.png` — the real, supplied Paytm/UPI QR code. A **lossless
  crop** of the original image the user provided: only the personal-name header
  ("Manoj Kumar Jena") and the promotional "Get Assured Cashback" banner were cropped
  away (pure canvas crop via PowerShell's `System.Drawing`, no resize/recompress);
  the Paytm logo, the QR pattern itself, the UPI ID text, and the payment-method
  badges are pixel-identical to the source. The QR was never generated, recreated,
  or altered — this satisfies the explicit "may omit unnecessary personal
  information around the QR" allowance without touching the scannable pattern.

### Changed
- `src/components/resume/resume-examples-section.tsx` — now renders the shared
  `SupportModal` (`context="kasartech"`) instead of the resume-specific one.
  **Behavior change from the previous iteration:** both "Continue Free Download →"
  and "Maybe Later" now trigger the download (per the finalized reference design);
  only the ✕ close button/Escape/backdrop closes without downloading.
- `docs/RESUME-ENHANCEMENT.md`, `docs/COMPONENTS.md` — updated to describe the
  shared component, the two contexts, the global button, and the QR fallback.

### Removed
- `src/components/resume/support-download-modal.tsx` — deleted, superseded by the
  shared `SupportModal`. Confirmed no remaining references anywhere in `src/`.

### QR sourcing note
- A full-project search at the start of this task confirmed **no Paytm QR image
  existed anywhere in this codebase** — the modal was built to gracefully omit the
  QR block rather than fabricate one, per this project's standing rule. The user
  then supplied the real QR image directly; it was cropped (not altered) and wired
  in as described above. The graceful single-column fallback remains in the code
  for defensive correctness (e.g. if the asset or env var is ever removed).
- `src/components/resume/support-studycart-section.tsx` (existing page-level
  "Support StudyCart" section on `/resume`) is unrelated to this modal system and
  was not touched.

## Public-safe resume templates (3, replacing the fictional demo examples)

**Scope:** Swapped the 3 fictional generated demo resumes for 3 public-safe templates
from `Public-Safe-Resume-Templates.zip`, each recreated from a real resume with all
personal information replaced by generic placeholders. Added PDF + Word (DOCX)
downloads and an optional, non-blocking "Support KasarTech.ai" prompt before either
download. No analyzer/parser/scoring/ranking/reports/Supabase code touched.

### Added
- `public/resumes/template-0{1,2,3}/{resume.pdf,resume.docx}` — the 3 public-safe
  templates (6 files total).
- `src/components/resume/resume-examples-grid.tsx` — balanced, non-scrolling
  responsive grid (1/2/3 columns) for the (currently 3) templates.
- `src/components/resume/support-download-modal.tsx` — the optional per-download
  support prompt (exact copy as specified: "Support KasarTech.ai ❤️" /
  "These resume templates are free to use..." / "Minimum Support: ₹100" /
  "Continue Free Download" / "Maybe Later" / "No payment is required..."). No QR
  code — none exists in this codebase; an optional Paytm link appears only if
  `NEXT_PUBLIC_SUPPORT_PAYTM_URL` is configured, reusing the existing
  `getSupportPaytmUrl()` helper.
- `src/lib/utils/download-file.ts` — `downloadFile()`, a small same-origin
  download-trigger helper used after the support prompt closes.

### Changed
- `src/config/resume-examples.ts` — full replace: 3 entries now point at the new
  `template-0N` assets and each carries both `pdfPath` and `docxPath`. Titles are
  generic ("Template 01/02/03") per the approved naming; role/experience/category
  badges and description text describe each template's actual layout and level.
- `src/components/resume/resume-example-card.tsx` — added Download PDF / Download
  Word as two buttons (was a single PDF-only Download link); both route through the
  new support prompt via an `onRequestDownload` callback instead of a direct
  `<a download>`.
- `src/components/resume/resume-pdf-viewer-modal.tsx` — added a Word download
  button alongside the existing PDF one (desktop header + mobile footer), both now
  routed through the same `onRequestDownload` callback. **View/Preview itself is
  unchanged and still never shows any prompt.**
- `src/components/resume/resume-examples-section.tsx` — now owns two pieces of
  modal state (which template is open in the viewer, which download is pending
  support-prompt confirmation) instead of one; renders the grid + both modals.
  Eyebrow/heading copy changed from "Resume Examples" to "Resume Templates" to
  match the approved terminology (the `#examples` anchor id was kept unchanged so
  the Resume hero's existing "Explore Resume Examples" CTA link still works).
- `docs/RESUME-ENHANCEMENT.md`, `docs/COMPONENTS.md` — updated to describe the new
  templates, the grid (replacing the carousel), the DOCX field, and the new support
  prompt.

### Removed / retired
- `src/components/resume/resume-examples-carousel.tsx` — deleted. It was a
  horizontal scroll-snap carousel built for handling more items than fit on screen;
  with a small, fixed template count a plain responsive grid is simpler and was
  explicitly requested (no large empty 4th-column gap on desktop).
- `public/resumes/{software-engineer,qa-automation-engineer,data-analyst}.pdf` —
  deleted. No longer referenced by `resume-examples.ts` after the template swap;
  confirmed via repo-wide search that nothing else referenced these paths.
- `scripts/generate-resume-examples.mjs` — **not deleted**, but now dormant/unused
  (it generated the 3 fictional PDFs above). Left in place since deleting source
  code wasn't requested and it's still valid, working code.

### Explicitly not changed (by design)
- `src/features/analyzer|parser|scoring|ranking|reports`, `src/lib/supabase`,
  the Resume Analyzer upload UI, the "How to Improve Your Resume" guide section,
  routing, authentication, and the branding/theme system — untouched.
- `src/components/resume/support-studycart-section.tsx` (the page-level "Support
  StudyCart" donation prompt) — separate feature, untouched; still config-driven
  and disabled until a real Paytm URL is set.

## KasarTech.ai visual theme + Resume UI (UI/design phase only)

**Scope:** Approved KasarTech.ai visual direction — brand asset consolidation, a
three-mode theme system (Green default, Day, Night), navbar simplification, and Resume
hero/mockup polish. No architecture, business logic, or route changes. See
`docs/DESIGN-SYSTEM.md` §Theme system and §Brand assets for full rationale.

### Added
- `src/components/shared/theme-toggle.tsx` rewritten as a 3-option accessible
  dropdown (was a 2-state sun/moon button).
- `metadata.openGraph` (title/description/`og-image.png`) in `src/app/layout.tsx` —
  new capability; Package 1 had no OG image to wire.
- `public/brand/social/og-image.png`, `public/brand/logo/kasartech-logo-light.svg` —
  new assets from the Selected Brand Pack with no Package 1 equivalent.

### Changed
- **Brand assets consolidated**: `public/brand/` now holds only
  `KasarTech-Selected-Brand-Pack.zip`'s assets (the approved/latest direction) —
  replaced Package 1's files in place. `KasarTech-Brand-Assets.zip` (Package 1)
  remains untouched at the project root as a historical/safety copy but is no longer
  referenced by any code. `src/app/favicon.ico` and `src/app/apple-icon.png`
  replaced with Package 2's versions; `metadata.icons.icon` now includes 192×192 and
  512×512 sizes alongside 16/32/48, using the pack's renamed files
  (`favicon-16.png`, not `favicon-16x16.png`).
- `src/app/globals.css` — full three-theme token rewrite (`:root` = KasarTech Green
  default, `[data-theme="day"]`, `[data-theme="night"]`). `html`'s base
  `color-scheme` flipped from `dark` to `light` (Green/Day are light-family; only
  Night sets `color-scheme: dark`).
- `src/components/shared/theme-provider.tsx` — `SiteTheme` type widened from
  `"dark" | "light"` to `"green" | "day" | "night"`; API changed from
  `{ theme, toggleTheme }` to `{ theme, setTheme }` (a 3-way choice isn't a toggle).
  Confirmed via search that no other file consumed the old `toggleTheme` API — the
  ecosystem showcase's `src/components/ecosystem/ThemeToggle.tsx` is a separate,
  independent theme system (`--eco-*` tokens) and was not touched.
- `src/components/layout/navbar.tsx` — removed the oversized rounded pill container
  around the whole nav group; each item now gets its own small active-state
  background chip (still an animated `framer-motion` shared-element transition, just
  scoped to one item instead of a floating capsule with a large glow shadow). The
  desktop Telegram link is now icon-only (was icon + text) to keep the nav visually
  light, per the approved target layout — link itself unchanged.
- `src/components/shared/ui/button.tsx` — the (unused-in-practice, but exported)
  `primary` variant's hardcoded `hover:bg-blue-600` and blue shadow replaced with
  token-safe values; was previously dark-navy text on a blue background, which
  would have become illegible dark-on-dark once `--color-blue` turned green.
- `src/components/resume/resume-example-card.tsx`,
  `src/components/resume/support-studycart-section.tsx` — same hardcoded
  `hover:bg-blue-600` fix (→ `hover:opacity-90`), for the same reason.
- `src/components/resume/resume-hero.tsx` (Resume hero) and `src/components/home/hero.tsx`
  (homepage hero) — the purely decorative ambient background glow (a radial-gradient
  in an inline `style`, not theme-token-driven) recolored from hardcoded blue/cyan to
  the KasarTech green family, so it doesn't clash with everything else that already
  re-themes automatically via tokens. No layout/structure change.
- `src/components/resume/resume-hero.tsx` — added an "AI-Powered · ATS Friendly · IT
  Career Focus" eyebrow line next to the existing "Resume" badge; headline split
  into two lines with the second half in the brand accent color, matching the
  approved reference direction (not copied literally).
- `src/components/resume/resume-hero-mockup.tsx` — added a small Projects line and
  icon-annotated contact row (Mail/Phone/MapPin) so the preview reads as a complete
  resume document rather than a partial one; added a thin brand-gradient top accent
  bar. Sample data remains clearly fictional. The four supporting badges (Clean
  Structure/ATS Friendly/Includes Projects/Professional Format) were already exactly
  what the brief asked for — left unchanged.

### Explicitly not changed (by design, this phase)
- `src/components/resume/resume-guide-section.tsx` ("How to Improve") — already
  implemented as the exact 01–05 numbered editorial journey the brief asks for
  (responsive horizontal-on-desktop/vertical-on-mobile, no large cards). No changes
  needed.
- `src/components/resume/resume-examples-carousel.tsx` /
  `resume-example-card.tsx` structure, `src/components/footer.tsx` branding — already
  matched the brief from the prior branding phase; only the one color-token fix
  above was needed in the card.
- Resume example count stayed at 3 (not expanded to 4–5) — generating new example
  PDFs is content/data work via `scripts/generate-resume-examples.mjs`, not a visual
  theme change, and this phase's brief was explicit about being UI/design only. The
  carousel already has no hardcoded limit and displays additional examples the
  moment they exist in `src/config/resume-examples.ts`.
- `src/features/analyzer|parser|scoring|ranking|reports`, `src/lib/supabase`,
  Interview Management integration, all routes — untouched. `/analyzer` verified
  functional and readable in all three themes.
- Homepage structure/sections, `/about` narrative, per-page `<title>` tags outside
  root layout — unchanged, per the prior phase's documented rationale (still
  read `brandConfig.productName` = "StudyCart") and this phase's own "no homepage
  redesign" instruction.

## Branding — KasarTech.ai site identity (full rebrand, branding-only)

**Scope:** Site-wide primary brand identity change to KasarTech.ai / "AI Interview
Support", per the supplied `KasarTech-Brand-Assets.zip`. Branding only — no homepage,
Resume page, or business-logic changes. See `docs/DESIGN-SYSTEM.md` §Brand identity for
the full rationale, including which fields/pages were deliberately left unchanged.

### Added
- `public/brand/` — production brand assets copied unmodified from the supplied pack
  (`logo/`, `icons/`, plus the pack's own `README.md`/`brand-assets.json`/`brand-colors.txt`).
- `src/app/favicon.ico`, `src/app/apple-icon.png` — replaced with the supplied
  KasarTech assets via Next.js's App Router file-convention icons.
- `src/components/shared/kasartech-symbol.tsx` — new component wrapping the KasarTech
  symbol SVG in the same `{ className }` shape as a `lucide-react` icon component, so it
  drops into `EcosystemProduct`/`kasarTechCompany`'s existing `icon` slot without any
  type hacks.
- `brandConfig.siteName` ("KasarTech.ai") and `brandConfig.sitePositioning` ("AI
  Interview Support") in `src/config/brand.ts` — the new site-wide identity fields.
- `metadata.icons` (16/32/48px favicon PNGs) and `viewport.themeColor` (`#0E7A5F`) in
  `src/app/layout.tsx`.
- `images.dangerouslyAllowSVG` + a restrictive `contentSecurityPolicy` in
  `next.config.ts` — required for `next/image` to serve our own local, trusted brand
  SVGs (blocked by default).

### Changed
- `src/app/layout.tsx` — root `<title>` changed from "StudyCart — Powered by Kasar.ai"
  to "KasarTech.ai — AI Interview Support".
- `src/components/layout/navbar.tsx`, `footer.tsx` — replaced the `GraduationCap`
  Lucide icon + gradient-box mark with the real KasarTech symbol SVG (`next/image`) and
  live `{brandConfig.siteName}` text (Inter, not the flattened Arial logo image). Navbar
  text hides below the `sm` breakpoint (symbol-only on the smallest phone widths, per
  the branding brief's mobile requirement).
- `src/components/layout/footer.tsx` — footer copyright line now reads
  "© {year} KasarTech.ai"; dropped the "Powered by Kasar.ai ·" prefix from the
  location line since it read as self-referential once KasarTech.ai became the
  displayed brand directly above it.
- `src/config/ecosystem/products.ts` — `kasarTechCompany.icon` changed from the
  generic `Code2` Lucide placeholder to the real `KasarTechSymbol`; its card accent
  colors changed from generic blue/indigo to KasarTech's actual brand green
  (`#0E7A5F` → `#20D39A`), scoped to that one card only.

### Explicitly not changed (by design, this phase)
- `brandConfig.productName`/`productShortName` ("StudyCart") — still used by
  `src/features/reports/reportGenerator.ts` (PDF report branding), the ranking
  disclaimer (`src/config/site.ts`), and the About page's origin-story copy. See
  `docs/DESIGN-SYSTEM.md` §Brand identity for why.
- Per-page `<title>` tags for `/resume`, `/analyzer`, `/about`, and all homepage/Resume
  page body copy — branding-only phase, not a content or homepage/Resume redesign.
- `src/features/analyzer|parser|scoring|ranking|reports`, `src/lib/supabase`,
  Interview Management integration — untouched, verified via `git diff` and a manual
  pass through `/analyzer`.
- PWA manifest — the pack includes 192/512px icons for one, but no
  `manifest.json`/`site.webmanifest` exists in this codebase yet; adding one would be
  new app functionality, not branding. The PNGs are staged in `public/brand/icons/` for
  a future PWA pass.

## Phase 3 (MVP scope) — Resume module: examples, PDF viewer, analyzer foundation

**Scope:** `docs/ROADMAP.md` Phase 3, narrowed to the Resume MVP brief. No real
resume/ATS analysis backend, no Supabase-backed requests, no payment, no admin portal
were implemented — see `docs/RESUME-ENHANCEMENT.md` for what's LIVE vs. COMING SOON vs.
FUTURE.

### Added
- `src/config/resume-examples.ts` — config-driven list of the 3 curated example resumes
  (Software Engineer/Fresher, QA Automation Engineer/1–3yrs, Data Analyst/2–4yrs).
- `scripts/generate-resume-examples.mjs` (+ `npm run generate:resume-examples`) —
  generates the 3 real, downloadable example PDFs into `public/resumes/*.pdf` using
  `jsPDF` (already a dependency; already used by
  `src/features/reports/reportGenerator.ts` — no new PDF library added). Each PDF is
  footer-labeled as a demonstration sample, not a real person.
- `src/components/resume/*` — `resume-hero.tsx` / `resume-hero-mockup.tsx`,
  `resume-examples-section.tsx`, `resume-examples-carousel.tsx` (scroll-snap, desktop
  ~3–4 visible / mobile one-at-a-time), `resume-example-card.tsx`, `resume-thumbnail.tsx`
  (CSS-built, never loads the actual PDF for a thumbnail), `resume-pdf-viewer-modal.tsx`
  (accessible: focus-trapped, Escape/backdrop-click to close, restores focus, embeds the
  PDF in an `<iframe>` and relies on the **browser's native PDF viewer** for zoom/page
  navigation/print — no PDF-rendering library was added), `resume-upload-dropzone.tsx`
  (drag/drop + click, client-side PDF-type and 5MB validation), `resume-analyzer-section.tsx`
  ("Check Your Resume" — upload UI + honest non-fabricated result state),
  `resume-guide-section.tsx` (5-step horizontal editorial guide, not a card grid),
  `support-studycart-section.tsx` (config-driven donation prompt).
- `src/lib/utils/support.ts` — `getSupportPaytmUrl()`, reads
  `NEXT_PUBLIC_SUPPORT_PAYTM_URL` (unset today; button renders disabled). No QR code was
  fabricated — none is shown until a real one is configured.
- `docs/COMPONENTS.md` — new, references AI-AGENT-GUIDE §2 which previously pointed at a
  file that didn't exist yet.

### Changed
- `src/app/resume/page.tsx` — replaced the `ComingSoon` stub with the real MVP page:
  Hero → Resume Examples → Resume Analyzer → How to Improve Your Resume → Support
  StudyCart (Footer is the shared site footer).
- `docs/RESUME-ENHANCEMENT.md`, `docs/ROUTES.md`, `docs/APPLICATION-MAP.md`,
  `docs/ARCHITECTURE.md`, `docs/ROADMAP.md` — updated to mark `/resume` LIVE and clearly
  separate what's live from what's still planned/future.

### Explicitly not implemented (by design, this phase)
- Real resume/ATS analysis. The existing analyzer/parser/scoring/ranking pipeline is
  exam-response-sheet-specific and was **not** repurposed or rewritten for resumes.
  Uploading a resume shows an honest "isn't live yet" message — never a fabricated score,
  ATS percentage, or placeholder result.
- Payment gateway, pricing, subscriptions, admin portal, `/resume/analyze`,
  `/resume/[resumeId]` routes (a modal was used instead — simpler, and sufficient for
  the MVP), Supabase-backed request persistence, authentication.

### Not changed (verified untouched)
- `src/features/analyzer|parser|scoring|ranking|reports`, `src/lib/supabase`,
  `src/types/domain.ts`, and all `src/app/analyzer`, `/result/[resultId]`,
  `/analysis/[resultId]` routes — manually verified working in a running server.
- Homepage (`src/app/page.tsx`) and all other routes from Phase 1/2 — unchanged.

## Phase 2 — Homepage: hero carousel, product storytelling, light-mode overlay cleanup

**Scope:** `docs/ROADMAP.md` Phase 2 only, plus the carried-over light-mode overlay
cleanup from Phase 1. No Resume/Library/Jobs backend, Referral, Payments, or Admin
functionality was implemented.

### Added
- `src/components/home/hero.tsx` — rewritten as a 6-slide auto-advancing carousel
  (Platform / Resume / Learn / Get Hired / Interview / One Platform), with dot
  navigation, prev/next controls, pause on hover/focus, and `useReducedMotion` support
  (disables auto-advance and initial/exit transitions).
- `src/components/home/mockups/*` — 6 reusable, hand-built "product mockup" components
  (`career-dashboard-mockup`, `resume-analysis-mockup`, `learning-library-mockup`,
  `job-listing-mockup`, `interview-tracker-mockup`, `ecosystem-mockup`), styled entirely
  from design tokens — no stock images, no fake screenshots. Each is reused both in a
  hero slide and in its corresponding homepage showcase section.
- `src/components/home/section-shell.tsx` — shared alternating two-column layout (plus
  a compact "secondary" variant) used by all four showcase sections, so layout isn't
  duplicated four times.
- New homepage sections: `how-it-helps.tsx` ("How StudyCart Helps," driven from
  `platformPillars`), `resume-showcase.tsx`, `library-showcase.tsx`, `jobs-showcase.tsx`,
  `interview-showcase.tsx` (external-link-aware, mirrors navbar's env-var handling),
  `government-jobs-section.tsx` (one compact secondary section, not a card grid),
  `technology-section.tsx` ("how it works," explicitly non-overclaiming),
  `shortcuts-section.tsx`, `final-cta.tsx`.
- `src/lib/utils/interview-management.ts` — centralizes reading
  `NEXT_PUBLIC_INTERVIEW_MANAGEMENT_URL`; navbar and the new Interview showcase both use
  it instead of duplicating `process.env` access.
- `public/images/`, `public/videos/`, `public/mockups/` — empty, asset-ready
  directories for when real product screenshots/video exist (see
  `docs/DESIGN-SYSTEM.md` §Assets).

### Changed
- `src/app/page.tsx` — rewritten to the new section order:
  Hero → How It Helps → Resume → Library → Jobs → Interview → Government Jobs
  (secondary) → Technology → Shortcuts → KasarTech Ecosystem → Final CTA.
- `src/components/shared/theme-toggle.tsx` — **bug fix**: the sun/moon icon was wrapped
  in a Framer Motion `motion.span` with an `initial`/`animate` mount transition that got
  permanently stuck at its `initial` state (`opacity: 0, scale: 0.6, rotate: -90deg`) on
  SSR-hydrated page loads, making the icon invisible on every fresh page load (only
  briefly appearing correctly right after a manual click, which is a pure client
  remount). Root-caused via DOM/computed-style inspection (icon bounding box measured
  9.6px instead of 16px — exactly the stuck 0.6 scale factor). Fixed by removing the
  animated wrapper in favor of a direct conditional render; the icon is now always
  reliably visible.
- `src/components/layout/navbar.tsx` — desktop nav pillar icons had no explicit text
  color and inherited `text-primary` (white) instead of the intended
  secondary/active-cyan color used by the label text next to them; fixed by applying the
  same conditional color class to the icon.
- `src/components/results/summary-cards.tsx`, `question-analysis-list.tsx`,
  `shared/ui/progress.tsx` — literal `bg-white/5` → theme-aware `bg-overlay-soft`,
  completing the light-mode cleanup flagged in Phase 1. The analyzer results view is now
  fully light/dark-correct.
- `docs/DESIGN-SYSTEM.md` — added an Assets section; marked the overlay known-limitation
  as resolved.

### Removed
- `src/components/home/about-preview.tsx`, `brand-story.tsx`, `features-preview.tsx`,
  `how-it-works.tsx`, `why-use.tsx` — fully superseded, analyzer-centric marketing
  sections (e.g. "Paste your response-sheet URL," "Community rank") with no importers
  besides the old `page.tsx`. Deleted rather than left as dead code.
- `src/components/home/future-features.tsx` — was already dead code (unused, unimported
  anywhere) before this phase; deleted.
- `trending-banner.tsx` is **kept** (still a working, Supabase-repository-backed
  component) but is no longer used on the homepage — it doesn't fit the new compact
  Government Jobs secondary section. Available for reuse in the Phase 8 Government Jobs
  hub if wanted.

### Not changed (verified untouched)
- `src/features/analyzer|parser|scoring|ranking|reports`, `src/lib/supabase`,
  `src/types/domain.ts`, and all `src/app/analyzer`, `/result/[resultId]`,
  `/analysis/[resultId]` routes — confirmed working via a manual pass through the
  analyzer UI in a running dev server.
- `src/components/ecosystem/*` — untouched; still has its own independent, working
  scoped theme.

### Known limitations / carried-over interim state
- `/jobs` still shows its old "Government & Private Job Listings" copy while the nav
  label now reads "Get Hired" — expected, documented, resolves in Phase 5.
- Automated mobile-viewport screenshot verification was unreliable in this session's
  Chrome automation tooling (a `resize_window` call desynced the screenshot compositor,
  and later CDP screenshot calls timed out on an unrelated page). The underlying app was
  confirmed correct via DOM/computed-style inspection and via the existing, already
  file-reviewed responsive Tailwind classes (`sm:`/`lg:` breakpoints, the pre-existing
  `lg:hidden` mobile-menu pattern) — worth a quick manual check on a real device.

## Phase 1 — Brand foundation, design system, navbar/footer (StudyCart AI Interview Support)

**Scope:** `docs/ROADMAP.md` Phase 1 only. No Resume/Library/Jobs/Referral/Payments/
Admin functionality, and no homepage redesign, were implemented.

### Added
- `src/config/platform.ts` — service-catalog config; single source of truth for the
  primary product's domain pillars (Resume, Learning Library, IT Jobs, Interview
  Support, Government Jobs).
- `src/components/shared/pillar-icon.tsx` — resolves `platform.ts` icon keys to Lucide
  components.
- `src/components/shared/theme-provider.tsx` / `theme-toggle.tsx` — site-wide light/dark
  theme system (dark remains the default; see below).
- Light-mode CSS token set in `src/app/globals.css` (`:root[data-theme="light"]`), plus
  new `--color-overlay-soft` / `--color-overlay-strong` / `--shadow-card` tokens.
- `docs/DESIGN-SYSTEM.md` — documents the actual color/typography/theme/shared-UI system.
- `src/app/resume/page.tsx`, `src/app/library/page.tsx` — Coming Soon stub pages so the
  new "Resume" and "Learn" nav items resolve to a real page (same pattern as the
  existing `/jobs`, `/books`, `/tuition` stubs).

### Changed
- `src/components/layout/navbar.tsx` — rewritten to render nav items from
  `platformPillars` instead of a hardcoded array; adds the theme toggle; "Interview
  Support" renders disabled with a "Soon" badge until
  `NEXT_PUBLIC_INTERVIEW_MANAGEMENT_URL` is set; primary CTA changed from "Analyze
  Result" (→ `/analyzer`) to "Get Started" (→ `/resume`), since the analyzer is no
  longer the primary product identity. Government Jobs is still reachable via its own
  nav item (→ `/analyzer`, an interim routing decision — see `docs/ROADMAP.md` open
  question #5).
- `src/components/layout/footer.tsx` — "Explore" column now lists Home + platform
  pillars instead of the old flat `mainNav`.
- `src/config/navigation.ts` — narrowed to non-pillar nav only (legal, community);
  domain pillars moved to `platform.ts`.
- `src/config/brand.ts` — `tagline` and `productDescription` updated to the new
  identity; added `productIdentity: "StudyCart AI Interview Support"`. Verified fields
  (location, contact, social links) left unchanged.
- `src/components/shared/ui/badge.tsx`, `button.tsx` — `neutral`/`ghost` variants
  switched from literal `bg-white/5` to the new `bg-overlay-soft` token. No visible
  change under the default dark theme; makes these two primitives theme-correct.
- `src/app/layout.tsx` — wraps the app in `ThemeProvider` and adds an inline no-flash
  script that applies a saved light-theme preference before hydration.

### Not changed (verified untouched)
- `src/features/analyzer|parser|scoring|ranking|reports`, `src/lib/supabase`,
  `src/types/domain.ts` — all Government Job Platform business logic.
- `src/app/analyzer`, `src/app/result/[resultId]`, `src/app/analysis/[resultId]`,
  `src/app/books`, `src/app/jobs`, `src/app/tuition`, `src/app/about`, `/privacy`,
  `/terms`, `src/app/page.tsx`, and all `src/components/home/*` — homepage redesign is
  Phase 2.
- `src/components/ecosystem/*` — separate KasarTech showcase with its own scoped theme
  system; unrelated to this domain split.

### Known scope limit (documented, not fixed here)
`results/summary-cards.tsx`, `results/question-analysis-list.tsx`, and
`shared/ui/progress.tsx` still use literal `bg-white/5`-style overlays that don't adapt
to the light theme. Out of Phase 1's file scope (would mean touching Government Job
Platform UI unnecessarily). Effect: a few decorative glass overlays on the analyzer
results view stay dark-tinted in light mode; text/borders/layout remain correct. See
`docs/DESIGN-SYSTEM.md` §Known scope limit.

### Decisions made without a stop
- Default theme kept as **dark**, not light, despite the original design principle
  ("light mode as default"). Flipping the default before the scope limit above is fixed
  risks visually regressing the LIVE analyzer results pages, which is explicitly
  prohibited. Flagged for approval before Phase 2.
- `/jobs` nav label changed to "Get Hired" while the page itself still shows the old
  "Government & Private Job Listings" copy — this mismatch is expected and already
  documented in `docs/ROUTES.md`/`docs/ROADMAP.md` as Phase 5 work, not left silently
  inconsistent.
