# StudyCart — Application Map

Sitemap grouped by product domain. See [ARCHITECTURE.md](./ARCHITECTURE.md) for the
domain model and [ROUTES.md](./ROUTES.md) for per-route detail.

```
StudyCart AI Interview Support (studycart.ai)
│
├── / .................................. Homepage — Resume/Learn/Get-Hired story (Phase 2 redesign)
│
├── RESUME  (Career/Resume — "RESUME" flow)
│   └── /resume .......................... Hero + Resume Examples + Analyzer UI + Guide + Support (LIVE)
│       └── /resume/requests/[id] ........ User's request status/deliverable (PLANNED, future paid flow)
│
├── LEARN  (Learning Library — "LEARN" flow)
│   ├── /library .......................... Category browse (COMING SOON stub, Phase 1)
│   ├── /library/[category] .............. Category listing (PLANNED)
│   └── /library/[itemId] ................ Content detail / controlled reader (PLANNED)
│
├── GET HIRED  (IT Jobs — "GET HIRED" flow)
│   ├── /jobs .............................. Job listings (existing stub — reclassified from
│   │                                        "Government & Private Job Listings" to IT Jobs)
│   ├── /jobs/[jobId] ..................... Job detail + external Apply link (PLANNED)
│   └── /jobs/[jobId]/referral ............ Referral request (PLANNED, auth required)
│
├── INTERVIEW SUPPORT
│   └── External: Interview Management — opens via NEXT_PUBLIC_INTERVIEW_MANAGEMENT_URL
│
├── GOVERNMENT JOB PLATFORM  (SECONDARY)
│   ├── /government-jobs .................. Hub/landing (PLANNED — new route)
│   ├── /analyzer .......................... AI Result / Answer Key Analyzer — LIVE
│   ├── /result/[resultId] ................ Result view — LIVE
│   ├── /analysis/[resultId] .............. Analysis view — LIVE
│   ├── /books ............................. Books & Study Materials — stub (COMING SOON)
│   ├── /government-jobs/mock-tests ....... Mock Tests (PLANNED)
│   ├── /government-jobs/notes ............ Notes (PLANNED)
│   └── /government-jobs/study-material ... Study Material (PLANNED)
│
├── FUTURE: STUDENT SERVICES
│   └── /services .......................... Printing/Xerox/etc. (PROPOSED, not scheduled)
│
├── ADMIN (internal, role-gated — see ADMIN-PORTAL.md)
│   └── /admin/* ........................... Resume/Library/Jobs/Users management (PROPOSED)
│
├── UNCLASSIFIED (existing, needs a decision)
│   └── /tuition ........................... "Tuition & Coaching Listings" stub
│
└── SHARED / PLATFORM-LEVEL
    ├── /about
    ├── /privacy
    └── /terms
```

## Notes

- `/`, `/analyzer`, `/result/[resultId]`, `/analysis/[resultId]`, `/about`, `/privacy`,
  `/terms`, `/books`, `/jobs`, `/tuition`, and `/library` (stub) exist in the codebase.
  `/resume` is now a real, live page (Resume Examples + PDF viewer + analyzer UI
  foundation) — see [RESUME-ENHANCEMENT.md](./RESUME-ENHANCEMENT.md). Everything else
  above is **PLANNED/PROPOSED**, not built.
- `/jobs` keeps its URL but its product meaning changes from "Government & Private Job
  Listings" to the primary product's IT Jobs domain — this is a reclassification of an
  existing stub, not a new route. Update its copy when Phase work reaches it, not before.
- ATS/Naukri/LinkedIn/GitHub/Portfolio/standalone-Interview-Prep routes previously
  planned under `/career/*` are **removed from this map** — see
  [CAREER-PLATFORM.md](./CAREER-PLATFORM.md) §Superseded scope.
- Route slugs here are illustrative for planning, not a final URL spec.
