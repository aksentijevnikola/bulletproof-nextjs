# bulletproof-nextjs agent contract

This Next.js version may differ from training data. Before framework-specific changes, read the relevant guide under `node_modules/next/dist/docs/` or current official documentation.

## Reading order

1. `AGENTS.md`
2. `docs/architecture.md`
3. `docs/conventions.md`
4. `docs/testing.md`
5. Relevant nearby code and tests

## Rules

- Use Bun and the repository-pinned versions.
- Keep route files thin; Server Components are the default.
- Follow `app -> widgets/features/shared`, `widgets -> features/shared`, `features -> shared`, `shared -> shared/external`.
- Do not import `src/app` from non-route code or server-only modules from Client Components.
- Put reusable primitives in `src/shared/ui`, workflows in `src/features`, and page composition in `src/widgets`.
- Validate environment, form, and response boundaries with Zod.
- Use native `fetch`; do not add Axios.
- Use TanStack Query only for interactive client-side server state.
- Preserve accessibility, visible focus, reduced motion, strict types, Biome, and tests.
- Do not add backend, auth provider, persistence, PWA, monorepo, or speculative infrastructure.
- Do not stage or commit unless explicitly requested.

## Verification

Run focused checks while working. Before completion run:

```bash
bun run verify
bun run e2e
```

Never claim checks passed unless current output confirms it.
