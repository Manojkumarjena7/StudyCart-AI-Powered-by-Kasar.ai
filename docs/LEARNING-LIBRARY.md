# Learning Library — Product Module

**Role:** Primary flow #2 ("LEARN") of StudyCart AI Interview Support. See
[PRODUCT.md](./PRODUCT.md) and [ARCHITECTURE.md](./ARCHITECTURE.md).

## Concept

A premium content library, closer to "Udemy-style content discovery + a simple
document/PDF reading experience" than a generic file-download page.

## Categories (initial set)

- Automation
- Manual Testing
- AI
- Programming
- Interview Preparation
- QA
- Career
- Other technical topics (extensible — categories are data, not a hard-coded enum in
  UI components)

## Content types

PDF, documents, guides, learning material, interview resources, curated technical
content. Content type is a field on each item, not a separate code path per type unless
rendering genuinely differs.

## User flow

```
Browse (by category) → select content → purchase/access → login → read/view
```

- Protected content must **not** be freely downloadable.
- The platform provides **controlled viewing/access** (e.g. an in-app reader), not a
  direct file download link, for paid/protected content.
- Do not claim DRM protection the platform cannot actually enforce — "controlled
  viewing" means the UI doesn't hand out a raw downloadable file by default, not that
  content is cryptographically protected against determined extraction.

## Content data model (proposed)

`library_content`:
- id, title, description, category, thumbnail_ref, author_or_source, price, status
  (`draft` | `published` | `unpublished`), access_rule (`free` | `paid` | `login_required`),
  content_type, published_at, updated_at

`library_access`:
- id, user_id, content_id, granted_at, source (`purchase` | `free` | `admin_grant`)

Lives in the primary product's own Supabase (see [ARCHITECTURE.md](./ARCHITECTURE.md)
§Data ownership).

## Admin capabilities (architected, not all built now)

Admin can:
- upload content
- edit content
- publish/unpublish
- categorize
- set price
- manage access rules

Admin functionality must never be exposed to normal users — gate behind role checks once
auth/roles exist. See [ADMIN-PORTAL.md](./ADMIN-PORTAL.md).

## Authentication requirement

Browsing categories and titles does not require login. Login is required to purchase,
access, or read protected content — see [PRODUCT.md](./PRODUCT.md) §Authentication.

## Status

**PLANNED.** No code exists for this module yet.
