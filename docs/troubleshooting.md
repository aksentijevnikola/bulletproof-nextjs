# Troubleshooting

## Bun is unavailable

Confirm the pinned version and refresh PATH. On Windows Bun is normally under `%USERPROFILE%\.bun\bin`.

## Frozen install fails

Run normal `bun install` only when intentionally updating dependencies. Review `package.json` and `bun.lock`; do not delete the lockfile as a first response.

## Windows EPERM in node_modules

Close processes holding the file, retry the narrow command once, and request elevated execution when the sandbox or antivirus owns the denial. Do not weaken validation.

## shadcn aliases are wrong

Run `bunx shadcn info` and confirm aliases point to `src/shared/ui`, `src/shared/lib`, and `src/shared/hooks`.

## Geist falls back

Keep font variable classes on `<html>` and literal Geist family names in Tailwind `@theme inline`.

## Playwright browser is missing

Run `bunx playwright install chromium`.

## Hydration mismatch

Check theme-dependent rendering and browser-only APIs. Delay theme-specific UI until mounted rather than suppressing unrelated warnings.

## Query state leaks between tests

Use the shared render helper, which creates a QueryClient for each test.
