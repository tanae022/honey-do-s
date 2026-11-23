import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface AdminStatCardProps {
  label: string;
  value: string;
  /** Optional supporting line under the value. */
  hint?: string;
  icon?: ReactNode;
  className?: string;
  "data-ocid"?: string;
}

/**
 * A single large, readable statistic on a white card. The value is the focal
 * point; the label is a clear uppercase caption. Sized for a comfortable
 * two-up grid on phone and a wider row on desktop.
 */
export function AdminStatCard({
  label,
  value,
  hint,
  icon,
  className,
  ...rest
}: AdminStatCardProps) {
  return (
    <div className={cn("admin-card p-4 sm:p-5", className)} {...rest}>
      <div className="flex items-center justify-between gap-2">
        <span className="admin-label">{label}</span>
        {icon && (
          <span
            aria-hidden="true"
            className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[oklch(var(--admin-surface-alt))] text-[oklch(var(--admin-primary))]"
          >
            {icon}
          </span>
        )}
      </div>
      <p className="mt-2 font-mono text-2xl font-bold tracking-tight text-[oklch(var(--admin-foreground))] sm:text-3xl">
        {value}
      </p>
      {hint && (
        <p className="mt-1 text-sm text-[oklch(var(--admin-muted-foreground))]">
          {hint}
        </p>
      )}
    </div>
  );
}
