# Tech Stack, Tooling, and CI

## Runtime and Package Ownership

- `CONFIRMED`: the package manager is Bun `1.3.14`, declared in `package.json` and `.bun-version`.
- `CONFIRMED`: `bun.lock` is the only application lockfile and is required by `scripts/check-dependencies.ts`.
- `CONFIRMED`: Node is pinned to `24.13.0` in `.node-version` and `.nvmrc`; the allowed engine range is `>=24.0.0 <25`.
- `CONFIRMED`: the Bun engine range is `>=1.3.0`.
- Use exact direct dependency versions. Keep `package.json` and `bun.lock` aligned.
- Use `bun install --frozen-lockfile` for reproducible installation. Do not run installation during unrelated work.
- Do not modify dependencies or the lockfile without explicit approval.

## Framework and Language Versions

- Next.js: `16.2.10`.
- React: `19.2.7`.
- React DOM: `19.2.7`.
- TypeScript: `7.0.2`.
- React Compiler plugin: `1.0.0`.
- React types: `@types/react` `19.2.17`; `@types/react-dom` `19.2.3`.
- Runtime types: `@types/node` `26.1.1`; `@types/bun` `1.3.14`.

## Application Library Versions

- Remote state: `@tanstack/react-query` `5.101.2`; development tools `@tanstack/react-query-devtools` `5.101.2`.
- Validation: `zod` `4.4.3`.
- Themes: `next-themes` `0.4.6`.
- UI primitives: `radix-ui` `1.6.2`; `class-variance-authority` `0.7.1`.
- Class composition: `clsx` `2.1.1`; `tailwind-merge` `3.6.0`.
- Icons and notifications: `lucide-react` `1.25.0`; `sonner` `2.0.7`.
- Server boundary marker: `server-only` `0.0.1`.
- Animation utilities: `tw-animate-css` `1.4.0`.
- `NOT PRESENT`: no global client-state library.
- `NOT PRESENT`: no dedicated form-state library.
- `NOT PRESENT`: no Axios or alternate HTTP client; the application uses native `fetch`.

## Styling Versions

- Tailwind CSS: `4.3.3`.
- Tailwind PostCSS plugin: `@tailwindcss/postcss` `4.3.3`.
- PostCSS: direct declaration `8.5.19`; the package override resolves it to `8.5.15`.
- shadcn CLI: `4.13.1`.
- `components.json` configures the New York style, React Server Components, CSS variables, Lucide icons, global CSS at `src/_app/styles/globals.css`, and aliases into `src/shared`.
- `NOT PRESENT`: no separate Tailwind configuration file; theme configuration lives in CSS.

## Quality and Test Versions

- Biome: `@biomejs/biome` `2.5.4`.
- Architecture tooling: `steiger` core/CLI `0.6.0`; FSD rules package `@feature-sliced/steiger-plugin` `0.7.0`.
- Vitest: `4.1.10`; V8 coverage plugin `4.1.10`.
- jsdom: `29.1.1`.
- Testing Library: DOM `10.4.1`, jest-dom `6.9.1`, React `16.3.2`, user-event `14.6.1`.
- MSW: `2.15.0`.
- Playwright: `@playwright/test` `1.61.1`.
- Playwright axe integration: `@axe-core/playwright` `4.12.1`.
- Keep React and React DOM, query and query devtools, and Vitest and its coverage plugin version-aligned; the dependency checker enforces these pairs.

## Dependency Policy

- `scripts/check-dependencies.ts` rejects missing `bun.lock`, prerelease direct dependencies, and configured prohibited packages.
- Prohibited direct dependencies are Axios, Jotai, Next PWA, Recoil, Redux, Turbo, Turborepo, Zustand, packages under `@nx/`, and packages under `@reduxjs/`.
- Reuse current boundaries or obtain approval for a documented architecture change; do not bypass the checker.

## Commands

### Development Commands

- `bun run dev`: start the Next.js development server.
- `bun run test:watch`: run Vitest in watch mode.
- `bun run start`: start an existing production build.

### Non-writing Verification Commands

- `bun run env:check`: validate the environment schema and example coverage.
- `bun run architecture:check`: enforce source-layer and server-client import boundaries.
- `bun run fsd:check`: run Steiger with the Feature-Sliced rules plugin against `src/`.
- `bun run dependencies:check`: enforce lockfile and dependency policy.
- `bun run typecheck -- --incremental false`: type-check without JavaScript, declaration, or build-info output.
- `bun run check`: run Biome checks without fixes.
- `bun run test`: run finite Vitest tests.

### Writing or Auto-fix Commands

- `bun run check:fix`: writes formatter, linter, and import-organization changes. Run only when the task authorizes writing.
- `bun install` and dependency commands write dependency state. Run only with explicit approval.

### Generated-output Verification Commands

- `bun run typecheck`: type-check without JavaScript or declaration output, but may write ignored `*.tsbuildinfo` because incremental compilation is enabled.
- `bun run test:coverage`: runs tests and writes `coverage/`.
- `bun run e2e:run`: runs browser tests against a production server and may write Playwright reports, traces, screenshots, videos, or test results.

### Production and Build Commands

- `bun run build`: writes the Next.js production build to `.next/`.
- `bun run verify`: runs environment, local architecture, FSD, dependency, type, Biome, unit-test, and production-build checks; it writes `.next/`.
- `bun run e2e`: builds, starts the production application through the E2E runner, and runs Playwright; it writes build and test artifacts.
- Do not run a production build merely to validate documentation.

### Generated-code Commands

- `NOT PRESENT`: no API, schema, route, database, or other application code-generation command exists.

## Formatter and Type Ownership

- Biome owns formatting, linting, and import organization through `biome.json`.
- `NOT PRESENT`: no ESLint or Prettier configuration exists.
- TypeScript runs with strict mode, no emit, isolated modules, exact optional properties, unchecked-index checks, and bundler module resolution.
- The `@/*` alias resolves to `src/*`.
- React Compiler is enabled in `next.config.ts`.

## Generated and Tool-owned Files

- Next.js owns `.next/` and `next-env.d.ts`.
- TypeScript owns `*.tsbuildinfo`.
- Vitest coverage owns `coverage/`.
- Playwright owns `playwright-report/` and `test-results/`.
- Bun owns `bun.lock` through approved package operations.
- The skills configuration names `.agents/skills/` as its output directory; `skills-lock.json` records installed skill state.
- Do not hand-edit generated output or skill-installation state. The skill update command and authority remain a project decision in `.ai/README.md`.

## Environment and Secrets

- `NEXT_PUBLIC_APP_NAME`: public, non-empty string with local default `bulletproof-nextjs`.
- `NEXT_PUBLIC_APP_URL`: public URL with local default `http://localhost:3000`.
- `.env.example` is the committed environment template; other `.env*` files are ignored.
- Never place a secret in a `NEXT_PUBLIC_` variable.
- Validate future public keys in `src/shared/env/env.schema.ts` and expose them through the client environment boundary.
- Validate future secret keys in a server-only boundary; update `.env.example` and CI only when required.
- Do not print, commit, or place real credentials, personal data, private URLs, or customer payloads in fixtures.

## Test Capabilities

- Unit and component tests use Vitest with jsdom, Testing Library, user-event, jest-dom, and MSW.
- Test discovery includes `*.test.ts` and `*.test.tsx`; E2E, `node_modules`, and generated Next output are excluded.
- Coverage targets `_app`, `_pages`, Shared source, and repository scripts; Shared UI primitives and test helpers are excluded.
- `NOT PRESENT`: no coverage threshold is configured. The unresolved policy belongs in `.ai/README.md`.
- Browser tests use Chromium, production-server behavior, axe rules, mobile layout, focus, form validation, query states, theme persistence, navigation, overflow, and browser-error checks.
- `NOT PRESENT`: no separate component-browser runner or named integration-test suite exists.

## Docker and CI

- `NOT PRESENT`: no Dockerfile, Compose file, or container workflow exists.
- GitHub Actions runs on pushes to `master` and `main`, pull requests, and manual dispatch.
- CI uses read-only contents permission, concurrency cancellation, runtime version files, frozen installation, and full commit SHAs for actions.
- The verification job runs environment, local architecture, FSD, dependency, type, Biome, coverage, and production-build checks.
- The E2E job depends on verification, installs Chromium, builds, runs Playwright, and uploads failure artifacts.
- Do not weaken CI gates or action pinning to make a change pass.

## Runtime Services

- `CONFIRMED`: `next.config.ts` disables the powered-by header, enables React Compiler, and sends content-type, referrer, frame, and permissions security headers.
- `NOT PRESENT`: no backend, database, authentication provider, authorization policy, or middleware.
- `NOT PRESENT`: no structured logging or observability vendor; only local diagnostic error reporting is implemented.
- `NOT PRESENT`: no analytics integration.
- `NOT PRESENT`: no feature-flag service or framework.
- `NOT PRESENT`: no PWA, service worker, or offline runtime.

## Version Maintenance

- Update this file in the same approved change as any direct dependency, runtime pin, package-manager, or core tooling change.
- Read installed framework documentation under `node_modules/next/dist/docs/` or current official documentation for the confirmed installed version when behavior is version-sensitive.
- Do not copy versions, commands, or conventions from another repository or model memory.
