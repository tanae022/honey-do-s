import type {
  CustomerSummary,
  JobRecordView,
  JobRequestView,
  PaymentHistory,
} from "@/backend";
import {
  AdminButton,
  AdminCard,
  AdminCardHeader,
  AdminChip,
  type AdminColumn,
  AdminDataTable,
  AdminEmptyState,
  AdminErrorState,
  AdminField,
  AdminLoadingState,
  AdminPageHeader,
  AdminShell,
  AdminStatusBadge,
  AdminTextarea,
} from "@/components/admin";
import { useJobRecords } from "@/hooks/useAdminSettings";
import { useAddCustomerNote, useCustomers } from "@/hooks/useCustomers";
import { useIsAdmin, useJobRequests } from "@/hooks/useJobs";
import {
  ADMIN_STATUS_ORDER,
  type AdminStatusKey,
  adminStatusForJob,
  getAdminStatusMeta,
  getDepositStatusMeta,
} from "@/lib/admin";
import {
  formatDateTime,
  formatMoney,
  formatReference,
  quoteRemainingBalance,
  quoteTotal,
} from "@/lib/jobs";
import { getService } from "@/lib/services";
import { cn } from "@/lib/utils";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Inbox, LogIn, ShieldAlert, X } from "lucide-react";
import { type FormEvent, type ReactNode, useMemo, useState } from "react";

/* ------------------------------------------------------------------ */
/* Derived request row                                                 */
/* ------------------------------------------------------------------ */

/**
 * A request joined to the customer record and payment history it belongs to.
 *
 * `JobRequestView` carries the customer's name, email and phone but no
 * customer id or service address, so the address and the note thread are
 * resolved by matching the request's email against the customer directory.
 */
interface RequestRow {
  job: JobRequestView;
  customer: CustomerSummary | null;
  jobRecord: JobRecordView | null;
  payment: PaymentHistory | null;
}

function buildRows(
  jobs: JobRequestView[],
  customers: CustomerSummary[],
  records: JobRecordView[],
  payments: PaymentHistory[],
): RequestRow[] {
  const byEmail = new Map<string, CustomerSummary>();
  for (const customer of customers) {
    const key = customer.email.trim().toLowerCase();
    if (key.length > 0 && !byEmail.has(key)) byEmail.set(key, customer);
  }
  const recordByJob = new Map<string, JobRecordView>();
  for (const record of records) {
    const key = record.jobRequestId.toString();
    if (!recordByJob.has(key)) recordByJob.set(key, record);
  }
  const paymentByJob = new Map<string, PaymentHistory>();
  for (const payment of payments) {
    const key = payment.jobRequestId.toString();
    if (!paymentByJob.has(key)) paymentByJob.set(key, payment);
  }

  return jobs.map((job) => ({
    job,
    customer: byEmail.get(job.email.trim().toLowerCase()) ?? null,
    jobRecord: recordByJob.get(job.id.toString()) ?? null,
    payment: paymentByJob.get(job.id.toString()) ?? null,
  }));
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

/**
 * Admin Requests page.
 *
 * A clean, high-contrast table of every incoming service request with its
 * customer, service, description, address, requested time, quote, discount,
 * deposit, balance, status and notes. The admin can filter by status and open
 * any request to see its full detail and linked quote, deposit, appointment
 * and job record.
 */
export function RequestsPage() {
  const { data: isAdmin, isLoading: roleLoading } = useIsAdmin();
  const { login, loginStatus } = useInternetIdentity();

  if (roleLoading) {
    return (
      <AdminShell>
        <AdminLoadingState
          data-ocid="admin.requests.loading_state"
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
            Sign in with an administrator identity to open the request
            workspace.
          </p>
          {loginStatus !== "success" && (
            <AdminButton
              data-ocid="admin.requests.login_button"
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

  return <RequestWorkspace />;
}

/**
 * The status filter the dashboard's count link asked for, if any.
 *
 * Read straight from `window.location.search` so the link works on the plain
 * `/admin/requests` route without a `validateSearch` contract.
 */
function initialStatusFilter(): AdminStatusKey | "all" {
  if (typeof window === "undefined") return "all";
  const value = new URLSearchParams(window.location.search).get("status");
  return value && (ADMIN_STATUS_ORDER as string[]).includes(value)
    ? (value as AdminStatusKey)
    : "all";
}

function RequestWorkspace() {
  const requestsQuery = useJobRequests();
  const customersQuery = useCustomers(true);
  const recordsQuery = useJobRecords();
  const [statusFilter, setStatusFilter] = useState<AdminStatusKey | "all">(
    initialStatusFilter,
  );
  const [openId, setOpenId] = useState<bigint | null>(null);

  const rows = useMemo(
    () =>
      buildRows(
        requestsQuery.data ?? [],
        customersQuery.data ?? [],
        recordsQuery.data ?? [],
        [],
      ),
    [requestsQuery.data, customersQuery.data, recordsQuery.data],
  );

  const counts = useMemo(() => {
    const map = new Map<AdminStatusKey, number>();
    for (const row of rows) {
      const key = adminStatusForJob(row.job.status).key;
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return map;
  }, [rows]);

  const visibleRows = useMemo(
    () =>
      statusFilter === "all"
        ? rows
        : rows.filter(
            (row) => adminStatusForJob(row.job.status).key === statusFilter,
          ),
    [rows, statusFilter],
  );

  const openRow = useMemo(
    () => rows.find((row) => row.job.id === openId) ?? null,
    [rows, openId],
  );

  const isLoading =
    requestsQuery.isLoading ||
    customersQuery.isLoading ||
    recordsQuery.isLoading;
  const isError =
    requestsQuery.isError || customersQuery.isError || recordsQuery.isError;

  const columns: AdminColumn<RequestRow>[] = [
    {
      key: "customer",
      header: "Customer",
      cell: (row) => (
        <div className="min-w-0">
          <p className="truncate font-semibold text-[oklch(var(--admin-foreground))]">
            {row.job.customerName || "Unnamed customer"}
          </p>
          <p className="truncate text-sm text-[oklch(var(--admin-muted-foreground))]">
            {row.job.email || row.job.phone || "No contact on file"}
          </p>
        </div>
      ),
    },
    {
      key: "service",
      header: "Service",
      cell: (row) => getService(row.job.category).label,
    },
    {
      key: "description",
      header: "Description",
      hideOnMobile: true,
      className: "max-w-[16rem]",
      cell: (row) => (
        <span className="line-clamp-2 text-[oklch(var(--admin-muted-foreground))]">
          {row.job.description || "—"}
        </span>
      ),
    },
    {
      key: "address",
      header: "Address",
      hideOnMobile: true,
      className: "max-w-[14rem]",
      cell: (row) => (
        <span className="line-clamp-2">
          {row.customer?.serviceAddress || "—"}
        </span>
      ),
    },
    {
      key: "requested",
      header: "Requested",
      cell: (row) => (
        <span className="whitespace-nowrap">
          {formatDateTime(row.job.createdAt)}
        </span>
      ),
    },
    {
      key: "id",
      header: "Request ID",
      hideOnMobile: true,
      cell: (row) => (
        <span className="font-mono text-sm">
          {formatReference(row.job.referenceCode)}
        </span>
      ),
    },
    {
      key: "quote",
      header: "Quote",
      align: "right",
      hideOnMobile: true,
      cell: (row) =>
        row.job.quote ? formatMoney(quoteTotal(row.job.quote)) : "—",
    },
    {
      key: "discount",
      header: "Discount",
      align: "right",
      hideOnMobile: true,
      cell: (row) =>
        row.job.quote?.discountApplied && row.job.quote.discountAmount > 0n
          ? `−${formatMoney(row.job.quote.discountAmount)}`
          : "—",
    },
    {
      key: "deposit",
      header: "Deposit",
      align: "right",
      hideOnMobile: true,
      cell: (row) =>
        row.job.deposit ? formatMoney(row.job.deposit.amount) : "—",
    },
    {
      key: "balance",
      header: "Balance",
      align: "right",
      cell: (row) =>
        row.job.quote ? formatMoney(quoteRemainingBalance(row.job.quote)) : "—",
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => {
        const meta = adminStatusForJob(row.job.status);
        return <AdminStatusBadge tone={meta.tone} label={meta.label} dot />;
      },
    },
    {
      key: "notes",
      header: "Notes",
      align: "right",
      hideOnMobile: true,
      cell: (row) => (
        <span className="font-mono text-sm">
          {row.customer ? row.customer.jobCount.toString() : "—"}
        </span>
      ),
    },
  ];

  return (
    <AdminShell>
      <AdminPageHeader
        eyebrow="Admin"
        title="Requests"
        description="Every incoming service request, newest first. Filter by status or open a request for its full detail."
      />

      <AdminCard className="mb-6">
        <AdminCardHeader
          title="Filter by status"
          description="Tap a status to narrow the list. Counts update live."
        />
        <div
          data-ocid="admin.requests.filter.tabs"
          className="flex flex-wrap gap-2"
        >
          <FilterTab
            label="All"
            count={rows.length}
            active={statusFilter === "all"}
            onClick={() => setStatusFilter("all")}
            ocid="admin.requests.filter.all"
          />
          {ADMIN_STATUS_ORDER.map((key) => {
            const meta = getAdminStatusMeta(key);
            return (
              <FilterTab
                key={key}
                label={meta.label}
                count={counts.get(key) ?? 0}
                active={statusFilter === key}
                onClick={() => setStatusFilter(key)}
                ocid={`admin.requests.filter.${key}`}
              />
            );
          })}
        </div>
      </AdminCard>

      <AdminCard>
        <AdminCardHeader
          title="All requests"
          description={
            statusFilter === "all"
              ? `${rows.length} ${rows.length === 1 ? "request" : "requests"}`
              : `${visibleRows.length} ${visibleRows.length === 1 ? "request" : "requests"} · ${getAdminStatusMeta(statusFilter).label}`
          }
        />

        {isLoading ? (
          <AdminLoadingState
            data-ocid="admin.requests.loading_state"
            label="Loading requests"
          />
        ) : isError ? (
          <AdminErrorState
            data-ocid="admin.requests.error_state"
            message="The requests could not be loaded. Please try again."
            onRetry={() => {
              void requestsQuery.refetch();
              void customersQuery.refetch();
              void recordsQuery.refetch();
            }}
          />
        ) : (
          <AdminDataTable
            data-ocid="admin.requests.table"
            caption="Service requests"
            columns={columns}
            rows={visibleRows}
            rowKey={(row) => row.job.id.toString()}
            onRowClick={(row) => setOpenId(row.job.id)}
            empty={
              <AdminEmptyState
                data-ocid="admin.requests.empty_state"
                icon={<Inbox className="size-6" />}
                title={
                  statusFilter === "all"
                    ? "No requests yet"
                    : "No requests with this status"
                }
                description={
                  statusFilter === "all"
                    ? "New service requests will appear here as they arrive."
                    : "Try a different status filter to see other requests."
                }
              />
            }
          />
        )}
      </AdminCard>

      {openRow && (
        <RequestDetailPanel row={openRow} onClose={() => setOpenId(null)} />
      )}
    </AdminShell>
  );
}

/* ------------------------------------------------------------------ */
/* Filter tab                                                          */
/* ------------------------------------------------------------------ */

interface FilterTabProps {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  ocid: string;
}

function FilterTab({ label, count, active, onClick, ocid }: FilterTabProps) {
  return (
    <button
      type="button"
      data-ocid={ocid}
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-base font-semibold transition-smooth",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(var(--admin-ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[oklch(var(--admin-bg))]",
        active
          ? "border-transparent bg-[oklch(var(--admin-primary))] text-[oklch(var(--admin-primary-foreground))]"
          : "border-[oklch(var(--admin-border-strong))] bg-[oklch(var(--admin-surface))] text-[oklch(var(--admin-foreground))] hover:bg-[oklch(var(--admin-surface-alt))]",
      )}
    >
      {label}
      <span
        className={cn(
          "rounded-full px-2 py-0.5 text-sm font-bold",
          active
            ? "bg-[oklch(var(--admin-primary-foreground))]/20"
            : "bg-[oklch(var(--admin-surface-alt))] text-[oklch(var(--admin-muted-foreground))]",
        )}
      >
        {count}
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Detail panel                                                        */
/* ------------------------------------------------------------------ */

interface RequestDetailPanelProps {
  row: RequestRow;
  onClose: () => void;
}

function RequestDetailPanel({ row, onClose }: RequestDetailPanelProps) {
  const { job, customer, jobRecord, payment } = row;
  const statusMeta = adminStatusForJob(job.status);
  const service = getService(job.category);

  return (
    <div
      data-ocid="admin.requests.detail_modal"
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:items-center"
    >
      <button
        type="button"
        aria-label="Close request detail"
        data-ocid="admin.requests.detail_close_button"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />
      <div className="admin-shell relative z-10 my-4 w-full max-w-3xl rounded-2xl border border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface))] p-5 shadow-admin sm:p-7">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="admin-label text-[oklch(var(--admin-primary))]">
              Request {formatReference(job.referenceCode)}
            </p>
            <h2 className="mt-1 text-2xl font-bold text-[oklch(var(--admin-foreground))]">
              {job.customerName || "Unnamed customer"}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <AdminStatusBadge
                tone={statusMeta.tone}
                label={statusMeta.label}
                dot
              />
              <AdminChip>{service.label}</AdminChip>
            </div>
          </div>
          <AdminButton
            variant="ghost"
            size="sm"
            data-ocid="admin.requests.detail_dismiss_button"
            aria-label="Close"
            onClick={onClose}
          >
            <X className="size-5" />
          </AdminButton>
        </div>

        <div className="grid gap-5">
          <DetailSection title="Customer information">
            <DetailRow label="Name" value={job.customerName || "—"} />
            <DetailRow label="Email" value={job.email || "—"} />
            <DetailRow label="Phone" value={job.phone || "—"} />
            <DetailRow
              label="Service address"
              value={customer?.serviceAddress || "Not linked to a customer"}
            />
          </DetailSection>

          <DetailSection title="Request">
            <DetailRow label="Service" value={service.label} />
            <DetailRow label="Description" value={job.description || "—"} />
            <DetailRow
              label="Requested date & time"
              value={formatDateTime(job.createdAt)}
            />
            <DetailRow
              label="Preferred timing"
              value={job.preferredTiming || "—"}
            />
            <DetailRow
              label="Customer supplies parts"
              value={job.ownParts ? "Yes" : "No"}
            />
          </DetailSection>

          <DetailSection title="Quote">
            {job.quote ? (
              <>
                <DetailRow
                  label="Quote number"
                  value={job.quote.quoteNumber || "—"}
                />
                <DetailRow
                  label="Total"
                  value={formatMoney(quoteTotal(job.quote))}
                />
                <DetailRow
                  label="Discount"
                  value={
                    job.quote.discountApplied && job.quote.discountAmount > 0n
                      ? `−${formatMoney(job.quote.discountAmount)}`
                      : "None"
                  }
                />
                <DetailRow
                  label="Deposit required"
                  value={formatMoney(job.quote.depositRequired)}
                />
                <DetailRow
                  label="Remaining balance"
                  value={formatMoney(quoteRemainingBalance(job.quote))}
                />
              </>
            ) : (
              <p className="text-base text-[oklch(var(--admin-muted-foreground))]">
                No quote has been prepared for this request yet.
              </p>
            )}
          </DetailSection>

          <DetailSection title="Deposit">
            {job.deposit ? (
              <>
                <DetailRow
                  label="Amount"
                  value={formatMoney(job.deposit.amount)}
                />
                <DetailRow
                  label="Status"
                  value={getDepositStatusMeta(job.deposit.status).label}
                />
                <DetailRow
                  label="Paid"
                  value={job.deposit.paid ? "Yes" : "No"}
                />
              </>
            ) : (
              <p className="text-base text-[oklch(var(--admin-muted-foreground))]">
                No deposit has been recorded for this request.
              </p>
            )}
          </DetailSection>

          <DetailSection title="Appointment">
            {job.appointment ? (
              <>
                <DetailRow
                  label="Scheduled"
                  value={formatDateTime(job.appointment.scheduledAt)}
                />
                <DetailRow
                  label="Confirmed"
                  value={
                    job.appointment.confirmed ? "Yes" : "Awaiting customer"
                  }
                />
              </>
            ) : (
              <p className="text-base text-[oklch(var(--admin-muted-foreground))]">
                No appointment has been scheduled yet.
              </p>
            )}
          </DetailSection>

          <DetailSection title="Job record">
            {jobRecord ? (
              <>
                <DetailRow
                  label="Job reference"
                  value={formatReference(jobRecord.referenceCode)}
                />
                <DetailRow
                  label="Scheduled"
                  value={formatDateTime(jobRecord.scheduledAt)}
                />
                <DetailRow
                  label="Remaining balance"
                  value={formatMoney(jobRecord.remainingBalance)}
                />
              </>
            ) : (
              <p className="text-base text-[oklch(var(--admin-muted-foreground))]">
                This request has not been converted into a job record yet.
              </p>
            )}
          </DetailSection>

          {payment && (
            <DetailSection title="Payment history">
              <DetailRow
                label="Total paid"
                value={formatMoney(payment.totalPaid)}
              />
              <DetailRow
                label="Remaining balance"
                value={formatMoney(payment.remainingBalance)}
              />
            </DetailSection>
          )}

          <RequestNotes customer={customer} />
        </div>
      </div>
    </div>
  );
}

interface DetailSectionProps {
  title: string;
  children: ReactNode;
}

function DetailSection({ title, children }: DetailSectionProps) {
  return (
    <section className="rounded-xl border border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface-alt))] p-4 sm:p-5">
      <h3 className="mb-3 text-base font-bold text-[oklch(var(--admin-foreground))]">
        {title}
      </h3>
      <div className="grid gap-2">{children}</div>
    </section>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
      <dt className="text-sm font-semibold text-[oklch(var(--admin-muted-foreground))]">
        {label}
      </dt>
      <dd className="min-w-0 break-words text-base font-medium text-[oklch(var(--admin-foreground))] sm:text-right">
        {value}
      </dd>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Notes                                                               */
/* ------------------------------------------------------------------ */

function RequestNotes({ customer }: { customer: CustomerSummary | null }) {
  const addNote = useAddCustomerNote();
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!customer) {
    return (
      <DetailSection title="Notes">
        <p className="text-base text-[oklch(var(--admin-muted-foreground))]">
          Notes are stored on the customer record. This request is not yet
          linked to a customer, so notes cannot be added here.
        </p>
      </DetailSection>
    );
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body = draft.trim();
    if (body.length === 0) {
      setError("Write a note before saving.");
      return;
    }
    setError(null);
    setDraft("");
    addNote.mutate(
      { id: customer.id, body },
      {
        onSuccess: (result) => {
          if (result.__kind__ === "err") {
            setError("The note could not be saved. Please try again.");
          }
        },
        onError: () => {
          setDraft((current) => (current === "" ? body : current));
          setError("The note could not be saved. Please try again.");
        },
      },
    );
  };

  return (
    <DetailSection title="Notes">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <AdminField
          label="Add a note"
          htmlFor="request-note"
          error={error}
          hint="Notes are saved to this customer's record."
        >
          <AdminTextarea
            id="request-note"
            data-ocid="admin.requests.note_input"
            value={draft}
            onChange={(event) => {
              setDraft(event.target.value);
              setError(null);
            }}
            placeholder="Called the customer to confirm the details…"
          />
        </AdminField>
        <div className="flex justify-end">
          <AdminButton
            type="submit"
            data-ocid="admin.requests.note_submit_button"
            disabled={addNote.isPending || draft.trim().length === 0}
          >
            {addNote.isPending ? "Saving…" : "Save note"}
          </AdminButton>
        </div>
      </form>
      <p className="mt-1 text-sm text-[oklch(var(--admin-muted-foreground))]">
        Open the customer profile to review the full note history.
      </p>
    </DetailSection>
  );
}
