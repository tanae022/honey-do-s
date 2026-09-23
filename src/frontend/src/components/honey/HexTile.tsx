import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface HexTileProps {
  label: string;
  blurb?: string;
  icon: ReactNode;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
  /** Deterministic test marker for the tile. */
  "data-ocid"?: string;
}

/**
 * Hexagon-clipped service tile with a beveled gold frame, honeycomb-lit inner
 * surface, line-art icon and label. Sized for a comfortable mobile touch
 * target (>= 96px) with a soft glow on hover.
 */
export function HexTile({
  label,
  blurb,
  icon,
  selected = false,
  onClick,
  className,
  "data-ocid": dataOcid,
}: HexTileProps) {
  const interactive = typeof onClick === "function";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!interactive}
      aria-pressed={interactive ? selected : undefined}
      data-ocid={dataOcid}
      className={cn(
        "group relative flex aspect-square w-full min-h-24 flex-col items-center justify-center gap-1.5 p-2 text-center transition-smooth",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        interactive && "cursor-pointer hover:-translate-y-1",
        !interactive && "cursor-default",
        className,
      )}
    >
      {/* hexagon frame — beveled gold edge */}
      <span
        aria-hidden="true"
        className={cn(
          "hex-clip absolute inset-0 transition-smooth",
          selected
            ? "bg-gradient-to-b from-accent to-primary shadow-hex-glow"
            : "bg-gradient-to-b from-primary/55 via-primary/25 to-primary/10 group-hover:from-accent group-hover:to-primary/40 group-hover:shadow-hex-glow",
        )}
      />
      {/* hexagon inner surface — warm chocolate with honeycomb sheen */}
      <span
        aria-hidden="true"
        className={cn(
          "hex-clip absolute inset-[3px] transition-smooth",
          selected
            ? "bg-gradient-to-b from-primary/40 to-card"
            : "bg-gradient-to-b from-card to-background group-hover:from-secondary",
        )}
      />
      {/* honeycomb texture inside the cell */}
      <span
        aria-hidden="true"
        className="hex-clip honeycomb-texture absolute inset-[3px] opacity-70"
      />
      {/* top gloss highlight */}
      <span
        aria-hidden="true"
        className="hex-clip absolute inset-x-[18%] top-[6%] h-[22%] bg-gradient-to-b from-foreground/10 to-transparent"
      />

      <span className="relative z-10 flex flex-col items-center gap-1.5 px-1">
        <span
          className={cn(
            "flex size-10 items-center justify-center transition-smooth md:size-11",
            selected
              ? "text-accent-foreground"
              : "text-primary group-hover:scale-110 group-hover:text-accent",
          )}
        >
          {icon}
        </span>
        <span className="text-outline-black text-[0.7rem] font-semibold uppercase leading-tight tracking-[0.12em] text-foreground md:text-xs">
          {label}
        </span>
        {blurb && (
          <span className="text-outline-black hidden text-[0.65rem] leading-snug text-muted-foreground sm:block">
            {blurb}
          </span>
        )}
      </span>
    </button>
  );
}
