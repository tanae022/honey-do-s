import {
  type DiscountRule,
  type JobRequestView,
  type Quote,
  type QuoteInput,
  type QuoteLineItem,
  createActor,
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
  AdminShell,
  AdminStatusBadge,
  type AdminStatusTone,
  AdminTextarea,
} from "@/components/admin";
import { useDiscounts, useSettings } from "@/hooks/useAdminSettings";
import { useCustomers } from "@/hooks/useCustomers";
import {
  useIsAdmin,
  useJobRequests,
  useScheduleAppointment,
  useSendQuote,
  useSetQuote,
} from "@/hooks/useJobs";
import {
  formatMoney,
  getQuoteStatusMeta,
  lineItemsSubtotal,
  quoteEmailDelivered,
  quoteEmailOutcomeLabel,
} from "@/lib/jobs";
import { getService } from "@/lib/services";
import { cn } from "@/lib/utils";
import { useActor, useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  BadgeCheck,
  CalendarClock,
  Check,
  FileText,
  Plus,
  Send,
  ShieldAlert,
  ThumbsDown,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

/* ------------------------------------------------------------------ */
/* Local quote mutations                                               */
/* ------------------------------------------------------------------ */
/*
 * The shared job hooks cover setQuote and scheduleAppointment; the remaining
 * quote lifecycle operations are declared here because this page is their only
 * consumer. Every call goes through the generated actor binding — never a cast.
 */

function useEditQuote() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { id: bigint; input: QuoteInput }) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.editQuote(vars.id, vars.input);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}

function useApproveQuote() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.approveQuote(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}

function useDeclineQuote() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.declineQuote(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}

function useConvertQuoteToJob() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { id: bigint; scheduledAt: bigint }) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.convertQuoteToJob(vars.id, vars.scheduledAt);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}

/* ------------------------------------------------------------------ */
/* Draft model                                                         */
/* ------------------------------------------------------------------ */

interface LineItemDraft {
  /** Stable identity for React keys and deterministic markers. */
  key: string;
  description: string;
  quantity: string;
  unitPrice: string;
}

interface QuoteDraft {
  workDescription: string;
  note: string;
  terms: string;
  laborCharge: string;
  materialsCharge: string;
  depositRequired: string;
  expiresAt: string;
  lineItems: LineItemDraft[];
}

let lineItemSeq = 0;
function newLineItem(): LineItemDraft {
  lineItemSeq += 1;
  return {
    key: `line-${lineItemSeq}`,
    description: "",
    quantity: "1",
    unitPrice: "",
  };
}

/** Dollars string → whole cents, tolerating blanks and stray characters. */
function dollarsToCents(value: string): bigint {
  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed) || parsed < 0) return 0n;
  return BigInt(Math.round(parsed * 100));
}

/** Whole cents → a plain dollars string for an editable input. */
function centsToDollars(cents: bigint): string {
  if (cents <= 0n) return "";
  return (Number(cents) / 100).toFixed(2);
}

/** `YYYY-MM-DD` → a nanosecond timestamp at local midnight, or undefined. */
function dateInputToTimestamp(value: string): bigint | undefined {
  if (!value) return undefined;
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return undefined;
  return BigInt(date.getTime()) * 1_000_000n;
}

/** A nanosecond timestamp → `YYYY-MM-DD` for a date input, or "". */
function timestampToDateInput(timestamp: bigint | undefined): string {
  if (!timestamp) return "";
  const date = new Date(Number(timestamp / 1_000_000n));
  if (Number.isNaN(date.getTime())) return "";
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function emptyDraft(terms: string): QuoteDraft {
  return {
    workDescription: "",
    note: "",
    terms,
    laborCharge: "",
    materialsCharge: "",
    depositRequired: "",
    expiresAt: "",
    lineItems: [newLineItem()],
  };
}

function draftFromQuote(quote: Quote, terms: string): QuoteDraft {
  return {
    workDescription: quote.workDescription,
    note: quote.note,
    terms,
    laborCharge: centsToDollars(quote.laborCharge),
    materialsCharge: centsToDollars(quote.materialsCharge),
    depositRequired: centsToDollars(quote.depositRequired),
    expiresAt: timestampToDateInput(quote.expiresAt),
    lineItems:
      quote.lineItems.length > 0
        ? quote.lineItems.map((item) => {
            lineItemSeq += 1;
            return {
              key: `line-${lineItemSeq}`,
              description: item.description,
              quantity: item.quantity.toString(),
              unitPrice: centsToDollars(item.unitPrice),
            };
          })
        : [newLineItem()],
  };
}

function draftToInput(draft: QuoteDraft): QuoteInput {
  const lineItems: QuoteLineItem[] = draft.lineItems
    .filter((item) => item.description.trim().length > 0)
    .map((item) => ({
      description: item.description.trim(),
      quantity: BigInt(Math.max(1, Math.round(Number(item.quantity) || 1))),
      unitPrice: dollarsToCents(item.unitPrice),
    }));
  return {
    workDescription: draft.workDescription.trim(),
    note: draft.note.trim(),
    lineItems,
    laborCharge: dollarsToCents(draft.laborCharge),
    materialsCharge: dollarsToCents(draft.materialsCharge),
    depositRequired: dollarsToCents(draft.depositRequired),
    expiresAt: dateInputToTimestamp(draft.expiresAt),
  };
}

/* ------------------------------------------------------------------ */
/* Live pricing — mirrors the backend pricing engine                   */
/* ------------------------------------------------------------------ */
/*
 * The backend is the single source of truth for a saved quote's pricing. This
 * client-side mirror exists only so the admin sees the automatic breakdown as
 * they type, before saving. It reproduces `lib/pricing.mo` exactly: the same
 * discount selection order, the same cap and minimum-purchase rules, the same
 * tax and deposit arithmetic.
 */

interface DiscountContext {
  subtotal: bigint;
  ownParts: boolean;
  returningCustomer: boolean;
}

interface DiscountDecision {
  applied: boolean;
  ruleName: string;
  reason: string;
  amount: bigint;
}

function withinWindow(rule: DiscountRule, now: bigint): boolean {
  const afterStart = rule.startAt === undefined ? true : now >= rule.startAt;
  const beforeEnd = rule.endAt === undefined ? true : now <= rule.endAt;
  return afterStart && beforeEnd;
}

function ruleEligible(rule: DiscountRule, context: DiscountContext): boolean {
  switch (rule.eligibility) {
    case "all":
      return true;
    case "ownParts":
      return context.ownParts;
    case "returningCustomer":
      return context.returningCustomer;
    default:
      return true;
  }
}

function rawDiscount(rule: DiscountRule, subtotal: bigint): bigint {
  return rule.kind === "percentage"
    ? (subtotal * rule.value) / 100n
    : rule.value;
}

function cappedDiscount(rule: DiscountRule, subtotal: bigint): bigint {
  const raw = rawDiscount(rule, subtotal);
  const capped =
    rule.maxDiscount > 0n && raw > rule.maxDiscount ? rule.maxDiscount : raw;
  return capped > subtotal ? subtotal : capped;
}

function selectDiscount(
  rules: DiscountRule[],
  context: DiscountContext,
  now: bigint,
): DiscountDecision {
  let sawInactive = false;
  let sawExpired = false;
  let sawIneligible = false;
  let sawBelowMinimum = false;
  for (const rule of rules) {
    if (!rule.active) {
      sawInactive = true;
    } else if (!withinWindow(rule, now)) {
      sawExpired = true;
    } else if (!ruleEligible(rule, context)) {
      sawIneligible = true;
    } else if (rule.minPurchase > 0n && context.subtotal < rule.minPurchase) {
      sawBelowMinimum = true;
    } else {
      const amount = cappedDiscount(rule, context.subtotal);
      if (amount > 0n) {
        const capped =
          rule.maxDiscount > 0n &&
          rawDiscount(rule, context.subtotal) > rule.maxDiscount;
        return {
          applied: true,
          ruleName: rule.name,
          amount,
          reason: capped
            ? `Applied ${rule.name} (capped at the maximum discount)`
            : `Applied ${rule.name}`,
        };
      }
    }
  }
  if (sawInactive) {
    return {
      applied: false,
      ruleName: "",
      amount: 0n,
      reason: "No discount applied: the matching rule is inactive",
    };
  }
  if (sawExpired) {
    return {
      applied: false,
      ruleName: "",
      amount: 0n,
      reason:
        "No discount applied: the matching rule is expired or not yet active",
    };
  }
  if (sawIneligible) {
    return {
      applied: false,
      ruleName: "",
      amount: 0n,
      reason: "No discount applied: no rule is eligible for this customer",
    };
  }
  if (sawBelowMinimum) {
    return {
      applied: false,
      ruleName: "",
      amount: 0n,
      reason: "No discount applied: the subtotal is below the minimum purchase",
    };
  }
  return {
    applied: false,
    ruleName: "",
    amount: 0n,
    reason: "No discount applied: no discount rule is configured",
  };
}

interface LivePricing {
  originalSubtotal: bigint;
  discountAmount: bigint;
  adjustedSubtotal: bigint;
  taxAmount: bigint;
  finalTotal: bigint;
  depositAmount: bigint;
  remainingBalance: bigint;
  discount: DiscountDecision;
}

function computeLivePricing(
  draft: QuoteDraft,
  rules: DiscountRule[],
  taxEnabled: boolean,
  taxRatePercent: bigint,
  context: { ownParts: boolean; returningCustomer: boolean },
  now: bigint,
): LivePricing {
  const items = draft.lineItems.map((item) => ({
    quantity: BigInt(Math.max(1, Math.round(Number(item.quantity) || 1))),
    unitPrice: dollarsToCents(item.unitPrice),
  }));
  const originalSubtotal =
    lineItemsSubtotal(items) +
    dollarsToCents(draft.laborCharge) +
    dollarsToCents(draft.materialsCharge);

  const discount = selectDiscount(
    rules,
    { subtotal: originalSubtotal, ...context },
    now,
  );
  const discountAmount = discount.applied ? discount.amount : 0n;
  const adjustedSubtotal =
    discountAmount >= originalSubtotal ? 0n : originalSubtotal - discountAmount;
  const taxAmount = taxEnabled
    ? (adjustedSubtotal * taxRatePercent) / 100n
    : 0n;
  const finalTotal = adjustedSubtotal + taxAmount;
  // The deposit is the amount the owner enters, capped at the final total.
  const enteredDeposit = dollarsToCents(draft.depositRequired);
  const depositAmount =
    enteredDeposit >= finalTotal ? finalTotal : enteredDeposit;
  const remainingBalance =
    depositAmount >= finalTotal ? 0n : finalTotal - depositAmount;

  return {
    originalSubtotal,
    discountAmount,
    adjustedSubtotal,
    taxAmount,
    finalTotal,
    depositAmount,
    remainingBalance,
    discount,
  };
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

/**
 * Admin quote builder.
 *
 * Pick a service request, capture the itemized quote, then save, send, approve,
 * decline or convert it into a scheduled job. Every amount is calculated
 * automatically as the admin types — the discount, tax, final total, 10%
 * deposit and remaining balance — with the reason a discount was or was not
 * applied shown in plain language.
 */
export function QuotesPage() {
  const { data: isAdmin, isLoading: roleLoading } = useIsAdmin();
  const { login, loginStatus } = useInternetIdentity();

  if (roleLoading) {
    return (
      <AdminShell>
        <AdminLoadingState
          data-ocid="quotes.loading_state"
          label="Checking access"
        />
      </AdminShell>
    );
  }

  if (!isAdmin) {
    return (
      <AdminShell>
        <AdminCard className="mx-auto max-w-md text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-[oklch(var(--admin-surface-alt))] text-[oklch(var(--admin-primary))]">
            <ShieldAlert className="size-6" aria-hidden="true" />
          </span>
          <h1 className="mt-5 text-2xl font-bold text-[oklch(var(--admin-foreground))]">
            Admin access required
          </h1>
          <p className="mt-3 text-base text-[oklch(var(--admin-muted-foreground))]">
            Sign in with an administrator identity to build quotes.
          </p>
          {loginStatus !== "success" && (
            <AdminButton
              data-ocid="quotes.login_button"
              className="mt-6"
              onClick={() => login()}
            >
              Sign in
            </AdminButton>
          )}
        </AdminCard>
      </AdminShell>
    );
  }

  return <QuotesBody />;
}

/* ------------------------------------------------------------------ */
/* Search-param entry points                                           */
/* ------------------------------------------------------------------ */

type QuoteFilter = "all" | "pending";

const QUOTE_FILTERS: { key: QuoteFilter; label: string }[] = [
  { key: "all", label: "All requests" },
  { key: "pending", label: "Pending quotes" },
];

/**
 * The filter the dashboard's count link asked for, if any.
 *
 * Read straight from `window.location.search` so the link works on the plain
 * `/admin/quotes` route without a `validateSearch` contract.
 */
function initialQuoteFilter(): QuoteFilter {
  if (typeof window === "undefined") return "all";
  return new URLSearchParams(window.location.search).get("status") === "pending"
    ? "pending"
    : "all";
}

/** Whether the dashboard's "+ New Quote" quick action opened this page. */
function openedForNewQuote(): boolean {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("new") === "1";
}

/** Whether a request belongs in the currently selected quote filter. */
function matchesQuoteFilter(job: JobRequestView, filter: QuoteFilter): boolean {
  if (filter === "all") return true;
  const status = job.quote?.status;
  return status !== "approved" && status !== "declined";
}

function QuotesBody() {
  const requestsQuery = useJobRequests();
  const customersQuery = useCustomers(true);
  const discountsQuery = useDiscounts();
  const settingsQuery = useSettings();
  const [selectedId, setSelectedId] = useState<bigint | null>(null);
  const [statusFilter, setStatusFilter] =
    useState<QuoteFilter>(initialQuoteFilter);

  const requests = requestsQuery.data ?? [];

  const visibleRequests = useMemo(
    () => requests.filter((job) => matchesQuoteFilter(job, statusFilter)),
    [requests, statusFilter],
  );

  // The dashboard's "+ New Quote" quick action opens the builder directly by
  // selecting the first request once the list has loaded.
  const openedForNew = useMemo(() => openedForNewQuote(), []);
  useEffect(() => {
    if (!openedForNew || selectedId !== null) return;
    const first = visibleRequests[0];
    if (first) setSelectedId(first.id);
  }, [openedForNew, selectedId, visibleRequests]);

  const selected = useMemo(
    () => requests.find((job) => job.id === selectedId) ?? null,
    [requests, selectedId],
  );

  const serviceAddress = useMemo(() => {
    if (!selected) return "";
    const email = selected.email.trim().toLowerCase();
    const match = (customersQuery.data ?? []).find(
      (customer) => customer.email.trim().toLowerCase() === email,
    );
    return match?.serviceAddress ?? "";
  }, [selected, customersQuery.data]);

  const rules = discountsQuery.data ?? [];
  const tax = settingsQuery.data?.tax;
  const terms = settingsQuery.data?.quote.terms ?? "";

  return (
    <AdminShell>
      <AdminPageHeader
        eyebrow="Admin"
        title="Quotes"
        description="Build, send and track customer quotes. Every amount — discount, tax, deposit and remaining balance — is calculated automatically as you type."
      />

      {requestsQuery.isLoading ? (
        <AdminCard>
          <AdminLoadingState
            data-ocid="quotes.requests_loading_state"
            label="Loading requests"
          />
        </AdminCard>
      ) : requestsQuery.isError ? (
        <AdminErrorState
          data-ocid="quotes.error_state"
          message="We could not load the service requests."
          onRetry={() => void requestsQuery.refetch()}
        />
      ) : requests.length === 0 ? (
        <AdminEmptyState
          data-ocid="quotes.empty_state"
          icon={<FileText className="size-6" aria-hidden="true" />}
          title="No requests to quote yet"
          description="New service requests appear here so you can build their quote."
        />
      ) : (
        <>
          <div
            data-ocid="quotes.filter.tabs"
            className="mb-6 flex flex-wrap gap-2"
          >
            {QUOTE_FILTERS.map((option) => {
              const active = statusFilter === option.key;
              return (
                <button
                  key={option.key}
                  type="button"
                  data-ocid={`quotes.filter.${option.key}`}
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

          {visibleRequests.length === 0 ? (
            <AdminEmptyState
              data-ocid="quotes.filter_empty_state"
              icon={<FileText className="size-6" aria-hidden="true" />}
              title="No requests with this status"
              description="Try a different filter to see other requests."
            />
          ) : (
            <div className="grid gap-6 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
              <RequestPicker
                requests={visibleRequests}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
              <div className="min-w-0">
                {selected ? (
                  <QuoteWorkspace
                    key={selected.id.toString()}
                    job={selected}
                    serviceAddress={serviceAddress}
                    rules={rules}
                    taxEnabled={tax?.enabled ?? false}
                    taxRatePercent={tax?.ratePercent ?? 0n}
                    terms={terms}
                  />
                ) : (
                  <AdminEmptyState
                    data-ocid="quotes.select_prompt"
                    icon={<FileText className="size-6" aria-hidden="true" />}
                    title="Choose a request"
                    description="Select a service request on the left to build its quote."
                  />
                )}
              </div>
            </div>
          )}
        </>
      )}
    </AdminShell>
  );
}

/* ------------------------------------------------------------------ */
/* Request picker                                                      */
/* ------------------------------------------------------------------ */

function RequestPicker({
  requests,
  selectedId,
  onSelect,
}: {
  requests: JobRequestView[];
  selectedId: bigint | null;
  onSelect: (id: bigint) => void;
}) {
  return (
    <AdminCard data-ocid="quotes.request_list" className="h-fit p-4 sm:p-4" alt>
      <h2 className="mb-3 text-base font-bold text-[oklch(var(--admin-foreground))]">
        Service requests
      </h2>
      <ul className="flex max-h-[32rem] flex-col gap-2 overflow-y-auto pr-1">
        {requests.map((job, index) => {
          const active = job.id === selectedId;
          const quote = job.quote;
          const meta = quote ? getQuoteStatusMeta(quote.status) : null;
          return (
            <li key={job.id.toString()}>
              <button
                type="button"
                data-ocid={`quotes.request_item.${index + 1}`}
                onClick={() => onSelect(job.id)}
                aria-pressed={active}
                className={cn(
                  "w-full rounded-xl border p-3 text-left transition-smooth",
                  active
                    ? "border-[oklch(var(--admin-primary))] bg-[oklch(var(--admin-primary))]/10"
                    : "border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface))] hover:border-[oklch(var(--admin-border-strong))]",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="min-w-0 truncate font-semibold text-[oklch(var(--admin-foreground))]">
                    {job.customerName}
                  </span>
                  {meta ? (
                    <AdminStatusBadge
                      tone={quoteStatusTone(quote?.status)}
                      label={meta.label}
                    />
                  ) : (
                    <AdminChip>No quote</AdminChip>
                  )}
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-[oklch(var(--admin-muted-foreground))]">
                  {job.description}
                </p>
                <p className="mt-1 font-mono text-xs uppercase tracking-wider text-[oklch(var(--admin-muted-foreground))]">
                  {job.referenceCode}
                </p>
              </button>
            </li>
          );
        })}
      </ul>
    </AdminCard>
  );
}

/** Map a quote approval status onto an obvious admin status tone. */
function quoteStatusTone(status: Quote["status"] | undefined): AdminStatusTone {
  switch (status) {
    case "approved":
      return "approved";
    case "declined":
      return "cancelled";
    case "sent":
      return "waiting";
    default:
      return "new";
  }
}

/* ------------------------------------------------------------------ */
/* Quote workspace                                                     */
/* ------------------------------------------------------------------ */

function QuoteWorkspace({
  job,
  serviceAddress,
  rules,
  taxEnabled,
  taxRatePercent,
  terms,
}: {
  job: JobRequestView;
  serviceAddress: string;
  rules: DiscountRule[];
  taxEnabled: boolean;
  taxRatePercent: bigint;
  terms: string;
}) {
  const existing = job.quote ?? null;
  const [draft, setDraft] = useState<QuoteDraft>(() =>
    existing ? draftFromQuote(existing, terms) : emptyDraft(terms),
  );
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [emailFailed, setEmailFailed] = useState(false);

  const setQuote = useSetQuote();
  const editQuote = useEditQuote();
  const sendQuote = useSendQuote();
  const approveQuote = useApproveQuote();
  const declineQuote = useDeclineQuote();
  const convertQuote = useConvertQuoteToJob();
  const scheduleAppointment = useScheduleAppointment();

  const pricing = useMemo(
    () =>
      computeLivePricing(
        draft,
        rules,
        taxEnabled,
        taxRatePercent,
        { ownParts: job.ownParts, returningCustomer: false },
        BigInt(Date.now()) * 1_000_000n,
      ),
    [draft, rules, taxEnabled, taxRatePercent, job.ownParts],
  );

  const statusMeta = existing ? getQuoteStatusMeta(existing.status) : null;
  const busy =
    setQuote.isPending ||
    editQuote.isPending ||
    sendQuote.isPending ||
    approveQuote.isPending ||
    declineQuote.isPending ||
    convertQuote.isPending ||
    scheduleAppointment.isPending;

  const set = <K extends keyof QuoteDraft>(
    key: K,
    value: QuoteDraft[K],
  ): void => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const setLineItem = (
    key: string,
    patch: Partial<Omit<LineItemDraft, "key">>,
  ): void => {
    setDraft((current) => ({
      ...current,
      lineItems: current.lineItems.map((item) =>
        item.key === key ? { ...item, ...patch } : item,
      ),
    }));
  };

  const addLineItem = (): void => {
    setDraft((current) => ({
      ...current,
      lineItems: [...current.lineItems, newLineItem()],
    }));
  };

  const removeLineItem = (key: string): void => {
    setDraft((current) => ({
      ...current,
      lineItems:
        current.lineItems.length > 1
          ? current.lineItems.filter((item) => item.key !== key)
          : current.lineItems,
    }));
  };

  const handleResult = (
    result: { __kind__: "ok" } | { __kind__: "err"; err: unknown },
    successMessage: string,
  ): void => {
    if (result.__kind__ === "ok") {
      setError(null);
      setEmailFailed(false);
      setFeedback(successMessage);
      return;
    }
    setFeedback(null);
    setEmailFailed(false);
    setError(describeJobError(result.err));
  };

  const handleSave = (): void => {
    setFeedback(null);
    setError(null);
    const input = draftToInput(draft);
    if (input.workDescription.length === 0) {
      setError("Add a description of the requested work before saving.");
      return;
    }
    if (existing) {
      editQuote.mutate(
        { id: job.id, input },
        { onSuccess: (result) => handleResult(result, "Quote updated.") },
      );
    } else {
      // `setQuote` seeds the quote (and its number) from the computed total;
      // `editQuote` then persists the full itemized breakdown on top.
      setQuote.mutate(
        { id: job.id, amount: pricing.finalTotal, note: input.note },
        {
          onSuccess: (result) => {
            if (result.__kind__ === "ok") {
              editQuote.mutate(
                { id: job.id, input },
                {
                  onSuccess: (editResult) =>
                    handleResult(editResult, "Quote saved."),
                },
              );
            } else {
              handleResult(result, "Quote saved.");
            }
          },
        },
      );
    }
  };

  const handleSend = (): void => {
    setFeedback(null);
    setError(null);
    setEmailFailed(false);
    sendQuote.mutate(job.id, {
      onSuccess: (result) => {
        if (result.__kind__ === "err") {
          setFeedback(null);
          setEmailFailed(false);
          setError(describeJobError(result.err));
          return;
        }
        const email = result.ok?.email;
        if (!email) {
          setError(null);
          setEmailFailed(false);
          setFeedback("Quote sent to the customer.");
          return;
        }
        const delivered = quoteEmailDelivered(email);
        setError(null);
        setEmailFailed(!delivered);
        setFeedback(quoteEmailOutcomeLabel(email));
      },
    });
  };

  const handleApprove = (): void => {
    setFeedback(null);
    setError(null);
    approveQuote.mutate(job.id, {
      onSuccess: (result) => handleResult(result, "Quote marked approved."),
    });
  };

  const handleDecline = (): void => {
    setFeedback(null);
    setError(null);
    declineQuote.mutate(job.id, {
      onSuccess: (result) => handleResult(result, "Quote marked declined."),
    });
  };

  const handleConvert = (): void => {
    setFeedback(null);
    setError(null);
    const scheduledAt = BigInt(Date.now()) * 1_000_000n;
    convertQuote.mutate(
      { id: job.id, scheduledAt },
      {
        onSuccess: (result) => {
          if (result.__kind__ === "ok") {
            scheduleAppointment.mutate(
              { id: job.id, scheduledAt },
              {
                onSuccess: () =>
                  handleResult(result, "Quote converted into a scheduled job."),
              },
            );
          } else {
            handleResult(result, "Quote converted into a scheduled job.");
          }
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <QuoteHeader
        job={job}
        serviceAddress={serviceAddress}
        quote={existing}
        statusMeta={statusMeta}
      />

      <AdminCard data-ocid="quotes.builder_panel">
        <AdminCardHeader
          title={existing ? "Edit quote" : "Build quote"}
          description="Itemize the work, then save, send and track the customer's decision."
          action={
            statusMeta ? (
              <AdminStatusBadge
                data-ocid="quotes.status_chip"
                tone={quoteStatusTone(existing?.status)}
                label={statusMeta.label}
                dot
              />
            ) : undefined
          }
        />

        <div className="grid gap-5">
          <AdminField
            label="Description of requested work"
            htmlFor="quote-work"
          >
            <AdminTextarea
              id="quote-work"
              data-ocid="quotes.work_description_input"
              value={draft.workDescription}
              onChange={(event) => set("workDescription", event.target.value)}
              placeholder="What will Honey Do's take care of?"
            />
          </AdminField>

          <div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-[oklch(var(--admin-foreground))]">
                Service line items
              </span>
              <AdminButton
                size="sm"
                variant="secondary"
                data-ocid="quotes.add_line_button"
                onClick={addLineItem}
              >
                <Plus className="size-4" aria-hidden="true" />
                Add line
              </AdminButton>
            </div>
            <ul className="flex flex-col gap-3">
              {draft.lineItems.map((item, index) => (
                <li
                  key={item.key}
                  data-ocid={`quotes.line_item.${index + 1}`}
                  className="rounded-xl border border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface-alt))] p-3"
                >
                  <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_5rem_7rem_auto] sm:items-end">
                    <AdminField
                      label="Description"
                      htmlFor={`quote-line-desc-${item.key}`}
                    >
                      <AdminInput
                        id={`quote-line-desc-${item.key}`}
                        data-ocid={`quotes.line_description_input.${index + 1}`}
                        value={item.description}
                        onChange={(event) =>
                          setLineItem(item.key, {
                            description: event.target.value,
                          })
                        }
                        placeholder="e.g. Replace kitchen faucet"
                      />
                    </AdminField>
                    <AdminField
                      label="Qty"
                      htmlFor={`quote-line-qty-${item.key}`}
                    >
                      <AdminInput
                        id={`quote-line-qty-${item.key}`}
                        data-ocid={`quotes.line_quantity_input.${index + 1}`}
                        type="number"
                        min={1}
                        inputMode="numeric"
                        value={item.quantity}
                        onChange={(event) =>
                          setLineItem(item.key, {
                            quantity: event.target.value,
                          })
                        }
                      />
                    </AdminField>
                    <AdminField
                      label="Unit price"
                      htmlFor={`quote-line-price-${item.key}`}
                    >
                      <AdminInput
                        id={`quote-line-price-${item.key}`}
                        data-ocid={`quotes.line_unit_price_input.${index + 1}`}
                        type="number"
                        min={0}
                        step="0.01"
                        inputMode="decimal"
                        value={item.unitPrice}
                        onChange={(event) =>
                          setLineItem(item.key, {
                            unitPrice: event.target.value,
                          })
                        }
                        placeholder="0.00"
                      />
                    </AdminField>
                    <div className="flex items-center justify-between gap-2 sm:flex-col sm:items-end">
                      <span className="font-mono text-sm font-bold text-[oklch(var(--admin-foreground))]">
                        {formatMoney(
                          BigInt(
                            Math.max(1, Math.round(Number(item.quantity) || 1)),
                          ) * dollarsToCents(item.unitPrice),
                        )}
                      </span>
                      <button
                        type="button"
                        data-ocid={`quotes.remove_line_button.${index + 1}`}
                        onClick={() => removeLineItem(item.key)}
                        disabled={draft.lineItems.length <= 1}
                        aria-label={`Remove line item ${index + 1}`}
                        className="inline-flex size-11 items-center justify-center rounded-lg border border-[oklch(var(--admin-status-action))] text-[oklch(var(--admin-status-action))] transition-smooth hover:bg-[oklch(var(--admin-status-action))]/10 disabled:pointer-events-none disabled:opacity-40"
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="Labor charge" htmlFor="quote-labor">
              <AdminInput
                id="quote-labor"
                data-ocid="quotes.labor_input"
                type="number"
                min={0}
                step="0.01"
                inputMode="decimal"
                value={draft.laborCharge}
                onChange={(event) => set("laborCharge", event.target.value)}
                placeholder="0.00"
              />
            </AdminField>
            <AdminField
              label="Materials & additional charges"
              htmlFor="quote-materials"
            >
              <AdminInput
                id="quote-materials"
                data-ocid="quotes.materials_input"
                type="number"
                min={0}
                step="0.01"
                inputMode="decimal"
                value={draft.materialsCharge}
                onChange={(event) => set("materialsCharge", event.target.value)}
                placeholder="0.00"
              />
            </AdminField>
            <AdminField
              label="Deposit required"
              htmlFor="quote-deposit"
              hint="The amount due up front to secure the booking."
            >
              <AdminInput
                id="quote-deposit"
                data-ocid="quotes.deposit_input"
                type="number"
                min={0}
                step="0.01"
                inputMode="decimal"
                value={draft.depositRequired}
                onChange={(event) => set("depositRequired", event.target.value)}
                placeholder="0.00"
              />
            </AdminField>
            <AdminField label="Expiration date" htmlFor="quote-expires">
              <AdminInput
                id="quote-expires"
                data-ocid="quotes.expires_input"
                type="date"
                value={draft.expiresAt}
                onChange={(event) => set("expiresAt", event.target.value)}
              />
            </AdminField>
            <AdminField
              label="Service category"
              htmlFor="quote-category"
              hint="From the customer's request."
            >
              <AdminInput
                id="quote-category"
                data-ocid="quotes.category_input"
                value={getService(job.category).label}
                readOnly
              />
            </AdminField>
          </div>

          <AdminField label="Note to the customer" htmlFor="quote-note">
            <AdminTextarea
              id="quote-note"
              data-ocid="quotes.note_input"
              value={draft.note}
              onChange={(event) => set("note", event.target.value)}
              placeholder="Anything the customer should know about this quote."
            />
          </AdminField>

          <AdminField label="Terms" htmlFor="quote-terms">
            <AdminTextarea
              id="quote-terms"
              data-ocid="quotes.terms_input"
              value={draft.terms}
              onChange={(event) => set("terms", event.target.value)}
              placeholder="Payment terms and conditions shown with the quote."
            />
          </AdminField>

          <PricingBreakdown pricing={pricing} />
        </div>

        {error && (
          <p
            data-ocid="quotes.error_state"
            role="alert"
            className="mt-4 text-base font-medium text-[oklch(var(--admin-status-action))]"
          >
            {error}
          </p>
        )}
        {feedback && (
          <output
            data-ocid={
              emailFailed ? "quotes.email_error_state" : "quotes.success_state"
            }
            className={cn(
              "mt-4 block text-base font-medium",
              emailFailed
                ? "text-[oklch(var(--admin-status-action))]"
                : "text-[oklch(var(--admin-status-paid))]",
            )}
          >
            {feedback}
          </output>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          <AdminButton
            data-ocid="quotes.save_button"
            disabled={busy}
            onClick={handleSave}
          >
            <Check className="size-4" aria-hidden="true" />
            {existing ? "Save changes" : "Save quote"}
          </AdminButton>
          <AdminButton
            variant="secondary"
            data-ocid="quotes.send_button"
            disabled={busy || !existing}
            onClick={handleSend}
          >
            <Send className="size-4" aria-hidden="true" />
            Send quote
          </AdminButton>
          <AdminButton
            variant="secondary"
            data-ocid="quotes.approve_button"
            disabled={busy || !existing}
            onClick={handleApprove}
          >
            <BadgeCheck className="size-4" aria-hidden="true" />
            Approve
          </AdminButton>
          <AdminButton
            variant="danger"
            data-ocid="quotes.decline_button"
            disabled={busy || !existing}
            onClick={handleDecline}
          >
            <ThumbsDown className="size-4" aria-hidden="true" />
            Decline
          </AdminButton>
          <AdminButton
            variant="secondary"
            data-ocid="quotes.convert_button"
            disabled={busy || !existing}
            onClick={handleConvert}
          >
            <CalendarClock className="size-4" aria-hidden="true" />
            Convert to job
          </AdminButton>
        </div>
      </AdminCard>

      <CustomerQuotePreview
        job={job}
        serviceAddress={serviceAddress}
        draft={draft}
        pricing={pricing}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Quote header                                                        */
/* ------------------------------------------------------------------ */

function QuoteHeader({
  job,
  serviceAddress,
  quote,
  statusMeta,
}: {
  job: JobRequestView;
  serviceAddress: string;
  quote: Quote | null;
  statusMeta: { label: string } | null;
}) {
  return (
    <AdminCard data-ocid="quotes.header">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <span className="admin-label">Honey Do&apos;s</span>
          <h2 className="mt-1 text-2xl font-bold text-[oklch(var(--admin-foreground))]">
            Quote
          </h2>
          <p className="mt-1 font-mono text-sm uppercase tracking-wider text-[oklch(var(--admin-muted-foreground))]">
            {quote?.quoteNumber
              ? `No. ${quote.quoteNumber}`
              : `Ref ${job.referenceCode}`}
          </p>
        </div>
        {statusMeta && (
          <AdminStatusBadge
            data-ocid="quotes.header_status_chip"
            tone={quoteStatusTone(quote?.status)}
            label={statusMeta.label}
            dot
          />
        )}
      </div>

      <dl className="mt-5 grid gap-4 border-t border-[oklch(var(--admin-border))] pt-5 sm:grid-cols-2">
        <div className="min-w-0">
          <dt className="admin-label">Customer</dt>
          <dd className="mt-1 truncate text-base font-semibold text-[oklch(var(--admin-foreground))]">
            {job.customerName}
          </dd>
        </div>
        <div className="min-w-0">
          <dt className="admin-label">Contact</dt>
          <dd className="mt-1 break-words text-base text-[oklch(var(--admin-foreground))]">
            <span className="block truncate">{job.email}</span>
            <span className="block">{job.phone}</span>
          </dd>
        </div>
        <div className="min-w-0 sm:col-span-2">
          <dt className="admin-label">Service address</dt>
          <dd className="mt-1 break-words text-base text-[oklch(var(--admin-foreground))]">
            {serviceAddress || "Address on file with the customer record"}
          </dd>
        </div>
      </dl>
    </AdminCard>
  );
}

/* ------------------------------------------------------------------ */
/* Pricing breakdown                                                   */
/* ------------------------------------------------------------------ */

function PricingBreakdown({ pricing }: { pricing: LivePricing }) {
  const rows: {
    key: string;
    label: string;
    value: string;
    emphasis?: boolean;
  }[] = [
    {
      key: "originalSubtotal",
      label: "Subtotal",
      value: formatMoney(pricing.originalSubtotal),
    },
  ];
  if (pricing.discountAmount > 0n) {
    rows.push({
      key: "discount",
      label: "Discount",
      value: `−${formatMoney(pricing.discountAmount)}`,
    });
  }
  rows.push({
    key: "adjustedSubtotal",
    label: "Adjusted subtotal",
    value: formatMoney(pricing.adjustedSubtotal),
  });
  if (pricing.taxAmount > 0n) {
    rows.push({
      key: "tax",
      label: "Tax",
      value: formatMoney(pricing.taxAmount),
    });
  }
  rows.push({
    key: "finalTotal",
    label: "Total",
    value: formatMoney(pricing.finalTotal),
    emphasis: true,
  });
  rows.push({
    key: "deposit",
    label: "Deposit required",
    value: formatMoney(pricing.depositAmount),
  });
  rows.push({
    key: "remainingBalance",
    label: "Remaining balance",
    value: formatMoney(pricing.remainingBalance),
    emphasis: true,
  });

  return (
    <section
      data-ocid="quotes.totals"
      className="rounded-xl border border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface-alt))] p-4"
    >
      <h3 className="admin-label mb-3">Automatic pricing</h3>
      <dl className="flex flex-col gap-2">
        {rows.map((row) => (
          <div
            key={row.key}
            className="flex items-center justify-between gap-3"
          >
            <dt className="text-base text-[oklch(var(--admin-muted-foreground))]">
              {row.label}
            </dt>
            <dd
              className={cn(
                "font-mono font-semibold text-[oklch(var(--admin-foreground))]",
                row.emphasis && "text-lg",
              )}
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      <div
        data-ocid="quotes.discount_reason"
        className={cn(
          "mt-4 rounded-lg border p-3 text-sm",
          pricing.discount.applied
            ? "border-[oklch(var(--admin-status-paid))] bg-[oklch(var(--admin-status-paid))]/10 text-[oklch(var(--admin-foreground))]"
            : "border-[oklch(var(--admin-border-strong))] bg-[oklch(var(--admin-surface))] text-[oklch(var(--admin-muted-foreground))]",
        )}
      >
        <span className="font-semibold text-[oklch(var(--admin-foreground))]">
          {pricing.discount.applied ? "Discount applied" : "No discount"}
        </span>
        <span className="mt-0.5 block">{pricing.discount.reason}</span>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Customer-facing preview                                             */
/* ------------------------------------------------------------------ */

/**
 * The quote exactly as the customer reads it.
 *
 * Rendered live from the in-progress draft and the same pricing engine the
 * admin sees, so the owner can confirm the itemized table, the branding, the
 * customer details and every total before sending. It is a preview only — it
 * never calls the backend.
 */
function CustomerQuotePreview({
  job,
  serviceAddress,
  draft,
  pricing,
}: {
  job: JobRequestView;
  serviceAddress: string;
  draft: QuoteDraft;
  pricing: LivePricing;
}) {
  const lineItems = draft.lineItems.filter(
    (item) => item.description.trim().length > 0,
  );

  return (
    <AdminCard data-ocid="quotes.customer_preview">
      <AdminCardHeader
        title="How the customer reads this quote"
        description="A live preview of the itemized quote the customer receives."
      />

      <div className="rounded-xl border border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface))] p-5">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[oklch(var(--admin-border))] pb-4">
          <div className="min-w-0">
            <span className="admin-label">Honey Do&apos;s</span>
            <p className="mt-1 text-lg font-bold text-[oklch(var(--admin-foreground))]">
              Quote
            </p>
          </div>
          <div className="min-w-0 text-right">
            <p className="text-base font-semibold text-[oklch(var(--admin-foreground))]">
              {job.customerName}
            </p>
            <p className="break-words text-sm text-[oklch(var(--admin-muted-foreground))]">
              {job.email}
            </p>
            <p className="text-sm text-[oklch(var(--admin-muted-foreground))]">
              {job.phone}
            </p>
          </div>
        </div>

        {serviceAddress && (
          <p className="mt-4 text-sm text-[oklch(var(--admin-muted-foreground))]">
            <span className="font-semibold text-[oklch(var(--admin-foreground))]">
              Service address:{" "}
            </span>
            {serviceAddress}
          </p>
        )}

        {draft.workDescription.trim().length > 0 && (
          <p className="mt-4 text-base text-[oklch(var(--admin-foreground))]">
            {draft.workDescription}
          </p>
        )}

        <table className="admin-table mt-5">
          <thead>
            <tr>
              <th>Item</th>
              <th className="text-right">Qty</th>
              <th className="text-right">Unit price</th>
              <th className="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {lineItems.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-[oklch(var(--admin-muted-foreground))]"
                >
                  Add a line item to see it here.
                </td>
              </tr>
            ) : (
              lineItems.map((item) => {
                const quantity = BigInt(
                  Math.max(1, Math.round(Number(item.quantity) || 1)),
                );
                const unitPrice = dollarsToCents(item.unitPrice);
                return (
                  <tr key={item.key}>
                    <td className="break-words">{item.description}</td>
                    <td className="text-right font-mono">
                      {quantity.toString()}
                    </td>
                    <td className="text-right font-mono">
                      {formatMoney(unitPrice)}
                    </td>
                    <td className="text-right font-mono font-semibold">
                      {formatMoney(quantity * unitPrice)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        <dl className="mt-5 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-base text-[oklch(var(--admin-muted-foreground))]">
              Subtotal
            </dt>
            <dd className="font-mono font-semibold text-[oklch(var(--admin-foreground))]">
              {formatMoney(pricing.originalSubtotal)}
            </dd>
          </div>
          {pricing.discountAmount > 0n && (
            <div className="flex items-center justify-between gap-3">
              <dt className="text-base text-[oklch(var(--admin-muted-foreground))]">
                Discount
              </dt>
              <dd className="font-mono font-semibold text-[oklch(var(--admin-foreground))]">
                −{formatMoney(pricing.discountAmount)}
              </dd>
            </div>
          )}
          {pricing.taxAmount > 0n && (
            <div className="flex items-center justify-between gap-3">
              <dt className="text-base text-[oklch(var(--admin-muted-foreground))]">
                Tax
              </dt>
              <dd className="font-mono font-semibold text-[oklch(var(--admin-foreground))]">
                {formatMoney(pricing.taxAmount)}
              </dd>
            </div>
          )}
          <div className="flex items-center justify-between gap-3 border-t border-[oklch(var(--admin-border))] pt-2">
            <dt className="text-base font-semibold text-[oklch(var(--admin-foreground))]">
              Total
            </dt>
            <dd className="font-mono text-lg font-bold text-[oklch(var(--admin-foreground))]">
              {formatMoney(pricing.finalTotal)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-base text-[oklch(var(--admin-muted-foreground))]">
              Deposit required
            </dt>
            <dd className="font-mono font-semibold text-[oklch(var(--admin-foreground))]">
              {formatMoney(pricing.depositAmount)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-base text-[oklch(var(--admin-muted-foreground))]">
              Remaining balance
            </dt>
            <dd className="font-mono font-semibold text-[oklch(var(--admin-foreground))]">
              {formatMoney(pricing.remainingBalance)}
            </dd>
          </div>
        </dl>

        {draft.note.trim().length > 0 && (
          <p className="mt-4 text-sm text-[oklch(var(--admin-muted-foreground))]">
            {draft.note}
          </p>
        )}
      </div>
    </AdminCard>
  );
}

/* ------------------------------------------------------------------ */
/* Error copy                                                          */
/* ------------------------------------------------------------------ */

function describeJobError(error: unknown): string {
  if (error && typeof error === "object" && "__kind__" in error) {
    const kind = (error as { __kind__: string }).__kind__;
    switch (kind) {
      case "notAuthorized":
        return "You are not authorized to change this quote.";
      case "notFound":
        return "That request could not be found.";
      case "invalidState":
        return "This quote cannot be changed in its current state.";
      case "paymentError":
        return "The payment step failed. Please try again.";
      default:
        return "Something went wrong. Please try again.";
    }
  }
  return "Something went wrong. Please try again.";
}
