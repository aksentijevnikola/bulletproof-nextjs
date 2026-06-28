# Architecture

bulletproof-nextjs is one standalone Next.js App Router application at the repository root. It is intentionally not a workspace, monorepo, PWA, or backend.

## Rendering model

- Start with Server Components.
- Add `"use client"` only for state, events, browser APIs, Context, forms, themes, or TanStack Query.
- Keep route files as composition adapters.
- Server Components call server functions directly when real server logic exists; they do not call internal Route Handlers without a documented interoperability reason.

## Layers

```txt
app       -> widgets, features, shared
widgets   -> features, shared
features  -> shared
shared    -> shared or external libraries
```

`src/entities` is reserved for real domain nouns. `src/server` is reserved for frontend-owned server execution. Neither exists until it has real responsibilities.

The architecture checker rejects reverse dependencies, sibling feature coupling, non-route imports from `app`, and client imports of server-only modules.

## Data

- Server Components are the default for server data.
- URL state is preferred for shareable filters and navigation.
- TanStack Query is for interactive client-side server state.
- Local state is for local UI.
- Context is limited to low-frequency cross-cutting UI concerns.

The dashboard demonstrates TanStack Query against `/demo/activity.json`, a static fixture. This exercises loading, error, empty, validation, and cache behavior without inventing a backend.

## API boundary

`src/shared/api` uses native `fetch`, returns a discriminated `ApiResult<T>`, normalizes errors, parses responses safely, and optionally validates output with Zod. Raw external error payloads never reach UI directly.

## UI placement

- `shared/ui`: business-agnostic shadcn-compatible primitives
- `features`: user workflows such as login and settings validation
- `widgets`: application shell and page-level sections
- `app`: routing and route states only
