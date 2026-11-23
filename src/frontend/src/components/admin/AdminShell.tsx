import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface AdminShellProps {
  children: ReactNode;
  className?: string;
}

/**
 * The light, high-contrast ground every admin page renders on.
 *
 * The customer-facing side keeps the dark honeycomb identity; the private admin
 * side is a clean professional surface. `.admin-shell` forces a solid light
 * background (no honeycomb, no decorative layers) and disables the app-wide
 * black text outline so dark-on-light copy stays crisp. It is theme-independent
 * — the admin ground never follows the app's dark theme.
 */
export function AdminShell({ children, className }: AdminShellProps) {
  return (
    <div
      data-ocid="admin.shell"
      className={cn("admin-shell min-h-dvh w-full", className)}
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {children}
      </div>
    </div>
  );
}
