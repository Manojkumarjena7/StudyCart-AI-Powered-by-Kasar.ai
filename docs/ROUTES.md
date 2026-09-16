# StudyCart — Route Reference

Status legend: **LIVE**, IN PROGRESS, COMING SOON, PLANNED, PROPOSED, EXTERNAL.

## Existing routes (in codebase today)

| Route | Domain | Status | Notes |
|---|---|---|---|
| `/` | Shared | IN PROGRESS | Homepage; Phase 2 redesign to Resume/Learn/Get-Hired story |
| `/analyzer` | Government Jobs | **LIVE** | Do not modify business logic |
| `/result/[resultId]` | Government Jobs | **LIVE** | Do not modify business logic |
| `/analysis/[resultId]` | Government Jobs | **LIVE** | Do not modify business logic |
| `/books` | Government Jobs | COMING SOON | Stub via `ComingSoon` component |
| `/jobs` | **Reclassified → IT Jobs (primary)** | COMING SOON | Existing "Government & Private Job Listings" stub; content copy still reflects the old domain — will change when Phase 5 reaches it — see [IT-JOBS-REFERRAL.md](./IT-JOBS-REFERRAL.md) |
| `/resume` | Resume (primary) | **LIVE** (Resume Examples + PDF viewer + analyzer UI foundation) | Real resume/ATS analysis is not implemented — see [RESUME-ENHANCEMENT.md](./RESUME-ENHANCEMENT.md) |
| `/library` | Learning Library (primary) | COMING SOON | Phase 1 stub (`ComingSoon`) — real browse/reader flow is Phase 4 |
| `/tuition` | Unclassified | COMING SOON | "Tuition & Coaching Listings" — candidate future vertical, undecided |
| `/about` | Shared | LIVE | |
| `/privacy` | Shared | LIVE | |
| `/terms` | Shared | LIVE | |

## Resume (Career/Resume, "RESUME" flow)

| Route | Status | Description |
|---|---|---|
| `/resume` | **LIVE** | Hero, Resume Examples (3 real downloadable PDFs + in-page viewer modal), Resume Analyzer UI (upload works; real analysis COMING SOON), How to Improve guide, Support StudyCart |
| `/resume/requests/[id]` | PLANNED | User's request status and deliverable download (auth required) — part of the FUTURE paid enhancement flow |

No `/resume/analyze`, `/resume/[resumeId]`, or `/resume/examples/[id]` routes were
created — the resume viewer is a modal, not a route, per the "simplest architecture that
scales" principle. Add dedicated routes later only if a real need (e.g. deep-linking to
one example) justifies it. See [RESUME-ENHANCEMENT.md](./RESUME-ENHANCEMENT.md).

## Planned routes — Learning Library ("LEARN" flow)

| Route | Status | Description |
|---|---|---|
| `/library` | COMING SOON (stub) | Category browse |
| `/library/[category]` | PLANNED | Category listing (Automation, Manual, AI, Programming, Interview, QA, Career, ...) |
| `/library/[itemId]` | PLANNED | Content detail + controlled reader (paid/protected content gated) |

See [LEARNING-LIBRARY.md](./LEARNING-LIBRARY.md).

## Planned routes — IT Jobs ("GET HIRED" flow)

| Route | Status | Description |
|---|---|---|
| `/jobs` | COMING SOON (reclassified) | Job listings |
| `/jobs/[jobId]` | PLANNED | Job detail + external Apply link |
| `/jobs/[jobId]/referral` | PLANNED | Referral request form (auth required) |

See [IT-JOBS-REFERRAL.md](./IT-JOBS-REFERRAL.md).

## Interview Support (external)

| Target | Status | Description |
|---|---|---|
| `NEXT_PUBLIC_INTERVIEW_MANAGEMENT_URL` | EXTERNAL | Opens the separate Interview Management application in a new tab. Never proxied or embedded. |

## Planned routes — Government Job Platform (secondary, unchanged priority)

| Route | Status | Description |
|---|---|---|
| `/government-jobs` | PLANNED | Hub/landing for the separated module |
| `/government-jobs/mock-tests` | PLANNED | Mock Tests |
| `/government-jobs/notes` | PLANNED | Notes |
| `/government-jobs/study-material` | PLANNED | Study Material |

The existing `/analyzer`, `/result/[resultId]`, `/analysis/[resultId]`, and `/books`
routes remain at their current URLs — not moved under `/government-jobs/*` without
explicit approval and a documented redirect plan.

## Proposed routes — Admin (role-gated, not scheduled)

| Route | Status | Description |
|---|---|---|
| `/admin` | PROPOSED | Admin dashboard entry |
| `/admin/resume` | PROPOSED | Resume references + requests management |
| `/admin/library` | PROPOSED | Library content management |
| `/admin/jobs` | PROPOSED | Jobs management |
| `/admin/users` | PROPOSED | Users/purchases/requests/access |

See [ADMIN-PORTAL.md](./ADMIN-PORTAL.md).

## Proposed routes — Student Services (not scheduled)

| Route | Status | Description |
|---|---|---|
| `/services` | PROPOSED | Printing/Xerox/etc. landing (future secondary vertical) |

## Removed from the route plan (superseded)

The previous repositioning's `/career/*` and `/interview/*` routes (resume, ats, naukri,
linkedin, github, portfolio, referral, support, preparation, questions, mock,
management) are **no longer part of the plan** in that form. Their replacements:

- Resume/ATS-adjacent content → folded into `/resume` (see
  [RESUME-ENHANCEMENT.md](./RESUME-ENHANCEMENT.md))
- Referral → moved to `/jobs/[jobId]/referral` (job-scoped, not standalone)
- Interview prep/questions/mock → superseded by the external Interview Management link,
  not standalone StudyCart pages (see [CAREER-PLATFORM.md](./CAREER-PLATFORM.md)
  §Superseded scope)
- Naukri/LinkedIn/GitHub/Portfolio help → out of current scope entirely
