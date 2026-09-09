# Core Architecture

## Application Shape

- `CONFIRMED`: the repository root contains one standalone Next.js application.
- `CONFIRMED`: routing uses the root `app/` directory; no Pages Router exists.
- `CONFIRMED`: this is not a workspace, monorepo, backend, or package collection.
- `CONFIRMED`: source ownership follows Feature-Sliced Design v2.1 with framework-required layer names `_app` and `_pages`.

## Directory Ownership

- Root `app/` owns Next.js route adapters, framework layouts, metadata, route groups, route states, and other framework-required entry files. Keep route files thin.
- `src/_app` is the FSD App layer. Its `layouts`, `providers`, `styles`, and `lib` segments own route-wide composition and application initialization. It contains segments, not slices.
- `src/_pages/<page>` owns one page slice and its page-specific UI, model, request/query definitions, and tests. Each page slice exposes its route-consumed surface through `index.ts`.
- `src/shared/ui` owns business-agnostic UI primitives.
- Other `src/shared` segments own reusable API, environment, hook, route, style, and utility infrastructure. Each cross-boundary Shared consumer uses the segment `index.ts` public API.
- `src/test` owns shared test rendering, setup, and network mocks.
- `public` owns static assets and the demo activity fixture.
- `scripts` owns repository checks and E2E orchestration.
- `e2e` owns Playwright specifications.
- `src/features`, `src/entities`, `src/widgets`, `src/components`, and top-level `src/lib` have no active ownership. Do not revive a layer or path until a concrete responsibility justifies an approved architecture change.

## Dependency Boundaries

Active source follows this direction:

```text
root app -> _app, _pages, shared
_app     -> _pages, shared
_pages   -> shared
shared   -> shared
```

- Root route adapters may import `_app`, `_pages`, and Shared public APIs as framework composition requires.
- The local checker prevents target FSD layers from importing legacy `src/app`, `src/features`, or `src/widgets` modules and retains the legacy rule that only route code may import `src/app`.
- The checker prevents Shared from importing `_app` or `_pages`.
- The checker prevents a page slice from importing a sibling page slice.
- Cross-boundary imports use the destination page-slice or Shared-segment public API. Files inside one slice or segment may use relative imports for their own internals.
- Canonical ownership does not permit legacy `app`, `features`, or `widgets` directories under `src/`; the checker rejects imports that would keep those legacy dependencies alive.
- The checker prevents a Client Component from importing `server-only`, a `/server/` path, or a `.server` module.
- Test files and `src/test` are classified as `other`: layer and page-slice restrictions do not apply, but legacy-App and client-server restrictions still do.
- The checker does not assign active responsibilities to unrecognized top-level source directories. Do not use one to bypass the documented direction.
- `bun run fsd:check` runs the `steiger` architecture linter with `@feature-sliced/steiger-plugin`; the local checker remains authoritative for repository-specific framework names and boundaries.
- Move shared behavior downward or compose independent modules from a higher layer. Do not bypass the checker.

## Routes and Pages

- Keep route `page.tsx` and `layout.tsx` files focused on metadata, route composition, and server boundaries.
- Keep a workflow, schema, request, and composition in its owning page slice while it has one page consumer.
- Move repeated business responsibility into `features` or `entities` only after reuse establishes that layer's ownership; use `_app/layouts` for route-wide application composition.
- Do not create `src/server`, another application, or another package until a concrete responsibility requires it.
- Do not invent backend, authentication, persistence, or deployment layers.

## Imports and Names

- Use `@/` for imports across directories; it maps to `src/`.
- Use relative imports for internals inside the same slice or segment. Use public APIs across slice or segment boundaries.
- Use `import type` for type-only imports.
- `INFERRED`: active files use kebab-case filenames, PascalCase components and exported types, camelCase values and functions, and `use` prefixes for hooks.
- Name tests `*.test.ts` or `*.test.tsx`; active tests use `test`.
- Prefer focused exports. Page slices and Shared segments require boundary public APIs; there is no top-level `src/shared/index.ts`. `src/test/test-utils.tsx` intentionally re-exports test helpers.

## Module APIs

- Export the smallest surface needed by current consumers.
- Keep page-slice internals inside the slice unless repeated cross-page use proves lower-layer ownership.
- Do not add a barrel solely to shorten imports or hide an architecture boundary.
- Preserve discriminated public results such as the shared API result rather than leaking transport details.

## Server and Client Files

- Mark interactive modules with `"use client"` at the narrowest boundary.
- Import `server-only` in server-confidential modules such as server environment access.
- Keep browser APIs, hooks, and event handlers out of Server Components.
- Follow `2-react-next-typescript.md` for render boundaries.

## Generated and Protected Paths

- Do not edit generated or ignored output. `7-tech-stack-tooling-ci.md` owns the complete list and update rules.
- Do not treat `public/demo/activity.json` as generated; it is a maintained test/demo fixture with schema coverage.

## Scope Hygiene

- Preserve unrelated work and avoid drive-by refactors.
- Remove unused code introduced by the current change.
- Do not leave placeholder implementations that claim unsupported behavior.
- `NOT PRESENT`: no active `TODO` or `FIXME` policy or markers were found. State incomplete work in the completion report instead of inventing a repository convention.
- Do not add comments that restate code. Explain only non-obvious constraints, ownership, or failure behavior.
