import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

interface HoneyCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Adds a soft gold glow on hover for interactive cards. */
  interactive?: boolean;
  /** Renders a faint honeycomb texture behind the content. */
  textured?: boolean;
}

/**
 * Warm chocolate card with a gold-tinted border, honeycomb texture and a soft
 * warm shadow. The base surface for every content block in the app.
 */
export function HoneyCard({
  children,
  className,
  interactive = false,
  textured = true,
  ...props
}: HoneyCardProps) {
  return (
    <div
      className={cn(
        "honey-card-surface relative overflow-hidden rounded-2xl border border-border/80 p-5 md:p-6",
        textured && "honeycomb-texture",
        interactive &&
          "transition-smooth hover:-translate-y-1 hover:border-primary/50 hover:shadow-hex-glow",
        className,
      )}
      {...props}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}

interface HoneyCardHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function HoneyCardHeader({
  title,
  description,
  action,
  className,
}: HoneyCardHeaderProps) {
  return (
    <div
      className={cn("mb-4 flex items-start justify-between gap-3", className)}
    >
      <div className="min-w-0">
        <h3 className="text-outline-black-strong font-display text-lg font-semibold leading-tight text-foreground">
          {title}
        </h3>
        {description && (
          <p className="text-outline-black mt-1 text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
