import { HoneyButton } from "@/components/honey/HoneyButton";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
  useUnreadNotificationCount,
} from "@/hooks/useCustomers";
import { type NotificationView, notificationKindLabel } from "@/lib/customers";
import { formatRelativeTime, timestampToDate } from "@/lib/jobs";
import { cn } from "@/lib/utils";
import { Bell, CheckCheck, Inbox } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * Administrator notification bell.
 *
 * Renders a bell button carrying the unread count as a honey-coral badge. The
 * panel lists every notification newest first with its kind, title, body and
 * time, and lets the admin mark one — or all — as reviewed. Notifications stay
 * unread until the admin reviews them, so the badge only clears on an explicit
 * mark action.
 *
 * This component is only mounted inside the admin dashboard, so the bell and
 * its notifications are never visible to non-administrators.
 */
export function NotificationBell() {
  const notificationsQuery = useNotifications();
  const unreadQuery = useUnreadNotificationCount();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const notifications = notificationsQuery.data ?? [];
  const unreadCount = Number(unreadQuery.data ?? 0n);
  const hasUnread = unreadCount > 0;

  // Close the panel on an outside click or Escape, and restore focus to the
  // bell so keyboard users are never stranded.
  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const badgeLabel = unreadCount > 99 ? "99+" : String(unreadCount);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        data-ocid="admin.notification_bell_button"
        aria-label={
          hasUnread
            ? `Notifications, ${unreadCount} unread`
            : "Notifications, none unread"
        }
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "relative inline-flex size-11 items-center justify-center rounded-full border border-primary/45 bg-secondary/60 text-foreground transition-smooth",
          "hover:border-primary/70 hover:bg-secondary hover:shadow-honey",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        )}
      >
        <Bell className="size-5" />
        {hasUnread && (
          <span
            data-ocid="admin.notification_badge"
            className="notification-badge text-outline-black absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 font-mono text-[0.65rem] font-bold leading-none"
          >
            {badgeLabel}
          </span>
        )}
      </button>

      {open && (
        <section
          aria-label="Notifications"
          data-ocid="admin.notification_panel"
          className="notification-panel absolute right-0 z-50 mt-3 w-[min(22rem,calc(100vw-2.5rem))] overflow-hidden rounded-2xl border border-border/80"
        >
          <div className="flex items-center justify-between gap-3 border-b border-border/70 px-4 py-3">
            <div className="min-w-0">
              <h2 className="text-outline-black-strong font-display text-base font-semibold text-foreground">
                Notifications
              </h2>
              <p className="text-outline-black mt-0.5 text-xs text-muted-foreground">
                {hasUnread ? `${unreadCount} awaiting review` : "All caught up"}
              </p>
            </div>
            <HoneyButton
              size="sm"
              variant="ghost"
              data-ocid="admin.notification_mark_all_button"
              disabled={!hasUnread || markAllRead.isPending}
              onClick={() => markAllRead.mutate()}
            >
              <CheckCheck className="size-4" />
              {markAllRead.isPending ? "Marking…" : "Mark all read"}
            </HoneyButton>
          </div>

          <div className="max-h-[24rem] overflow-y-auto scrollbar-honey">
            {notificationsQuery.isLoading ? (
              <p
                data-ocid="admin.notification_loading_state"
                className="px-4 py-8 text-center text-sm text-muted-foreground"
              >
                Loading notifications…
              </p>
            ) : notificationsQuery.isError ? (
              <p
                data-ocid="admin.notification_error_state"
                className="px-4 py-8 text-center text-sm text-destructive"
              >
                We couldn&apos;t load your notifications. Please try again.
              </p>
            ) : notifications.length === 0 ? (
              <div
                data-ocid="admin.notification_empty_state"
                className="flex flex-col items-center gap-2 px-4 py-10 text-center"
              >
                <Inbox className="size-6 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No notifications yet. New activity will land here.
                </p>
              </div>
            ) : (
              <ul
                data-ocid="admin.notification_list"
                className="divide-y divide-border/60"
              >
                {notifications.map((notification, index) => (
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
          </div>
        </section>
      )}
    </div>
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

  return (
    <li
      data-ocid={`admin.notification_item.${index}`}
      className={cn(
        "flex gap-3 px-4 py-3",
        notification.read ? "bg-transparent" : "bg-primary/10",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "hex-clip mt-1 size-2.5 shrink-0",
          notification.read ? "bg-muted-foreground/50" : "bg-primary",
        )}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-outline-black text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-primary">
            {notificationKindLabel(notification.kind)}
          </span>
          {!notification.read && (
            <span
              data-ocid={`admin.notification_unread_dot.${index}`}
              className="notification-badge size-2 rounded-full"
              aria-label="Unread"
            />
          )}
        </div>
        <p className="text-outline-black mt-1 text-sm font-semibold text-foreground">
          {notification.title}
        </p>
        <p className="text-outline-black mt-0.5 text-sm text-muted-foreground">
          {notification.body}
        </p>
        <div className="mt-2 flex items-center justify-between gap-3">
          <span className="font-mono text-[0.65rem] text-muted-foreground">
            {timeLabel}
          </span>
          {!notification.read && (
            <button
              type="button"
              data-ocid={`admin.notification_mark_read_button.${index}`}
              disabled={isMarking}
              onClick={onMarkRead}
              className="text-outline-black text-xs font-semibold uppercase tracking-[0.14em] text-primary underline-offset-4 transition-smooth hover:text-accent hover:underline disabled:opacity-55"
            >
              Mark read
            </button>
          )}
        </div>
      </div>
    </li>
  );
}
