import { J as CustomerStatus, et as NotificationKind, f as formatDate, nt as PreferredContact } from "./createLucideIcon-CK3986Sn.js";
// src/lib/customers.ts
var STATUS_META = {
	[CustomerStatus.active]: {
		label: "Active",
		description: "A current customer in good standing.",
		chipClass: "border-success/60 bg-success/15 text-success"
	},
	[CustomerStatus.inactive]: {
		label: "Inactive",
		description: "No recent requests — kept on file.",
		chipClass: "border-warning/60 bg-warning/15 text-warning"
	},
	[CustomerStatus.archived]: {
		label: "Archived",
		description: "Hidden from the active directory.",
		chipClass: "border-border bg-muted/60 text-muted-foreground"
	}
};
function getCustomerStatusMeta(status) {
	return STATUS_META[status] ?? STATUS_META[CustomerStatus.active];
}
/** Every customer status in display order. */
var CUSTOMER_STATUSES = [
	CustomerStatus.active,
	CustomerStatus.inactive,
	CustomerStatus.archived
];
var CONTACT_META = {
	[PreferredContact.email]: {
		label: "Email",
		icon: "Mail"
	},
	[PreferredContact.phone]: {
		label: "Phone call",
		icon: "Phone"
	},
	[PreferredContact.sms]: {
		label: "Text message",
		icon: "MessageSquare"
	}
};
function getPreferredContactMeta(preferred) {
	return CONTACT_META[preferred] ?? CONTACT_META[PreferredContact.email];
}
/** Every preferred-contact method in display order. */
var PREFERRED_CONTACTS = [
	PreferredContact.email,
	PreferredContact.phone,
	PreferredContact.sms
];
var NOTIFICATION_KIND_LABELS = {
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
	[NotificationKind.newRequest]: "New request"
};
function notificationKindLabel(kind) {
	return NOTIFICATION_KIND_LABELS[kind] ?? "Notification";
}
/** Short date for a customer record, e.g. "Mar 4, 2026". */
function formatCustomerSince(createdAt) {
	return formatDate(createdAt);
}
/** Job-count label for a directory row. */
function formatJobCount(count) {
	const value = Number(count);
	return `${value} ${value === 1 ? "job" : "jobs"}`;
}
/** Initials for a customer avatar, e.g. "Ada Lovelace" -> "AL". */
function customerInitials(fullName) {
	const parts = fullName.trim().split(/\s+/).filter(Boolean);
	if (parts.length === 0) return "?";
	if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
	return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}
/** A customer's display name, or a friendly fallback for an empty record. */
function customerDisplayName(customer) {
	const name = customer.fullName.trim();
	return name.length > 0 ? name : "Unnamed customer";
}
/**
* Trigger a browser download of the backend's CSV export.
*
* The backend returns the CSV as text; this wraps it in a Blob and clicks a
* temporary anchor so the admin gets a real file download.
*/
function downloadCustomersCsv(csv, filename = "customers.csv") {
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
export { downloadCustomersCsv as a, getCustomerStatusMeta as c, customerInitials as i, getPreferredContactMeta as l, PREFERRED_CONTACTS as n, formatCustomerSince as o, customerDisplayName as r, formatJobCount as s, CUSTOMER_STATUSES as t, notificationKindLabel as u };
