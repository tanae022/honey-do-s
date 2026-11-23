import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface AdminEmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  /** Optional primary action. */
  action?: ReactNode;
  className?: string;
  "data-ocid"?: string;
}

/**
 * A helpful empty state: a visual, a headline and an optional next step. Used
 * wherever an admin list or table has no rows yet.
 */
export function AdminEmptyState({
  title,
  description,
  icon,
  action,
  className,
  ...rest
}: AdminEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[oklch(var(--admin-border-strong))] bg-[oklch(var(--admin-surface-alt))] px-6 py-12 text-center",
        className,
      )}
      {...rest}
    >
      {icon && (
        <span
          aria-hidden="true"
          className="flex size-12 items-center justify-center rounded-full bg-[oklch(var(--admin-surface))] text-[oklch(var(--admin-primary))] shadow-admin"
        >
          {icon}
        </span>
      )}
      <h3 className="text-lg font-bold text-[oklch(var(--admin-foreground))]">
        {title}
      </h3>
      {description && (
        <p className="max-w-md text-base text-[oklch(var(--admin-muted-foreground))]">
          {description}
        </p>
      )}
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
