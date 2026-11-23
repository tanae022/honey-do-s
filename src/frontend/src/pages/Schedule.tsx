import {
  type CustomerSummary,
  type JobRequestInput,
  type JobRequestView,
  JobStatus,
  ServiceCategory,
  createActor,
} from "@/backend";
import { HexStatus } from "@/components/honey/HexStatus";
import { HexTile } from "@/components/honey/HexTile";
import { HoneyButton } from "@/components/honey/HoneyButton";
import { HoneyCard } from "@/components/honey/HoneyCard";
import { HoneyLoader } from "@/components/honey/HoneyLoader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCustomers } from "@/hooks/useCustomers";
import {
  useIsAdmin,
  useJobRequests,
  useScheduleAppointment,
} from "@/hooks/useJobs";
import {
  formatDateTime,
  formatReference,
  getStatusMeta,
  timestampToDate,
} from "@/lib/jobs";
import { SERVICES, getService } from "@/lib/services";
import { cn } from "@/lib/utils";
import { useActor, useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CalendarClock,
  CalendarPlus,
  Check,
  ChevronLeft,
  ChevronRight,
  Flower2,
  Lightbulb,
  Package,
  PaintRoller,
  ShieldAlert,
  ShoppingBag,
  Sparkles,
  Sprout,
  Wrench,
} from "lucide-react";
import type { ComponentType } from "react";
import { useMemo, useState } from "react";

const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  Wrench,
  PaintRoller,
  Sprout,
  Flower2,
  Sparkles,
  Package,
  ShoppingBag,
  Lightbulb,
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Motoko Time.now() is nanoseconds; a datetime-local value is local ms. */
function localInputToTimestamp(value: string): bigint | null {
  if (value.trim().length === 0) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return BigInt(date.getTime()) * 1_000_000n;
}

/** Whether a job is still open to receive a new appointment. */
function isSchedulable(job: JobRequestView): boolean {
  return (
    job.status === JobStatus.requested ||
    job.status === JobStatus.quoted ||
    job.status === JobStatus.scheduled
  );
}

/**
 * Admin scheduling area.
 *
 * A month calendar of every appointment plus six status lists — upcoming
 * appointments, pending requests, approved appointments, jobs in progress,
 * completed and cancelled work. The scheduling form links each new appointment
 * to the chosen customer's record so it also appears on their profile.
 */
export function SchedulePage() {
  const { data: isAdmin, isLoading: roleLoading } = useIsAdmin();
  const { login, loginStatus } = useInternetIdentity();

  if (roleLoading) {
    return (
      <div className="px-5 py-16 sm:px-8">
        <HoneyCard className="mx-auto max-w-md">
          <HoneyLoader
            data-ocid="schedule.loading_state"
            label="Checking access"
          />
        </HoneyCard>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="animate-page-enter px-5 py-16 sm:px-8">
        <HoneyCard className="mx-auto max-w-md text-center">
          <span className="relative mx-auto flex size-14 items-center justify-center">
            <span
              aria-hidden="true"
              className="hex-clip absolute inset-0 bg-gradient-to-b from-primary/50 to-primary/10"
            />
            <ShieldAlert className="relative z-10 size-6 text-primary" />
          </span>
          <h1 className="text-outline-black-strong mt-5 font-display text-2xl font-bold text-foreground">
            Admin access required
          </h1>
          <p className="text-outline-black mt-3 text-sm text-muted-foreground">
            Sign in with an administrator identity to open the schedule.
          </p>
          {loginStatus !== "success" && (
            <button
              type="button"
              data-ocid="schedule.login_button"
              onClick={() => login()}
              className="honey-surface text-outline-black mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-accent/40 px-6 font-semibold text-primary-foreground transition-smooth hover:-translate-y-0.5"
            >
              Sign in
            </button>
          )}
        </HoneyCard>
      </div>
    );
  }

  return <ScheduleBody />;
}

function ScheduleBody() {
  const jobsQuery = useJobRequests();
  const jobs = jobsQuery.data ?? [];

  const groups = useMemo(() => {
    const now = Date.now();
    const upcoming: JobRequestView[] = [];
    const pending: JobRequestView[] = [];
    const approved: JobRequestView[] = [];
    const inProgress: JobRequestView[] = [];
    const completed: JobRequestView[] = [];
    const cancelled: JobRequestView[] = [];

    for (const job of jobs) {
      if (job.status === JobStatus.cancelled) {
        cancelled.push(job);
        continue;
      }
      if (job.status === JobStatus.completed) {
        completed.push(job);
        continue;
      }
      if (job.status === JobStatus.inProgress) {
        inProgress.push(job);
        continue;
      }
      if (job.status === JobStatus.requested) {
        pending.push(job);
        continue;
      }
      if (job.status === JobStatus.scheduled) {
        approved.push(job);
        const at = job.appointment
          ? timestampToDate(job.appointment.scheduledAt)
          : null;
        if (at && at.getTime() >= now) upcoming.push(job);
        continue;
      }
      if (job.status === JobStatus.quoted) {
        pending.push(job);
      }
    }

    upcoming.sort((a, b) =>
      (a.appointment?.scheduledAt ?? 0n) < (b.appointment?.scheduledAt ?? 0n)
        ? -1
        : 1,
    );

    return { upcoming, pending, approved, inProgress, completed, cancelled };
  }, [jobs]);

  return (
    <div
      data-ocid="schedule.page"
      className="animate-page-enter mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14"
    >
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          Admin
        </p>
        <h1 className="text-outline-black-strong mt-2 font-display text-3xl font-bold text-gold-gradient sm:text-4xl">
          Schedule
        </h1>
        <p className="text-outline-black mt-2 max-w-2xl text-sm text-muted-foreground">
          Upcoming appointments, pending requests, approved visits, jobs in
          progress, completed and cancelled work — all linked to the right
          customer.
        </p>
      </header>

      {jobsQuery.isLoading ? (
        <HoneyCard>
          <HoneyLoader
            data-ocid="schedule.board_loading_state"
            label="Loading the schedule"
          />
        </HoneyCard>
      ) : (
        <div className="flex flex-col gap-8">
          <ScheduleForm jobs={jobs} />
          <CalendarView jobs={jobs} />
          <StatusLists groups={groups} />
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Schedule form — customer + service + date/time                      */
/* ------------------------------------------------------------------ */

function ScheduleForm({ jobs }: { jobs: JobRequestView[] }) {
  const customersQuery = useCustomers();
  const customers = customersQuery.data ?? [];
  const scheduleAppointment = useScheduleAppointment();
  const queryClient = useQueryClient();
  const { actor } = useActor(createActor);

  const createJob = useMutation({
    mutationFn: async (vars: {
      customerId: bigint;
      input: JobRequestInput;
    }) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.createJobForCustomer(vars.customerId, vars.input);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["jobs"] });
      void queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });

  const [customerId, setCustomerId] = useState<string>("");
  const [category, setCategory] = useState<ServiceCategory>(
    ServiceCategory.fixIt,
  );
  const [when, setWhen] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  const selectedCustomer: CustomerSummary | null = useMemo(
    () => customers.find((c) => c.id.toString() === customerId) ?? null,
    [customers, customerId],
  );

  const pending = scheduleAppointment.isPending || createJob.isPending;

  const handleSave = () => {
    if (!selectedCustomer) {
      setError("Choose the customer this appointment is for.");
      return;
    }
    const scheduledAt = localInputToTimestamp(when);
    if (scheduledAt === null) {
      setError("Enter the date and time for the visit.");
      return;
    }
    setError(null);
    setSaved(null);

    const existing = jobs.find(
      (job) =>
        job.customerName === selectedCustomer.fullName && isSchedulable(job),
    );

    const finish = (referenceCode: string) => {
      setSaved(referenceCode);
      setWhen("");
    };

    if (existing) {
      scheduleAppointment.mutate(
        { id: existing.id, scheduledAt },
        {
          onSuccess: (result) => {
            if (result.__kind__ === "ok") {
              finish(result.ok.referenceCode);
            } else {
              setError(
                result.err.__kind__ === "invalidState"
                  ? result.err.invalidState
                  : "We couldn't save that appointment. Please try again.",
              );
            }
          },
          onError: () =>
            setError("We couldn't save that appointment. Please try again."),
        },
      );
      return;
    }

    createJob.mutate(
      {
        customerId: selectedCustomer.id,
        input: {
          customerName: selectedCustomer.fullName,
          email: selectedCustomer.email,
          phone: selectedCustomer.phone,
          preferredTiming: formatDateTime(scheduledAt),
          description: `${getService(category).label} visit scheduled from the admin schedule.`,
          photoIds: [],
          category,
          packageInterest: false,
          ownParts: false,
        },
      },
      {
        onSuccess: (result) => {
          if (result.__kind__ !== "ok") {
            setError(
              result.err.__kind__ === "invalidState"
                ? result.err.invalidState
                : "We couldn't create that appointment. Please try again.",
            );
            return;
          }
          scheduleAppointment.mutate(
            { id: result.ok.id, scheduledAt },
            {
              onSuccess: (scheduled) => {
                if (scheduled.__kind__ === "ok") {
                  finish(scheduled.ok.referenceCode);
                } else {
                  setError(
                    "The request was created but the time could not be saved.",
                  );
                }
              },
              onError: () =>
                setError(
                  "The request was created but the time could not be saved.",
                ),
            },
          );
        },
        onError: () =>
          setError("We couldn't create that appointment. Please try again."),
      },
    );
  };

  return (
    <HoneyCard data-ocid="schedule.form_panel">
      <div className="mb-4 flex items-center gap-3">
        <span
          aria-hidden="true"
          className="hex-clip flex size-10 items-center justify-center bg-primary/15 text-primary"
        >
          <CalendarPlus className="size-5" />
        </span>
        <div>
          <h2 className="text-outline-black-strong font-display text-lg font-semibold text-foreground">
            Schedule an appointment
          </h2>
          <p className="text-outline-black text-sm text-muted-foreground">
            Pick a customer, choose the service, then set the date and time.
          </p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div>
            <Label htmlFor="schedule-customer">Customer</Label>
            <select
              id="schedule-customer"
              data-ocid="schedule.customer_select"
              value={customerId}
              onChange={(event) => {
                setCustomerId(event.target.value);
                setError(null);
                setSaved(null);
              }}
              className="form-field mt-2 min-h-12 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Choose a customer…</option>
              {customers.map((customer) => (
                <option
                  key={customer.id.toString()}
                  value={customer.id.toString()}
                >
                  {customer.fullName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="schedule-when">Date and time</Label>
            <Input
              id="schedule-when"
              type="datetime-local"
              data-ocid="schedule.datetime_input"
              value={when}
              onChange={(event) => {
                setWhen(event.target.value);
                setError(null);
                setSaved(null);
              }}
              className="mt-2 min-h-12"
            />
          </div>

          {selectedCustomer && (
            <p
              data-ocid="schedule.customer_summary"
              className="honey-panel-raised rounded-xl px-4 py-3 text-sm text-muted-foreground"
            >
              <span className="font-semibold text-foreground">
                {selectedCustomer.fullName}
              </span>
              <br />
              {selectedCustomer.serviceAddress}
            </p>
          )}
        </div>

        <fieldset>
          <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Choose a service
          </legend>
          <div
            data-ocid="schedule.service_grid"
            className="grid grid-cols-2 gap-3 sm:grid-cols-4"
          >
            {SERVICES.map((service, index) => {
              const Icon = ICONS[service.icon] ?? Wrench;
              return (
                <HexTile
                  key={service.category}
                  data-ocid={`schedule.service_tile.${index + 1}`}
                  label={service.label}
                  icon={<Icon className="size-5" />}
                  selected={category === service.category}
                  onClick={() => setCategory(service.category)}
                />
              );
            })}
          </div>
        </fieldset>
      </div>

      {error && (
        <p
          data-ocid="schedule.form_error_state"
          className="mt-4 text-sm text-destructive"
        >
          {error}
        </p>
      )}

      {saved && (
        <p
          data-ocid="schedule.form_success_state"
          className="mt-4 rounded-xl border border-success/50 bg-success/10 px-4 py-3 text-sm text-success"
        >
          Appointment saved — reference{" "}
          <span className="font-mono font-semibold">
            {formatReference(saved)}
          </span>
          . It now appears on the customer&apos;s profile.
        </p>
      )}

      <HoneyButton
        size="md"
        data-ocid="schedule.save_button"
        disabled={pending}
        onClick={handleSave}
        className="mt-5 w-full sm:w-auto"
      >
        <Check className="size-4" />
        {pending ? "Saving…" : "Save appointment"}
      </HoneyButton>
    </HoneyCard>
  );
}

/* ------------------------------------------------------------------ */
/* Calendar view                                                       */
/* ------------------------------------------------------------------ */

function CalendarView({ jobs }: { jobs: JobRequestView[] }) {
  const [monthOffset, setMonthOffset] = useState(0);

  const { cells, monthLabel, scheduledDays } = useMemo(() => {
    const base = new Date();
    const monthStart = new Date(
      base.getFullYear(),
      base.getMonth() + monthOffset,
      1,
    );
    const year = monthStart.getFullYear();
    const month = monthStart.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const dayMap = new Map<number, JobRequestView[]>();
    for (const job of jobs) {
      if (!job.appointment) continue;
      const at = timestampToDate(job.appointment.scheduledAt);
      if (!at || at.getFullYear() !== year || at.getMonth() !== month) continue;
      const list = dayMap.get(at.getDate()) ?? [];
      list.push(job);
      dayMap.set(at.getDate(), list);
    }

    const grid: (number | null)[] = [];
    for (let i = 0; i < firstWeekday; i += 1) grid.push(null);
    for (let day = 1; day <= daysInMonth; day += 1) grid.push(day);
    while (grid.length % 7 !== 0) grid.push(null);

    return {
      cells: grid,
      monthLabel: monthStart.toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
      }),
      scheduledDays: dayMap,
    };
  }, [jobs, monthOffset]);

  return (
    <HoneyCard data-ocid="schedule.calendar_panel">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="hex-clip flex size-10 items-center justify-center bg-primary/15 text-primary"
          >
            <CalendarClock className="size-5" />
          </span>
          <h2 className="text-outline-black-strong font-display text-lg font-semibold text-foreground">
            {monthLabel}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            data-ocid="schedule.calendar_prev_button"
            aria-label="Previous month"
            onClick={() => setMonthOffset((value) => value - 1)}
            className="flex size-10 items-center justify-center rounded-full border border-border bg-secondary/60 text-foreground transition-smooth hover:border-primary/50"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            data-ocid="schedule.calendar_next_button"
            aria-label="Next month"
            onClick={() => setMonthOffset((value) => value + 1)}
            className="flex size-10 items-center justify-center rounded-full border border-border bg-secondary/60 text-foreground transition-smooth hover:border-primary/50"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="pb-1 text-center text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground"
          >
            {day}
          </div>
        ))}
        {cells.map((day, index) => {
          const dayJobs = day === null ? [] : (scheduledDays.get(day) ?? []);
          return (
            <div
              key={day === null ? `blank-${index}` : `day-${day}`}
              data-ocid={
                day === null ? undefined : `schedule.calendar_day.${day}`
              }
              className={cn(
                "min-h-16 rounded-lg border p-1.5 text-xs",
                day === null
                  ? "border-transparent"
                  : dayJobs.length > 0
                    ? "border-primary/50 bg-primary/10"
                    : "border-border/60 bg-muted/15",
              )}
            >
              {day !== null && (
                <>
                  <span className="font-mono text-[0.7rem] text-muted-foreground">
                    {day}
                  </span>
                  <ul className="mt-1 flex flex-col gap-1">
                    {dayJobs.slice(0, 2).map((job) => (
                      <li
                        key={job.id.toString()}
                        className="truncate rounded bg-primary/20 px-1 py-0.5 text-[0.6rem] font-semibold text-primary"
                        title={`${job.customerName} · ${getService(job.category).label}`}
                      >
                        {job.customerName}
                      </li>
                    ))}
                    {dayJobs.length > 2 && (
                      <li className="text-[0.6rem] text-muted-foreground">
                        +{dayJobs.length - 2} more
                      </li>
                    )}
                  </ul>
                </>
              )}
            </div>
          );
        })}
      </div>
    </HoneyCard>
  );
}

/* ------------------------------------------------------------------ */
/* Status lists                                                        */
/* ------------------------------------------------------------------ */

interface ScheduleGroups {
  upcoming: JobRequestView[];
  pending: JobRequestView[];
  approved: JobRequestView[];
  inProgress: JobRequestView[];
  completed: JobRequestView[];
  cancelled: JobRequestView[];
}

function StatusLists({ groups }: { groups: ScheduleGroups }) {
  const sections: {
    key: keyof ScheduleGroups;
    title: string;
    description: string;
    jobs: JobRequestView[];
  }[] = [
    {
      key: "upcoming",
      title: "Upcoming appointments",
      description: "Confirmed visits still ahead on the calendar.",
      jobs: groups.upcoming,
    },
    {
      key: "pending",
      title: "Pending service requests",
      description: "New requests awaiting a quote or a time.",
      jobs: groups.pending,
    },
    {
      key: "approved",
      title: "Approved appointments",
      description: "Quotes approved and scheduled with the customer.",
      jobs: groups.approved,
    },
    {
      key: "inProgress",
      title: "Jobs in progress",
      description: "Work underway right now.",
      jobs: groups.inProgress,
    },
    {
      key: "completed",
      title: "Completed jobs",
      description: "Finished Honey Do's.",
      jobs: groups.completed,
    },
    {
      key: "cancelled",
      title: "Cancelled jobs",
      description: "Requests that were cancelled.",
      jobs: groups.cancelled,
    },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {sections.map((section) => (
        <HoneyCard key={section.key} data-ocid={`schedule.list.${section.key}`}>
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-outline-black-strong font-display text-lg font-semibold text-foreground">
                {section.title}
              </h2>
              <p className="text-outline-black mt-1 text-sm text-muted-foreground">
                {section.description}
              </p>
            </div>
            <HexStatus
              data-ocid={`schedule.list_count.${section.key}`}
              label={`${section.jobs.length}`}
            />
          </div>

          {section.jobs.length === 0 ? (
            <p
              data-ocid={`schedule.list_empty.${section.key}`}
              className="rounded-xl border border-dashed border-border/80 bg-muted/20 px-4 py-6 text-center text-sm text-muted-foreground"
            >
              Nothing here yet.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {section.jobs.map((job, index) => (
                <ScheduleRow
                  key={job.id.toString()}
                  job={job}
                  section={section.key}
                  index={index + 1}
                />
              ))}
            </ul>
          )}
        </HoneyCard>
      ))}
    </div>
  );
}

function ScheduleRow({
  job,
  section,
  index,
}: {
  job: JobRequestView;
  section: string;
  index: number;
}) {
  const service = getService(job.category);
  const status = getStatusMeta(job.status);
  const Icon = ICONS[service.icon] ?? Wrench;

  return (
    <li
      data-ocid={`schedule.item.${section}.${index}`}
      className="crm-row rounded-xl border border-border/70 p-4"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span
            aria-hidden="true"
            className="hex-clip flex size-9 shrink-0 items-center justify-center bg-primary/15 text-primary"
          >
            <Icon className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate font-display text-base font-semibold text-foreground">
              {job.customerName}
            </p>
            <p className="mt-0.5 font-mono text-xs text-muted-foreground">
              {formatReference(job.referenceCode)} · {service.label}
            </p>
          </div>
        </div>
        <HexStatus
          data-ocid={`schedule.item_status.${section}.${index}`}
          label={status.label}
          toneClass={status.chipClass}
        />
      </div>

      {job.appointment ? (
        <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarClock className="size-4 text-primary" aria-hidden="true" />
          {formatDateTime(job.appointment.scheduledAt)} ·{" "}
          {job.appointment.confirmed ? "confirmed" : "awaiting confirmation"}
        </p>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">
          No appointment time set yet.
        </p>
      )}
    </li>
  );
}
