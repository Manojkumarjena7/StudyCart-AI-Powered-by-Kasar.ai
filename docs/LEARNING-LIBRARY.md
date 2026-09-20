# Learning Library — Product Module

**Role:** Primary flow #2 ("LEARN") of StudyCart AI Interview Support. See
[PRODUCT.md](./PRODUCT.md) and [ARCHITECTURE.md](./ARCHITECTURE.md).

> **Revision note (Phase 1 MVP):** `/library` shipped its first real implementation —
> a browsable Library Home, Courses & Videos catalog, a course detail page, and a
> Study Materials (PDF) browser, all backed by **local/config-driven demo data**, no
> Supabase, no auth, no admin. This supersedes the earlier "Coming Soon" stub. The
> "purchase/access → login → controlled reader" flow and the admin/contribution
> workflow described later in this doc are still **FUTURE** — do not confuse the two.

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
| `/library/materials` | Study Materials (PDF) browser — search, category filter, sort, `?category=<slug>` / `?q=<term>` deep-linking |

`/library#contribute` is an anchor to the Library Home's contribution section, not a
separate route.

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

**`filePath` is `null` for every demo resource today** — no real PDF assets exist in
the repository for the Library yet (these are separate from, and must never be
confused with, the Resume domain's `public/resumes/template-0N/*` files — see
[RESUME-ENHANCEMENT.md](./RESUME-ENHANCEMENT.md)). `ResourceCard` checks `filePath`
and renders a disabled "Preview coming soon" state instead of a download link when it
is `null`. **No fake download URLs were created.** When real files are added later,
setting `filePath` is the only change needed — no component logic changes.

### Search, filter, sort

- Library Home's search bar (`LibrarySearch`) does a live title/tag match across both
  courses and resources via `repository.search()`, rendering inline `SearchResults`.
- `/library/courses` and `/library/materials` each have their own client-side category
  filter (`CategoryFilter`); Materials additionally has a text search and a
  "Recommended / Title (A–Z)" sort. There is no fabricated "Latest" sort — no real
  publish timestamps exist yet.

### Anti-fabrication rule (Phase 1)

- No real Supabase project, connection, migration, or environment variable was added.
- No admin UI, authentication, or role model was added.
- No community contribution upload/backend was built — "Contribute to the Library"
  shows a clearly labeled "Community contributions are coming soon" message (UI only).
- No fabricated learner counts, progress percentages, ratings, or "Latest" timestamps.

## FUTURE (architected, not built in Phase 1)

### Real backend migration

When the platform needs dynamic content, authentication, admin management, student
contributions, progress tracking, and file storage, a **new, separate Supabase
project** (see [ARCHITECTURE.md](./ARCHITECTURE.md) §Data ownership — never the
Government Job Platform's existing Supabase) will back a `SupabaseLibraryRepository`
implementing the same `LibraryRepository` interface. `getLibraryRepository()` is the
single call site that changes; no UI component should need to change.

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

Admin will be able to: upload/edit content, publish/unpublish, categorize, set price,
manage access rules, and review student contributions (approve/reject). Admin
functionality must never be exposed to normal users — gate behind role checks once
auth/roles exist. See [ADMIN-PORTAL.md](./ADMIN-PORTAL.md).

### Student contribution workflow (architected, not built)

```
Student submits → Pending Review → Admin Review → Approve / Reject → appears in Library
```

Requires auth (contributor identity), server-side file validation, and the admin
review surface above — none of which exist yet.

### Authentication requirement

Browsing categories, courses, and titles does not require login today, and this
continues once purchase/protected content exists — login will only be required to
purchase, access, or read protected content, or to submit a contribution. See
[PRODUCT.md](./PRODUCT.md) §Authentication.

## Status

**Phase 1 MVP: LIVE** (local/config data, no backend). **Real backend (Supabase),
authentication, admin management, student contributions, and progress tracking: NOT
implemented — FUTURE.**
