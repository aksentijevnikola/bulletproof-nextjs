# bulletproof-nextjs

bulletproof-nextjs is a standalone, production-oriented Next.js application shell. It demonstrates strict App Router architecture, accessible interface patterns, native-fetch utilities, Zod validation, TanStack Query, testing, CI, and AI-agent guidance without pretending a backend exists.

## Requirements

- Node.js 24 LTS
- Bun 1.3+

## Commands

```bash
bun install
bun run dev
bun run verify
bun run e2e
```

Open [http://localhost:3000](http://localhost:3000).

## Reference routes

- `/` — starter overview and project guidance
- `/login` — local Zod form validation; authentication is not configured
- `/dashboard` — responsive app shell and a React Query static-fixture example
- `/settings` — local settings validation and theme controls; persistence is not configured

## Architecture

```txt
src/app       routing, layouts, metadata, route states
src/widgets   page and application-shell composition
src/features  user workflows
src/shared    reusable infrastructure and UI primitives
src/test      test setup, MSW, and render helpers
```

See [architecture](docs/architecture.md), [conventions](docs/conventions.md), and [testing](docs/testing.md).

## Environment

Safe defaults make local startup immediate. Production deployments should set:

```env
NEXT_PUBLIC_APP_NAME=bulletproof-nextjs
NEXT_PUBLIC_APP_URL=https://example.com
```

## Explicit non-goals

bulletproof-nextjs does not include a backend, authentication provider, database, persistence, PWA, service worker, monorepo, payments, email, analytics, or observability vendor.

## Verification

`bun run verify` checks environment configuration, architecture boundaries, dependencies, TypeScript, Biome, unit tests, and the production build. Playwright remains a separate required browser check through `bun run e2e`.
