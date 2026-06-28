# Environment

bulletproof-nextjs uses:

```env
NEXT_PUBLIC_APP_NAME=bulletproof-nextjs
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Safe defaults allow local startup without copying an environment file. Production should override the canonical URL and may override the name.

- Client code accesses only statically named public variables.
- Server environment access is guarded with `server-only`.
- `.env.example` is safe to commit.
- `.env`, `.env.local`, and secret variants are ignored.

Validate with `bun run env:check`.
