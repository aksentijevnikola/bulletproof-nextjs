# Core Architecture

## Application Shape

- `CONFIRMED`: the repository root contains one standalone Next.js application.
- `CONFIRMED`: routing uses `src/app`; no Pages Router exists.
- `CONFIRMED`: this is not a workspace, monorepo, backend, or package collection.

## Directory Ownership

- `src/app` owns routes, layouts, metadata, route groups, and route states. Keep route files as thin composition adapters.
- `src/widgets` owns page-level and application-shell composition.
- `src/features/<feature>` owns a user workflow and its feature-specific schema, state, UI, and tests.
- `src/shared/ui` owns business-agnostic UI primitives.
- Other `src/shared` directories own reusable API, environment, provider, hook, style, notification, and utility infrastructure.
- `src/test` owns shared test rendering, setup, and network mocks.
- `public` owns static assets and the demo activity fixture.
- `scripts` owns repository checks and E2E orchestration.
- `e2e` owns Playwright specifications.
- `src/components` and `src/lib` have no active ownership. Place new code in an established layer instead of reviving an unused path implicitly.

## Dependency Boundaries

Active source follows this direction:

```text
app      -> widgets, features, shared
widgets  -> features, shared
features -> shared
shared   -> shared
```

- `scripts/check-architecture.ts` prevents every non-`app` layer from importing `src/app`.
- The checker prevents `shared` from importing any other layer.
- The checker prevents a feature from importing a sibling feature or any widget.
- The checker prevents a widget from importing a sibling widget.
- The checker prevents a Client Component from importing `server-only`, a `/server/` path, or a `.server` module.
- Test files and `src/test` are classified as `other`: feature, widget, and shared restrictions do not apply, but the `app` and client-server restrictions still do.
- The checker does not assign active responsibilities to `src/components`, `src/lib`, or another unrecognized top-level directory. Do not use an unrecognized directory to bypass the documented direction.
- Move shared behavior downward or compose independent modules from a higher layer. Do not bypass the checker.

## Routes and Features

- Keep route `page.tsx` and `layout.tsx` files focused on metadata, route composition, and server boundaries.
- Reuse a feature for a user workflow and a widget for page or shell composition.
- Do not create `src/entities`, `src/server`, another application, or another package until a concrete responsibility requires it.
- Do not invent backend, authentication, persistence, or deployment layers.

## Imports and Names

- Use `@/` for imports across directories; it maps to `src/`.
- Use relative imports only for tightly coupled files in the same directory.
- Use `import type` for type-only imports.
- `INFERRED`: active files use kebab-case filenames, PascalCase components and exported types, camelCase values and functions, and `use` prefixes for hooks.
- Name tests `*.test.ts` or `*.test.tsx`; active tests use `test`.
- Prefer focused direct imports. The repository has no universal barrel-export requirement; `src/test/test-utils.tsx` intentionally re-exports test helpers.

## Module APIs

- Export the smallest surface needed by current consumers.
- Keep feature internals inside their feature unless repeated cross-feature use proves shared ownership.
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
