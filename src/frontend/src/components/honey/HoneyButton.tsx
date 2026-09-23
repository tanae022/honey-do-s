import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type HoneyButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type HoneyButtonSize = "sm" | "md" | "lg";

interface HoneyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: HoneyButtonVariant;
  size?: HoneyButtonSize;
  children: ReactNode;
}

const VARIANT_CLASS: Record<HoneyButtonVariant, string> = {
  primary:
    "honey-surface text-primary-foreground border border-accent/40 hover:-translate-y-0.5 hover:shadow-honey-lg active:translate-y-0 active:shadow-honey-inset",
  secondary:
    "border border-primary/45 bg-secondary/60 text-foreground hover:border-primary/70 hover:bg-secondary hover:-translate-y-0.5 hover:shadow-honey",
  ghost:
    "border border-transparent bg-transparent text-muted-foreground hover:border-border hover:bg-muted/50 hover:text-foreground",
  danger:
    "border border-destructive/50 bg-destructive/15 text-destructive hover:bg-destructive/25 hover:-translate-y-0.5",
};

const SIZE_CLASS: Record<HoneyButtonSize, string> = {
  sm: "min-h-10 px-4 text-sm",
  md: "min-h-12 px-6 text-base",
  lg: "min-h-14 px-8 text-base md:text-lg",
};

/**
 * Glossy, substantial honey-gold button. Pill shaped with a shine sweep on
 * hover and a full 44px+ touch target on mobile.
 */
export function HoneyButton({
  variant = "primary",
  size = "md",
  className,
  children,
  type = "button",
  ...props
}: HoneyButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "text-outline-black group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-semibold tracking-wide transition-smooth",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:pointer-events-none disabled:opacity-55",
        VARIANT_CLASS[variant],
        SIZE_CLASS[size],
        className,
      )}
      {...props}
    >
      {variant === "primary" && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/45 to-transparent transition-transform duration-700 group-hover:translate-x-full"
        />
      )}
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
      </span>
    </button>
  );
}
