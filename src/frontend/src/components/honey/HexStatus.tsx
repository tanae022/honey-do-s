import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface HexStatusProps {
  label: string;
  /** Tailwind classes controlling the chip colour treatment. */
  toneClass?: string;
  className?: string;
  "data-ocid"?: string;
}

/**
 * Hexagon-clipped status chip. Replaces the generic coloured dot used for job
 * lifecycle states.
 */
export function HexStatus({
  label,
  toneClass,
  className,
  "data-ocid": dataOcid,
}: HexStatusProps) {
  return (
    <span
      data-ocid={dataOcid}
      className={cn(
        "text-outline-black inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em]",
        toneClass ?? "border-primary/50 bg-primary/15 text-primary",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="hex-clip size-2.5 shrink-0 bg-current"
      />
      {label}
    </span>
  );
}

interface HexStatusTimelineProps {
  /** Ordered lifecycle labels, one per hexagon. */
  steps: string[];
  /** Zero-based index of the current step; earlier steps read as done. */
  currentIndex: number;
  className?: string;
  "data-ocid"?: string;
}

/**
 * Honeycomb lifecycle indicator. Each stage is a hexagon joined by a comb
 * connector; completed stages fill with honey gold and show a check.
 */
export function HexStatusTimeline({
  steps,
  currentIndex,
  className,
  "data-ocid": dataOcid,
}: HexStatusTimelineProps) {
  return (
    <ol
      data-ocid={dataOcid}
      className={cn("flex w-full items-start", className)}
    >
      {steps.map((step, index) => {
        const done = index < currentIndex;
        const active = index === currentIndex;
        const reached = done || active;
        return (
          <li
            key={step}
            className="flex min-w-0 flex-1 flex-col items-center gap-2"
          >
            <div className="flex w-full items-center">
              <span
                aria-hidden="true"
                className={cn(
                  "h-px flex-1",
                  index === 0
                    ? "bg-transparent"
                    : done || active
                      ? "bg-primary/60"
                      : "bg-border",
                )}
              />
              <span
                className={cn(
                  "hex-clip flex size-9 shrink-0 items-center justify-center border text-[0.7rem] font-bold transition-smooth",
                  reached
                    ? "border-primary/60 bg-primary/25 text-primary"
                    : "border-border bg-muted/40 text-muted-foreground",
                  active && "glow-honey scale-110",
                )}
              >
                {done ? (
                  <Check className="size-4" strokeWidth={3} />
                ) : (
                  <span>{index + 1}</span>
                )}
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  "h-px flex-1",
                  index === steps.length - 1
                    ? "bg-transparent"
                    : done
                      ? "bg-primary/60"
                      : "bg-border",
                )}
              />
            </div>
            <span
              className={cn(
                "text-outline-black text-center text-[0.65rem] font-semibold uppercase leading-tight tracking-[0.1em]",
                active
                  ? "text-primary"
                  : done
                    ? "text-foreground/80"
                    : "text-muted-foreground",
              )}
            >
              {step}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
