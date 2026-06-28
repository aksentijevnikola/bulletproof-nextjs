# Security

- Treat environment variables, forms, network payloads, URLs, and storage as untrusted.
- Validate boundaries with Zod and retain `unknown` until validation succeeds.
- Expose normalized UI-safe API errors, not raw response objects.
- Never commit `.env`, credentials, tokens, personal data, or private URLs.
- `NEXT_PUBLIC_` values are public and never secrets.
- Keep GitHub Actions permissions read-only unless documented otherwise.
- Pin third-party actions to full commit SHAs and avoid `pull_request_target`.
- Use frozen installs and review dependency updates; do not auto-merge them.
- Demo fixtures must remain synthetic and non-sensitive.
