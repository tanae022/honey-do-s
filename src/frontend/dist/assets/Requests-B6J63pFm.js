import { r as __toESM } from "./rolldown-runtime-SbdDWaPq.js";
import { r as useInternetIdentity } from "./dist-DCUbDtYL.js";
import { G as getService, I as quoteRemainingBalance, K as cn, L as quoteTotal, ct as require_react, h as formatReference, m as formatMoney, p as formatDateTime, st as require_jsx_runtime } from "./createLucideIcon-CK3986Sn.js";
import { C as AdminChip, D as AdminButton, E as AdminCardHeader, O as AdminPageHeader, T as AdminCard, _ as AdminField, b as AdminTextarea, g as AdminEmptyState, k as AdminShell, n as AdminLoadingState, t as AdminErrorState, w as AdminStatusBadge, x as AdminDataTable } from "./admin-DxTl2OJo.js";
import { t as ShieldAlert } from "./shield-alert-CwcHCNy3.js";
import { E as useJobRequests, a as X, d as Inbox, u as LogIn, w as useIsAdmin } from "./index-DhzL9CXu.js";
import { c as useJobRecords } from "./useAdminSettings-CtJqDOX4.js";
import { l as useCustomers, n as useAddCustomerNote } from "./useCustomers-it81kN8P.js";
import { d as getDepositStatusMeta, i as adminStatusForJob, n as ADMIN_STATUS_ORDER, u as getAdminStatusMeta } from "./admin-CtzrkfjB.js";
// src/pages/admin/Requests.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function buildRows(jobs, customers, records, payments) {
	const byEmail = /* @__PURE__ */ new Map();
	for (const customer of customers) {
		const key = customer.email.trim().toLowerCase();
		if (key.length > 0 && !byEmail.has(key)) byEmail.set(key, customer);
	}
	const recordByJob = /* @__PURE__ */ new Map();
	for (const record of records) {
		const key = record.jobRequestId.toString();
		if (!recordByJob.has(key)) recordByJob.set(key, record);
	}
	const paymentByJob = /* @__PURE__ */ new Map();
	for (const payment of payments) {
		const key = payment.jobRequestId.toString();
		if (!paymentByJob.has(key)) paymentByJob.set(key, payment);
	}
	return jobs.map((job) => ({
		job,
		customer: byEmail.get(job.email.trim().toLowerCase()) ?? null,
		jobRecord: recordByJob.get(job.id.toString()) ?? null,
		payment: paymentByJob.get(job.id.toString()) ?? null
	}));
}
/**
* Admin Requests page.
*
* A clean, high-contrast table of every incoming service request with its
* customer, service, description, address, requested time, quote, discount,
* deposit, balance, status and notes. The admin can filter by status and open
* any request to see its full detail and linked quote, deposit, appointment
* and job record.
*/
function RequestsPage() {
	const { data: isAdmin, isLoading: roleLoading } = useIsAdmin();
	const { login, loginStatus } = useInternetIdentity();
	if (roleLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLoadingState, {
		"data-ocid": "admin.requests.loading_state",
		label: "Checking access"
	}) });
	if (!isAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminCard, {
		className: "mx-auto max-w-md text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"aria-hidden": "true",
				className: "mx-auto flex size-12 items-center justify-center rounded-full bg-[oklch(var(--admin-surface-alt))] text-[oklch(var(--admin-primary))]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-6" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 text-xl font-bold text-[oklch(var(--admin-foreground))]",
				children: "Admin access required"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-base text-[oklch(var(--admin-muted-foreground))]",
				children: "Sign in with an administrator identity to open the request workspace."
			}),
			loginStatus !== "success" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminButton, {
				"data-ocid": "admin.requests.login_button",
				onClick: () => login(),
				className: "mt-5 w-full sm:w-auto",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "size-4" }), "Sign in"]
			})
		]
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequestWorkspace, {});
}
/**
* The status filter the dashboard's count link asked for, if any.
*
* Read straight from `window.location.search` so the link works on the plain
* `/admin/requests` route without a `validateSearch` contract.
*/
function initialStatusFilter() {
	if (typeof window === "undefined") return "all";
	const value = new URLSearchParams(window.location.search).get("status");
	return value && ADMIN_STATUS_ORDER.includes(value) ? value : "all";
}
function RequestWorkspace() {
	const requestsQuery = useJobRequests();
	const customersQuery = useCustomers(true);
	const recordsQuery = useJobRecords();
	const [statusFilter, setStatusFilter] = (0, import_react.useState)(initialStatusFilter);
	const [openId, setOpenId] = (0, import_react.useState)(null);
	const rows = (0, import_react.useMemo)(() => buildRows(requestsQuery.data ?? [], customersQuery.data ?? [], recordsQuery.data ?? [], []), [
		requestsQuery.data,
		customersQuery.data,
		recordsQuery.data
	]);
	const counts = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const row of rows) {
			const key = adminStatusForJob(row.job.status).key;
			map.set(key, (map.get(key) ?? 0) + 1);
		}
		return map;
	}, [rows]);
	const visibleRows = (0, import_react.useMemo)(() => statusFilter === "all" ? rows : rows.filter((row) => adminStatusForJob(row.job.status).key === statusFilter), [rows, statusFilter]);
	const openRow = (0, import_react.useMemo)(() => rows.find((row) => row.job.id === openId) ?? null, [rows, openId]);
	const isLoading = requestsQuery.isLoading || customersQuery.isLoading || recordsQuery.isLoading;
	const isError = requestsQuery.isError || customersQuery.isError || recordsQuery.isError;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
			eyebrow: "Admin",
			title: "Requests",
			description: "Every incoming service request, newest first. Filter by status or open a request for its full detail."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminCard, {
			className: "mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminCardHeader, {
				title: "Filter by status",
				description: "Tap a status to narrow the list. Counts update live."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				"data-ocid": "admin.requests.filter.tabs",
				className: "flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterTab, {
					label: "All",
					count: rows.length,
					active: statusFilter === "all",
					onClick: () => setStatusFilter("all"),
					ocid: "admin.requests.filter.all"
				}), ADMIN_STATUS_ORDER.map((key) => {
					const meta = getAdminStatusMeta(key);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterTab, {
						label: meta.label,
						count: counts.get(key) ?? 0,
						active: statusFilter === key,
						onClick: () => setStatusFilter(key),
						ocid: `admin.requests.filter.${key}`
					}, key);
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminCardHeader, {
			title: "All requests",
			description: statusFilter === "all" ? `${rows.length} ${rows.length === 1 ? "request" : "requests"}` : `${visibleRows.length} ${visibleRows.length === 1 ? "request" : "requests"} · ${getAdminStatusMeta(statusFilter).label}`
		}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLoadingState, {
			"data-ocid": "admin.requests.loading_state",
			label: "Loading requests"
		}) : isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminErrorState, {
			"data-ocid": "admin.requests.error_state",
			message: "The requests could not be loaded. Please try again.",
			onRetry: () => {
				requestsQuery.refetch();
				customersQuery.refetch();
				recordsQuery.refetch();
			}
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminDataTable, {
			"data-ocid": "admin.requests.table",
			caption: "Service requests",
			columns: [
				{
					key: "customer",
					header: "Customer",
					cell: (row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate font-semibold text-[oklch(var(--admin-foreground))]",
							children: row.job.customerName || "Unnamed customer"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-sm text-[oklch(var(--admin-muted-foreground))]",
							children: row.job.email || row.job.phone || "No contact on file"
						})]
					})
				},
				{
					key: "service",
					header: "Service",
					cell: (row) => getService(row.job.category).label
				},
				{
					key: "description",
					header: "Description",
					hideOnMobile: true,
					className: "max-w-[16rem]",
					cell: (row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "line-clamp-2 text-[oklch(var(--admin-muted-foreground))]",
						children: row.job.description || "—"
					})
				},
				{
					key: "address",
					header: "Address",
					hideOnMobile: true,
					className: "max-w-[14rem]",
					cell: (row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "line-clamp-2",
						children: row.customer?.serviceAddress || "—"
					})
				},
				{
					key: "requested",
					header: "Requested",
					cell: (row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "whitespace-nowrap",
						children: formatDateTime(row.job.createdAt)
					})
				},
				{
					key: "id",
					header: "Request ID",
					hideOnMobile: true,
					cell: (row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-sm",
						children: formatReference(row.job.referenceCode)
					})
				},
				{
					key: "quote",
					header: "Quote",
					align: "right",
					hideOnMobile: true,
					cell: (row) => row.job.quote ? formatMoney(quoteTotal(row.job.quote)) : "—"
				},
				{
					key: "discount",
					header: "Discount",
					align: "right",
					hideOnMobile: true,
					cell: (row) => row.job.quote?.discountApplied && row.job.quote.discountAmount > 0n ? `−${formatMoney(row.job.quote.discountAmount)}` : "—"
				},
				{
					key: "deposit",
					header: "Deposit",
					align: "right",
					hideOnMobile: true,
					cell: (row) => row.job.deposit ? formatMoney(row.job.deposit.amount) : "—"
				},
				{
					key: "balance",
					header: "Balance",
					align: "right",
					cell: (row) => row.job.quote ? formatMoney(quoteRemainingBalance(row.job.quote)) : "—"
				},
				{
					key: "status",
					header: "Status",
					cell: (row) => {
						const meta = adminStatusForJob(row.job.status);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminStatusBadge, {
							tone: meta.tone,
							label: meta.label,
							dot: true
						});
					}
				},
				{
					key: "notes",
					header: "Notes",
					align: "right",
					hideOnMobile: true,
					cell: (row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-sm",
						children: row.customer ? row.customer.jobCount.toString() : "—"
					})
				}
			],
			rows: visibleRows,
			rowKey: (row) => row.job.id.toString(),
			onRowClick: (row) => setOpenId(row.job.id),
			empty: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminEmptyState, {
				"data-ocid": "admin.requests.empty_state",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inbox, { className: "size-6" }),
				title: statusFilter === "all" ? "No requests yet" : "No requests with this status",
				description: statusFilter === "all" ? "New service requests will appear here as they arrive." : "Try a different status filter to see other requests."
			})
		})] }),
		openRow && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequestDetailPanel, {
			row: openRow,
			onClose: () => setOpenId(null)
		})
	] });
}
function FilterTab({ label, count, active, onClick, ocid }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		"data-ocid": ocid,
		onClick,
		"aria-pressed": active,
		className: cn("inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-base font-semibold transition-smooth", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(var(--admin-ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[oklch(var(--admin-bg))]", active ? "border-transparent bg-[oklch(var(--admin-primary))] text-[oklch(var(--admin-primary-foreground))]" : "border-[oklch(var(--admin-border-strong))] bg-[oklch(var(--admin-surface))] text-[oklch(var(--admin-foreground))] hover:bg-[oklch(var(--admin-surface-alt))]"),
		children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("rounded-full px-2 py-0.5 text-sm font-bold", active ? "bg-[oklch(var(--admin-primary-foreground))]/20" : "bg-[oklch(var(--admin-surface-alt))] text-[oklch(var(--admin-muted-foreground))]"),
			children: count
		})]
	});
}
function RequestDetailPanel({ row, onClose }) {
	const { job, customer, jobRecord, payment } = row;
	const statusMeta = adminStatusForJob(job.status);
	const service = getService(job.category);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-ocid": "admin.requests.detail_modal",
		className: "fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:items-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-label": "Close request detail",
			"data-ocid": "admin.requests.detail_close_button",
			onClick: onClose,
			className: "absolute inset-0 cursor-default"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "admin-shell relative z-10 my-4 w-full max-w-3xl rounded-2xl border border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface))] p-5 shadow-admin sm:p-7",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-5 flex items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "admin-label text-[oklch(var(--admin-primary))]",
							children: ["Request ", formatReference(job.referenceCode)]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-1 text-2xl font-bold text-[oklch(var(--admin-foreground))]",
							children: job.customerName || "Unnamed customer"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex flex-wrap items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminStatusBadge, {
								tone: statusMeta.tone,
								label: statusMeta.label,
								dot: true
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminChip, { children: service.label })]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminButton, {
					variant: "ghost",
					size: "sm",
					"data-ocid": "admin.requests.detail_dismiss_button",
					"aria-label": "Close",
					onClick: onClose,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DetailSection, {
						title: "Customer information",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
								label: "Name",
								value: job.customerName || "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
								label: "Email",
								value: job.email || "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
								label: "Phone",
								value: job.phone || "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
								label: "Service address",
								value: customer?.serviceAddress || "Not linked to a customer"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DetailSection, {
						title: "Request",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
								label: "Service",
								value: service.label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
								label: "Description",
								value: job.description || "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
								label: "Requested date & time",
								value: formatDateTime(job.createdAt)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
								label: "Preferred timing",
								value: job.preferredTiming || "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
								label: "Customer supplies parts",
								value: job.ownParts ? "Yes" : "No"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailSection, {
						title: "Quote",
						children: job.quote ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
								label: "Quote number",
								value: job.quote.quoteNumber || "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
								label: "Total",
								value: formatMoney(quoteTotal(job.quote))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
								label: "Discount",
								value: job.quote.discountApplied && job.quote.discountAmount > 0n ? `−${formatMoney(job.quote.discountAmount)}` : "None"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
								label: "Deposit required",
								value: formatMoney(job.quote.depositRequired)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
								label: "Remaining balance",
								value: formatMoney(quoteRemainingBalance(job.quote))
							})
						] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-base text-[oklch(var(--admin-muted-foreground))]",
							children: "No quote has been prepared for this request yet."
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailSection, {
						title: "Deposit",
						children: job.deposit ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
								label: "Amount",
								value: formatMoney(job.deposit.amount)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
								label: "Status",
								value: getDepositStatusMeta(job.deposit.status).label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
								label: "Paid",
								value: job.deposit.paid ? "Yes" : "No"
							})
						] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-base text-[oklch(var(--admin-muted-foreground))]",
							children: "No deposit has been recorded for this request."
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailSection, {
						title: "Appointment",
						children: job.appointment ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
							label: "Scheduled",
							value: formatDateTime(job.appointment.scheduledAt)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
							label: "Confirmed",
							value: job.appointment.confirmed ? "Yes" : "Awaiting customer"
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-base text-[oklch(var(--admin-muted-foreground))]",
							children: "No appointment has been scheduled yet."
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailSection, {
						title: "Job record",
						children: jobRecord ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
								label: "Job reference",
								value: formatReference(jobRecord.referenceCode)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
								label: "Scheduled",
								value: formatDateTime(jobRecord.scheduledAt)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
								label: "Remaining balance",
								value: formatMoney(jobRecord.remainingBalance)
							})
						] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-base text-[oklch(var(--admin-muted-foreground))]",
							children: "This request has not been converted into a job record yet."
						})
					}),
					payment && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DetailSection, {
						title: "Payment history",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
							label: "Total paid",
							value: formatMoney(payment.totalPaid)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
							label: "Remaining balance",
							value: formatMoney(payment.remainingBalance)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequestNotes, { customer })
				]
			})]
		})]
	});
}
function DetailSection({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl border border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface-alt))] p-4 sm:p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "mb-3 text-base font-bold text-[oklch(var(--admin-foreground))]",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-2",
			children
		})]
	});
}
function DetailRow({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-sm font-semibold text-[oklch(var(--admin-muted-foreground))]",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "min-w-0 break-words text-base font-medium text-[oklch(var(--admin-foreground))] sm:text-right",
			children: value
		})]
	});
}
function RequestNotes({ customer }) {
	const addNote = useAddCustomerNote();
	const [draft, setDraft] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	if (!customer) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailSection, {
		title: "Notes",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-base text-[oklch(var(--admin-muted-foreground))]",
			children: "Notes are stored on the customer record. This request is not yet linked to a customer, so notes cannot be added here."
		})
	});
	const handleSubmit = (event) => {
		event.preventDefault();
		const body = draft.trim();
		if (body.length === 0) {
			setError("Write a note before saving.");
			return;
		}
		setError(null);
		setDraft("");
		addNote.mutate({
			id: customer.id,
			body
		}, {
			onSuccess: (result) => {
				if (result.__kind__ === "err") setError("The note could not be saved. Please try again.");
			},
			onError: () => {
				setDraft((current) => current === "" ? body : current);
				setError("The note could not be saved. Please try again.");
			}
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DetailSection, {
		title: "Notes",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleSubmit,
			className: "flex flex-col gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
				label: "Add a note",
				htmlFor: "request-note",
				error,
				hint: "Notes are saved to this customer's record.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminTextarea, {
					id: "request-note",
					"data-ocid": "admin.requests.note_input",
					value: draft,
					onChange: (event) => {
						setDraft(event.target.value);
						setError(null);
					},
					placeholder: "Called the customer to confirm the details…"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-end",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminButton, {
					type: "submit",
					"data-ocid": "admin.requests.note_submit_button",
					disabled: addNote.isPending || draft.trim().length === 0,
					children: addNote.isPending ? "Saving…" : "Save note"
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-[oklch(var(--admin-muted-foreground))]",
			children: "Open the customer profile to review the full note history."
		})]
	});
}
export { RequestsPage };
