import { r as __toESM } from "./rolldown-runtime-SbdDWaPq.js";
import { a as useQuery, t as useActor } from "./dist-DCUbDtYL.js";
import { K as cn, Y as DepositStatus, at as createActor, ct as require_react, h as formatReference, m as formatMoney, st as require_jsx_runtime, t as createLucideIcon, tt as PaymentMethod } from "./createLucideIcon-CK3986Sn.js";
import { t as BadgeCheck } from "./badge-check-CxAhc_Pv.js";
import { C as AdminChip, D as AdminButton, E as AdminCardHeader, O as AdminPageHeader, S as AdminStatCard, T as AdminCard, _ as AdminField, g as AdminEmptyState, k as AdminShell, n as AdminLoadingState, r as AdminConfirmDialog, t as AdminErrorState, v as AdminInput, w as AdminStatusBadge, x as AdminDataTable, y as AdminSelect } from "./admin-DxTl2OJo.js";
import { E as useJobRequests, o as Wallet } from "./index-DhzL9CXu.js";
import { C as useVerifyDeposit, d as useRecordFinalPayment, f as useRejectDeposit, l as usePaymentHistory } from "./useAdminSettings-CtJqDOX4.js";
import { d as getDepositStatusMeta, f as paymentMethodLabel } from "./admin-CtzrkfjB.js";
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Banknote = createLucideIcon("banknote", [
	["rect", {
		width: "20",
		height: "12",
		x: "2",
		y: "6",
		rx: "2",
		key: "9lu3g6"
	}],
	["circle", {
		cx: "12",
		cy: "12",
		r: "2",
		key: "1c9p78"
	}],
	["path", {
		d: "M6 12h.01M18 12h.01",
		key: "113zkx"
	}]
]);
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var CircleDollarSign = createLucideIcon("circle-dollar-sign", [
	["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}],
	["path", {
		d: "M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8",
		key: "1h4pet"
	}],
	["path", {
		d: "M12 18V6",
		key: "zqpxq5"
	}]
]);
// src/pages/Payments.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
/** A job request whose customer says they have paid the deposit. */
function isAwaitingVerification(job) {
	return job.deposit?.status === DepositStatus.submitted;
}
/** The deposit amount for a job, falling back to the quote's required deposit. */
function jobDepositAmount(job) {
	if (job.deposit && job.deposit.amount > 0n) return job.deposit.amount;
	return job.quote?.depositRequired ?? 0n;
}
/** The quote total for a job, falling back to the legacy amount field. */
function jobQuoteTotal(job) {
	if (!job.quote) return 0n;
	return job.quote.total > 0n ? job.quote.total : job.quote.amount;
}
function PendingDepositsSection() {
	const requestsQuery = useJobRequests();
	const verifyDeposit = useVerifyDeposit();
	const rejectDeposit = useRejectDeposit();
	const [confirmJob, setConfirmJob] = (0, import_react.useState)(null);
	const [rejectJob, setRejectJob] = (0, import_react.useState)(null);
	const rows = (0, import_react.useMemo)(() => {
		return (requestsQuery.data ?? []).filter(isAwaitingVerification).map((job) => ({
			job,
			customer: job.customerName,
			quoteTotal: jobQuoteTotal(job),
			depositAmount: jobDepositAmount(job),
			method: job.deposit?.method ?? null,
			status: job.deposit?.status ?? DepositStatus.pending
		}));
	}, [requestsQuery.data]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminCard, {
		"data-ocid": "admin.payments.pending_card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminCardHeader, {
				title: "Deposits awaiting verification",
				description: "Customers who say they have paid. Confirming marks the deposit paid, the request confirmed and the appointment booked.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminChip, {
					"data-ocid": "admin.payments.pending_count",
					children: [rows.length, " waiting"]
				})
			}),
			requestsQuery.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLoadingState, {
				"data-ocid": "admin.payments.pending_loading",
				label: "Loading deposits…"
			}) : requestsQuery.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminErrorState, {
				"data-ocid": "admin.payments.pending_error",
				message: "We could not load the deposits awaiting verification.",
				onRetry: () => void requestsQuery.refetch()
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminDataTable, {
				"data-ocid": "admin.payments.pending_table",
				caption: "Deposits awaiting verification",
				columns: [
					{
						key: "customer",
						header: "Customer",
						cell: (row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-base font-semibold text-[oklch(var(--admin-foreground))]",
								children: row.customer
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-sm text-[oklch(var(--admin-muted-foreground))]",
								children: formatReference(row.job.referenceCode)
							})]
						})
					},
					{
						key: "quote",
						header: "Quote",
						align: "right",
						cell: (row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-base",
							children: row.quoteTotal > 0n ? formatMoney(row.quoteTotal) : "—"
						})
					},
					{
						key: "deposit",
						header: "Deposit",
						align: "right",
						cell: (row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-base font-semibold",
							children: formatMoney(row.depositAmount)
						})
					},
					{
						key: "method",
						header: "Method",
						cell: (row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-base",
							children: row.method ? paymentMethodLabel(row.method) : "Not recorded"
						})
					},
					{
						key: "status",
						header: "Status",
						cell: (row) => {
							const meta = getDepositStatusMeta(row.status);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminStatusBadge, {
								tone: meta.tone,
								label: meta.label,
								dot: true,
								"data-ocid": "admin.payments.deposit_status"
							});
						}
					},
					{
						key: "actions",
						header: "Actions",
						cell: (row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-2 sm:flex-row sm:justify-end",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminButton, {
								size: "sm",
								"data-ocid": "admin.payments.confirm_button",
								disabled: verifyDeposit.isPending,
								onClick: () => setConfirmJob(row.job),
								children: "Confirm payment"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminButton, {
								size: "sm",
								variant: "secondary",
								"data-ocid": "admin.payments.reject_button",
								disabled: rejectDeposit.isPending,
								onClick: () => setRejectJob(row.job),
								children: "Payment not received"
							})]
						})
					}
				],
				rows,
				rowKey: (row) => row.job.id.toString(),
				empty: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminEmptyState, {
					"data-ocid": "admin.payments.pending_empty_state",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "size-6" }),
					title: "No deposits waiting",
					description: "When a customer submits a deposit it will appear here for you to confirm."
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminConfirmDialog, {
				open: confirmJob !== null,
				onOpenChange: (open) => {
					if (!open) setConfirmJob(null);
				},
				title: "Confirm this payment?",
				description: confirmJob ? `Mark the ${formatMoney(jobDepositAmount(confirmJob))} deposit from ${confirmJob.customerName} as received. The request becomes confirmed and the appointment is booked.` : void 0,
				confirmLabel: "Confirm payment",
				isPending: verifyDeposit.isPending,
				onConfirm: () => {
					if (!confirmJob) return;
					verifyDeposit.mutate(confirmJob.referenceCode, { onSuccess: () => setConfirmJob(null) });
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminConfirmDialog, {
				open: rejectJob !== null,
				onOpenChange: (open) => {
					if (!open) setRejectJob(null);
				},
				title: "Mark payment not received?",
				description: rejectJob ? `The deposit from ${rejectJob.customerName} returns to a rejected state so they can resubmit it.` : void 0,
				confirmLabel: "Payment not received",
				destructive: true,
				isPending: rejectDeposit.isPending,
				onConfirm: () => {
					if (!rejectJob) return;
					rejectDeposit.mutate(rejectJob.referenceCode, { onSuccess: () => setRejectJob(null) });
				}
			})
		]
	});
}
function PaymentHistorySection() {
	const historyQuery = usePaymentHistory();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminCard, {
		"data-ocid": "admin.payments.history_card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminCardHeader, {
			title: "Payment history",
			description: "Every permanent payment record: original quote, discount, final quote, deposit, remaining balance, final payment and total paid.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminChip, {
				"data-ocid": "admin.payments.history_count",
				children: [historyQuery.data?.length ?? 0, " records"]
			})
		}), historyQuery.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLoadingState, {
			"data-ocid": "admin.payments.history_loading",
			label: "Loading payment history…"
		}) : historyQuery.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminErrorState, {
			"data-ocid": "admin.payments.history_error",
			message: "We could not load the payment history.",
			onRetry: () => void historyQuery.refetch()
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminDataTable, {
			"data-ocid": "admin.payments.history_table",
			caption: "Payment history",
			columns: [
				{
					key: "reference",
					header: "Reference",
					cell: (row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-base font-semibold",
						children: formatReference(row.referenceCode)
					})
				},
				{
					key: "originalQuote",
					header: "Original quote",
					align: "right",
					cell: (row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-base",
						children: formatMoney(row.originalQuote)
					})
				},
				{
					key: "discount",
					header: "Discount",
					align: "right",
					cell: (row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-base",
						children: row.discountAmount > 0n ? `−${formatMoney(row.discountAmount)}` : "—"
					})
				},
				{
					key: "finalQuote",
					header: "Final quote",
					align: "right",
					cell: (row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-base font-semibold",
						children: formatMoney(row.finalQuote)
					})
				},
				{
					key: "deposit",
					header: "Deposit",
					align: "right",
					cell: (row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-base",
						children: formatMoney(row.depositAmount)
					})
				},
				{
					key: "method",
					header: "Method",
					cell: (row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-base",
						children: paymentMethodLabel(row.paymentMethod)
					})
				},
				{
					key: "depositStatus",
					header: "Deposit status",
					cell: (row) => {
						const meta = getDepositStatusMeta(row.depositStatus);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminStatusBadge, {
							tone: meta.tone,
							label: meta.label,
							dot: true
						});
					}
				},
				{
					key: "remaining",
					header: "Remaining",
					align: "right",
					cell: (row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-base font-semibold",
						children: formatMoney(row.remainingBalance)
					})
				},
				{
					key: "finalPayment",
					header: "Final payment",
					align: "right",
					cell: (row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-base",
						children: row.finalPayment > 0n ? formatMoney(row.finalPayment) : "—"
					})
				},
				{
					key: "totalPaid",
					header: "Total paid",
					align: "right",
					cell: (row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-base font-semibold",
						children: formatMoney(row.totalPaid)
					})
				}
			],
			rows: historyQuery.data ?? [],
			rowKey: (row) => row.id.toString(),
			empty: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminEmptyState, {
				"data-ocid": "admin.payments.history_empty_state",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Banknote, { className: "size-6" }),
				title: "No payments recorded yet",
				description: "Confirmed deposits and recorded final payments will be stored here permanently."
			})
		})]
	});
}
function RecordFinalPaymentSection() {
	const historyQuery = usePaymentHistory();
	const recordFinalPayment = useRecordFinalPayment();
	const [jobId, setJobId] = (0, import_react.useState)("");
	const [amount, setAmount] = (0, import_react.useState)("");
	const [method, setMethod] = (0, import_react.useState)(PaymentMethod.cashApp);
	const [error, setError] = (0, import_react.useState)(null);
	const [saved, setSaved] = (0, import_react.useState)(false);
	const openJobs = (0, import_react.useMemo)(() => (historyQuery.data ?? []).filter((record) => record.remainingBalance > 0n), [historyQuery.data]);
	const selected = (0, import_react.useMemo)(() => openJobs.find((record) => record.jobRequestId.toString() === jobId), [openJobs, jobId]);
	function handleSelect(value) {
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
		recordFinalPayment.mutate({
			jobId: selected.jobRequestId,
			amount: cents,
			method
		}, {
			onSuccess: () => {
				setSaved(true);
				setJobId("");
				setAmount("");
			},
			onError: () => {
				setError("The final payment could not be recorded. Please try again.");
			}
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminCard, {
		"data-ocid": "admin.payments.final_card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminCardHeader, {
			title: "Record final payment",
			description: "Record the final payment for a job and settle its remaining balance to zero."
		}), openJobs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminEmptyState, {
			"data-ocid": "admin.payments.final_empty_state",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleDollarSign, { className: "size-6" }),
			title: "No balances outstanding",
			description: "Every recorded job has been paid in full. New balances appear here as deposits are confirmed."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "grid gap-4 sm:grid-cols-2",
			onSubmit: (event) => {
				event.preventDefault();
				handleSubmit();
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
					label: "Job",
					htmlFor: "final-payment-job",
					className: "sm:col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminSelect, {
						id: "final-payment-job",
						"data-ocid": "admin.payments.final_job_select",
						value: jobId,
						onChange: (event) => handleSelect(event.target.value),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Select a job…"
						}), openJobs.map((record) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
							value: record.jobRequestId.toString(),
							children: [
								formatReference(record.referenceCode),
								" —",
								" ",
								formatMoney(record.remainingBalance),
								" due"
							]
						}, record.id.toString()))]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
					label: "Amount",
					htmlFor: "final-payment-amount",
					hint: selected ? `Remaining balance ${formatMoney(selected.remainingBalance)}` : "Enter the amount received.",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminInput, {
						id: "final-payment-amount",
						"data-ocid": "admin.payments.final_amount_input",
						type: "number",
						inputMode: "decimal",
						min: "0",
						step: "0.01",
						placeholder: "0.00",
						value: amount,
						onChange: (event) => {
							setAmount(event.target.value);
							setSaved(false);
							setError(null);
						}
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
					label: "Method",
					htmlFor: "final-payment-method",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminSelect, {
						id: "final-payment-method",
						"data-ocid": "admin.payments.final_method_select",
						value: method,
						onChange: (event) => {
							setMethod(event.target.value);
							setSaved(false);
							setError(null);
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: PaymentMethod.cashApp,
								children: "Cash App"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: PaymentMethod.venmo,
								children: "Venmo"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: PaymentMethod.payPal,
								children: "PayPal"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: PaymentMethod.chime,
								children: "Chime"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: PaymentMethod.stripe,
								children: "Card (Stripe)"
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3 sm:col-span-2",
					children: [
						error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							role: "alert",
							"data-ocid": "admin.payments.final_error",
							className: "text-base font-medium text-[oklch(var(--admin-status-action))]",
							children: error
						}),
						saved && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							"data-ocid": "admin.payments.final_success",
							className: "text-base font-medium text-[oklch(var(--admin-status-paid))]",
							children: "Final payment recorded. The remaining balance is settled."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminButton, {
							type: "submit",
							size: "lg",
							"data-ocid": "admin.payments.final_submit_button",
							disabled: recordFinalPayment.isPending || !selected,
							children: recordFinalPayment.isPending ? "Recording…" : "Record final payment"
						}) })
					]
				})
			]
		})]
	});
}
/** Admin: total collected across every permanent payment record. */
function useCollectedTotal() {
	const { actor, isFetching } = useActor(createActor);
	return useQuery({
		queryKey: [
			"admin",
			"payments",
			"collectedTotal"
		],
		queryFn: async () => {
			if (!actor) return 0n;
			return (await actor.listPaymentHistory()).reduce((sum, record) => sum + record.totalPaid, 0n);
		},
		enabled: !!actor && !isFetching
	});
}
/**
* The filter the dashboard's count link asked for, if any.
*
* Read straight from `window.location.search` so the link works on the plain
* `/admin/payments` route without a `validateSearch` contract.
*/
function initialPaymentFilter() {
	if (typeof window === "undefined") return "all";
	return new URLSearchParams(window.location.search).get("status") === "pending" ? "pending" : "all";
}
function PaymentsPage() {
	const requestsQuery = useJobRequests();
	const historyQuery = usePaymentHistory();
	const collectedQuery = useCollectedTotal();
	const [statusFilter, setStatusFilter] = (0, import_react.useState)(initialPaymentFilter);
	const pendingCount = (requestsQuery.data ?? []).filter(isAwaitingVerification).length;
	const outstanding = (historyQuery.data ?? []).reduce((sum, record) => sum + record.remainingBalance, 0n);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
			eyebrow: "Admin",
			title: "Payments",
			description: "Verify deposits, record final payments and review the permanent payment history."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminStatCard, {
					"data-ocid": "admin.payments.stat_pending",
					label: "Awaiting verification",
					value: String(pendingCount),
					hint: "Deposits to confirm",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "size-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminStatCard, {
					"data-ocid": "admin.payments.stat_collected",
					label: "Total collected",
					value: formatMoney(collectedQuery.data ?? 0n),
					hint: "Across all records",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { className: "size-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminStatCard, {
					"data-ocid": "admin.payments.stat_outstanding",
					label: "Outstanding",
					value: formatMoney(outstanding),
					hint: "Remaining balances",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleDollarSign, { className: "size-5" })
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			"data-ocid": "admin.payments.filter.tabs",
			className: "mb-6 flex flex-wrap gap-2",
			children: [{
				key: "all",
				label: "All payments"
			}, {
				key: "pending",
				label: "Deposits pending"
			}].map((option) => {
				const active = statusFilter === option.key;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"data-ocid": `admin.payments.filter.${option.key}`,
					"aria-pressed": active,
					onClick: () => setStatusFilter(option.key),
					className: cn("inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-base font-semibold transition-smooth", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(var(--admin-ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[oklch(var(--admin-bg))]", active ? "border-transparent bg-[oklch(var(--admin-primary))] text-[oklch(var(--admin-primary-foreground))]" : "border-[oklch(var(--admin-border-strong))] bg-[oklch(var(--admin-surface))] text-[oklch(var(--admin-foreground))] hover:bg-[oklch(var(--admin-surface-alt))]"),
					children: option.label
				}, option.key);
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PendingDepositsSection, {}), statusFilter === "all" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordFinalPaymentSection, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentHistorySection, {})] })]
		})
	] });
}
export { PaymentsPage };
