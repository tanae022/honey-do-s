import {
  type DepositStatus,
  type DiscountEligibility,
  type DiscountKind,
  type DiscountRule,
  JobRecordStatus,
  JobStatus,
  PaymentMethod,
  type PaymentSummaryView,
  type QuotePricing,
} from "@/backend";
import type { AdminStatusTone } from "@/components/admin/AdminStatusBadge";
import { formatMoney } from "@/lib/jobs";

/* ------------------------------------------------------------------ */
/* Admin status vocabulary                                             */
/* ------------------------------------------------------------------ */
/*
 * The admin console speaks a single, obvious status vocabulary across every
 * page: NEW, WAITING, ACTION REQUIRED, APPROVED, PAID, CONFIRMED, IN PROGRESS,
 * COMPLETED and CANCELLED. Each maps to one high-contrast badge tone so the
 * same state always reads the same color everywhere.
 */

export type AdminStatusKey =
  | "new"
  | "waiting"
  | "actionRequired"
  | "approved"
  | "paid"
  | "confirmed"
  | "inProgress"
  | "completed"
  | "cancelled";

export interface AdminStatusMeta {
  key: AdminStatusKey;
  label: string;
  tone: AdminStatusTone;
  description: string;
}

export const ADMIN_STATUS_META: Record<AdminStatusKey, AdminStatusMeta> = {
  new: {
    key: "new",
    label: "New",
    tone: "new",
    description: "Just arrived and not yet reviewed.",
  },
  waiting: {
    key: "waiting",
    label: "Waiting",
    tone: "waiting",
    description: "Waiting on the customer or on parts.",
  },
  actionRequired: {
    key: "actionRequired",
    label: "Action Required",
    tone: "action",
    description: "Needs the owner to do something next.",
  },
  approved: {
    key: "approved",
    label: "Approved",
    tone: "approved",
    description: "The customer approved the quote.",
  },
  paid: {
    key: "paid",
    label: "Paid",
    tone: "paid",
    description: "Payment has been received.",
  },
  confirmed: {
    key: "confirmed",
    label: "Confirmed",
    tone: "confirmed",
    description: "The appointment is confirmed.",
  },
  inProgress: {
    key: "inProgress",
    label: "In Progress",
    tone: "progress",
    description: "Work is underway right now.",
  },
  completed: {
    key: "completed",
    label: "Completed",
    tone: "completed",
    description: "The job is finished.",
  },
  cancelled: {
    key: "cancelled",
    label: "Cancelled",
    tone: "cancelled",
    description: "The job was cancelled.",
  },
};

/** Every admin status in display order, for legends and filters. */
export const ADMIN_STATUS_ORDER: AdminStatusKey[] = [
  "new",
  "waiting",
  "actionRequired",
  "approved",
  "paid",
  "confirmed",
  "inProgress",
  "completed",
  "cancelled",
];

export function getAdminStatusMeta(key: AdminStatusKey): AdminStatusMeta {
  return ADMIN_STATUS_META[key];
}

/**
 * Map a job's lifecycle status onto the admin status vocabulary.
 *
 * `requested` is a brand-new request; `quoted` is waiting on the customer's
 * decision; `scheduled` is confirmed; `inProgress` and `completed` map
 * directly; `cancelled` is terminal.
 */
export function adminStatusForJob(status: JobStatus): AdminStatusMeta {
  switch (status) {
    case JobStatus.requested:
      return ADMIN_STATUS_META.new;
    case JobStatus.quoted:
      return ADMIN_STATUS_META.waiting;
    case JobStatus.scheduled:
      return ADMIN_STATUS_META.confirmed;
    case JobStatus.inProgress:
      return ADMIN_STATUS_META.inProgress;
    case JobStatus.completed:
      return ADMIN_STATUS_META.completed;
    case JobStatus.cancelled:
      return ADMIN_STATUS_META.cancelled;
    default:
      return ADMIN_STATUS_META.new;
  }
}

/** Map a job record's status onto the admin status vocabulary. */
export function adminStatusForJobRecord(
  status: JobRecordStatus,
): AdminStatusMeta {
  switch (status) {
    case JobRecordStatus.scheduled:
      return ADMIN_STATUS_META.confirmed;
    case JobRecordStatus.inProgress:
      return ADMIN_STATUS_META.inProgress;
    case JobRecordStatus.completed:
      return ADMIN_STATUS_META.completed;
    case JobRecordStatus.cancelled:
      return ADMIN_STATUS_META.cancelled;
    default:
      return ADMIN_STATUS_META.new;
  }
}

/* ------------------------------------------------------------------ */
/* Deposit status                                                      */
/* ------------------------------------------------------------------ */

export interface DepositStatusMeta {
  label: string;
  tone: AdminStatusTone;
  description: string;
}

const DEPOSIT_STATUS_META: Record<DepositStatus, DepositStatusMeta> = {
  pending: {
    label: "Deposit pending",
    tone: "waiting",
    description: "The customer has not submitted a deposit yet.",
  },
  submitted: {
    label: "Deposit submitted",
    tone: "action",
    description: "The customer says they paid — verify it.",
  },
  verified: {
    label: "Deposit verified",
    tone: "paid",
    description: "The deposit has been confirmed received.",
  },
  rejected: {
    label: "Deposit rejected",
    tone: "cancelled",
    description: "The submitted deposit could not be verified.",
  },
};

export function getDepositStatusMeta(status: DepositStatus): DepositStatusMeta {
  return DEPOSIT_STATUS_META[status] ?? DEPOSIT_STATUS_META.pending;
}

/* ------------------------------------------------------------------ */
/* Pricing breakdown                                                   */
/* ------------------------------------------------------------------ */

/**
 * The full pricing breakdown shown to the admin and the customer.
 *
 * Every amount is in whole cents. `originalSubtotal` is the pre-discount
 * subtotal, `adjustedSubtotal` is after the discount, `finalTotal` adds tax,
 * `depositAmount` is the 10% deposit and `remainingBalance` is what is left.
 */
export interface PricingBreakdown {
  originalSubtotal: bigint;
  discountAmount: bigint;
  adjustedSubtotal: bigint;
  taxAmount: bigint;
  finalTotal: bigint;
  depositAmount: bigint;
  remainingBalance: bigint;
}

/** Build a pricing breakdown from a quote's stored pricing, if present. */
export function pricingFromQuotePricing(
  pricing: QuotePricing | undefined,
): PricingBreakdown | null {
  if (!pricing) return null;
  return {
    originalSubtotal: pricing.originalSubtotal,
    discountAmount: pricing.discountAmount,
    adjustedSubtotal: pricing.adjustedSubtotal,
    taxAmount: pricing.taxAmount,
    finalTotal: pricing.finalTotal,
    depositAmount: pricing.depositAmount,
    remainingBalance: pricing.remainingBalance,
  };
}

/** Build a pricing breakdown from a payment summary view. */
export function pricingFromSummary(
  summary: PaymentSummaryView,
): PricingBreakdown {
  return {
    originalSubtotal: summary.originalSubtotal,
    discountAmount: summary.discountAmount,
    adjustedSubtotal: summary.adjustedSubtotal,
    taxAmount: summary.taxAmount,
    finalTotal: summary.finalTotal,
    depositAmount: summary.depositAmount,
    remainingBalance: summary.remainingBalance,
  };
}

/** One labeled row of the pricing breakdown, ready to render. */
export interface PricingRow {
  key: string;
  label: string;
  amount: bigint;
  /** Emphasize the final total and remaining balance. */
  emphasis?: boolean;
  /** Render the amount as a deduction (e.g. a discount). */
  negative?: boolean;
}

/**
 * Turn a pricing breakdown into ordered, labeled rows.
 *
 * The discount row is omitted when there is no discount, and the tax row is
 * omitted when tax is zero, so the breakdown never shows empty noise.
 */
export function pricingRows(breakdown: PricingBreakdown): PricingRow[] {
  const rows: PricingRow[] = [
    {
      key: "originalSubtotal",
      label: "Original subtotal",
      amount: breakdown.originalSubtotal,
    },
  ];
  if (breakdown.discountAmount > 0n) {
    rows.push({
      key: "discount",
      label: "Discount",
      amount: breakdown.discountAmount,
      negative: true,
    });
  }
  rows.push({
    key: "adjustedSubtotal",
    label: "Adjusted subtotal",
    amount: breakdown.adjustedSubtotal,
  });
  if (breakdown.taxAmount > 0n) {
    rows.push({
      key: "tax",
      label: "Tax",
      amount: breakdown.taxAmount,
    });
  }
  rows.push({
    key: "finalTotal",
    label: "Final total",
    amount: breakdown.finalTotal,
    emphasis: true,
  });
  rows.push({
    key: "deposit",
    label: "Deposit (10%)",
    amount: breakdown.depositAmount,
  });
  rows.push({
    key: "remainingBalance",
    label: "Remaining balance",
    amount: breakdown.remainingBalance,
    emphasis: true,
  });
  return rows;
}

/** Format a pricing row's amount, prefixing a deduction with a minus sign. */
export function formatPricingAmount(row: PricingRow): string {
  const formatted = formatMoney(row.amount);
  return row.negative ? `−${formatted}` : formatted;
}

/* ------------------------------------------------------------------ */
/* Discount rules                                                      */
/* ------------------------------------------------------------------ */

export function discountKindLabel(kind: DiscountKind): string {
  return kind === "percentage" ? "Percentage" : "Fixed amount";
}

export function discountEligibilityLabel(
  eligibility: DiscountEligibility,
): string {
  switch (eligibility) {
    case "all":
      return "All customers";
    case "returningCustomer":
      return "Returning customers";
    case "ownParts":
      return "Customers supplying their own parts";
    default:
      return "All customers";
  }
}

/** Human label for a discount rule's value, e.g. "10%" or "$25.00". */
export function discountValueLabel(rule: DiscountRule): string {
  return rule.kind === "percentage"
    ? `${Number(rule.value)}%`
    : formatMoney(rule.value);
}

/* ------------------------------------------------------------------ */
/* Payment methods                                                     */
/* ------------------------------------------------------------------ */

const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  stripe: "Card (Stripe)",
  venmo: "Venmo",
  chime: "Chime",
  cashApp: "Cash App",
  payPal: "PayPal",
};

export function paymentMethodLabel(method: PaymentMethod): string {
  return PAYMENT_METHOD_LABELS[method] ?? "Payment";
}

/** Every payment method in display order. */
export const PAYMENT_METHODS: PaymentMethod[] = [
  PaymentMethod.cashApp,
  PaymentMethod.venmo,
  PaymentMethod.payPal,
  PaymentMethod.chime,
  PaymentMethod.stripe,
];
