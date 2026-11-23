import {
  AdminButton,
  AdminCard,
  AdminEmptyState,
  AdminErrorState,
  AdminLoadingState,
  AdminPageHeader,
  AdminShell,
  AdminStatCard,
  AdminStatusBadge,
  type AdminStatusTone,
} from "@/components/admin";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
  useUnreadNotificationCount,
} from "@/hooks/useCustomers";
import {
  type NotificationKind,
  type NotificationView,
  notificationKindLabel,
} from "@/lib/customers";
import { formatRelativeTime, timestampToDate } from "@/lib/jobs";
import { cn } from "@/lib/utils";
import { Bell, BellRing, CheckCheck, Inbox } from "lucide-react";
import { useMemo, useState } from "react";

/* ------------------------------------------------------------------ */
/* Kind → status tone                                                  */
/* ------------------------------------------------------------------ */
/*
 * Every alert kind maps onto one of the shared admin status tones so the same
 * event always reads the same obvious color across the console: a brand-new
 * request is NEW, a customer decision is ACTION REQUIRED, a confirmed
 * appointment is CONFIRMED, money in is PAID, and so on.
 */
const KIND_TONE: Record<NotificationKind, AdminStatusTone> = {
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
  bookingApproval: "waiting",
};

function kindTone(kind: NotificationKind): AdminStatusTone {
  return KIND_TONE[kind] ?? "waiting";
}

type FilterKey = "all" | "unread";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All alerts" },
  { key: "unread", label: "Unread" },
];

/**
 * Admin Notifications page.
 *
 * Lists every alert the backend has raised — new requests, messages, quote
 * decisions, deposits, appointment changes and payments — newest first, with a
 * clear unread badge and mark-one / mark-all-read actions. The in-app
 * new-request alert and the header notification bell stay mounted elsewhere;
 * this page is the full review surface.
 */
export function NotificationsPage() {
  const notificationsQuery = useNotifications();
  const unreadQuery = useUnreadNotificationCount();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const [filter, setFilter] = useState<FilterKey>("all");

  const notifications = notificationsQuery.data ?? [];
  const unreadCount = Number(unreadQuery.data ?? 0n);
  const hasUnread = unreadCount > 0;

  const visible = useMemo(
    () =>
      filter === "unread"
        ? notifications.filter((notification) => !notification.read)
        : notifications,
    [filter, notifications],
  );

  return (
    <AdminShell>
      <AdminPageHeader
        eyebrow="Admin"
        title="Notifications"
        description="Every alert about requests, messages, quotes, deposits and appointments — newest first."
        actions={
          <AdminButton
            variant="primary"
            size="lg"
            data-ocid="admin.notifications.mark_all_button"
            disabled={!hasUnread || markAllRead.isPending}
            onClick={() => markAllRead.mutate()}
          >
            <CheckCheck className="size-5" />
            {markAllRead.isPending ? "Marking…" : "Mark all read"}
          </AdminButton>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4">
        <AdminStatCard
          data-ocid="admin.notifications.unread_stat"
          label="Unread"
          value={String(unreadCount)}
          hint={hasUnread ? "Awaiting review" : "All caught up"}
          icon={<BellRing className="size-5" />}
        />
        <AdminStatCard
          data-ocid="admin.notifications.total_stat"
          label="Total alerts"
          value={String(notifications.length)}
          hint="All time"
          icon={<Bell className="size-5" />}
        />
      </div>

      <div
        role="tablist"
        aria-label="Filter notifications"
        data-ocid="admin.notifications.filter.tab"
        className="mb-4 flex flex-wrap gap-2"
      >
        {FILTERS.map((option) => {
          const active = filter === option.key;
          return (
            <button
              key={option.key}
              type="button"
              role="tab"
              aria-selected={active}
              data-ocid={`admin.notifications.filter.${option.key}`}
              onClick={() => setFilter(option.key)}
              className={cn(
                "inline-flex min-h-11 items-center gap-2 rounded-lg border px-4 text-base font-semibold transition-smooth",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(var(--admin-ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[oklch(var(--admin-bg))]",
                active
                  ? "border-transparent bg-[oklch(var(--admin-primary))] text-[oklch(var(--admin-primary-foreground))]"
                  : "border-[oklch(var(--admin-border-strong))] bg-[oklch(var(--admin-surface))] text-[oklch(var(--admin-foreground))] hover:bg-[oklch(var(--admin-surface-alt))]",
              )}
            >
              {option.label}
              {option.key === "unread" && hasUnread && (
                <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-[oklch(var(--admin-status-action))] px-1.5 py-0.5 font-mono text-xs font-bold text-[oklch(var(--admin-status-action-fg))]">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <AdminCard className="p-0 sm:p-0">
        {notificationsQuery.isLoading ? (
          <AdminLoadingState
            data-ocid="admin.notifications.loading_state"
            label="Loading notifications…"
          />
        ) : notificationsQuery.isError ? (
          <div className="p-5 sm:p-6">
            <AdminErrorState
              data-ocid="admin.notifications.error_state"
              message="We couldn't load your notifications. Please try again."
              onRetry={() => void notificationsQuery.refetch()}
            />
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-5 sm:p-6">
            <AdminEmptyState
              data-ocid="admin.notifications.empty_state"
              icon={<Inbox className="size-6" />}
              title="No notifications yet"
              description="New requests, messages, quote decisions, deposits and appointment changes will land here."
            />
          </div>
        ) : visible.length === 0 ? (
          <div className="p-5 sm:p-6">
            <AdminEmptyState
              data-ocid="admin.notifications.unread_empty_state"
              icon={<CheckCheck className="size-6" />}
              title="Nothing unread"
              description="Every alert has been reviewed. Switch to All alerts to see the full history."
            />
          </div>
        ) : (
          <ul
            data-ocid="admin.notifications.list"
            className="divide-y divide-[oklch(var(--admin-border))]"
          >
            {visible.map((notification, index) => (
              <NotificationRow
                key={notification.id.toString()}
                notification={notification}
                index={index + 1}
                onMarkRead={() => markRead.mutate(notification.id)}
                isMarking={markRead.isPending}
              />
            ))}
          </ul>
        )}
      </AdminCard>
    </AdminShell>
  );
}

function NotificationRow({
  notification,
  index,
  onMarkRead,
  isMarking,
}: {
  notification: NotificationView;
  index: number;
  onMarkRead: () => void;
  isMarking: boolean;
}) {
  const created = timestampToDate(notification.createdAt);
  const timeLabel = created ? formatRelativeTime(created) : "Unknown time";
  const unread = !notification.read;

  return (
    <li
      data-ocid={`admin.notifications.item.${index}`}
      className={cn(
        "flex flex-col gap-3 p-5 sm:flex-row sm:items-start sm:gap-4 sm:p-6",
        unread && "bg-[oklch(var(--admin-surface-alt))]",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "mt-1 hidden size-2.5 shrink-0 rounded-full sm:block",
          unread
            ? "bg-[oklch(var(--admin-status-action))]"
            : "bg-[oklch(var(--admin-border-strong))]",
        )}
      />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <AdminStatusBadge
            tone={kindTone(notification.kind)}
            label={notificationKindLabel(notification.kind)}
            dot
          />
          {unread && (
            <span
              data-ocid={`admin.notifications.unread_badge.${index}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-[oklch(var(--admin-status-action))] px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-[oklch(var(--admin-status-action-fg))]"
            >
              Unread
            </span>
          )}
        </div>

        <p className="mt-2 text-lg font-bold leading-snug text-[oklch(var(--admin-foreground))]">
          {notification.title}
        </p>
        <p className="mt-1 text-base leading-relaxed text-[oklch(var(--admin-muted-foreground))]">
          {notification.body}
        </p>
        <p className="mt-2 font-mono text-sm text-[oklch(var(--admin-muted-foreground))]">
          {timeLabel}
        </p>
      </div>

      {unread && (
        <div className="shrink-0 sm:pt-1">
          <AdminButton
            variant="secondary"
            size="md"
            data-ocid={`admin.notifications.mark_read_button.${index}`}
            disabled={isMarking}
            onClick={onMarkRead}
            className="w-full sm:w-auto"
          >
            <CheckCheck className="size-4" />
            Mark read
          </AdminButton>
        </div>
      )}
    </li>
  );
}
