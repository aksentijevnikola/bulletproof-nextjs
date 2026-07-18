# API, Server Actions, and Contracts

## Current Boundary

- `CONFIRMED`: `src/shared/api/fetch-client.ts` is the shared HTTP boundary and uses native `fetch`.
- Return expected request outcomes as `ApiResult<T>` with the normalized `ApiError` model.
- Keep untrusted payloads as `unknown` until narrowed or validated.
- Supply a Zod output schema when the caller requires a trusted response shape.
- Provide either `body` or `json`, never both.
- Reuse shared timeout and cancellation behavior. Pass an external `AbortSignal` when navigation or user intent owns cancellation.
- Keep catch values as `unknown`; normalize, report, or rethrow to an established owner.
- Do not add another HTTP client while the native-fetch boundary satisfies the requirement.

## Responses and Errors

- Treat non-success HTTP status as `http_error` with status metadata.
- Parse empty response bodies as `undefined`.
- Parse JSON only when the response content type declares JSON; normalize malformed JSON as `invalid_response`.
- Validate with `safeParse` when a schema is provided; return structured validation issues through the normalized error details.
- Normalize timeout, caller cancellation, network, invalid-response, and unknown failures.
- Show UI-safe messages. Do not expose raw payloads, stacks, secrets, tokens, or private URLs.
- `NOT PRESENT`: no established conflict-response or rate-limit contract exists.

## Data Fetching

- `CONFIRMED`: the active remote-data example is a Client Component query over `public/demo/activity.json`.
- Use Server Components for ordinary server-owned data when a server data source is introduced.
- Use TanStack Query when client interaction requires caching, retry, refetch, or mutation state.
- Do not fetch an internal Route Handler from a Server Component unless an interoperability boundary requires HTTP.
- `NOT PRESENT`: no active server-side data fetch, prefetch, dehydration, or hydration flow exists.

## TanStack Query

- Keep stable readonly query keys near their feature; add a key factory only when reuse proves necessary.
- Query functions return validated data or throw an `Error` suitable for the feature boundary.
- The shared QueryClient sets common defaults and cache-level error reporting.
- The shared helper creates a fresh client on the server and reuses one in the browser; the mounted provider keeps one stable client per provider tree.
- Override retry, freshness, or refetch behavior only for a product requirement.
- Render pending, error, empty, and success states. Keep retry controls accessible.
- `NOT PRESENT`: no pagination or dependent-query pattern is established.

## Mutations

- `NOT PRESENT`: the application has no active mutation.
- Choose cache work from the mutation owner and response lifecycle:
  - Use invalidation when the server remains canonical and affected queries should refetch.
  - Use direct cache update when the response contains canonical replacement data and cache ownership is unambiguous.
  - Use optimistic update with rollback only when reversal and failure UI are defined.
  - Use UI-only optimistic state for presentation that does not claim cached server truth changed.
  - Use no cache action when no cached data is affected.
- Do not globally require invalidation or optimistic updates.
- The first mutation must resolve the policy recorded in `.ai/README.md`; an agent must not choose a repository-wide default implicitly.

## Route Handlers, Actions, and Middleware

- `NOT PRESENT`: no `route.ts` Route Handler exists.
- `NOT PRESENT`: no Server Action or `"use server"` module exists.
- `NOT PRESENT`: no middleware exists.
- `NOT PRESENT`: no authentication, authorization, session, or localization middleware exists.
- Do not simulate these capabilities in client code. Introduce them only through an explicit architecture and security decision.
- Any future write boundary must validate input, authorize the operation, serialize a stable result, and avoid leaking internal errors.

## Contracts and Serialization

- `NOT PRESENT`: no generated API contract or code-generation command exists.
- Active schemas are handwritten Zod contracts near their feature or shared boundary.
- Keep transport DTOs separate from domain/UI data only when mapping has a concrete responsibility.
- Preserve dates as serialized strings across network and server-client boundaries; format them at the display boundary.
- `NOT PRESENT`: no upload or download convention exists.

## Mocking

- Use MSW for unit and component tests that cross the HTTP boundary.
- Use Playwright request routing for browser scenarios that need controlled remote outcomes.
- Do not ship runtime API mocks. The static activity JSON is an explicit demo fixture, not a generated contract.
- Exact library versions and test commands belong in `7-tech-stack-tooling-ci.md`.
