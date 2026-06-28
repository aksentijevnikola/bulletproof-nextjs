# bulletproof-nextjs Standalone Next.js Application Shell Implementation Plan

> **For agentic workers:** Use sequential subagent-driven development with specification and quality reviews. Do not stage or commit changes.

**Goal:** Build a production-ready standalone Next.js application shell at the repository root using Bun and the latest stable compatible package releases.

**Architecture:** Use the App Router with thin route files, Server Components by default, composed page widgets, workflow-focused features, and business-agnostic shared infrastructure. Enforce dependency direction mechanically and keep backend, authentication, persistence, PWA, and monorepo concerns out of scope.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Zod, TanStack Query, Biome, Vitest, Testing Library, MSW, Playwright, axe-core, Bun, and GitHub Actions.

---

## Completion contract

- One standalone Next.js app at the repository root.
- Routes: `/`, `/login`, `/dashboard`, and `/settings`.
- Technical-blueprint bulletproof-nextjs design with light, dark, and system themes.
- Strict TypeScript, Biome, architecture boundaries, environment validation, native-fetch utilities, React Query demo state, unit tests, MSW, E2E, accessibility checks, CI, docs, and AI-agent guidance.
- Latest stable compatible dependencies resolved at implementation time and pinned by `bun.lock`.
- Required final checks: frozen install, environment, architecture, dependencies, typecheck, Biome, coverage tests, build, production startup, Playwright, accessibility, audit, and outdated report.

## Hard restrictions

Do not create `apps/`, `packages/`, `turbo.json`, workspaces, PWA files, manifests, service workers, Axios, global-state libraries, GraphQL, tRPC, auth providers, databases, payments, email, cron, analytics, observability, fake persistence, fake authentication, Next.js `output: "standalone"`, or prerelease dependencies.

## Runtime and dependencies

- Pin Node 24 LTS and Bun through `.node-version`, `.nvmrc`, `.bun-version`, `engines`, and `packageManager`.
- Resolve npm `latest`, reject prereleases, inspect engines and peers, install exact direct versions with Bun, and document any necessary compatible fallback instead of silently downgrading.
- Runtime packages: Next.js, React, React DOM, TanStack Query, Zod, `server-only`, `next-themes`, Lucide, unified Radix, CVA, clsx, tailwind-merge, and shadcn animation CSS.
- Development packages: TypeScript/types, Biome, Tailwind/PostCSS, React Compiler, Query Devtools, shadcn CLI, Vitest/coverage, jsdom, Testing Library, MSW, Playwright, and axe-core.
- React Query must power the dashboard activity demo by loading and validating `/demo/activity.json`; Server Components remain the default for normal server data.

## Source structure and boundaries

Use:

```txt
src/app
src/features
src/shared
src/test
src/widgets
```

Create `src/entities` or `src/server` only when real domain/server logic exists. Enforce:

```txt
app -> widgets, features, shared
widgets -> features, shared
features -> shared
shared -> shared or external packages
```

Reject reverse imports, sibling feature imports, non-route imports from `app`, and client imports of server-only modules through `scripts/check-architecture.ts`.

## User interface

- `/`: starter overview, architecture/tooling summary, verification commands, and explicit no-backend/no-auth language.
- `/login`: email/password Zod validation, inline errors, error summary, first-invalid-field focus, no request, and an honest local-validation success message.
- `/dashboard`: responsive sidebar/header/mobile Sheet, static summary fixtures, and React Query activity feed with loading, populated, empty, error, and retry states.
- `/settings`: display name, email, timezone, and theme fields with Zod validation, local-only success state, and functional theme selection.
- Add loading, route error, global error, and not-found treatments with recovery actions.

## Design system and accessibility

- Implement the approved bulletproof-nextjs blueprint reference: true white/cool-gray canvas, subtle grid, near-black ink, slate neutrals, restrained cobalt accent, 1px rules, minimal elevation, Geist Sans/Mono, disciplined spacing, and no decorative gradients or glassmorphism.
- Use semantic OKLCH tokens, light/dark/system themes, visible focus, skip navigation, semantic landmarks, correct headings, 44px targets, reduced motion, accessible labels, live regions, and no color-only meaning.
- Initialize shadcn with Radix and aliases targeting `src/shared/ui`, `src/shared/lib`, and `src/shared/hooks`; install only used primitives.

## Shared infrastructure

- Build typed environment modules for `NEXT_PUBLIC_APP_NAME` and `NEXT_PUBLIC_APP_URL` with safe local defaults and a server-only boundary.
- Build `ApiResult<T>`, normalized `ApiError`, status constants, safe JSON parsing, request options, and native-fetch client support for JSON/non-JSON/empty responses, aborts, HTTP errors, network errors, and optional Zod output schemas.
- Add focused theme, query, and app providers. Query Devtools must be development-only and dynamically loaded.

## Testing

- Vitest + jsdom + Testing Library + user-event + jest-dom.
- Fresh QueryClient per test and shared render helpers.
- MSW tests for valid, malformed, schema-invalid, empty, 4xx, 5xx, network, abort, empty-list, and populated-list responses.
- Unit/component coverage for environment, routes, API utilities, providers, themes, forms, focus/error announcements, navigation, activity states, and architecture checks.
- Playwright production-server tests for all routes, desktop/mobile layouts, keyboard behavior, theme persistence, reduced motion, no overflow, no console/hydration errors, and axe scans in light and dark themes.

## Tooling, CI, and maintenance

- Scripts: `dev`, `build`, `start`, `typecheck`, `check`, `check:fix`, `env:check`, `architecture:check`, `dependencies:check`, `test`, `test:watch`, `test:coverage`, `e2e`, and `verify`.
- Dependency check rejects forbidden packages/artifacts, prerelease direct dependencies, mismatched React/React DOM, mismatched Vitest/coverage, mismatched Query/Devtools, and missing lockfile.
- GitHub Actions uses least privilege, concurrency cancellation, pinned full action SHAs, frozen Bun install, a verify job, and a separate Chromium E2E job with failure artifacts.
- Dependabot uses npm ecosystem weekly grouped updates and no prerelease updates or auto-merge.

## Documentation and agent setup

Create and keep consistent:

```txt
README.md
AGENTS.md
docs/architecture.md
docs/conventions.md
docs/testing.md
docs/security.md
docs/environment.md
docs/deployment.md
docs/troubleshooting.md
docs/ai/codex-setup.md
docs/ai/skills.md
docs/ai/ai-safety.md
docs/ai/token-optimization.md
.codex/config.toml
.codex/prompts/*
.codex/memory/project-memory.json
.agents/skills/*
```

Codex config must contain only safe project-scoped documentation/root settings. Memory must contain only small non-sensitive durable facts.

## Execution phases

1. Scaffold root app and install exact latest stable compatible packages.
2. Configure runtime pins, TypeScript, Biome, Tailwind, React Compiler, Next.js, scripts, architecture checks, and dependency checks.
3. Implement design tokens, shadcn primitives, providers, environment, API utilities, and testing infrastructure.
4. Implement public routes, application shell, dashboard query demo, settings, and route states.
5. Add unit, MSW, Playwright, accessibility, and architecture tests.
6. Add complete documentation, Codex/agent setup, CI, and Dependabot.
7. Run independent specification and quality reviews, fix findings, and rerun full verification.

## Final verification

Run:

```bash
bun install --frozen-lockfile
bun run env:check
bun run architecture:check
bun run dependencies:check
bun run typecheck
bun run check
bun run test:coverage
bun run build
bun run e2e
bun run verify
bun audit
bun outdated
git status --short
```

Confirm production startup, all route and accessibility behavior, no secrets, no lockfile drift, and absence of all prohibited structures and technologies before reporting completion.
