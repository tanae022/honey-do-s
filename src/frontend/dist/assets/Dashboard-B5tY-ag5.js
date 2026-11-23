import { r as __toESM } from "./rolldown-runtime-SbdDWaPq.js";
import { r as useInternetIdentity } from "./dist-DCUbDtYL.js";
import { $ as JobStatus, Y as DepositStatus, ct as require_react, rt as QuoteStatus, st as require_jsx_runtime, t as createLucideIcon } from "./createLucideIcon-CK3986Sn.js";
import { t as CalendarClock } from "./calendar-clock-BKRV_BaF.js";
import { t as CalendarPlus } from "./calendar-plus-P14BfjVE.js";
import { t as FileText } from "./file-text-BqDxuuUp.js";
import { D as AdminButton, E as AdminCardHeader, O as AdminPageHeader, S as AdminStatCard, T as AdminCard, k as AdminShell, n as AdminLoadingState, t as AdminErrorState, w as AdminStatusBadge } from "./admin-DxTl2OJo.js";
import { t as Plus } from "./plus-BbIZ9xgk.js";
import { t as ShieldAlert } from "./shield-alert-CwcHCNy3.js";
import { t as UserPlus } from "./user-plus-DZOyHkAR.js";
import { E as useJobRequests, N as useScheduledAppointments, S as useDashboardStats, d as Inbox, f as ClipboardList, g as Link, o as Wallet, s as Users, u as LogIn, w as useIsAdmin } from "./index-DhzL9CXu.js";
import { l as usePaymentHistory } from "./useAdminSettings-CtJqDOX4.js";
import { l as useCustomers } from "./useCustomers-it81kN8P.js";
import { n as ADMIN_STATUS_ORDER, t as ADMIN_STATUS_META } from "./admin-CtzrkfjB.js";
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var CreditCard = createLucideIcon("credit-card", [["rect", {
	width: "20",
	height: "14",
	x: "2",
	y: "5",
	rx: "2",
	key: "ynyp8z"
}], ["line", {
	x1: "2",
	x2: "22",
	y1: "10",
	y2: "10",
	key: "1b3vmo"
}]]);
// src/pages/admin/Dashboard.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
/**
* Admin Dashboard.
*
* The light, high-contrast landing page for the private admin side. It gates on
* admin access, then shows the eight headline counts the owner checks first,
* each linking to the list filtered to that state, plus the four quick actions
* that open the matching create flow. Every number is derived from the shared
* admin queries so the dashboard, the lists and the nav badge always agree.
*/
function DashboardPage() {
	const { data: isAdmin, isLoading: roleLoading } = useIsAdmin();
	const { login, loginStatus } = useInternetIdentity();
	if (roleLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLoadingState, {
		"data-ocid": "admin.dashboard.loading_state",
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
				children: "Sign in with an administrator identity to open the dashboard."
			}),
			loginStatus !== "success" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminButton, {
				"data-ocid": "admin.dashboard.login_button",
				onClick: () => login(),
				className: "mt-5 w-full sm:w-auto",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "size-4" }), "Sign in"]
			})
		]
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardWorkspace, {});
}
function DashboardWorkspace() {
	const statsQuery = useDashboardStats();
	const requestsQuery = useJobRequests();
	const appointmentsQuery = useScheduledAppointments();
	const paymentsQuery = usePaymentHistory();
	const customersQuery = useCustomers();
	const requests = requestsQuery.data ?? [];
	const appointments = appointmentsQuery.data ?? [];
	const payments = paymentsQuery.data ?? [];
	const customers = customersQuery.data ?? [];
	const counts = (0, import_react.useMemo)(() => {
		const startOfToday = /* @__PURE__ */ new Date();
		startOfToday.setHours(0, 0, 0, 0);
		const startOfTomorrow = new Date(startOfToday);
		startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);
		const todayAppointments = appointments.filter((appointment) => {
			const at = Number(appointment.scheduledAt / 1000000n);
			return at >= startOfToday.getTime() && at < startOfTomorrow.getTime();
		}).length;
		const pendingQuotes = requests.filter((job) => job.status === JobStatus.quoted && job.quote?.status !== QuoteStatus.approved && job.quote?.status !== QuoteStatus.declined).length;
		const depositsPending = payments.filter((payment) => payment.depositStatus === DepositStatus.pending || payment.depositStatus === DepositStatus.submitted).length;
		return {
			newRequests: statsQuery.data ? Number(statsQuery.data.newRequests) : requests.filter((job) => job.status === JobStatus.requested).length,
			todayAppointments,
			upcomingAppointments: statsQuery.data ? Number(statsQuery.data.upcomingAppointments) : appointments.length,
			pendingQuotes,
			depositsPending,
			activeJobs: statsQuery.data ? Number(statsQuery.data.activeJobs) : requests.filter((job) => job.status === JobStatus.inProgress).length,
			payments: payments.length,
			customers: customers.length
		};
	}, [
		appointments,
		customers.length,
		payments,
		requests,
		statsQuery.data
	]);
	const isLoading = statsQuery.isLoading || requestsQuery.isLoading || appointmentsQuery.isLoading || paymentsQuery.isLoading || customersQuery.isLoading;
	const isError = statsQuery.isError || requestsQuery.isError || appointmentsQuery.isError || paymentsQuery.isError || customersQuery.isError;
	const refetchAll = () => {
		statsQuery.refetch();
		requestsQuery.refetch();
		appointmentsQuery.refetch();
		paymentsQuery.refetch();
		customersQuery.refetch();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
			eyebrow: "Hive control",
			title: "Dashboard",
			description: "Everything that needs your attention today, at a glance."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			"data-ocid": "admin.dashboard.quick_actions",
			"aria-label": "Quick actions",
			className: "mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickAction, {
					ocid: "admin.dashboard.new_request_button",
					to: "/request",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-5" }),
					label: "New Request"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickAction, {
					ocid: "admin.dashboard.new_customer_button",
					to: "/admin/customers",
					search: { new: "1" },
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "size-5" }),
					label: "New Customer"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickAction, {
					ocid: "admin.dashboard.new_quote_button",
					to: "/admin/quotes",
					search: { new: "1" },
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-5" }),
					label: "New Quote"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickAction, {
					ocid: "admin.dashboard.new_appointment_button",
					to: "/admin/calendar",
					search: { new: "1" },
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarPlus, { className: "size-5" }),
					label: "New Appointment"
				})
			]
		}),
		isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminErrorState, {
			"data-ocid": "admin.dashboard.error_state",
			message: "We couldn't load the dashboard. Please try again.",
			onRetry: refetchAll
		}) : isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLoadingState, {
			"data-ocid": "admin.dashboard.loading_state",
			label: "Loading your dashboard"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			"data-ocid": "admin.dashboard.stats_section",
			"aria-label": "Dashboard counts",
			className: "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatLink, {
					ocid: "admin.dashboard.stat.new_requests",
					to: "/admin/requests",
					search: { status: "new" },
					label: "New Requests",
					value: counts.newRequests,
					hint: "Awaiting your quote",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inbox, { className: "size-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatLink, {
					ocid: "admin.dashboard.stat.today_appointments",
					to: "/admin/calendar",
					search: { range: "today" },
					label: "Today's Appointments",
					value: counts.todayAppointments,
					hint: "Scheduled for today",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarClock, { className: "size-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatLink, {
					ocid: "admin.dashboard.stat.upcoming_appointments",
					to: "/admin/calendar",
					search: { range: "upcoming" },
					label: "Upcoming Appointments",
					value: counts.upcomingAppointments,
					hint: "On the calendar ahead",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarClock, { className: "size-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatLink, {
					ocid: "admin.dashboard.stat.pending_quotes",
					to: "/admin/quotes",
					search: { status: "pending" },
					label: "Pending Quotes",
					value: counts.pendingQuotes,
					hint: "Waiting on the customer",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatLink, {
					ocid: "admin.dashboard.stat.deposits_pending",
					to: "/admin/payments",
					search: { status: "pending" },
					label: "Deposits Pending",
					value: counts.depositsPending,
					hint: "Not yet verified",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "size-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatLink, {
					ocid: "admin.dashboard.stat.active_jobs",
					to: "/admin/jobs",
					search: { status: "active" },
					label: "Active Jobs",
					value: counts.activeJobs,
					hint: "In progress right now",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, { className: "size-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatLink, {
					ocid: "admin.dashboard.stat.payments",
					to: "/admin/payments",
					search: {},
					label: "Payments",
					value: counts.payments,
					hint: "Recorded payments",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "size-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatLink, {
					ocid: "admin.dashboard.stat.customers",
					to: "/admin/customers",
					search: {},
					label: "Customers",
					value: counts.customers,
					hint: "In your directory",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-5" })
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mt-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminCard, {
				"data-ocid": "admin.dashboard.status_legend",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminCardHeader, {
					title: "Status colors",
					description: "The same state always reads the same color across every admin page."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "flex flex-wrap gap-2",
					children: ADMIN_STATUS_ORDER.map((key) => {
						const meta = ADMIN_STATUS_META[key];
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminStatusBadge, {
							"data-ocid": `admin.dashboard.status_badge.${key}`,
							tone: meta.tone,
							label: meta.label,
							dot: true
						}) }, key);
					})
				})]
			})
		})] })
	] });
}
/**
* A large, tappable quick action that opens the matching create flow. Rendered
* as a link so it works with keyboard and middle-click, styled like the primary
* admin button.
*/
function QuickAction({ ocid, to, search, icon, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		search,
		"data-ocid": ocid,
		className: "inline-flex min-h-14 items-center justify-center gap-2 rounded-lg border border-transparent bg-[oklch(var(--admin-primary))] px-4 text-base font-semibold text-[oklch(var(--admin-primary-foreground))] transition-smooth hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(var(--admin-ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[oklch(var(--admin-bg))]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			"aria-hidden": "true",
			children: icon
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "truncate",
			children: ["+ ", label]
		})]
	});
}
/**
* A headline count that links to the matching filtered list. The whole card is
* the link, so the tap target is large on phone and desktop alike.
*/
function StatLink({ ocid, to, search, label, value, hint, icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to,
		search,
		"data-ocid": ocid,
		className: "block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(var(--admin-ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[oklch(var(--admin-bg))]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminStatCard, {
			label,
			value: value.toString(),
			hint,
			icon,
			className: "h-full transition-smooth hover:border-[oklch(var(--admin-border-strong))]"
		})
	});
}
export { DashboardPage };
