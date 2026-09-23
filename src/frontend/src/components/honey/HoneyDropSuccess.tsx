import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { BeeAccent } from "./BeeAccent";

interface HoneyDropSuccessProps {
  title: string;
  message?: string;
  className?: string;
  "data-ocid"?: string;
}

/**
 * Honey-drop success animation: a gold hexagon seal with a dripping honey
 * edge, a check mark, and a small bee celebrating beside it.
 */
export function HoneyDropSuccess({
  title,
  message,
  className,
  "data-ocid": dataOcid,
}: HoneyDropSuccessProps) {
  return (
    <output
      data-ocid={dataOcid}
      aria-live="polite"
      className={cn(
        "flex flex-col items-center gap-4 py-8 text-center",
        className,
      )}
    >
      <div className="relative">
        <span
          aria-hidden="true"
          className="hex-clip block size-24 animate-honey-drop bg-gradient-to-b from-accent to-primary shadow-honey-lg"
        />
        <span
          aria-hidden="true"
          className="hex-clip absolute inset-[5px] flex items-center justify-center bg-gradient-to-b from-primary/40 to-card"
        >
          <Check className="size-10 text-accent" strokeWidth={3} />
        </span>
        <BeeAccent
          motion="drift"
          className="absolute -right-8 -top-3 h-7 w-9"
        />
      </div>
      <div className="space-y-1">
        <h3 className="text-outline-black-strong font-display text-2xl font-bold text-gold-gradient">
          {title}
        </h3>
        {message && (
          <p className="text-outline-black mx-auto max-w-sm text-sm text-muted-foreground">
            {message}
          </p>
        )}
      </div>
    </output>
  );
}
