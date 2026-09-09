# State, Forms, and URL

## Ownership Guide

```text
Transient component state
-> React local state

Subtree workflow state
-> scoped Context

Cross-tree client state
-> NOT PRESENT: no global client-state library

Remote state
-> TanStack Query or a Server Component

Shareable navigation or filter state
-> URL and search parameters

Form state
-> native form controls, FormData, and React local state

Validation
-> Zod schemas

Application persistence
-> NOT PRESENT
```

- Choose the smallest owner whose lifecycle matches the data.
- Do not add a state, form, validation, URL-state, or persistence library because an external example uses it.
- Exact installed tooling belongs in `7-tech-stack-tooling-ci.md`.

## Local and Context State

- `CONFIRMED`: Client Components use local state for validation errors, submission feedback, provider lifetime, and small UI interactions.
- Derive values during render instead of storing duplicate state.
- Use event handlers for user-triggered transitions.
- Use scoped Context only when multiple descendants need one subtree-owned workflow value.
- `CONFIRMED`: `_app/providers` owns query state, theme, and notifications; do not turn those providers into general application stores.
- `NOT PRESENT`: no Redux, Zustand, Jotai, Recoil, or equivalent global client-state library exists.

## Remote State

- Use Server Components for server-owned data that does not require client cache behavior.
- Use TanStack Query for interactive remote state.
- Keep request parsing and validation in the owning page API/query boundary, not in a global client store.
- Do not copy query data into global client state unless a documented lifecycle requirement makes the query cache the wrong owner.
- Follow `3-api-server-actions-contracts.md` for query and mutation behavior.

## URL State

- Use path segments for resource identity and navigation.
- Use search parameters for shareable filters, sorting, pagination, and view state when those capabilities are introduced.
- Parse URL values at the route or owning page-slice boundary and validate values before use.
- Update URL state through established Next.js navigation APIs for the installed version.
- `NOT PRESENT`: no active search-parameter state or URL-state helper library exists. Inspect official installed-version guidance before creating the first pattern.

## Forms

- `CONFIRMED`: active forms use native `<form>` elements, `FormData`, React local state, and page-local Zod schemas.
- `NOT PRESENT`: no dedicated form-state library is installed or established.
- Keep native labels, names, input types, autocomplete attributes, and submit semantics.
- Use `safeParse` for recoverable validation.
- Map schema issues only to recognized fields and keep the first useful message per field.
- Clear a field error when that field changes; do not erase unrelated errors.
- Focus the first invalid field after state is rendered.
- Render inline errors and a linked summary when multiple fields fail.
- Keep success copy truthful: current demos validate locally and do not authenticate or persist profile data.
- Follow `6-accessibility-i18n.md` for labels, errors, announcements, and future localization.

## Persistence

- `CONFIRMED`: theme preference is managed and persisted by the established theme provider.
- `NOT PRESENT`: no application data persistence, database, storage abstraction, or authenticated profile save exists.
- Do not claim local form submission saved data.
- Add storage only when ownership, lifetime, privacy, migration, and failure behavior are explicit requirements.
