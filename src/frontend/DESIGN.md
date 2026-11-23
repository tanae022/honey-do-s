# Design Brief

## Direction

Honey Do's — a premium dark home-services management platform built on a black hive, chocolate panels, and metallic gold accents.

## Tone

Luxury/refined executed with conviction: warm dark chocolate surfaces, restrained gold, and calm solid ground for data — never busy or generic.

## Differentiation

A living dimensional honeycomb hive frames the app, while customer information sits on solid, gold-hairlined chocolate panels — the brand's signature texture stays at the edges and out of the data.

## Color Palette

| Token      | OKLCH         | Role                                            |
| ---------- | ------------- | ----------------------------------------------- |
| background | 0.1 0.01 72   | Near-black warm hive base                        |
| foreground | 0.972 0.018 92| Warm ivory body text (AA+ on chocolate)          |
| card       | 0.185 0.024 66| Solid dark chocolate card surface                |
| primary    | 0.79 0.175 76 | Amber-gold primary actions (logo honeycomb)      |
| accent     | 0.865 0.155 94| Bright metallic gold highlights + focus rings    |
| muted      | 0.225 0.026 68| Inset wells, stat tiles, secondary text          |
| panel      | 0.2 0.026 66  | Solid customer-info panel (occludes the comb)    |

## Typography

- Display: Fraunces — serif headings, customer names, hero type
- Body: Figtree — UI labels, body copy, form text
- Mono: JetBrains Mono — numbers, quote line items, IDs
- Scale: hero `text-5xl md:text-7xl font-bold tracking-tight`, h2 `text-3xl md:text-5xl font-bold tracking-tight`, label `text-sm font-semibold tracking-widest uppercase`, body `text-base`

## Elevation & Depth

Solid chocolate panels (`.honey-panel`, `.honey-panel-raised`) with gold hairline borders and inset top highlights replace pattern-behind-data; the living comb lives only in the fixed background layer.

## Structural Zones

| Zone    | Background                    | Border                    | Notes                                             |
| ------- | ----------------------------- | ------------------------- | ------------------------------------------------- |
| Header  | `bg-card` chocolate           | `border-b` gold hairline  | Honeycomb logo, gold nav links, notification bell |
| Content | `bg-background` comb field    | —                         | Customer data on solid `.honey-panel` surfaces    |
| Footer  | `bg-muted/40` chocolate       | `border-t` gold hairline  | Owner phone, honey-drip top edge                  |

## Spacing & Rhythm

Generous section gaps (`space-y-8`), grouped info rows with `gap-3` and gold-hairline dividers, comfortable mobile tap targets (min 44px), and `p-5`/`p-6` panel padding.

## Component Patterns

- Buttons: `rounded-lg`, glossy honey gradient for primary, gold-outlined chocolate for secondary, gold focus ring
- Cards: `rounded-lg` solid chocolate `.honey-panel` with gold hairline; raised variant for nested tiles
- Badges: pill status chips (active green, paused gold, archived grey) on tinted gold-rimmed fills

## Motion

- Entrance: `page-enter` fade-up 0.45s, `row-enter` stagger for lists, `hex-pop` for badges
- Hover: `transition-smooth` all 0.3s; rows lift to a brighter honey-warmed surface
- Decorative: living comb planes (`comb-drift*`), `hive-breathe`, `honey-sheen`, `honey-drip-fall` — all gated by `motion-safe:`

## Constraints

- Preserve the black/chocolate/amber/gold identity, honeycomb logo, and all pinned selectors (`.honeycomb-bg`, `.honey-drip`, outline tiers, `.form-field`)
- Honeycomb pattern must never sit behind customer information — solid panels only
- Bright gold is reserved for accents and key highlights; body text stays warm ivory at AA+ contrast
- Form fields keep the `.form-field` readability contract (bright text, light placeholder, black outline)
- Decorative animation gated with `motion-safe:` to honor `prefers-reduced-motion`

## Signature Detail

The solid gold-hairlined chocolate panel that cleanly occludes the living hive — data on calm ground, brand texture at the edges (surface treatment).
