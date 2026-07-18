# bulletproof-nextjs

bulletproof-nextjs is a production-oriented Next.js App Router application shell. It demonstrates strict module boundaries, Server Components, accessible UI patterns, native-fetch utilities, Zod validation, TanStack Query, automated tests, and CI without pretending that a backend exists.

## Requirements

- Node.js 24.13.0
- Bun 1.3.14

Use the pinned versions and Bun commands. The repository requires `bun.lock` and exact dependency versions.

## Setup

```bash
bun install --frozen-lockfile
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

Local defaults allow the application to start without an environment file. Production deployments should define:

```env
NEXT_PUBLIC_APP_NAME=bulletproof-nextjs
NEXT_PUBLIC_APP_URL=https://example.com
```

Both variables are public. Never store secrets in a `NEXT_PUBLIC_` variable. When adding an environment key, update `.env.example`, the Zod environment schema, CI configuration when needed, and this document.

## Reference routes

- `/` presents the starter overview.
- `/login` demonstrates accessible local form validation. It does not authenticate or create a session.
- `/dashboard` demonstrates the responsive application shell and TanStack Query with a static fixture.
- `/settings` demonstrates local settings validation and theme controls. It does not persist data.

## Architecture

The project is one standalone application. It is not a workspace, monorepo, backend, or PWA.

```text
src/app       routes, layouts, metadata, and route states
src/widgets   page and application-shell composition
src/features  user workflows
src/shared    reusable infrastructure and UI primitives
src/test      test setup, MSW handlers, and render helpers
```

Dependencies flow downward:

```text
app       -> widgets, features, shared
widgets   -> features, shared
features  -> shared
shared    -> shared or external packages
```

Route files stay thin. Server Components are the default, and Client Components are limited to interactive leaves. `scripts/check-architecture.ts` rejects reverse dependencies, sibling feature or widget imports, non-route imports from `app`, and client imports of server-only modules.

Create `src/entities` only when real domain nouns have reusable behavior. Create `src/server` only when frontend-owned server execution has a concrete responsibility.

## Data and state

- Server Components own ordinary server data.
- The URL owns shareable filters and navigation state.
- TanStack Query owns interactive client-side server state.
- Local state owns local UI behavior.
- Context is reserved for low-frequency cross-cutting UI concerns such as theme.

The shared API boundary uses native `fetch`, returns a discriminated `ApiResult<T>`, validates external responses with Zod, applies cancellation and timeouts, and converts failures into UI-safe errors. Raw external payloads remain `unknown` until validated.

## UI and accessibility

Reusable primitives live in `src/shared/ui`. Product workflows live in `src/features`, page composition lives in `src/widgets`, and route adapters live in `src/app`.

The interface uses semantic Tailwind tokens backed by CSS variables. Layouts are mobile-first. Interactive controls require accessible names, keyboard operation, visible focus, and adequate contrast. Forms provide visible labels, inline errors, linked error summaries, `aria-invalid`, descriptive relationships, and focus on the first invalid field. Motion must respect reduced-motion preferences.

## Testing and verification

```bash
bun run test
bun run test:coverage
bun run verify
bun run e2e
```

Vitest uses jsdom, React Testing Library, user-event, jest-dom, MSW, and a fresh QueryClient per render. Tests focus on behavior and mock external boundaries rather than internal components.

`bun run verify` checks environment validation, architecture, dependency policy, TypeScript, Biome, unit tests, and the production build. Playwright runs separately against the production application and checks desktop and mobile layouts, keyboard behavior, focus, themes, reduced motion, console errors, hydration warnings, overflow, and axe violations.

CI uses frozen installs, least-privilege permissions, pinned action revisions, concurrency cancellation, separate verification and browser-test jobs, and failure artifacts for Playwright.

## Security and deployment

Treat environment values, form input, URLs, storage, and network payloads as untrusted. Validate boundaries with Zod, keep catch values as `unknown`, and show normalized errors instead of raw responses or stack traces. Never commit credentials, tokens, private URLs, personal data, `.env` files, or real customer fixtures.

Deploy only after `bun run verify` and `bun run e2e` pass. Configure the two public environment variables for the deployment origin. Keep GitHub Actions permissions read-only unless a documented job requires more access.

## Troubleshooting

- If Bun is unavailable, install the version in `.bun-version` and confirm it with `bun --version`.
- If a frozen install fails, reconcile `package.json` and `bun.lock`; do not bypass the lockfile.
- If an architecture check fails, move the dependency to the lowest valid layer instead of bypassing the rule.
- If E2E reports port 3000 in use, stop the existing process or intentionally set `PLAYWRIGHT_EXTERNAL_SERVER=1` for an externally managed server.
- If a framework API is uncertain, read the installed documentation under `node_modules/next/dist/docs/` or current official documentation.

## Explicit non-goals

The starter does not include a backend, authentication provider, database, persistence, PWA, service worker, monorepo, payments, email, cron, analytics, or observability vendor. Add infrastructure only when a concrete product requirement justifies it.

## AI agents

`AGENTS.md` is the universal agent entry point, and `CLAUDE.md` imports it for Claude Code. `.ai/README.md` routes agents to seven numbered topic files covering architecture, React and TypeScript, APIs, state and forms, design, accessibility and localization, and tooling.
