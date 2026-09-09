# React, Next.js, and TypeScript

## Routing and Rendering

- `CONFIRMED`: the App Router lives in root `app/` and includes a `(shell)` route group.
- `CONFIRMED`: `app/layout.tsx` composes `_app` providers and global styles; `app/(shell)/layout.tsx` composes the `_app/layouts` application shell.
- Route pages remain thin Server Component adapters and import the matching `src/_pages/<slice>` public API.
- Use Server Components by default.
- Add `"use client"` only for hooks, events, browser APIs, providers, interactive forms, themes, or client queries.
- Keep Client Components low in the tree and pass only serializable props across the server-client boundary.
- Reuse `loading.tsx`, `error.tsx`, `global-error.tsx`, and `not-found.tsx` patterns for route lifecycle states.
- `NOT PRESENT`: no explicit application `Suspense` boundary was found. Use route loading boundaries unless a concrete streaming boundary needs local Suspense.

## State and Hooks

- Keep transient UI state in the component that owns it.
- Use established providers only for their current cross-cutting concerns: query state, theme, and notifications.
- Do not copy remote data into local or global state solely to derive a view.
- Follow `4-state-forms-url.md` for choosing local, context, remote, form, and URL state.

## Effect Decision Guide

```text
Derived value
-> calculate during render

User interaction
-> event handler

External synchronization
-> Effect with cleanup

External store
-> established library hook or useSyncExternalStore

Remote data
-> established server or query layer

Component reset
-> stable key
```

- Effects must synchronize with an external lifecycle, not transform render data or handle user intent.
- Include complete dependencies. Do not suppress dependency diagnostics.
- Clean up subscriptions, timers, listeners, and cancellable work.
- Active effects are narrow: error-boundary diagnostics and a mounted-state hook for hydration-sensitive theme UI.
- `NOT PRESENT`: no direct `useSyncExternalStore` implementation exists. Prefer an installed library hook when it already owns the external store.

## Composition and Control

- Prefer composition over boolean-prop combinations that create incompatible component modes.
- Keep one clear owner for controlled state and callbacks.
- Use a stable key when the product intent is to reset an entire component subtree.
- Use event handlers for validation, submission, and theme changes; do not mirror those actions through effects.

## Loading and Errors

- Represent pending, error, empty, and success states explicitly when data is remote.
- Let route error boundaries own unexpected render failures.
- Keep recoverable query errors inside the owning page slice with a clear retry action.
- Report unexpected asynchronous failures through the configured query or mutation cache callback.
- Never expose stack traces, secrets, private URLs, or raw response bodies in UI errors.

## TypeScript

- Satisfy every strict option in `tsconfig.json`, including unchecked-index and exact-optional-property checks.
- Keep uncertain values as `unknown` until narrowed or validated.
- Avoid `any`, unchecked assertions, non-null assertions, ignored errors, and disabled checks.
- Use discriminated unions for distinct states and exhaustive handling when a missed case is unsafe.
- Distinguish absent optional properties from properties whose value may be `undefined`.
- Narrow nullable data before use; do not hide uncertainty with fallback values that change product meaning.
- Use readonly arrays, objects, and query keys when mutation is unnecessary.
- Reuse generated framework types but never edit `.next/types` or `.next/dev/types`.

## React Compiler

- `CONFIRMED`: React Compiler is enabled in `next.config.ts`.
- Rely on it for ordinary memoization.
- Add `memo`, `useMemo`, or `useCallback` only for measured performance or required referential stability.
- Reconfirm compiler configuration after framework or compiler changes; exact versions belong in `7-tech-stack-tooling-ci.md`.
