# Learning Library — Product Module

**Role:** Primary flow #2 ("LEARN") of StudyCart AI Interview Support. See
[PRODUCT.md](./PRODUCT.md) and [ARCHITECTURE.md](./ARCHITECTURE.md).

> **Revision note (Phase 1 MVP):** `/library` shipped its first real implementation —
> a browsable Library Home, Courses & Videos catalog, a course detail page, and a
> Study Materials (PDF) browser, all backed by **local/config-driven demo data**, no
> Supabase, no auth, no admin. This supersedes the earlier "Coming Soon" stub. The
> "purchase/access → login → controlled reader" flow described later in this doc is
> still **FUTURE**.
>
> **Revision note (Phase 2 — Local Contribution MVP):** Community PDF contribution is
> now real, but **explicitly temporary/local-only** — see §Contribution MVP below. No
> Supabase, no authentication, and no production admin system were added. This is a
> personal/local review tool, not a secured multi-user admin panel.

## CURRENT / LIVE (Phase 1 MVP)

Goal: let a visitor discover courses and study materials with a real, navigable,
production-quality UI — without inventing a backend, auth, or admin surface that
doesn't exist yet. No login is required anywhere in this phase.

### Data architecture

```
UI (Server/Client Components)
        ↓
LibraryRepository interface   — src/lib/library/repository.ts
        ↓
mockLibraryRepository          — src/lib/library/mock-repository.ts
        ↓
Local config data              — src/config/library-data.ts
```

- **`src/lib/library/types.ts`** — `LibraryCategory`, `LibraryContentPillar`,
  `LibraryCourse`, `LibraryLesson`, `LibraryResource`, `LibrarySearchResult`. Designed
  so a future Supabase-backed repository can implement the same fields without a UI
  rewrite.
- **`src/lib/library/repository.ts`** — the `LibraryRepository` interface (list/get
  courses, lessons, resources, categories, content pillars, and a simple
  title/tag `search()`) plus `getLibraryRepository()`, a factory that returns the
  active implementation. **Every future Supabase migration changes only this one
  factory function** — no other file should ever import `mock-repository.ts` or
  `library-data.ts` directly.
- **`src/lib/library/mock-repository.ts`** — the only implementation today. Reads
  from `src/config/library-data.ts` and returns Promises (matching the shape a real
  network-backed implementation will need), but does no I/O, no `fetch`, and does not
  touch `process.env.NEXT_PUBLIC_SUPABASE_*`.
- **`src/config/library-data.ts`** — the actual demo content: 6 topic categories, 4
  content-type pillars, 8 demo courses (with per-course lessons), and 8 demo study
  materials. **Clearly-marked demo content**, not real user- or admin-submitted data.
  No third-party course branding — thumbnails are generic icon tiles
  (`src/components/library/library-icon.tsx`), and every course/resource credits the
  generic "KasarTech.ai Team," never a fabricated named instructor.
- UI components never import `library-data.ts` directly — they call
  `getLibraryRepository()` and depend only on the `LibraryRepository` interface.

### Routes (all in this phase)

| Route | Description |
|---|---|
| `/library` | Hero + search, 4 content-type tiles, Popular Courses, Browse by Category, Recommended Resources, a "Contribute to the Library" CTA |
| `/library/courses` | Full course catalog with category filtering (`?category=<slug>`) |
| `/library/course/[slug]` | Course detail — overview, difficulty/duration/category, a video-preview placeholder (see below), full lesson list, and a resource count with a link into Study Materials |
| `/library/materials` | Study Materials (PDF) browser — search, category filter, sort, `?category=<slug>` / `?q=<term>` deep-linking. Includes both demo resources and approved community contributions. |
| `/library/contribute` | Contribution form — Phase 2, see §Contribution MVP |
| `/library/contributions` | **Local Contribution Review** — Phase 2, temporary/unsecured, see §Contribution MVP |

`/library#contribute` is an anchor to the Library Home's contribution section (which
links into `/library/contribute`), not a separate route.

### Courses & video lessons

Each course (`LibraryCourse`) has `title`, `description`, `categoryId`, `difficulty`,
`thumbnailIcon`, `instructor`, `lessonCount`/`videoCount`/`resourceCount`,
`durationLabel`, `tags`, and `featured`. Lessons (`LibraryLesson`) are stored
separately, keyed by `courseId`, and fetched via
`repository.getCourseLessons(courseId)` — **never hardcoded into a UI component**, so
adding a lesson later (from a real data source) requires no component change.

**No real video streaming exists.** The course detail page shows a polished, clearly
labeled "Preview coming soon" video placeholder
(`src/components/library/course-video-preview.tsx`) instead of a fake `<video>`
element. No progress tracking exists either — this phase does not fabricate learner
progress data.

### Study Materials (PDFs)

Each resource (`LibraryResource`) has `title`, `description`, `categoryId`, `type`
(`PDF` | `Cheat Sheet` | `Roadmap` | `Question Bank` | `Guide`), `thumbnailIcon`,
optional `pageCount`, `tags`, `author`, `featured`, and `filePath`.

**`filePath` is `null` for every demo resource** — no real PDF assets exist for the 8
curated demo materials (these are separate from, and must never be confused with, the
Resume domain's `public/resumes/template-0N/*` files — see
[RESUME-ENHANCEMENT.md](./RESUME-ENHANCEMENT.md)). `ResourceCard` checks `filePath`
and renders a disabled "Preview coming soon" state instead of a download link when it
is `null`. **No fake download URLs were created.**

Every `LibraryResource` also has a `source: "demo" | "community"` field. All 8 curated
entries in `library-data.ts` are `source: "demo"`. Approved contributions (see
§Contribution MVP) are mapped into the same `LibraryResource` shape with
`source: "community"` and a real `filePath` — they are never mislabeled as
KasarTech.ai demo content, and `ResourceCard` shows a "Community" badge for them.
`/library/materials` merges both lists; demo `filePath: null` entries still show
"Preview coming soon," while community ones (real uploaded files) show real
View/Download actions.

### Search, filter, sort

- Library Home's search bar (`LibrarySearch`) does a live title/tag match across both
  courses and resources via `repository.search()`, rendering inline `SearchResults`.
- `/library/courses` and `/library/materials` each have their own client-side category
  filter (`CategoryFilter`); Materials additionally has a text search and a
  "Recommended / Title (A–Z)" sort. There is no fabricated "Latest" sort — no real
  publish timestamps exist yet.

### Anti-fabrication rule

- No real Supabase project, connection, migration, or environment variable was added
  (Phase 1 or Phase 2).
- No production authentication or role model was added.
- No fabricated learner counts, progress percentages, ratings, or "Latest" timestamps.
- Contribution page counts are real, extracted from the uploaded PDF via `pdf-parse` —
  never guessed.

## Contribution MVP (Phase 2 — local/temporary)

**Status: LIVE, but explicitly local-development-only.** This lets a developer
personally upload a PDF, review it, approve or reject it, and see approved resources
appear in `/library/materials` — without any real backend. See the flow below and the
limitations at the end of this section before relying on it for anything beyond local
testing.

```
/library → "Contribute to the Library" → /library/contribute (form)
    → PDF upload → server-side validation → PENDING contribution
    → /library/contributions (Local Contribution Review, unsecured)
    → Approve / Reject
    → Approved → appears in /library/materials (source: "community")
```

### Local storage approach

```
Contribution UI (client components)
        ↓
"use server" actions        — src/lib/library/contribution-actions.ts
        ↓
ContributionRepository       — src/lib/library/contribution-repository.ts
        ↓
Local filesystem store       — src/lib/library/contribution-store.ts
        ↓
.data/library-contributions.json (metadata)
public/uploads/library-contributions/<id>.pdf (the real uploaded file)
```

- **UI never touches storage directly.** Client components (`ContributionForm`,
  `ContributionReviewBoard`) call the Server Actions in `contribution-actions.ts` —
  the same pattern already used by `src/features/analyzer/submitAnalysis.ts` (a plain
  `"use server"` function called directly from a client component inside
  `startTransition`, with a `File` passed as a normal argument).
- **Why this is a separate module from `LibraryRepository`:** `mockLibraryRepository`
  (repository.ts/mock-repository.ts) is imported by "use client" components (e.g.
  `library-search.tsx`) and must stay free of Node-only APIs (`node:fs`,
  `node:crypto`) so it can be bundled for the browser. Contribution storage needs real
  filesystem access, which can only run on the server. Rather than break that
  client-safe bundling, contributions get their own parallel repository
  (`createContributionRepository()` / `getContributionRepository()`), following the
  same factory-function idiom — never import `contribution-repository.ts` or
  `contribution-store.ts` from a "use client" file.
- **Metadata** (`LibraryContribution` records: title, description, category, topic,
  contributor name, file name/size/page count, status, timestamps, rejection reason)
  lives in `.data/library-contributions.json` — a local JSON file, mirroring the
  pattern `src/lib/supabase/repositories/fileStore.ts` already uses for the
  Government Job Platform's Phase-1 result storage, but kept in a **separate file** so
  the two domains never share storage.
- **The actual PDF binary** is written to `public/uploads/library-contributions/`, so
  it's servable through the exact same plain static-file mechanism already used for
  demo PDFs — no new file-serving route was built. `.data/` and `/public/uploads/` are
  both gitignored; nothing uploaded during testing gets committed.
- **Real server-side validation, not just the file extension:** required fields are
  checked, the file's reported MIME type must be `application/pdf`, size is capped at
  20MB, and the actual bytes are parsed with `pdf-parse` (`src/lib/library/pdf-validation.ts`)
  — a renamed non-PDF file fails this real-content check even if its name/MIME type
  claims otherwise. A genuine page count is extracted from the same parse and stored
  on the contribution.

### Contribution states

`PENDING → APPROVED` or `PENDING → REJECTED` (with an optional reason). Only
`APPROVED` contributions are mapped into `/library/materials` via
`listApprovedAsResources()`; `PENDING` and `REJECTED` ones are never publicly visible.

### Local Contribution Review (`/library/contributions`)

**This is NOT a secured admin panel.** It has no authentication, no authorization, and
is reachable by anyone who knows the URL — the page itself displays a warning banner
saying so, is excluded from search indexing (`robots: noindex`), and is not linked
from any navigation. Tabs for Pending/Approved/Rejected; each row shows title,
contributor, category, file name/page count, submitted date, and status. Actions:
Preview (reuses the same native-browser-PDF-viewer-via-iframe pattern as
`resume-pdf-viewer-modal.tsx`, in a new library-scoped `PdfPreviewModal` — no new PDF
rendering dependency was added), Approve, Reject (optional reason), and "Remove" on an
approved row (re-rejects it — there is no separate "archived" status).

> **Temporary local review interface. Authentication, authorization, persistent
> storage and secure admin controls will be implemented in the future Supabase/Admin
> phase.**

### Known limitations (Phase 2)

- Writing into `public/` at runtime only works on a writable local filesystem — it
  does **not** work on a read-only production deployment (e.g. Vercel), since `public/`
  is part of the immutable deployment bundle there. This is explicitly a
  local-development MVP, not a production upload pipeline.
  - **Incident (fixed):** the first version of this phase let that write throw
    uncaught, which crashed the Server Action and surfaced Next.js's generic "This
    page couldn't load — A server error occurred" page on the deployed site (the same
    class of bug `fileStore.ts` hit before it — see commit `e4d7e3d` "Fix Vercel
    writable storage"). Fixed by `isUploadsWritableEnvironment()`
    (`src/lib/library/contribution-store.ts`, checks the same `VERCEL` env var):
    `submitContribution()` now returns a normal `{ ok: false, error }` result before
    attempting any filesystem write when running in a non-writable environment, shown
    to the user as an ordinary in-form message ("Contribution uploads are only
    available in local development for this MVP phase..."), and `/library/contribute`
    shows the same notice proactively. All three mutating repository methods
    (submit/approve/reject) also now catch any other unexpected filesystem error
    rather than letting it escape uncaught.
  - `next.config.ts`'s `experimental.serverActions.bodySizeLimit` was raised from
    `10mb` to `20mb` to match the 20MB limit this feature already advertises and
    enforces (it was silently rejecting any 10–20MB upload before reaching this code).
- No authentication means contribution identity (`contributorName`) is a free-text,
  unverified field, and `/library/contributions` has no access control whatsoever.
- The Library Home search (`repository.search()`) covers demo courses/resources only —
  it does not currently include community contributions.
- No file is ever deleted from disk on rejection/removal — only its metadata status
  changes. Manual cleanup of `public/uploads/library-contributions/` may be needed
  during local testing.
- Uploads remain **disabled entirely on the deployed site** until the Supabase Storage
  migration below happens — the fix here makes that failure graceful, it does not make
  uploads work in production.

## FUTURE (architected, not built)

### Future Supabase migration plan

When the platform needs dynamic content, authentication, admin management at scale,
progress tracking, and durable file storage, a **new, separate Supabase project** (see
[ARCHITECTURE.md](./ARCHITECTURE.md) §Data ownership — never the Government Job
Platform's existing Supabase) will replace two things independently, each behind its
existing swap point:

- `mockLibraryRepository` → a `SupabaseLibraryRepository` implementing the same
  `LibraryRepository` interface, swapped in `getLibraryRepository()`.
- `createContributionRepository()`'s local filesystem store →  a Supabase-backed
  implementation (a `contributions` table + Supabase Storage for the PDF binaries +
  RLS policies), swapped in `getContributionRepository()`. `/library/contributions`
  would then also gain real authentication/authorization instead of being an
  unsecured local tool.

No UI component should need to change for either swap — see §Contribution MVP above
for why the two repositories are separate today.

### Content data model (proposed — not yet a database)

`library_content`:
- id, title, description, category, thumbnail_ref, author_or_source, price, status
  (`draft` | `published` | `unpublished`), access_rule (`free` | `paid` | `login_required`),
  content_type, published_at, updated_at

`library_access`:
- id, user_id, content_id, granted_at, source (`purchase` | `free` | `admin_grant`)

Course/lesson/contribution tables (`courses`, `course_sections`, `course_lessons`,
`community_contributions`, etc.) are not yet named or designed — see
[ARCHITECTURE.md](./ARCHITECTURE.md) and [ADMIN-PORTAL.md](./ADMIN-PORTAL.md) for the
broader, still-undecided data/admin architecture before implementing any of this.

### User flow (once purchase/protected content exists)

```
Browse (by category) → select content → purchase/access → login → read/view
```

- Protected content must **not** be freely downloadable.
- The platform will provide **controlled viewing/access** (e.g. an in-app reader), not
  a direct file download link, for paid/protected content.
- Do not claim DRM protection the platform cannot actually enforce.

### Admin capabilities (architected, not built)

A real, secured admin surface will be able to: upload/edit content, publish/unpublish,
categorize, set price, manage access rules, and review contributions with proper
authentication/authorization — replacing the temporary, unsecured
`/library/contributions` local tool from Phase 2. Admin functionality must never be
exposed to normal users — gate behind role checks once auth/roles exist. See
[ADMIN-PORTAL.md](./ADMIN-PORTAL.md).

### Authentication requirement

Browsing categories, courses, and titles does not require login today, and this
continues once purchase/protected content exists — login will only be required to
purchase, access, or read protected content. Phase 2's contribution submission also
does not require login (contributor name is optional free text) — a real,
authenticated contributor identity is part of the future Supabase/Admin phase. See
[PRODUCT.md](./PRODUCT.md) §Authentication.

## Status

**Phase 1 MVP: LIVE** (local/config data, no backend). **Phase 2 Contribution MVP:
LIVE, but explicitly local/temporary** — no Supabase, no authentication, no production
admin system (see §Contribution MVP and §Known limitations). **Real backend
(Supabase), authentication, and a secured multi-user admin system: NOT implemented —
FUTURE.**
