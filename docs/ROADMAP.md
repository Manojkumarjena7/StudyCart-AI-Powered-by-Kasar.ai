# StudyCart — Roadmap & Implementation Contract

This is the authoritative phased plan for **StudyCart AI Interview Support**. It also
contains the **Claude Code Implementation Contract** — read this before implementing any
phase.

Related: [PRODUCT.md](./PRODUCT.md) · [ARCHITECTURE.md](./ARCHITECTURE.md) ·
[APPLICATION-MAP.md](./APPLICATION-MAP.md) · [ROUTES.md](./ROUTES.md) ·
[CAREER-PLATFORM.md](./CAREER-PLATFORM.md) ·
[RESUME-ENHANCEMENT.md](./RESUME-ENHANCEMENT.md) ·
[LEARNING-LIBRARY.md](./LEARNING-LIBRARY.md) ·
[IT-JOBS-REFERRAL.md](./IT-JOBS-REFERRAL.md) ·
[ADMIN-PORTAL.md](./ADMIN-PORTAL.md) ·
[GOVERNMENT-JOB-PLATFORM.md](./GOVERNMENT-JOB-PLATFORM.md) ·
[INTERVIEW-MANAGEMENT.md](./INTERVIEW-MANAGEMENT.md) ·
[AI-AGENT-GUIDE.md](./AI-AGENT-GUIDE.md)

## Current state audit (summary)

- Homepage (`src/app/page.tsx`) now implements the Phase 2 storyboard: a 6-slide hero
  carousel, "How StudyCart Helps," Resume/Library/Jobs/Interview showcases, a secondary
  Government Jobs section, a Technology section, shortcuts, the existing KasarTech
  ecosystem showcase, and a final CTA. See CHANGELOG.md for the full file list.
- `/resume` and `/library` are Coming Soon stubs (Phase 1); `/jobs` still shows its old
  "Government & Private Job Listings" copy pending Phase 5 — this is a known, documented
  interim mismatch, not a bug.
- The Government Job Platform's core (`analyzer`, `parser`, `scoring`, `ranking`,
  `reports`, `lib/supabase`) is fully implemented, tested, and LIVE — untouched by this
  repositioning.
- `src/config/platform.ts` exists (Phase 1) with pillar-level metadata only; `Phase 2`
  consumes it for nav, footer, and the "How StudyCart Helps" section.
- No `.env.example`; `NEXT_PUBLIC_INTERVIEW_MANAGEMENT_URL` is read defensively via
  `src/lib/utils/interview-management.ts` (renders disabled until set) but still not
  wired up to a real value.
- No auth, no payments, no admin surface, no resume/library/jobs backend exist in the
  codebase — Phase 2 is homepage/UI only.
- Next.js 16.2.10 is in use. `node_modules/next/dist/docs/` has version-specific docs —
  consult before writing App Router code that touches routing/data-fetching APIs.

## Product domain model (recap)

```
PRIMARY:   StudyCart AI Interview Support
             ├── Career / Resume  (RESUME)
             ├── Learning Library (LEARN)
             ├── IT Jobs          (GET HIRED)
             └── Interview Support (external link)
SECONDARY: Government Job Platform
FUTURE:    Student Services
```

## Homepage flow (target)

1. Premium Navbar
2. Animated 5–6 slide Hero (see §Hero storyboard below)
3. "What can we help you with?" — three primary flows: **RESUME · LEARN · GET HIRED**
4. Resume Enhancement showcase
5. Interview / Career Support showcase
6. Learning Library showcase
7. IT Jobs + Referral showcase
8. Interview Management integration (external, clearly marked)
9. Government Job / legacy tools — **secondary and low visual priority**, one section
10. Technology / AI / platform explanation
11. Existing useful shortcuts where appropriate
12. Final CTA

Each section needs a purpose, not just decoration. No section should exist without a
product/business reason to be there.

## Hero storyboard (5–6 auto-transitioning slides)

| # | Headline | Visual |
|---|---|---|
| 1 | "Your AI-Powered IT Interview & Career Support" | Candidate dashboard / AI career assistant |
| 2 | "Build a Resume That Gets Noticed" | Resume uploaded → AI analysis → improvements |
| 3 | "Prepare Smarter for Every Interview" | Interview preparation / questions / tracking (Interview Management preview) |
| 4 | "Learn What Actually Helps You Get Hired" | Premium learning library |
| 5 | "Find IT Jobs & Referral Opportunities" | Job listing + referral workflow |
| 6 | "Your Career. One Support Platform." | Complete ecosystem view |

Hero requirements: navigation dots/progress indicator, optional prev/next controls,
automatic transition with a sane interval, pause-on-hover/interaction where appropriate,
keyboard/accessible controls (ARIA roles for a carousel, not a div-soup slider),
`prefers-reduced-motion` support (disable auto-advance, keep manual controls), and a
mobile-friendly layout (not a horizontal-scroll afterthought). Animation must be
restrained — no gratuitous motion.

## Visual quality bar

Coherent, documented design system (tokens for color, type scale, spacing, radii,
shadows) rather than section-by-section improvisation. Real-looking product mockups over
generic stock imagery or obviously-AI-generated UI. Framer Motion for fade/slide/reveal/
subtle-scale transitions only. A `docs/DESIGN-SYSTEM.md` does not exist yet — creating it
is part of Phase 1, not assumed here.

## Phase plan

### Phase 0 — Documentation & Architecture (THIS PHASE)
- **Objective:** Establish the new StudyCart AI Interview Support domain model in docs
  before any code changes.
- **Files:** `docs/PRODUCT.md`, `docs/ARCHITECTURE.md`, `docs/APPLICATION-MAP.md`,
  `docs/ROUTES.md`, `docs/CAREER-PLATFORM.md`, `docs/RESUME-ENHANCEMENT.md`,
  `docs/LEARNING-LIBRARY.md`, `docs/IT-JOBS-REFERRAL.md`, `docs/ADMIN-PORTAL.md`,
  `docs/GOVERNMENT-JOB-PLATFORM.md`, `docs/INTERVIEW-MANAGEMENT.md`, `docs/ROADMAP.md`,
  `docs/AI-AGENT-GUIDE.md`.
- **Existing functionality affected:** none — documentation only.
- **Acceptance criteria:** docs above exist, are internally consistent, and no code
  under `src/` was modified.
- **Status:** done as of this commit.

### Phase 1 — Design system + shared layout + navbar — **DONE**
- **Objective:** Grouped navigation reflecting Resume/Library/Jobs/Interview
  Support/Government Jobs; `docs/DESIGN-SYSTEM.md` with real tokens; introduce
  `src/config/platform.ts`.
- **Files:** `src/config/navigation.ts` (restructured), new `src/config/platform.ts`,
  `src/components/layout/navbar.tsx` (rewritten), `src/components/layout/footer.tsx`
  (rewritten), new `docs/DESIGN-SYSTEM.md`, `src/app/globals.css` (light/dark tokens),
  new `src/components/shared/theme-provider.tsx`, new
  `src/components/shared/theme-toggle.tsx`, new `src/components/shared/pillar-icon.tsx`,
  `src/app/layout.tsx` (ThemeProvider + no-flash script), `src/config/brand.ts`
  (tagline/description updated to the new identity), `src/components/shared/ui/badge.tsx`
  and `button.tsx` (literal `bg-white/5` → theme-aware `bg-overlay-soft`), new
  `src/app/resume/page.tsx` and `src/app/library/page.tsx` (Coming Soon stubs so the
  new nav items resolve to a real page).
- **Existing functionality affected:** navbar/footer/shared UI only;
  `src/features/*`, `src/lib/supabase`, and all analyzer/result/analysis pages were not
  modified.
- **Acceptance criteria:** nav reflects the new primary domains ✅, all existing routes
  still reachable ✅, both themes work for the design-system foundation (navbar, footer,
  buttons, badges, Coming Soon pages) ✅ — a handful of literal-color overlays in
  `results/*` and `shared/ui/progress.tsx` remain dark-only, documented as a known scope
  limit in `docs/DESIGN-SYSTEM.md` rather than silently left undocumented.
- **Default theme:** kept as **dark** (not light) to guarantee zero visual regression
  on existing LIVE pages outside Phase 1's file scope; flipping the default to light is
  deferred pending a full component audit — see "Anything needing approval" in the
  Phase 1 report.
- **Tests:** `npm run lint`, `npm run test`, `npm run build` — see CHANGELOG.md for
  results.

### Phase 2 — New homepage (hero + storyboard) — **DONE**
- **Objective:** Implement the homepage flow and hero storyboard above.
- **Files:** `src/app/page.tsx` (rewritten); new `src/components/home/hero.tsx`
  (rewritten as a 6-slide carousel), `how-it-helps.tsx`, `resume-showcase.tsx`,
  `library-showcase.tsx`, `jobs-showcase.tsx`, `interview-showcase.tsx`,
  `government-jobs-section.tsx`, `technology-section.tsx`, `shortcuts-section.tsx`,
  `final-cta.tsx`, `section-shell.tsx`, and `mockups/*` (6 reusable illustrative
  product-mockup components); new `src/lib/utils/interview-management.ts`; removed
  `about-preview.tsx`, `brand-story.tsx`, `features-preview.tsx`, `future-features.tsx`
  (dead code), `how-it-works.tsx`, `why-use.tsx` — all fully superseded, analyzer-centric
  marketing sections with no other importers. `trending-banner.tsx` kept but no longer
  used on the homepage. New `public/images/`, `public/videos/`, `public/mockups/`
  (asset-ready, currently empty). Also completed the light-mode overlay cleanup carried
  over from Phase 1 (`results/summary-cards.tsx`, `results/question-analysis-list.tsx`,
  `shared/ui/progress.tsx`).
- **Existing functionality affected:** homepage only; analyzer/result/analysis routes
  and their business logic untouched and verified working.
- **Acceptance criteria:** homepage matches the storyboard order and priority ✅;
  Government Jobs appears as exactly one low-priority secondary section ✅; every
  Resume/Library/Jobs CTA is honestly labeled "Coming soon" ✅; Interview Support CTA is
  disabled until the env var is set ✅; hero has 6 auto-advancing slides with dot
  navigation, prev/next controls, pause-on-hover/focus, and `useReducedMotion` support ✅.
- **Bugs found and fixed during implementation:** (1) a mockup component called
  `useReducedMotion()` without a `"use client"` directive, which broke static
  prerendering of `/` — fixed. (2) `ThemeToggle`'s Framer Motion mount animation got
  permanently stuck at its `initial` (invisible, 60%-scale) state on SSR-hydrated page
  loads — the icon was invisible except briefly after a manual click. Fixed by removing
  the animated wrapper in favor of a direct conditional icon render — see
  CHANGELOG.md. (3) desktop nav pillar icons had no explicit text color and inherited
  white instead of the intended muted/active color — fixed.
- **Tests:** `npm run lint`, `npm run test`, `npm run build` — see CHANGELOG.md.

### Phase 3 — Resume — **MVP DONE**, paid Enhancement flow still PLANNED
- **Objective (revised — MVP scope):** ship a practical, simple Resume MVP: browse
  professional resume examples, view/download real reference PDFs, and a working upload
  UI with an honest (not fabricated) result — per the Resume MVP brief in
  [RESUME-ENHANCEMENT.md](./RESUME-ENHANCEMENT.md). This intentionally excludes the
  original Phase 3 scope below (Supabase-backed requests, real analysis, payment).
- **Files:** `src/app/resume/page.tsx` (rewritten); new `src/config/resume-examples.ts`;
  new `src/components/resume/*` (hero, examples carousel/card/thumbnail, PDF viewer
  modal, upload dropzone, analyzer section, guide section, support section — see
  [COMPONENTS.md](./COMPONENTS.md)); new `src/lib/utils/support.ts`; new
  `scripts/generate-resume-examples.mjs` + `public/resumes/*.pdf` (3 real, generated,
  clearly-labeled sample resumes); light-mode/overlay-token reuse only, no new tokens.
- **Existing functionality affected:** `/resume` only; analyzer/result/analysis routes
  and their business logic untouched and verified working.
- **Acceptance criteria:** Resume Examples carousel works on desktop and mobile ✅; View
  opens an accessible modal using the browser's native PDF viewer (zoom/page-nav/print
  come free) ✅; Download works with no login ✅; upload UI validates type/size
  client-side ✅; submitting an upload shows an honest "not live yet" message, never a
  fabricated score ✅; Support section is config-driven and disabled until a real Paytm
  URL is set — no fabricated QR code ✅.
- **Still PLANNED (original Phase 3 scope, not done in this MVP):** real resume/ATS
  analysis backend; `resume_requests` persistence; the primary product's own Supabase
  project/schema for auth + requests (see [ARCHITECTURE.md](./ARCHITECTURE.md) §Data
  ownership — new infrastructure, not an extension of the analyzer's Supabase); payment;
  admin-managed reference library (vs. the current static 3-example config).
- **Tests:** `npm run lint`, `npm run test`, `npm run build` — see CHANGELOG.md.

### Phase 4 — Learning Library (browse + controlled access)
- **Objective:** `/library` browse/category/detail with controlled viewing for
  paid/protected items, per [LEARNING-LIBRARY.md](./LEARNING-LIBRARY.md).
- **Acceptance criteria:** categories are data-driven, protected content isn't a raw
  download link, login required only at purchase/view — not at browse.

### Phase 5 — IT Jobs + Referral
- **Objective:** `/jobs` reclassified content + `/jobs/[jobId]` + referral request flow
  per [IT-JOBS-REFERRAL.md](./IT-JOBS-REFERRAL.md).
- **Acceptance criteria:** Apply always exits to an external URL; referral request
  requires auth; no HR contact info exposed publicly.

### Phase 6 — External Interview Management integration
- **Objective:** Wire up `NEXT_PUBLIC_INTERVIEW_MANAGEMENT_URL` once a real URL is
  provided; add the external-link affordance in nav/homepage/interview section.
- **Acceptance criteria:** link only renders/enables when the env var is set; clearly
  marked as external; no iframe embedding; no workaround for its known Supabase issue.

### Phase 7 — Admin Portal (incremental)
- **Objective:** Build one admin surface at a time (Resume references/requests first,
  then Library, then Jobs) per [ADMIN-PORTAL.md](./ADMIN-PORTAL.md), role-gated.
- **Acceptance criteria:** admin routes unreachable without the appropriate role; no
  admin surface exposed to normal users.

### Phase 8 — Government Job Platform landing (`/government-jobs`)
- **Objective:** Hub page linking to the existing analyzer/books without moving them.
- **Acceptance criteria:** existing analyzer URLs unchanged; hub links correctly.

### Phase 9 — Payments / subscriptions
- **Objective:** Not to be implemented without a separate, explicitly approved design
  phase. Covers resume-enhancement payment and any future HR-contact paid feature.

### Phase 10 — Services / Student Services, Analytics
- Not scheduled. Documented only for extensibility.

## Testing / verification plan

- `npm run build` must pass with zero errors after every phase.
- `npm run test` (Vitest) must keep passing — existing analyzer/scoring/ranking unit
  tests are the regression guard for Government Job Platform logic.
- Manual verification per phase: both themes, mobile width (~375–420px),
  `prefers-reduced-motion` behavior on the hero, and the full analyzer upload → result →
  analysis flow after any homepage/nav change.

## Risks & technical debt

- `/jobs` currently has copy for the wrong domain ("Government & Private Job Listings")
  — must be rewritten when Phase 5 lands, not left inconsistent with its new role.
- `/tuition` remains unclassified; resolve before it accumulates more content.
- Two separate Supabase projects (Government Job Platform's existing one, and a new one
  for the primary product) must never be conflated — document connection strings/env
  vars distinctly when the new project is created.
- Admin role model is undecided (see Open Questions) — avoid ad hoc gating logic that
  later needs to be redone.
- `navigation.ts`'s flat-array shape doesn't support the grouped IA needed for
  Resume/Library/Jobs — Phase 1 must restructure it, auditing call sites first.

## Open questions / decisions required

1. Should 1-on-1 Career Support, ATS Optimization, Naukri/LinkedIn/GitHub/Portfolio
   help ever return, and if so as expansions of "Career Support" or as their own
   pages? Not decided — see [CAREER-PLATFORM.md](./CAREER-PLATFORM.md) §Superseded scope.
2. Exact production URL for `NEXT_PUBLIC_INTERVIEW_MANAGEMENT_URL` — needs to come from
   whoever owns that application.
3. Final URL slugs for Resume/Library/Jobs/Admin subpages — this doc uses illustrative
   slugs; confirm before each phase's build-out.
4. Admin role model: a `role` column vs. a separate `admins` table, and how it's
   enforced (middleware vs. per-route check).
5. `/tuition`'s long-term home — Student Services, its own vertical, or deprioritized.
6. Whether the ₹40–₹50 resume pricing is final or provisional, and whether it varies by
   resume type/role category.

## Claude Code Implementation Contract

When asked to implement a phase from this roadmap, Claude Code must:

1. Implement **only** the phase specified — do not jump ahead to later phases.
2. Read [AI-AGENT-GUIDE.md](./AI-AGENT-GUIDE.md), [ARCHITECTURE.md](./ARCHITECTURE.md),
   and this file before touching code.
3. Never modify files under `src/features/analyzer|parser|scoring|ranking|reports`,
   `src/lib/supabase`, or `src/types/domain.ts` unless the phase explicitly says so.
4. Never invent API routes, environment variables, external URLs, pricing values, or
   automation that doesn't actually exist (e.g. never claim resume enhancement is fully
   AI-automated — it is admin-fulfilled today).
5. Keep the Government Job Platform and the primary product (Resume/Library/Jobs)
   decoupled per [ARCHITECTURE.md](./ARCHITECTURE.md) §Route boundary rules, including
   using a separate Supabase project for the primary product.
6. Run `npm run build` and `npm run test` after implementation; both must pass.
7. Update the relevant docs listed in each phase.
8. If an architectural conflict is discovered, **stop and document the conflict** —
   do not silently reinterpret the architecture.
9. Do not implement Phase 9 (payments/subscriptions) without separate explicit
   approval, even if asked to "finish the roadmap."
10. Do not build more of the Admin Portal than the phase calls for — it is
    architected, not a green light to build all admin surfaces at once.
