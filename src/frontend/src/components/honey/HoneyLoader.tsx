import { cn } from "@/lib/utils";

interface HoneyLoaderProps {
  label?: string;
  className?: string;
  "data-ocid"?: string;
}

const HEX_CELLS = [
  { id: "hex-a", delay: "0ms" },
  { id: "hex-b", delay: "140ms" },
  { id: "hex-c", delay: "280ms" },
  { id: "hex-d", delay: "420ms" },
  { id: "hex-e", delay: "560ms" },
  { id: "hex-f", delay: "700ms" },
  { id: "hex-g", delay: "840ms" },
];

/**
 * Honeycomb loading indicator — a cluster of hexagons that pulse in sequence
 * instead of a generic spinner.
 */
export function HoneyLoader({
  label = "Loading",
  className,
  "data-ocid": dataOcid,
}: HoneyLoaderProps) {
  return (
    <output
      data-ocid={dataOcid}
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-10",
        className,
      )}
    >
      <div className="flex items-center gap-1.5">
        {HEX_CELLS.map((cell) => (
          <span
            key={cell.id}
            aria-hidden="true"
            className="hex-clip size-3 animate-honey-glow bg-primary"
            style={{ animationDelay: cell.delay }}
          />
        ))}
      </div>
      <span className="text-outline-black text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </span>
    </output>
  );
}
