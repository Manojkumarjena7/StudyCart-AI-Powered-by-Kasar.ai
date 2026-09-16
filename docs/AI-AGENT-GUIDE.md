# AI Agent Implementation Guide — StudyCart

> **Read this before writing any code.** This is the contract.

## 0. Product Domain Model (read first)

```
PRIMARY:   StudyCart AI Interview Support
             ├── Career / Resume   (RESUME flow — see RESUME-ENHANCEMENT.md)
             ├── Learning Library  (LEARN flow — see LEARNING-LIBRARY.md)
             ├── IT Jobs           (GET HIRED flow — see IT-JOBS-REFERRAL.md)
             └── Interview Support (external link only — see INTERVIEW-MANAGEMENT.md)
SECONDARY: Government Job Platform   — separate module (formerly "Study")
FUTURE:    Student Services          — not yet scheduled
```

Do not treat these as equal homepage pillars. The primary product (Resume/Learn/Get
Hired) is the hero; Government Jobs gets one low-priority secondary section. ATS,
Naukri, LinkedIn, GitHub, Portfolio help, and standalone Interview Prep/Questions/Mock
pages are **superseded** — see `docs/CAREER-PLATFORM.md` §Superseded scope before
building any of them.

## 1. Read Documentation First

Before modifying any file, read these docs in order:

1. `docs/PRODUCT.md` — What StudyCart is, what it is not, domain model
2. `docs/ARCHITECTURE.md` — File structure, data flow, domain boundaries, data model
3. `docs/ROADMAP.md` — Phased plan + the Claude Code Implementation Contract
4. `docs/APPLICATION-MAP.md` / `docs/ROUTES.md` — Every route and its domain/status
5. `docs/CAREER-PLATFORM.md`, `docs/RESUME-ENHANCEMENT.md`,
   `docs/LEARNING-LIBRARY.md`, `docs/IT-JOBS-REFERRAL.md`, `docs/ADMIN-PORTAL.md`,
   `docs/GOVERNMENT-JOB-PLATFORM.md` — Per-domain IA
6. `docs/INTERVIEW-MANAGEMENT.md` — External integration contract

7. `docs/DESIGN-SYSTEM.md` — Color tokens, theme system, typography, shared UI
   foundations (created in Phase 1)

## 2. Inspect Before Creating

Before creating a new component, search the existing codebase:
- `src/components/shared/ui/` — Reusable primitives (Button, Card, Badge, Input, Select, Checkbox, Progress)
- `src/components/shared/` — Shared patterns (ComingSoon, PageNav, ThemeProvider)
- `src/config/` — Centralized configuration (brand, navigation, platform, site)
- `src/lib/utils/` — Utility functions

Never duplicate what already exists.

## 3. Do NOT Rewrite Working Business Logic

The following directories contain **working, tested business logic**. Do not modify them unless explicitly instructed:

```
src/features/analyzer/     ← Server action pipeline
src/features/parser/       ← Response sheet parsing (adapters, security, engine)
src/features/scoring/      ← Score calculation (with unit tests)
src/features/ranking/      ← Community ranking (with unit tests)
src/features/reports/      ← PDF report generation
src/lib/supabase/          ← Supabase client + repositories
src/types/domain.ts        ← Shared domain types
```

## 4. Do NOT Invent

- **APIs** — Do not create API routes that don't exist in the codebase
- **Environment variables** — Only use variables documented in `.env.example` (does not exist yet) or `docs/INTERVIEW-MANAGEMENT.md`
- **External URLs** — Use `NEXT_PUBLIC_INTERVIEW_MANAGEMENT_URL` env var; do not hardcode URLs
- **Payment systems** — No payment integrations until explicitly designed
- **Pricing** — Do not invent prices or subscription tiers
- **Service availability** — Do not claim services are available in specific cities unless verified
- **Data privacy claims** — Do not claim "data is never stored" unless verified in code
- **Automation** — Do not imply resume enhancement is fully AI-automated; it is
  reference-library-based analysis + manual admin fulfillment today (see
  `docs/RESUME-ENHANCEMENT.md`). Do not claim DRM-grade protection for library content
  the platform cannot actually enforce (see `docs/LEARNING-LIBRARY.md`)

## 5. External Application Boundaries

**Interview Management** is a **separate application** with its own:
- Supabase instance
- Authentication
- APIs
- Deployment
- Business logic

StudyCart integrates by linking to it. Never:
- Import its code
- Access its database
- Copy its backend logic
- Create fake API integrations

## 6. Configuration-Driven Development

`src/config/platform.ts` is the single source of truth for domain pillar metadata
(Resume, Learning Library, IT Jobs, Interview Support, Government Jobs) — see
`docs/ARCHITECTURE.md` §Service catalog model. `src/config/navigation.ts` only holds
non-pillar nav (legal, community links).
1. Add/edit pillars or (in later phases) their `services` entries in `platform.ts`
2. Navbar and footer already consume this config — new pages should too
3. Do not scatter service definitions across multiple files

## 7. Theme System

The app supports light and dark modes via a `data-theme="light"` attribute on `<html>`
(absence of the attribute = dark, the default). See `docs/DESIGN-SYSTEM.md` for the
full token table.
- Use the semantic Tailwind classes backed by CSS custom properties
  (`bg-bg-primary`, `text-text-secondary`, `bg-overlay-soft`, etc.) for all colors
- Never hardcode color values, and never use literal `bg-white/5`-style overlay
  classes — they don't adapt between themes (use `bg-overlay-soft` / `bg-overlay-strong`)
- Test both themes after any visual change, using the navbar's theme toggle

## 8. After Implementation

```bash
npm run build    # Must pass with zero errors
npm run test     # All existing tests must pass
```

## 9. Document Assumptions

If you discover something unclear or conflicting:
- **Stop** and document the conflict
- Do not silently change architecture
- Create a note in `docs/TECHNICAL-DEBT.md` if you find issues to address later

## 10. Update Documentation

When architecture changes:
- Update `docs/ROUTES.md` / `docs/APPLICATION-MAP.md` if routes change
- Update `docs/ARCHITECTURE.md` if file structure or domain boundaries change
- Update `docs/COMPONENTS.md` if new components are created (create it if it doesn't exist)
- Update `docs/CHANGELOG.md` with what changed and why (create it if it doesn't exist)

## 11. Implementing a Roadmap Phase

If asked to implement a specific phase, follow `docs/ROADMAP.md` §Claude Code
Implementation Contract exactly — implement only that phase, don't reinterpret the
domain model, and stop to document any conflict instead of silently resolving it.
