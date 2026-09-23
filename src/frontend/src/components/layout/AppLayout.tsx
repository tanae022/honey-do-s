import { BeeAccent } from "@/components/honey/BeeAccent";
import { HoneyButton } from "@/components/honey/HoneyButton";
import { useIsAdmin } from "@/hooks/useJobs";
import { cn } from "@/lib/utils";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Link, useRouterState } from "@tanstack/react-router";
import { LogIn, LogOut, Menu, Phone, ShieldCheck, X } from "lucide-react";
import { type ReactNode, useState } from "react";

const LOGO_SRC = "/assets/generated/honey-dos-logo.dim_1024x1024.png";

/** Owner's direct line — always reachable from the footer. */
const OWNER_PHONE_DISPLAY = "405-312-4987";
const OWNER_PHONE_HREF = "tel:+14053124987";

interface NavItem {
  to: string;
  label: string;
  adminOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Home" },
  { to: "/request", label: "New Request" },
  { to: "/track", label: "Track Job" },
  { to: "/admin", label: "Dashboard", adminOnly: true },
];

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: isAdmin } = useIsAdmin();
  const { isAuthenticated, login, clear } = useInternetIdentity();
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.adminOnly || isAdmin === true,
  );
  const isLoggedIn = isAuthenticated;

  return (
    <div className="text-outline-black relative flex min-h-dvh flex-col bg-background">
      {/* Logo-matched honeycomb + honey field, fixed behind every page.
          Kept in sync with the body background in index.css. */}
      <div
        aria-hidden="true"
        className="honeycomb-bg pointer-events-none fixed inset-0 -z-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-primary/10 to-transparent"
      />
      {/* Glossy viscous honey pooling along the top and bottom edges */}
      <div
        aria-hidden="true"
        className="honey-drip pointer-events-none fixed inset-x-0 top-0 -z-10 h-1.5 opacity-80"
      />
      <div
        aria-hidden="true"
        className="honey-drip pointer-events-none fixed inset-x-0 bottom-0 -z-10 h-2 opacity-70"
      />
      <header className="sticky top-0 z-50 border-b border-border bg-card/85 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-5 py-3 sm:px-8 sm:py-4">
          <Link
            to="/"
            data-ocid="nav.logo_link"
            className="group flex min-w-0 items-center gap-3"
            onClick={() => setMenuOpen(false)}
          >
            <span className="relative shrink-0">
              <img
                src={LOGO_SRC}
                alt="Honey Do's"
                className="size-20 rounded-2xl border border-primary/40 object-cover shadow-honey transition-smooth group-hover:shadow-honey-lg sm:size-24 md:size-28"
              />
              <BeeAccent className="absolute -right-4 -top-3 h-7 w-10 sm:h-8 sm:w-11 md:h-9 md:w-12" />
            </span>
            <span className="min-w-0">
              <span className="text-outline-black-strong block truncate font-display text-2xl font-bold leading-none text-gold-gradient sm:text-3xl md:text-4xl">
                Honey Do&apos;s
              </span>
              <span className="mt-1 hidden text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground sm:block">
                Little jobs. Big relief.
              </span>
            </span>
          </Link>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-1 md:flex"
          >
            {visibleItems.map((item) => {
              const active = pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  data-ocid={`nav.${item.label.toLowerCase().replace(/\s+/g, "_")}_link`}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-semibold transition-smooth",
                    active
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <HoneyButton
                variant="secondary"
                size="sm"
                data-ocid="nav.logout_button"
                onClick={() => clear()}
                className="hidden sm:inline-flex"
              >
                <LogOut className="size-4" />
                Sign out
              </HoneyButton>
            ) : (
              <HoneyButton
                variant="secondary"
                size="sm"
                data-ocid="nav.login_button"
                onClick={() => login()}
                className="hidden sm:inline-flex"
              >
                <LogIn className="size-4" />
                Sign in
              </HoneyButton>
            )}
            <button
              type="button"
              data-ocid="nav.menu_toggle"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
              className="flex size-11 items-center justify-center rounded-full border border-border bg-secondary/60 text-foreground transition-smooth hover:border-primary/50 md:hidden"
            >
              {menuOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav
            aria-label="Mobile"
            className="border-t border-border bg-card/95 px-5 pb-4 pt-3 md:hidden"
          >
            <ul className="flex flex-col gap-1">
              {visibleItems.map((item) => {
                const active = pathname === item.to;
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      data-ocid={`nav.mobile_${item.label.toLowerCase().replace(/\s+/g, "_")}_link`}
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        "flex min-h-12 items-center gap-3 rounded-xl px-4 text-base font-semibold transition-smooth",
                        active
                          ? "bg-primary/15 text-primary"
                          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className="hex-clip size-2.5 bg-current"
                      />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
              <li className="pt-2">
                {isLoggedIn ? (
                  <HoneyButton
                    variant="secondary"
                    size="md"
                    data-ocid="nav.mobile_logout_button"
                    onClick={() => {
                      clear();
                      setMenuOpen(false);
                    }}
                    className="w-full"
                  >
                    <LogOut className="size-4" />
                    Sign out
                  </HoneyButton>
                ) : (
                  <HoneyButton
                    variant="secondary"
                    size="md"
                    data-ocid="nav.mobile_login_button"
                    onClick={() => {
                      login();
                      setMenuOpen(false);
                    }}
                    className="w-full"
                  >
                    <LogIn className="size-4" />
                    Sign in
                  </HoneyButton>
                )}
              </li>
            </ul>
          </nav>
        )}
      </header>

      <main className="relative flex-1 bg-background/80">{children}</main>

      {/* Mobile-only sticky primary action */}
      <div className="sticky bottom-0 z-40 border-t border-border bg-background/90 px-5 py-3 backdrop-blur-md md:hidden">
        <Link to="/request" data-ocid="nav.sticky_request_button">
          <HoneyButton size="lg" className="w-full">
            Request a Honey Do
          </HoneyButton>
        </Link>
      </div>

      <footer className="border-t border-border bg-muted/40 honeycomb-texture">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 py-10 sm:px-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2">
              <span aria-hidden="true" className="hex-clip size-3 bg-primary" />
              <span className="text-outline-black-strong font-display text-lg font-bold text-gold-gradient">
                Honey Do&apos;s
              </span>
              <BeeAccent className="h-5 w-7" />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Friendly neighborhood help for the little jobs that make a big
              difference around the home.
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Explore
            </span>
            <ul className="flex flex-col gap-2">
              {visibleItems.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    data-ocid={`footer.${item.label.toLowerCase().replace(/\s+/g, "_")}_link`}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-smooth hover:text-primary"
                  >
                    <span
                      aria-hidden="true"
                      className="hex-clip size-2 bg-primary/70"
                    />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Call the owner
            </span>
            <a
              href={OWNER_PHONE_HREF}
              data-ocid="footer.phone_link"
              className="inline-flex min-h-11 items-center gap-2 text-base font-semibold text-primary transition-smooth hover:text-accent"
            >
              <Phone className="size-4" />
              {OWNER_PHONE_DISPLAY}
            </a>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="size-4 text-primary" />
              {isAdmin
                ? "Signed in with admin access"
                : "Sign in to manage requests"}
            </p>
          </div>
        </div>
        <div className="border-t border-border/70 px-5 py-5 text-center sm:px-8">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
