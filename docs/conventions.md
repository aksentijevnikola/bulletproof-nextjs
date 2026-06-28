# Conventions

## Naming and imports

- Components and exported types use PascalCase.
- Tests use `*.test.ts` or `*.test.tsx` and `test`, never `it`.
- Use `@/` aliases and `import type` for type-only imports.
- Prefer focused direct imports over broad barrels.
- Do not bypass architecture boundaries with relative traversal.

## Components

- Server Components by default; push Client Components as low as practical.
- Use semantic HTML before ARIA.
- Use semantic design tokens instead of foundational raw palette classes.
- Use `gap-*`, not `space-x-*` or `space-y-*`.
- Use one Lucide icon family and accessible names for icon-only controls.

## Forms

- Every field has a visible associated label.
- Validate submitted input with Zod.
- Put errors beside fields and provide a summary for multiple failures.
- Set `aria-invalid`, link descriptions, and focus the first invalid field.
- Demo success text must not imply authentication or persistence.

## State

Choose URL state, Server Components, TanStack Query, Context, or local state according to ownership. Do not add a global state library without a concrete requirement and architecture decision.
