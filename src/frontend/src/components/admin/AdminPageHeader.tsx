import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  /** Optional eyebrow label above the title. */
  eyebrow?: string;
  /** Primary/secondary actions rendered on the right on wide screens. */
  actions?: ReactNode;
  className?: string;
}

/**
 * The shared page header for every admin page: a large readable title, an
 * optional description and a right-aligned action cluster that stacks cleanly
 * on phone widths.
 */
export function AdminPageHeader({
  title,
  description,
  eyebrow,
  actions,
  className,
}: AdminPageHeaderProps) {
  return (
    <header
      data-ocid="admin.page_header"
      className={cn(
        "mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0">
        {eyebrow && (
          <span className="admin-label block text-[oklch(var(--admin-primary))]">
            {eyebrow}
          </span>
        )}
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[oklch(var(--admin-foreground))] sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-base text-[oklch(var(--admin-muted-foreground))]">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          {actions}
        </div>
      )}
    </header>
  );
}
