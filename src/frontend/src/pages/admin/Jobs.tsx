import {
  JobRecordStatus,
  type JobRecordView,
  type JobRequestView,
  type PaymentMethod,
  createActor,
} from "@/backend";
import {
  AdminButton,
  AdminCard,
  AdminCardHeader,
  type AdminColumn,
  AdminDataTable,
  AdminEmptyState,
  AdminErrorState,
  AdminField,
  AdminInput,
  AdminLoadingState,
  AdminPageHeader,
  AdminSelect,
  AdminShell,
  AdminStatCard,
  AdminStatusBadge,
} from "@/components/admin";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useAdvanceJobRecord,
  useCancelJobRecord,
  useCompleteJobRecord,
  useCreateJobRecord,
  useJobRecords,
  useRecordFinalPayment,
} from "@/hooks/useAdminSettings";
import { useCustomers } from "@/hooks/useCustomers";
import { useIsAdmin, useJobRequests } from "@/hooks/useJobs";
import {
  PAYMENT_METHODS,
  adminStatusForJobRecord,
  formatPricingAmount,
  getDepositStatusMeta,
  paymentMethodLabel,
  pricingFromQuotePricing,
  pricingRows,
} from "@/lib/admin";
import {
  formatDate,
  formatMoney,
  formatReference,
  quoteTotal,
  timestampToDate,
} from "@/lib/jobs";
import { getService } from "@/lib/services";
import { cn } from "@/lib/utils";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import {
  BadgeCheck,
  Ban,
  CalendarPlus,
  CheckCircle2,
  ClipboardList,
  LogIn,
  ShieldAlert,
  Wallet,
} from "lucide-react";
import { useMemo, useState } from "react";

/* ------------------------------------------------------------------ */
/* Date / time helpers                                                 */
/* ------------------------------------------------------------------ */

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

/** Short clock label for a scheduled timestamp, e.g. "9:30 AM". */
function timeLabel(timestamp: bigint): string {
  const date = timestampToDate(timestamp);
  if (!date) return "—";
  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

/** Human copy for a backend `JobError`. */
function describeJobError(error: unknown): string {
  if (error && typeof error === "object" && "__kind__" in error) {
    const kind = (error as { __kind__: string }).__kind__;
    switch (kind) {
      case "notAuthorized":
        return "You are not authorized to change this job.";
      case "notFound":
        return "That job could not be found.";
      case "invalidState":
        return "This job cannot be changed in its current state.";
      case "paymentError":
        return "The payment step failed. Please try again.";
      default:
        return "Something went wrong. Please try again.";
    }
  }
  return "Something went wrong. Please try again.";
}

/* ------------------------------------------------------------------ */
/* Status filter                                                       */
/* ------------------------------------------------------------------ */

type JobFilter = "all" | "active" | "completed" | "cancelled";

const JOB_FILTERS: { key: JobFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

/**
 * The status filter the dashboard's count link asked for, if any.
 *
 * Read straight from `window.location.search` so the link works on the plain
 * `/admin/jobs` route without a `validateSearch` contract.
 */
function initialJobFilter(): JobFilter {
  if (typeof window === "undefined") return "all";
  const value = new URLSearchParams(window.location.search).get("status");
  return value === "active" || value === "completed" || value === "cancelled"
    ? value
    : "all";
}

/** Whether a job record belongs in the currently selected filter. */
function matchesJobFilter(record: JobRecordView, filter: JobFilter): boolean {
  if (filter === "all") return true;
  if (filter === "active") {
    return (
      record.status !== JobRecordStatus.completed &&
      record.status !== JobRecordStatus.cancelled
    );
  }
  if (filter === "completed") {
    return record.status === JobRecordStatus.completed;
  }
  return record.status === JobRecordStatus.cancelled;
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

/**
 * Admin Jobs page.
 *
 * A clean, light, high-contrast workspace over the job records: create a job
 * from a confirmed request or quote, advance it through its statuses to
 * completion (or cancel it), and record the final payment so the remaining
 * balance settles to zero.
 */
export function JobsPage() {
  const { data: isAdmin, isLoading: roleLoading } = useIsAdmin();
  const { login, loginStatus } = useInternetIdentity();

  if (roleLoading) {
    return (
      <AdminShell>
        <AdminLoadingState
          data-ocid="admin.jobs.loading_state"
          label="Checking access"
        />
      </AdminShell>
    );
  }

  if (!isAdmin) {
    return (
      <AdminShell>
        <AdminCard className="mx-auto max-w-md text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-[oklch(var(--admin-surface-alt))] text-[oklch(var(--admin-primary))]">
            <ShieldAlert className="size-6" />
          </span>
          <h1 className="mt-4 text-xl font-bold text-[oklch(var(--admin-foreground))]">
            Admin access required
          </h1>
          <p className="mt-2 text-base text-[oklch(var(--admin-muted-foreground))]">
            Sign in with an administrator identity to manage jobs.
          </p>
          {loginStatus !== "success" && (
            <AdminButton
              data-ocid="admin.jobs.login_button"
              className="mt-5 w-full sm:w-auto"
              onClick={() => login()}
            >
              <LogIn className="size-4" />
              Sign in
            </AdminButton>
          )}
        </AdminCard>
      </AdminShell>
    );
  }

  return <JobsBody />;
}

function JobsBody() {
  const recordsQuery = useJobRecords();
  const requestsQuery = useJobRequests();
  const customersQuery = useCustomers(true);
  const [selected, setSelected] = useState<JobRecordView | null>(null);
  const [statusFilter, setStatusFilter] = useState<JobFilter>(initialJobFilter);

  const records = recordsQuery.data ?? [];
  const requests = requestsQuery.data ?? [];

  const visibleRecords = useMemo(
    () => records.filter((record) => matchesJobFilter(record, statusFilter)),
    [records, statusFilter],
  );

  /** Address lookup by normalized customer email, since records omit it. */
  const addressByEmail = useMemo(() => {
    const map = new Map<string, string>();
    for (const customer of customersQuery.data ?? []) {
      const key = customer.email.trim().toLowerCase();
      if (key.length > 0 && customer.serviceAddress.trim().length > 0) {
        map.set(key, customer.serviceAddress);
      }
    }
    return map;
  }, [customersQuery.data]);

  /** Requests that already have a job record, so they cannot be re-created. */
  const usedRequestIds = useMemo(
    () => new Set(records.map((record) => record.jobRequestId.toString())),
    [records],
  );

  /** Confirmed requests/quotes eligible to become a job. */
  const eligibleRequests = useMemo(
    () =>
      requests.filter(
        (request) =>
          request.quote !== undefined &&
          !usedRequestIds.has(request.id.toString()),
      ),
    [requests, usedRequestIds],
  );

  const stats = useMemo(() => {
    const active = records.filter(
      (record) =>
        record.status !== JobRecordStatus.completed &&
        record.status !== JobRecordStatus.cancelled,
    ).length;
    const completed = records.filter(
      (record) => record.status === JobRecordStatus.completed,
    ).length;
    const outstanding = records.reduce(
      (sum, record) =>
        record.status === JobRecordStatus.cancelled
          ? sum
          : sum + record.remainingBalance,
      0n,
    );
    return { total: records.length, active, completed, outstanding };
  }, [records]);

  const columns: AdminColumn<JobRecordView>[] = [
    {
      key: "customer",
      header: "Customer",
      cell: (record) => (
        <span className="font-semibold text-[oklch(var(--admin-foreground))]">
          {record.customerName}
        </span>
      ),
    },
    {
      key: "service",
      header: "Service",
      cell: (record) => getService(record.category).label,
    },
    {
      key: "address",
      header: "Address",
      hideOnMobile: true,
      cell: (record) => (
        <span className="block max-w-[14rem] truncate">
          {record.serviceAddress || "—"}
        </span>
      ),
    },
    {
      key: "date",
      header: "Date",
      cell: (record) => formatDate(record.scheduledAt),
    },
    {
      key: "time",
      header: "Time",
      cell: (record) => timeLabel(record.scheduledAt),
    },
    {
      key: "quote",
      header: "Quote",
      align: "right",
      cell: (record) => formatMoney(recordQuoteTotal(record)),
    },
    {
      key: "discount",
      header: "Discount",
      align: "right",
      hideOnMobile: true,
      cell: (record) => {
        const amount = record.pricing?.discountAmount ?? 0n;
        return amount > 0n ? `−${formatMoney(amount)}` : "—";
      },
    },
    {
      key: "deposit",
      header: "Deposit",
      align: "right",
      hideOnMobile: true,
      cell: (record) => formatMoney(recordDeposit(record)),
    },
    {
      key: "balance",
      header: "Balance",
      align: "right",
      cell: (record) => (
        <span
          className={cn(
            "font-semibold",
            record.remainingBalance > 0n
              ? "text-[oklch(var(--admin-status-action))]"
              : "text-[oklch(var(--admin-status-paid))]",
          )}
        >
          {formatMoney(record.remainingBalance)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (record) => {
        const meta = adminStatusForJobRecord(record.status);
        return (
          <AdminStatusBadge
            tone={meta.tone}
            label={meta.label}
            dot
            data-ocid={`admin.jobs.status.${record.id.toString()}`}
          />
        );
      },
    },
  ];

  return (
    <AdminShell>
      <AdminPageHeader
        eyebrow="Admin"
        title="Jobs"
        description="Create jobs from confirmed requests, move them through to completion and settle the final payment."
      />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <AdminStatCard
          data-ocid="admin.jobs.stat.total"
          label="Total jobs"
          value={stats.total.toString()}
          icon={<ClipboardList className="size-5" />}
        />
        <AdminStatCard
          data-ocid="admin.jobs.stat.active"
          label="Active"
          value={stats.active.toString()}
          icon={<CalendarPlus className="size-5" />}
        />
        <AdminStatCard
          data-ocid="admin.jobs.stat.completed"
          label="Completed"
          value={stats.completed.toString()}
          icon={<CheckCircle2 className="size-5" />}
        />
        <AdminStatCard
          data-ocid="admin.jobs.stat.outstanding"
          label="Outstanding"
          value={formatMoney(stats.outstanding)}
          icon={<Wallet className="size-5" />}
        />
      </div>

      <CreateJobCard
        eligibleRequests={eligibleRequests}
        addressByEmail={addressByEmail}
      />

      <AdminCard className="mt-6">
        <AdminCardHeader
          title="Job records"
          description="Tap a job to advance it, cancel it or record the final payment."
        />
        <div
          data-ocid="admin.jobs.filter.tabs"
          className="mb-5 flex flex-wrap gap-2"
        >
          {JOB_FILTERS.map((option) => {
            const active = statusFilter === option.key;
            return (
              <button
                key={option.key}
                type="button"
                data-ocid={`admin.jobs.filter.${option.key}`}
                aria-pressed={active}
                onClick={() => setStatusFilter(option.key)}
                className={cn(
                  "inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-base font-semibold transition-smooth",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(var(--admin-ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[oklch(var(--admin-bg))]",
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
        {recordsQuery.isLoading ? (
          <AdminLoadingState
            data-ocid="admin.jobs.records_loading_state"
            label="Loading jobs"
          />
        ) : recordsQuery.isError ? (
          <AdminErrorState
            data-ocid="admin.jobs.error_state"
            message="We could not load the job records."
            onRetry={() => void recordsQuery.refetch()}
          />
        ) : (
          <AdminDataTable
            data-ocid="admin.jobs.table"
            caption="Job records"
            columns={columns}
            rows={visibleRecords}
            rowKey={(record) => record.id.toString()}
            onRowClick={(record) => setSelected(record)}
            empty={
              <AdminEmptyState
                data-ocid="admin.jobs.empty_state"
                icon={<ClipboardList className="size-6" />}
                title={
                  statusFilter === "all"
                    ? "No jobs yet"
                    : "No jobs with this status"
                }
                description={
                  statusFilter === "all"
                    ? "Create a job from a confirmed request or quote to get started."
                    : "Try a different status filter to see other jobs."
                }
              />
            }
          />
        )}
      </AdminCard>

      <JobDetailDialog record={selected} onClose={() => setSelected(null)} />
    </AdminShell>
  );
}

/* ------------------------------------------------------------------ */
/* Create job                                                          */
/* ------------------------------------------------------------------ */

function CreateJobCard({
  eligibleRequests,
  addressByEmail,
}: {
  eligibleRequests: JobRequestView[];
  addressByEmail: Map<string, string>;
}) {
  const createJob = useCreateJobRecord();
  const [requestId, setRequestId] = useState("");
  const [dateValue, setDateValue] = useState("");
  const [timeValue, setTimeValue] = useState("09:00");
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const selectedRequest = useMemo(
    () =>
      eligibleRequests.find((request) => request.id.toString() === requestId) ??
      null,
    [eligibleRequests, requestId],
  );

  const handleCreate = (): void => {
    setError(null);
    setFeedback(null);
    if (!selectedRequest) {
      setError("Choose a confirmed request or quote to turn into a job.");
      return;
    }
    const scheduledAt = dateTimeToTimestamp(dateValue, timeValue);
    if (scheduledAt === null) {
      setError("Choose a valid date and time for the job.");
      return;
    }
    createJob.mutate(
      { jobId: selectedRequest.id, scheduledAt },
      {
        onSuccess: (result) => {
          if (result.__kind__ === "ok") {
            setFeedback(
              `Job created for ${result.ok.customerName}. It is now in the list below.`,
            );
            setRequestId("");
            setDateValue("");
            setTimeValue("09:00");
            return;
          }
          setError(describeJobError(result.err));
        },
        onError: () => setError("Something went wrong. Please try again."),
      },
    );
  };

  return (
    <AdminCard>
      <AdminCardHeader
        title="Create a job"
        description="Turn a confirmed request or approved quote into a scheduled job."
      />
      {eligibleRequests.length === 0 ? (
        <AdminEmptyState
          data-ocid="admin.jobs.create.empty_state"
          icon={<CalendarPlus className="size-6" />}
          title="No confirmed requests ready"
          description="A request appears here once it has a quote and no job record yet."
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-end">
          <AdminField label="Confirmed request or quote" htmlFor="job-request">
            <AdminSelect
              id="job-request"
              data-ocid="admin.jobs.create.request_select"
              value={requestId}
              onChange={(event) => setRequestId(event.target.value)}
            >
              <option value="">Choose a request…</option>
              {eligibleRequests.map((request) => (
                <option
                  key={request.id.toString()}
                  value={request.id.toString()}
                >
                  {request.customerName} · {getService(request.category).label}{" "}
                  · {formatReference(request.referenceCode)}
                </option>
              ))}
            </AdminSelect>
          </AdminField>

          <AdminField label="Job date" htmlFor="job-date">
            <AdminInput
              id="job-date"
              data-ocid="admin.jobs.create.date_input"
              type="date"
              value={dateValue}
              onChange={(event) => setDateValue(event.target.value)}
            />
          </AdminField>

          <AdminField label="Start time" htmlFor="job-time">
            <AdminInput
              id="job-time"
              data-ocid="admin.jobs.create.time_input"
              type="time"
              value={timeValue}
              onChange={(event) => setTimeValue(event.target.value)}
            />
          </AdminField>

          <AdminButton
            data-ocid="admin.jobs.create.submit_button"
            disabled={createJob.isPending}
            onClick={handleCreate}
          >
            <CalendarPlus className="size-4" />
            {createJob.isPending ? "Creating…" : "Create job"}
          </AdminButton>
        </div>
      )}

      {selectedRequest && (
        <dl className="mt-4 grid gap-3 rounded-xl border border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface-alt))] p-4 sm:grid-cols-3">
          <SummaryItem label="Customer" value={selectedRequest.customerName} />
          <SummaryItem
            label="Service address"
            value={
              addressByEmail.get(selectedRequest.email.trim().toLowerCase()) ||
              "Address on file with the customer record"
            }
          />
          <SummaryItem
            label="Quote total"
            value={formatMoney(quoteTotal(selectedRequest.quote))}
          />
        </dl>
      )}

      {error && (
        <p
          role="alert"
          data-ocid="admin.jobs.create.error_state"
          className="mt-4 text-base font-medium text-[oklch(var(--admin-status-action))]"
        >
          {error}
        </p>
      )}
      {feedback && (
        <p
          data-ocid="admin.jobs.create.success_state"
          className="mt-4 text-base font-medium text-[oklch(var(--admin-status-paid))]"
        >
          {feedback}
        </p>
      )}
    </AdminCard>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="admin-label">{label}</dt>
      <dd className="mt-1 break-words text-base font-semibold text-[oklch(var(--admin-foreground))]">
        {value}
      </dd>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Job detail + actions                                                */
/* ------------------------------------------------------------------ */

function JobDetailDialog({
  record,
  onClose,
}: {
  record: JobRecordView | null;
  onClose: () => void;
}) {
  const advance = useAdvanceJobRecord();
  const complete = useCompleteJobRecord();
  const cancel = useCancelJobRecord();
  const recordPayment = useRecordFinalPayment();

  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<PaymentMethod>(PAYMENT_METHODS[0]);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const open = record !== null;
  const statusMeta = record ? adminStatusForJobRecord(record.status) : null;
  const pricing = record ? pricingFromQuotePricing(record.pricing) : null;
  const depositMeta = record?.deposit
    ? getDepositStatusMeta(record.deposit.status)
    : null;
  const isTerminal =
    record?.status === JobRecordStatus.completed ||
    record?.status === JobRecordStatus.cancelled;
  const busy =
    advance.isPending ||
    complete.isPending ||
    cancel.isPending ||
    recordPayment.isPending;

  const reset = (): void => {
    setAmount("");
    setMethod(PAYMENT_METHODS[0]);
    setError(null);
    setFeedback(null);
  };

  const handleOpenChange = (next: boolean): void => {
    if (!next) {
      reset();
      onClose();
    }
  };

  const handleAdvance = (): void => {
    if (!record) return;
    setError(null);
    setFeedback(null);
    advance.mutate(record.id, {
      onSuccess: (result) => {
        if (result.__kind__ === "ok") {
          setFeedback("Job advanced to its next status.");
          return;
        }
        setError(describeJobError(result.err));
      },
      onError: () => setError("Something went wrong. Please try again."),
    });
  };

  const handleComplete = (): void => {
    if (!record) return;
    setError(null);
    setFeedback(null);
    complete.mutate(record.id, {
      onSuccess: (result) => {
        if (result.__kind__ === "ok") {
          setFeedback("Job marked completed.");
          return;
        }
        setError(describeJobError(result.err));
      },
      onError: () => setError("Something went wrong. Please try again."),
    });
  };

  const handleCancel = (): void => {
    if (!record) return;
    setError(null);
    setFeedback(null);
    cancel.mutate(record.id, {
      onSuccess: (result) => {
        if (result.__kind__ === "ok") {
          setFeedback("Job cancelled.");
          return;
        }
        setError(describeJobError(result.err));
      },
      onError: () => setError("Something went wrong. Please try again."),
    });
  };

  const handleRecordPayment = (): void => {
    if (!record) return;
    setError(null);
    setFeedback(null);
    const cents = dollarsToCents(amount);
    if (cents <= 0n) {
      setError("Enter the amount received before recording the payment.");
      return;
    }
    recordPayment.mutate(
      { jobId: record.jobRequestId, amount: cents, method },
      {
        onSuccess: (result) => {
          if (result.__kind__ === "ok") {
            setFeedback(
              `Payment recorded. Remaining balance is now ${formatMoney(
                result.ok.remainingBalance,
              )}.`,
            );
            setAmount("");
            return;
          }
          setError(describeJobError(result.err));
        },
        onError: () => setError("Something went wrong. Please try again."),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        data-ocid="admin.jobs.detail_dialog"
        className="admin-shell max-h-[90dvh] overflow-y-auto border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface))] text-[oklch(var(--admin-foreground))] sm:max-w-2xl"
      >
        {record && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-[oklch(var(--admin-foreground))]">
                {record.customerName}
              </DialogTitle>
              <DialogDescription className="text-base text-[oklch(var(--admin-muted-foreground))]">
                {getService(record.category).label} ·{" "}
                {formatReference(record.referenceCode)}
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-wrap items-center gap-2">
              {statusMeta && (
                <AdminStatusBadge
                  tone={statusMeta.tone}
                  label={statusMeta.label}
                  dot
                  data-ocid="admin.jobs.detail.status"
                />
              )}
              {depositMeta && (
                <AdminStatusBadge
                  tone={depositMeta.tone}
                  label={depositMeta.label}
                  data-ocid="admin.jobs.detail.deposit_status"
                />
              )}
            </div>

            <dl className="grid gap-3 rounded-xl border border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface-alt))] p-4 sm:grid-cols-2">
              <SummaryItem
                label="Service address"
                value={record.serviceAddress || "—"}
              />
              <SummaryItem
                label="Scheduled"
                value={`${formatDate(record.scheduledAt)} · ${timeLabel(
                  record.scheduledAt,
                )}`}
              />
              <SummaryItem
                label="Quote total"
                value={formatMoney(recordQuoteTotal(record))}
              />
              <SummaryItem
                label="Deposit"
                value={formatMoney(recordDeposit(record))}
              />
            </dl>

            {pricing && (
              <div className="rounded-xl border border-[oklch(var(--admin-border))] p-4">
                <h3 className="admin-label mb-3">Pricing breakdown</h3>
                <dl className="flex flex-col gap-2">
                  {pricingRows(pricing).map((row) => (
                    <div
                      key={row.key}
                      className="flex items-center justify-between gap-3"
                    >
                      <dt
                        className={cn(
                          "text-base",
                          row.emphasis
                            ? "font-semibold text-[oklch(var(--admin-foreground))]"
                            : "text-[oklch(var(--admin-muted-foreground))]",
                        )}
                      >
                        {row.label}
                      </dt>
                      <dd
                        className={cn(
                          "font-mono font-semibold",
                          row.emphasis
                            ? "text-lg text-[oklch(var(--admin-foreground))]"
                            : "text-base text-[oklch(var(--admin-foreground))]",
                        )}
                      >
                        {formatPricingAmount(row)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            <div className="rounded-xl border border-[oklch(var(--admin-border))] p-4">
              <h3 className="admin-label mb-3">Record final payment</h3>
              <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end">
                <AdminField
                  label="Amount received"
                  htmlFor="job-payment-amount"
                >
                  <AdminInput
                    id="job-payment-amount"
                    data-ocid="admin.jobs.payment.amount_input"
                    type="number"
                    min={0}
                    step="0.01"
                    inputMode="decimal"
                    placeholder={(
                      Number(record.remainingBalance) / 100
                    ).toFixed(2)}
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                  />
                </AdminField>
                <AdminField label="Payment method" htmlFor="job-payment-method">
                  <AdminSelect
                    id="job-payment-method"
                    data-ocid="admin.jobs.payment.method_select"
                    value={method}
                    onChange={(event) =>
                      setMethod(event.target.value as PaymentMethod)
                    }
                  >
                    {PAYMENT_METHODS.map((option) => (
                      <option key={option} value={option}>
                        {paymentMethodLabel(option)}
                      </option>
                    ))}
                  </AdminSelect>
                </AdminField>
                <AdminButton
                  data-ocid="admin.jobs.payment.submit_button"
                  disabled={busy}
                  onClick={handleRecordPayment}
                >
                  <Wallet className="size-4" />
                  {recordPayment.isPending ? "Recording…" : "Record payment"}
                </AdminButton>
              </div>
              <p className="mt-3 text-sm text-[oklch(var(--admin-muted-foreground))]">
                Remaining balance:{" "}
                <span className="font-semibold text-[oklch(var(--admin-foreground))]">
                  {formatMoney(record.remainingBalance)}
                </span>
              </p>
            </div>

            {error && (
              <p
                role="alert"
                data-ocid="admin.jobs.detail.error_state"
                className="text-base font-medium text-[oklch(var(--admin-status-action))]"
              >
                {error}
              </p>
            )}
            {feedback && (
              <p
                data-ocid="admin.jobs.detail.success_state"
                className="text-base font-medium text-[oklch(var(--admin-status-paid))]"
              >
                {feedback}
              </p>
            )}

            <div className="flex flex-wrap gap-3 border-t border-[oklch(var(--admin-border))] pt-4">
              <AdminButton
                data-ocid="admin.jobs.detail.advance_button"
                disabled={busy || isTerminal}
                onClick={handleAdvance}
              >
                <CalendarPlus className="size-4" />
                Advance status
              </AdminButton>
              <AdminButton
                variant="secondary"
                data-ocid="admin.jobs.detail.complete_button"
                disabled={busy || isTerminal}
                onClick={handleComplete}
              >
                <BadgeCheck className="size-4" />
                Mark completed
              </AdminButton>
              <AdminButton
                variant="danger"
                data-ocid="admin.jobs.detail.cancel_button"
                disabled={busy || isTerminal}
                onClick={handleCancel}
              >
                <Ban className="size-4" />
                Cancel job
              </AdminButton>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/* Small helpers                                                       */
/* ------------------------------------------------------------------ */

/** The job's quote total, preferring the stored pricing final total. */
function recordQuoteTotal(record: JobRecordView): bigint {
  if (record.pricing) return record.pricing.finalTotal;
  return quoteTotal(record.quote);
}

/** The job's deposit amount, preferring the stored pricing deposit. */
function recordDeposit(record: JobRecordView): bigint {
  if (record.pricing) return record.pricing.depositAmount;
  return record.deposit?.amount ?? 0n;
}

/** Dollars string → whole cents, tolerating blanks and stray characters. */
function dollarsToCents(value: string): bigint {
  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed) || parsed < 0) return 0n;
  return BigInt(Math.round(parsed * 100));
}
