import type { CustomerId, CustomerSummary, MessageView } from "@/backend";
import {
  AdminButton,
  AdminCard,
  AdminCardHeader,
  AdminChip,
  AdminEmptyState,
  AdminErrorState,
  AdminField,
  AdminLoadingState,
  AdminPageHeader,
  AdminShell,
  AdminStatusBadge,
  AdminTextarea,
} from "@/components/admin";
import {
  useCustomerMessages,
  useCustomers,
  useSendAdminMessage,
} from "@/hooks/useCustomers";
import { useIsAdmin } from "@/hooks/useJobs";
import { customerDisplayName, customerInitials } from "@/lib/customers";
import { formatDateTime } from "@/lib/jobs";
import { cn } from "@/lib/utils";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import {
  ArrowLeft,
  LogIn,
  MessageSquare,
  MessagesSquare,
  Send,
  ShieldAlert,
} from "lucide-react";
import { type FormEvent, useMemo, useState } from "react";

/* ------------------------------------------------------------------ */
/* Thread helpers                                                      */
/* ------------------------------------------------------------------ */

/** Oldest-first ordering for a message thread. */
function sortThread(messages: MessageView[]): MessageView[] {
  return [...messages].sort((a, b) =>
    a.createdAt === b.createdAt ? 0 : a.createdAt > b.createdAt ? 1 : -1,
  );
}

/** A short preview of the most recent message in a thread. */
function previewText(message: MessageView | null): string {
  if (!message) return "No messages yet — start the conversation.";
  const body = message.body.trim().replace(/\s+/g, " ");
  const prefix = message.fromAdmin ? "You: " : "";
  return `${prefix}${body}`;
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

/**
 * Admin Messages page.
 *
 * A list of customer conversations the owner can open to read the full thread
 * and reply. Messages are connected to the customer and, where the thread
 * carries one, the request or job. The layout is a two-pane workspace on wide
 * screens and a single-pane drill-in on phones, so nothing ever scrolls
 * sideways.
 */
export function MessagesPage() {
  const { data: isAdmin, isLoading: roleLoading } = useIsAdmin();
  const { login, loginStatus } = useInternetIdentity();

  if (roleLoading) {
    return (
      <AdminShell>
        <AdminLoadingState
          data-ocid="admin.messages.loading_state"
          label="Checking access"
        />
      </AdminShell>
    );
  }

  if (!isAdmin) {
    return (
      <AdminShell>
        <AdminEmptyState
          data-ocid="admin.messages.access_denied"
          icon={<ShieldAlert className="size-6" />}
          title="Admin access required"
          description="Sign in with an administrator identity to open the messages workspace."
          action={
            loginStatus !== "success" ? (
              <AdminButton
                data-ocid="admin.messages.login_button"
                onClick={() => login()}
              >
                <LogIn className="size-4" />
                Sign in
              </AdminButton>
            ) : undefined
          }
        />
      </AdminShell>
    );
  }

  return <MessagesWorkspace />;
}

function MessagesWorkspace() {
  const customersQuery = useCustomers();
  const [selectedId, setSelectedId] = useState<CustomerId | null>(null);

  const customers = useMemo(
    () => customersQuery.data ?? [],
    [customersQuery.data],
  );

  const selected = useMemo(
    () =>
      selectedId === null
        ? null
        : (customers.find((customer) => customer.id === selectedId) ?? null),
    [customers, selectedId],
  );

  const isLoading = customersQuery.isLoading;
  const isError = customersQuery.isError;

  return (
    <AdminShell>
      <AdminPageHeader
        eyebrow="Admin"
        title="Messages"
        description="Customer conversations across every job. Open a thread to read it and reply."
      />

      {isLoading ? (
        <AdminLoadingState
          data-ocid="admin.messages.loading_state"
          label="Opening conversations"
        />
      ) : isError ? (
        <AdminErrorState
          data-ocid="admin.messages.error_state"
          message="The conversations could not be loaded. Please try again."
          onRetry={() => void customersQuery.refetch()}
        />
      ) : customers.length === 0 ? (
        <AdminEmptyState
          data-ocid="admin.messages.empty_state"
          icon={<MessagesSquare className="size-6" />}
          title="No conversations yet"
          description="When a customer sends a message it will appear here, ready for a reply."
        />
      ) : (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
          {/* Conversation list — hidden on phones while a thread is open. */}
          <AdminCard
            data-ocid="admin.messages.list_panel"
            className={cn(selected && "hidden lg:block")}
          >
            <AdminCardHeader
              title="Conversations"
              description={`${customers.length} ${
                customers.length === 1 ? "customer" : "customers"
              }`}
            />
            <ul data-ocid="admin.messages.list" className="flex flex-col gap-2">
              {customers.map((customer, index) => (
                <ConversationRow
                  key={customer.id.toString()}
                  customer={customer}
                  index={index + 1}
                  active={customer.id === selectedId}
                  onSelect={() => setSelectedId(customer.id)}
                />
              ))}
            </ul>
          </AdminCard>

          {/* Thread pane — full width on phones, second column on desktop. */}
          <div className={cn("min-w-0", !selected && "hidden lg:block")}>
            {selected ? (
              <ConversationThread
                customer={selected}
                onBack={() => setSelectedId(null)}
              />
            ) : (
              <AdminCard className="hidden h-full items-center justify-center lg:flex">
                <AdminEmptyState
                  data-ocid="admin.messages.no_selection"
                  icon={<MessageSquare className="size-6" />}
                  title="Select a conversation"
                  description="Choose a customer on the left to read the full thread and reply."
                  className="border-0 bg-transparent"
                />
              </AdminCard>
            )}
          </div>
        </div>
      )}
    </AdminShell>
  );
}

/* ------------------------------------------------------------------ */
/* Conversation list row                                               */
/* ------------------------------------------------------------------ */

interface ConversationRowProps {
  customer: CustomerSummary;
  index: number;
  active: boolean;
  onSelect: () => void;
}

/**
 * One conversation in the list.
 *
 * Each row owns its own thread query so the preview and message count are real
 * data, and the hook count stays stable because the row is its own component.
 */
function ConversationRow({
  customer,
  index,
  active,
  onSelect,
}: ConversationRowProps) {
  const messagesQuery = useCustomerMessages(customer.id);
  const messages = useMemo(
    () => sortThread(messagesQuery.data ?? []),
    [messagesQuery.data],
  );
  const lastMessage =
    messages.length > 0 ? messages[messages.length - 1] : null;
  const name = customerDisplayName(customer);

  return (
    <li>
      <button
        type="button"
        data-ocid={`admin.messages.conversation.${index}`}
        onClick={onSelect}
        aria-current={active ? "true" : undefined}
        className={cn(
          "flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-smooth",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(var(--admin-ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[oklch(var(--admin-bg))]",
          active
            ? "border-[oklch(var(--admin-primary))] bg-[oklch(var(--admin-surface-alt))]"
            : "border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface))] hover:bg-[oklch(var(--admin-surface-alt))]",
        )}
      >
        <span
          aria-hidden="true"
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[oklch(var(--admin-primary))] text-base font-bold text-[oklch(var(--admin-primary-foreground))]"
        >
          {customerInitials(name)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center justify-between gap-2">
            <span className="truncate text-base font-semibold text-[oklch(var(--admin-foreground))]">
              {name}
            </span>
            {lastMessage && (
              <span className="shrink-0 text-xs font-medium text-[oklch(var(--admin-muted-foreground))]">
                {formatDateTime(lastMessage.createdAt)}
              </span>
            )}
          </span>
          <span className="mt-0.5 block truncate text-sm text-[oklch(var(--admin-muted-foreground))]">
            {messagesQuery.isLoading
              ? "Loading conversation…"
              : previewText(lastMessage)}
          </span>
          {messages.length > 0 && (
            <span className="mt-1.5 flex items-center gap-2">
              <AdminChip className="px-2 py-0.5 text-xs">
                {messages.length}{" "}
                {messages.length === 1 ? "message" : "messages"}
              </AdminChip>
            </span>
          )}
        </span>
      </button>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* Conversation thread                                                 */
/* ------------------------------------------------------------------ */

interface ConversationThreadProps {
  customer: CustomerSummary;
  onBack: () => void;
}

function ConversationThread({ customer, onBack }: ConversationThreadProps) {
  const customerId = customer.id;
  const messagesQuery = useCustomerMessages(customerId);
  const sendMessage = useSendAdminMessage();
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);

  const name = customerDisplayName(customer);

  const messages = useMemo(
    () => sortThread(messagesQuery.data ?? []),
    [messagesQuery.data],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = body.trim();
    if (next.length === 0) {
      setError("Write a message before sending.");
      return;
    }
    setError(null);
    setBody("");
    sendMessage.mutate(
      { customerId, jobId: null, body: next },
      {
        onError: () => {
          setError("We couldn't send that message. Please try again.");
          setBody((current) => (current === "" ? next : current));
        },
      },
    );
  };

  return (
    <AdminCard
      data-ocid="admin.messages.thread_panel"
      className="flex flex-col"
    >
      <div className="mb-4 flex items-start gap-3">
        <AdminButton
          variant="ghost"
          size="sm"
          data-ocid="admin.messages.back_button"
          onClick={onBack}
          className="lg:hidden"
          aria-label="Back to conversations"
        >
          <ArrowLeft className="size-4" />
          Back
        </AdminButton>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-lg font-bold text-[oklch(var(--admin-foreground))]">
            {name}
          </h2>
          <p className="mt-0.5 truncate text-sm text-[oklch(var(--admin-muted-foreground))]">
            {customer.email || customer.phone || "No contact details on file"}
          </p>
        </div>
      </div>

      {messagesQuery.isLoading ? (
        <AdminLoadingState
          data-ocid="admin.messages.thread_loading_state"
          label="Loading messages"
        />
      ) : messagesQuery.isError ? (
        <AdminErrorState
          data-ocid="admin.messages.thread_error_state"
          message="We couldn't load this conversation. Please try again."
          onRetry={() => void messagesQuery.refetch()}
        />
      ) : messages.length === 0 ? (
        <AdminEmptyState
          data-ocid="admin.messages.thread_empty_state"
          icon={<MessageSquare className="size-6" />}
          title="No messages yet"
          description={`Start the conversation with ${name} below.`}
          className="border-0 bg-transparent"
        />
      ) : (
        <ul
          data-ocid="admin.messages.thread_list"
          className="flex max-h-[28rem] flex-col gap-3 overflow-y-auto pr-1"
        >
          {messages.map((message, index) => (
            <li
              key={message.id.toString()}
              data-ocid={`admin.messages.message.${index + 1}`}
              className={cn(
                "max-w-[85%] rounded-2xl border px-4 py-3",
                message.fromAdmin
                  ? "ml-auto border-[oklch(var(--admin-primary))] bg-[oklch(var(--admin-surface-alt))]"
                  : "mr-auto border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface))]",
              )}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-[oklch(var(--admin-muted-foreground))]">
                  {message.fromAdmin ? "You" : name}
                </span>
                {message.jobId !== undefined && (
                  <AdminStatusBadge
                    tone="confirmed"
                    label={`Job #${message.jobId.toString()}`}
                    className="px-2 py-0.5 text-[0.65rem]"
                  />
                )}
              </div>
              <p className="mt-1 whitespace-pre-wrap break-words text-base text-[oklch(var(--admin-foreground))]">
                {message.body}
              </p>
              <p className="mt-1 text-xs text-[oklch(var(--admin-muted-foreground))]">
                {formatDateTime(message.createdAt)}
              </p>
            </li>
          ))}
        </ul>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-4 border-t border-[oklch(var(--admin-border))] pt-4"
      >
        <AdminField
          label="Reply to the customer"
          htmlFor="admin-message-reply"
          error={error}
        >
          <AdminTextarea
            id="admin-message-reply"
            data-ocid="admin.messages.reply_input"
            value={body}
            onChange={(event) => {
              setBody(event.target.value);
              setError(null);
            }}
            placeholder={`Write a reply to ${name}…`}
          />
        </AdminField>
        <AdminButton
          type="submit"
          data-ocid="admin.messages.send_button"
          disabled={sendMessage.isPending || body.trim().length === 0}
          className="mt-3 w-full sm:w-auto"
        >
          <Send className="size-4" />
          {sendMessage.isPending ? "Sending…" : "Send reply"}
        </AdminButton>
      </form>
    </AdminCard>
  );
}
