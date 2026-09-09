# Design System

## Foundations

- `CONFIRMED`: root `app/layout.tsx` imports `src/_app/styles/globals.css`, which includes `src/shared/styles/bulletproof-nextjs.css`.
- Use semantic CSS variables mapped into Tailwind theme tokens.
- Use semantic utilities such as `bg-background`, `text-foreground`, `border-border`, and their existing role-specific variants.
- Preserve the current font variables, radius scale, light theme, and dark theme.
- Do not introduce a replacement theme system or raw palette when an existing semantic token expresses the role.
- Exact styling-tool versions belong in `7-tech-stack-tooling-ci.md`.

## Tokens and Utilities

- Reuse existing color, typography, radius, border, and spacing utilities before adding a token.
- Intentional arbitrary values are allowed for a unique layout or optical adjustment when no semantic utility fits.
- Promote repeated values into the existing CSS-variable, Tailwind-theme, or component-variant system when repetition proves shared meaning.
- Prefer flexible sizing, `gap-*`, grid, and flex layout over brittle fixed positioning.
- Keep global CSS for tokens and true application-wide behavior; keep component styling with its component.

## Primitives and Variants

- Put business-agnostic primitives in `src/shared/ui`.
- Reuse the configured shadcn-compatible and Radix primitives before creating an equivalent control.
- Use the existing `cn` merge helper for conditional classes.
- Use the established variant utility when a primitive has named visual or size variants.
- Keep product language and page-owned workflow behavior in `src/_pages`; keep route-wide application composition in `src/_app/layouts`, not Shared primitives.
- Use the established icon library. Hide decorative icons and give icon-only controls accessible names.

## Responsive Layout

- Build mobile-first: unprefixed utilities define the smallest viewport; add larger breakpoint behavior progressively.
- Preserve readable content, controls, labels, navigation, and actions at narrow widths.
- Prevent horizontal overflow and avoid dimensions that clip under zoom or longer content.
- Keep responsive behavior near the component that owns the layout.
- Test changed layouts at the active mobile and desktop browser sizes instead of inferring responsiveness from class names.

## Themes

- `CONFIRMED`: light, dark, and system themes use a class-based theme provider.
- Keep the root hydration suppression required by the theme provider.
- Avoid rendering theme-dependent UI before mounted state is known when it would cause hydration mismatch.
- Preserve visible focus and semantic contrast in both light and dark themes.

## UI States

- Define loading, empty, error, disabled, and success states when the interaction can reach them.
- Keep error states recoverable when retry is safe.
- Use skeletons only when they communicate structure; label loading regions and expose busy state.
- Disable controls only when the action is unavailable, and explain the reason when it is not obvious.
- `NOT PRESENT`: no authorization model establishes permission-denied UI.

## Overlays and Data Display

- Reuse established Radix-backed sheet, select, dropdown, and similar existing primitives for focus and keyboard behavior.
- Preserve accessible names, Escape behavior, focus containment where required, and focus return.
- `NOT PRESENT`: no table or data-grid pattern is established.
- Do not invent a table abstraction before real data, density, sorting, selection, and responsive requirements exist.

## Rendering Performance

- Keep static content in Server Components and interactive code in narrow client leaves.
- Rely on the enabled compiler for ordinary memoization; follow `2-react-next-typescript.md` before adding manual memoization.
- Avoid mounting duplicate provider trees or recreating long-lived query clients during render.
- Measure before introducing virtualization, deferred rendering, or another performance dependency.

## Offline UI

- `NOT PRESENT`: no service worker, offline cache, install manifest, or PWA behavior exists.
- Do not display offline-success or queued-write claims without supporting runtime behavior.
