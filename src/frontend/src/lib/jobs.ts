import {
  DepositStatus,
  type JobRequestView,
  JobStatus,
  type PackageEnrollment,
  PaymentMethod,
  type Quote,
  type QuoteEmailResult,
  QuoteStatus,
  type QuoteView,
  type VisitRecord,
} from "@/backend";
import { getService } from "@/lib/services";

export interface StatusMeta {
  label: string;
  description: string;
  /** Tailwind classes for the hexagon status chip. */
  chipClass: string;
  /** Tailwind classes for the filled hexagon in the lifecycle timeline. */
  hexClass: string;
}

const STATUS_META: Record<JobStatus, StatusMeta> = {
  [JobStatus.requested]: {
    label: "Requested",
    description: "We have your request and will be in touch shortly.",
    chipClass: "border-primary/50 bg-primary/15 text-primary",
    hexClass: "border-primary/60 bg-primary/25 text-primary",
  },
  [JobStatus.quoted]: {
    label: "Quoted",
    description: "Your quote is ready to review and accept.",
    chipClass: "border-accent/60 bg-accent/15 text-accent",
    hexClass: "border-accent/60 bg-accent/25 text-accent",
  },
  [JobStatus.scheduled]: {
    label: "Scheduled",
    description: "Your appointment is on the calendar.",
    chipClass: "border-primary/50 bg-primary/15 text-primary",
    hexClass: "border-primary/60 bg-primary/25 text-primary",
  },
  [JobStatus.inProgress]: {
    label: "In Progress",
    description: "Your Honey Do is underway right now.",
    chipClass: "border-warning/60 bg-warning/15 text-warning",
    hexClass: "border-warning/60 bg-warning/25 text-warning",
  },
  [JobStatus.completed]: {
    label: "Completed",
    description: "All done — we hope it brought relief.",
    chipClass: "border-success/60 bg-success/15 text-success",
    hexClass: "border-success/60 bg-success/25 text-success",
  },
  [JobStatus.cancelled]: {
    label: "Cancelled",
    description: "This request was cancelled.",
    chipClass: "border-destructive/50 bg-destructive/15 text-destructive",
    hexClass: "border-destructive/50 bg-destructive/25 text-destructive",
  },
};

export function getStatusMeta(status: JobStatus): StatusMeta {
  return (
    STATUS_META[status] ?? {
      label: "Requested",
      description: "We have your request and will be in touch shortly.",
      chipClass: "border-primary/50 bg-primary/15 text-primary",
      hexClass: "border-primary/60 bg-primary/25 text-primary",
    }
  );
}

/** Ordered lifecycle used by the admin advance action and the status timeline. */
export const STATUS_ORDER: JobStatus[] = [
  JobStatus.requested,
  JobStatus.quoted,
  JobStatus.scheduled,
  JobStatus.inProgress,
  JobStatus.completed,
];

export function nextStatus(status: JobStatus): JobStatus | null {
  const index = STATUS_ORDER.indexOf(status);
  if (index < 0 || index >= STATUS_ORDER.length - 1) return null;
  return STATUS_ORDER[index + 1];
}

/** Zero-based position of a status in the lifecycle, or -1 when unknown. */
export function statusIndex(status: JobStatus): number {
  return STATUS_ORDER.indexOf(status);
}

/** Motoko Time.now() is nanoseconds; convert before any Date operation. */
export function timestampToDate(timestamp: bigint): Date | null {
  const date = new Date(Number(timestamp / 1_000_000n));
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDateTime(timestamp: bigint): string {
  const date = timestampToDate(timestamp);
  if (!date) return "Date to be confirmed";
  return date.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatDate(timestamp: bigint): string {
  const date = timestampToDate(timestamp);
  if (!date) return "Date to be confirmed";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Quote and deposit amounts are stored in whole cents. */
export function formatMoney(cents: bigint): string {
  const dollars = Number(cents) / 100;
  return dollars.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
  });
}

export function formatReference(code: string): string {
  return code.toUpperCase();
}

/* ------------------------------------------------------------------ */
/* Quote approval status                                               */
/* ------------------------------------------------------------------ */

export interface QuoteStatusMeta {
  label: string;
  description: string;
  /** Tailwind classes for the hexagon status chip. */
  chipClass: string;
}

const QUOTE_STATUS_META: Record<QuoteStatus, QuoteStatusMeta> = {
  [QuoteStatus.draft]: {
    label: "Draft",
    description: "Not sent to the customer yet.",
    chipClass: "border-border bg-muted/60 text-muted-foreground",
  },
  [QuoteStatus.sent]: {
    label: "Sent",
    description: "Waiting on the customer's decision.",
    chipClass: "border-accent/60 bg-accent/15 text-accent",
  },
  [QuoteStatus.approved]: {
    label: "Approved",
    description: "The customer approved this quote.",
    chipClass: "border-success/60 bg-success/15 text-success",
  },
  [QuoteStatus.declined]: {
    label: "Declined",
    description: "The customer declined this quote.",
    chipClass: "border-destructive/50 bg-destructive/15 text-destructive",
  },
};

export function getQuoteStatusMeta(status: QuoteStatus): QuoteStatusMeta {
  return QUOTE_STATUS_META[status] ?? QUOTE_STATUS_META[QuoteStatus.draft];
}

/** Every quote approval status in lifecycle order. */
export const QUOTE_STATUSES: QuoteStatus[] = [
  QuoteStatus.draft,
  QuoteStatus.sent,
  QuoteStatus.approved,
  QuoteStatus.declined,
];

/** Whether a quote is still awaiting the customer's decision. */
export function isQuoteAwaitingDecision(
  quote: Quote | null | undefined,
): boolean {
  return quote?.status === QuoteStatus.sent;
}

/** Whether a quote has been approved by the customer. */
export function isQuoteApproved(quote: Quote | null | undefined): boolean {
  return quote?.status === QuoteStatus.approved;
}

/** Whether a quote has been declined by the customer. */
export function isQuoteDeclined(quote: Quote | null | undefined): boolean {
  return quote?.status === QuoteStatus.declined;
}

/** Whether a quote has passed its expiration date. */
export function isQuoteExpired(
  quote: Quote | null | undefined,
  now: Date = new Date(),
): boolean {
  if (!quote?.expiresAt) return false;
  const expires = timestampToDate(quote.expiresAt);
  if (!expires) return false;
  return expires.getTime() < now.getTime();
}

/** Expiration label for a quote, or null when it never expires. */
export function quoteExpiresLabel(
  quote: Quote | null | undefined,
): string | null {
  if (!quote?.expiresAt) return null;
  return `Expires ${formatDate(quote.expiresAt)}`;
}

/** The quote's stored total, falling back to the legacy amount field. */
export function quoteTotal(quote: Quote | null | undefined): bigint {
  if (!quote) return 0n;
  return quote.total > 0n ? quote.total : quote.amount;
}

/** The quote's stored remaining balance, falling back to total minus deposit. */
export function quoteRemainingBalance(quote: Quote | null | undefined): bigint {
  if (!quote) return 0n;
  if (quote.remainingBalance > 0n) return quote.remainingBalance;
  return quoteTotal(quote) - quote.depositRequired;
}

/** Line-item extended price (quantity × unit price). */
export function lineItemTotal(item: {
  quantity: bigint;
  unitPrice: bigint;
}): bigint {
  return item.quantity * item.unitPrice;
}

/** Sum of every line item's extended price. */
export function lineItemsSubtotal(
  items: { quantity: bigint; unitPrice: bigint }[],
): bigint {
  return items.reduce((sum, item) => sum + lineItemTotal(item), 0n);
}

/**
 * Adapt the guest `QuoteView` (returned by `getQuoteByReference`) into the
 * `Quote` shape the Track page's `QuotePanel` already renders.
 *
 * The emailed link and the reference-code lookup read the same quote record, so
 * the two views must present identically. `QuoteView` omits the legacy `amount`
 * and `sentAt` fields; `amount` falls back to the stored total and `sentAt` to
 * the quote's creation time, which is what the customer sees for a sent quote.
 */
export function quoteViewToQuote(view: QuoteView): Quote {
  return {
    amount: view.total,
    note: view.note,
    sentAt: 0n,
    discountApplied: view.discountApplied,
    discountAmount: view.discountAmount,
    status: view.status,
    lineItems: view.lineItems,
    total: view.total,
    laborCharge: view.laborCharge,
    createdAt: 0n,
    quoteNumber: view.quoteNumber,
    workDescription: view.workDescription,
    remainingBalance: view.remainingBalance,
    materialsCharge: view.materialsCharge,
    depositRequired: view.depositRequired,
    subtotal: view.subtotal,
    expiresAt: view.expiresAt,
  };
}

/**
 * Whether a `QuoteView` is past its expiration.
 *
 * The backend derives an `expired` flag against its own clock; this mirrors it
 * for the client so the emailed quote can disable acceptance without a round
 * trip. An expired quote can never be accepted.
 */
export function isQuoteViewExpired(view: QuoteView): boolean {
  return view.expired;
}

/** Human label for the per-channel email outcome of `sendQuote`. */
export function quoteEmailOutcomeLabel(email: QuoteEmailResult): string {
  return email.__kind__ === "sent"
    ? "Quote sent to the customer."
    : `The quote was saved, but the email could not be delivered: ${email.failed}`;
}

/** Whether the `sendQuote` email actually reached the customer. */
export function quoteEmailDelivered(email: QuoteEmailResult): boolean {
  return email.__kind__ === "sent";
}

/** The deposit is always half of the accepted quote total. */
export function depositAmount(quoteTotal: bigint): bigint {
  return quoteTotal / 2n;
}

/** Remaining balance after the deposit has been paid. */
export function balanceDue(quoteTotal: bigint): bigint {
  return quoteTotal - depositAmount(quoteTotal);
}

/* ------------------------------------------------------------------ */
/* Deposit — manual payment options                                    */
/* ------------------------------------------------------------------ */

/**
 * Cash App handle. Cash App stays fully available and unchanged; the other
 * manual options are added alongside it, never replacing it.
 */
export const CASHAPP_HANDLE = "$thebirdhouse2";

/** Deep link that opens the Cash App payment screen for the deposit. */
export function cashAppDepositUrl(amountCents: bigint): string {
  const dollars = (Number(amountCents) / 100).toFixed(2);
  return `https://cash.app/${CASHAPP_HANDLE}/${dollars}`;
}

/** Copy shown next to the Cash App deposit instructions. */
export const CASHAPP_DEPOSIT_NOTE =
  "Send the deposit on Cash App and we'll confirm it before we schedule.";

/** Venmo handle customers send the deposit to. */
export const VENMO_HANDLE = "@Lavona-Wright";

/** PayPal account name customers send the deposit to. */
export const PAYPAL_ACCOUNT = "tanae Wright";

/** Chime sign-in tag customers send the deposit to. */
export const CHIME_HANDLE = "$Tanae-Wright-2";

/**
 * One manual deposit option shown on the Track page.
 *
 * Every option records through the same backend `recordDeposit` path with the
 * `cashApp` variant — the backend `PaymentMethod` enum only has `stripe` and
 * `cashApp`, and the `Deposit` record has no provider field. The provider only
 * changes where the customer sends the money, never the amount; the UI names
 * the selected provider so the customer's choice is reflected accurately.
 */
export interface DepositOption {
  /** Stable identity for React keys and deterministic markers. */
  id: "cashapp" | "venmo" | "paypal" | "chime";
  /** Provider name shown on the option card. */
  label: string;
  /** The handle or account name the customer copies and pays. */
  handle: string;
  /** Short instruction for sending the deposit. */
  hint: string;
  /** Deep link to the provider's payment screen, or null when none exists. */
  url: string | null;
  /**
   * The backend method recorded for this option. All manual options map to the
   * existing `cashApp` variant because the enum must not be extended.
   */
  method: PaymentMethod;
}

/** The four manual deposit options, in display order. */
export const DEPOSIT_OPTIONS: DepositOption[] = [
  {
    id: "cashapp",
    label: "Cash App",
    handle: CASHAPP_HANDLE,
    hint: "Open Cash App and send the deposit to this $cashtag.",
    url: "https://cash.app/$thebirdhouse2",
    method: PaymentMethod.cashApp,
  },
  {
    id: "venmo",
    label: "Venmo",
    handle: VENMO_HANDLE,
    hint: "Open Venmo and send the deposit to this username.",
    url: `https://venmo.com/${VENMO_HANDLE.replace(/^@/, "")}`,
    method: PaymentMethod.venmo,
  },
  {
    id: "paypal",
    label: "PayPal",
    handle: PAYPAL_ACCOUNT,
    hint: "Send the deposit to this PayPal account name.",
    url: null,
    method: PaymentMethod.payPal,
  },
  {
    id: "chime",
    label: "Chime",
    handle: CHIME_HANDLE,
    hint: "Open Chime and send the deposit to this $ChimeSign.",
    url: null,
    method: PaymentMethod.chime,
  },
];

/** The deposit option matching a recorded backend payment method. */
export function depositOptionForMethod(
  method: PaymentMethod | undefined,
): DepositOption | null {
  if (!method) return null;
  return DEPOSIT_OPTIONS.find((option) => option.method === method) ?? null;
}

/** Human label for a recorded deposit method, or null when unknown. */
export function depositMethodLabel(
  method: PaymentMethod | undefined,
): string | null {
  return depositOptionForMethod(method)?.label ?? null;
}

/* ------------------------------------------------------------------ */
/* Deposit status                                                      */
/* ------------------------------------------------------------------ */

export interface DepositStatusMeta {
  label: string;
  description: string;
  /** Tailwind classes for the hexagon status chip. */
  chipClass: string;
}

const DEPOSIT_STATUS_META: Record<DepositStatus, DepositStatusMeta> = {
  [DepositStatus.pending]: {
    label: "Deposit due",
    description: "Send your deposit to secure your spot.",
    chipClass: "border-warning/60 bg-warning/15 text-warning",
  },
  [DepositStatus.submitted]: {
    label: "Deposit submitted — verifying",
    description:
      "We have your deposit and are verifying it. You'll be notified once it clears.",
    chipClass: "border-accent/60 bg-accent/15 text-accent",
  },
  [DepositStatus.verified]: {
    label: "Deposit verified",
    description: "Your deposit is confirmed — your spot is secured.",
    chipClass: "border-success/60 bg-success/15 text-success",
  },
  [DepositStatus.rejected]: {
    label: "Deposit not received",
    description:
      "We couldn't find your deposit. Please resubmit it with the correct details.",
    chipClass: "border-destructive/50 bg-destructive/15 text-destructive",
  },
};

export function getDepositStatusMeta(
  status: DepositStatus | undefined,
): DepositStatusMeta {
  return (
    DEPOSIT_STATUS_META[status ?? DepositStatus.pending] ??
    DEPOSIT_STATUS_META[DepositStatus.pending]
  );
}

/** Whether a deposit is awaiting the owner's verification. */
export function isDepositSubmitted(status: DepositStatus | undefined): boolean {
  return status === DepositStatus.submitted;
}

/** Whether a deposit has been verified and paid. */
export function isDepositVerified(status: DepositStatus | undefined): boolean {
  return status === DepositStatus.verified;
}

/** Whether a deposit was rejected and the customer may resubmit. */
export function isDepositRejected(status: DepositStatus | undefined): boolean {
  return status === DepositStatus.rejected;
}

/* ------------------------------------------------------------------ */
/* Own parts / supplies discount                                       */
/* ------------------------------------------------------------------ */

/** Whether the customer is supplying their own parts and supplies. */
export function isOwnParts(job: Pick<JobRequestView, "ownParts">): boolean {
  return job.ownParts === true;
}

/** Label for the own-parts flag, or null when the customer is not supplying. */
export function ownPartsLabel(
  job: Pick<JobRequestView, "ownParts">,
): string | null {
  return job.ownParts ? "Customer supplies parts & supplies" : null;
}

/** Whether a quote carries the own-parts discount. */
export function hasQuoteDiscount(quote: Quote | null | undefined): boolean {
  return quote?.discountApplied === true && quote.discountAmount > 0n;
}

/** Formatted discount amount, or null when no discount applies. */
export function quoteDiscountLabel(
  quote: Quote | null | undefined,
): string | null {
  if (!hasQuoteDiscount(quote)) return null;
  return `−${formatMoney(quote?.discountAmount ?? 0n)} own-parts discount`;
}

/** Quote total after the own-parts discount has been applied. */
export function quoteNetTotal(quote: Quote | null | undefined): bigint {
  if (!quote) return 0n;
  return hasQuoteDiscount(quote)
    ? quote.amount - quote.discountAmount
    : quote.amount;
}

/* ------------------------------------------------------------------ */
/* Visit history                                                       */
/* ------------------------------------------------------------------ */

/** Human label for the service performed on a visit. */
export function visitServiceLabel(visit: VisitRecord): string {
  return getService(visit.service).label;
}

/** The bee credited with a visit, or a friendly fallback. */
export function visitBeeName(visit: VisitRecord): string {
  const name = visit.beeName?.trim();
  return name && name.length > 0 ? name : "Honey Do's bee";
}

/** Short date for a visit row, e.g. "Mar 4, 2026". */
export function formatVisitDate(visit: VisitRecord): string {
  return formatDate(visit.completedAt);
}

/** Newest-first ordering guard for visit history arrays. */
export function sortVisitsNewestFirst(visits: VisitRecord[]): VisitRecord[] {
  return [...visits].sort((a, b) =>
    a.completedAt === b.completedAt
      ? 0
      : a.completedAt > b.completedAt
        ? -1
        : 1,
  );
}

/* ------------------------------------------------------------------ */
/* Monthly package                                                     */
/* ------------------------------------------------------------------ */

/** The monthly package is a manual owner-managed deal, never auto-billed. */
export const PACKAGE_BILLING_NOTE =
  "Billed monthly by the owner — no automatic recurring charges.";

/** Whether a job currently has an active monthly package enrollment. */
export function isPackageActive(
  enrollment: PackageEnrollment | null | undefined,
): boolean {
  return enrollment?.active === true;
}

/**
 * Monthly price label for an enrollment, or null when not enrolled.
 *
 * The package is priced per individual customer, so no dollar amount is ever
 * shown. The label states that a monthly rate exists and is set with the owner.
 */
export function packagePriceLabel(
  enrollment: PackageEnrollment | null | undefined,
): string | null {
  if (!enrollment) return null;
  return "Priced for your home";
}

/** Included-visits label for an enrollment, or null when not enrolled. */
export function packageVisitsLabel(
  enrollment: PackageEnrollment | null | undefined,
): string | null {
  if (!enrollment) return null;
  const visits = Number(enrollment.includedVisits);
  return `${visits} ${visits === 1 ? "visit" : "visits"} included each month`;
}

/** When the enrollment started, or null when not enrolled. */
export function packageStartedLabel(
  enrollment: PackageEnrollment | null | undefined,
): string | null {
  if (!enrollment) return null;
  return `Member since ${formatDate(enrollment.startedAt)}`;
}

/* ------------------------------------------------------------------ */
/* New-request triage                                                  */
/* ------------------------------------------------------------------ */

/**
 * A request still waiting on the owner's quote.
 *
 * These are the requests the owner must act on first, so the dashboard groups
 * them at the top and marks them as awaiting a quote.
 */
export function isAwaitingQuote(job: Pick<JobRequestView, "status">): boolean {
  return job.status === JobStatus.requested;
}

/** Split requests into the awaiting-quote group and everything else. */
export function partitionRequests(jobs: JobRequestView[]): {
  awaitingQuote: JobRequestView[];
  inProgress: JobRequestView[];
} {
  const awaitingQuote: JobRequestView[] = [];
  const inProgress: JobRequestView[] = [];
  for (const job of jobs) {
    if (isAwaitingQuote(job)) {
      awaitingQuote.push(job);
    } else {
      inProgress.push(job);
    }
  }
  return { awaitingQuote, inProgress };
}

/** How many requests are still awaiting the owner's quote. */
export function countAwaitingQuote(jobs: JobRequestView[]): number {
  return jobs.reduce(
    (total, job) => (isAwaitingQuote(job) ? total + 1 : total),
    0,
  );
}

/**
 * Compact "time since" label for the dashboard's last-updated indicator.
 *
 * Falls back to an absolute date once the gap passes a day so the label never
 * grows unbounded.
 */
export function formatRelativeTime(date: Date, now: Date = new Date()): string {
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return formatDate(BigInt(date.getTime()) * 1_000_000n);
}
