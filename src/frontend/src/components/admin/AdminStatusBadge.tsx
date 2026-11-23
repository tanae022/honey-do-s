import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/** The nine obvious admin statuses, each with its own high-contrast color. */
export type AdminStatusTone =
  | "new"
  | "waiting"
  | "action"
  | "approved"
  | "paid"
  | "confirmed"
  | "progress"
  | "completed"
  | "cancelled";

const TONE_CLASS: Record<AdminStatusTone, string> = {
  new: "admin-status-new",
  waiting: "admin-status-waiting",
  action: "admin-status-action",
  approved: "admin-status-approved",
  paid: "admin-status-paid",
  confirmed: "admin-status-confirmed",
  progress: "admin-status-progress",
  completed: "admin-status-completed",
  cancelled: "admin-status-cancelled",
};

interface AdminStatusBadgeProps {
  tone: AdminStatusTone;
  label: string;
  /** Optional leading dot for extra scannability. */
  dot?: boolean;
  className?: string;
  "data-ocid"?: string;
}

/**
 * Pill-shaped status badge with an obvious, high-contrast color and an
 * uppercase label. Large enough to read at a glance on phone and desktop.
 */
export function AdminStatusBadge({
  tone,
  label,
  dot = false,
  className,
  ...rest
}: AdminStatusBadgeProps) {
  return (
    <span className={cn("admin-status", TONE_CLASS[tone], className)} {...rest}>
      {dot && (
        <span
          aria-hidden="true"
          className="size-1.5 rounded-full bg-current opacity-80"
        />
      )}
      {label}
    </span>
  );
}

/** A small neutral chip for secondary metadata (counts, categories). */
export function AdminChip({
  children,
  className,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  "data-ocid"?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface-alt))] px-3 py-1 text-sm font-semibold text-[oklch(var(--admin-foreground))]",
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
