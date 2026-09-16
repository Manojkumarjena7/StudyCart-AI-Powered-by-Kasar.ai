# Career / Resume — Product Module

**Role:** Part of the primary product, StudyCart AI Interview Support — specifically the
"RESUME" flow plus general career support. See [PRODUCT.md](./PRODUCT.md) for the
overall domain model.

> **Revision note (2nd repositioning):** This module's scope was narrowed. It previously
> covered a broad "IT Career Platform" IA (Resume, ATS, Naukri, LinkedIn, GitHub,
> Portfolio, Referral, 1-on-1 Support, Interview Prep/Questions/Mock, Interview
> Management link). It now covers only **Resume Enhancement, Resume Analysis, and
> Career Support** — see §Superseded scope below for where the rest went.

## Current scope

- **Resume Enhancement** — full flow documented in
  [RESUME-ENHANCEMENT.md](./RESUME-ENHANCEMENT.md) (upload → analysis → paid request →
  admin-fulfilled deliverable).
- **Resume Analysis** — the analysis step of the same flow (issues/suggestions surfaced
  before the paid enhancement step). Not a separate product — it's a stage of Resume
  Enhancement, documented there.
- **Career Support** — general career guidance framing on the homepage/product; no
  separate implementation defined yet beyond what Resume Enhancement covers. If this
  grows into 1-on-1 coaching or similar, document it here when scoped.

## Superseded scope

The following are **not** part of current architecture. They are not deleted from the
long-term product vision, just out of scope until explicitly reintroduced:

- ATS Optimization
- Naukri Profile Help
- LinkedIn Profile Help
- GitHub Profile Help
- Portfolio Help
- Referral Assistance *(moved — referral is now part of [IT-JOBS-REFERRAL.md](./IT-JOBS-REFERRAL.md), tied to job listings, not a standalone Career service)*
- 1-on-1 Career Support *(may return as an expansion of "Career Support" above — not decided)*
- Standalone Interview Preparation / Interview Questions / Mock Interview pages
  *(interview support is now represented by the external Interview Management link —
  see [INTERVIEW-MANAGEMENT.md](./INTERVIEW-MANAGEMENT.md) — not standalone StudyCart
  pages)*

Do not resurrect any of these in code without confirming it against current docs first
— see [ROADMAP.md](./ROADMAP.md) §Open questions.

## Boundaries

- Must not import Government Job Platform business logic
  (`src/features/analyzer|parser|scoring|ranking|reports`, `src/lib/supabase`,
  `src/types/domain.ts`). See [ARCHITECTURE.md](./ARCHITECTURE.md) §Route boundary rules.
- No backend/auth/data storage exists for this domain yet; see
  [ARCHITECTURE.md](./ARCHITECTURE.md) §Data ownership before building any.
- Interview Management is linked, never embedded or imported.

## Status

**PLANNED.** No code exists for this module yet.
