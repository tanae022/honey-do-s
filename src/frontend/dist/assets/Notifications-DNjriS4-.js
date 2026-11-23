import { r as __toESM } from "./rolldown-runtime-SbdDWaPq.js";
import { K as cn, V as timestampToDate, ct as require_react, g as formatRelativeTime, st as require_jsx_runtime, t as createLucideIcon } from "./createLucideIcon-CK3986Sn.js";
import { D as AdminButton, O as AdminPageHeader, S as AdminStatCard, T as AdminCard, g as AdminEmptyState, k as AdminShell, n as AdminLoadingState, t as AdminErrorState, w as AdminStatusBadge } from "./admin-DxTl2OJo.js";
import { d as Inbox, h as BellRing, m as Bell } from "./index-DhzL9CXu.js";
import { _ as useUnreadNotificationCount, d as useMarkAllNotificationsRead, f as useMarkNotificationRead, p as useNotifications } from "./useCustomers-it81kN8P.js";
import { u as notificationKindLabel } from "./customers-CXB1Kudi.js";
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var CheckCheck = createLucideIcon("check-check", [["path", {
	d: "M18 6 7 17l-5-5",
	key: "116fxf"
}], ["path", {
	d: "m22 10-7.5 7.5L13 16",
	key: "ke71qq"
}]]);
// src/pages/admin/Notifications.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var KIND_TONE = {
	newRequest: "new",
	newCustomer: "new",
	returningCustomerRequest: "new",
	newMessage: "action",
	customerMessage: "action",
	quoteApproved: "approved",
	quoteDeclined: "cancelled",
	depositSubmitted: "action",
	depositReceived: "paid",
	depositVerified: "paid",
	paymentReceived: "paid",
	appointmentConfirmed: "confirmed",
	appointmentChanged: "waiting",
	appointmentReminder: "waiting",
	bookingApproval: "waiting"
};
function kindTone(kind) {
	return KIND_TONE[kind] ?? "waiting";
}
var FILTERS = [{
	key: "all",
	label: "All alerts"
}, {
	key: "unread",
	label: "Unread"
}];
/**
* Admin Notifications page.
*
* Lists every alert the backend has raised — new requests, messages, quote
* decisions, deposits, appointment changes and payments — newest first, with a
* clear unread badge and mark-one / mark-all-read actions. The in-app
* new-request alert and the header notification bell stay mounted elsewhere;
* this page is the full review surface.
*/
function NotificationsPage() {
	const notificationsQuery = useNotifications();
	const unreadQuery = useUnreadNotificationCount();
	const markRead = useMarkNotificationRead();
	const markAllRead = useMarkAllNotificationsRead();
	const [filter, setFilter] = (0, import_react.useState)("all");
	const notifications = notificationsQuery.data ?? [];
	const unreadCount = Number(unreadQuery.data ?? 0n);
	const hasUnread = unreadCount > 0;
	const visible = (0, import_react.useMemo)(() => filter === "unread" ? notifications.filter((notification) => !notification.read) : notifications, [filter, notifications]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
			eyebrow: "Admin",
			title: "Notifications",
			description: "Every alert about requests, messages, quotes, deposits and appointments — newest first.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminButton, {
				variant: "primary",
				size: "lg",
				"data-ocid": "admin.notifications.mark_all_button",
				disabled: !hasUnread || markAllRead.isPending,
				onClick: () => markAllRead.mutate(),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, { className: "size-5" }), markAllRead.isPending ? "Marking…" : "Mark all read"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 grid grid-cols-2 gap-3 sm:gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminStatCard, {
				"data-ocid": "admin.notifications.unread_stat",
				label: "Unread",
				value: String(unreadCount),
				hint: hasUnread ? "Awaiting review" : "All caught up",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellRing, { className: "size-5" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminStatCard, {
				"data-ocid": "admin.notifications.total_stat",
				label: "Total alerts",
				value: String(notifications.length),
				hint: "All time",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "size-5" })
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			role: "tablist",
			"aria-label": "Filter notifications",
			"data-ocid": "admin.notifications.filter.tab",
			className: "mb-4 flex flex-wrap gap-2",
			children: FILTERS.map((option) => {
				const active = filter === option.key;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					role: "tab",
					"aria-selected": active,
					"data-ocid": `admin.notifications.filter.${option.key}`,
					onClick: () => setFilter(option.key),
					className: cn("inline-flex min-h-11 items-center gap-2 rounded-lg border px-4 text-base font-semibold transition-smooth", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(var(--admin-ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[oklch(var(--admin-bg))]", active ? "border-transparent bg-[oklch(var(--admin-primary))] text-[oklch(var(--admin-primary-foreground))]" : "border-[oklch(var(--admin-border-strong))] bg-[oklch(var(--admin-surface))] text-[oklch(var(--admin-foreground))] hover:bg-[oklch(var(--admin-surface-alt))]"),
					children: [option.label, option.key === "unread" && hasUnread && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "inline-flex min-w-6 items-center justify-center rounded-full bg-[oklch(var(--admin-status-action))] px-1.5 py-0.5 font-mono text-xs font-bold text-[oklch(var(--admin-status-action-fg))]",
						children: unreadCount > 99 ? "99+" : unreadCount
					})]
				}, option.key);
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminCard, {
			className: "p-0 sm:p-0",
			children: notificationsQuery.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLoadingState, {
				"data-ocid": "admin.notifications.loading_state",
				label: "Loading notifications…"
			}) : notificationsQuery.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-5 sm:p-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminErrorState, {
					"data-ocid": "admin.notifications.error_state",
					message: "We couldn't load your notifications. Please try again.",
					onRetry: () => void notificationsQuery.refetch()
				})
			}) : notifications.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-5 sm:p-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminEmptyState, {
					"data-ocid": "admin.notifications.empty_state",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inbox, { className: "size-6" }),
					title: "No notifications yet",
					description: "New requests, messages, quote decisions, deposits and appointment changes will land here."
				})
			}) : visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-5 sm:p-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminEmptyState, {
					"data-ocid": "admin.notifications.unread_empty_state",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, { className: "size-6" }),
					title: "Nothing unread",
					description: "Every alert has been reviewed. Switch to All alerts to see the full history."
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				"data-ocid": "admin.notifications.list",
				className: "divide-y divide-[oklch(var(--admin-border))]",
				children: visible.map((notification, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationRow, {
					notification,
					index: index + 1,
					onMarkRead: () => markRead.mutate(notification.id),
					isMarking: markRead.isPending
				}, notification.id.toString()))
			})
		})
	] });
}
function NotificationRow({ notification, index, onMarkRead, isMarking }) {
	const created = timestampToDate(notification.createdAt);
	const timeLabel = created ? formatRelativeTime(created) : "Unknown time";
	const unread = !notification.read;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		"data-ocid": `admin.notifications.item.${index}`,
		className: cn("flex flex-col gap-3 p-5 sm:flex-row sm:items-start sm:gap-4 sm:p-6", unread && "bg-[oklch(var(--admin-surface-alt))]"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"aria-hidden": "true",
				className: cn("mt-1 hidden size-2.5 shrink-0 rounded-full sm:block", unread ? "bg-[oklch(var(--admin-status-action))]" : "bg-[oklch(var(--admin-border-strong))]")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminStatusBadge, {
							tone: kindTone(notification.kind),
							label: notificationKindLabel(notification.kind),
							dot: true
						}), unread && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"data-ocid": `admin.notifications.unread_badge.${index}`,
							className: "inline-flex items-center gap-1.5 rounded-full bg-[oklch(var(--admin-status-action))] px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-[oklch(var(--admin-status-action-fg))]",
							children: "Unread"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-lg font-bold leading-snug text-[oklch(var(--admin-foreground))]",
						children: notification.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-base leading-relaxed text-[oklch(var(--admin-muted-foreground))]",
						children: notification.body
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-mono text-sm text-[oklch(var(--admin-muted-foreground))]",
						children: timeLabel
					})
				]
			}),
			unread && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "shrink-0 sm:pt-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminButton, {
					variant: "secondary",
					size: "md",
					"data-ocid": `admin.notifications.mark_read_button.${index}`,
					disabled: isMarking,
					onClick: onMarkRead,
					className: "w-full sm:w-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, { className: "size-4" }), "Mark read"]
				})
			})
		]
	});
}
export { NotificationsPage };
