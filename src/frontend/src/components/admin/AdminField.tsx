import { cn } from "@/lib/utils";
import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

interface AdminFieldProps {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string | null;
  children: ReactNode;
  className?: string;
}

/**
 * A labeled admin form field wrapper: a clear, readable label, an optional
 * hint, and a reachable inline error. Every admin input sits inside one of
 * these so labels and errors are never missing.
 */
export function AdminField({
  label,
  htmlFor,
  hint,
  error,
  children,
  className,
}: AdminFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className="text-sm font-semibold text-[oklch(var(--admin-foreground))]"
      >
        {label}
      </label>
      {children}
      {hint && !error && (
        <p className="text-sm text-[oklch(var(--admin-muted-foreground))]">
          {hint}
        </p>
      )}
      {error && (
        <p
          role="alert"
          className="text-sm font-medium text-[oklch(var(--admin-status-action))]"
        >
          {error}
        </p>
      )}
    </div>
  );
}

/** Light-backed, large-target admin text input. */
export function AdminInput({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn("admin-field", className)} {...props} />;
}

/** Light-backed, large-target admin textarea. */
export function AdminTextarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn("admin-field min-h-24 resize-y", className)}
      {...props}
    />
  );
}

/** Light-backed, large-target admin select. */
export function AdminSelect({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn("admin-field", className)} {...props}>
      {children}
    </select>
  );
}
