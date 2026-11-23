import { $ as JobStatus, Q as JobRecordStatus, m as formatMoney, tt as PaymentMethod } from "./createLucideIcon-CK3986Sn.js";
// src/lib/admin.ts
var ADMIN_STATUS_META = {
	new: {
		key: "new",
		label: "New",
		tone: "new",
		description: "Just arrived and not yet reviewed."
	},
	waiting: {
		key: "waiting",
		label: "Waiting",
		tone: "waiting",
		description: "Waiting on the customer or on parts."
	},
	actionRequired: {
		key: "actionRequired",
		label: "Action Required",
		tone: "action",
		description: "Needs the owner to do something next."
	},
	approved: {
		key: "approved",
		label: "Approved",
		tone: "approved",
		description: "The customer approved the quote."
	},
	paid: {
		key: "paid",
		label: "Paid",
		tone: "paid",
		description: "Payment has been received."
	},
	confirmed: {
		key: "confirmed",
		label: "Confirmed",
		tone: "confirmed",
		description: "The appointment is confirmed."
	},
	inProgress: {
		key: "inProgress",
		label: "In Progress",
		tone: "progress",
		description: "Work is underway right now."
	},
	completed: {
		key: "completed",
		label: "Completed",
		tone: "completed",
		description: "The job is finished."
	},
	cancelled: {
		key: "cancelled",
		label: "Cancelled",
		tone: "cancelled",
		description: "The job was cancelled."
	}
};
/** Every admin status in display order, for legends and filters. */
var ADMIN_STATUS_ORDER = [
	"new",
	"waiting",
	"actionRequired",
	"approved",
	"paid",
	"confirmed",
	"inProgress",
	"completed",
	"cancelled"
];
function getAdminStatusMeta(key) {
	return ADMIN_STATUS_META[key];
}
/**
* Map a job's lifecycle status onto the admin status vocabulary.
*
* `requested` is a brand-new request; `quoted` is waiting on the customer's
* decision; `scheduled` is confirmed; `inProgress` and `completed` map
* directly; `cancelled` is terminal.
*/
function adminStatusForJob(status) {
	switch (status) {
		case JobStatus.requested: return ADMIN_STATUS_META.new;
		case JobStatus.quoted: return ADMIN_STATUS_META.waiting;
		case JobStatus.scheduled: return ADMIN_STATUS_META.confirmed;
		case JobStatus.inProgress: return ADMIN_STATUS_META.inProgress;
		case JobStatus.completed: return ADMIN_STATUS_META.completed;
		case JobStatus.cancelled: return ADMIN_STATUS_META.cancelled;
		default: return ADMIN_STATUS_META.new;
	}
}
/** Map a job record's status onto the admin status vocabulary. */
function adminStatusForJobRecord(status) {
	switch (status) {
		case JobRecordStatus.scheduled: return ADMIN_STATUS_META.confirmed;
		case JobRecordStatus.inProgress: return ADMIN_STATUS_META.inProgress;
		case JobRecordStatus.completed: return ADMIN_STATUS_META.completed;
		case JobRecordStatus.cancelled: return ADMIN_STATUS_META.cancelled;
		default: return ADMIN_STATUS_META.new;
	}
}
var DEPOSIT_STATUS_META = {
	pending: {
		label: "Deposit pending",
		tone: "waiting",
		description: "The customer has not submitted a deposit yet."
	},
	submitted: {
		label: "Deposit submitted",
		tone: "action",
		description: "The customer says they paid — verify it."
	},
	verified: {
		label: "Deposit verified",
		tone: "paid",
		description: "The deposit has been confirmed received."
	},
	rejected: {
		label: "Deposit rejected",
		tone: "cancelled",
		description: "The submitted deposit could not be verified."
	}
};
function getDepositStatusMeta(status) {
	return DEPOSIT_STATUS_META[status] ?? DEPOSIT_STATUS_META.pending;
}
/** Build a pricing breakdown from a quote's stored pricing, if present. */
function pricingFromQuotePricing(pricing) {
	if (!pricing) return null;
	return {
		originalSubtotal: pricing.originalSubtotal,
		discountAmount: pricing.discountAmount,
		adjustedSubtotal: pricing.adjustedSubtotal,
		taxAmount: pricing.taxAmount,
		finalTotal: pricing.finalTotal,
		depositAmount: pricing.depositAmount,
		remainingBalance: pricing.remainingBalance
	};
}
/**
* Turn a pricing breakdown into ordered, labeled rows.
*
* The discount row is omitted when there is no discount, and the tax row is
* omitted when tax is zero, so the breakdown never shows empty noise.
*/
function pricingRows(breakdown) {
	const rows = [{
		key: "originalSubtotal",
		label: "Original subtotal",
		amount: breakdown.originalSubtotal
	}];
	if (breakdown.discountAmount > 0n) rows.push({
		key: "discount",
		label: "Discount",
		amount: breakdown.discountAmount,
		negative: true
	});
	rows.push({
		key: "adjustedSubtotal",
		label: "Adjusted subtotal",
		amount: breakdown.adjustedSubtotal
	});
	if (breakdown.taxAmount > 0n) rows.push({
		key: "tax",
		label: "Tax",
		amount: breakdown.taxAmount
	});
	rows.push({
		key: "finalTotal",
		label: "Final total",
		amount: breakdown.finalTotal,
		emphasis: true
	});
	rows.push({
		key: "deposit",
		label: "Deposit (10%)",
		amount: breakdown.depositAmount
	});
	rows.push({
		key: "remainingBalance",
		label: "Remaining balance",
		amount: breakdown.remainingBalance,
		emphasis: true
	});
	return rows;
}
/** Format a pricing row's amount, prefixing a deduction with a minus sign. */
function formatPricingAmount(row) {
	const formatted = formatMoney(row.amount);
	return row.negative ? `−${formatted}` : formatted;
}
function discountKindLabel(kind) {
	return kind === "percentage" ? "Percentage" : "Fixed amount";
}
function discountEligibilityLabel(eligibility) {
	switch (eligibility) {
		case "all": return "All customers";
		case "returningCustomer": return "Returning customers";
		case "ownParts": return "Customers supplying their own parts";
		default: return "All customers";
	}
}
/** Human label for a discount rule's value, e.g. "10%" or "$25.00". */
function discountValueLabel(rule) {
	return rule.kind === "percentage" ? `${Number(rule.value)}%` : formatMoney(rule.value);
}
var PAYMENT_METHOD_LABELS = {
	stripe: "Card (Stripe)",
	venmo: "Venmo",
	chime: "Chime",
	cashApp: "Cash App",
	payPal: "PayPal"
};
function paymentMethodLabel(method) {
	return PAYMENT_METHOD_LABELS[method] ?? "Payment";
}
/** Every payment method in display order. */
var PAYMENT_METHODS = [
	PaymentMethod.cashApp,
	PaymentMethod.venmo,
	PaymentMethod.payPal,
	PaymentMethod.chime,
	PaymentMethod.stripe
];
export { adminStatusForJobRecord as a, discountValueLabel as c, getDepositStatusMeta as d, paymentMethodLabel as f, adminStatusForJob as i, formatPricingAmount as l, pricingRows as m, ADMIN_STATUS_ORDER as n, discountEligibilityLabel as o, pricingFromQuotePricing as p, PAYMENT_METHODS as r, discountKindLabel as s, ADMIN_STATUS_META as t, getAdminStatusMeta as u };
