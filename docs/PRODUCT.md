# StudyCart — Product Definition

> **Revision note (2nd repositioning):** This document supersedes the previous "IT
> Career Platform" model (Resume/ATS/Naukri/LinkedIn/GitHub/Portfolio/Referral/
> Interview-Prep as one broad Career pillar). The product is now **StudyCart AI
> Interview Support**, organized around three sharp primary flows — **Resume, Learn,
> Get Hired** — plus a link out to Interview Management. See
> [ARCHITECTURE.md](./ARCHITECTURE.md) for the full domain model and
> [ROADMAP.md](./ROADMAP.md) for phasing.

## Brand

**Name:** StudyCart
**Endorsement:** Powered by Kasar.ai
**Product identity:** StudyCart AI Interview Support
**Positioning:** AI-powered IT career and interview support platform for job seekers,
freshers, and candidates preparing for IT jobs.

StudyCart AI Interview Support should feel like a serious startup product — not a
generic student portal, not a coaching website, not an answer-key analyzer, not a
grab-bag of unrelated services, and not a generic SaaS template.

## Product Domain Model

| Domain | Role | Status |
|---|---|---|
| **StudyCart AI Interview Support** | PRIMARY — Career/Resume + Learning Library + IT Jobs/Referral + Interview Support | IN PROGRESS (planning → build) |
| **Government Job Platform** | SECONDARY — separate module/microservice-in-waiting | LIVE (analyzer only; rest PLANNED) |
| **Interview Management** | EXTERNAL — independent application | EXTERNAL (integration PLANNED) |
| **Student Services** | FUTURE — not a current implementation priority | PROPOSED |

See [ARCHITECTURE.md](./ARCHITECTURE.md) for route/file ownership and
[ROADMAP.md](./ROADMAP.md) for the homepage storyboard.

### 1. StudyCart AI Interview Support (PRIMARY)

Three primary user-facing flows, matched to the homepage's "What can we help you with?"
section:

| Flow | Domain doc | Status |
|---|---|---|
| **RESUME** — Resume Enhancement, Resume Analysis, Career Support | [RESUME-ENHANCEMENT.md](./RESUME-ENHANCEMENT.md) | PLANNED |
| **LEARN** — Career Learning Library | [LEARNING-LIBRARY.md](./LEARNING-LIBRARY.md) | PLANNED |
| **GET HIRED** — IT Jobs + Referral | [IT-JOBS-REFERRAL.md](./IT-JOBS-REFERRAL.md) | PLANNED |
| **Interview Support** — link out to Interview Management | [INTERVIEW-MANAGEMENT.md](./INTERVIEW-MANAGEMENT.md) | EXTERNAL |

**Superseded scope:** ATS Optimization, Naukri Profile Help, LinkedIn Profile Help,
GitHub Profile Help, Portfolio Help, and standalone Interview Preparation/Questions/Mock
Interview pages (previously documented in `CAREER-PLATFORM.md`) are **not** part of the
current primary architecture. They are not deleted from the product vision, but they are
out of current scope — see [CAREER-PLATFORM.md](./CAREER-PLATFORM.md) §Superseded scope
and [ROADMAP.md](./ROADMAP.md) §Open questions before reintroducing any of them.

### 2. Government Job Platform (SECONDARY)

Unchanged in substance from the prior repositioning — see
[GOVERNMENT-JOB-PLATFORM.md](./GOVERNMENT-JOB-PLATFORM.md). Still secondary, still not
the homepage identity, still fully preserved (analyzer, parser, scoring, ranking,
reports, Supabase integration).

| Service | Status |
|---|---|
| AI Result Analyzer / Answer Key Analysis | **LIVE** |
| Books | COMING SOON (stub) |
| Study Material / Mock Tests / Notes | PLANNED |

### 3. Interview Management (EXTERNAL)

**Not part of StudyCart's codebase.** Used by two audiences — coaching institutions and
individual candidates — for interview/candidate tracking. Full contract in
[INTERVIEW-MANAGEMENT.md](./INTERVIEW-MANAGEMENT.md). A known Supabase issue in that
application is its own team's problem and does not block StudyCart's homepage or
product architecture.

### 4. Student Services (FUTURE)

Printing/Xerox/etc. Not a current implementation priority. Documented only so the
architecture stays extensible — see [ARCHITECTURE.md](./ARCHITECTURE.md).

## Business flows introduced in this repositioning

These are **architecture, not implemented automation**. Do not build UI or backend that
pretends any of this is fully automated before it is:

1. **Resume Enhancement:** `Upload → AI-assisted analysis against curated reference
   library → issues/suggestions → paid request → admin manually prepares enhanced PDF →
   delivered to user account.` See [RESUME-ENHANCEMENT.md](./RESUME-ENHANCEMENT.md).
2. **Learning Library access:** `Browse → select → purchase/access → login → controlled
   view (not free download).` See [LEARNING-LIBRARY.md](./LEARNING-LIBRARY.md).
3. **IT Jobs + Referral:** `Browse jobs → apply externally (StudyCart is not the
   employer's application system) → optionally request a referral → admin/process owner
   handles it.` See [IT-JOBS-REFERRAL.md](./IT-JOBS-REFERRAL.md).
4. **Admin Portal:** future central management for Resume/Library/Jobs/Users. Architect
   for it now; do not build all of it now. See [ADMIN-PORTAL.md](./ADMIN-PORTAL.md).

## Authentication

Authentication is **not** the homepage's first barrier. Visitors can explore the
product (browse jobs, browse library categories, see what resume enhancement does)
before being asked to sign in. Login is required only when the user needs:

- a paid service (resume enhancement, HR contact)
- personal resume/request history
- purchased library content
- job/referral request history
- downloadable deliverables

Supabase may be used for this primary product's auth and user data — this must be a
**separate Supabase project/schema from the Government Job Platform's existing
Supabase**, per [ARCHITECTURE.md](./ARCHITECTURE.md) §Data ownership. No auth exists in
the codebase yet; do not invent it ahead of the phase that builds it.

## Pricing

A ₹40–₹50 per-enhanced-resume price point has been mentioned as a business requirement.
This must be **configuration-driven**, never hard-coded into business logic — see
[RESUME-ENHANCEMENT.md](./RESUME-ENHANCEMENT.md) §Pricing. Payment integration itself is
a future phase (see [ROADMAP.md](./ROADMAP.md)) and is not implemented until explicitly
approved.

## What StudyCart Is NOT

- It is NOT primarily an AI Answer Key Analyzer website
- It is NOT the Interview Management application
- It is NOT a generic student portal, coaching website, or SaaS template
- It does NOT have full resume-analysis automation — admin fulfills enhanced PDFs
  manually today
- It does NOT have payment functionality yet
- It does NOT have user authentication yet
- It does NOT claim DRM-grade content protection it cannot enforce

## Product Status Definitions

| Status | Meaning |
|---|---|
| **LIVE** | Deployed, functional, usable by real users |
| **IN PROGRESS** | Actively being implemented in current sprint |
| **COMING SOON** | Defined near-term plan, will be built soon |
| **PLANNED** | Part of product vision, no immediate timeline |
| **PROPOSED** | Idea that requires validation before committing |
| **EXTERNAL** | Exists as a separate application/service |

## Target Users

- IT job seekers, freshers, and candidates preparing for IT jobs — **primary audience**
- Candidates improving their resume or preparing for interviews
- Candidates looking for IT jobs/referrals
- Indian competitive exam students (secondary, via Government Job Platform)
- College students needing printing/Xerox services (future)
