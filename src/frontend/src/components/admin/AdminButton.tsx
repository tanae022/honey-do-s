import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type AdminButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type AdminButtonSize = "sm" | "md" | "lg";

interface AdminButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: AdminButtonVariant;
  size?: AdminButtonSize;
  children: ReactNode;
}

const VARIANT_CLASS: Record<AdminButtonVariant, string> = {
  primary:
    "bg-[oklch(var(--admin-primary))] text-[oklch(var(--admin-primary-foreground))] border border-transparent hover:brightness-110",
  secondary:
    "bg-[oklch(var(--admin-surface))] text-[oklch(var(--admin-foreground))] border border-[oklch(var(--admin-border-strong))] hover:bg-[oklch(var(--admin-surface-alt))]",
  danger:
    "bg-[oklch(var(--admin-status-action))] text-[oklch(var(--admin-status-action-fg))] border border-transparent hover:brightness-110",
  ghost:
    "bg-transparent text-[oklch(var(--admin-muted-foreground))] border border-transparent hover:bg-[oklch(var(--admin-surface-alt))] hover:text-[oklch(var(--admin-foreground))]",
};

const SIZE_CLASS: Record<AdminButtonSize, string> = {
  sm: "min-h-10 px-4 text-sm",
  md: "min-h-11 px-5 text-base",
  lg: "min-h-12 px-6 text-base",
};

/**
 * Large tap-target admin button. Light, high-contrast and comfortable on both
 * phone and desktop; the primary variant is the single blue action per section.
 */
export function AdminButton({
  variant = "primary",
  size = "md",
  className,
  children,
  type = "button",
  ...props
}: AdminButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-smooth",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(var(--admin-ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[oklch(var(--admin-bg))]",
        "disabled:pointer-events-none disabled:opacity-55",
        VARIANT_CLASS[variant],
        SIZE_CLASS[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
