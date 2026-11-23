import {
  DepositStatus,
  type JobRequestView,
  type PaymentHistory,
  PaymentMethod,
  createActor,
} from "@/backend";
import {
  AdminButton,
  AdminCard,
  AdminCardHeader,
  AdminChip,
  type AdminColumn,
  AdminConfirmDialog,
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
  usePaymentHistory,
  useRecordFinalPayment,
  useRejectDeposit,
  useVerifyDeposit,
} from "@/hooks/useAdminSettings";
import { useJobRequests } from "@/hooks/useJobs";
import { getDepositStatusMeta, paymentMethodLabel } from "@/lib/admin";
import { formatMoney, formatReference } from "@/lib/jobs";
import { cn } from "@/lib/utils";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { BadgeCheck, Banknote, CircleDollarSign, Wallet } from "lucide-react";
import { useMemo, useState } from "react";

/* ------------------------------------------------------------------ */
/* Deposits awaiting verification                                      */
/* ------------------------------------------------------------------ */

/** A job request whose customer says they have paid the deposit. */
function isAwaitingVerification(job: JobRequestView): boolean {
  return job.deposit?.status === DepositStatus.submitted;
}

/** The deposit amount for a job, falling back to the quote's required deposit. */
function jobDepositAmount(job: JobRequestView): bigint {
  if (job.deposit && job.deposit.amount > 0n) return job.deposit.amount;
  return job.quote?.depositRequired ?? 0n;
}

/** The quote total for a job, falling back to the legacy amount field. */
function jobQuoteTotal(job: JobRequestView): bigint {
  if (!job.quote) return 0n;
  return job.quote.total > 0n ? job.quote.total : job.quote.amount;
}

interface PendingDepositRow {
  job: JobRequestView;
  customer: string;
  quoteTotal: bigint;
  depositAmount: bigint;
  method: PaymentMethod | null;
  status: DepositStatus;
}

function PendingDepositsSection() {
  const requestsQuery = useJobRequests();
  const verifyDeposit = useVerifyDeposit();
  const rejectDeposit = useRejectDeposit();
  const [confirmJob, setConfirmJob] = useState<JobRequestView | null>(null);
  const [rejectJob, setRejectJob] = useState<JobRequestView | null>(null);

  const rows = useMemo<PendingDepositRow[]>(() => {
    const jobs = requestsQuery.data ?? [];
    return jobs.filter(isAwaitingVerification).map((job) => ({
      job,
      customer: job.customerName,
      quoteTotal: jobQuoteTotal(job),
      depositAmount: jobDepositAmount(job),
      method: job.deposit?.method ?? null,
      status: job.deposit?.status ?? DepositStatus.pending,
    }));
  }, [requestsQuery.data]);

  const columns: AdminColumn<PendingDepositRow>[] = [
    {
      key: "customer",
      header: "Customer",
      cell: (row) => (
        <div className="min-w-0">
          <p className="truncate text-base font-semibold text-[oklch(var(--admin-foreground))]">
            {row.customer}
          </p>
          <p className="font-mono text-sm text-[oklch(var(--admin-muted-foreground))]">
            {formatReference(row.job.referenceCode)}
          </p>
        </div>
      ),
    },
    {
      key: "quote",
      header: "Quote",
      align: "right",
      cell: (row) => (
        <span className="font-mono text-base">
          {row.quoteTotal > 0n ? formatMoney(row.quoteTotal) : "—"}
        </span>
      ),
    },
    {
      key: "deposit",
      header: "Deposit",
      align: "right",
      cell: (row) => (
        <span className="font-mono text-base font-semibold">
          {formatMoney(row.depositAmount)}
        </span>
      ),
    },
    {
      key: "method",
      header: "Method",
      cell: (row) => (
        <span className="text-base">
          {row.method ? paymentMethodLabel(row.method) : "Not recorded"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => {
        const meta = getDepositStatusMeta(row.status);
        return (
          <AdminStatusBadge
            tone={meta.tone}
            label={meta.label}
            dot
            data-ocid="admin.payments.deposit_status"
          />
        );
      },
    },
    {
      key: "actions",
      header: "Actions",
      cell: (row) => (
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <AdminButton
            size="sm"
            data-ocid="admin.payments.confirm_button"
            disabled={verifyDeposit.isPending}
            onClick={() => setConfirmJob(row.job)}
          >
            Confirm payment
          </AdminButton>
          <AdminButton
            size="sm"
            variant="secondary"
            data-ocid="admin.payments.reject_button"
            disabled={rejectDeposit.isPending}
            onClick={() => setRejectJob(row.job)}
          >
            Payment not received
          </AdminButton>
        </div>
      ),
    },
  ];

  return (
    <AdminCard data-ocid="admin.payments.pending_card">
      <AdminCardHeader
        title="Deposits awaiting verification"
        description="Customers who say they have paid. Confirming marks the deposit paid, the request confirmed and the appointment booked."
        action={
          <AdminChip data-ocid="admin.payments.pending_count">
            {rows.length} waiting
          </AdminChip>
        }
      />

      {requestsQuery.isLoading ? (
        <AdminLoadingState
          data-ocid="admin.payments.pending_loading"
          label="Loading deposits…"
        />
      ) : requestsQuery.isError ? (
        <AdminErrorState
          data-ocid="admin.payments.pending_error"
          message="We could not load the deposits awaiting verification."
          onRetry={() => void requestsQuery.refetch()}
        />
      ) : (
        <AdminDataTable
          data-ocid="admin.payments.pending_table"
          caption="Deposits awaiting verification"
          columns={columns}
          rows={rows}
          rowKey={(row) => row.job.id.toString()}
          empty={
            <AdminEmptyState
              data-ocid="admin.payments.pending_empty_state"
              icon={<Wallet className="size-6" />}
              title="No deposits waiting"
              description="When a customer submits a deposit it will appear here for you to confirm."
            />
          }
        />
      )}

      <AdminConfirmDialog
        open={confirmJob !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmJob(null);
        }}
        title="Confirm this payment?"
        description={
          confirmJob
            ? `Mark the ${formatMoney(jobDepositAmount(confirmJob))} deposit from ${confirmJob.customerName} as received. The request becomes confirmed and the appointment is booked.`
            : undefined
        }
        confirmLabel="Confirm payment"
        isPending={verifyDeposit.isPending}
        onConfirm={() => {
          if (!confirmJob) return;
          verifyDeposit.mutate(confirmJob.referenceCode, {
            onSuccess: () => setConfirmJob(null),
          });
        }}
      />

      <AdminConfirmDialog
        open={rejectJob !== null}
        onOpenChange={(open) => {
          if (!open) setRejectJob(null);
        }}
        title="Mark payment not received?"
        description={
          rejectJob
            ? `The deposit from ${rejectJob.customerName} returns to a rejected state so they can resubmit it.`
            : undefined
        }
        confirmLabel="Payment not received"
        destructive
        isPending={rejectDeposit.isPending}
        onConfirm={() => {
          if (!rejectJob) return;
          rejectDeposit.mutate(rejectJob.referenceCode, {
            onSuccess: () => setRejectJob(null),
          });
        }}
      />
    </AdminCard>
  );
}

/* ------------------------------------------------------------------ */
/* Payment history                                                     */
/* ------------------------------------------------------------------ */

function PaymentHistorySection() {
  const historyQuery = usePaymentHistory();

  const columns: AdminColumn<PaymentHistory>[] = [
    {
      key: "reference",
      header: "Reference",
      cell: (row) => (
        <span className="font-mono text-base font-semibold">
          {formatReference(row.referenceCode)}
        </span>
      ),
    },
    {
      key: "originalQuote",
      header: "Original quote",
      align: "right",
      cell: (row) => (
        <span className="font-mono text-base">
          {formatMoney(row.originalQuote)}
        </span>
      ),
    },
    {
      key: "discount",
      header: "Discount",
      align: "right",
      cell: (row) => (
        <span className="font-mono text-base">
          {row.discountAmount > 0n
            ? `−${formatMoney(row.discountAmount)}`
            : "—"}
        </span>
      ),
    },
    {
      key: "finalQuote",
      header: "Final quote",
      align: "right",
      cell: (row) => (
        <span className="font-mono text-base font-semibold">
          {formatMoney(row.finalQuote)}
        </span>
      ),
    },
    {
      key: "deposit",
      header: "Deposit",
      align: "right",
      cell: (row) => (
        <span className="font-mono text-base">
          {formatMoney(row.depositAmount)}
        </span>
      ),
    },
    {
      key: "method",
      header: "Method",
      cell: (row) => (
        <span className="text-base">
          {paymentMethodLabel(row.paymentMethod)}
        </span>
      ),
    },
    {
      key: "depositStatus",
      header: "Deposit status",
      cell: (row) => {
        const meta = getDepositStatusMeta(row.depositStatus);
        return <AdminStatusBadge tone={meta.tone} label={meta.label} dot />;
      },
    },
    {
      key: "remaining",
      header: "Remaining",
      align: "right",
      cell: (row) => (
        <span className="font-mono text-base font-semibold">
          {formatMoney(row.remainingBalance)}
        </span>
      ),
    },
    {
      key: "finalPayment",
      header: "Final payment",
      align: "right",
      cell: (row) => (
        <span className="font-mono text-base">
          {row.finalPayment > 0n ? formatMoney(row.finalPayment) : "—"}
        </span>
      ),
    },
    {
      key: "totalPaid",
      header: "Total paid",
      align: "right",
      cell: (row) => (
        <span className="font-mono text-base font-semibold">
          {formatMoney(row.totalPaid)}
        </span>
      ),
    },
  ];

  return (
    <AdminCard data-ocid="admin.payments.history_card">
      <AdminCardHeader
        title="Payment history"
        description="Every permanent payment record: original quote, discount, final quote, deposit, remaining balance, final payment and total paid."
        action={
          <AdminChip data-ocid="admin.payments.history_count">
            {historyQuery.data?.length ?? 0} records
          </AdminChip>
        }
      />

      {historyQuery.isLoading ? (
        <AdminLoadingState
          data-ocid="admin.payments.history_loading"
          label="Loading payment history…"
        />
      ) : historyQuery.isError ? (
        <AdminErrorState
          data-ocid="admin.payments.history_error"
          message="We could not load the payment history."
          onRetry={() => void historyQuery.refetch()}
        />
      ) : (
        <AdminDataTable
          data-ocid="admin.payments.history_table"
          caption="Payment history"
          columns={columns}
          rows={historyQuery.data ?? []}
          rowKey={(row) => row.id.toString()}
          empty={
            <AdminEmptyState
              data-ocid="admin.payments.history_empty_state"
              icon={<Banknote className="size-6" />}
              title="No payments recorded yet"
              description="Confirmed deposits and recorded final payments will be stored here permanently."
            />
          }
        />
      )}
    </AdminCard>
  );
}

/* ------------------------------------------------------------------ */
/* Record final payment                                                */
/* ------------------------------------------------------------------ */

function RecordFinalPaymentSection() {
  const historyQuery = usePaymentHistory();
  const recordFinalPayment = useRecordFinalPayment();
  const [jobId, setJobId] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [method, setMethod] = useState<PaymentMethod>(PaymentMethod.cashApp);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const openJobs = useMemo(
    () =>
      (historyQuery.data ?? []).filter(
        (record) => record.remainingBalance > 0n,
      ),
    [historyQuery.data],
  );

  const selected = useMemo(
    () => openJobs.find((record) => record.jobRequestId.toString() === jobId),
    [openJobs, jobId],
  );

  function handleSelect(value: string) {
    setJobId(value);
    setSaved(false);
    setError(null);
    const record = openJobs.find((r) => r.jobRequestId.toString() === value);
    setAmount(record ? (Number(record.remainingBalance) / 100).toFixed(2) : "");
  }

  function handleSubmit() {
    setSaved(false);
    setError(null);
    if (!selected) {
      setError("Choose a job with an outstanding balance.");
      return;
    }
    const parsed = Number.parseFloat(amount);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setError("Enter a final payment amount greater than zero.");
      return;
    }
    const cents = BigInt(Math.round(parsed * 100));
    recordFinalPayment.mutate(
      { jobId: selected.jobRequestId, amount: cents, method },
      {
        onSuccess: () => {
          setSaved(true);
          setJobId("");
          setAmount("");
        },
        onError: () => {
          setError(
            "The final payment could not be recorded. Please try again.",
          );
        },
      },
    );
  }

  return (
    <AdminCard data-ocid="admin.payments.final_card">
      <AdminCardHeader
        title="Record final payment"
        description="Record the final payment for a job and settle its remaining balance to zero."
      />

      {openJobs.length === 0 ? (
        <AdminEmptyState
          data-ocid="admin.payments.final_empty_state"
          icon={<CircleDollarSign className="size-6" />}
          title="No balances outstanding"
          description="Every recorded job has been paid in full. New balances appear here as deposits are confirmed."
        />
      ) : (
        <form
          className="grid gap-4 sm:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmit();
          }}
        >
          <AdminField
            label="Job"
            htmlFor="final-payment-job"
            className="sm:col-span-2"
          >
            <AdminSelect
              id="final-payment-job"
              data-ocid="admin.payments.final_job_select"
              value={jobId}
              onChange={(event) => handleSelect(event.target.value)}
            >
              <option value="">Select a job…</option>
              {openJobs.map((record) => (
                <option
                  key={record.id.toString()}
                  value={record.jobRequestId.toString()}
                >
                  {formatReference(record.referenceCode)} —{" "}
                  {formatMoney(record.remainingBalance)} due
                </option>
              ))}
            </AdminSelect>
          </AdminField>

          <AdminField
            label="Amount"
            htmlFor="final-payment-amount"
            hint={
              selected
                ? `Remaining balance ${formatMoney(selected.remainingBalance)}`
                : "Enter the amount received."
            }
          >
            <AdminInput
              id="final-payment-amount"
              data-ocid="admin.payments.final_amount_input"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(event) => {
                setAmount(event.target.value);
                setSaved(false);
                setError(null);
              }}
            />
          </AdminField>

          <AdminField label="Method" htmlFor="final-payment-method">
            <AdminSelect
              id="final-payment-method"
              data-ocid="admin.payments.final_method_select"
              value={method}
              onChange={(event) => {
                setMethod(event.target.value as PaymentMethod);
                setSaved(false);
                setError(null);
              }}
            >
              <option value={PaymentMethod.cashApp}>Cash App</option>
              <option value={PaymentMethod.venmo}>Venmo</option>
              <option value={PaymentMethod.payPal}>PayPal</option>
              <option value={PaymentMethod.chime}>Chime</option>
              <option value={PaymentMethod.stripe}>Card (Stripe)</option>
            </AdminSelect>
          </AdminField>

          <div className="flex flex-col gap-3 sm:col-span-2">
            {error && (
              <p
                role="alert"
                data-ocid="admin.payments.final_error"
                className="text-base font-medium text-[oklch(var(--admin-status-action))]"
              >
                {error}
              </p>
            )}
            {saved && (
              <p
                data-ocid="admin.payments.final_success"
                className="text-base font-medium text-[oklch(var(--admin-status-paid))]"
              >
                Final payment recorded. The remaining balance is settled.
              </p>
            )}
            <div>
              <AdminButton
                type="submit"
                size="lg"
                data-ocid="admin.payments.final_submit_button"
                disabled={recordFinalPayment.isPending || !selected}
              >
                {recordFinalPayment.isPending
                  ? "Recording…"
                  : "Record final payment"}
              </AdminButton>
            </div>
          </div>
        </form>
      )}
    </AdminCard>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

/** Admin: total collected across every permanent payment record. */
function useCollectedTotal() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["admin", "payments", "collectedTotal"],
    queryFn: async () => {
      if (!actor) return 0n;
      const records = await actor.listPaymentHistory();
      return records.reduce((sum, record) => sum + record.totalPaid, 0n);
    },
    enabled: !!actor && !isFetching,
  });
}

type PaymentFilter = "all" | "pending";

/**
 * The filter the dashboard's count link asked for, if any.
 *
 * Read straight from `window.location.search` so the link works on the plain
 * `/admin/payments` route without a `validateSearch` contract.
 */
function initialPaymentFilter(): PaymentFilter {
  if (typeof window === "undefined") return "all";
  return new URLSearchParams(window.location.search).get("status") === "pending"
    ? "pending"
    : "all";
}

export function PaymentsPage() {
  const requestsQuery = useJobRequests();
  const historyQuery = usePaymentHistory();
  const collectedQuery = useCollectedTotal();
  const [statusFilter, setStatusFilter] =
    useState<PaymentFilter>(initialPaymentFilter);

  const pendingCount = (requestsQuery.data ?? []).filter(
    isAwaitingVerification,
  ).length;
  const outstanding = (historyQuery.data ?? []).reduce(
    (sum, record) => sum + record.remainingBalance,
    0n,
  );

  return (
    <AdminShell>
      <AdminPageHeader
        eyebrow="Admin"
        title="Payments"
        description="Verify deposits, record final payments and review the permanent payment history."
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <AdminStatCard
          data-ocid="admin.payments.stat_pending"
          label="Awaiting verification"
          value={String(pendingCount)}
          hint="Deposits to confirm"
          icon={<Wallet className="size-5" />}
        />
        <AdminStatCard
          data-ocid="admin.payments.stat_collected"
          label="Total collected"
          value={formatMoney(collectedQuery.data ?? 0n)}
          hint="Across all records"
          icon={<BadgeCheck className="size-5" />}
        />
        <AdminStatCard
          data-ocid="admin.payments.stat_outstanding"
          label="Outstanding"
          value={formatMoney(outstanding)}
          hint="Remaining balances"
          icon={<CircleDollarSign className="size-5" />}
        />
      </div>

      <div
        data-ocid="admin.payments.filter.tabs"
        className="mb-6 flex flex-wrap gap-2"
      >
        {(
          [
            { key: "all", label: "All payments" },
            { key: "pending", label: "Deposits pending" },
          ] as { key: PaymentFilter; label: string }[]
        ).map((option) => {
          const active = statusFilter === option.key;
          return (
            <button
              key={option.key}
              type="button"
              data-ocid={`admin.payments.filter.${option.key}`}
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

      <div className="flex flex-col gap-6">
        <PendingDepositsSection />
        {statusFilter === "all" && (
          <>
            <RecordFinalPaymentSection />
            <PaymentHistorySection />
          </>
        )}
      </div>
    </AdminShell>
  );
}
