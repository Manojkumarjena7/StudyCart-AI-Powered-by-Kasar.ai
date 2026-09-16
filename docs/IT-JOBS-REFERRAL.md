# IT Jobs + Referral — Product Module

**Role:** Primary flow #3 ("GET HIRED") of StudyCart AI Interview Support. See
[PRODUCT.md](./PRODUCT.md) and [ARCHITECTURE.md](./ARCHITECTURE.md).

Note: the existing `/jobs` route (currently a "Government & Private Job Listings"
Coming-Soon stub) becomes this domain's route under the new architecture — see
[ROUTES.md](./ROUTES.md). Reclassifying its copy is a Phase task, not implied by this
document alone.

## User-facing content

Each job listing shows: company, role, location, experience, skills, eligibility,
description, apply link, and whether referral is available.

## Application flow

```
StudyCart job listing → Job details → Apply → external company/Naukri/etc. application
```

StudyCart is **not** the employer's application system and must never present itself as
one. "Apply" always exits to an external URL the admin configured per job.

## Referral flow

```
Job (referral available) → user requests referral → user provides required info →
referral_requests record created → admin/process owner handles it
```

A possible future option is **"Get Direct HR Contact"**, likely a paid service. Rules:

- Never expose personal HR phone numbers/contacts publicly on the page.
- Access to such contact info must be gated by authentication/payment/business rules
  once those exist.
- Do not implement the paid HR-contact flow before payment architecture is approved
  (see [ROADMAP.md](./ROADMAP.md)).

## Data model (proposed)

`jobs`:
- id, company, role, location, experience, skills (array), eligibility, description,
  apply_url, referral_available (bool), status (`draft` | `published` | `unpublished` |
  `expired`), expires_at, created_at, updated_at

`referral_requests`:
- id, user_id, job_id, submitted_info (structured), status (`submitted` | `in_progress` |
  `fulfilled` | `declined`), created_at, updated_at

Lives in the primary product's own Supabase (see [ARCHITECTURE.md](./ARCHITECTURE.md)
§Data ownership).

## Admin capabilities (architected, not all built now)

Admin can: add job, edit job, remove job, publish/unpublish, set expiry, set external
apply URL, add referral information, mark referral available, update job status. Admin
functionality must never be exposed to normal users — see
[ADMIN-PORTAL.md](./ADMIN-PORTAL.md).

## Authentication requirement

Browsing jobs does not require login. Login is required to request a referral or access
HR-contact-style features — see [PRODUCT.md](./PRODUCT.md) §Authentication.

## Status

**PLANNED.** No code exists for this module yet; `/jobs` is currently an unrelated
Coming-Soon stub.
