import { NewRequestAlert } from "@/components/NewRequestAlert";
import { BeeAccent } from "@/components/honey/BeeAccent";
import { HoneyButton } from "@/components/honey/HoneyButton";
import { useIsAdmin, useNewRequestCount } from "@/hooks/useJobs";
import { cn } from "@/lib/utils";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  CalendarDays,
  ClipboardList,
  Inbox,
  LayoutDashboard,
  LogIn,
  LogOut,
  type LucideIcon,
  Menu,
  MessagesSquare,
  Phone,
  Quote,
  Settings,
  ShieldCheck,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { type ReactNode, useState } from "react";

const LOGO_SRC = "/assets/generated/honey-dos-logo.dim_1024x1024.png";

/** Owner's direct line — always reachable from the footer. */
const OWNER_PHONE_DISPLAY = "405-312-4987";
const OWNER_PHONE_HREF = "tel:+14053124987";

interface NavItem {
  to: string;
  label: string;
  adminOnly?: boolean;
  /** Also mark active when the pathname starts with this prefix. */
  matchPrefix?: string;
}

const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Home" },
  { to: "/request", label: "New Request" },
  { to: "/track", label: "Track Job" },
  { to: "/admin", label: "Dashboard", adminOnly: true },
];

interface AdminNavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  /** Also mark active when the pathname starts with this prefix. */
  matchPrefix?: string;
}

/**
 * The full admin menu. Every destination is a working route registered in
 * App.tsx; the menu is rendered only for a signed-in admin.
 */
const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/requests", label: "Requests", icon: Inbox },
  { to: "/admin/calendar", label: "Calendar", icon: CalendarDays },
  {
    to: "/admin/customers",
    label: "Customers",
    icon: Users,
    matchPrefix: "/admin/customers",
  },
  { to: "/admin/quotes", label: "Quotes", icon: Quote },
  { to: "/admin/jobs", label: "Jobs", icon: ClipboardList },
  { to: "/admin/payments", label: "Payments", icon: Wallet },
  { to: "/admin/messages", label: "Messages", icon: MessagesSquare },
  { to: "/admin/notifications", label: "Notifications", icon: Bell },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

interface AppLayoutProps {
  children: ReactNode;
}

/**
 * Count badge for the Dashboard nav item — how many requests are still waiting
 * on the owner's quote. Renders nothing at zero so the nav stays quiet.
 */
function NewRequestBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span
      data-ocid="nav.new_request_badge"
      aria-label={`${count} ${count === 1 ? "request" : "requests"} awaiting a quote`}
      className="text-outline-black inline-flex min-w-5 items-center justify-center rounded-full border border-accent/50 bg-primary px-1.5 py-0.5 font-mono text-[0.65rem] font-bold leading-none text-primary-foreground shadow-honey"
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}

/**
 * The admin sub-navigation: a horizontally scrollable tab bar of every admin
 * destination. Rendered only inside the admin area for a signed-in admin, so
 * the customer-facing header stays unchanged.
 */
function AdminNav({ pathname }: { pathname: string }) {
  return (
    <nav
      aria-label="Admin"
      data-ocid="nav.admin_menu"
      className="border-t border-border bg-card/95"
    >
      <div className="mx-auto w-full max-w-6xl px-3 sm:px-6">
        <ul className="scrollbar-honey flex items-center gap-1 overflow-x-auto py-2">
          {ADMIN_NAV_ITEMS.map((item) => {
            const active = item.matchPrefix
              ? pathname.startsWith(item.matchPrefix)
              : pathname === item.to;
            const Icon = item.icon;
            return (
              <li key={item.to} className="shrink-0">
                <Link
                  to={item.to}
                  data-ocid={`nav.admin_${item.label.toLowerCase().replace(/\s+/g, "_")}_link`}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex min-h-11 items-center gap-2 rounded-full px-3.5 text-sm font-semibold transition-smooth",
                    active
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  )}
                >
                  <Icon aria-hidden="true" className="size-4" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

export function AppLayout({ children }: AppLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: isAdmin } = useIsAdmin();
  const { data: newRequestCount } = useNewRequestCount(isAdmin === true);
  const { isAuthenticated, login, clear } = useInternetIdentity();
  const routerState = useRouterState();
  const pathname = routerState?.location?.pathname ?? "";

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.adminOnly || isAdmin === true,
  );
  const isLoggedIn = isAuthenticated;
  const badgeCount = newRequestCount ?? 0;
  // The fixed "Request a Honey Do" action belongs to the customer-facing
  // experience only. On the admin console it would sit over profile panels and
  // administrative controls, so it is hidden for every /admin route.
  const isAdminArea = pathname.startsWith("/admin");
  const showAdminNav = isAdmin === true && isAdminArea;

  return (
    <div className="text-outline-black relative flex min-h-dvh flex-col bg-background">
      {/* Logo-matched honeycomb + honey field, fixed behind every page.
          Kept in sync with the body background in index.css. Inside it, three
          beveled SVG depth planes drift at different speeds under a slow
          breathing glow with honey glossing through the cells — a living,
          dimensional hive wall rather than a flat tile. */}
      <div
        aria-hidden="true"
        className="honeycomb-bg pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <span className="comb-plane comb-plane-far" />
        <span className="comb-plane comb-plane-mid" />
        <span className="comb-plane comb-plane-near" />
        <span className="comb-breathe" />
        <span className="comb-honey-sheen" />
      </div>
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
      {/* Live in-app alert for a genuinely new request while the owner is
          signed in with the app open. Self-gated: it watches and dings only
          for an authenticated admin. */}
      <NewRequestAlert />
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
              const active = item.matchPrefix
                ? pathname.startsWith(item.matchPrefix)
                : pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  data-ocid={`nav.${item.label.toLowerCase().replace(/\s+/g, "_")}_link`}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-smooth",
                    active
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  )}
                >
                  {item.label}
                  {item.adminOnly && <NewRequestBadge count={badgeCount} />}
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
                const active = item.matchPrefix
                  ? pathname.startsWith(item.matchPrefix)
                  : pathname === item.to;
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
                      {item.adminOnly && (
                        <span className="ml-auto">
                          <NewRequestBadge count={badgeCount} />
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
              {isAdmin === true && (
                <li className="mt-2 border-t border-border/70 pt-3">
                  <span className="px-4 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Admin
                  </span>
                  <ul className="mt-2 flex flex-col gap-1">
                    {ADMIN_NAV_ITEMS.map((item) => {
                      const active = item.matchPrefix
                        ? pathname.startsWith(item.matchPrefix)
                        : pathname === item.to;
                      const Icon = item.icon;
                      return (
                        <li key={item.to}>
                          <Link
                            to={item.to}
                            data-ocid={`nav.mobile_admin_${item.label.toLowerCase().replace(/\s+/g, "_")}_link`}
                            onClick={() => setMenuOpen(false)}
                            className={cn(
                              "flex min-h-12 items-center gap-3 rounded-xl px-4 text-base font-semibold transition-smooth",
                              active
                                ? "bg-primary/15 text-primary"
                                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                            )}
                          >
                            <Icon aria-hidden="true" className="size-4" />
                            {item.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              )}
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

        {showAdminNav && <AdminNav pathname={pathname} />}
      </header>

      <main className="relative flex-1 bg-background/80">{children}</main>

      {/* Mobile-only sticky primary action — customer-facing routes only, so it
          never covers customer profile information or admin controls. */}
      {!isAdminArea && (
        <div className="sticky bottom-0 z-40 border-t border-border bg-background/90 px-5 py-3 backdrop-blur-md md:hidden">
          <Link to="/request" data-ocid="nav.sticky_request_button">
            <HoneyButton size="lg" className="w-full">
              Request a Honey Do
            </HoneyButton>
          </Link>
        </div>
      )}

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
