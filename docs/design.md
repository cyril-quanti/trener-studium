# Design brief – calm & focused, no slop

Reference feel: **Linear**, **Things 3**. Quiet, precise, content-first. The UI should disappear behind the material.

## Foundations

- **Color**: neutral gray scale + **one deep-green accent** (tuned around Tailwind `green-700`/`emerald-700` for light, a lighter step for dark; must meet WCAG AA). Semantic tokens as CSS variables: `--surface`, `--surface-raised`, `--border`, `--text`, `--text-muted`, `--accent`, `--accent-contrast`, `--success`, `--danger`. Success/danger used sparingly (Umím / Neumím only).
- **Dark mode**: designed, not inverted. Near-black neutral surfaces (not pure #000), slightly raised cards, softened borders. Theme: system / light / dark.
- **Type**: Inter (self-hosted, `@fontsource-variable/inter`, latin-ext). Small set of sizes; tight tracking on headings; `font-variant-numeric: tabular-nums` for stats; notes at ~17px, line-height ~1.65, max ~65ch.
- **Spacing**: 4px grid. **Radii**: max 3 values. **Shadow**: one subtle level. Hairline 1px borders.
- **Icons**: Lucide only, 1.5–1.75 stroke, consistent sizes. No illustrations, no emoji.
- **Motion**: subtle and purposeful – 3D flashcard flip, animated progress rings, gentle fade/slide (150–250ms, ease-out). Everything off under `prefers-reduced-motion`.

## Anti-slop rules

- No gradients-everywhere, glassmorphism, neon glows, random drop shadows.
- No emoji as icons, no stock illustrations, no decorative blobs.
- No hero sections, no centered-everything marketing layouts.
- No lorem ipsum, no generic copy ("Welcome to your learning journey!"). Microcopy is short, natural Czech.
- Consistent alignment & spacing rhythm; every screen has real empty and loading states.
- Visible focus rings, ≥44px touch targets, keyboard support (flashcards: Space = otočit, ←/→ = Neumím/Umím).
- Mobile-first (390px) and polished on desktop (1280px) – no stretched full-width text.

## Quality gate

Playwright screenshots of every screen at 390px and 1280px, light and dark, committed to `docs/screenshots/`. A separate design-critique pass reviews them against this brief before content is merged.
