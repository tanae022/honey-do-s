# Design Brief

## Direction

Comb & Drip, Alive — a black-hive interface whose every page sits on a living, dimensional beveled gold honeycomb field: three parallax depth planes of glossy amber cells with honey seeping through them, glossy honey dripping from the top edge and pooling along the bottom, matching the official Honey Do's logo. Every light glyph is black-outlined so it reads crisply over the moving comb.

## Tone

Luxurious apiary craft: glossy, edible, and dimensional — real honey under warm light, executed with boutique-brand polish, never a flat or generic SaaS template.

## Differentiation

The logo is the design system, now with real depth: the same realistic glossy 3D honeybee and the same gold-framed amber honeycomb-with-honey-drips field appear on every page, and the comb itself is a living scene — three beveled SVG depth planes drifting at different speeds under a slow breathing glow with honey glossing through the cells. Every piece of light text carries a black outline, so the hive can be bold without ever costing legibility.

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
| notification | `0.72 0.19 44`   | Coral-amber "new activity" alert dot + bell   |
| customer    | `0.195 0.028 68`  | Customer directory row surface (warm chocolate) |
| status-active | `0.7 0.16 150`  | Customer lifecycle: active (leaf green)       |
| status-paused | `0.8 0.14 88`   | Customer lifecycle: paused (honey gold)       |
| status-archived | `0.56 0.02 72` | Customer lifecycle: archived (warm grey)      |

## Typography

- Display: Fraunces — hero wordmark echo, section headings, job titles; warm high-contrast serif echoing the logo's glossy script.
- Body: Figtree — UI labels, buttons, forms, body copy; friendly geometric sans with generous x-height.
- Mono: JetBrains Mono — job reference codes, timestamps, prices.
- Scale: hero `text-5xl md:text-7xl font-bold tracking-tight`, h2 `text-3xl md:text-5xl font-bold tracking-tight`, label `text-xs font-semibold tracking-[0.22em] uppercase`, body `text-base md:text-lg`.

## Text Outline System

Black stroke on every light glyph, drawn behind the fill via `paint-order: stroke fill`. Widths are tokens so tiers stay consistent.

| Tier | Selector / utility              | Width token        | Applies to                                   |
| ---- | ------------------------------- | ------------------ | -------------------------------------------- |
| 1    | `body, body *` / `.text-outline-black` | `--outline-body` 0.6px    | All body copy, labels, buttons, inputs       |
| 2    | `h1–h6` / `.text-outline-black-strong` | `--outline-heading` 0.9px | Headings, large numerals                     |
| 3    | `.text-display`, `h1` / `.text-outline-black-display` | `--outline-display` 1.35px | Hero/display type + soft black halo |
| 4    | `.text-outline-black-imagery`   | `--outline-imagery` 1.6px  | Text over busy imagery/photos + doubled halo |

- All tiers use `--outline-color: oklch(0.05 0.01 64)`; halo is `--outline-halo`.
- Never remove `.text-outline-black` / `.text-outline-black-strong` or the `body, body *` rule — tests pin them.

## Living 3D Honeycomb

Three real beveled SVG depth planes (not a line grid) stacked far → mid → near inside the fixed `.honeycomb-bg` layer, over the body background. Each cell has a gold rim, amber gloss gradient, inner shadow well and a specular highlight.

| Plane | Utility             | Tile size  | Opacity | Drift (animation)          | Character                         |
| ----- | ------------------- | ---------- | ------- | -------------------------- | --------------------------------- |
| Far   | `.comb-plane-far`   | 52×90px    | 0.55    | `comb-drift-far` 68s       | Dim distant hive wall, thin rims  |
| Mid   | `.comb-plane-mid`   | 104×180px  | 0.70    | `comb-drift` 48s           | Workhorse field, beveled gold rim |
| Near  | `.comb-plane-near`  | 208×360px  | 0.50    | `comb-drift-near` 34s      | Bright foreground caps, hot glint |
| Glow  | `.comb-breathe`     | full bleed | —       | `hive-breathe` 9s          | Warm amber light falloff pulse    |
| Sheen | `.comb-honey-sheen` | full bleed | —       | `honey-sheen` 14s          | Honey glossing through the cells  |

## Elevation & Depth

Three warm layers — black honeycomb field, chocolate cards, raised glossy gold cells — with inset top highlights, beveled gold edges, and deep warm-black drop shadows instead of grey elevation. The comb adds a fourth: parallax depth planes separating the hive wall from the foreground caps.

## Admin Light Surface System

The private admin side is a second, deliberately different surface language: light, clean, high-contrast professional home-service software. It fully occludes the honeycomb, disables the black text outline, and uses large readable type. Tokens are theme-independent (`--admin-*`, declared once, never in `.dark`).

| Token | OKLCH | Role |
| ----- | ----- | ---- |
| admin-bg | `0.975 0.004 90` | Admin page ground (near-white, no comb) |
| admin-surface | `1 0 0` | White cards and tables |
| admin-surface-alt | `0.965 0.006 90` | Table header / hover rows |
| admin-foreground | `0.2 0.012 260` | Dark readable admin text |
| admin-muted-foreground | `0.46 0.014 260` | Labels and secondary text |
| admin-border | `0.88 0.008 260` | Card and table dividers |
| admin-border-strong | `0.74 0.012 260` | Input outlines, table header rule |
| admin-primary | `0.52 0.16 250` | Admin primary buttons / focus |
| admin-accent | `0.72 0.16 68` | Honey-gold accent, ties admin to brand |

| Utility | Treatment |
| ------- | --------- |
| `.admin-shell` | Solid light ground, no comb, black text outline disabled |
| `.admin-card` / `.admin-card-alt` | White / off-white card, 0.75rem radius, `shadow-admin` |
| `.admin-table` | Simple table: large rows, clear dividers, uppercase headers, no horizontal scroll |
| `.admin-btn` / `.admin-btn-secondary` | Large (2.75rem min) tap targets, primary blue / outlined secondary |
| `.admin-field` | Light input, dark text, 2.75rem min height, visible focus ring |
| `.admin-label` | Uppercase section label, 0.8125rem, never tiny |
| `.admin-status-*` | Obvious status badges (see below) |

## Admin Status Colors

Nine obvious, label-first status badges — solid fill, white or dark text, uppercase, never a bare dot.

| Status | Token | OKLCH | Reads as |
| ------ | ----- | ----- | -------- |
| NEW | admin-status-new | `0.55 0.19 255` | Bright blue — just arrived |
| WAITING | admin-status-waiting | `0.62 0.13 62` | Amber — waiting on someone |
| ACTION REQUIRED | admin-status-action | `0.58 0.2 32` | Red-orange — do it now |
| APPROVED | admin-status-approved | `0.56 0.14 195` | Cyan — approved |
| PAID | admin-status-paid | `0.5 0.13 155` | Green — money in |
| CONFIRMED | admin-status-confirmed | `0.5 0.15 172` | Teal — appointment set |
| IN PROGRESS | admin-status-progress | `0.6 0.16 85` | Gold — work underway |
| COMPLETED | admin-status-completed | `0.46 0.1 150` | Deep green — done |
| CANCELLED | admin-status-cancelled | `0.5 0.02 260` | Slate grey — void |

## Structural Zones

| Zone    | Background                               | Border                   | Notes                                                     |
| ------- | ---------------------------------------- | ------------------------ | --------------------------------------------------------- |
| Header  | `bg-card/80` + backdrop blur over comb   | `border-b border-border` | Sticky; larger logo mark left, hex-clipped gold actions right |
| Content | `bg-background` + living 3D comb + honey | —                        | Hero badge panel, then alternating `bg-muted/30` sections |
| Drips   | `.honey-drip` edge strips                | —                        | Glossy honey pools along hero + section bottoms           |
| Footer  | `bg-muted/40` + honeycomb grid           | `border-t border-border` | Hexagon bullet links, small logo bee ornament             |
| Sticky  | `bg-background/85` + blur                | `border-t border-border` | Mobile-only sticky primary CTA, safe-area padding         |
| Admin console | `.admin-shell` light ground, white `.admin-card` panels | `admin-border` | Admin-only; light professional surfaces, no comb behind data |

## Admin CRM Layer

Admin-only surfaces (customer database, profiles, notifications, search) extend the hive without new colors — they reuse the chocolate/honey material language.

| Element | Utility | Treatment |
| ------- | ------- | --------- |
| Directory row | `.crm-row` | Warm chocolate gradient, gold-tinted inset edge, lifts to honey-warmed surface on hover/focus |
| Customer avatar | `.crm-avatar` + `.hex-clip` | Hex-clipped glossy amber cell carrying initials |
| Notification bell badge | `.notification-badge` | Coral-amber alert dot with soft halo; `notification-pulse` 2.4s |
| Notification popover | `.notification-panel` | Chocolate gradient panel, deep warm shadow |
| Search field | `.search-field` | Inset honey well; gold `--glow-honey` rim on `:focus-within` |
| Status chips | `.status-chip-active/paused/archived` | Tinted pills per lifecycle status |
| Profile stat tile | `.crm-stat` | Inset honey well for counts, dates, job totals |

- New tokens: `--notification`, `--customer`, `--customer-hover`, `--status-active/paused/archived` (+ foregrounds); gradients `--gradient-customer`, `--gradient-notification`.
- New motion: `notification-pulse` (bell), `badge-pop` (count badge), `row-enter` (directory rows); all gated by `prefers-reduced-motion`.
- New shadows: `shadow-crm-row`, `shadow-notification`.
- CRM surfaces stay on the same comb background contract — never a flat panel.

## Spacing & Rhythm

Mobile-first: `px-5 sm:px-8`, section gaps `py-14 md:py-20`, card padding `p-5 md:p-6`, micro-spacing on a 4px grid; hexagon tiles sized ≥ 96px for large touch targets.

## Component Patterns

- Buttons: pill/hex-clipped, glossy `honey-surface` gold gradient with inset highlight, dark chocolate label, hover lifts 2px with `shadow-honey-lg`, active presses down; secondary is an outlined gold-on-chocolate ghost.
- Cards: 18px radius (hex-clipped for service tiles), `honey-card-surface` chocolate gradient, 1px gold-tinted border, `shadow-card-warm`, soft gold glow on hover.
- Badges: hexagon-clipped chips and status pills — gold for active, leaf green for done, ember for cancelled, coral for new activity; never a plain circle dot.

## Motion

- Entrance: `page-enter` 450ms translate+fade; staggered `hex-pop` on service tiles; `honey-seep` on drip edges; `row-enter` on directory rows.
- Hover: `transition-smooth` 300ms lift + glow; button shine sweep via `honey-shimmer`.
- Living hive: `comb-drift-far` 68s, `comb-drift` 48s, `comb-drift-near` 34s parallax drift; `hive-breathe` 9s breathing glow; `honey-sheen` 14s gloss sweep through the cells.
- Decorative: `bee-hover`/`bee-drift` on the 2–3 small realistic bees, `wing-shimmer` on bee wings, `float-soft` on the hero badge, `honey-drop` on success, `honey-glow` pulse on the primary CTA, `notification-pulse`/`badge-pop` on the admin bell.

## Constraints

- Bees must match the logo bee ONLY: realistic glossy 3D, plump fuzzy dark/amber-banded body (#121212 / #F0B429), veined translucent warm-gray wings (#D9C08A), six legs, antennae, gold rim light — never cartoon, flat, or emoji.
- Background is honeycombs + honey on EVERY page: beveled gold-framed amber cells on near-black, with glossy honey drips; it stays behind content and never reduces text legibility.
- The body background and `.honeycomb-bg` are ONE contract — both use `--comb-tile` with identical layer order and `background-attachment: fixed`; edit them together or pages drift.
- Living comb is CSS/SVG only — transforms, gradients, background-position drift; no WebGL/three.js/canvas.
- `prefers-reduced-motion: reduce` freezes all comb drift, breathe, sheen, and the notification pulse to a still dimensional field.
- Preserve pinned selectors/classes: `.honeycomb-bg`, `.honey-drip`, `.text-outline-black`, `.text-outline-black-strong`, `.honeycomb-texture`, `.hex-clip`.
- Dark mode only — the hive is always lit warm; never render a light theme. The sole exception is the private admin shell (`.admin-shell`), which is always light, high-contrast and comb-free.
- Admin readability is a hard constraint: large readable text (≥1rem body, ≥0.8125rem labels), strong contrast, white cards, simple tables, large tap targets, consistent spacing, no tiny text, no overlapping panels, no horizontal scrolling, no decorative background behind information.
- Admin surfaces never render the honeycomb or the black text outline; the customer-facing side keeps both unchanged.
- Hexagons replace generic dots, bullets, dividers, and loaders, but never punctuation inside sentences.
- Never display the text "TANAE'S HOME REMEDY" anywhere in the app; branding is "Honey Do's" only.
- All color via semantic tokens; no raw hex or arbitrary Tailwind color values in components.
- CRM is admin-only; no customer self-service portal and no automated follow-up campaigns are designed here.

## Signature Detail

The living 3D honeycomb field itself: three parallax planes of realistic beveled gold hexagon cells with amber gloss, specular glints and inner-shadow wells, honey glossing through the cells under a slow breathing glow, glossy honey dripping from the top edge and pooling along the bottom of every page — the same material language as the badge, now with real depth, carried across the entire app.
