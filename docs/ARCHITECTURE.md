# StudyCart — Product Architecture

## Domain Model

```
StudyCart AI Interview Support        ← PRIMARY product identity
│
├── Career / Resume
│   ├── Resume Enhancement
│   ├── Resume Analysis
│   └── Career Support
│
├── Learning Library
│   ├── Automation
│   ├── Manual
│   ├── AI
│   ├── Programming
│   └── Interview
│
├── IT Jobs
│   ├── Job Listings
│   ├── Apply (external)
│   └── Referral
│
└── Interview Support
    └── External: Interview Management (linked, never merged)

Government Job Platform               ← SECONDARY, separable module
│
└── Existing analyzer + exam ecosystem (unchanged)

Future: Student Services              ← proposed vertical, not yet built
```

This is a **product/route/navigation boundary today**, not a service-repo split. See
§Microservice Extraction Principle for how the Government Job Platform stays separable.

## Why this change (2nd repositioning)

The first repositioning made "IT Career Platform" (a broad bundle of resume, ATS,
Naukri, LinkedIn, GitHub, portfolio, referral, and interview-prep) the primary identity,
with Government Jobs secondary. That has now been sharpened further: the primary
product is **StudyCart AI Interview Support**, built around three concrete flows —
**Resume, Learn, Get Hired** — plus a link out to the existing Interview Management app.
Government Jobs remains secondary and unchanged. See [PRODUCT.md](./PRODUCT.md).

Items previously scoped under the broad Career pillar (ATS Optimization, Naukri/
LinkedIn/GitHub/Portfolio help, standalone Interview Prep/Questions/Mock pages) are
**superseded** — out of current scope, not deleted from the long-term vision. See
[CAREER-PLATFORM.md](./CAREER-PLATFORM.md) §Superseded scope.

## Current file ownership (as of this audit)

```
src/app/
  page.tsx              → Homepage (to be redesigned per ROADMAP.md storyboard)
  analyzer/              → Government Job Platform — LIVE, do not modify logic
  result/[resultId]/     → Government Job Platform — LIVE, do not modify logic
  analysis/[resultId]/   → Government Job Platform — LIVE, do not modify logic
  books/                 → Government Job Platform — stub (Coming Soon)
  jobs/                  → Currently a generic "Government & Private Job Listings"
                           stub. Under this repositioning, /jobs becomes the IT Jobs
                           domain (primary product) — see ROUTES.md. Reclassifying its
                           copy/content is a Phase task, not implied by this doc alone.
  tuition/               → Still unclassified; candidate future Student Services item
  about/, privacy/, terms/ → Shared/platform-level, not domain-owned

src/components/
  home/          → Homepage sections — full redesign per ROADMAP.md storyboard
  analyzer/      → Government Job Platform UI — LIVE, do not modify
  results/       → Government Job Platform UI — LIVE, do not modify
  ranking/       → Government Job Platform UI — LIVE, do not modify
  ecosystem/     → KasarTech cross-product ecosystem showcase — unrelated to the
                   primary/secondary domain split
  layout/        → navbar.tsx, footer.tsx — shared shell, updated per ROADMAP.md Phase 1
  shared/        → cross-domain primitives (ui/, coming-soon, etc.)

src/features/
  analyzer/, parser/, scoring/, ranking/, reports/  → Government Job Platform
  business logic. LIVE, tested. DO NOT REWRITE. See AI-AGENT-GUIDE.md §3.

src/lib/supabase/  → Government Job Platform's own Supabase repositories. LIVE.
src/types/domain.ts → Government Job Platform domain types. LIVE.

src/config/
  platform.ts     → DOES NOT YET EXIST. Proposed service-catalog config (see below).
  navigation.ts    → Current flat nav model. Will need restructuring for the new
                    primary domains (Resume/Learn/Jobs) — not done yet.
  brand.ts, site.ts → Unchanged; still accurate.
  ecosystem/products.ts → KasarTech ecosystem product list, unrelated to this split.
```

The Resume domain now has a real MVP: Resume Examples (3 config-driven, downloadable
reference PDFs with an in-page viewer) and a Resume Analyzer UI foundation (no real
analysis backend yet) — see [RESUME-ENHANCEMENT.md](./RESUME-ENHANCEMENT.md) and
[COMPONENTS.md](./COMPONENTS.md). No code for the *paid* Resume Enhancement flow,
Learning Library, IT Jobs, or an admin portal exists yet. Everything in this document
describing those is architecture/planning, not a description of current implementation.

## Route boundary rules

1. Government Job Platform routes must not import from `src/components/home/*` or any
   future primary-product component directories (`career/`, `resume/`, `library/`,
   `jobs/`) — keep the domains decoupled.
2. Primary-product routes (Resume/Learn/Jobs) must not import Government Job Platform
   business logic (`src/features/analyzer|parser|scoring|ranking|reports`,
   `src/lib/supabase`, `src/types/domain.ts`).
3. Shared primitives (`src/components/shared/ui`, `src/config/brand.ts`,
   `src/config/site.ts`, theme system) may be used by both.
4. Interview Management is never imported as code — only linked via
   `NEXT_PUBLIC_INTERVIEW_MANAGEMENT_URL`. See [INTERVIEW-MANAGEMENT.md](./INTERVIEW-MANAGEMENT.md).
5. Admin-only routes/functionality must never be reachable by normal users — gate
   behind role/auth checks once auth exists (see §Data ownership).

## Service catalog model (proposed)

A single configuration-driven catalog (`src/config/platform.ts`, not yet created)
should eventually drive the homepage, category pages, navigation, and footer:

```ts
type ServiceStatus = "LIVE" | "IN_PROGRESS" | "COMING_SOON" | "PLANNED" | "PROPOSED";

interface PlatformService {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
  status: ServiceStatus;
  badge?: string;
  external?: boolean;
  domain: "resume" | "library" | "jobs" | "interview-support"
        | "government-jobs" | "student-services";
}
```

Never mark a service `LIVE` unless it is actually deployed and functional (today, only
the AI Result Analyzer qualifies).

## Data model overview (proposed — not yet implemented)

These entities belong to the **primary product's own Supabase project** (see §Data
ownership), not the Government Job Platform's:

| Entity | Purpose | Owner-editable via |
|---|---|---|
| `users` | Auth + profile (Supabase Auth) | self-serve signup |
| `resume_requests` | User's resume enhancement request lifecycle | user creates; admin fulfills |
| `resume_references` | Curated example/rule PDFs admin maintains | admin only |
| `library_content` | Learning library items (see LEARNING-LIBRARY.md fields) | admin only |
| `library_access` | What a user has purchased/can view | system, on purchase |
| `jobs` | IT job listings | admin only |
| `referral_requests` | User-initiated referral requests per job | user creates; admin handles |

**Not in this table:** the 3 current Resume Examples are a static, code-level config
(`src/config/resume-examples.ts`), not a database table — appropriate for a small,
developer-curated set. If/when the reference library grows into admin-managed content
(the `resume_references` row above), that becomes a real table; the two are not the
same thing. See [RESUME-ENHANCEMENT.md](./RESUME-ENHANCEMENT.md).

Field-level detail lives in each domain doc
([RESUME-ENHANCEMENT.md](./RESUME-ENHANCEMENT.md),
[LEARNING-LIBRARY.md](./LEARNING-LIBRARY.md),
[IT-JOBS-REFERRAL.md](./IT-JOBS-REFERRAL.md)). This table exists to keep names
consistent across docs and future code — do not invent parallel names for the same
entity.

## Microservice extraction principle

Unchanged from the prior repositioning: no shared business logic between the primary
product and the Government Job Platform; centralize cross-cutting config (brand, theme,
shared UI); document data ownership; no in-process cross-domain calls.

## Data ownership

| Domain | Data store | Notes |
|---|---|---|
| Government Job Platform | Existing Supabase project (analyzer results, rankings) | LIVE, unchanged |
| StudyCart AI Interview Support (primary) | A **separate** Supabase project/schema for auth, resume requests, library, jobs, referrals | Not created yet — do not extend the analyzer's schema |
| Interview Management | Its own Supabase (external, opaque to StudyCart) | Never accessed directly; its current Supabase issue is that team's problem, not StudyCart's |

## Admin boundary

An eventual admin portal (see [ADMIN-PORTAL.md](./ADMIN-PORTAL.md)) manages Resume
references/requests, Library content, Jobs, and Users. It never manages Interview
Management (reference/link only) and never touches Government Job Platform internals
beyond what's already exposed. Admin functionality must not be user-reachable without
role gating.

## Related documents

- [PRODUCT.md](./PRODUCT.md) — what StudyCart is, domain model, status matrix
- [APPLICATION-MAP.md](./APPLICATION-MAP.md) — sitemap grouped by domain
- [ROUTES.md](./ROUTES.md) — route-by-route detail
- [CAREER-PLATFORM.md](./CAREER-PLATFORM.md) — Career/Resume IA (narrowed scope)
- [RESUME-ENHANCEMENT.md](./RESUME-ENHANCEMENT.md) — resume flow, reference library, pricing
- [COMPONENTS.md](./COMPONENTS.md) — shared UI, resume, and home component reference
- [LEARNING-LIBRARY.md](./LEARNING-LIBRARY.md) — content model, access model
- [IT-JOBS-REFERRAL.md](./IT-JOBS-REFERRAL.md) — job listing, apply, referral flow
- [ADMIN-PORTAL.md](./ADMIN-PORTAL.md) — admin scope, architected not built
- [GOVERNMENT-JOB-PLATFORM.md](./GOVERNMENT-JOB-PLATFORM.md) — Government Job IA
- [INTERVIEW-MANAGEMENT.md](./INTERVIEW-MANAGEMENT.md) — external integration contract
- [ROADMAP.md](./ROADMAP.md) — phased implementation plan + Claude Code contract
