# Accessibility and Localization

## Confirmed Accessibility Patterns

- `CONFIRMED`: the root layout declares English, includes a skip link, and gives the primary content a stable target.
- `CONFIRMED`: forms use visible labels, native semantics, autocomplete, `aria-invalid`, descriptions, inline errors, linked summaries, and first-invalid-field focus.
- `CONFIRMED`: loading and success regions use status, busy, or live-region semantics.
- `CONFIRMED`: decorative icons are hidden and icon-only controls have accessible names.
- `CONFIRMED`: Playwright runs axe rules and checks focus, overflow, dialogs, and key interaction outcomes.
- Treat these patterns as product requirements when modifying equivalent UI.

## Semantics and Names

- Use native elements and landmarks before ARIA.
- Keep heading order meaningful and lists structurally correct.
- Give every control an accessible name that describes its action.
- Use `aria-describedby` for supporting text and errors; use `aria-labelledby` when visible text names a region.
- Do not add ARIA that conflicts with native semantics.

## Keyboard and Focus

- Keep every interactive control reachable and operable by keyboard.
- Preserve visible focus and logical focus order.
- Move focus only for a user-understandable reason, such as the first invalid field or an opened modal.
- Overlays must support expected entry, Escape, containment when modal, and focus return.
- Do not use positive `tabIndex` to repair document order.

## Forms and Dynamic Content

- Connect each visible label to its field.
- Announce validation and asynchronous status without repeating the same message on every render.
- Pair color with text, an icon, or another programmatic cue.
- Keep disabled-state meaning available to assistive technology.
- Follow `4-state-forms-url.md` for form ownership and validation flow.

## Visual Access

- Preserve semantic-token contrast in light and dark themes.
- Keep content and actions usable at narrow widths and increased zoom.
- Avoid fixed heights that clip text or validation messages.
- Keep touch targets large enough for reliable use and separate adjacent actions.
- Respect `prefers-reduced-motion`; provide an immediate alternative when motion conveys state.
- `NOT PRESENT`: no automated zoom or reduced-motion browser assertion was found. Verify these manually when affected.

## Localization Status

```text
Localization framework
-> NOT PRESENT

Translation keys and namespaces
-> NOT PRESENT

Locale routing or negotiation
-> NOT PRESENT

Localized validation messages
-> NOT PRESENT
```

- Do not invent an i18n architecture or translation API.
- `CONFIRMED`: UI copy and validation messages are English.
- `CONFIRMED`: activity dates use `Intl.DateTimeFormat` with a fixed English locale.
- `CONFIRMED`: the settings demo offers timezone values, but does not localize or persist profile data.

## Future Locale Work

- A localization task requires an explicit project decision before adding a library, locale routing, key ownership, or fallback behavior.
- Use locale-aware date, number, and currency formatting once locale ownership exists.
- Keep validation messages inside the future translation boundary instead of hardcoding parallel copies.
- Allow labels, errors, buttons, and navigation to expand without clipping or overlap.
- Test direction, pluralization, and long translated content only for locales the project explicitly adopts.
