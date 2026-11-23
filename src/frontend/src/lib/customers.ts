import { CustomerStatus, NotificationKind, PreferredContact } from "@/backend";
import type {
  CustomerId,
  CustomerInput,
  CustomerNote,
  CustomerProfileView,
  CustomerSummary,
  CustomerView,
  MessageId,
  MessageView,
  NotificationId,
  NotificationView,
  Timestamp,
} from "@/backend";
import { formatDate } from "@/lib/jobs";

/* ------------------------------------------------------------------ */
/* Customer domain types                                               */
/* ------------------------------------------------------------------ */
/*
 * The backend customer/notification/message contract is emitted by bindgen
 * into "@/backend". Re-export the generated shapes here so the customer pages
 * keep a single import site without hand-writing a parallel type surface.
 */

export { CustomerStatus, NotificationKind, PreferredContact };
export type {
  CustomerId,
  CustomerInput,
  CustomerNote,
  CustomerProfileView,
  CustomerSummary,
  CustomerView,
  MessageId,
  MessageView,
  NotificationId,
  NotificationView,
};

/* ------------------------------------------------------------------ */
/* Status labels                                                       */
/* ------------------------------------------------------------------ */

export interface CustomerStatusMeta {
  label: string;
  description: string;
  /** Tailwind classes for the hexagon status chip. */
  chipClass: string;
}

const STATUS_META: Record<CustomerStatus, CustomerStatusMeta> = {
  [CustomerStatus.active]: {
    label: "Active",
    description: "A current customer in good standing.",
    chipClass: "border-success/60 bg-success/15 text-success",
  },
  [CustomerStatus.inactive]: {
    label: "Inactive",
    description: "No recent requests — kept on file.",
    chipClass: "border-warning/60 bg-warning/15 text-warning",
  },
  [CustomerStatus.archived]: {
    label: "Archived",
    description: "Hidden from the active directory.",
    chipClass: "border-border bg-muted/60 text-muted-foreground",
  },
};

export function getCustomerStatusMeta(
  status: CustomerStatus,
): CustomerStatusMeta {
  return STATUS_META[status] ?? STATUS_META[CustomerStatus.active];
}

/** Every customer status in display order. */
export const CUSTOMER_STATUSES: CustomerStatus[] = [
  CustomerStatus.active,
  CustomerStatus.inactive,
  CustomerStatus.archived,
];

/* ------------------------------------------------------------------ */
/* Preferred-contact labels                                            */
/* ------------------------------------------------------------------ */

export interface PreferredContactMeta {
  label: string;
  /** lucide-react icon name resolved by the consumer. */
  icon: string;
}

const CONTACT_META: Record<PreferredContact, PreferredContactMeta> = {
  [PreferredContact.email]: { label: "Email", icon: "Mail" },
  [PreferredContact.phone]: { label: "Phone call", icon: "Phone" },
  [PreferredContact.sms]: { label: "Text message", icon: "MessageSquare" },
};

export function getPreferredContactMeta(
  preferred: PreferredContact,
): PreferredContactMeta {
  return CONTACT_META[preferred] ?? CONTACT_META[PreferredContact.email];
}

/** Every preferred-contact method in display order. */
export const PREFERRED_CONTACTS: PreferredContact[] = [
  PreferredContact.email,
  PreferredContact.phone,
  PreferredContact.sms,
];

/* ------------------------------------------------------------------ */
/* Notification labels                                                 */
/* ------------------------------------------------------------------ */

const NOTIFICATION_KIND_LABELS: Record<NotificationKind, string> = {
  [NotificationKind.newCustomer]: "New customer",
  [NotificationKind.returningCustomerRequest]: "Returning customer",
  [NotificationKind.customerMessage]: "Customer message",
  [NotificationKind.newMessage]: "New message",
  [NotificationKind.bookingApproval]: "Booking approval",
  [NotificationKind.depositReceived]: "Deposit received",
  [NotificationKind.depositSubmitted]: "Deposit submitted",
  [NotificationKind.depositVerified]: "Deposit verified",
  [NotificationKind.paymentReceived]: "Payment received",
  [NotificationKind.quoteApproved]: "Quote approved",
  [NotificationKind.quoteDeclined]: "Quote declined",
  [NotificationKind.appointmentConfirmed]: "Appointment confirmed",
  [NotificationKind.appointmentChanged]: "Appointment changed",
  [NotificationKind.appointmentReminder]: "Appointment reminder",
  [NotificationKind.newRequest]: "New request",
};

export function notificationKindLabel(kind: NotificationKind): string {
  return NOTIFICATION_KIND_LABELS[kind] ?? "Notification";
}

/**
 * Whether a notification kind reports a customer decision or a schedule change
 * — the kinds the owner must act on rather than simply acknowledge.
 */
export function isActionableNotification(kind: NotificationKind): boolean {
  return (
    kind === NotificationKind.quoteApproved ||
    kind === NotificationKind.quoteDeclined ||
    kind === NotificationKind.appointmentConfirmed ||
    kind === NotificationKind.appointmentChanged
  );
}

/* ------------------------------------------------------------------ */
/* Formatting                                                          */
/* ------------------------------------------------------------------ */

/** Short date for a customer record, e.g. "Mar 4, 2026". */
export function formatCustomerSince(createdAt: Timestamp): string {
  return formatDate(createdAt);
}

/** Job-count label for a directory row. */
export function formatJobCount(count: bigint): string {
  const value = Number(count);
  return `${value} ${value === 1 ? "job" : "jobs"}`;
}

/** Initials for a customer avatar, e.g. "Ada Lovelace" -> "AL". */
export function customerInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

/** A customer's display name, or a friendly fallback for an empty record. */
export function customerDisplayName(customer: {
  fullName: string;
}): string {
  const name = customer.fullName.trim();
  return name.length > 0 ? name : "Unnamed customer";
}

/* ------------------------------------------------------------------ */
/* CSV export                                                          */
/* ------------------------------------------------------------------ */

/**
 * Trigger a browser download of the backend's CSV export.
 *
 * The backend returns the CSV as text; this wraps it in a Blob and clicks a
 * temporary anchor so the admin gets a real file download.
 */
export function downloadCustomersCsv(
  csv: string,
  filename = "customers.csv",
): void {
  if (typeof window === "undefined") return;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
