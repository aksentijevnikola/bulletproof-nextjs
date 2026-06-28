# Deployment

## Vercel

```bash
bun install --frozen-lockfile
bun run build
```

Set `NEXT_PUBLIC_APP_URL` to the canonical production origin.

## Node-compatible hosting

```bash
bun install --frozen-lockfile
bun run build
bun run start
```

The host must support Node.js 24 LTS. bulletproof-nextjs does not enable Next.js `output: "standalone"` because packaging is host-specific.

Smoke-test `/`, `/login`, `/dashboard`, `/settings`, and an unknown route after deployment.
