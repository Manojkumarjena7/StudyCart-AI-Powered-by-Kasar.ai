# Interview Management — External Integration Contract

## What it is

Interview Management is an **existing, separate application**. It is not part of
StudyCart's codebase and never will be merged into it.

It has its own:
- Supabase instance
- Authentication system
- API layer
- Business logic
- Deployment

A currently-known Supabase issue inside Interview Management is that application's own
technical problem. It does not block, and must not influence, StudyCart's homepage or
product architecture decisions.

## Who uses it

**A. Coaching institutions** — track candidates across interviews:

```
Candidate → Interview → HR → Round → Questions → Feedback → Result → Final outcome
```

**B. Individual candidates** — track their own interview history:

```
My interviews → schedule → interviewer → questions → feedback → status → outcome
```

Capabilities include: candidate management, interview scheduling, personal interview
slots, HR/interviewer tracking, interview timing, interview stage tracking, success/fail
tracking, final-stage tracking, questions asked, HR feedback, interview history, and
candidate progress.

This detail is documented here so StudyCart's UI can accurately describe what the linked
application does — StudyCart does not reimplement any of it.

## How StudyCart integrates with it

StudyCart links out to it via one environment variable:

```
NEXT_PUBLIC_INTERVIEW_MANAGEMENT_URL
```

- This variable is not yet defined anywhere in the repo (no `.env.example` exists). Do
  not invent a value or a production URL for it — leave it as a documented, unset
  integration point until the real URL is provided.
- When wired up, StudyCart should open it as an external link (new tab), clearly marked
  in the UI as an external application (e.g. "Interview Management ↗ opens in a new
  tab").

## What is never allowed

- Importing Interview Management's code into StudyCart
- Accessing its Supabase/database directly
- Copying or reimplementing its backend logic inside StudyCart
- Creating a fake/mocked integration that pretends to call it
- Embedding it via iframe in a way that hides that it's a separate application
- Building StudyCart-side workarounds for its Supabase issue — that's out of scope here

## Where it appears in the product

- Primary product's "Interview Support" domain (see [ARCHITECTURE.md](./ARCHITECTURE.md))
  — a single outbound entry point, marked `external: true` in the service catalog
  (see [ARCHITECTURE.md](./ARCHITECTURE.md) §Service catalog model).
- Homepage's Interview Management section (see [ROADMAP.md](./ROADMAP.md) §Homepage
  storyboard), presented as a visual step in the career journey with a clear "external
  application" affordance.

## Status

**EXTERNAL / integration PLANNED.** The link-out mechanism itself has not been built in
the codebase yet; this document defines the contract Claude Code must follow once it is.
