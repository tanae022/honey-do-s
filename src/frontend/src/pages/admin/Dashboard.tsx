import { DepositStatus, JobStatus, QuoteStatus } from "@/backend";
import {
  AdminButton,
  AdminCard,
  AdminCardHeader,
  AdminPageHeader,
  AdminShell,
  AdminStatCard,
  AdminStatusBadge,
} from "@/components/admin";
import {
  AdminErrorState,
  AdminLoadingState,
} from "@/components/admin/AdminStates";
import { usePaymentHistory } from "@/hooks/useAdminSettings";
import { useCustomers } from "@/hooks/useCustomers";
import {
  useDashboardStats,
  useIsAdmin,
  useJobRequests,
  useScheduledAppointments,
} from "@/hooks/useJobs";
import { ADMIN_STATUS_META, ADMIN_STATUS_ORDER } from "@/lib/admin";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Link } from "@tanstack/react-router";
import {
  CalendarClock,
  CalendarPlus,
  ClipboardList,
  CreditCard,
  FileText,
  Inbox,
  LogIn,
  Plus,
  ShieldAlert,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";
import { type ReactNode, useMemo } from "react";

/**
 * Admin Dashboard.
 *
 * The light, high-contrast landing page for the private admin side. It gates on
 * admin access, then shows the eight headline counts the owner checks first,
 * each linking to the list filtered to that state, plus the four quick actions
 * that open the matching create flow. Every number is derived from the shared
 * admin queries so the dashboard, the lists and the nav badge always agree.
 */
export function DashboardPage() {
  const { data: isAdmin, isLoading: roleLoading } = useIsAdmin();
  const { login, loginStatus } = useInternetIdentity();

  if (roleLoading) {
    return (
      <AdminShell>
        <AdminLoadingState
          data-ocid="admin.dashboard.loading_state"
          label="Checking access"
        />
      </AdminShell>
    );
  }

  if (!isAdmin) {
    return (
      <AdminShell>
        <AdminCard className="mx-auto max-w-md text-center">
          <span
            aria-hidden="true"
            className="mx-auto flex size-12 items-center justify-center rounded-full bg-[oklch(var(--admin-surface-alt))] text-[oklch(var(--admin-primary))]"
          >
            <ShieldAlert className="size-6" />
          </span>
          <h1 className="mt-4 text-xl font-bold text-[oklch(var(--admin-foreground))]">
            Admin access required
          </h1>
          <p className="mt-2 text-base text-[oklch(var(--admin-muted-foreground))]">
            Sign in with an administrator identity to open the dashboard.
          </p>
          {loginStatus !== "success" && (
            <AdminButton
              data-ocid="admin.dashboard.login_button"
              onClick={() => login()}
              className="mt-5 w-full sm:w-auto"
            >
              <LogIn className="size-4" />
              Sign in
            </AdminButton>
          )}
        </AdminCard>
      </AdminShell>
    );
  }

  return <DashboardWorkspace />;
}

function DashboardWorkspace() {
  const statsQuery = useDashboardStats();
  const requestsQuery = useJobRequests();
  const appointmentsQuery = useScheduledAppointments();
  const paymentsQuery = usePaymentHistory();
  const customersQuery = useCustomers();

  const requests = requestsQuery.data ?? [];
  const appointments = appointmentsQuery.data ?? [];
  const payments = paymentsQuery.data ?? [];
  const customers = customersQuery.data ?? [];

  const counts = useMemo(() => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const startOfTomorrow = new Date(startOfToday);
    startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

    const todayAppointments = appointments.filter((appointment) => {
      const at = Number(appointment.scheduledAt / 1_000_000n);
      return at >= startOfToday.getTime() && at < startOfTomorrow.getTime();
    }).length;

    const pendingQuotes = requests.filter(
      (job) =>
        job.status === JobStatus.quoted &&
        job.quote?.status !== QuoteStatus.approved &&
        job.quote?.status !== QuoteStatus.declined,
    ).length;

    const depositsPending = payments.filter(
      (payment) =>
        payment.depositStatus === DepositStatus.pending ||
        payment.depositStatus === DepositStatus.submitted,
    ).length;

    return {
      newRequests: statsQuery.data
        ? Number(statsQuery.data.newRequests)
        : requests.filter((job) => job.status === JobStatus.requested).length,
      todayAppointments,
      upcomingAppointments: statsQuery.data
        ? Number(statsQuery.data.upcomingAppointments)
        : appointments.length,
      pendingQuotes,
      depositsPending,
      activeJobs: statsQuery.data
        ? Number(statsQuery.data.activeJobs)
        : requests.filter((job) => job.status === JobStatus.inProgress).length,
      payments: payments.length,
      customers: customers.length,
    };
  }, [appointments, customers.length, payments, requests, statsQuery.data]);

  const isLoading =
    statsQuery.isLoading ||
    requestsQuery.isLoading ||
    appointmentsQuery.isLoading ||
    paymentsQuery.isLoading ||
    customersQuery.isLoading;

  const isError =
    statsQuery.isError ||
    requestsQuery.isError ||
    appointmentsQuery.isError ||
    paymentsQuery.isError ||
    customersQuery.isError;

  const refetchAll = () => {
    void statsQuery.refetch();
    void requestsQuery.refetch();
    void appointmentsQuery.refetch();
    void paymentsQuery.refetch();
    void customersQuery.refetch();
  };

  return (
    <AdminShell>
      <AdminPageHeader
        eyebrow="Hive control"
        title="Dashboard"
        description="Everything that needs your attention today, at a glance."
      />

      {/* Quick actions — the four create flows the owner reaches for most. */}
      <section
        data-ocid="admin.dashboard.quick_actions"
        aria-label="Quick actions"
        className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4"
      >
        <QuickAction
          ocid="admin.dashboard.new_request_button"
          to="/request"
          icon={<Plus className="size-5" />}
          label="New Request"
        />
        <QuickAction
          ocid="admin.dashboard.new_customer_button"
          to="/admin/customers"
          search={{ new: "1" }}
          icon={<UserPlus className="size-5" />}
          label="New Customer"
        />
        <QuickAction
          ocid="admin.dashboard.new_quote_button"
          to="/admin/quotes"
          search={{ new: "1" }}
          icon={<FileText className="size-5" />}
          label="New Quote"
        />
        <QuickAction
          ocid="admin.dashboard.new_appointment_button"
          to="/admin/calendar"
          search={{ new: "1" }}
          icon={<CalendarPlus className="size-5" />}
          label="New Appointment"
        />
      </section>

      {isError ? (
        <AdminErrorState
          data-ocid="admin.dashboard.error_state"
          message="We couldn't load the dashboard. Please try again."
          onRetry={refetchAll}
        />
      ) : isLoading ? (
        <AdminLoadingState
          data-ocid="admin.dashboard.loading_state"
          label="Loading your dashboard"
        />
      ) : (
        <>
          {/* Headline counts — each links to the matching filtered list. */}
          <section
            data-ocid="admin.dashboard.stats_section"
            aria-label="Dashboard counts"
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
          >
            <StatLink
              ocid="admin.dashboard.stat.new_requests"
              to="/admin/requests"
              search={{ status: "new" }}
              label="New Requests"
              value={counts.newRequests}
              hint="Awaiting your quote"
              icon={<Inbox className="size-5" />}
            />
            <StatLink
              ocid="admin.dashboard.stat.today_appointments"
              to="/admin/calendar"
              search={{ range: "today" }}
              label="Today's Appointments"
              value={counts.todayAppointments}
              hint="Scheduled for today"
              icon={<CalendarClock className="size-5" />}
            />
            <StatLink
              ocid="admin.dashboard.stat.upcoming_appointments"
              to="/admin/calendar"
              search={{ range: "upcoming" }}
              label="Upcoming Appointments"
              value={counts.upcomingAppointments}
              hint="On the calendar ahead"
              icon={<CalendarClock className="size-5" />}
            />
            <StatLink
              ocid="admin.dashboard.stat.pending_quotes"
              to="/admin/quotes"
              search={{ status: "pending" }}
              label="Pending Quotes"
              value={counts.pendingQuotes}
              hint="Waiting on the customer"
              icon={<FileText className="size-5" />}
            />
            <StatLink
              ocid="admin.dashboard.stat.deposits_pending"
              to="/admin/payments"
              search={{ status: "pending" }}
              label="Deposits Pending"
              value={counts.depositsPending}
              hint="Not yet verified"
              icon={<Wallet className="size-5" />}
            />
            <StatLink
              ocid="admin.dashboard.stat.active_jobs"
              to="/admin/jobs"
              search={{ status: "active" }}
              label="Active Jobs"
              value={counts.activeJobs}
              hint="In progress right now"
              icon={<ClipboardList className="size-5" />}
            />
            <StatLink
              ocid="admin.dashboard.stat.payments"
              to="/admin/payments"
              search={{}}
              label="Payments"
              value={counts.payments}
              hint="Recorded payments"
              icon={<CreditCard className="size-5" />}
            />
            <StatLink
              ocid="admin.dashboard.stat.customers"
              to="/admin/customers"
              search={{}}
              label="Customers"
              value={counts.customers}
              hint="In your directory"
              icon={<Users className="size-5" />}
            />
          </section>

          {/* Status legend — the one obvious color per state, everywhere. */}
          <section className="mt-8">
            <AdminCard data-ocid="admin.dashboard.status_legend">
              <AdminCardHeader
                title="Status colors"
                description="The same state always reads the same color across every admin page."
              />
              <ul className="flex flex-wrap gap-2">
                {ADMIN_STATUS_ORDER.map((key) => {
                  const meta = ADMIN_STATUS_META[key];
                  return (
                    <li key={key}>
                      <AdminStatusBadge
                        data-ocid={`admin.dashboard.status_badge.${key}`}
                        tone={meta.tone}
                        label={meta.label}
                        dot
                      />
                    </li>
                  );
                })}
              </ul>
            </AdminCard>
          </section>
        </>
      )}
    </AdminShell>
  );
}

/* ------------------------------------------------------------------ */
/* Quick action                                                        */
/* ------------------------------------------------------------------ */

interface QuickActionProps {
  ocid: string;
  to: string;
  search?: Record<string, string>;
  icon: ReactNode;
  label: string;
}

/**
 * A large, tappable quick action that opens the matching create flow. Rendered
 * as a link so it works with keyboard and middle-click, styled like the primary
 * admin button.
 */
function QuickAction({ ocid, to, search, icon, label }: QuickActionProps) {
  return (
    <Link
      to={to}
      search={search}
      data-ocid={ocid}
      className="inline-flex min-h-14 items-center justify-center gap-2 rounded-lg border border-transparent bg-[oklch(var(--admin-primary))] px-4 text-base font-semibold text-[oklch(var(--admin-primary-foreground))] transition-smooth hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(var(--admin-ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[oklch(var(--admin-bg))]"
    >
      <span aria-hidden="true">{icon}</span>
      <span className="truncate">+ {label}</span>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Stat link                                                           */
/* ------------------------------------------------------------------ */

interface StatLinkProps {
  ocid: string;
  to: string;
  search: Record<string, string>;
  label: string;
  value: number;
  hint: string;
  icon: ReactNode;
}

/**
 * A headline count that links to the matching filtered list. The whole card is
 * the link, so the tap target is large on phone and desktop alike.
 */
function StatLink({
  ocid,
  to,
  search,
  label,
  value,
  hint,
  icon,
}: StatLinkProps) {
  return (
    <Link
      to={to}
      search={search}
      data-ocid={ocid}
      className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(var(--admin-ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[oklch(var(--admin-bg))]"
    >
      <AdminStatCard
        label={label}
        value={value.toString()}
        hint={hint}
        icon={icon}
        className="h-full transition-smooth hover:border-[oklch(var(--admin-border-strong))]"
      />
    </Link>
  );
}
