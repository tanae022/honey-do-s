import { r as __toESM } from "./rolldown-runtime-SbdDWaPq.js";
import { $ as JobStatus, G as getService, K as cn, L as quoteTotal, V as timestampToDate, Y as DepositStatus, ct as require_react, h as formatReference, m as formatMoney, p as formatDateTime, st as require_jsx_runtime, t as createLucideIcon, y as getQuoteStatusMeta } from "./createLucideIcon-CK3986Sn.js";
import { t as CalendarPlus } from "./calendar-plus-P14BfjVE.js";
import { n as ChevronLeft, t as ChevronRight } from "./chevron-right-DovuHhu0.js";
import { t as FileText } from "./file-text-BqDxuuUp.js";
import { C as AdminChip, D as AdminButton, E as AdminCardHeader, O as AdminPageHeader, T as AdminCard, _ as AdminField, g as AdminEmptyState, k as AdminShell, n as AdminLoadingState, t as AdminErrorState, v as AdminInput, w as AdminStatusBadge, y as AdminSelect } from "./admin-DxTl2OJo.js";
import { t as MapPin } from "./map-pin-DHILvEJZ.js";
import { E as useJobRequests, M as useScheduleAppointment, a as X, c as Phone, o as Wallet, p as CalendarDays } from "./index-DhzL9CXu.js";
import { c as useJobRecords } from "./useAdminSettings-CtJqDOX4.js";
import { l as useCustomers } from "./useCustomers-it81kN8P.js";
import { d as getDepositStatusMeta, u as getAdminStatusMeta } from "./admin-CtzrkfjB.js";
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var CalendarRange = createLucideIcon("calendar-range", [
	["rect", {
		width: "18",
		height: "18",
		x: "3",
		y: "4",
		rx: "2",
		key: "1hopcy"
	}],
	["path", {
		d: "M16 2v4",
		key: "4m81vk"
	}],
	["path", {
		d: "M3 10h18",
		key: "8toen8"
	}],
	["path", {
		d: "M8 2v4",
		key: "1cmpym"
	}],
	["path", {
		d: "M17 14h-6",
		key: "bkmgh3"
	}],
	["path", {
		d: "M13 18H7",
		key: "bb0bb7"
	}],
	["path", {
		d: "M7 14h.01",
		key: "1qa3f1"
	}],
	["path", {
		d: "M17 18h.01",
		key: "1bdyru"
	}]
]);
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Clock = createLucideIcon("clock", [["circle", {
	cx: "12",
	cy: "12",
	r: "10",
	key: "1mglay"
}], ["polyline", {
	points: "12 6 12 12 16 14",
	key: "68esgv"
}]]);
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var ListChecks = createLucideIcon("list-checks", [
	["path", {
		d: "m3 17 2 2 4-4",
		key: "1jhpwq"
	}],
	["path", {
		d: "m3 7 2 2 4-4",
		key: "1obspn"
	}],
	["path", {
		d: "M13 6h8",
		key: "15sg57"
	}],
	["path", {
		d: "M13 12h8",
		key: "h98zly"
	}],
	["path", {
		d: "M13 18h8",
		key: "oe0vm4"
	}]
]);
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Receipt = createLucideIcon("receipt", [
	["path", {
		d: "M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z",
		key: "q3az6g"
	}],
	["path", {
		d: "M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8",
		key: "1h4pet"
	}],
	["path", {
		d: "M12 17.5v-11",
		key: "1jc1ny"
	}]
]);
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var User = createLucideIcon("user", [["path", {
	d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",
	key: "975kel"
}], ["circle", {
	cx: "12",
	cy: "7",
	r: "4",
	key: "17ys0d"
}]]);
// src/pages/admin/Calendar.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var VIEWS = [
	{
		key: "day",
		label: "Day"
	},
	{
		key: "week",
		label: "Week"
	},
	{
		key: "month",
		label: "Month"
	},
	{
		key: "agenda",
		label: "Agenda"
	}
];
var WEEKDAYS = [
	"Sun",
	"Mon",
	"Tue",
	"Wed",
	"Thu",
	"Fri",
	"Sat"
];
/** Whether a deposit has been submitted and verified by the admin. */
function isDepositVerified(deposit) {
	return deposit?.status === DepositStatus.verified;
}
/** Whether a deposit exists and is still waiting on verification. */
function isDepositAwaiting(deposit) {
	return deposit?.status === DepositStatus.submitted || deposit?.status === DepositStatus.pending;
}
/**
* The one status an appointment shows.
*
* A verified deposit is what makes an appointment confirmed and booked. Until
* then the appointment reads as awaiting deposit (or action required once the
* customer says they have paid), never as confirmed.
*/
function entryStatus(jobStatus, deposit) {
	if (jobStatus === JobStatus.cancelled) return getAdminStatusMeta("cancelled");
	if (jobStatus === JobStatus.completed) return getAdminStatusMeta("completed");
	if (jobStatus === JobStatus.inProgress) return getAdminStatusMeta("inProgress");
	if (isDepositVerified(deposit)) return getAdminStatusMeta("confirmed");
	if (deposit?.status === DepositStatus.submitted) return getAdminStatusMeta("actionRequired");
	return getAdminStatusMeta("waiting");
}
/** Build the joined calendar entries from jobs, records and customers. */
function buildEntries(jobs, records, customers) {
	const recordByJob = /* @__PURE__ */ new Map();
	for (const record of records) recordByJob.set(record.jobRequestId.toString(), record);
	const customerByName = /* @__PURE__ */ new Map();
	for (const customer of customers) customerByName.set(customer.fullName.trim().toLowerCase(), customer);
	const entries = [];
	for (const job of jobs) {
		if (!job.appointment) continue;
		const record = recordByJob.get(job.id.toString()) ?? null;
		const deposit = job.deposit ?? record?.deposit ?? null;
		const quote = job.quote ?? record?.quote ?? null;
		const customer = customerByName.get(job.customerName.trim().toLowerCase()) ?? null;
		const verified = isDepositVerified(deposit);
		entries.push({
			key: job.id.toString(),
			jobId: job.id,
			referenceCode: job.referenceCode,
			customerName: job.customerName,
			customerId: customer?.id ?? null,
			customer,
			category: job.category,
			jobStatus: job.status,
			scheduledAt: job.appointment.scheduledAt,
			appointmentConfirmed: job.appointment.confirmed,
			quote,
			deposit,
			jobRecord: record,
			depositVerified: verified,
			awaitingDeposit: !verified && isDepositAwaiting(deposit),
			status: entryStatus(job.status, deposit)
		});
	}
	return entries.sort((a, b) => a.scheduledAt === b.scheduledAt ? 0 : a.scheduledAt > b.scheduledAt ? 1 : -1);
}
function startOfDay(date) {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
function addDays(date, days) {
	const next = new Date(date);
	next.setDate(next.getDate() + days);
	return next;
}
/** Sunday-based start of the week containing `date`. */
function startOfWeek(date) {
	return addDays(startOfDay(date), -date.getDay());
}
function sameDay(a, b) {
	return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function dayKey(date) {
	return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}
function formatTime(timestamp) {
	const date = timestampToDate(timestamp);
	if (!date) return "Time to confirm";
	return date.toLocaleTimeString(void 0, {
		hour: "numeric",
		minute: "2-digit"
	});
}
function formatDayHeading(date) {
	return date.toLocaleDateString(void 0, {
		weekday: "long",
		month: "long",
		day: "numeric",
		year: "numeric"
	});
}
function formatMonthHeading(date) {
	return date.toLocaleDateString(void 0, {
		month: "long",
		year: "numeric"
	});
}
/**
* The calendar view the dashboard's count link asked for, if any.
*
* Read straight from `window.location.search` so the link works on the plain
* `/admin/calendar` route without a `validateSearch` contract. "today" opens
* the day view; "upcoming" opens the agenda.
*/
function initialCalendarView() {
	if (typeof window === "undefined") return "month";
	const range = new URLSearchParams(window.location.search).get("range");
	if (range === "today") return "day";
	if (range === "upcoming") return "agenda";
	return "month";
}
/** Whether the dashboard's "+ New Appointment" quick action opened this page. */
function openedForNewAppointment() {
	if (typeof window === "undefined") return false;
	return new URLSearchParams(window.location.search).get("new") === "1";
}
/**
* Admin Calendar page.
*
* Day, Week, Month and Agenda views over every scheduled appointment. Each
* appointment is joined to its customer, request, quote, deposit and job, and
* only reads as confirmed and booked once its required deposit has been
* submitted and verified.
*/
function CalendarPage() {
	const jobsQuery = useJobRequests();
	const recordsQuery = useJobRecords();
	const customersQuery = useCustomers();
	const [view, setView] = (0, import_react.useState)(initialCalendarView);
	const [anchor, setAnchor] = (0, import_react.useState)(() => startOfDay(/* @__PURE__ */ new Date()));
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [creating, setCreating] = (0, import_react.useState)(openedForNewAppointment);
	const jobs = jobsQuery.data ?? [];
	const records = recordsQuery.data ?? [];
	const customers = customersQuery.data ?? [];
	const entries = (0, import_react.useMemo)(() => buildEntries(jobs, records, customers), [
		jobs,
		records,
		customers
	]);
	const isLoading = jobsQuery.isLoading || recordsQuery.isLoading || customersQuery.isLoading;
	const isError = jobsQuery.isError || recordsQuery.isError;
	const confirmedCount = entries.filter((entry) => entry.depositVerified).length;
	const awaitingCount = entries.filter((entry) => entry.awaitingDeposit).length;
	const step = (direction) => {
		setAnchor((current) => {
			if (view === "day") return addDays(current, direction);
			if (view === "week") return addDays(current, direction * 7);
			if (view === "month") return new Date(current.getFullYear(), current.getMonth() + direction, 1);
			return addDays(current, direction * 7);
		});
	};
	const periodLabel = (0, import_react.useMemo)(() => {
		if (view === "day") return formatDayHeading(anchor);
		if (view === "week") {
			const start = startOfWeek(anchor);
			const end = addDays(start, 6);
			return `${start.toLocaleDateString(void 0, {
				month: "short",
				day: "numeric"
			})} – ${end.toLocaleDateString(void 0, {
				month: "short",
				day: "numeric",
				year: "numeric"
			})}`;
		}
		if (view === "month") return formatMonthHeading(anchor);
		return "All upcoming appointments";
	}, [view, anchor]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
			eyebrow: "Admin",
			title: "Calendar",
			description: "Every scheduled appointment, linked to its customer, request, quote, deposit and job.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminButton, {
				"data-ocid": "admin.calendar.new_appointment_button",
				onClick: () => setCreating(true),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarPlus, { className: "size-4" }), "New appointment"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 grid gap-3 sm:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryTile, {
					"data-ocid": "admin.calendar.summary.total",
					label: "Appointments",
					value: String(entries.length),
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "size-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryTile, {
					"data-ocid": "admin.calendar.summary.confirmed",
					label: "Confirmed & booked",
					value: String(confirmedCount),
					hint: "Deposit verified",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListChecks, { className: "size-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryTile, {
					"data-ocid": "admin.calendar.summary.awaiting",
					label: "Awaiting deposit",
					value: String(awaitingCount),
					hint: "Not yet confirmed",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "size-5" })
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminCard, {
			className: "mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					role: "tablist",
					"aria-label": "Calendar view",
					"data-ocid": "admin.calendar.view_tabs",
					className: "flex flex-wrap gap-2",
					children: VIEWS.map((option) => {
						const active = view === option.key;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							role: "tab",
							"aria-selected": active,
							"data-ocid": `admin.calendar.view_tab.${option.key}`,
							onClick: () => setView(option.key),
							className: cn("inline-flex min-h-11 items-center justify-center rounded-lg border px-4 text-base font-semibold transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(var(--admin-ring))] focus-visible:ring-offset-2", active ? "border-transparent bg-[oklch(var(--admin-primary))] text-[oklch(var(--admin-primary-foreground))]" : "border-[oklch(var(--admin-border-strong))] bg-[oklch(var(--admin-surface))] text-[oklch(var(--admin-foreground))] hover:bg-[oklch(var(--admin-surface-alt))]"),
							children: option.label
						}, option.key);
					})
				}), view !== "agenda" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-2 sm:justify-end",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminButton, {
							variant: "secondary",
							size: "sm",
							"data-ocid": "admin.calendar.prev_button",
							"aria-label": "Previous period",
							onClick: () => step(-1),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "sr-only sm:not-sr-only",
								children: "Previous"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminButton, {
							variant: "secondary",
							size: "sm",
							"data-ocid": "admin.calendar.today_button",
							onClick: () => setAnchor(startOfDay(/* @__PURE__ */ new Date())),
							children: "Today"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminButton, {
							variant: "secondary",
							size: "sm",
							"data-ocid": "admin.calendar.next_button",
							"aria-label": "Next period",
							onClick: () => step(1),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "sr-only sm:not-sr-only",
								children: "Next"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })]
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				"data-ocid": "admin.calendar.period_label",
				className: "mt-4 text-lg font-bold text-[oklch(var(--admin-foreground))]",
				children: periodLabel
			})]
		}),
		isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminCard, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLoadingState, {
			"data-ocid": "admin.calendar.loading_state",
			label: "Loading the calendar"
		}) }) : isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminErrorState, {
			"data-ocid": "admin.calendar.error_state",
			message: "We couldn't load the calendar. Please try again.",
			onRetry: () => {
				jobsQuery.refetch();
				recordsQuery.refetch();
			}
		}) : entries.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminEmptyState, {
			"data-ocid": "admin.calendar.empty_state",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "size-6" }),
			title: "No appointments yet",
			description: "Scheduled visits appear here once a request has an appointment time."
		}) : view === "month" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonthView, {
			anchor,
			entries,
			onSelect: setSelected,
			onPickDay: (date) => {
				setAnchor(date);
				setView("day");
			}
		}) : view === "week" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WeekView, {
			anchor,
			entries,
			onSelect: setSelected
		}) : view === "day" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DayView, {
			anchor,
			entries,
			onSelect: setSelected
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AgendaView, {
			entries,
			onSelect: setSelected
		}),
		selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppointmentDetail, {
			entry: selected,
			onClose: () => setSelected(null)
		}),
		creating && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewAppointmentDialog, {
			jobs,
			onClose: () => setCreating(false)
		})
	] });
}
/** Whether a job is still open to receive a new appointment. */
function isSchedulable(job) {
	return job.status === JobStatus.requested || job.status === JobStatus.quoted || job.status === JobStatus.scheduled;
}
/** A `YYYY-MM-DD` + `HH:MM` pair → a nanosecond timestamp, or null. */
function dateTimeToTimestamp(dateValue, timeValue) {
	if (!dateValue) return null;
	const date = /* @__PURE__ */ new Date(`${dateValue}T${timeValue || "09:00"}:00`);
	if (Number.isNaN(date.getTime())) return null;
	return BigInt(date.getTime()) * 1000000n;
}
/**
* Create an appointment for an existing request.
*
* The dashboard's "+ New Appointment" quick action opens this dialog directly.
* The admin picks a request that is still open to scheduling and a date and
* time, and the appointment is saved against that request.
*/
function NewAppointmentDialog({ jobs, onClose }) {
	const scheduleAppointment = useScheduleAppointment();
	const [jobId, setJobId] = (0, import_react.useState)("");
	const [dateValue, setDateValue] = (0, import_react.useState)("");
	const [timeValue, setTimeValue] = (0, import_react.useState)("09:00");
	const [error, setError] = (0, import_react.useState)(null);
	const schedulable = (0, import_react.useMemo)(() => jobs.filter(isSchedulable), [jobs]);
	const handleSave = () => {
		setError(null);
		const job = schedulable.find((item) => item.id.toString() === jobId);
		if (!job) {
			setError("Choose the request this appointment is for.");
			return;
		}
		const scheduledAt = dateTimeToTimestamp(dateValue, timeValue);
		if (scheduledAt === null) {
			setError("Choose a valid date and time for the visit.");
			return;
		}
		scheduleAppointment.mutate({
			id: job.id,
			scheduledAt
		}, {
			onSuccess: (result) => {
				if (result.__kind__ === "ok") {
					onClose();
					return;
				}
				setError(result.err.__kind__ === "invalidState" ? result.err.invalidState : "We couldn't save that appointment. Please try again.");
			},
			onError: () => setError("We couldn't save that appointment. Please try again.")
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dialog", {
		open: true,
		"data-ocid": "admin.calendar.new_appointment_modal",
		"aria-labelledby": "admin-calendar-new-appointment-title",
		className: "fixed inset-0 z-50 m-0 flex h-full max-h-none w-full max-w-none items-center justify-center border-0 bg-transparent p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-label": "Close dialog",
			"data-ocid": "admin.calendar.new_appointment_dismiss_button",
			onClick: onClose,
			className: "absolute inset-0 cursor-default bg-[oklch(0.2_0.012_260_/_0.55)]"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "admin-shell relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface))] p-5 shadow-admin sm:p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-5 flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						id: "admin-calendar-new-appointment-title",
						className: "text-xl font-bold text-[oklch(var(--admin-foreground))]",
						children: "New appointment"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-base text-[oklch(var(--admin-muted-foreground))]",
						children: "Schedule a visit for an open request."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"data-ocid": "admin.calendar.new_appointment_close_button",
					"aria-label": "Close",
					onClick: onClose,
					className: "flex size-10 shrink-0 items-center justify-center rounded-full border border-[oklch(var(--admin-border-strong))] bg-[oklch(var(--admin-surface))] text-[oklch(var(--admin-foreground))] transition-smooth hover:bg-[oklch(var(--admin-surface-alt))]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
				})]
			}), schedulable.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminEmptyState, {
				"data-ocid": "admin.calendar.new_appointment_empty_state",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarPlus, { className: "size-6" }),
				title: "No requests ready to schedule",
				description: "A request appears here once it is new, quoted or already scheduled."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
						label: "Request",
						htmlFor: "calendar-new-job",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminSelect, {
							id: "calendar-new-job",
							"data-ocid": "admin.calendar.new_appointment.job_select",
							value: jobId,
							onChange: (event) => {
								setJobId(event.target.value);
								setError(null);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "Choose a request…"
							}), schedulable.map((job) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: job.id.toString(),
								children: [
									job.customerName,
									" · ",
									getService(job.category).label,
									" ·",
									" ",
									formatReference(job.referenceCode)
								]
							}, job.id.toString()))]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
							label: "Date",
							htmlFor: "calendar-new-date",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminInput, {
								id: "calendar-new-date",
								"data-ocid": "admin.calendar.new_appointment.date_input",
								type: "date",
								value: dateValue,
								onChange: (event) => {
									setDateValue(event.target.value);
									setError(null);
								}
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
							label: "Start time",
							htmlFor: "calendar-new-time",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminInput, {
								id: "calendar-new-time",
								"data-ocid": "admin.calendar.new_appointment.time_input",
								type: "time",
								value: timeValue,
								onChange: (event) => {
									setTimeValue(event.target.value);
									setError(null);
								}
							})
						})]
					}),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						"data-ocid": "admin.calendar.new_appointment.error_state",
						role: "alert",
						className: "rounded-xl border border-[oklch(var(--admin-status-action))] bg-[oklch(var(--admin-surface))] px-4 py-3 text-base font-medium text-[oklch(var(--admin-status-action))]",
						children: error
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col-reverse gap-3 sm:flex-row sm:justify-end",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminButton, {
							variant: "secondary",
							"data-ocid": "admin.calendar.new_appointment.cancel_button",
							onClick: onClose,
							disabled: scheduleAppointment.isPending,
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminButton, {
							"data-ocid": "admin.calendar.new_appointment.submit_button",
							onClick: handleSave,
							disabled: scheduleAppointment.isPending,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarPlus, { className: "size-4" }), scheduleAppointment.isPending ? "Saving…" : "Save appointment"]
						})]
					})
				]
			})]
		})]
	});
}
function SummaryTile({ label, value, hint, icon, ...rest }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "admin-card p-4 sm:p-5",
		...rest,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "admin-label",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					"aria-hidden": "true",
					className: "flex size-9 shrink-0 items-center justify-center rounded-lg bg-[oklch(var(--admin-surface-alt))] text-[oklch(var(--admin-primary))]",
					children: icon
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 font-mono text-2xl font-bold tracking-tight text-[oklch(var(--admin-foreground))] sm:text-3xl",
				children: value
			}),
			hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-[oklch(var(--admin-muted-foreground))]",
				children: hint
			})
		]
	});
}
function AppointmentChip({ entry, onSelect, compact = false, ...rest }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: () => onSelect(entry),
		className: cn("w-full rounded-lg border border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface))] text-left transition-smooth hover:border-[oklch(var(--admin-primary))] hover:bg-[oklch(var(--admin-surface-alt))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(var(--admin-ring))] focus-visible:ring-offset-2", compact ? "px-2 py-1.5" : "px-3 py-2.5"),
		...rest,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "flex items-center justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("min-w-0 truncate font-semibold text-[oklch(var(--admin-foreground))]", compact ? "text-xs" : "text-base"),
				children: entry.customerName
			}), !compact && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "shrink-0 font-mono text-xs text-[oklch(var(--admin-muted-foreground))]",
				children: formatTime(entry.scheduledAt)
			})]
		}), !compact && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "mt-1 flex flex-wrap items-center gap-1.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminStatusBadge, {
				tone: entry.status.tone,
				label: entry.status.label,
				dot: true
			}), entry.awaitingDeposit && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminChip, {
				className: "text-xs",
				children: "Awaiting deposit"
			})]
		})]
	});
}
function MonthView({ anchor, entries, onSelect, onPickDay }) {
	const { cells, byDay } = (0, import_react.useMemo)(() => {
		const year = anchor.getFullYear();
		const month = anchor.getMonth();
		const firstWeekday = new Date(year, month, 1).getDay();
		const daysInMonth = new Date(year, month + 1, 0).getDate();
		const map = /* @__PURE__ */ new Map();
		for (const entry of entries) {
			const at = timestampToDate(entry.scheduledAt);
			if (!at || at.getFullYear() !== year || at.getMonth() !== month) continue;
			const key = dayKey(at);
			const list = map.get(key) ?? [];
			list.push(entry);
			map.set(key, list);
		}
		const grid = [];
		for (let i = 0; i < firstWeekday; i += 1) grid.push({
			id: `lead-${i}`,
			date: null
		});
		for (let day = 1; day <= daysInMonth; day += 1) {
			const date = new Date(year, month, day);
			grid.push({
				id: dayKey(date),
				date
			});
		}
		let trail = 0;
		while (grid.length % 7 !== 0) {
			grid.push({
				id: `trail-${trail}`,
				date: null
			});
			trail += 1;
		}
		return {
			cells: grid,
			byDay: map
		};
	}, [anchor, entries]);
	const today = startOfDay(/* @__PURE__ */ new Date());
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminCard, {
		"data-ocid": "admin.calendar.month_view",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-7 gap-1.5",
			children: [WEEKDAYS.map((day) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pb-1 text-center text-xs font-bold uppercase tracking-wide text-[oklch(var(--admin-muted-foreground))]",
				children: day
			}, day)), cells.map((cell) => {
				const { date } = cell;
				if (!date) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					"aria-hidden": "true",
					className: "min-h-24 rounded-lg border border-transparent"
				}, cell.id);
				const dayEntries = byDay.get(dayKey(date)) ?? [];
				const isToday = sameDay(date, today);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					"data-ocid": `admin.calendar.month_day.${date.getDate()}`,
					className: cn("flex min-h-24 flex-col gap-1 rounded-lg border p-1.5", isToday ? "border-[oklch(var(--admin-primary))] bg-[oklch(var(--admin-surface-alt))]" : "border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface))]"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => onPickDay(date),
						"aria-label": `Open ${formatDayHeading(date)}`,
						className: cn("self-start rounded px-1 font-mono text-xs font-bold transition-smooth hover:bg-[oklch(var(--admin-surface-alt))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(var(--admin-ring))]", isToday ? "text-[oklch(var(--admin-primary))]" : "text-[oklch(var(--admin-muted-foreground))]"),
						children: date.getDate()
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-1",
						children: [dayEntries.slice(0, 2).map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppointmentChip, {
							entry,
							onSelect,
							compact: true,
							"data-ocid": `admin.calendar.month_item.${date.getDate()}.${entry.key}`
						}, entry.key)), dayEntries.length > 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "px-1 text-xs font-semibold text-[oklch(var(--admin-muted-foreground))]",
							children: [
								"+",
								dayEntries.length - 2,
								" more"
							]
						})]
					})]
				}, cell.id);
			})]
		})
	});
}
function WeekView({ anchor, entries, onSelect }) {
	const days = (0, import_react.useMemo)(() => {
		const start = startOfWeek(anchor);
		return Array.from({ length: 7 }, (_, i) => addDays(start, i));
	}, [anchor]);
	const byDay = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const entry of entries) {
			const at = timestampToDate(entry.scheduledAt);
			if (!at) continue;
			const key = dayKey(at);
			const list = map.get(key) ?? [];
			list.push(entry);
			map.set(key, list);
		}
		return map;
	}, [entries]);
	const today = startOfDay(/* @__PURE__ */ new Date());
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-ocid": "admin.calendar.week_view",
		className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-7",
		children: days.map((date) => {
			const dayEntries = byDay.get(dayKey(date)) ?? [];
			const isToday = sameDay(date, today);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminCard, {
				"data-ocid": `admin.calendar.week_day.${date.getDay()}`,
				className: cn("flex flex-col gap-2 p-3 sm:p-4", isToday && "ring-2 ring-[oklch(var(--admin-primary))]"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-baseline justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-bold text-[oklch(var(--admin-foreground))]",
						children: date.toLocaleDateString(void 0, { weekday: "short" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-sm text-[oklch(var(--admin-muted-foreground))]",
						children: date.getDate()
					})]
				}), dayEntries.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-[oklch(var(--admin-muted-foreground))]",
					children: "No visits"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col gap-2",
					children: dayEntries.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppointmentChip, {
						entry,
						onSelect,
						"data-ocid": `admin.calendar.week_item.${date.getDay()}.${entry.key}`
					}, entry.key))
				})]
			}, dayKey(date));
		})
	});
}
function DayView({ anchor, entries, onSelect }) {
	const dayEntries = (0, import_react.useMemo)(() => entries.filter((entry) => {
		const at = timestampToDate(entry.scheduledAt);
		return at ? sameDay(at, anchor) : false;
	}), [entries, anchor]);
	if (dayEntries.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminEmptyState, {
		"data-ocid": "admin.calendar.day_empty_state",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "size-6" }),
		title: "Nothing scheduled this day",
		description: "Pick another day, or switch to Agenda to see every upcoming visit."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminCard, {
		"data-ocid": "admin.calendar.day_view",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminCardHeader, {
			title: formatDayHeading(anchor),
			description: `${dayEntries.length} ${dayEntries.length === 1 ? "appointment" : "appointments"}`
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "flex flex-col gap-3",
			children: dayEntries.map((entry, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppointmentChip, {
				entry,
				onSelect,
				"data-ocid": `admin.calendar.day_item.${index + 1}`
			}) }, entry.key))
		})]
	});
}
function AgendaView({ entries, onSelect }) {
	const groups = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const entry of entries) {
			const at = timestampToDate(entry.scheduledAt);
			if (!at) continue;
			const key = dayKey(at);
			const group = map.get(key) ?? {
				date: startOfDay(at),
				entries: []
			};
			group.entries.push(entry);
			map.set(key, group);
		}
		return [...map.values()].sort((a, b) => a.date.getTime() - b.date.getTime());
	}, [entries]);
	if (groups.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminEmptyState, {
		"data-ocid": "admin.calendar.agenda_empty_state",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarRange, { className: "size-6" }),
		title: "No upcoming appointments",
		description: "Scheduled visits appear here grouped by day."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-ocid": "admin.calendar.agenda_view",
		className: "flex flex-col gap-5",
		children: groups.map((group, groupIndex) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminCardHeader, {
			title: formatDayHeading(group.date),
			description: `${group.entries.length} ${group.entries.length === 1 ? "appointment" : "appointments"}`
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "flex flex-col gap-3",
			children: group.entries.map((entry, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppointmentChip, {
				entry,
				onSelect,
				"data-ocid": `admin.calendar.agenda_item.${groupIndex + 1}.${index + 1}`
			}) }, entry.key))
		})] }, dayKey(group.date)))
	});
}
function DetailRow({ icon, label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-start gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			"aria-hidden": "true",
			className: "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-[oklch(var(--admin-surface-alt))] text-[oklch(var(--admin-primary))]",
			children: icon
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "admin-label",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-0.5 text-base text-[oklch(var(--admin-foreground))]",
				children
			})]
		})]
	});
}
function AppointmentDetail({ entry, onClose }) {
	const service = getService(entry.category);
	const depositMeta = entry.deposit ? getDepositStatusMeta(entry.deposit.status) : null;
	const quote = entry.quote;
	const quoteMeta = quote ? getQuoteStatusMeta(quote.status) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-ocid": "admin.calendar.detail_dialog",
		className: "fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-label": "Close appointment details",
			"data-ocid": "admin.calendar.detail_backdrop",
			onClick: onClose,
			className: "absolute inset-0 cursor-default"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dialog", {
			open: true,
			"aria-label": `Appointment for ${entry.customerName}`,
			className: "admin-shell fixed inset-0 z-10 m-0 flex h-full max-h-none w-full max-w-none items-end justify-center border-0 bg-transparent p-0 sm:items-center sm:p-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10 max-h-[90dvh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface))] p-5 shadow-xl sm:rounded-2xl sm:p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "admin-label",
									children: "Appointment"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-1 text-xl font-bold text-[oklch(var(--admin-foreground))] sm:text-2xl",
									children: entry.customerName
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 font-mono text-sm text-[oklch(var(--admin-muted-foreground))]",
									children: [
										formatReference(entry.referenceCode),
										" · ",
										service.label
									]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminButton, {
							variant: "secondary",
							size: "sm",
							"data-ocid": "admin.calendar.detail_close_button",
							onClick: onClose,
							children: "Close"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 flex flex-wrap items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminStatusBadge, {
							tone: entry.status.tone,
							label: entry.status.label,
							dot: true,
							"data-ocid": "admin.calendar.detail_status"
						}), entry.depositVerified ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminChip, {
							"data-ocid": "admin.calendar.detail_booked_chip",
							children: "Confirmed & booked"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminChip, {
							"data-ocid": "admin.calendar.detail_awaiting_chip",
							children: "Awaiting deposit"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-4" }),
								label: "Scheduled",
								children: formatDateTime(entry.scheduledAt)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "size-4" }),
								label: "Customer",
								children: entry.customerId !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: `/admin/customers/${entry.customerId.toString()}`,
									"data-ocid": "admin.calendar.detail_customer_link",
									className: "font-semibold text-[oklch(var(--admin-primary))] underline-offset-4 hover:underline",
									children: entry.customerName
								}) : entry.customerName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-4" }),
								label: "Request",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono",
									children: formatReference(entry.referenceCode)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-4" }),
								label: "Service address",
								children: entry.customer?.serviceAddress ?? "Address on the customer record"
							}),
							entry.customer?.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-4" }),
								label: "Phone",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: `tel:${entry.customer.phone}`,
									className: "font-semibold text-[oklch(var(--admin-primary))] underline-offset-4 hover:underline",
									children: entry.customer.phone
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "admin-card-alt rounded-xl p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "admin-label",
								children: "Quote"
							}), quote && quoteMeta ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex flex-col gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminStatusBadge, {
										tone: "approved",
										label: quoteMeta.label,
										dot: true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-mono text-lg font-bold text-[oklch(var(--admin-foreground))]",
										children: formatMoney(quoteTotal(quote))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-[oklch(var(--admin-muted-foreground))]",
										children: quote.quoteNumber || "Quote on file"
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-base text-[oklch(var(--admin-muted-foreground))]",
								children: "No quote attached yet."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "admin-card-alt rounded-xl p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "admin-label",
								children: "Deposit"
							}), entry.deposit && depositMeta ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex flex-col gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminStatusBadge, {
										tone: depositMeta.tone,
										label: depositMeta.label,
										dot: true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-mono text-lg font-bold text-[oklch(var(--admin-foreground))]",
										children: formatMoney(entry.deposit.amount)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-[oklch(var(--admin-muted-foreground))]",
										children: depositMeta.description
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-base text-[oklch(var(--admin-muted-foreground))]",
								children: "No deposit required yet."
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "admin-label",
							children: "Job"
						}), entry.jobRecord ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex flex-wrap items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminStatusBadge, {
								tone: entry.status.tone,
								label: entry.status.label,
								dot: true
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminChip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, {
								className: "size-3.5",
								"aria-hidden": "true"
							}), entry.jobRecord.remainingBalance > 0n ? `${formatMoney(entry.jobRecord.remainingBalance)} remaining` : "Balance settled"] })]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-base text-[oklch(var(--admin-muted-foreground))]",
							children: "No job record created yet — this appointment is still a request."
						})]
					})
				]
			})
		})]
	});
}
export { CalendarPage };
