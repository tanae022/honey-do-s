import { r as __toESM } from "./rolldown-runtime-SbdDWaPq.js";
import { i as useMutation, r as useInternetIdentity, s as useQueryClient, t as useActor } from "./dist-DCUbDtYL.js";
import { G as getService, K as cn, N as quoteEmailDelivered, P as quoteEmailOutcomeLabel, at as createActor, ct as require_react, k as lineItemsSubtotal, m as formatMoney, st as require_jsx_runtime, y as getQuoteStatusMeta } from "./createLucideIcon-CK3986Sn.js";
import { t as BadgeCheck } from "./badge-check-CxAhc_Pv.js";
import { t as CalendarClock } from "./calendar-clock-BKRV_BaF.js";
import { t as Check } from "./check-qhjPHsNw.js";
import { t as FileText } from "./file-text-BqDxuuUp.js";
import { C as AdminChip, D as AdminButton, E as AdminCardHeader, O as AdminPageHeader, T as AdminCard, _ as AdminField, b as AdminTextarea, g as AdminEmptyState, k as AdminShell, n as AdminLoadingState, t as AdminErrorState, v as AdminInput, w as AdminStatusBadge } from "./admin-DxTl2OJo.js";
import { t as Plus } from "./plus-BbIZ9xgk.js";
import { t as Send } from "./send-BC-7IC_M.js";
import { t as ShieldAlert } from "./shield-alert-CwcHCNy3.js";
import { t as ThumbsDown } from "./thumbs-down-DKKayDLZ.js";
import { t as Trash2 } from "./trash-2-hTaV3zpM.js";
import { E as useJobRequests, M as useScheduleAppointment, P as useSendQuote, R as useSetQuote, w as useIsAdmin } from "./index-DhzL9CXu.js";
import { b as useSettings, s as useDiscounts } from "./useAdminSettings-CtJqDOX4.js";
import { l as useCustomers } from "./useCustomers-it81kN8P.js";
// src/pages/Quotes.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function useEditQuote() {
	const { actor } = useActor(createActor);
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (vars) => {
			if (!actor) throw new Error("Backend is not ready");
			return actor.editQuote(vars.id, vars.input);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["jobs"] });
		}
	});
}
function useApproveQuote() {
	const { actor } = useActor(createActor);
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id) => {
			if (!actor) throw new Error("Backend is not ready");
			return actor.approveQuote(id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["jobs"] });
		}
	});
}
function useDeclineQuote() {
	const { actor } = useActor(createActor);
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id) => {
			if (!actor) throw new Error("Backend is not ready");
			return actor.declineQuote(id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["jobs"] });
		}
	});
}
function useConvertQuoteToJob() {
	const { actor } = useActor(createActor);
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (vars) => {
			if (!actor) throw new Error("Backend is not ready");
			return actor.convertQuoteToJob(vars.id, vars.scheduledAt);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["jobs"] });
		}
	});
}
var lineItemSeq = 0;
function newLineItem() {
	lineItemSeq += 1;
	return {
		key: `line-${lineItemSeq}`,
		description: "",
		quantity: "1",
		unitPrice: ""
	};
}
/** Dollars string → whole cents, tolerating blanks and stray characters. */
function dollarsToCents(value) {
	const parsed = Number.parseFloat(value);
	if (!Number.isFinite(parsed) || parsed < 0) return 0n;
	return BigInt(Math.round(parsed * 100));
}
/** Whole cents → a plain dollars string for an editable input. */
function centsToDollars(cents) {
	if (cents <= 0n) return "";
	return (Number(cents) / 100).toFixed(2);
}
/** `YYYY-MM-DD` → a nanosecond timestamp at local midnight, or undefined. */
function dateInputToTimestamp(value) {
	if (!value) return void 0;
	const date = /* @__PURE__ */ new Date(`${value}T00:00:00`);
	if (Number.isNaN(date.getTime())) return void 0;
	return BigInt(date.getTime()) * 1000000n;
}
/** A nanosecond timestamp → `YYYY-MM-DD` for a date input, or "". */
function timestampToDateInput(timestamp) {
	if (!timestamp) return "";
	const date = new Date(Number(timestamp / 1000000n));
	if (Number.isNaN(date.getTime())) return "";
	const month = `${date.getMonth() + 1}`.padStart(2, "0");
	const day = `${date.getDate()}`.padStart(2, "0");
	return `${date.getFullYear()}-${month}-${day}`;
}
function emptyDraft(terms) {
	return {
		workDescription: "",
		note: "",
		terms,
		laborCharge: "",
		materialsCharge: "",
		depositRequired: "",
		expiresAt: "",
		lineItems: [newLineItem()]
	};
}
function draftFromQuote(quote, terms) {
	return {
		workDescription: quote.workDescription,
		note: quote.note,
		terms,
		laborCharge: centsToDollars(quote.laborCharge),
		materialsCharge: centsToDollars(quote.materialsCharge),
		depositRequired: centsToDollars(quote.depositRequired),
		expiresAt: timestampToDateInput(quote.expiresAt),
		lineItems: quote.lineItems.length > 0 ? quote.lineItems.map((item) => {
			lineItemSeq += 1;
			return {
				key: `line-${lineItemSeq}`,
				description: item.description,
				quantity: item.quantity.toString(),
				unitPrice: centsToDollars(item.unitPrice)
			};
		}) : [newLineItem()]
	};
}
function draftToInput(draft) {
	const lineItems = draft.lineItems.filter((item) => item.description.trim().length > 0).map((item) => ({
		description: item.description.trim(),
		quantity: BigInt(Math.max(1, Math.round(Number(item.quantity) || 1))),
		unitPrice: dollarsToCents(item.unitPrice)
	}));
	return {
		workDescription: draft.workDescription.trim(),
		note: draft.note.trim(),
		lineItems,
		laborCharge: dollarsToCents(draft.laborCharge),
		materialsCharge: dollarsToCents(draft.materialsCharge),
		depositRequired: dollarsToCents(draft.depositRequired),
		expiresAt: dateInputToTimestamp(draft.expiresAt)
	};
}
function withinWindow(rule, now) {
	const afterStart = rule.startAt === void 0 ? true : now >= rule.startAt;
	const beforeEnd = rule.endAt === void 0 ? true : now <= rule.endAt;
	return afterStart && beforeEnd;
}
function ruleEligible(rule, context) {
	switch (rule.eligibility) {
		case "all": return true;
		case "ownParts": return context.ownParts;
		case "returningCustomer": return context.returningCustomer;
		default: return true;
	}
}
function rawDiscount(rule, subtotal) {
	return rule.kind === "percentage" ? subtotal * rule.value / 100n : rule.value;
}
function cappedDiscount(rule, subtotal) {
	const raw = rawDiscount(rule, subtotal);
	const capped = rule.maxDiscount > 0n && raw > rule.maxDiscount ? rule.maxDiscount : raw;
	return capped > subtotal ? subtotal : capped;
}
function selectDiscount(rules, context, now) {
	let sawInactive = false;
	let sawExpired = false;
	let sawIneligible = false;
	let sawBelowMinimum = false;
	for (const rule of rules) if (!rule.active) sawInactive = true;
	else if (!withinWindow(rule, now)) sawExpired = true;
	else if (!ruleEligible(rule, context)) sawIneligible = true;
	else if (rule.minPurchase > 0n && context.subtotal < rule.minPurchase) sawBelowMinimum = true;
	else {
		const amount = cappedDiscount(rule, context.subtotal);
		if (amount > 0n) {
			const capped = rule.maxDiscount > 0n && rawDiscount(rule, context.subtotal) > rule.maxDiscount;
			return {
				applied: true,
				ruleName: rule.name,
				amount,
				reason: capped ? `Applied ${rule.name} (capped at the maximum discount)` : `Applied ${rule.name}`
			};
		}
	}
	if (sawInactive) return {
		applied: false,
		ruleName: "",
		amount: 0n,
		reason: "No discount applied: the matching rule is inactive"
	};
	if (sawExpired) return {
		applied: false,
		ruleName: "",
		amount: 0n,
		reason: "No discount applied: the matching rule is expired or not yet active"
	};
	if (sawIneligible) return {
		applied: false,
		ruleName: "",
		amount: 0n,
		reason: "No discount applied: no rule is eligible for this customer"
	};
	if (sawBelowMinimum) return {
		applied: false,
		ruleName: "",
		amount: 0n,
		reason: "No discount applied: the subtotal is below the minimum purchase"
	};
	return {
		applied: false,
		ruleName: "",
		amount: 0n,
		reason: "No discount applied: no discount rule is configured"
	};
}
function computeLivePricing(draft, rules, taxEnabled, taxRatePercent, context, now) {
	const items = draft.lineItems.map((item) => ({
		quantity: BigInt(Math.max(1, Math.round(Number(item.quantity) || 1))),
		unitPrice: dollarsToCents(item.unitPrice)
	}));
	const originalSubtotal = lineItemsSubtotal(items) + dollarsToCents(draft.laborCharge) + dollarsToCents(draft.materialsCharge);
	const discount = selectDiscount(rules, {
		subtotal: originalSubtotal,
		...context
	}, now);
	const discountAmount = discount.applied ? discount.amount : 0n;
	const adjustedSubtotal = discountAmount >= originalSubtotal ? 0n : originalSubtotal - discountAmount;
	const taxAmount = taxEnabled ? adjustedSubtotal * taxRatePercent / 100n : 0n;
	const finalTotal = adjustedSubtotal + taxAmount;
	const enteredDeposit = dollarsToCents(draft.depositRequired);
	const depositAmount = enteredDeposit >= finalTotal ? finalTotal : enteredDeposit;
	return {
		originalSubtotal,
		discountAmount,
		adjustedSubtotal,
		taxAmount,
		finalTotal,
		depositAmount,
		remainingBalance: depositAmount >= finalTotal ? 0n : finalTotal - depositAmount,
		discount
	};
}
/**
* Admin quote builder.
*
* Pick a service request, capture the itemized quote, then save, send, approve,
* decline or convert it into a scheduled job. Every amount is calculated
* automatically as the admin types — the discount, tax, final total, 10%
* deposit and remaining balance — with the reason a discount was or was not
* applied shown in plain language.
*/
function QuotesPage() {
	const { data: isAdmin, isLoading: roleLoading } = useIsAdmin();
	const { login, loginStatus } = useInternetIdentity();
	if (roleLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLoadingState, {
		"data-ocid": "quotes.loading_state",
		label: "Checking access"
	}) });
	if (!isAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminCard, {
		className: "mx-auto max-w-md text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mx-auto flex size-14 items-center justify-center rounded-full bg-[oklch(var(--admin-surface-alt))] text-[oklch(var(--admin-primary))]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, {
					className: "size-6",
					"aria-hidden": "true"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-5 text-2xl font-bold text-[oklch(var(--admin-foreground))]",
				children: "Admin access required"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-base text-[oklch(var(--admin-muted-foreground))]",
				children: "Sign in with an administrator identity to build quotes."
			}),
			loginStatus !== "success" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminButton, {
				"data-ocid": "quotes.login_button",
				className: "mt-6",
				onClick: () => login(),
				children: "Sign in"
			})
		]
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuotesBody, {});
}
var QUOTE_FILTERS = [{
	key: "all",
	label: "All requests"
}, {
	key: "pending",
	label: "Pending quotes"
}];
/**
* The filter the dashboard's count link asked for, if any.
*
* Read straight from `window.location.search` so the link works on the plain
* `/admin/quotes` route without a `validateSearch` contract.
*/
function initialQuoteFilter() {
	if (typeof window === "undefined") return "all";
	return new URLSearchParams(window.location.search).get("status") === "pending" ? "pending" : "all";
}
/** Whether the dashboard's "+ New Quote" quick action opened this page. */
function openedForNewQuote() {
	if (typeof window === "undefined") return false;
	return new URLSearchParams(window.location.search).get("new") === "1";
}
/** Whether a request belongs in the currently selected quote filter. */
function matchesQuoteFilter(job, filter) {
	if (filter === "all") return true;
	const status = job.quote?.status;
	return status !== "approved" && status !== "declined";
}
function QuotesBody() {
	const requestsQuery = useJobRequests();
	const customersQuery = useCustomers(true);
	const discountsQuery = useDiscounts();
	const settingsQuery = useSettings();
	const [selectedId, setSelectedId] = (0, import_react.useState)(null);
	const [statusFilter, setStatusFilter] = (0, import_react.useState)(initialQuoteFilter);
	const requests = requestsQuery.data ?? [];
	const visibleRequests = (0, import_react.useMemo)(() => requests.filter((job) => matchesQuoteFilter(job, statusFilter)), [requests, statusFilter]);
	const openedForNew = (0, import_react.useMemo)(() => openedForNewQuote(), []);
	(0, import_react.useEffect)(() => {
		if (!openedForNew || selectedId !== null) return;
		const first = visibleRequests[0];
		if (first) setSelectedId(first.id);
	}, [
		openedForNew,
		selectedId,
		visibleRequests
	]);
	const selected = (0, import_react.useMemo)(() => requests.find((job) => job.id === selectedId) ?? null, [requests, selectedId]);
	const serviceAddress = (0, import_react.useMemo)(() => {
		if (!selected) return "";
		const email = selected.email.trim().toLowerCase();
		return (customersQuery.data ?? []).find((customer) => customer.email.trim().toLowerCase() === email)?.serviceAddress ?? "";
	}, [selected, customersQuery.data]);
	const rules = discountsQuery.data ?? [];
	const tax = settingsQuery.data?.tax;
	const terms = settingsQuery.data?.quote.terms ?? "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
		eyebrow: "Admin",
		title: "Quotes",
		description: "Build, send and track customer quotes. Every amount — discount, tax, deposit and remaining balance — is calculated automatically as you type."
	}), requestsQuery.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminCard, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLoadingState, {
		"data-ocid": "quotes.requests_loading_state",
		label: "Loading requests"
	}) }) : requestsQuery.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminErrorState, {
		"data-ocid": "quotes.error_state",
		message: "We could not load the service requests.",
		onRetry: () => void requestsQuery.refetch()
	}) : requests.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminEmptyState, {
		"data-ocid": "quotes.empty_state",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, {
			className: "size-6",
			"aria-hidden": "true"
		}),
		title: "No requests to quote yet",
		description: "New service requests appear here so you can build their quote."
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-ocid": "quotes.filter.tabs",
		className: "mb-6 flex flex-wrap gap-2",
		children: QUOTE_FILTERS.map((option) => {
			const active = statusFilter === option.key;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"data-ocid": `quotes.filter.${option.key}`,
				"aria-pressed": active,
				onClick: () => setStatusFilter(option.key),
				className: cn("inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-base font-semibold transition-smooth", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(var(--admin-ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[oklch(var(--admin-bg))]", active ? "border-transparent bg-[oklch(var(--admin-primary))] text-[oklch(var(--admin-primary-foreground))]" : "border-[oklch(var(--admin-border-strong))] bg-[oklch(var(--admin-surface))] text-[oklch(var(--admin-foreground))] hover:bg-[oklch(var(--admin-surface-alt))]"),
				children: option.label
			}, option.key);
		})
	}), visibleRequests.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminEmptyState, {
		"data-ocid": "quotes.filter_empty_state",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, {
			className: "size-6",
			"aria-hidden": "true"
		}),
		title: "No requests with this status",
		description: "Try a different filter to see other requests."
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequestPicker, {
			requests: visibleRequests,
			selectedId,
			onSelect: setSelectedId
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "min-w-0",
			children: selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuoteWorkspace, {
				job: selected,
				serviceAddress,
				rules,
				taxEnabled: tax?.enabled ?? false,
				taxRatePercent: tax?.ratePercent ?? 0n,
				terms
			}, selected.id.toString()) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminEmptyState, {
				"data-ocid": "quotes.select_prompt",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, {
					className: "size-6",
					"aria-hidden": "true"
				}),
				title: "Choose a request",
				description: "Select a service request on the left to build its quote."
			})
		})]
	})] })] });
}
function RequestPicker({ requests, selectedId, onSelect }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminCard, {
		"data-ocid": "quotes.request_list",
		className: "h-fit p-4 sm:p-4",
		alt: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mb-3 text-base font-bold text-[oklch(var(--admin-foreground))]",
			children: "Service requests"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "flex max-h-[32rem] flex-col gap-2 overflow-y-auto pr-1",
			children: requests.map((job, index) => {
				const active = job.id === selectedId;
				const quote = job.quote;
				const meta = quote ? getQuoteStatusMeta(quote.status) : null;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					"data-ocid": `quotes.request_item.${index + 1}`,
					onClick: () => onSelect(job.id),
					"aria-pressed": active,
					className: cn("w-full rounded-xl border p-3 text-left transition-smooth", active ? "border-[oklch(var(--admin-primary))] bg-[oklch(var(--admin-primary))]/10" : "border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface))] hover:border-[oklch(var(--admin-border-strong))]"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "min-w-0 truncate font-semibold text-[oklch(var(--admin-foreground))]",
								children: job.customerName
							}), meta ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminStatusBadge, {
								tone: quoteStatusTone(quote?.status),
								label: meta.label
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminChip, { children: "No quote" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 line-clamp-2 text-sm text-[oklch(var(--admin-muted-foreground))]",
							children: job.description
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-mono text-xs uppercase tracking-wider text-[oklch(var(--admin-muted-foreground))]",
							children: job.referenceCode
						})
					]
				}) }, job.id.toString());
			})
		})]
	});
}
/** Map a quote approval status onto an obvious admin status tone. */
function quoteStatusTone(status) {
	switch (status) {
		case "approved": return "approved";
		case "declined": return "cancelled";
		case "sent": return "waiting";
		default: return "new";
	}
}
function QuoteWorkspace({ job, serviceAddress, rules, taxEnabled, taxRatePercent, terms }) {
	const existing = job.quote ?? null;
	const [draft, setDraft] = (0, import_react.useState)(() => existing ? draftFromQuote(existing, terms) : emptyDraft(terms));
	const [feedback, setFeedback] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [emailFailed, setEmailFailed] = (0, import_react.useState)(false);
	const setQuote = useSetQuote();
	const editQuote = useEditQuote();
	const sendQuote = useSendQuote();
	const approveQuote = useApproveQuote();
	const declineQuote = useDeclineQuote();
	const convertQuote = useConvertQuoteToJob();
	const scheduleAppointment = useScheduleAppointment();
	const pricing = (0, import_react.useMemo)(() => computeLivePricing(draft, rules, taxEnabled, taxRatePercent, {
		ownParts: job.ownParts,
		returningCustomer: false
	}, BigInt(Date.now()) * 1000000n), [
		draft,
		rules,
		taxEnabled,
		taxRatePercent,
		job.ownParts
	]);
	const statusMeta = existing ? getQuoteStatusMeta(existing.status) : null;
	const busy = setQuote.isPending || editQuote.isPending || sendQuote.isPending || approveQuote.isPending || declineQuote.isPending || convertQuote.isPending || scheduleAppointment.isPending;
	const set = (key, value) => {
		setDraft((current) => ({
			...current,
			[key]: value
		}));
	};
	const setLineItem = (key, patch) => {
		setDraft((current) => ({
			...current,
			lineItems: current.lineItems.map((item) => item.key === key ? {
				...item,
				...patch
			} : item)
		}));
	};
	const addLineItem = () => {
		setDraft((current) => ({
			...current,
			lineItems: [...current.lineItems, newLineItem()]
		}));
	};
	const removeLineItem = (key) => {
		setDraft((current) => ({
			...current,
			lineItems: current.lineItems.length > 1 ? current.lineItems.filter((item) => item.key !== key) : current.lineItems
		}));
	};
	const handleResult = (result, successMessage) => {
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
	const handleSave = () => {
		setFeedback(null);
		setError(null);
		const input = draftToInput(draft);
		if (input.workDescription.length === 0) {
			setError("Add a description of the requested work before saving.");
			return;
		}
		if (existing) editQuote.mutate({
			id: job.id,
			input
		}, { onSuccess: (result) => handleResult(result, "Quote updated.") });
		else setQuote.mutate({
			id: job.id,
			amount: pricing.finalTotal,
			note: input.note
		}, { onSuccess: (result) => {
			if (result.__kind__ === "ok") editQuote.mutate({
				id: job.id,
				input
			}, { onSuccess: (editResult) => handleResult(editResult, "Quote saved.") });
			else handleResult(result, "Quote saved.");
		} });
	};
	const handleSend = () => {
		setFeedback(null);
		setError(null);
		setEmailFailed(false);
		sendQuote.mutate(job.id, { onSuccess: (result) => {
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
		} });
	};
	const handleApprove = () => {
		setFeedback(null);
		setError(null);
		approveQuote.mutate(job.id, { onSuccess: (result) => handleResult(result, "Quote marked approved.") });
	};
	const handleDecline = () => {
		setFeedback(null);
		setError(null);
		declineQuote.mutate(job.id, { onSuccess: (result) => handleResult(result, "Quote marked declined.") });
	};
	const handleConvert = () => {
		setFeedback(null);
		setError(null);
		const scheduledAt = BigInt(Date.now()) * 1000000n;
		convertQuote.mutate({
			id: job.id,
			scheduledAt
		}, { onSuccess: (result) => {
			if (result.__kind__ === "ok") scheduleAppointment.mutate({
				id: job.id,
				scheduledAt
			}, { onSuccess: () => handleResult(result, "Quote converted into a scheduled job.") });
			else handleResult(result, "Quote converted into a scheduled job.");
		} });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuoteHeader, {
				job,
				serviceAddress,
				quote: existing,
				statusMeta
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminCard, {
				"data-ocid": "quotes.builder_panel",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminCardHeader, {
						title: existing ? "Edit quote" : "Build quote",
						description: "Itemize the work, then save, send and track the customer's decision.",
						action: statusMeta ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminStatusBadge, {
							"data-ocid": "quotes.status_chip",
							tone: quoteStatusTone(existing?.status),
							label: statusMeta.label,
							dot: true
						}) : void 0
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
								label: "Description of requested work",
								htmlFor: "quote-work",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminTextarea, {
									id: "quote-work",
									"data-ocid": "quotes.work_description_input",
									value: draft.workDescription,
									onChange: (event) => set("workDescription", event.target.value),
									placeholder: "What will Honey Do's take care of?"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-3 flex items-center justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-semibold text-[oklch(var(--admin-foreground))]",
									children: "Service line items"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminButton, {
									size: "sm",
									variant: "secondary",
									"data-ocid": "quotes.add_line_button",
									onClick: addLineItem,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
										className: "size-4",
										"aria-hidden": "true"
									}), "Add line"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "flex flex-col gap-3",
								children: draft.lineItems.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
									"data-ocid": `quotes.line_item.${index + 1}`,
									className: "rounded-xl border border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface-alt))] p-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-3 sm:grid-cols-[minmax(0,1fr)_5rem_7rem_auto] sm:items-end",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
												label: "Description",
												htmlFor: `quote-line-desc-${item.key}`,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminInput, {
													id: `quote-line-desc-${item.key}`,
													"data-ocid": `quotes.line_description_input.${index + 1}`,
													value: item.description,
													onChange: (event) => setLineItem(item.key, { description: event.target.value }),
													placeholder: "e.g. Replace kitchen faucet"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
												label: "Qty",
												htmlFor: `quote-line-qty-${item.key}`,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminInput, {
													id: `quote-line-qty-${item.key}`,
													"data-ocid": `quotes.line_quantity_input.${index + 1}`,
													type: "number",
													min: 1,
													inputMode: "numeric",
													value: item.quantity,
													onChange: (event) => setLineItem(item.key, { quantity: event.target.value })
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
												label: "Unit price",
												htmlFor: `quote-line-price-${item.key}`,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminInput, {
													id: `quote-line-price-${item.key}`,
													"data-ocid": `quotes.line_unit_price_input.${index + 1}`,
													type: "number",
													min: 0,
													step: "0.01",
													inputMode: "decimal",
													value: item.unitPrice,
													onChange: (event) => setLineItem(item.key, { unitPrice: event.target.value }),
													placeholder: "0.00"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between gap-2 sm:flex-col sm:items-end",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono text-sm font-bold text-[oklch(var(--admin-foreground))]",
													children: formatMoney(BigInt(Math.max(1, Math.round(Number(item.quantity) || 1))) * dollarsToCents(item.unitPrice))
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													"data-ocid": `quotes.remove_line_button.${index + 1}`,
													onClick: () => removeLineItem(item.key),
													disabled: draft.lineItems.length <= 1,
													"aria-label": `Remove line item ${index + 1}`,
													className: "inline-flex size-11 items-center justify-center rounded-lg border border-[oklch(var(--admin-status-action))] text-[oklch(var(--admin-status-action))] transition-smooth hover:bg-[oklch(var(--admin-status-action))]/10 disabled:pointer-events-none disabled:opacity-40",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
														className: "size-4",
														"aria-hidden": "true"
													})
												})]
											})
										]
									})
								}, item.key))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-4 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
										label: "Labor charge",
										htmlFor: "quote-labor",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminInput, {
											id: "quote-labor",
											"data-ocid": "quotes.labor_input",
											type: "number",
											min: 0,
											step: "0.01",
											inputMode: "decimal",
											value: draft.laborCharge,
											onChange: (event) => set("laborCharge", event.target.value),
											placeholder: "0.00"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
										label: "Materials & additional charges",
										htmlFor: "quote-materials",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminInput, {
											id: "quote-materials",
											"data-ocid": "quotes.materials_input",
											type: "number",
											min: 0,
											step: "0.01",
											inputMode: "decimal",
											value: draft.materialsCharge,
											onChange: (event) => set("materialsCharge", event.target.value),
											placeholder: "0.00"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
										label: "Deposit required",
										htmlFor: "quote-deposit",
										hint: "The amount due up front to secure the booking.",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminInput, {
											id: "quote-deposit",
											"data-ocid": "quotes.deposit_input",
											type: "number",
											min: 0,
											step: "0.01",
											inputMode: "decimal",
											value: draft.depositRequired,
											onChange: (event) => set("depositRequired", event.target.value),
											placeholder: "0.00"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
										label: "Expiration date",
										htmlFor: "quote-expires",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminInput, {
											id: "quote-expires",
											"data-ocid": "quotes.expires_input",
											type: "date",
											value: draft.expiresAt,
											onChange: (event) => set("expiresAt", event.target.value)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
										label: "Service category",
										htmlFor: "quote-category",
										hint: "From the customer's request.",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminInput, {
											id: "quote-category",
											"data-ocid": "quotes.category_input",
											value: getService(job.category).label,
											readOnly: true
										})
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
								label: "Note to the customer",
								htmlFor: "quote-note",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminTextarea, {
									id: "quote-note",
									"data-ocid": "quotes.note_input",
									value: draft.note,
									onChange: (event) => set("note", event.target.value),
									placeholder: "Anything the customer should know about this quote."
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
								label: "Terms",
								htmlFor: "quote-terms",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminTextarea, {
									id: "quote-terms",
									"data-ocid": "quotes.terms_input",
									value: draft.terms,
									onChange: (event) => set("terms", event.target.value),
									placeholder: "Payment terms and conditions shown with the quote."
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PricingBreakdown, { pricing })
						]
					}),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						"data-ocid": "quotes.error_state",
						role: "alert",
						className: "mt-4 text-base font-medium text-[oklch(var(--admin-status-action))]",
						children: error
					}),
					feedback && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("output", {
						"data-ocid": emailFailed ? "quotes.email_error_state" : "quotes.success_state",
						className: cn("mt-4 block text-base font-medium", emailFailed ? "text-[oklch(var(--admin-status-action))]" : "text-[oklch(var(--admin-status-paid))]"),
						children: feedback
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 flex flex-wrap gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminButton, {
								"data-ocid": "quotes.save_button",
								disabled: busy,
								onClick: handleSave,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
									className: "size-4",
									"aria-hidden": "true"
								}), existing ? "Save changes" : "Save quote"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminButton, {
								variant: "secondary",
								"data-ocid": "quotes.send_button",
								disabled: busy || !existing,
								onClick: handleSend,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, {
									className: "size-4",
									"aria-hidden": "true"
								}), "Send quote"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminButton, {
								variant: "secondary",
								"data-ocid": "quotes.approve_button",
								disabled: busy || !existing,
								onClick: handleApprove,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, {
									className: "size-4",
									"aria-hidden": "true"
								}), "Approve"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminButton, {
								variant: "danger",
								"data-ocid": "quotes.decline_button",
								disabled: busy || !existing,
								onClick: handleDecline,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThumbsDown, {
									className: "size-4",
									"aria-hidden": "true"
								}), "Decline"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminButton, {
								variant: "secondary",
								"data-ocid": "quotes.convert_button",
								disabled: busy || !existing,
								onClick: handleConvert,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarClock, {
									className: "size-4",
									"aria-hidden": "true"
								}), "Convert to job"]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomerQuotePreview, {
				job,
				serviceAddress,
				draft,
				pricing
			})
		]
	});
}
function QuoteHeader({ job, serviceAddress, quote, statusMeta }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminCard, {
		"data-ocid": "quotes.header",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-start justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "admin-label",
						children: "Honey Do's"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-1 text-2xl font-bold text-[oklch(var(--admin-foreground))]",
						children: "Quote"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-mono text-sm uppercase tracking-wider text-[oklch(var(--admin-muted-foreground))]",
						children: quote?.quoteNumber ? `No. ${quote.quoteNumber}` : `Ref ${job.referenceCode}`
					})
				]
			}), statusMeta && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminStatusBadge, {
				"data-ocid": "quotes.header_status_chip",
				tone: quoteStatusTone(quote?.status),
				label: statusMeta.label,
				dot: true
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
			className: "mt-5 grid gap-4 border-t border-[oklch(var(--admin-border))] pt-5 sm:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "admin-label",
						children: "Customer"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "mt-1 truncate text-base font-semibold text-[oklch(var(--admin-foreground))]",
						children: job.customerName
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "admin-label",
						children: "Contact"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
						className: "mt-1 break-words text-base text-[oklch(var(--admin-foreground))]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block truncate",
							children: job.email
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block",
							children: job.phone
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 sm:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "admin-label",
						children: "Service address"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "mt-1 break-words text-base text-[oklch(var(--admin-foreground))]",
						children: serviceAddress || "Address on file with the customer record"
					})]
				})
			]
		})]
	});
}
function PricingBreakdown({ pricing }) {
	const rows = [{
		key: "originalSubtotal",
		label: "Subtotal",
		value: formatMoney(pricing.originalSubtotal)
	}];
	if (pricing.discountAmount > 0n) rows.push({
		key: "discount",
		label: "Discount",
		value: `−${formatMoney(pricing.discountAmount)}`
	});
	rows.push({
		key: "adjustedSubtotal",
		label: "Adjusted subtotal",
		value: formatMoney(pricing.adjustedSubtotal)
	});
	if (pricing.taxAmount > 0n) rows.push({
		key: "tax",
		label: "Tax",
		value: formatMoney(pricing.taxAmount)
	});
	rows.push({
		key: "finalTotal",
		label: "Total",
		value: formatMoney(pricing.finalTotal),
		emphasis: true
	});
	rows.push({
		key: "deposit",
		label: "Deposit required",
		value: formatMoney(pricing.depositAmount)
	});
	rows.push({
		key: "remainingBalance",
		label: "Remaining balance",
		value: formatMoney(pricing.remainingBalance),
		emphasis: true
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		"data-ocid": "quotes.totals",
		className: "rounded-xl border border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface-alt))] p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "admin-label mb-3",
				children: "Automatic pricing"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
				className: "flex flex-col gap-2",
				children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-base text-[oklch(var(--admin-muted-foreground))]",
						children: row.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: cn("font-mono font-semibold text-[oklch(var(--admin-foreground))]", row.emphasis && "text-lg"),
						children: row.value
					})]
				}, row.key))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				"data-ocid": "quotes.discount_reason",
				className: cn("mt-4 rounded-lg border p-3 text-sm", pricing.discount.applied ? "border-[oklch(var(--admin-status-paid))] bg-[oklch(var(--admin-status-paid))]/10 text-[oklch(var(--admin-foreground))]" : "border-[oklch(var(--admin-border-strong))] bg-[oklch(var(--admin-surface))] text-[oklch(var(--admin-muted-foreground))]"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-semibold text-[oklch(var(--admin-foreground))]",
					children: pricing.discount.applied ? "Discount applied" : "No discount"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-0.5 block",
					children: pricing.discount.reason
				})]
			})
		]
	});
}
/**
* The quote exactly as the customer reads it.
*
* Rendered live from the in-progress draft and the same pricing engine the
* admin sees, so the owner can confirm the itemized table, the branding, the
* customer details and every total before sending. It is a preview only — it
* never calls the backend.
*/
function CustomerQuotePreview({ job, serviceAddress, draft, pricing }) {
	const lineItems = draft.lineItems.filter((item) => item.description.trim().length > 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminCard, {
		"data-ocid": "quotes.customer_preview",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminCardHeader, {
			title: "How the customer reads this quote",
			description: "A live preview of the itemized quote the customer receives."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface))] p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-start justify-between gap-3 border-b border-[oklch(var(--admin-border))] pb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "admin-label",
							children: "Honey Do's"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-lg font-bold text-[oklch(var(--admin-foreground))]",
							children: "Quote"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 text-right",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-base font-semibold text-[oklch(var(--admin-foreground))]",
								children: job.customerName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "break-words text-sm text-[oklch(var(--admin-muted-foreground))]",
								children: job.email
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-[oklch(var(--admin-muted-foreground))]",
								children: job.phone
							})
						]
					})]
				}),
				serviceAddress && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4 text-sm text-[oklch(var(--admin-muted-foreground))]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-semibold text-[oklch(var(--admin-foreground))]",
						children: ["Service address:", " "]
					}), serviceAddress]
				}),
				draft.workDescription.trim().length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-base text-[oklch(var(--admin-foreground))]",
					children: draft.workDescription
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "admin-table mt-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Item" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-right",
							children: "Qty"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-right",
							children: "Unit price"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-right",
							children: "Amount"
						})
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: lineItems.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 4,
						className: "text-[oklch(var(--admin-muted-foreground))]",
						children: "Add a line item to see it here."
					}) }) : lineItems.map((item) => {
						const quantity = BigInt(Math.max(1, Math.round(Number(item.quantity) || 1)));
						const unitPrice = dollarsToCents(item.unitPrice);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "break-words",
								children: item.description
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "text-right font-mono",
								children: quantity.toString()
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "text-right font-mono",
								children: formatMoney(unitPrice)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "text-right font-mono font-semibold",
								children: formatMoney(quantity * unitPrice)
							})
						] }, item.key);
					}) })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-5 flex flex-col gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-base text-[oklch(var(--admin-muted-foreground))]",
								children: "Subtotal"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "font-mono font-semibold text-[oklch(var(--admin-foreground))]",
								children: formatMoney(pricing.originalSubtotal)
							})]
						}),
						pricing.discountAmount > 0n && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-base text-[oklch(var(--admin-muted-foreground))]",
								children: "Discount"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
								className: "font-mono font-semibold text-[oklch(var(--admin-foreground))]",
								children: ["−", formatMoney(pricing.discountAmount)]
							})]
						}),
						pricing.taxAmount > 0n && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-base text-[oklch(var(--admin-muted-foreground))]",
								children: "Tax"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "font-mono font-semibold text-[oklch(var(--admin-foreground))]",
								children: formatMoney(pricing.taxAmount)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3 border-t border-[oklch(var(--admin-border))] pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-base font-semibold text-[oklch(var(--admin-foreground))]",
								children: "Total"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "font-mono text-lg font-bold text-[oklch(var(--admin-foreground))]",
								children: formatMoney(pricing.finalTotal)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-base text-[oklch(var(--admin-muted-foreground))]",
								children: "Deposit required"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "font-mono font-semibold text-[oklch(var(--admin-foreground))]",
								children: formatMoney(pricing.depositAmount)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-base text-[oklch(var(--admin-muted-foreground))]",
								children: "Remaining balance"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "font-mono font-semibold text-[oklch(var(--admin-foreground))]",
								children: formatMoney(pricing.remainingBalance)
							})]
						})
					]
				}),
				draft.note.trim().length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-[oklch(var(--admin-muted-foreground))]",
					children: draft.note
				})
			]
		})]
	});
}
function describeJobError(error) {
	if (error && typeof error === "object" && "__kind__" in error) switch (error.__kind__) {
		case "notAuthorized": return "You are not authorized to change this quote.";
		case "notFound": return "That request could not be found.";
		case "invalidState": return "This quote cannot be changed in its current state.";
		case "paymentError": return "The payment step failed. Please try again.";
		default: return "Something went wrong. Please try again.";
	}
	return "Something went wrong. Please try again.";
}
export { QuotesPage };
