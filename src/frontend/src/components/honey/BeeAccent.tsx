import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface BeeAccentProps {
  className?: string;
  /** Animation flavour: hovering in place or drifting across the surface. */
  motion?: "hover" | "drift";
  /** Accessible description; decorative bees are hidden from assistive tech. */
  label?: string;
}

/**
 * The Honey Do's bee — the single shared realistic, glossy 3D honeybee rendered
 * as layered SVG so it matches the logo exactly at any size. Plump fuzzy body
 * with alternating dark-brown and golden-amber bands, two pairs of elongated
 * semi-translucent pale-amber wings with fine dark veins and an iridescent rim,
 * thin dark segmented antennae, six dark jointed legs, a stinger, and a warm
 * gold rim light with strong specular highlights. Never cartoon, flat, or emoji.
 *
 * The artwork is drawn in a 120x96 viewBox with a soft radial "hive glow"
 * behind the body so the bee reads as a dimensional object rather than a flat
 * icon at every size it is used (hero badge, nav accent, crew cards, swarm).
 */
export function BeeAccent({
  className,
  motion = "hover",
  label,
}: BeeAccentProps) {
  const decorative = !label;
  return (
    <span
      className={cn(
        "pointer-events-none inline-block h-6 w-8 select-none",
        motion === "hover" ? "animate-bee-hover" : "animate-bee-drift",
        className,
      )}
      aria-hidden={decorative || undefined}
      role={decorative ? undefined : "img"}
      aria-label={label}
    >
      <svg
        viewBox="0 0 120 96"
        className="h-full w-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.65)]"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          {/* ---- Body shading ---- */}
          {/* Fuzzy banded abdomen: dark brown base with amber banding */}
          <linearGradient id="bee-abdomen" x1="0.1" y1="0" x2="0.2" y2="1">
            <stop offset="0%" stopColor="oklch(0.74 0.15 68)" />
            <stop offset="34%" stopColor="oklch(0.6 0.13 58)" />
            <stop offset="72%" stopColor="oklch(0.4 0.08 52)" />
            <stop offset="100%" stopColor="oklch(0.24 0.04 50)" />
          </linearGradient>
          {/* Golden-amber band highlight */}
          <linearGradient id="bee-band" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.94 0.14 94)" />
            <stop offset="48%" stopColor="oklch(0.82 0.17 82)" />
            <stop offset="100%" stopColor="oklch(0.6 0.14 62)" />
          </linearGradient>
          {/* Dark fuzzy thorax */}
          <radialGradient id="bee-thorax" cx="0.36" cy="0.28" r="0.9">
            <stop offset="0%" stopColor="oklch(0.56 0.1 64)" />
            <stop offset="52%" stopColor="oklch(0.32 0.055 56)" />
            <stop offset="100%" stopColor="oklch(0.16 0.02 52)" />
          </radialGradient>
          {/* Head */}
          <radialGradient id="bee-head" cx="0.34" cy="0.28" r="0.95">
            <stop offset="0%" stopColor="oklch(0.46 0.07 60)" />
            <stop offset="100%" stopColor="oklch(0.14 0.02 52)" />
          </radialGradient>
          {/* Semi-translucent pale-amber wing */}
          <linearGradient id="bee-wing" x1="0.1" y1="0" x2="0.9" y2="1">
            <stop offset="0%" stopColor="oklch(0.99 0.045 96 / 0.78)" />
            <stop offset="52%" stopColor="oklch(0.92 0.075 90 / 0.44)" />
            <stop offset="100%" stopColor="oklch(0.84 0.09 84 / 0.2)" />
          </linearGradient>
          {/* Iridescent rim light on the wing edge */}
          <linearGradient id="bee-wing-rim" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.99 0.06 96 / 0.95)" />
            <stop offset="46%" stopColor="oklch(0.88 0.12 88 / 0.55)" />
            <stop offset="100%" stopColor="oklch(0.74 0.13 300 / 0.4)" />
          </linearGradient>
          {/* Warm gold rim light wrapping the body */}
          <linearGradient id="bee-rim" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.97 0.13 96 / 0.98)" />
            <stop offset="42%" stopColor="oklch(0.84 0.15 82 / 0.4)" />
            <stop offset="100%" stopColor="oklch(0.6 0.12 66 / 0)" />
          </linearGradient>
          {/* Glossy specular highlight */}
          <radialGradient id="bee-spec" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="oklch(0.99 0.04 96 / 0.95)" />
            <stop offset="100%" stopColor="oklch(0.99 0.04 96 / 0)" />
          </radialGradient>
          {/* Soft hive glow behind the body for dimensional depth */}
          <radialGradient id="bee-halo" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="oklch(0.86 0.16 84 / 0.4)" />
            <stop offset="100%" stopColor="oklch(0.86 0.16 84 / 0)" />
          </radialGradient>
        </defs>

        {/* ---- Soft hive glow behind the body ---- */}
        <ellipse cx="62" cy="48" rx="52" ry="34" fill="url(#bee-halo)" />

        {/* ---- Wings (two pairs, behind the body) ---- */}
        <g>
          {/* far forewing */}
          <ellipse
            cx="66"
            cy="20"
            rx="27"
            ry="12"
            fill="url(#bee-wing)"
            stroke="url(#bee-wing-rim)"
            strokeWidth="1.3"
            transform="rotate(-26 66 20)"
          />
          {/* near forewing */}
          <ellipse
            cx="58"
            cy="25"
            rx="30"
            ry="13.5"
            fill="url(#bee-wing)"
            stroke="url(#bee-wing-rim)"
            strokeWidth="1.4"
            transform="rotate(-15 58 25)"
          />
          {/* hindwing */}
          <ellipse
            cx="74"
            cy="33"
            rx="19"
            ry="9"
            fill="url(#bee-wing)"
            stroke="url(#bee-wing-rim)"
            strokeWidth="1.1"
            transform="rotate(9 74 33)"
          />
          {/* fine dark-brown veins */}
          <g
            stroke="oklch(0.3 0.045 58 / 0.6)"
            strokeWidth="0.8"
            fill="none"
            strokeLinecap="round"
          >
            <path d="M38 30c10-8 23-12 39-12" />
            <path d="M43 33c12-4 25-5 38-4" />
            <path d="M50 36c10-1 21 0 31 3" />
            <path d="M60 27l8-8" />
            <path d="M68 30l9-5" />
            <path d="M63 38l10 3" />
            <path d="M78 30l7-3" />
          </g>
        </g>

        {/* ---- Six dark jointed legs ---- */}
        <g
          stroke="oklch(0.18 0.02 52)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          <path d="M42 52l-6 10-5 5" />
          <path d="M50 55l-3 11-4 6" />
          <path d="M59 55l3 11 5 6" />
          <path d="M68 52l7 9 6 4" />
          <path d="M37 47l-9 6-6 2" />
          <path d="M73 47l9 5 6 1" />
        </g>

        {/* ---- Abdomen: plump, banded, fuzzy ---- */}
        <ellipse cx="66" cy="45" rx="30" ry="19" fill="url(#bee-abdomen)" />
        {/* golden-amber bands */}
        <path
          d="M51 28.5c-4.6 9.6-4.6 22.4 0 32"
          stroke="url(#bee-band)"
          strokeWidth="6.6"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M66 26c-4 11-4 26 0 37"
          stroke="url(#bee-band)"
          strokeWidth="6.6"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M81 29.5c-3.2 9.4-3.2 21.6 0 31"
          stroke="url(#bee-band)"
          strokeWidth="5.6"
          strokeLinecap="round"
          fill="none"
        />
        {/* fuzzy edge hairs */}
        <g
          stroke="oklch(0.88 0.13 88 / 0.55)"
          strokeWidth="1"
          strokeLinecap="round"
        >
          <path d="M94 37l5-2.5" />
          <path d="M96 45l5 0" />
          <path d="M94 53l5 2.5" />
          <path d="M38 40l-5-2.5" />
          <path d="M36 48l-5 0" />
          <path d="M38 56l-5 2.5" />
        </g>
        {/* warm gold rim light along the top of the abdomen */}
        <path
          d="M38 40c8-10 23-14 38-11"
          stroke="url(#bee-rim)"
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />
        {/* glossy specular highlights */}
        <ellipse cx="58" cy="36" rx="12" ry="5.6" fill="url(#bee-spec)" />
        <ellipse cx="82" cy="42" rx="5" ry="3" fill="url(#bee-spec)" />

        {/* ---- Thorax + head ---- */}
        <circle cx="33" cy="43" r="14" fill="url(#bee-thorax)" />
        <circle cx="19" cy="40" r="9.4" fill="url(#bee-head)" />
        {/* fuzzy thorax highlight */}
        <ellipse cx="30" cy="37" rx="7" ry="3.8" fill="url(#bee-spec)" />
        {/* compound eye */}
        <ellipse
          cx="16"
          cy="38"
          rx="3.9"
          ry="4.8"
          fill="oklch(0.1 0.01 52)"
          transform="rotate(-12 16 38)"
        />
        <ellipse cx="14.6" cy="36.2" rx="1.4" ry="1.8" fill="url(#bee-spec)" />

        {/* ---- Thin dark segmented antennae ---- */}
        <g
          stroke="oklch(0.16 0.02 52)"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        >
          <path d="M14 32c-3-5-6.4-8-10.6-9.6" />
          <path d="M16.5 30.5c-1.6-5.4-3.8-9-7-11.2" />
        </g>
        <circle cx="3" cy="21.6" r="1.9" fill="oklch(0.18 0.02 52)" />
        <circle cx="9" cy="18.6" r="1.9" fill="oklch(0.18 0.02 52)" />

        {/* ---- Stinger ---- */}
        <path d="M95 45l9 2.4-9 2.4z" fill="oklch(0.16 0.02 52)" />
      </svg>
    </span>
  );
}

interface HexBulletProps {
  className?: string;
  children?: ReactNode;
}

/** Hexagon bullet that replaces generic list dots and dividers. */
export function HexBullet({ className, children }: HexBulletProps) {
  return (
    <span
      className={cn(
        "hex-clip inline-block size-2.5 shrink-0 bg-primary/80",
        className,
      )}
      aria-hidden="true"
    >
      {children}
    </span>
  );
}

interface HexDividerProps {
  className?: string;
}

/** Hexagon-centred divider that replaces generic horizontal rules. */
export function HexDivider({ className }: HexDividerProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("flex items-center justify-center gap-3", className)}
    >
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-primary/40" />
      <span className="hex-clip size-2.5 bg-primary/70" />
      <span className="hex-clip size-1.5 bg-primary/40" />
      <span className="hex-clip size-2.5 bg-primary/70" />
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-primary/40" />
    </div>
  );
}
