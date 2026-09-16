# Admin Portal — Architecture (not yet implemented)

**Role:** Central management surface for the primary product's operational data. This
document architects the admin portal so future work has a clear shape — it does **not**
mean all of this should be built now. See [ROADMAP.md](./ROADMAP.md) for phasing.

## Scope

| Area | Admin manages | Doc reference |
|---|---|---|
| **Resume** | reference PDFs, resume requests, pricing config, completed PDFs, user deliverables | [RESUME-ENHANCEMENT.md](./RESUME-ENHANCEMENT.md) |
| **Library** | content, categories, prices, access rules, publishing | [LEARNING-LIBRARY.md](./LEARNING-LIBRARY.md) |
| **Jobs** | jobs, companies, apply links, referral info, expiry, status | [IT-JOBS-REFERRAL.md](./IT-JOBS-REFERRAL.md) |
| **Users** | users, purchases, requests, access grants | — |
| **Interview** | reference/link only — no management surface into the external app | [INTERVIEW-MANAGEMENT.md](./INTERVIEW-MANAGEMENT.md) |

## Boundaries

- Admin never manages Interview Management directly — that application is external and
  opaque to StudyCart (see [INTERVIEW-MANAGEMENT.md](./INTERVIEW-MANAGEMENT.md)).
- Admin never touches Government Job Platform internals beyond whatever is already
  exposed through its own existing tooling (none is being added here).
- Admin routes/UI must be gated by role/auth and must never be reachable by a normal
  authenticated user, let alone an anonymous visitor.

## Implementation posture

- No admin UI exists yet. Do not scaffold `/admin/*` routes ahead of the phase that
  calls for them (see [ROADMAP.md](./ROADMAP.md)).
- When built, admin should read/write the same data model documented in
  [ARCHITECTURE.md](./ARCHITECTURE.md) §Data model overview and each domain doc — do not
  invent a parallel schema.
- Role/permission model is not decided yet (e.g. a `role` column on `users` vs. a
  separate `admins` table) — this is an open question, not something to resolve
  unilaterally at implementation time. See [ROADMAP.md](./ROADMAP.md) §Open questions.

## Status

**PROPOSED / architected only.** Build incrementally, one admin surface at a time,
starting only when the corresponding user-facing flow (Resume, Library, or Jobs) is far
enough along to need real content management.
