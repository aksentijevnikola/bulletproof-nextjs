# Testing

Vitest runs in jsdom with React Testing Library, user-event, jest-dom, MSW, and a fresh QueryClient per render.

```bash
bun run test
bun run test:watch
bun run test:coverage
```

Test behavior rather than implementation details. Mock external boundaries through MSW; do not mock internal components by default.

Playwright starts the production application and verifies desktop/mobile layouts, keyboard behavior, themes, focus, reduced motion, console errors, hydration warnings, overflow, and axe scans:

```bash
bun run e2e
```

`bun run verify` runs environment, architecture, dependency, type, Biome, unit-test, and build checks. E2E remains separate so failures are attributable.
