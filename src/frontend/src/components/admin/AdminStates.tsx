import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface AdminLoadingStateProps {
  label?: string;
  className?: string;
  "data-ocid"?: string;
}

/** A centered, readable loading state for admin panels. */
export function AdminLoadingState({
  label = "Loading…",
  className,
  ...rest
}: AdminLoadingStateProps) {
  return (
    <output
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-12 text-center",
        className,
      )}
      {...rest}
    >
      <Loader2
        aria-hidden="true"
        className="size-6 motion-safe:animate-spin text-[oklch(var(--admin-primary))]"
      />
      <p className="text-base text-[oklch(var(--admin-muted-foreground))]">
        {label}
      </p>
    </output>
  );
}

interface AdminErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
  "data-ocid"?: string;
}

/** A clear, recoverable error state for admin panels. */
export function AdminErrorState({
  message = "Something went wrong. Please try again.",
  onRetry,
  className,
  ...rest
}: AdminErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border border-[oklch(var(--admin-status-action))] bg-[oklch(var(--admin-surface))] px-6 py-10 text-center",
        className,
      )}
      {...rest}
    >
      <p className="text-base font-medium text-[oklch(var(--admin-status-action))]">
        {message}
      </p>
      {onRetry && (
        <button
          type="button"
          data-ocid="admin.retry_button"
          onClick={onRetry}
          className="text-sm font-semibold text-[oklch(var(--admin-primary))] underline-offset-4 hover:underline"
        >
          Try again
        </button>
      )}
    </div>
  );
}
