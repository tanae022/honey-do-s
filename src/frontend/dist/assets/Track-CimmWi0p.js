import { r as __toESM } from "./rolldown-runtime-SbdDWaPq.js";
import { B as statusIndex, C as isDepositSubmitted, D as isQuoteViewExpired, E as isQuoteExpired, F as quoteExpiresLabel, G as getService, H as visitBeeName, I as quoteRemainingBalance, K as cn, L as quoteTotal, M as packageVisitsLabel, O as lineItemTotal, R as quoteViewToQuote, S as isDepositRejected, T as isPackageActive, U as visitServiceLabel, _ as formatVisitDate, b as getStatusMeta, c as balanceDue, ct as require_react, d as depositMethodLabel, h as formatReference, i as DEPOSIT_OPTIONS, j as packageStartedLabel, m as formatMoney, p as formatDateTime, st as require_jsx_runtime, t as createLucideIcon, tt as PaymentMethod, u as depositAmount, v as getDepositStatusMeta, w as isDepositVerified, x as hasQuoteDiscount, y as getQuoteStatusMeta, z as sortVisitsNewestFirst } from "./createLucideIcon-CK3986Sn.js";
import { t as CalendarCheck } from "./calendar-check-X2jabMoP.js";
import { t as Check } from "./check-qhjPHsNw.js";
import { t as MessageSquare } from "./message-square-Ciq8dACq.js";
import { t as Send } from "./send-BC-7IC_M.js";
import { t as ThumbsDown } from "./thumbs-down-DKKayDLZ.js";
import { A as useQuoteByReference, B as useSubmitReview, C as useDeclineQuoteByReference, H as useVisitHistory, T as useJobByReference, U as HoneyLoader, b as useConfirmAppointment, j as useRecordDeposit, k as usePostCustomerMessage, n as BeeAccent, t as HoneyButton, x as useCustomerMessages, y as useAcceptQuote } from "./index-DhzL9CXu.js";
import { t as Label } from "./label-DQWmTWtr.js";
import { u as usePaymentSummary, x as useSubmitDeposit } from "./useAdminSettings-CtJqDOX4.js";
import { n as HoneyCardHeader, t as HoneyCard } from "./HoneyCard-Dp51lMsB.js";
import { t as Input } from "./input-C4Zv5zIi.js";
import { t as Textarea } from "./textarea-_N2gIIQm.js";
import { n as HexStatusTimeline, t as HexStatus } from "./HexStatus-VnvmG7KX.js";
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Copy = createLucideIcon("copy", [["rect", {
	width: "14",
	height: "14",
	x: "8",
	y: "8",
	rx: "2",
	ry: "2",
	key: "17jyea"
}], ["path", {
	d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",
	key: "zix9uf"
}]]);
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var ExternalLink = createLucideIcon("external-link", [
	["path", {
		d: "M15 3h6v6",
		key: "1q9fwt"
	}],
	["path", {
		d: "M10 14 21 3",
		key: "gplh6r"
	}],
	["path", {
		d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",
		key: "a6xqqp"
	}]
]);
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var History = createLucideIcon("history", [
	["path", {
		d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",
		key: "1357e3"
	}],
	["path", {
		d: "M3 3v5h5",
		key: "1xhq8a"
	}],
	["path", {
		d: "M12 7v5l4 2",
		key: "1fdv2h"
	}]
]);
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Star = createLucideIcon("star", [["path", {
	d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
	key: "r04s7s"
}]]);
// src/pages/Track.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
/**
* Read the emailed link's `reference` and `action` from the URL query string.
*
* Read straight from `window.location.search` rather than the router's search
* state so the emailed link works on the plain `/track` route without a
* `validateSearch` contract, and so the reference-code entry keeps working
* exactly as before.
*/
function readQuoteLink() {
	if (typeof window === "undefined") return {
		reference: "",
		action: null
	};
	const params = new URLSearchParams(window.location.search);
	const reference = (params.get("reference") ?? "").trim();
	const rawAction = params.get("action") ?? "";
	return {
		reference,
		action: rawAction === "accept" || rawAction === "decline" ? rawAction : null
	};
}
function TrackPage() {
	const link = (0, import_react.useMemo)(() => readQuoteLink(), []);
	const [reference, setReference] = (0, import_react.useState)(link.reference);
	const [submitted, setSubmitted] = (0, import_react.useState)(link.reference);
	(0, import_react.useEffect)(() => {
		if (link.reference.length === 0) return;
		setReference(link.reference);
		setSubmitted(link.reference);
	}, [link.reference]);
	const jobQuery = useJobByReference(submitted);
	const quoteQuery = useQuoteByReference(submitted);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "animate-page-enter px-5 py-10 sm:px-8 md:py-14",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto w-full max-w-3xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "mb-8 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BeeAccent, { className: "mx-auto h-8 w-11" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-4 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl",
							children: "Track your Honey Do"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mx-auto mt-3 max-w-lg text-sm text-muted-foreground md:text-base",
							children: "Enter the reference code from your request to see its progress."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoneyCard, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: (event) => {
						event.preventDefault();
						setSubmitted(reference.trim());
					},
					className: "flex flex-col gap-3 sm:flex-row sm:items-end",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "reference",
							children: "Reference code"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "reference",
							"data-ocid": "track.reference_input",
							value: reference,
							onChange: (event) => setReference(event.target.value),
							placeholder: "HD-4F2A9C",
							className: "mt-2 min-h-12 font-mono uppercase tracking-[0.14em]"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoneyButton, {
						type: "submit",
						"data-ocid": "track.lookup_button",
						disabled: reference.trim().length === 0,
						className: "w-full sm:w-auto",
						children: "Find my job"
					})]
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6",
					children: [
						submitted.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoneyCard, {
							className: "text-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted-foreground",
								children: [
									"Your reference code looks like",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono font-semibold text-primary",
										children: "HD-4F2A9C"
									}),
									". It was shown when you submitted your request."
								]
							})
						}),
						submitted.length > 0 && jobQuery.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoneyCard, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoneyLoader, {
							"data-ocid": "track.loading_state",
							label: "Finding your job"
						}) }),
						submitted.length > 0 && jobQuery.isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoneyCard, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							"data-ocid": "track.error_state",
							className: "text-center text-sm text-destructive",
							children: "Something went wrong looking up that code. Please try again."
						}) }),
						submitted.length > 0 && !jobQuery.isLoading && !jobQuery.isError && !jobQuery.data && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoneyCard, {
							className: "text-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								"data-ocid": "track.empty_state",
								className: "text-sm text-muted-foreground",
								children: "We couldn't find a job with that code. Double-check the letters and numbers, then try again."
							})
						}),
						jobQuery.data && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JobDetail, {
							job: jobQuery.data,
							requestedAction: link.action,
							emailedQuote: quoteQuery.data ?? null
						})
					]
				})
			]
		})
	});
}
function JobDetail({ job, requestedAction, emailedQuote }) {
	const service = getService(job.category);
	const status = getStatusMeta(job.status);
	const acceptQuote = useAcceptQuote();
	const declineQuote = useDeclineQuoteByReference();
	const confirmAppointment = useConfirmAppointment();
	const recordDeposit = useRecordDeposit();
	const submitDeposit = useSubmitDeposit();
	const submitReview = useSubmitReview();
	const visitsQuery = useVisitHistory(job.referenceCode);
	const paymentQuery = usePaymentSummary(job.referenceCode);
	const [rating, setRating] = (0, import_react.useState)(5);
	const [comment, setComment] = (0, import_react.useState)("");
	const [copiedId, setCopiedId] = (0, import_react.useState)(null);
	const [selectedOptionId, setSelectedOptionId] = (0, import_react.useState)(DEPOSIT_OPTIONS[0].id);
	const [celebrating, setCelebrating] = (0, import_react.useState)(false);
	const [linkActionError, setLinkActionError] = (0, import_react.useState)(null);
	const [linkActionDone, setLinkActionDone] = (0, import_react.useState)(null);
	/**
	* The quote to render. The job view embeds the quote record; the emailed
	* link's `getQuoteByReference` reads the same record, so it is used as a
	* fallback to guarantee the emailed quote always renders even if the job
	* view's embedded quote is momentarily absent.
	*/
	const quote = job.quote ?? (emailedQuote ? quoteViewToQuote(emailedQuote) : null);
	/**
	* The emailed link's `getQuoteByReference` carries the backend's own
	* `expired` flag, so honor it when present; otherwise fall back to the
	* client-side expiration check on the quote's `expiresAt`.
	*/
	const quoteExpired = emailedQuote ? isQuoteViewExpired(emailedQuote) : quote ? isQuoteExpired(quote) : false;
	const quoteAccepted = job.status !== "quoted";
	const canAcceptQuote = !!quote && job.status === "quoted" && !quoteExpired;
	const canReview = job.status === "completed" && !job.review;
	const isCompleted = job.status === "completed";
	/**
	* The customer-facing payment summary is the authoritative payment page: it
	* carries the original amount, discount, final total, the 10% deposit and the
	* remaining balance computed by the backend pricing engine, plus the accepted
	* payment methods and the current deposit state. The job view's embedded
	* quote is the fallback while the summary loads.
	*/
	const summary = paymentQuery.data ?? null;
	const depositStatus = summary?.depositStatus ?? job.deposit?.status;
	const depositVerified = isDepositVerified(depositStatus);
	const depositSubmitted = isDepositSubmitted(depositStatus);
	const depositRejected = isDepositRejected(depositStatus);
	const deposit = summary ? summary.depositAmount : quote ? depositAmount(quoteTotal(quote)) : 0n;
	const balance = summary ? summary.remainingBalance : quote ? balanceDue(quoteTotal(quote)) : 0n;
	/**
	* The deposit percentage actually charged, derived from the backend's own
	* deposit and final total so the label always matches the amount shown. The
	* backend configures the percentage (10% by default); the customer never
	* calculates it.
	*/
	const finalTotal = summary?.finalTotal ?? (quote ? quoteTotal(quote) : 0n);
	const depositPercentLabel = finalTotal > 0n ? `${Math.round(Number(deposit) * 100 / Number(finalTotal))}%` : "10%";
	/**
	* The customer can submit a deposit once the quote is accepted and the
	* deposit is not already verified or awaiting verification. A rejected
	* deposit returns to this state so the customer can resubmit it.
	*/
	const canPayDeposit = !!quote && job.status !== "quoted" && !depositVerified && !depositSubmitted && !job.deposit?.paid;
	const packageActive = isPackageActive(job.packageEnrollment);
	const packageVisits = packageVisitsLabel(job.packageEnrollment);
	const packageStarted = packageStartedLabel(job.packageEnrollment);
	const visits = sortVisitsNewestFirst(visitsQuery.data ?? []);
	const selectedOption = DEPOSIT_OPTIONS.find((option) => option.id === selectedOptionId) ?? DEPOSIT_OPTIONS[0];
	/**
	* Every manual option records through the same backend `recordDeposit` path
	* with the `cashApp` variant — the deposit is a single manual payment the
	* owner verifies, and the provider only changes where the customer sends the
	* money, never the amount. The UI names the selected provider so the
	* customer's choice is reflected accurately.
	*/
	const selectedMethod = PaymentMethod.cashApp;
	/**
	* Perform the action an emailed link requested, exactly once.
	*
	* The link carries `action=accept|decline`; the customer should not have to
	* tap again. An expired quote can never be accepted, so the accept action is
	* refused with a clear message instead of calling the backend.
	*/
	(0, import_react.useEffect)(() => {
		if (!requestedAction || linkActionDone || linkActionError) return;
		if (!quote) return;
		if (requestedAction === "accept") {
			if (job.status !== "quoted") {
				setLinkActionDone("accept");
				return;
			}
			if (quoteExpired) {
				setLinkActionError("This quote has expired and can no longer be accepted.");
				return;
			}
			acceptQuote.mutate(job.referenceCode, {
				onSuccess: (result) => {
					if (result.__kind__ === "err") {
						setLinkActionError(describeQuoteError(result.err));
						return;
					}
					setLinkActionDone("accept");
					setCelebrating(true);
				},
				onError: () => setLinkActionError("We couldn't accept this quote. Please try again.")
			});
			return;
		}
		if (quote.status === "declined") {
			setLinkActionDone("decline");
			return;
		}
		declineQuote.mutate(job.referenceCode, {
			onSuccess: (result) => {
				if (result.__kind__ === "err") {
					setLinkActionError(describeQuoteError(result.err));
					return;
				}
				setLinkActionDone("decline");
			},
			onError: () => setLinkActionError("We couldn't decline this quote. Please try again.")
		});
	}, [
		requestedAction,
		linkActionDone,
		linkActionError,
		quote,
		quoteExpired,
		job.status,
		job.referenceCode,
		acceptQuote,
		declineQuote
	]);
	const copyHandle = async (option) => {
		try {
			await navigator.clipboard.writeText(option.handle);
			setCopiedId(option.id);
			window.setTimeout(() => setCopiedId((current) => current === option.id ? null : current), 2e3);
		} catch {
			setCopiedId(null);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			celebrating && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BeeSwarmCelebration, {}),
			requestedAction && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoneyCard, {
				"data-ocid": "track.link_action_banner",
				children: linkActionError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					"data-ocid": "track.link_action_error",
					className: "text-sm font-semibold text-destructive",
					children: linkActionError
				}) : linkActionDone === "accept" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					"data-ocid": "track.link_action_success",
					className: "inline-flex items-center gap-2 text-sm font-semibold text-success",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }), "Quote accepted — thank you. We'll be in touch to schedule."]
				}) : linkActionDone === "decline" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					"data-ocid": "track.link_action_success",
					className: "inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThumbsDown, { className: "size-4" }), "Quote declined. Thanks for letting us know."]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoneyLoader, {
					"data-ocid": "track.link_action_loading",
					label: requestedAction === "accept" ? "Accepting your quote" : "Declining your quote"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(HoneyCard, {
				"data-ocid": "track.job_card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoneyCardHeader, {
						title: service.label,
						description: `Reference ${formatReference(job.referenceCode)}`,
						action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HexStatus, {
							"data-ocid": "track.status_chip",
							label: status.label,
							toneClass: status.chipClass
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: status.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HexStatusTimeline, {
							"data-ocid": "track.status_timeline",
							steps: [
								"Requested",
								"Quoted",
								"Scheduled",
								"In Progress",
								"Completed"
							],
							currentIndex: Math.max(statusIndex(job.status), 0)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-6 grid gap-4 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, {
								label: "Requested",
								value: formatDateTime(job.createdAt)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, {
								label: "Preferred timing",
								value: job.preferredTiming
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, {
								label: "Contact",
								value: `${job.customerName} · ${job.phone}`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, {
								label: "Email",
								value: job.email
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 rounded-xl border border-border/70 bg-muted/30 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground",
							children: "Your description"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-foreground",
							children: job.description
						})]
					})
				]
			}),
			job.assignedBeeName && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(HoneyCard, {
				"data-ocid": "track.assigned_bee_card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoneyCardHeader, {
					title: "Your bee",
					description: "The Honey Do's bee handling this visit."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "relative flex size-16 shrink-0 items-center justify-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"aria-hidden": "true",
							className: "hex-clip absolute inset-0 bg-gradient-to-b from-primary/45 to-primary/10"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BeeAccent, {
							className: "relative z-10 h-9 w-12",
							motion: "hover",
							label: `${job.assignedBeeName}, your assigned bee`
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-lg font-semibold text-foreground",
							children: job.assignedBeeName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground",
							children: [
								"Assigned to your ",
								service.label.toLowerCase(),
								" visit."
							]
						})]
					})]
				})]
			}),
			job.packageEnrollment && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(HoneyCard, {
				"data-ocid": "track.package_card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoneyCardHeader, {
						title: "Monthly package",
						description: packageActive ? "Your hive membership is active." : "Your hive membership is paused.",
						action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HexStatus, {
							"data-ocid": "track.package_status_chip",
							label: packageActive ? "Active" : "Paused",
							toneClass: packageActive ? "border-success/60 bg-success/15 text-success" : "border-warning/60 bg-warning/15 text-warning"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [packageVisits && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, {
							label: "Included",
							value: packageVisits
						}), packageStarted && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, {
							label: "Started",
							value: packageStarted
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 text-xs text-muted-foreground",
						children: ["Your monthly rate is set with the owner. ", "Billed monthly by the owner — no automatic recurring charges."]
					})
				]
			}),
			quote && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuotePanel, {
				quote,
				canAccept: canAcceptQuote,
				accepted: quoteAccepted && !canAcceptQuote,
				expired: quoteExpired,
				accepting: acceptQuote.isPending,
				declining: declineQuote.isPending,
				onAccept: () => acceptQuote.mutate(job.referenceCode, { onSuccess: () => setCelebrating(true) }),
				onDecline: () => declineQuote.mutate(job.referenceCode)
			}),
			quote && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(HoneyCard, {
				"data-ocid": "track.payment_breakdown_card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoneyCardHeader, {
						title: "Deposit & balance",
						description: "Your final quote, the deposit to secure your spot, and the balance due on completion."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-sm text-muted-foreground",
									children: "Original amount"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "font-mono text-sm font-semibold text-foreground",
									children: formatMoney(summary?.originalSubtotal ?? quote.subtotal)
								})]
							}),
							hasQuoteDiscount(quote) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dt", {
									className: "text-sm text-muted-foreground",
									children: ["Discount", summary?.discountReason ? ` — ${summary.discountReason}` : ""]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
									className: "font-mono text-sm font-semibold text-success",
									children: ["−", formatMoney(summary?.discountAmount ?? quote.discountAmount)]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-4 border-t border-border/70 pt-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-sm font-semibold text-foreground",
									children: "Final quote"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "font-mono text-2xl font-bold text-gold-gradient",
									children: formatMoney(summary?.finalTotal ?? quoteTotal(quote))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dt", {
									className: "text-sm text-muted-foreground",
									children: [
										"Deposit (",
										depositPercentLabel,
										")"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "font-mono text-sm font-semibold text-foreground",
									children: formatMoney(deposit)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-sm text-muted-foreground",
									children: "Balance due"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "font-mono text-sm font-semibold text-foreground",
									children: formatMoney(balance)
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DepositStatusLine, {
							status: depositStatus,
							amount: deposit,
							method: summary?.depositMethod ?? job.deposit?.method
						})
					})
				]
			}),
			job.appointment && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(HoneyCard, {
				"data-ocid": "track.appointment_card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoneyCardHeader, {
						title: "Appointment",
						description: formatDateTime(job.appointment.scheduledAt),
						action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "relative flex size-11 items-center justify-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								"aria-hidden": "true",
								className: "hex-clip absolute inset-0 bg-gradient-to-b from-primary/50 to-primary/10"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarCheck, { className: "relative z-10 size-5 text-primary" })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BeeAccent, {
							className: "h-6 w-8",
							motion: "drift"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Your slot is reserved on the hive calendar."
						})]
					}),
					job.appointment.confirmed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "inline-flex items-center gap-2 text-sm font-semibold text-success",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }), "Appointment confirmed"]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoneyButton, {
						"data-ocid": "track.confirm_appointment_button",
						disabled: confirmAppointment.isPending,
						onClick: () => confirmAppointment.mutate(job.referenceCode),
						className: "w-full sm:w-auto",
						children: confirmAppointment.isPending ? "Confirming…" : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BeeAccent, { className: "h-4 w-6" }), "CONFIRM APPOINTMENT"] })
					})
				]
			}),
			canPayDeposit && quote && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(HoneyCard, {
				"data-ocid": "track.deposit_card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoneyCardHeader, {
						title: "Pay your deposit",
						description: "Send the deposit to secure your spot, then tell us you've paid."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-primary/50 bg-primary/10 p-4 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-semibold uppercase tracking-[0.2em] text-primary",
								children: "Exact amount to pay"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 font-mono text-3xl font-bold text-gold-gradient",
								children: formatMoney(deposit)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: [
									depositPercentLabel,
									" deposit of your ",
									formatMoney(finalTotal),
									" ",
									"final quote"
								]
							})
						]
					}),
					depositRejected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						"data-ocid": "track.deposit_rejected_notice",
						className: "mt-4 inline-flex items-center gap-2 rounded-xl border border-destructive/50 bg-destructive/15 px-4 py-3 text-sm font-semibold text-destructive",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThumbsDown, { className: "size-4 shrink-0" }), "We couldn't find your last deposit. Please resubmit it with the correct details below."]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm text-muted-foreground",
						children: "Pick where you'd like to send it, copy the handle, then tap “I've sent it” so we can verify it."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						"data-ocid": "track.deposit_options",
						className: "mt-4 grid gap-3 sm:grid-cols-2",
						children: DEPOSIT_OPTIONS.map((option) => {
							const selected = option.id === selectedOption.id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								"data-ocid": `track.deposit_option.${option.id}`,
								className: `flex flex-col gap-2 rounded-xl border p-4 transition-smooth ${selected ? "border-primary/60 bg-primary/15 shadow-honey" : "border-border/70 bg-muted/30 hover:border-primary/40"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									"data-ocid": `track.deposit_select_button.${option.id}`,
									"aria-pressed": selected,
									onClick: () => setSelectedOptionId(option.id),
									className: "flex min-h-8 w-full items-center justify-between gap-2 rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-display text-base font-semibold text-foreground",
										children: option.label
									}), selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 shrink-0 text-primary" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "min-w-0 truncate font-mono text-sm font-semibold text-primary",
										children: option.handle
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										"data-ocid": `track.deposit_copy_button.${option.id}`,
										"aria-label": `Copy ${option.label} handle`,
										onClick: () => void copyHandle(option),
										className: "shrink-0 rounded-full p-1.5 transition-smooth hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
										children: copiedId === option.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" })
									})]
								})]
							}, option.id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 rounded-xl border border-primary/40 bg-primary/10 p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs font-semibold uppercase tracking-[0.2em] text-primary",
								children: ["Pay by ", selectedOption.label]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-sm text-muted-foreground",
								children: [
									selectedOption.hint,
									" Send ",
									formatMoney(deposit),
									", then tap “I've sent it”."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex flex-col gap-3 sm:flex-row sm:items-center",
								children: [
									selectedOption.url && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: selectedOption.url,
										target: "_blank",
										rel: "noreferrer",
										"data-ocid": `track.deposit_open_link.${selectedOption.id}`,
										className: "inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-primary/45 bg-secondary/60 px-6 text-base font-semibold text-foreground transition-smooth hover:border-primary/70 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-4" }),
											"Open ",
											selectedOption.label
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoneyButton, {
										"data-ocid": "track.deposit_sent_button",
										disabled: recordDeposit.isPending || submitDeposit.isPending,
										onClick: () => recordDeposit.mutate({
											referenceCode: job.referenceCode,
											method: selectedMethod
										}),
										className: "w-full sm:w-auto",
										children: recordDeposit.isPending ? "Submitting…" : "I've sent it"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoneyButton, {
										variant: "secondary",
										"data-ocid": "track.deposit_paid_button",
										disabled: recordDeposit.isPending || submitDeposit.isPending,
										onClick: () => submitDeposit.mutate({
											referenceCode: job.referenceCode,
											method: selectedMethod
										}),
										className: "w-full sm:w-auto",
										children: submitDeposit.isPending ? "Submitting…" : "I've paid my deposit"
									})
								]
							}),
							(recordDeposit.isError || submitDeposit.isError) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								"data-ocid": "track.deposit_error",
								className: "mt-3 text-sm font-semibold text-destructive",
								children: "We couldn't submit your deposit. Please try again."
							}),
							(recordDeposit.isSuccess || submitDeposit.isSuccess) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								"data-ocid": "track.deposit_recorded",
								className: "mt-3 inline-flex items-center gap-2 text-sm font-semibold text-success",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }),
									"We'll confirm your ",
									selectedOption.label,
									" deposit shortly."
								]
							})
						]
					})
				]
			}),
			depositSubmitted && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(HoneyCard, {
				"data-ocid": "track.deposit_verifying_card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoneyCardHeader, {
					title: "Deposit submitted — verifying",
					description: "We have your deposit and are checking it now.",
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HexStatus, {
						"data-ocid": "track.deposit_verifying_chip",
						label: "Verifying",
						toneClass: "border-accent/60 bg-accent/15 text-accent"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: [
						"We'll confirm your ",
						formatMoney(deposit),
						" deposit",
						depositMethodLabel(summary?.depositMethod ?? job.deposit?.method) ? ` sent via ${depositMethodLabel(summary?.depositMethod ?? job.deposit?.method)}` : "",
						" ",
						"shortly. You'll be notified as soon as it clears."
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomerMessageThread, { referenceCode: job.referenceCode }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(HoneyCard, {
				"data-ocid": "track.visit_history_card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoneyCardHeader, {
						title: "Past visits",
						description: "Every Honey Do's visit to your home, newest first.",
						action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "relative flex size-11 items-center justify-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								"aria-hidden": "true",
								className: "hex-clip absolute inset-0 bg-gradient-to-b from-primary/50 to-primary/10"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "relative z-10 size-5 text-primary" })]
						})
					}),
					visitsQuery.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoneyLoader, {
						"data-ocid": "track.visit_history_loading",
						label: "Loading your visits"
					}),
					!visitsQuery.isLoading && visitsQuery.isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						"data-ocid": "track.visit_history_error",
						className: "text-sm text-destructive",
						children: "We couldn't load your visit history. Please try again."
					}),
					!visitsQuery.isLoading && !visitsQuery.isError && visits.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						"data-ocid": "track.visit_history_empty",
						className: "text-sm text-muted-foreground",
						children: "No completed visits yet. Once your first Honey Do is finished, it will show up here."
					}),
					visits.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						"data-ocid": "track.visit_history_list",
						className: "space-y-3",
						children: visits.map((visit, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							"data-ocid": `track.visit_history_item.${index + 1}`,
							className: "flex items-center gap-4 rounded-xl border border-border/70 bg-muted/30 p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "relative flex size-12 shrink-0 items-center justify-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										"aria-hidden": "true",
										className: "hex-clip absolute inset-0 bg-gradient-to-b from-primary/40 to-primary/10"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BeeAccent, {
										className: "relative z-10 h-7 w-9",
										motion: "hover"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate font-display text-base font-semibold text-foreground",
										children: visitServiceLabel(visit)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-sm text-muted-foreground",
										children: visitBeeName(visit)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "shrink-0 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground",
									children: formatVisitDate(visit)
								})
							]
						}, `${visit.jobId.toString()}-${visit.completedAt.toString()}`))
					})
				]
			}),
			job.review && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(HoneyCard, {
				"data-ocid": "track.review_card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoneyCardHeader, { title: "Your review" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-1",
						children: [
							1,
							2,
							3,
							4,
							5
						].map((value) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: value <= Number(job.review?.rating) ? "size-5 fill-primary text-primary" : "size-5 text-muted-foreground" }, value))
					}),
					job.review.comment && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted-foreground",
						children: job.review.comment
					})
				]
			}),
			isCompleted && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(HoneyCard, {
				"data-ocid": "track.completed_accent",
				className: "flex items-center gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "relative flex size-14 shrink-0 items-center justify-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"aria-hidden": "true",
							className: "hex-clip absolute inset-0 bg-gradient-to-b from-success/40 to-success/10"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BeeAccent, {
							className: "relative z-10 h-8 w-11",
							motion: "hover"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"aria-hidden": "true",
							className: "hex-clip absolute -bottom-1 right-0 size-3 bg-gradient-to-b from-accent to-primary shadow-honey"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-base font-semibold text-foreground",
						children: "Job complete"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Your Honey Do is finished — thank you for letting us help."
					})]
				})]
			}),
			canReview && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(HoneyCard, {
				"data-ocid": "track.review_form",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoneyCardHeader, {
						title: "How did we do?",
						description: "Your feedback helps us keep the hive buzzing."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-2",
						children: [
							1,
							2,
							3,
							4,
							5
						].map((value) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"data-ocid": `track.rating_button.${value}`,
							"aria-label": `Rate ${value} out of 5`,
							"aria-pressed": rating === value,
							onClick: () => setRating(value),
							className: "rounded-full p-1 transition-smooth hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: value <= rating ? "size-7 fill-primary text-primary" : "size-7 text-muted-foreground" })
						}, value))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "review-comment",
							children: "Leave a comment"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "review-comment",
							"data-ocid": "track.review_input",
							value: comment,
							onChange: (event) => setComment(event.target.value),
							placeholder: "They fixed the faucet and even tightened the cabinet door.",
							className: "mt-2 min-h-24"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoneyButton, {
						"data-ocid": "track.submit_review_button",
						disabled: submitReview.isPending,
						onClick: () => submitReview.mutate({
							referenceCode: job.referenceCode,
							rating: BigInt(rating),
							comment: comment.trim()
						}, { onSuccess: () => setComment("") }),
						className: "mt-4 w-full sm:w-auto",
						children: submitReview.isPending ? "Sending…" : "Submit review"
					})
				]
			})
		]
	});
}
/**
* The customer-facing itemized quote.
*
* Presents the full quote the way a professional estimate reads: a header with
* the quote number, status and sent date; the work description; an itemized
* line-item breakdown; labor and materials; the subtotal, any own-parts
* discount and the final total; the deposit and remaining balance; and the
* expiration. Built phone-first — every row stacks and wraps so nothing
* overflows a narrow viewport, and numeric values stay right-aligned.
*/
function QuotePanel({ quote, canAccept, accepted, expired, accepting, declining, onAccept, onDecline }) {
	const status = getQuoteStatusMeta(quote.status);
	const total = quoteTotal(quote);
	const remaining = quoteRemainingBalance(quote);
	const discount = hasQuoteDiscount(quote);
	const expiresLabel = quoteExpiresLabel(quote);
	const hasLineItems = quote.lineItems.length > 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(HoneyCard, {
		"data-ocid": "track.quote_card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-outline-black-strong font-display text-xl font-bold text-foreground",
						children: "Your quote"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-outline-black mt-1 text-sm text-muted-foreground",
						children: quote.quoteNumber ? quote.sentAt > 0n ? `Quote ${quote.quoteNumber} · Sent ${formatDateTime(quote.sentAt)}` : `Quote ${quote.quoteNumber}` : quote.sentAt > 0n ? `Sent ${formatDateTime(quote.sentAt)}` : "Your itemized quote"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HexStatus, {
					"data-ocid": "track.quote_status_chip",
					label: status.label,
					toneClass: status.chipClass
				})]
			}),
			quote.workDescription && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 rounded-xl border border-border/70 bg-muted/30 p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground",
					children: "Work description"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-foreground",
					children: quote.workDescription
				})]
			}),
			hasLineItems && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground",
					children: "Line items"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					"data-ocid": "track.quote_line_items",
					className: "mt-3 divide-y divide-border/60 overflow-hidden rounded-xl border border-border/70",
					children: quote.lineItems.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						"data-ocid": `track.quote_line_item.${index + 1}`,
						className: "flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 bg-muted/20 px-4 py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "min-w-0 flex-1 break-words text-sm font-medium text-foreground",
								children: item.description
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "shrink-0 font-mono text-xs text-muted-foreground",
								children: [
									item.quantity.toString(),
									" × ",
									formatMoney(item.unitPrice)
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "shrink-0 font-mono text-sm font-semibold text-foreground",
								children: formatMoney(lineItemTotal(item))
							})
						]
					}, `${item.description}-${index}`))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "mt-5 space-y-3",
				children: [
					quote.laborCharge > 0n && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-sm text-muted-foreground",
							children: "Labor"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "font-mono text-sm font-semibold text-foreground",
							children: formatMoney(quote.laborCharge)
						})]
					}),
					quote.materialsCharge > 0n && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-sm text-muted-foreground",
							children: "Materials"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "font-mono text-sm font-semibold text-foreground",
							children: formatMoney(quote.materialsCharge)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-sm text-muted-foreground",
							children: "Subtotal"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "font-mono text-sm font-semibold text-foreground",
							children: formatMoney(quote.subtotal)
						})]
					}),
					discount && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-sm text-muted-foreground",
							children: "Own parts/supplies discount (10%)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
							className: "font-mono text-sm font-semibold text-success",
							children: ["−", formatMoney(quote.discountAmount)]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-4 border-t border-border/70 pt-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-sm font-semibold text-foreground",
							children: "Total"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "font-mono text-2xl font-bold text-gold-gradient",
							children: formatMoney(total)
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-primary/40 bg-primary/10 p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-semibold uppercase tracking-[0.18em] text-primary",
						children: "Deposit required"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-mono text-lg font-bold text-foreground",
						children: formatMoney(quote.depositRequired)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border/70 bg-muted/30 p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground",
						children: "Remaining balance"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-mono text-lg font-bold text-foreground",
						children: formatMoney(remaining)
					})]
				})]
			}),
			expiresLabel && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				"data-ocid": "track.quote_expiration",
				className: cn("mt-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold", expired ? "border-destructive/50 bg-destructive/15 text-destructive" : "border-border/70 bg-muted/40 text-muted-foreground"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarCheck, {
					className: "size-3.5",
					"aria-hidden": "true"
				}), expired ? "Expired" : expiresLabel]
			}),
			quote.note && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-muted-foreground",
				children: quote.note
			}),
			canAccept && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex flex-col gap-3 sm:flex-row sm:items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoneyButton, {
					"data-ocid": "track.accept_quote_button",
					disabled: accepting || declining,
					onClick: onAccept,
					className: "w-full sm:w-auto",
					children: accepting ? "Accepting…" : "🍯 ACCEPT QUOTE"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(HoneyButton, {
					variant: "secondary",
					"data-ocid": "track.decline_quote_button",
					disabled: accepting || declining,
					onClick: onDecline,
					className: "w-full sm:w-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThumbsDown, { className: "size-4" }), declining ? "Declining…" : "Decline quote"]
				})]
			}),
			expired && !accepted && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				"data-ocid": "track.quote_expired_notice",
				className: "mt-4 inline-flex items-center gap-2 text-sm font-semibold text-destructive",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarCheck, {
					className: "size-4",
					"aria-hidden": "true"
				}), "This quote has expired and can no longer be accepted."]
			}),
			accepted && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 inline-flex items-center gap-2 text-sm font-semibold text-success",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }), "Quote accepted"]
			}),
			quote.status === "declined" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				"data-ocid": "track.quote_declined_notice",
				className: "mt-4 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThumbsDown, { className: "size-4" }), "Quote declined"]
			})
		]
	});
}
/**
* The customer's own message thread for the tracked job.
*
* Loads the exchange tied to this reference code and lets the customer post a
* new message. The backend scopes the thread to the reference code, so a
* customer only ever sees their own conversation with the administrator.
*/
function CustomerMessageThread({ referenceCode }) {
	const messagesQuery = useCustomerMessages(referenceCode);
	const postMessage = usePostCustomerMessage();
	const [body, setBody] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const messages = (0, import_react.useMemo)(() => {
		return [...messagesQuery.data ?? []].sort((a, b) => a.createdAt === b.createdAt ? 0 : a.createdAt > b.createdAt ? 1 : -1);
	}, [messagesQuery.data]);
	const handleSend = () => {
		const next = body.trim();
		if (next.length === 0) {
			setError("Write a message before sending.");
			return;
		}
		setError(null);
		setBody("");
		postMessage.mutate({
			referenceCode,
			body: next
		}, {
			onSuccess: (result) => {
				if (result.__kind__ === "err") {
					setError(result.err.__kind__ === "notAuthorized" ? "We couldn't verify this job. Re-enter your reference code and try again." : "We couldn't find that job. Double-check your reference code.");
					setBody((current) => current === "" ? next : current);
				}
			},
			onError: () => {
				setError("We couldn't send that message. Please try again.");
				setBody((current) => current === "" ? next : current);
			}
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(HoneyCard, {
		"data-ocid": "track.messages_card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoneyCardHeader, {
				title: "Messages",
				description: "Chat with the administrator about this job.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					"aria-hidden": "true",
					className: "hex-clip flex size-11 items-center justify-center bg-primary/15 text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "size-5" })
				})
			}),
			messagesQuery.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoneyLoader, {
				"data-ocid": "track.messages_loading_state",
				label: "Loading your messages"
			}) : messagesQuery.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				"data-ocid": "track.messages_error_state",
				className: "text-sm text-destructive",
				children: "We couldn't load your messages. Please try again."
			}) : messages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				"data-ocid": "track.messages_empty_state",
				className: "text-sm text-muted-foreground",
				children: "No messages yet. Ask a question about your job below and we'll reply here."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				"data-ocid": "track.messages_list",
				className: "flex max-h-96 flex-col gap-3 overflow-y-auto pr-1 scrollbar-honey",
				children: messages.map((message, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					"data-ocid": `track.message_item.${index + 1}`,
					className: cn("max-w-[85%] rounded-2xl border px-4 py-2.5", message.fromAdmin ? "mr-auto border-primary/40 bg-primary/15" : "ml-auto border-border/70 bg-muted/30"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground",
							children: message.fromAdmin ? "Honey Do's" : "You"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-foreground",
							children: message.body
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-[0.65rem] text-muted-foreground",
							children: formatDateTime(message.createdAt)
						})
					]
				}, message.id.toString()))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 border-t border-border/70 pt-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "track-message-input",
						children: "Send a message"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						id: "track-message-input",
						"data-ocid": "track.message_input",
						value: body,
						onChange: (event) => {
							setBody(event.target.value);
							setError(null);
						},
						placeholder: "Could you come by Thursday morning instead?",
						className: "mt-2 min-h-20"
					}),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						"data-ocid": "track.message_error_state",
						className: "mt-2 text-sm text-destructive",
						children: error
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(HoneyButton, {
						"data-ocid": "track.message_send_button",
						disabled: postMessage.isPending || body.trim().length === 0,
						onClick: handleSend,
						className: "mt-3 w-full sm:w-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4" }), postMessage.isPending ? "Sending…" : "Send message"]
					})
				]
			})
		]
	});
}
var SWARM_BEES = [
	{
		id: "swarm-1",
		top: 14,
		left: -12,
		duration: 2.6,
		delay: 0,
		size: 44
	},
	{
		id: "swarm-2",
		top: 30,
		left: -18,
		duration: 3.1,
		delay: .18,
		size: 34
	},
	{
		id: "swarm-3",
		top: 48,
		left: -10,
		duration: 2.9,
		delay: .36,
		size: 40
	},
	{
		id: "swarm-4",
		top: 64,
		left: -16,
		duration: 3.3,
		delay: .54,
		size: 30
	},
	{
		id: "swarm-5",
		top: 22,
		left: -22,
		duration: 3.5,
		delay: .72,
		size: 38
	},
	{
		id: "swarm-6",
		top: 76,
		left: -14,
		duration: 2.8,
		delay: .9,
		size: 32
	},
	{
		id: "swarm-7",
		top: 40,
		left: -20,
		duration: 3.2,
		delay: 1.08,
		size: 36
	},
	{
		id: "swarm-8",
		top: 56,
		left: -12,
		duration: 3,
		delay: 1.26,
		size: 28
	}
];
/**
* A brief swarm of logo-matched bees buzzing across the viewport with a
* honey-gold wash when a customer accepts their quote. Purely decorative and
* non-blocking: it sits behind the page content, ignores pointer events, and
* unmounts itself once the last bee has flown. Reduced-motion users get a
* single static honey-gold glow instead of the flight.
*/
function BeeSwarmCelebration() {
	const [reducedMotion, setReducedMotion] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const query = window.matchMedia("(prefers-reduced-motion: reduce)");
		setReducedMotion(query.matches);
		const onChange = (event) => setReducedMotion(event.matches);
		query.addEventListener("change", onChange);
		return () => query.removeEventListener("change", onChange);
	}, []);
	if (reducedMotion) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-ocid": "track.bee_celebration",
		"aria-hidden": "true",
		className: "pointer-events-none fixed inset-0 z-40 animate-honey-glow bg-gradient-to-b from-accent/25 via-primary/10 to-transparent"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-ocid": "track.bee_celebration",
		"aria-hidden": "true",
		className: "pointer-events-none fixed inset-0 z-40 overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-0 animate-honey-glow bg-gradient-to-b from-accent/30 via-primary/10 to-transparent" }), SWARM_BEES.map((bee) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "absolute animate-bee-swarm",
			style: {
				top: `${bee.top}%`,
				left: `${bee.left}vw`,
				animationDuration: `${bee.duration}s`,
				animationDelay: `${bee.delay}s`
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BeeAccent, {
				className: "h-auto",
				motion: "hover",
				style: { width: `${bee.size}px` }
			})
		}, bee.id))]
	});
}
/**
* Human copy for a `JobError` returned by the emailed-link accept/decline
* calls, so a failed action is explained rather than silently swallowed.
*/
function describeQuoteError(error) {
	if (error && typeof error === "object" && "__kind__" in error) switch (error.__kind__) {
		case "notAuthorized": return "We couldn't verify this job. Re-enter your reference code and try again.";
		case "notFound": return "We couldn't find that job. Double-check your reference code.";
		case "invalidState": return "This quote can no longer be changed in its current state.";
		case "paymentError": return "The payment step failed. Please try again.";
		default: return "Something went wrong. Please try again.";
	}
	return "Something went wrong. Please try again.";
}
function Detail({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "mt-1 break-words text-sm font-medium text-foreground",
			children: value
		})]
	});
}
/**
* The current deposit state line on the payment breakdown.
*
* Names the exact state the customer is in — due, submitted and awaiting
* verification, verified, or not received — and the amount and provider when
* one is known, so the customer never has to guess where their deposit stands.
*/
function DepositStatusLine({ status, amount, method }) {
	const meta = getDepositStatusMeta(status);
	const provider = depositMethodLabel(method);
	const verified = isDepositVerified(status);
	const submitted = isDepositSubmitted(status);
	const rejected = isDepositRejected(status);
	const tone = verified ? "text-success" : submitted ? "text-accent" : rejected ? "text-destructive" : "text-warning";
	/**
	* The verified state reads as "Deposit paid" with the amount received, so the
	* customer sees at a glance that their deposit cleared. Every other state
	* uses the shared deposit-status copy.
	*/
	const label = verified ? "Deposit paid" : meta.label;
	const description = verified ? `We received your ${formatMoney(amount)} deposit — your spot is secured.` : meta.description;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-ocid": "track.deposit_status",
		className: "space-y-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: cn("inline-flex items-center gap-2 text-sm font-semibold", tone),
			children: [
				verified ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 shrink-0" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					"aria-hidden": "true",
					className: "hex-clip size-2.5 bg-current"
				}),
				label,
				provider ? ` · ${provider}` : "",
				verified || submitted ? ` · ${formatMoney(amount)}` : ""
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted-foreground",
			children: description
		})]
	});
}
export { TrackPage };
