# Design Brief

## Direction

Comb & Drip, Elevated — a black-hive interface whose every page sits on a prominent, realistic beveled gold honeycomb field with glossy honey dripping from the top edge and pooling along the bottom, matching the official Honey Do's logo exactly.

## Tone

Luxurious apiary craft: glossy, edible, and dimensional — real honey under warm light, executed with boutique-brand polish, never a flat or generic SaaS template.

## Differentiation

The logo is the design system: the same realistic glossy 3D honeybee and the same gold-framed amber honeycomb-with-honey-drips field appear on every page, so the whole app reads as one continuous extension of the badge. The comb tile is a real SVG hexagon with gold rims and amber gloss, not a line grid.

## Color Palette

| Token       | OKLCH             | Role                                          |
| ----------- | ----------------- | --------------------------------------------- |
| background  | `0.1 0.01 72`     | Near-black hive field (logo's #0A0805)        |
| foreground  | `0.955 0.024 92`  | Cream text, high contrast on black            |
| card        | `0.165 0.022 66`  | Warm chocolate card surface lifted off black  |
| primary     | `0.79 0.175 76`   | Saturated amber-gold — CTAs, active states    |
| accent      | `0.865 0.155 94`  | Metallic gold bevel / rim light, focus ring   |
| muted       | `0.205 0.024 68`  | Inset wells, secondary chips                  |
| success     | `0.63 0.14 140`   | Leaf green (logo's flower leaves) — done jobs |
| destructive | `0.585 0.19 30`   | Warm ember red — cancellations, errors        |

## Typography

- Display: Fraunces — hero wordmark echo, section headings, job titles; warm high-contrast serif echoing the logo's glossy script.
- Body: Figtree — UI labels, buttons, forms, body copy; friendly geometric sans with generous x-height.
- Mono: JetBrains Mono — job reference codes, timestamps, prices.
- Scale: hero `text-5xl md:text-7xl font-bold tracking-tight`, h2 `text-3xl md:text-5xl font-bold tracking-tight`, label `text-xs font-semibold tracking-[0.22em] uppercase`, body `text-base md:text-lg`.

## Elevation & Depth

Three warm layers — black honeycomb field, chocolate cards, raised glossy gold cells — with inset top highlights, beveled gold edges, and deep warm-black drop shadows instead of grey elevation.

## Structural Zones

| Zone    | Background                               | Border                   | Notes                                                     |
| ------- | ---------------------------------------- | ------------------------ | --------------------------------------------------------- |
| Header  | `bg-card/80` + backdrop blur over comb   | `border-b border-border` | Sticky; larger logo mark left, hex-clipped gold actions right |
| Content | `bg-background` + realistic comb + honey | —                        | Hero badge panel, then alternating `bg-muted/30` sections |
| Drips   | `.honey-drip` edge strips                | —                        | Glossy honey pools along hero + section bottoms           |
| Footer  | `bg-muted/40` + honeycomb grid           | `border-t border-border` | Hexagon bullet links, small logo bee ornament             |
| Sticky  | `bg-background/85` + blur                | `border-t border-border` | Mobile-only sticky primary CTA, safe-area padding         |

## Spacing & Rhythm

Mobile-first: `px-5 sm:px-8`, section gaps `py-14 md:py-20`, card padding `p-5 md:p-6`, micro-spacing on a 4px grid; hexagon tiles sized ≥ 96px for large touch targets.

## Component Patterns

- Buttons: pill/hex-clipped, glossy `honey-surface` gold gradient with inset highlight, dark chocolate label, hover lifts 2px with `shadow-honey-lg`, active presses down; secondary is an outlined gold-on-chocolate ghost.
- Cards: 18px radius (hex-clipped for service tiles), `honey-card-surface` chocolate gradient, 1px gold-tinted border, `shadow-card-warm`, soft gold glow on hover.
- Badges: hexagon-clipped chips and status pills — gold for active, leaf green for done, ember for cancelled; never a plain circle dot.

## Motion

- Entrance: `page-enter` 450ms translate+fade; staggered `hex-pop` on service tiles; `honey-seep` on drip edges.
- Hover: `transition-smooth` 300ms lift + glow; button shine sweep via `honey-shimmer`.
- Decorative: `bee-hover`/`bee-drift` on the 2–3 small realistic bees, `wing-shimmer` on bee wings, `float-soft` on the hero badge, `honey-drop` on success, `honey-glow` pulse on the primary CTA, `comb-glow`/`hive-breathe` breathing on the background field, `honey-drip-fall`/`honey-pool`/`honey-sheen` on honey drips and strands.

## Constraints

- Bees must match the logo bee ONLY: realistic glossy 3D, plump fuzzy dark/amber-banded body (#121212 / #F0B429), veined translucent warm-gray wings (#D9C08A), six legs, antennae, gold rim light — never cartoon, flat, or emoji.
- Background is honeycombs + honey on EVERY page: beveled gold-framed amber cells on near-black, with glossy honey drips; it stays behind content and never reduces text legibility.
- The body background and `.honeycomb-bg` are ONE contract — both use `--comb-tile` with identical layer order and `background-attachment: fixed`; edit them together or pages drift.
- Dark mode only — the hive is always lit warm; never render a light theme.
- Hexagons replace generic dots, bullets, dividers, and loaders, but never punctuation inside sentences.
- Never display the text "TANAE'S HOME REMEDY" anywhere in the app; branding is "Honey Do's" only.
- All color via semantic tokens; no raw hex or arbitrary Tailwind color values in components.

## Signature Detail

The logo-matched honeycomb field itself: a fixed, realistic beveled gold hexagon tile with amber gloss, a warm gold center bloom, glossy honey dripping from the top edge and pooling along the bottom of every page — the same material language as the badge, carried across the entire app, with the header and hero logo scaled up to lead it.
