import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

interface AdminCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Renders the card on the alternate (slightly tinted) surface. */
  alt?: boolean;
}

/**
 * White admin card: the primary information container on the light admin
 * ground. Solid white, a thin neutral border and a soft shadow — never a
 * decorative background behind admin information.
 */
export function AdminCard({
  children,
  className,
  alt = false,
  ...props
}: AdminCardProps) {
  return (
    <div
      className={cn(
        "admin-card p-5 sm:p-6",
        alt && "admin-card-alt",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface AdminCardHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function AdminCardHeader({
  title,
  description,
  action,
  className,
}: AdminCardHeaderProps) {
  return (
    <div
      className={cn(
        "mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0">
        <h2 className="text-lg font-bold leading-tight text-[oklch(var(--admin-foreground))]">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm text-[oklch(var(--admin-muted-foreground))]">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
