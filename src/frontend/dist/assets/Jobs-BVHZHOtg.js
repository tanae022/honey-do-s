import { r as __toESM } from "./rolldown-runtime-SbdDWaPq.js";
import { r as useInternetIdentity } from "./dist-DCUbDtYL.js";
import { G as getService, K as cn, L as quoteTotal, Q as JobRecordStatus, V as timestampToDate, ct as require_react, f as formatDate, h as formatReference, m as formatMoney, st as require_jsx_runtime, t as createLucideIcon } from "./createLucideIcon-CK3986Sn.js";
import { t as BadgeCheck } from "./badge-check-CxAhc_Pv.js";
import { t as CalendarPlus } from "./calendar-plus-P14BfjVE.js";
import { D as AdminButton, E as AdminCardHeader, O as AdminPageHeader, S as AdminStatCard, T as AdminCard, _ as AdminField, a as Content, c as Portal, g as AdminEmptyState, i as Close, k as AdminShell, l as Root, n as AdminLoadingState, o as Description, s as Overlay, t as AdminErrorState, u as Title, v as AdminInput, w as AdminStatusBadge, x as AdminDataTable, y as AdminSelect } from "./admin-DxTl2OJo.js";
import { t as ShieldAlert } from "./shield-alert-CwcHCNy3.js";
import { E as useJobRequests, a as X, f as ClipboardList, o as Wallet, u as LogIn, w as useIsAdmin } from "./index-DhzL9CXu.js";
import { a as useCreateJobRecord, c as useJobRecords, d as useRecordFinalPayment, n as useCancelJobRecord, r as useCompleteJobRecord, t as useAdvanceJobRecord } from "./useAdminSettings-CtJqDOX4.js";
import { l as useCustomers } from "./useCustomers-it81kN8P.js";
import { a as adminStatusForJobRecord, d as getDepositStatusMeta, f as paymentMethodLabel, l as formatPricingAmount, m as pricingRows, p as pricingFromQuotePricing, r as PAYMENT_METHODS } from "./admin-CtzrkfjB.js";
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Ban = createLucideIcon("ban", [["circle", {
	cx: "12",
	cy: "12",
	r: "10",
	key: "1mglay"
}], ["path", {
	d: "m4.9 4.9 14.2 14.2",
	key: "1m5liu"
}]]);
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var CircleCheck = createLucideIcon("circle-check", [["circle", {
	cx: "12",
	cy: "12",
	r: "10",
	key: "1mglay"
}], ["path", {
	d: "m9 12 2 2 4-4",
	key: "dzmm74"
}]]);
// src/components/ui/dialog.tsx
var import_jsx_runtime = require_jsx_runtime();
function Dialog({ ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
		"data-slot": "dialog",
		...props
	});
}
function DialogPortal({ ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, {
		"data-slot": "dialog-portal",
		...props
	});
}
function DialogOverlay({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overlay, {
		"data-slot": "dialog-overlay",
		className: cn("data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50", className),
		...props
	});
}
function DialogContent({ className, children, showCloseButton = true, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, {
		"data-slot": "dialog-portal",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Content, {
			"data-slot": "dialog-content",
			className: cn("bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg", className),
			...props,
			children: [children, showCloseButton && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Close, {
				"data-slot": "dialog-close",
				className: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "sr-only",
					children: "Close"
				})]
			})]
		})]
	});
}
function DialogHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-slot": "dialog-header",
		className: cn("flex flex-col gap-2 text-center sm:text-left", className),
		...props
	});
}
function DialogTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Title, {
		"data-slot": "dialog-title",
		className: cn("text-lg leading-none font-semibold", className),
		...props
	});
}
function DialogDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Description, {
		"data-slot": "dialog-description",
		className: cn("text-muted-foreground text-sm", className),
		...props
	});
}
// src/pages/admin/Jobs.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
/** A `YYYY-MM-DD` + `HH:MM` pair → a nanosecond timestamp, or null. */
function dateTimeToTimestamp(dateValue, timeValue) {
	if (!dateValue) return null;
	const date = /* @__PURE__ */ new Date(`${dateValue}T${timeValue || "09:00"}:00`);
	if (Number.isNaN(date.getTime())) return null;
	return BigInt(date.getTime()) * 1000000n;
}
/** Short clock label for a scheduled timestamp, e.g. "9:30 AM". */
function timeLabel(timestamp) {
	const date = timestampToDate(timestamp);
	if (!date) return "—";
	return date.toLocaleTimeString(void 0, {
		hour: "numeric",
		minute: "2-digit"
	});
}
/** Human copy for a backend `JobError`. */
function describeJobError(error) {
	if (error && typeof error === "object" && "__kind__" in error) switch (error.__kind__) {
		case "notAuthorized": return "You are not authorized to change this job.";
		case "notFound": return "That job could not be found.";
		case "invalidState": return "This job cannot be changed in its current state.";
		case "paymentError": return "The payment step failed. Please try again.";
		default: return "Something went wrong. Please try again.";
	}
	return "Something went wrong. Please try again.";
}
var JOB_FILTERS = [
	{
		key: "all",
		label: "All"
	},
	{
		key: "active",
		label: "Active"
	},
	{
		key: "completed",
		label: "Completed"
	},
	{
		key: "cancelled",
		label: "Cancelled"
	}
];
/**
* The status filter the dashboard's count link asked for, if any.
*
* Read straight from `window.location.search` so the link works on the plain
* `/admin/jobs` route without a `validateSearch` contract.
*/
function initialJobFilter() {
	if (typeof window === "undefined") return "all";
	const value = new URLSearchParams(window.location.search).get("status");
	return value === "active" || value === "completed" || value === "cancelled" ? value : "all";
}
/** Whether a job record belongs in the currently selected filter. */
function matchesJobFilter(record, filter) {
	if (filter === "all") return true;
	if (filter === "active") return record.status !== JobRecordStatus.completed && record.status !== JobRecordStatus.cancelled;
	if (filter === "completed") return record.status === JobRecordStatus.completed;
	return record.status === JobRecordStatus.cancelled;
}
/**
* Admin Jobs page.
*
* A clean, light, high-contrast workspace over the job records: create a job
* from a confirmed request or quote, advance it through its statuses to
* completion (or cancel it), and record the final payment so the remaining
* balance settles to zero.
*/
function JobsPage() {
	const { data: isAdmin, isLoading: roleLoading } = useIsAdmin();
	const { login, loginStatus } = useInternetIdentity();
	if (roleLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLoadingState, {
		"data-ocid": "admin.jobs.loading_state",
		label: "Checking access"
	}) });
	if (!isAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminCard, {
		className: "mx-auto max-w-md text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mx-auto flex size-12 items-center justify-center rounded-full bg-[oklch(var(--admin-surface-alt))] text-[oklch(var(--admin-primary))]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-6" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 text-xl font-bold text-[oklch(var(--admin-foreground))]",
				children: "Admin access required"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-base text-[oklch(var(--admin-muted-foreground))]",
				children: "Sign in with an administrator identity to manage jobs."
			}),
			loginStatus !== "success" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminButton, {
				"data-ocid": "admin.jobs.login_button",
				className: "mt-5 w-full sm:w-auto",
				onClick: () => login(),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "size-4" }), "Sign in"]
			})
		]
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JobsBody, {});
}
function JobsBody() {
	const recordsQuery = useJobRecords();
	const requestsQuery = useJobRequests();
	const customersQuery = useCustomers(true);
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [statusFilter, setStatusFilter] = (0, import_react.useState)(initialJobFilter);
	const records = recordsQuery.data ?? [];
	const requests = requestsQuery.data ?? [];
	const visibleRecords = (0, import_react.useMemo)(() => records.filter((record) => matchesJobFilter(record, statusFilter)), [records, statusFilter]);
	/** Address lookup by normalized customer email, since records omit it. */
	const addressByEmail = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const customer of customersQuery.data ?? []) {
			const key = customer.email.trim().toLowerCase();
			if (key.length > 0 && customer.serviceAddress.trim().length > 0) map.set(key, customer.serviceAddress);
		}
		return map;
	}, [customersQuery.data]);
	/** Requests that already have a job record, so they cannot be re-created. */
	const usedRequestIds = (0, import_react.useMemo)(() => new Set(records.map((record) => record.jobRequestId.toString())), [records]);
	/** Confirmed requests/quotes eligible to become a job. */
	const eligibleRequests = (0, import_react.useMemo)(() => requests.filter((request) => request.quote !== void 0 && !usedRequestIds.has(request.id.toString())), [requests, usedRequestIds]);
	const stats = (0, import_react.useMemo)(() => {
		const active = records.filter((record) => record.status !== JobRecordStatus.completed && record.status !== JobRecordStatus.cancelled).length;
		const completed = records.filter((record) => record.status === JobRecordStatus.completed).length;
		const outstanding = records.reduce((sum, record) => record.status === JobRecordStatus.cancelled ? sum : sum + record.remainingBalance, 0n);
		return {
			total: records.length,
			active,
			completed,
			outstanding
		};
	}, [records]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
			eyebrow: "Admin",
			title: "Jobs",
			description: "Create jobs from confirmed requests, move them through to completion and settle the final payment."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminStatCard, {
					"data-ocid": "admin.jobs.stat.total",
					label: "Total jobs",
					value: stats.total.toString(),
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, { className: "size-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminStatCard, {
					"data-ocid": "admin.jobs.stat.active",
					label: "Active",
					value: stats.active.toString(),
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarPlus, { className: "size-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminStatCard, {
					"data-ocid": "admin.jobs.stat.completed",
					label: "Completed",
					value: stats.completed.toString(),
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminStatCard, {
					"data-ocid": "admin.jobs.stat.outstanding",
					label: "Outstanding",
					value: formatMoney(stats.outstanding),
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "size-5" })
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreateJobCard, {
			eligibleRequests,
			addressByEmail
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminCard, {
			className: "mt-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminCardHeader, {
					title: "Job records",
					description: "Tap a job to advance it, cancel it or record the final payment."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					"data-ocid": "admin.jobs.filter.tabs",
					className: "mb-5 flex flex-wrap gap-2",
					children: JOB_FILTERS.map((option) => {
						const active = statusFilter === option.key;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"data-ocid": `admin.jobs.filter.${option.key}`,
							"aria-pressed": active,
							onClick: () => setStatusFilter(option.key),
							className: cn("inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-base font-semibold transition-smooth", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(var(--admin-ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[oklch(var(--admin-bg))]", active ? "border-transparent bg-[oklch(var(--admin-primary))] text-[oklch(var(--admin-primary-foreground))]" : "border-[oklch(var(--admin-border-strong))] bg-[oklch(var(--admin-surface))] text-[oklch(var(--admin-foreground))] hover:bg-[oklch(var(--admin-surface-alt))]"),
							children: option.label
						}, option.key);
					})
				}),
				recordsQuery.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLoadingState, {
					"data-ocid": "admin.jobs.records_loading_state",
					label: "Loading jobs"
				}) : recordsQuery.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminErrorState, {
					"data-ocid": "admin.jobs.error_state",
					message: "We could not load the job records.",
					onRetry: () => void recordsQuery.refetch()
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminDataTable, {
					"data-ocid": "admin.jobs.table",
					caption: "Job records",
					columns: [
						{
							key: "customer",
							header: "Customer",
							cell: (record) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-[oklch(var(--admin-foreground))]",
								children: record.customerName
							})
						},
						{
							key: "service",
							header: "Service",
							cell: (record) => getService(record.category).label
						},
						{
							key: "address",
							header: "Address",
							hideOnMobile: true,
							cell: (record) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block max-w-[14rem] truncate",
								children: record.serviceAddress || "—"
							})
						},
						{
							key: "date",
							header: "Date",
							cell: (record) => formatDate(record.scheduledAt)
						},
						{
							key: "time",
							header: "Time",
							cell: (record) => timeLabel(record.scheduledAt)
						},
						{
							key: "quote",
							header: "Quote",
							align: "right",
							cell: (record) => formatMoney(recordQuoteTotal(record))
						},
						{
							key: "discount",
							header: "Discount",
							align: "right",
							hideOnMobile: true,
							cell: (record) => {
								const amount = record.pricing?.discountAmount ?? 0n;
								return amount > 0n ? `−${formatMoney(amount)}` : "—";
							}
						},
						{
							key: "deposit",
							header: "Deposit",
							align: "right",
							hideOnMobile: true,
							cell: (record) => formatMoney(recordDeposit(record))
						},
						{
							key: "balance",
							header: "Balance",
							align: "right",
							cell: (record) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("font-semibold", record.remainingBalance > 0n ? "text-[oklch(var(--admin-status-action))]" : "text-[oklch(var(--admin-status-paid))]"),
								children: formatMoney(record.remainingBalance)
							})
						},
						{
							key: "status",
							header: "Status",
							cell: (record) => {
								const meta = adminStatusForJobRecord(record.status);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminStatusBadge, {
									tone: meta.tone,
									label: meta.label,
									dot: true,
									"data-ocid": `admin.jobs.status.${record.id.toString()}`
								});
							}
						}
					],
					rows: visibleRecords,
					rowKey: (record) => record.id.toString(),
					onRowClick: (record) => setSelected(record),
					empty: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminEmptyState, {
						"data-ocid": "admin.jobs.empty_state",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, { className: "size-6" }),
						title: statusFilter === "all" ? "No jobs yet" : "No jobs with this status",
						description: statusFilter === "all" ? "Create a job from a confirmed request or quote to get started." : "Try a different status filter to see other jobs."
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(JobDetailDialog, {
			record: selected,
			onClose: () => setSelected(null)
		})
	] });
}
function CreateJobCard({ eligibleRequests, addressByEmail }) {
	const createJob = useCreateJobRecord();
	const [requestId, setRequestId] = (0, import_react.useState)("");
	const [dateValue, setDateValue] = (0, import_react.useState)("");
	const [timeValue, setTimeValue] = (0, import_react.useState)("09:00");
	const [error, setError] = (0, import_react.useState)(null);
	const [feedback, setFeedback] = (0, import_react.useState)(null);
	const selectedRequest = (0, import_react.useMemo)(() => eligibleRequests.find((request) => request.id.toString() === requestId) ?? null, [eligibleRequests, requestId]);
	const handleCreate = () => {
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
		createJob.mutate({
			jobId: selectedRequest.id,
			scheduledAt
		}, {
			onSuccess: (result) => {
				if (result.__kind__ === "ok") {
					setFeedback(`Job created for ${result.ok.customerName}. It is now in the list below.`);
					setRequestId("");
					setDateValue("");
					setTimeValue("09:00");
					return;
				}
				setError(describeJobError(result.err));
			},
			onError: () => setError("Something went wrong. Please try again.")
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminCard, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminCardHeader, {
			title: "Create a job",
			description: "Turn a confirmed request or approved quote into a scheduled job."
		}),
		eligibleRequests.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminEmptyState, {
			"data-ocid": "admin.jobs.create.empty_state",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarPlus, { className: "size-6" }),
			title: "No confirmed requests ready",
			description: "A request appears here once it has a quote and no job record yet."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-end",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
					label: "Confirmed request or quote",
					htmlFor: "job-request",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminSelect, {
						id: "job-request",
						"data-ocid": "admin.jobs.create.request_select",
						value: requestId,
						onChange: (event) => setRequestId(event.target.value),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Choose a request…"
						}), eligibleRequests.map((request) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
							value: request.id.toString(),
							children: [
								request.customerName,
								" · ",
								getService(request.category).label,
								" ",
								"· ",
								formatReference(request.referenceCode)
							]
						}, request.id.toString()))]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
					label: "Job date",
					htmlFor: "job-date",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminInput, {
						id: "job-date",
						"data-ocid": "admin.jobs.create.date_input",
						type: "date",
						value: dateValue,
						onChange: (event) => setDateValue(event.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
					label: "Start time",
					htmlFor: "job-time",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminInput, {
						id: "job-time",
						"data-ocid": "admin.jobs.create.time_input",
						type: "time",
						value: timeValue,
						onChange: (event) => setTimeValue(event.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminButton, {
					"data-ocid": "admin.jobs.create.submit_button",
					disabled: createJob.isPending,
					onClick: handleCreate,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarPlus, { className: "size-4" }), createJob.isPending ? "Creating…" : "Create job"]
				})
			]
		}),
		selectedRequest && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
			className: "mt-4 grid gap-3 rounded-xl border border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface-alt))] p-4 sm:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryItem, {
					label: "Customer",
					value: selectedRequest.customerName
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryItem, {
					label: "Service address",
					value: addressByEmail.get(selectedRequest.email.trim().toLowerCase()) || "Address on file with the customer record"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryItem, {
					label: "Quote total",
					value: formatMoney(quoteTotal(selectedRequest.quote))
				})
			]
		}),
		error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			role: "alert",
			"data-ocid": "admin.jobs.create.error_state",
			className: "mt-4 text-base font-medium text-[oklch(var(--admin-status-action))]",
			children: error
		}),
		feedback && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			"data-ocid": "admin.jobs.create.success_state",
			className: "mt-4 text-base font-medium text-[oklch(var(--admin-status-paid))]",
			children: feedback
		})
	] });
}
function SummaryItem({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "admin-label",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "mt-1 break-words text-base font-semibold text-[oklch(var(--admin-foreground))]",
			children: value
		})]
	});
}
function JobDetailDialog({ record, onClose }) {
	const advance = useAdvanceJobRecord();
	const complete = useCompleteJobRecord();
	const cancel = useCancelJobRecord();
	const recordPayment = useRecordFinalPayment();
	const [amount, setAmount] = (0, import_react.useState)("");
	const [method, setMethod] = (0, import_react.useState)(PAYMENT_METHODS[0]);
	const [error, setError] = (0, import_react.useState)(null);
	const [feedback, setFeedback] = (0, import_react.useState)(null);
	const open = record !== null;
	const statusMeta = record ? adminStatusForJobRecord(record.status) : null;
	const pricing = record ? pricingFromQuotePricing(record.pricing) : null;
	const depositMeta = record?.deposit ? getDepositStatusMeta(record.deposit.status) : null;
	const isTerminal = record?.status === JobRecordStatus.completed || record?.status === JobRecordStatus.cancelled;
	const busy = advance.isPending || complete.isPending || cancel.isPending || recordPayment.isPending;
	const reset = () => {
		setAmount("");
		setMethod(PAYMENT_METHODS[0]);
		setError(null);
		setFeedback(null);
	};
	const handleOpenChange = (next) => {
		if (!next) {
			reset();
			onClose();
		}
	};
	const handleAdvance = () => {
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
			onError: () => setError("Something went wrong. Please try again.")
		});
	};
	const handleComplete = () => {
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
			onError: () => setError("Something went wrong. Please try again.")
		});
	};
	const handleCancel = () => {
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
			onError: () => setError("Something went wrong. Please try again.")
		});
	};
	const handleRecordPayment = () => {
		if (!record) return;
		setError(null);
		setFeedback(null);
		const cents = dollarsToCents(amount);
		if (cents <= 0n) {
			setError("Enter the amount received before recording the payment.");
			return;
		}
		recordPayment.mutate({
			jobId: record.jobRequestId,
			amount: cents,
			method
		}, {
			onSuccess: (result) => {
				if (result.__kind__ === "ok") {
					setFeedback(`Payment recorded. Remaining balance is now ${formatMoney(result.ok.remainingBalance)}.`);
					setAmount("");
					return;
				}
				setError(describeJobError(result.err));
			},
			onError: () => setError("Something went wrong. Please try again.")
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: handleOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
			"data-ocid": "admin.jobs.detail_dialog",
			className: "admin-shell max-h-[90dvh] overflow-y-auto border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface))] text-[oklch(var(--admin-foreground))] sm:max-w-2xl",
			children: record && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "text-xl font-bold text-[oklch(var(--admin-foreground))]",
					children: record.customerName
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
					className: "text-base text-[oklch(var(--admin-muted-foreground))]",
					children: [
						getService(record.category).label,
						" ·",
						" ",
						formatReference(record.referenceCode)
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [statusMeta && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminStatusBadge, {
						tone: statusMeta.tone,
						label: statusMeta.label,
						dot: true,
						"data-ocid": "admin.jobs.detail.status"
					}), depositMeta && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminStatusBadge, {
						tone: depositMeta.tone,
						label: depositMeta.label,
						"data-ocid": "admin.jobs.detail.deposit_status"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "grid gap-3 rounded-xl border border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface-alt))] p-4 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryItem, {
							label: "Service address",
							value: record.serviceAddress || "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryItem, {
							label: "Scheduled",
							value: `${formatDate(record.scheduledAt)} · ${timeLabel(record.scheduledAt)}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryItem, {
							label: "Quote total",
							value: formatMoney(recordQuoteTotal(record))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryItem, {
							label: "Deposit",
							value: formatMoney(recordDeposit(record))
						})
					]
				}),
				pricing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-[oklch(var(--admin-border))] p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "admin-label mb-3",
						children: "Pricing breakdown"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
						className: "flex flex-col gap-2",
						children: pricingRows(pricing).map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: cn("text-base", row.emphasis ? "font-semibold text-[oklch(var(--admin-foreground))]" : "text-[oklch(var(--admin-muted-foreground))]"),
								children: row.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: cn("font-mono font-semibold", row.emphasis ? "text-lg text-[oklch(var(--admin-foreground))]" : "text-base text-[oklch(var(--admin-foreground))]"),
								children: formatPricingAmount(row)
							})]
						}, row.key))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-[oklch(var(--admin-border))] p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "admin-label mb-3",
							children: "Record final payment"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
									label: "Amount received",
									htmlFor: "job-payment-amount",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminInput, {
										id: "job-payment-amount",
										"data-ocid": "admin.jobs.payment.amount_input",
										type: "number",
										min: 0,
										step: "0.01",
										inputMode: "decimal",
										placeholder: (Number(record.remainingBalance) / 100).toFixed(2),
										value: amount,
										onChange: (event) => setAmount(event.target.value)
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
									label: "Payment method",
									htmlFor: "job-payment-method",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminSelect, {
										id: "job-payment-method",
										"data-ocid": "admin.jobs.payment.method_select",
										value: method,
										onChange: (event) => setMethod(event.target.value),
										children: PAYMENT_METHODS.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: option,
											children: paymentMethodLabel(option)
										}, option))
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminButton, {
									"data-ocid": "admin.jobs.payment.submit_button",
									disabled: busy,
									onClick: handleRecordPayment,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "size-4" }), recordPayment.isPending ? "Recording…" : "Record payment"]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 text-sm text-[oklch(var(--admin-muted-foreground))]",
							children: [
								"Remaining balance:",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-[oklch(var(--admin-foreground))]",
									children: formatMoney(record.remainingBalance)
								})
							]
						})
					]
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "alert",
					"data-ocid": "admin.jobs.detail.error_state",
					className: "text-base font-medium text-[oklch(var(--admin-status-action))]",
					children: error
				}),
				feedback && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					"data-ocid": "admin.jobs.detail.success_state",
					className: "text-base font-medium text-[oklch(var(--admin-status-paid))]",
					children: feedback
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-3 border-t border-[oklch(var(--admin-border))] pt-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminButton, {
							"data-ocid": "admin.jobs.detail.advance_button",
							disabled: busy || isTerminal,
							onClick: handleAdvance,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarPlus, { className: "size-4" }), "Advance status"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminButton, {
							variant: "secondary",
							"data-ocid": "admin.jobs.detail.complete_button",
							disabled: busy || isTerminal,
							onClick: handleComplete,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { className: "size-4" }), "Mark completed"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminButton, {
							variant: "danger",
							"data-ocid": "admin.jobs.detail.cancel_button",
							disabled: busy || isTerminal,
							onClick: handleCancel,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ban, { className: "size-4" }), "Cancel job"]
						})
					]
				})
			] })
		})
	});
}
/** The job's quote total, preferring the stored pricing final total. */
function recordQuoteTotal(record) {
	if (record.pricing) return record.pricing.finalTotal;
	return quoteTotal(record.quote);
}
/** The job's deposit amount, preferring the stored pricing deposit. */
function recordDeposit(record) {
	if (record.pricing) return record.pricing.depositAmount;
	return record.deposit?.amount ?? 0n;
}
/** Dollars string → whole cents, tolerating blanks and stray characters. */
function dollarsToCents(value) {
	const parsed = Number.parseFloat(value);
	if (!Number.isFinite(parsed) || parsed < 0) return 0n;
	return BigInt(Math.round(parsed * 100));
}
export { JobsPage };
