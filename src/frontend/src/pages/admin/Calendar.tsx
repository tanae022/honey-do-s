import {
  type CustomerSummary,
  type Deposit,
  DepositStatus,
  type JobRecordView,
  type JobRequestView,
  JobStatus,
  type Quote,
} from "@/backend";
import {
  AdminButton,
  AdminCard,
  AdminCardHeader,
  AdminChip,
  AdminEmptyState,
  AdminErrorState,
  AdminField,
  AdminInput,
  AdminLoadingState,
  AdminPageHeader,
  AdminSelect,
  AdminShell,
  AdminStatusBadge,
} from "@/components/admin";
import { useJobRecords } from "@/hooks/useAdminSettings";
import { useCustomers } from "@/hooks/useCustomers";
import { useJobRequests, useScheduleAppointment } from "@/hooks/useJobs";
import {
  type AdminStatusMeta,
  getAdminStatusMeta,
  getDepositStatusMeta,
} from "@/lib/admin";
import {
  formatDateTime,
  formatMoney,
  formatReference,
  getQuoteStatusMeta,
  quoteTotal,
  timestampToDate,
} from "@/lib/jobs";
import { getService } from "@/lib/services";
import { cn } from "@/lib/utils";
import {
  CalendarDays,
  CalendarPlus,
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  ListChecks,
  MapPin,
  Phone,
  Receipt,
  User,
  Wallet,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

/* ------------------------------------------------------------------ */
/* View model                                                          */
/* ------------------------------------------------------------------ */

type CalendarView = "day" | "week" | "month" | "agenda";

const VIEWS: { key: CalendarView; label: string }[] = [
  { key: "day", label: "Day" },
  { key: "week", label: "Week" },
  { key: "month", label: "Month" },
  { key: "agenda", label: "Agenda" },
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * One appointment on the calendar, joined to everything it links to.
 *
 * An appointment is only "booked" once its required deposit has been verified;
 * until then it is clearly marked as awaiting deposit rather than confirmed.
 */
interface CalendarEntry {
  /** Stable identity for React keys and deterministic markers. */
  key: string;
  jobId: bigint;
  referenceCode: string;
  customerName: string;
  customerId: bigint | null;
  customer: CustomerSummary | null;
  category: JobRequestView["category"];
  jobStatus: JobStatus;
  scheduledAt: bigint;
  /** The backend's own appointment confirmation flag. */
  appointmentConfirmed: boolean;
  quote: Quote | null;
  deposit: Deposit | null;
  /** The linked job record, when one exists for this job. */
  jobRecord: JobRecordView | null;
  /** True only when the required deposit has been submitted and verified. */
  depositVerified: boolean;
  /** True when a deposit is required but not yet verified. */
  awaitingDeposit: boolean;
  /** The single status shown for this appointment. */
  status: AdminStatusMeta;
}

/** Whether a deposit has been submitted and verified by the admin. */
function isDepositVerified(deposit: Deposit | null | undefined): boolean {
  return deposit?.status === DepositStatus.verified;
}

/** Whether a deposit exists and is still waiting on verification. */
function isDepositAwaiting(deposit: Deposit | null | undefined): boolean {
  return (
    deposit?.status === DepositStatus.submitted ||
    deposit?.status === DepositStatus.pending
  );
}

/**
 * The one status an appointment shows.
 *
 * A verified deposit is what makes an appointment confirmed and booked. Until
 * then the appointment reads as awaiting deposit (or action required once the
 * customer says they have paid), never as confirmed.
 */
function entryStatus(
  jobStatus: JobStatus,
  deposit: Deposit | null,
): AdminStatusMeta {
  if (jobStatus === JobStatus.cancelled) {
    return getAdminStatusMeta("cancelled");
  }
  if (jobStatus === JobStatus.completed) {
    return getAdminStatusMeta("completed");
  }
  if (jobStatus === JobStatus.inProgress) {
    return getAdminStatusMeta("inProgress");
  }
  if (isDepositVerified(deposit)) {
    return getAdminStatusMeta("confirmed");
  }
  if (deposit?.status === DepositStatus.submitted) {
    return getAdminStatusMeta("actionRequired");
  }
  return getAdminStatusMeta("waiting");
}

/** Build the joined calendar entries from jobs, records and customers. */
function buildEntries(
  jobs: JobRequestView[],
  records: JobRecordView[],
  customers: CustomerSummary[],
): CalendarEntry[] {
  const recordByJob = new Map<string, JobRecordView>();
  for (const record of records) {
    recordByJob.set(record.jobRequestId.toString(), record);
  }
  const customerByName = new Map<string, CustomerSummary>();
  for (const customer of customers) {
    customerByName.set(customer.fullName.trim().toLowerCase(), customer);
  }

  const entries: CalendarEntry[] = [];
  for (const job of jobs) {
    if (!job.appointment) continue;
    const record = recordByJob.get(job.id.toString()) ?? null;
    const deposit = job.deposit ?? record?.deposit ?? null;
    const quote = job.quote ?? record?.quote ?? null;
    const customer =
      customerByName.get(job.customerName.trim().toLowerCase()) ?? null;
    const verified = isDepositVerified(deposit);
    entries.push({
      key: job.id.toString(),
      jobId: job.id,
      referenceCode: job.referenceCode,
      customerName: job.customerName,
      customerId: customer?.id ?? null,
      customer,
      category: job.category,
      jobStatus: job.status,
      scheduledAt: job.appointment.scheduledAt,
      appointmentConfirmed: job.appointment.confirmed,
      quote,
      deposit,
      jobRecord: record,
      depositVerified: verified,
      awaitingDeposit: !verified && isDepositAwaiting(deposit),
      status: entryStatus(job.status, deposit),
    });
  }
  return entries.sort((a, b) =>
    a.scheduledAt === b.scheduledAt
      ? 0
      : a.scheduledAt > b.scheduledAt
        ? 1
        : -1,
  );
}

/* ------------------------------------------------------------------ */
/* Date helpers                                                        */
/* ------------------------------------------------------------------ */

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

/** Sunday-based start of the week containing `date`. */
function startOfWeek(date: Date): Date {
  return addDays(startOfDay(date), -date.getDay());
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function dayKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function formatTime(timestamp: bigint): string {
  const date = timestampToDate(timestamp);
  if (!date) return "Time to confirm";
  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDayHeading(date: Date): string {
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatMonthHeading(date: Date): string {
  return date.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

/**
 * The calendar view the dashboard's count link asked for, if any.
 *
 * Read straight from `window.location.search` so the link works on the plain
 * `/admin/calendar` route without a `validateSearch` contract. "today" opens
 * the day view; "upcoming" opens the agenda.
 */
function initialCalendarView(): CalendarView {
  if (typeof window === "undefined") return "month";
  const range = new URLSearchParams(window.location.search).get("range");
  if (range === "today") return "day";
  if (range === "upcoming") return "agenda";
  return "month";
}

/** Whether the dashboard's "+ New Appointment" quick action opened this page. */
function openedForNewAppointment(): boolean {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("new") === "1";
}

/**
 * Admin Calendar page.
 *
 * Day, Week, Month and Agenda views over every scheduled appointment. Each
 * appointment is joined to its customer, request, quote, deposit and job, and
 * only reads as confirmed and booked once its required deposit has been
 * submitted and verified.
 */
export function CalendarPage() {
  const jobsQuery = useJobRequests();
  const recordsQuery = useJobRecords();
  const customersQuery = useCustomers();

  const [view, setView] = useState<CalendarView>(initialCalendarView);
  const [anchor, setAnchor] = useState<Date>(() => startOfDay(new Date()));
  const [selected, setSelected] = useState<CalendarEntry | null>(null);
  const [creating, setCreating] = useState(openedForNewAppointment);

  const jobs = jobsQuery.data ?? [];
  const records = recordsQuery.data ?? [];
  const customers = customersQuery.data ?? [];

  const entries = useMemo(
    () => buildEntries(jobs, records, customers),
    [jobs, records, customers],
  );

  const isLoading =
    jobsQuery.isLoading || recordsQuery.isLoading || customersQuery.isLoading;
  const isError = jobsQuery.isError || recordsQuery.isError;

  const confirmedCount = entries.filter(
    (entry) => entry.depositVerified,
  ).length;
  const awaitingCount = entries.filter((entry) => entry.awaitingDeposit).length;

  const step = (direction: -1 | 1) => {
    setAnchor((current) => {
      if (view === "day") return addDays(current, direction);
      if (view === "week") return addDays(current, direction * 7);
      if (view === "month") {
        return new Date(
          current.getFullYear(),
          current.getMonth() + direction,
          1,
        );
      }
      return addDays(current, direction * 7);
    });
  };

  const periodLabel = useMemo(() => {
    if (view === "day") return formatDayHeading(anchor);
    if (view === "week") {
      const start = startOfWeek(anchor);
      const end = addDays(start, 6);
      return `${start.toLocaleDateString(undefined, { month: "short", day: "numeric" })} – ${end.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`;
    }
    if (view === "month") return formatMonthHeading(anchor);
    return "All upcoming appointments";
  }, [view, anchor]);

  return (
    <AdminShell>
      <AdminPageHeader
        eyebrow="Admin"
        title="Calendar"
        description="Every scheduled appointment, linked to its customer, request, quote, deposit and job."
        actions={
          <AdminButton
            data-ocid="admin.calendar.new_appointment_button"
            onClick={() => setCreating(true)}
          >
            <CalendarPlus className="size-4" />
            New appointment
          </AdminButton>
        }
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <SummaryTile
          data-ocid="admin.calendar.summary.total"
          label="Appointments"
          value={String(entries.length)}
          icon={<CalendarDays className="size-5" />}
        />
        <SummaryTile
          data-ocid="admin.calendar.summary.confirmed"
          label="Confirmed & booked"
          value={String(confirmedCount)}
          hint="Deposit verified"
          icon={<ListChecks className="size-5" />}
        />
        <SummaryTile
          data-ocid="admin.calendar.summary.awaiting"
          label="Awaiting deposit"
          value={String(awaitingCount)}
          hint="Not yet confirmed"
          icon={<Wallet className="size-5" />}
        />
      </div>

      <AdminCard className="mb-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div
            role="tablist"
            aria-label="Calendar view"
            data-ocid="admin.calendar.view_tabs"
            className="flex flex-wrap gap-2"
          >
            {VIEWS.map((option) => {
              const active = view === option.key;
              return (
                <button
                  key={option.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  data-ocid={`admin.calendar.view_tab.${option.key}`}
                  onClick={() => setView(option.key)}
                  className={cn(
                    "inline-flex min-h-11 items-center justify-center rounded-lg border px-4 text-base font-semibold transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(var(--admin-ring))] focus-visible:ring-offset-2",
                    active
                      ? "border-transparent bg-[oklch(var(--admin-primary))] text-[oklch(var(--admin-primary-foreground))]"
                      : "border-[oklch(var(--admin-border-strong))] bg-[oklch(var(--admin-surface))] text-[oklch(var(--admin-foreground))] hover:bg-[oklch(var(--admin-surface-alt))]",
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          {view !== "agenda" && (
            <div className="flex items-center justify-between gap-2 sm:justify-end">
              <AdminButton
                variant="secondary"
                size="sm"
                data-ocid="admin.calendar.prev_button"
                aria-label="Previous period"
                onClick={() => step(-1)}
              >
                <ChevronLeft className="size-4" />
                <span className="sr-only sm:not-sr-only">Previous</span>
              </AdminButton>
              <AdminButton
                variant="secondary"
                size="sm"
                data-ocid="admin.calendar.today_button"
                onClick={() => setAnchor(startOfDay(new Date()))}
              >
                Today
              </AdminButton>
              <AdminButton
                variant="secondary"
                size="sm"
                data-ocid="admin.calendar.next_button"
                aria-label="Next period"
                onClick={() => step(1)}
              >
                <span className="sr-only sm:not-sr-only">Next</span>
                <ChevronRight className="size-4" />
              </AdminButton>
            </div>
          )}
        </div>

        <p
          data-ocid="admin.calendar.period_label"
          className="mt-4 text-lg font-bold text-[oklch(var(--admin-foreground))]"
        >
          {periodLabel}
        </p>
      </AdminCard>

      {isLoading ? (
        <AdminCard>
          <AdminLoadingState
            data-ocid="admin.calendar.loading_state"
            label="Loading the calendar"
          />
        </AdminCard>
      ) : isError ? (
        <AdminErrorState
          data-ocid="admin.calendar.error_state"
          message="We couldn't load the calendar. Please try again."
          onRetry={() => {
            void jobsQuery.refetch();
            void recordsQuery.refetch();
          }}
        />
      ) : entries.length === 0 ? (
        <AdminEmptyState
          data-ocid="admin.calendar.empty_state"
          icon={<CalendarDays className="size-6" />}
          title="No appointments yet"
          description="Scheduled visits appear here once a request has an appointment time."
        />
      ) : view === "month" ? (
        <MonthView
          anchor={anchor}
          entries={entries}
          onSelect={setSelected}
          onPickDay={(date) => {
            setAnchor(date);
            setView("day");
          }}
        />
      ) : view === "week" ? (
        <WeekView anchor={anchor} entries={entries} onSelect={setSelected} />
      ) : view === "day" ? (
        <DayView anchor={anchor} entries={entries} onSelect={setSelected} />
      ) : (
        <AgendaView entries={entries} onSelect={setSelected} />
      )}

      {selected && (
        <AppointmentDetail entry={selected} onClose={() => setSelected(null)} />
      )}

      {creating && (
        <NewAppointmentDialog jobs={jobs} onClose={() => setCreating(false)} />
      )}
    </AdminShell>
  );
}

/* ------------------------------------------------------------------ */
/* New appointment dialog                                              */
/* ------------------------------------------------------------------ */

/** Whether a job is still open to receive a new appointment. */
function isSchedulable(job: JobRequestView): boolean {
  return (
    job.status === JobStatus.requested ||
    job.status === JobStatus.quoted ||
    job.status === JobStatus.scheduled
  );
}

/** A `YYYY-MM-DD` + `HH:MM` pair → a nanosecond timestamp, or null. */
function dateTimeToTimestamp(
  dateValue: string,
  timeValue: string,
): bigint | null {
  if (!dateValue) return null;
  const date = new Date(`${dateValue}T${timeValue || "09:00"}:00`);
  if (Number.isNaN(date.getTime())) return null;
  return BigInt(date.getTime()) * 1_000_000n;
}

/**
 * Create an appointment for an existing request.
 *
 * The dashboard's "+ New Appointment" quick action opens this dialog directly.
 * The admin picks a request that is still open to scheduling and a date and
 * time, and the appointment is saved against that request.
 */
function NewAppointmentDialog({
  jobs,
  onClose,
}: {
  jobs: JobRequestView[];
  onClose: () => void;
}) {
  const scheduleAppointment = useScheduleAppointment();
  const [jobId, setJobId] = useState("");
  const [dateValue, setDateValue] = useState("");
  const [timeValue, setTimeValue] = useState("09:00");
  const [error, setError] = useState<string | null>(null);

  const schedulable = useMemo(() => jobs.filter(isSchedulable), [jobs]);

  const handleSave = (): void => {
    setError(null);
    const job = schedulable.find((item) => item.id.toString() === jobId);
    if (!job) {
      setError("Choose the request this appointment is for.");
      return;
    }
    const scheduledAt = dateTimeToTimestamp(dateValue, timeValue);
    if (scheduledAt === null) {
      setError("Choose a valid date and time for the visit.");
      return;
    }
    scheduleAppointment.mutate(
      { id: job.id, scheduledAt },
      {
        onSuccess: (result) => {
          if (result.__kind__ === "ok") {
            onClose();
            return;
          }
          setError(
            result.err.__kind__ === "invalidState"
              ? result.err.invalidState
              : "We couldn't save that appointment. Please try again.",
          );
        },
        onError: () =>
          setError("We couldn't save that appointment. Please try again."),
      },
    );
  };

  return (
    <dialog
      open
      data-ocid="admin.calendar.new_appointment_modal"
      aria-labelledby="admin-calendar-new-appointment-title"
      className="fixed inset-0 z-50 m-0 flex h-full max-h-none w-full max-w-none items-center justify-center border-0 bg-transparent p-4"
    >
      <button
        type="button"
        aria-label="Close dialog"
        data-ocid="admin.calendar.new_appointment_dismiss_button"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-[oklch(0.2_0.012_260_/_0.55)]"
      />
      <div className="admin-shell relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface))] p-5 shadow-admin sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2
              id="admin-calendar-new-appointment-title"
              className="text-xl font-bold text-[oklch(var(--admin-foreground))]"
            >
              New appointment
            </h2>
            <p className="mt-1 text-base text-[oklch(var(--admin-muted-foreground))]">
              Schedule a visit for an open request.
            </p>
          </div>
          <button
            type="button"
            data-ocid="admin.calendar.new_appointment_close_button"
            aria-label="Close"
            onClick={onClose}
            className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[oklch(var(--admin-border-strong))] bg-[oklch(var(--admin-surface))] text-[oklch(var(--admin-foreground))] transition-smooth hover:bg-[oklch(var(--admin-surface-alt))]"
          >
            <X className="size-5" />
          </button>
        </div>

        {schedulable.length === 0 ? (
          <AdminEmptyState
            data-ocid="admin.calendar.new_appointment_empty_state"
            icon={<CalendarPlus className="size-6" />}
            title="No requests ready to schedule"
            description="A request appears here once it is new, quoted or already scheduled."
          />
        ) : (
          <div className="flex flex-col gap-5">
            <AdminField label="Request" htmlFor="calendar-new-job">
              <AdminSelect
                id="calendar-new-job"
                data-ocid="admin.calendar.new_appointment.job_select"
                value={jobId}
                onChange={(event) => {
                  setJobId(event.target.value);
                  setError(null);
                }}
              >
                <option value="">Choose a request…</option>
                {schedulable.map((job) => (
                  <option key={job.id.toString()} value={job.id.toString()}>
                    {job.customerName} · {getService(job.category).label} ·{" "}
                    {formatReference(job.referenceCode)}
                  </option>
                ))}
              </AdminSelect>
            </AdminField>

            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField label="Date" htmlFor="calendar-new-date">
                <AdminInput
                  id="calendar-new-date"
                  data-ocid="admin.calendar.new_appointment.date_input"
                  type="date"
                  value={dateValue}
                  onChange={(event) => {
                    setDateValue(event.target.value);
                    setError(null);
                  }}
                />
              </AdminField>
              <AdminField label="Start time" htmlFor="calendar-new-time">
                <AdminInput
                  id="calendar-new-time"
                  data-ocid="admin.calendar.new_appointment.time_input"
                  type="time"
                  value={timeValue}
                  onChange={(event) => {
                    setTimeValue(event.target.value);
                    setError(null);
                  }}
                />
              </AdminField>
            </div>

            {error && (
              <p
                data-ocid="admin.calendar.new_appointment.error_state"
                role="alert"
                className="rounded-xl border border-[oklch(var(--admin-status-action))] bg-[oklch(var(--admin-surface))] px-4 py-3 text-base font-medium text-[oklch(var(--admin-status-action))]"
              >
                {error}
              </p>
            )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <AdminButton
                variant="secondary"
                data-ocid="admin.calendar.new_appointment.cancel_button"
                onClick={onClose}
                disabled={scheduleAppointment.isPending}
              >
                Cancel
              </AdminButton>
              <AdminButton
                data-ocid="admin.calendar.new_appointment.submit_button"
                onClick={handleSave}
                disabled={scheduleAppointment.isPending}
              >
                <CalendarPlus className="size-4" />
                {scheduleAppointment.isPending ? "Saving…" : "Save appointment"}
              </AdminButton>
            </div>
          </div>
        )}
      </div>
    </dialog>
  );
}

/* ------------------------------------------------------------------ */
/* Summary tile                                                        */
/* ------------------------------------------------------------------ */

function SummaryTile({
  label,
  value,
  hint,
  icon,
  ...rest
}: {
  label: string;
  value: string;
  hint?: string;
  icon: React.ReactNode;
  "data-ocid"?: string;
}) {
  return (
    <div className="admin-card p-4 sm:p-5" {...rest}>
      <div className="flex items-center justify-between gap-2">
        <span className="admin-label">{label}</span>
        <span
          aria-hidden="true"
          className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[oklch(var(--admin-surface-alt))] text-[oklch(var(--admin-primary))]"
        >
          {icon}
        </span>
      </div>
      <p className="mt-2 font-mono text-2xl font-bold tracking-tight text-[oklch(var(--admin-foreground))] sm:text-3xl">
        {value}
      </p>
      {hint && (
        <p className="mt-1 text-sm text-[oklch(var(--admin-muted-foreground))]">
          {hint}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Appointment chip                                                    */
/* ------------------------------------------------------------------ */

function AppointmentChip({
  entry,
  onSelect,
  compact = false,
  ...rest
}: {
  entry: CalendarEntry;
  onSelect: (entry: CalendarEntry) => void;
  compact?: boolean;
  "data-ocid"?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(entry)}
      className={cn(
        "w-full rounded-lg border border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface))] text-left transition-smooth hover:border-[oklch(var(--admin-primary))] hover:bg-[oklch(var(--admin-surface-alt))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(var(--admin-ring))] focus-visible:ring-offset-2",
        compact ? "px-2 py-1.5" : "px-3 py-2.5",
      )}
      {...rest}
    >
      <span className="flex items-center justify-between gap-2">
        <span
          className={cn(
            "min-w-0 truncate font-semibold text-[oklch(var(--admin-foreground))]",
            compact ? "text-xs" : "text-base",
          )}
        >
          {entry.customerName}
        </span>
        {!compact && (
          <span className="shrink-0 font-mono text-xs text-[oklch(var(--admin-muted-foreground))]">
            {formatTime(entry.scheduledAt)}
          </span>
        )}
      </span>
      {!compact && (
        <span className="mt-1 flex flex-wrap items-center gap-1.5">
          <AdminStatusBadge
            tone={entry.status.tone}
            label={entry.status.label}
            dot
          />
          {entry.awaitingDeposit && (
            <AdminChip className="text-xs">Awaiting deposit</AdminChip>
          )}
        </span>
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Month view                                                          */
/* ------------------------------------------------------------------ */

function MonthView({
  anchor,
  entries,
  onSelect,
  onPickDay,
}: {
  anchor: Date;
  entries: CalendarEntry[];
  onSelect: (entry: CalendarEntry) => void;
  onPickDay: (date: Date) => void;
}) {
  const { cells, byDay } = useMemo(() => {
    const year = anchor.getFullYear();
    const month = anchor.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const map = new Map<string, CalendarEntry[]>();
    for (const entry of entries) {
      const at = timestampToDate(entry.scheduledAt);
      if (!at || at.getFullYear() !== year || at.getMonth() !== month) continue;
      const key = dayKey(at);
      const list = map.get(key) ?? [];
      list.push(entry);
      map.set(key, list);
    }

    const grid: { id: string; date: Date | null }[] = [];
    for (let i = 0; i < firstWeekday; i += 1) {
      grid.push({ id: `lead-${i}`, date: null });
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(year, month, day);
      grid.push({ id: dayKey(date), date });
    }
    let trail = 0;
    while (grid.length % 7 !== 0) {
      grid.push({ id: `trail-${trail}`, date: null });
      trail += 1;
    }

    return { cells: grid, byDay: map };
  }, [anchor, entries]);

  const today = startOfDay(new Date());

  return (
    <AdminCard data-ocid="admin.calendar.month_view">
      <div className="grid grid-cols-7 gap-1.5">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="pb-1 text-center text-xs font-bold uppercase tracking-wide text-[oklch(var(--admin-muted-foreground))]"
          >
            {day}
          </div>
        ))}
        {cells.map((cell) => {
          const { date } = cell;
          if (!date) {
            return (
              <div
                key={cell.id}
                aria-hidden="true"
                className="min-h-24 rounded-lg border border-transparent"
              />
            );
          }
          const dayEntries = byDay.get(dayKey(date)) ?? [];
          const isToday = sameDay(date, today);
          return (
            <div
              key={cell.id}
              data-ocid={`admin.calendar.month_day.${date.getDate()}`}
              className={cn(
                "flex min-h-24 flex-col gap-1 rounded-lg border p-1.5",
                isToday
                  ? "border-[oklch(var(--admin-primary))] bg-[oklch(var(--admin-surface-alt))]"
                  : "border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface))]",
              )}
            >
              <button
                type="button"
                onClick={() => onPickDay(date)}
                aria-label={`Open ${formatDayHeading(date)}`}
                className={cn(
                  "self-start rounded px-1 font-mono text-xs font-bold transition-smooth hover:bg-[oklch(var(--admin-surface-alt))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(var(--admin-ring))]",
                  isToday
                    ? "text-[oklch(var(--admin-primary))]"
                    : "text-[oklch(var(--admin-muted-foreground))]",
                )}
              >
                {date.getDate()}
              </button>
              <div className="flex flex-col gap-1">
                {dayEntries.slice(0, 2).map((entry) => (
                  <AppointmentChip
                    key={entry.key}
                    entry={entry}
                    onSelect={onSelect}
                    compact
                    data-ocid={`admin.calendar.month_item.${date.getDate()}.${entry.key}`}
                  />
                ))}
                {dayEntries.length > 2 && (
                  <span className="px-1 text-xs font-semibold text-[oklch(var(--admin-muted-foreground))]">
                    +{dayEntries.length - 2} more
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </AdminCard>
  );
}

/* ------------------------------------------------------------------ */
/* Week view                                                           */
/* ------------------------------------------------------------------ */

function WeekView({
  anchor,
  entries,
  onSelect,
}: {
  anchor: Date;
  entries: CalendarEntry[];
  onSelect: (entry: CalendarEntry) => void;
}) {
  const days = useMemo(() => {
    const start = startOfWeek(anchor);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [anchor]);

  const byDay = useMemo(() => {
    const map = new Map<string, CalendarEntry[]>();
    for (const entry of entries) {
      const at = timestampToDate(entry.scheduledAt);
      if (!at) continue;
      const key = dayKey(at);
      const list = map.get(key) ?? [];
      list.push(entry);
      map.set(key, list);
    }
    return map;
  }, [entries]);

  const today = startOfDay(new Date());

  return (
    <div
      data-ocid="admin.calendar.week_view"
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-7"
    >
      {days.map((date) => {
        const dayEntries = byDay.get(dayKey(date)) ?? [];
        const isToday = sameDay(date, today);
        return (
          <AdminCard
            key={dayKey(date)}
            data-ocid={`admin.calendar.week_day.${date.getDay()}`}
            className={cn(
              "flex flex-col gap-2 p-3 sm:p-4",
              isToday && "ring-2 ring-[oklch(var(--admin-primary))]",
            )}
          >
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-sm font-bold text-[oklch(var(--admin-foreground))]">
                {date.toLocaleDateString(undefined, { weekday: "short" })}
              </span>
              <span className="font-mono text-sm text-[oklch(var(--admin-muted-foreground))]">
                {date.getDate()}
              </span>
            </div>
            {dayEntries.length === 0 ? (
              <p className="text-sm text-[oklch(var(--admin-muted-foreground))]">
                No visits
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {dayEntries.map((entry) => (
                  <AppointmentChip
                    key={entry.key}
                    entry={entry}
                    onSelect={onSelect}
                    data-ocid={`admin.calendar.week_item.${date.getDay()}.${entry.key}`}
                  />
                ))}
              </div>
            )}
          </AdminCard>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Day view                                                            */
/* ------------------------------------------------------------------ */

function DayView({
  anchor,
  entries,
  onSelect,
}: {
  anchor: Date;
  entries: CalendarEntry[];
  onSelect: (entry: CalendarEntry) => void;
}) {
  const dayEntries = useMemo(
    () =>
      entries.filter((entry) => {
        const at = timestampToDate(entry.scheduledAt);
        return at ? sameDay(at, anchor) : false;
      }),
    [entries, anchor],
  );

  if (dayEntries.length === 0) {
    return (
      <AdminEmptyState
        data-ocid="admin.calendar.day_empty_state"
        icon={<CalendarDays className="size-6" />}
        title="Nothing scheduled this day"
        description="Pick another day, or switch to Agenda to see every upcoming visit."
      />
    );
  }

  return (
    <AdminCard data-ocid="admin.calendar.day_view">
      <AdminCardHeader
        title={formatDayHeading(anchor)}
        description={`${dayEntries.length} ${dayEntries.length === 1 ? "appointment" : "appointments"}`}
      />
      <ul className="flex flex-col gap-3">
        {dayEntries.map((entry, index) => (
          <li key={entry.key}>
            <AppointmentChip
              entry={entry}
              onSelect={onSelect}
              data-ocid={`admin.calendar.day_item.${index + 1}`}
            />
          </li>
        ))}
      </ul>
    </AdminCard>
  );
}

/* ------------------------------------------------------------------ */
/* Agenda view                                                         */
/* ------------------------------------------------------------------ */

function AgendaView({
  entries,
  onSelect,
}: {
  entries: CalendarEntry[];
  onSelect: (entry: CalendarEntry) => void;
}) {
  const groups = useMemo(() => {
    const map = new Map<string, { date: Date; entries: CalendarEntry[] }>();
    for (const entry of entries) {
      const at = timestampToDate(entry.scheduledAt);
      if (!at) continue;
      const key = dayKey(at);
      const group = map.get(key) ?? { date: startOfDay(at), entries: [] };
      group.entries.push(entry);
      map.set(key, group);
    }
    return [...map.values()].sort(
      (a, b) => a.date.getTime() - b.date.getTime(),
    );
  }, [entries]);

  if (groups.length === 0) {
    return (
      <AdminEmptyState
        data-ocid="admin.calendar.agenda_empty_state"
        icon={<CalendarRange className="size-6" />}
        title="No upcoming appointments"
        description="Scheduled visits appear here grouped by day."
      />
    );
  }

  return (
    <div data-ocid="admin.calendar.agenda_view" className="flex flex-col gap-5">
      {groups.map((group, groupIndex) => (
        <AdminCard key={dayKey(group.date)}>
          <AdminCardHeader
            title={formatDayHeading(group.date)}
            description={`${group.entries.length} ${group.entries.length === 1 ? "appointment" : "appointments"}`}
          />
          <ul className="flex flex-col gap-3">
            {group.entries.map((entry, index) => (
              <li key={entry.key}>
                <AppointmentChip
                  entry={entry}
                  onSelect={onSelect}
                  data-ocid={`admin.calendar.agenda_item.${groupIndex + 1}.${index + 1}`}
                />
              </li>
            ))}
          </ul>
        </AdminCard>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Appointment detail                                                  */
/* ------------------------------------------------------------------ */

function DetailRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span
        aria-hidden="true"
        className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-[oklch(var(--admin-surface-alt))] text-[oklch(var(--admin-primary))]"
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="admin-label">{label}</p>
        <div className="mt-0.5 text-base text-[oklch(var(--admin-foreground))]">
          {children}
        </div>
      </div>
    </div>
  );
}

function AppointmentDetail({
  entry,
  onClose,
}: {
  entry: CalendarEntry;
  onClose: () => void;
}) {
  const service = getService(entry.category);
  const depositMeta = entry.deposit
    ? getDepositStatusMeta(entry.deposit.status)
    : null;
  const quote = entry.quote;
  const quoteMeta = quote ? getQuoteStatusMeta(quote.status) : null;

  return (
    <div
      data-ocid="admin.calendar.detail_dialog"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"
    >
      <button
        type="button"
        aria-label="Close appointment details"
        data-ocid="admin.calendar.detail_backdrop"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />
      <dialog
        open
        aria-label={`Appointment for ${entry.customerName}`}
        className="admin-shell fixed inset-0 z-10 m-0 flex h-full max-h-none w-full max-w-none items-end justify-center border-0 bg-transparent p-0 sm:items-center sm:p-4"
      >
        <div className="relative z-10 max-h-[90dvh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface))] p-5 shadow-xl sm:rounded-2xl sm:p-6">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="admin-label">Appointment</p>
              <h2 className="mt-1 text-xl font-bold text-[oklch(var(--admin-foreground))] sm:text-2xl">
                {entry.customerName}
              </h2>
              <p className="mt-1 font-mono text-sm text-[oklch(var(--admin-muted-foreground))]">
                {formatReference(entry.referenceCode)} · {service.label}
              </p>
            </div>
            <AdminButton
              variant="secondary"
              size="sm"
              data-ocid="admin.calendar.detail_close_button"
              onClick={onClose}
            >
              Close
            </AdminButton>
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-2">
            <AdminStatusBadge
              tone={entry.status.tone}
              label={entry.status.label}
              dot
              data-ocid="admin.calendar.detail_status"
            />
            {entry.depositVerified ? (
              <AdminChip data-ocid="admin.calendar.detail_booked_chip">
                Confirmed &amp; booked
              </AdminChip>
            ) : (
              <AdminChip data-ocid="admin.calendar.detail_awaiting_chip">
                Awaiting deposit
              </AdminChip>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <DetailRow icon={<Clock className="size-4" />} label="Scheduled">
              {formatDateTime(entry.scheduledAt)}
            </DetailRow>
            <DetailRow icon={<User className="size-4" />} label="Customer">
              {entry.customerId !== null ? (
                <a
                  href={`/admin/customers/${entry.customerId.toString()}`}
                  data-ocid="admin.calendar.detail_customer_link"
                  className="font-semibold text-[oklch(var(--admin-primary))] underline-offset-4 hover:underline"
                >
                  {entry.customerName}
                </a>
              ) : (
                entry.customerName
              )}
            </DetailRow>
            <DetailRow icon={<FileText className="size-4" />} label="Request">
              <span className="font-mono">
                {formatReference(entry.referenceCode)}
              </span>
            </DetailRow>
            <DetailRow
              icon={<MapPin className="size-4" />}
              label="Service address"
            >
              {entry.customer?.serviceAddress ??
                "Address on the customer record"}
            </DetailRow>
            {entry.customer?.phone && (
              <DetailRow icon={<Phone className="size-4" />} label="Phone">
                <a
                  href={`tel:${entry.customer.phone}`}
                  className="font-semibold text-[oklch(var(--admin-primary))] underline-offset-4 hover:underline"
                >
                  {entry.customer.phone}
                </a>
              </DetailRow>
            )}
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="admin-card-alt rounded-xl p-4">
              <p className="admin-label">Quote</p>
              {quote && quoteMeta ? (
                <div className="mt-2 flex flex-col gap-2">
                  <AdminStatusBadge
                    tone="approved"
                    label={quoteMeta.label}
                    dot
                  />
                  <p className="font-mono text-lg font-bold text-[oklch(var(--admin-foreground))]">
                    {formatMoney(quoteTotal(quote))}
                  </p>
                  <p className="text-sm text-[oklch(var(--admin-muted-foreground))]">
                    {quote.quoteNumber || "Quote on file"}
                  </p>
                </div>
              ) : (
                <p className="mt-2 text-base text-[oklch(var(--admin-muted-foreground))]">
                  No quote attached yet.
                </p>
              )}
            </div>

            <div className="admin-card-alt rounded-xl p-4">
              <p className="admin-label">Deposit</p>
              {entry.deposit && depositMeta ? (
                <div className="mt-2 flex flex-col gap-2">
                  <AdminStatusBadge
                    tone={depositMeta.tone}
                    label={depositMeta.label}
                    dot
                  />
                  <p className="font-mono text-lg font-bold text-[oklch(var(--admin-foreground))]">
                    {formatMoney(entry.deposit.amount)}
                  </p>
                  <p className="text-sm text-[oklch(var(--admin-muted-foreground))]">
                    {depositMeta.description}
                  </p>
                </div>
              ) : (
                <p className="mt-2 text-base text-[oklch(var(--admin-muted-foreground))]">
                  No deposit required yet.
                </p>
              )}
            </div>
          </div>

          <div className="mt-5">
            <p className="admin-label">Job</p>
            {entry.jobRecord ? (
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <AdminStatusBadge
                  tone={entry.status.tone}
                  label={entry.status.label}
                  dot
                />
                <AdminChip>
                  <Receipt className="size-3.5" aria-hidden="true" />
                  {entry.jobRecord.remainingBalance > 0n
                    ? `${formatMoney(entry.jobRecord.remainingBalance)} remaining`
                    : "Balance settled"}
                </AdminChip>
              </div>
            ) : (
              <p className="mt-2 text-base text-[oklch(var(--admin-muted-foreground))]">
                No job record created yet — this appointment is still a request.
              </p>
            )}
          </div>
        </div>
      </dialog>
    </div>
  );
}
