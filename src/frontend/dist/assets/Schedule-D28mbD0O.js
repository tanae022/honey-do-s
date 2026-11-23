import { r as __toESM } from "./rolldown-runtime-SbdDWaPq.js";
import { i as useMutation, r as useInternetIdentity, s as useQueryClient, t as useActor } from "./dist-DCUbDtYL.js";
import { $ as JobStatus, G as getService, K as cn, V as timestampToDate, W as SERVICES, at as createActor, b as getStatusMeta, ct as require_react, h as formatReference, it as ServiceCategory, p as formatDateTime, st as require_jsx_runtime } from "./createLucideIcon-CK3986Sn.js";
import { t as CalendarClock } from "./calendar-clock-BKRV_BaF.js";
import { t as CalendarPlus } from "./calendar-plus-P14BfjVE.js";
import { t as Check } from "./check-qhjPHsNw.js";
import { n as ChevronLeft, t as ChevronRight } from "./chevron-right-DovuHhu0.js";
import { a as ShoppingBag, c as Lightbulb, i as Sparkles, l as Flower2, n as Wrench, o as PaintRoller, r as Sprout, s as Package, t as HexTile } from "./HexTile-CHJQF8UZ.js";
import { t as ShieldAlert } from "./shield-alert-CwcHCNy3.js";
import { E as useJobRequests, M as useScheduleAppointment, U as HoneyLoader, t as HoneyButton, w as useIsAdmin } from "./index-DhzL9CXu.js";
import { t as Label } from "./label-DQWmTWtr.js";
import { l as useCustomers } from "./useCustomers-it81kN8P.js";
import { t as HoneyCard } from "./HoneyCard-Dp51lMsB.js";
import { t as Input } from "./input-C4Zv5zIi.js";
import { t as HexStatus } from "./HexStatus-VnvmG7KX.js";
// src/pages/Schedule.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var ICONS = {
	Wrench,
	PaintRoller,
	Sprout,
	Flower2,
	Sparkles,
	Package,
	ShoppingBag,
	Lightbulb
};
var WEEKDAYS = [
	"Sun",
	"Mon",
	"Tue",
	"Wed",
	"Thu",
	"Fri",
	"Sat"
];
/** Motoko Time.now() is nanoseconds; a datetime-local value is local ms. */
function localInputToTimestamp(value) {
	if (value.trim().length === 0) return null;
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return null;
	return BigInt(date.getTime()) * 1000000n;
}
/** Whether a job is still open to receive a new appointment. */
function isSchedulable(job) {
	return job.status === JobStatus.requested || job.status === JobStatus.quoted || job.status === JobStatus.scheduled;
}
/**
* Admin scheduling area.
*
* A month calendar of every appointment plus six status lists — upcoming
* appointments, pending requests, approved appointments, jobs in progress,
* completed and cancelled work. The scheduling form links each new appointment
* to the chosen customer's record so it also appears on their profile.
*/
function SchedulePage() {
	const { data: isAdmin, isLoading: roleLoading } = useIsAdmin();
	const { login, loginStatus } = useInternetIdentity();
	if (roleLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "px-5 py-16 sm:px-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoneyCard, {
			className: "mx-auto max-w-md",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoneyLoader, {
				"data-ocid": "schedule.loading_state",
				label: "Checking access"
			})
		})
	});
	if (!isAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "animate-page-enter px-5 py-16 sm:px-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(HoneyCard, {
			className: "mx-auto max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "relative mx-auto flex size-14 items-center justify-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						"aria-hidden": "true",
						className: "hex-clip absolute inset-0 bg-gradient-to-b from-primary/50 to-primary/10"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "relative z-10 size-6 text-primary" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-outline-black-strong mt-5 font-display text-2xl font-bold text-foreground",
					children: "Admin access required"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-outline-black mt-3 text-sm text-muted-foreground",
					children: "Sign in with an administrator identity to open the schedule."
				}),
				loginStatus !== "success" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"data-ocid": "schedule.login_button",
					onClick: () => login(),
					className: "honey-surface text-outline-black mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-accent/40 px-6 font-semibold text-primary-foreground transition-smooth hover:-translate-y-0.5",
					children: "Sign in"
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScheduleBody, {});
}
function ScheduleBody() {
	const jobsQuery = useJobRequests();
	const jobs = jobsQuery.data ?? [];
	const groups = (0, import_react.useMemo)(() => {
		const now = Date.now();
		const upcoming = [];
		const pending = [];
		const approved = [];
		const inProgress = [];
		const completed = [];
		const cancelled = [];
		for (const job of jobs) {
			if (job.status === JobStatus.cancelled) {
				cancelled.push(job);
				continue;
			}
			if (job.status === JobStatus.completed) {
				completed.push(job);
				continue;
			}
			if (job.status === JobStatus.inProgress) {
				inProgress.push(job);
				continue;
			}
			if (job.status === JobStatus.requested) {
				pending.push(job);
				continue;
			}
			if (job.status === JobStatus.scheduled) {
				approved.push(job);
				const at = job.appointment ? timestampToDate(job.appointment.scheduledAt) : null;
				if (at && at.getTime() >= now) upcoming.push(job);
				continue;
			}
			if (job.status === JobStatus.quoted) pending.push(job);
		}
		upcoming.sort((a, b) => (a.appointment?.scheduledAt ?? 0n) < (b.appointment?.scheduledAt ?? 0n) ? -1 : 1);
		return {
			upcoming,
			pending,
			approved,
			inProgress,
			completed,
			cancelled
		};
	}, [jobs]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-ocid": "schedule.page",
		className: "animate-page-enter mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold uppercase tracking-[0.22em] text-primary",
					children: "Admin"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-outline-black-strong mt-2 font-display text-3xl font-bold text-gold-gradient sm:text-4xl",
					children: "Schedule"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-outline-black mt-2 max-w-2xl text-sm text-muted-foreground",
					children: "Upcoming appointments, pending requests, approved visits, jobs in progress, completed and cancelled work — all linked to the right customer."
				})
			]
		}), jobsQuery.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoneyCard, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoneyLoader, {
			"data-ocid": "schedule.board_loading_state",
			label: "Loading the schedule"
		}) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScheduleForm, { jobs }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarView, { jobs }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusLists, { groups })
			]
		})]
	});
}
function ScheduleForm({ jobs }) {
	const customers = useCustomers().data ?? [];
	const scheduleAppointment = useScheduleAppointment();
	const queryClient = useQueryClient();
	const { actor } = useActor(createActor);
	const createJob = useMutation({
		mutationFn: async (vars) => {
			if (!actor) throw new Error("Backend is not ready");
			return actor.createJobForCustomer(vars.customerId, vars.input);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["jobs"] });
			queryClient.invalidateQueries({ queryKey: ["customers"] });
		}
	});
	const [customerId, setCustomerId] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)(ServiceCategory.fixIt);
	const [when, setWhen] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [saved, setSaved] = (0, import_react.useState)(null);
	const selectedCustomer = (0, import_react.useMemo)(() => customers.find((c) => c.id.toString() === customerId) ?? null, [customers, customerId]);
	const pending = scheduleAppointment.isPending || createJob.isPending;
	const handleSave = () => {
		if (!selectedCustomer) {
			setError("Choose the customer this appointment is for.");
			return;
		}
		const scheduledAt = localInputToTimestamp(when);
		if (scheduledAt === null) {
			setError("Enter the date and time for the visit.");
			return;
		}
		setError(null);
		setSaved(null);
		const existing = jobs.find((job) => job.customerName === selectedCustomer.fullName && isSchedulable(job));
		const finish = (referenceCode) => {
			setSaved(referenceCode);
			setWhen("");
		};
		if (existing) {
			scheduleAppointment.mutate({
				id: existing.id,
				scheduledAt
			}, {
				onSuccess: (result) => {
					if (result.__kind__ === "ok") finish(result.ok.referenceCode);
					else setError(result.err.__kind__ === "invalidState" ? result.err.invalidState : "We couldn't save that appointment. Please try again.");
				},
				onError: () => setError("We couldn't save that appointment. Please try again.")
			});
			return;
		}
		createJob.mutate({
			customerId: selectedCustomer.id,
			input: {
				customerName: selectedCustomer.fullName,
				email: selectedCustomer.email,
				phone: selectedCustomer.phone,
				preferredTiming: formatDateTime(scheduledAt),
				description: `${getService(category).label} visit scheduled from the admin schedule.`,
				photoIds: [],
				category,
				packageInterest: false,
				ownParts: false
			}
		}, {
			onSuccess: (result) => {
				if (result.__kind__ !== "ok") {
					setError(result.err.__kind__ === "invalidState" ? result.err.invalidState : "We couldn't create that appointment. Please try again.");
					return;
				}
				scheduleAppointment.mutate({
					id: result.ok.id,
					scheduledAt
				}, {
					onSuccess: (scheduled) => {
						if (scheduled.__kind__ === "ok") finish(scheduled.ok.referenceCode);
						else setError("The request was created but the time could not be saved.");
					},
					onError: () => setError("The request was created but the time could not be saved.")
				});
			},
			onError: () => setError("We couldn't create that appointment. Please try again.")
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(HoneyCard, {
		"data-ocid": "schedule.form_panel",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					"aria-hidden": "true",
					className: "hex-clip flex size-10 items-center justify-center bg-primary/15 text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarPlus, { className: "size-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-outline-black-strong font-display text-lg font-semibold text-foreground",
					children: "Schedule an appointment"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-outline-black text-sm text-muted-foreground",
					children: "Pick a customer, choose the service, then set the date and time."
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-5 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "schedule-customer",
							children: "Customer"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							id: "schedule-customer",
							"data-ocid": "schedule.customer_select",
							value: customerId,
							onChange: (event) => {
								setCustomerId(event.target.value);
								setError(null);
								setSaved(null);
							},
							className: "form-field mt-2 min-h-12 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "Choose a customer…"
							}), customers.map((customer) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: customer.id.toString(),
								children: customer.fullName
							}, customer.id.toString()))]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "schedule-when",
							children: "Date and time"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "schedule-when",
							type: "datetime-local",
							"data-ocid": "schedule.datetime_input",
							value: when,
							onChange: (event) => {
								setWhen(event.target.value);
								setError(null);
								setSaved(null);
							},
							className: "mt-2 min-h-12"
						})] }),
						selectedCustomer && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							"data-ocid": "schedule.customer_summary",
							className: "honey-panel-raised rounded-xl px-4 py-3 text-sm text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-foreground",
									children: selectedCustomer.fullName
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								selectedCustomer.serviceAddress
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
					className: "mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary",
					children: "Choose a service"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					"data-ocid": "schedule.service_grid",
					className: "grid grid-cols-2 gap-3 sm:grid-cols-4",
					children: SERVICES.map((service, index) => {
						const Icon = ICONS[service.icon] ?? Wrench;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HexTile, {
							"data-ocid": `schedule.service_tile.${index + 1}`,
							label: service.label,
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5" }),
							selected: category === service.category,
							onClick: () => setCategory(service.category)
						}, service.category);
					})
				})] })]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				"data-ocid": "schedule.form_error_state",
				className: "mt-4 text-sm text-destructive",
				children: error
			}),
			saved && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				"data-ocid": "schedule.form_success_state",
				className: "mt-4 rounded-xl border border-success/50 bg-success/10 px-4 py-3 text-sm text-success",
				children: [
					"Appointment saved — reference",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono font-semibold",
						children: formatReference(saved)
					}),
					". It now appears on the customer's profile."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(HoneyButton, {
				size: "md",
				"data-ocid": "schedule.save_button",
				disabled: pending,
				onClick: handleSave,
				className: "mt-5 w-full sm:w-auto",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }), pending ? "Saving…" : "Save appointment"]
			})
		]
	});
}
function CalendarView({ jobs }) {
	const [monthOffset, setMonthOffset] = (0, import_react.useState)(0);
	const { cells, monthLabel, scheduledDays } = (0, import_react.useMemo)(() => {
		const base = /* @__PURE__ */ new Date();
		const monthStart = new Date(base.getFullYear(), base.getMonth() + monthOffset, 1);
		const year = monthStart.getFullYear();
		const month = monthStart.getMonth();
		const firstWeekday = new Date(year, month, 1).getDay();
		const daysInMonth = new Date(year, month + 1, 0).getDate();
		const dayMap = /* @__PURE__ */ new Map();
		for (const job of jobs) {
			if (!job.appointment) continue;
			const at = timestampToDate(job.appointment.scheduledAt);
			if (!at || at.getFullYear() !== year || at.getMonth() !== month) continue;
			const list = dayMap.get(at.getDate()) ?? [];
			list.push(job);
			dayMap.set(at.getDate(), list);
		}
		const grid = [];
		for (let i = 0; i < firstWeekday; i += 1) grid.push(null);
		for (let day = 1; day <= daysInMonth; day += 1) grid.push(day);
		while (grid.length % 7 !== 0) grid.push(null);
		return {
			cells: grid,
			monthLabel: monthStart.toLocaleDateString(void 0, {
				month: "long",
				year: "numeric"
			}),
			scheduledDays: dayMap
		};
	}, [jobs, monthOffset]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(HoneyCard, {
		"data-ocid": "schedule.calendar_panel",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					"aria-hidden": "true",
					className: "hex-clip flex size-10 items-center justify-center bg-primary/15 text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarClock, { className: "size-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-outline-black-strong font-display text-lg font-semibold text-foreground",
					children: monthLabel
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"data-ocid": "schedule.calendar_prev_button",
					"aria-label": "Previous month",
					onClick: () => setMonthOffset((value) => value - 1),
					className: "flex size-10 items-center justify-center rounded-full border border-border bg-secondary/60 text-foreground transition-smooth hover:border-primary/50",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"data-ocid": "schedule.calendar_next_button",
					"aria-label": "Next month",
					onClick: () => setMonthOffset((value) => value + 1),
					className: "flex size-10 items-center justify-center rounded-full border border-border bg-secondary/60 text-foreground transition-smooth hover:border-primary/50",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-7 gap-1.5",
			children: [WEEKDAYS.map((day) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pb-1 text-center text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground",
				children: day
			}, day)), cells.map((day, index) => {
				const dayJobs = day === null ? [] : scheduledDays.get(day) ?? [];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					"data-ocid": day === null ? void 0 : `schedule.calendar_day.${day}`,
					className: cn("min-h-16 rounded-lg border p-1.5 text-xs", day === null ? "border-transparent" : dayJobs.length > 0 ? "border-primary/50 bg-primary/10" : "border-border/60 bg-muted/15"),
					children: day !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-[0.7rem] text-muted-foreground",
						children: day
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-1 flex flex-col gap-1",
						children: [dayJobs.slice(0, 2).map((job) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "truncate rounded bg-primary/20 px-1 py-0.5 text-[0.6rem] font-semibold text-primary",
							title: `${job.customerName} · ${getService(job.category).label}`,
							children: job.customerName
						}, job.id.toString())), dayJobs.length > 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "text-[0.6rem] text-muted-foreground",
							children: [
								"+",
								dayJobs.length - 2,
								" more"
							]
						})]
					})] })
				}, day === null ? `blank-${index}` : `day-${day}`);
			})]
		})]
	});
}
function StatusLists({ groups }) {
	const sections = [
		{
			key: "upcoming",
			title: "Upcoming appointments",
			description: "Confirmed visits still ahead on the calendar.",
			jobs: groups.upcoming
		},
		{
			key: "pending",
			title: "Pending service requests",
			description: "New requests awaiting a quote or a time.",
			jobs: groups.pending
		},
		{
			key: "approved",
			title: "Approved appointments",
			description: "Quotes approved and scheduled with the customer.",
			jobs: groups.approved
		},
		{
			key: "inProgress",
			title: "Jobs in progress",
			description: "Work underway right now.",
			jobs: groups.inProgress
		},
		{
			key: "completed",
			title: "Completed jobs",
			description: "Finished Honey Do's.",
			jobs: groups.completed
		},
		{
			key: "cancelled",
			title: "Cancelled jobs",
			description: "Requests that were cancelled.",
			jobs: groups.cancelled
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-6 lg:grid-cols-2",
		children: sections.map((section) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(HoneyCard, {
			"data-ocid": `schedule.list.${section.key}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-outline-black-strong font-display text-lg font-semibold text-foreground",
						children: section.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-outline-black mt-1 text-sm text-muted-foreground",
						children: section.description
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HexStatus, {
					"data-ocid": `schedule.list_count.${section.key}`,
					label: `${section.jobs.length}`
				})]
			}), section.jobs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				"data-ocid": `schedule.list_empty.${section.key}`,
				className: "rounded-xl border border-dashed border-border/80 bg-muted/20 px-4 py-6 text-center text-sm text-muted-foreground",
				children: "Nothing here yet."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "flex flex-col gap-3",
				children: section.jobs.map((job, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScheduleRow, {
					job,
					section: section.key,
					index: index + 1
				}, job.id.toString()))
			})]
		}, section.key))
	});
}
function ScheduleRow({ job, section, index }) {
	const service = getService(job.category);
	const status = getStatusMeta(job.status);
	const Icon = ICONS[service.icon] ?? Wrench;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		"data-ocid": `schedule.item.${section}.${index}`,
		className: "crm-row rounded-xl border border-border/70 p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-start justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 items-start gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					"aria-hidden": "true",
					className: "hex-clip flex size-9 shrink-0 items-center justify-center bg-primary/15 text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate font-display text-base font-semibold text-foreground",
						children: job.customerName
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-0.5 font-mono text-xs text-muted-foreground",
						children: [
							formatReference(job.referenceCode),
							" · ",
							service.label
						]
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HexStatus, {
				"data-ocid": `schedule.item_status.${section}.${index}`,
				label: status.label,
				toneClass: status.chipClass
			})]
		}), job.appointment ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-3 flex items-center gap-2 text-sm text-muted-foreground",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarClock, {
					className: "size-4 text-primary",
					"aria-hidden": "true"
				}),
				formatDateTime(job.appointment.scheduledAt),
				" ·",
				" ",
				job.appointment.confirmed ? "confirmed" : "awaiting confirmation"
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-sm text-muted-foreground",
			children: "No appointment time set yet."
		})]
	});
}
export { SchedulePage };
