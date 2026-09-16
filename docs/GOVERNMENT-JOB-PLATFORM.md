# Government Job Platform — Product Module

**Role:** SECONDARY. Formerly called "Study" in earlier documentation. This module is
being repositioned as a distinct product area — architecturally a candidate for future
independent deployment — while its existing implementation is fully preserved. See
[PRODUCT.md](./PRODUCT.md) for how this fits the overall domain model.

> Naming note: earlier docs referenced a `docs/STUDY-PLATFORM.md`. That name is retired
> because "Study" is no longer a homepage pillar name — this document (and the
> "Government Job Platform" name) is its replacement. No content was duplicated
> elsewhere; this is the single source of truth for this domain.

## What this module owns

| Area | Status | Location |
|---|---|---|
| AI Result Analyzer / Answer Key Analysis | **LIVE** | `src/app/analyzer`, `src/features/analyzer` |
| Result view | **LIVE** | `src/app/result/[resultId]` |
| Analysis view | **LIVE** | `src/app/analysis/[resultId]` |
| Parser | **LIVE** | `src/features/parser` (adapters, security, engine) |
| Scoring | **LIVE**, unit-tested | `src/features/scoring` |
| Community ranking | **LIVE**, unit-tested | `src/features/ranking` |
| Report generation | **LIVE** | `src/features/reports` |
| Supabase integration | **LIVE** | `src/lib/supabase` |
| Domain types | **LIVE** | `src/types/domain.ts` |
| Books & Study Materials | COMING SOON (stub) | `src/app/books` |
| Mock Tests | PLANNED | not built |
| Notes | PLANNED | not built |
| Study Material hub | PLANNED | not built |

## Hard rule: preserve the analyzer

Do **not** rewrite, restructure, or "clean up" any of the LIVE items above as part of
this repositioning. The separation from IT Career is a **product/navigation/UX
boundary**, not a backend migration. Specifically preserved:

- Analyzer flow, parser, scoring, ranking, report generation
- Repositories and server actions
- Supabase integration and schema
- `result/[resultId]` and `analysis/[resultId]` routes and their contracts
- Domain types (`src/types/domain.ts`)
- Existing API contracts

Only the following may change in this repositioning:
- Where these features are *linked from* in navigation
- How they are *presented* on the homepage (secondary section, not hero)
- Documentation describing their product placement

## Homepage relationship

This module gets **one strong secondary section** on the homepage, not the hero and not
10–20 cards:

> **"Preparing for Government Jobs?"**
> "Access answer-key analysis, exam resources, books and other government-exam tools
> through our dedicated Government Job platform."
> CTA: **"Explore Government Jobs"** → navigates into this module's landing.

See [ROADMAP.md](./ROADMAP.md) §Phase 2 for exact placement in the homepage sequence.

## Future extraction path

This module is designed to be extractable into an independent product later (see
[ARCHITECTURE.md](./ARCHITECTURE.md) §Microservice Extraction Principle):

- It already owns its own Supabase project/tables.
- It must not depend on any IT Career Platform code.
- Its own dashboard, navigation, landing page, and even authentication can be added
  incrementally without this being a blocking requirement now.

No backend separation is required in this phase. This document only defines the
*intended* boundary so future work doesn't couple the two domains.
