import { r as __toESM } from "./rolldown-runtime-SbdDWaPq.js";
import { r as useInternetIdentity } from "./dist-DCUbDtYL.js";
import { K as cn, ct as require_react, p as formatDateTime, st as require_jsx_runtime } from "./createLucideIcon-CK3986Sn.js";
import { t as ArrowLeft } from "./arrow-left-JcWOqFAW.js";
import { C as AdminChip, D as AdminButton, E as AdminCardHeader, O as AdminPageHeader, T as AdminCard, _ as AdminField, b as AdminTextarea, g as AdminEmptyState, k as AdminShell, n as AdminLoadingState, t as AdminErrorState, w as AdminStatusBadge } from "./admin-DxTl2OJo.js";
import { t as MessageSquare } from "./message-square-Ciq8dACq.js";
import { t as Send } from "./send-BC-7IC_M.js";
import { t as ShieldAlert } from "./shield-alert-CwcHCNy3.js";
import { l as MessagesSquare, u as LogIn, w as useIsAdmin } from "./index-DhzL9CXu.js";
import { h as useSendAdminMessage, l as useCustomers, o as useCustomerMessages } from "./useCustomers-it81kN8P.js";
import { i as customerInitials, r as customerDisplayName } from "./customers-CXB1Kudi.js";
// src/pages/admin/Messages.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
/** Oldest-first ordering for a message thread. */
function sortThread(messages) {
	return [...messages].sort((a, b) => a.createdAt === b.createdAt ? 0 : a.createdAt > b.createdAt ? 1 : -1);
}
/** A short preview of the most recent message in a thread. */
function previewText(message) {
	if (!message) return "No messages yet — start the conversation.";
	const body = message.body.trim().replace(/\s+/g, " ");
	return `${message.fromAdmin ? "You: " : ""}${body}`;
}
/**
* Admin Messages page.
*
* A list of customer conversations the owner can open to read the full thread
* and reply. Messages are connected to the customer and, where the thread
* carries one, the request or job. The layout is a two-pane workspace on wide
* screens and a single-pane drill-in on phones, so nothing ever scrolls
* sideways.
*/
function MessagesPage() {
	const { data: isAdmin, isLoading: roleLoading } = useIsAdmin();
	const { login, loginStatus } = useInternetIdentity();
	if (roleLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLoadingState, {
		"data-ocid": "admin.messages.loading_state",
		label: "Checking access"
	}) });
	if (!isAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminEmptyState, {
		"data-ocid": "admin.messages.access_denied",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-6" }),
		title: "Admin access required",
		description: "Sign in with an administrator identity to open the messages workspace.",
		action: loginStatus !== "success" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminButton, {
			"data-ocid": "admin.messages.login_button",
			onClick: () => login(),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "size-4" }), "Sign in"]
		}) : void 0
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessagesWorkspace, {});
}
function MessagesWorkspace() {
	const customersQuery = useCustomers();
	const [selectedId, setSelectedId] = (0, import_react.useState)(null);
	const customers = (0, import_react.useMemo)(() => customersQuery.data ?? [], [customersQuery.data]);
	const selected = (0, import_react.useMemo)(() => selectedId === null ? null : customers.find((customer) => customer.id === selectedId) ?? null, [customers, selectedId]);
	const isLoading = customersQuery.isLoading;
	const isError = customersQuery.isError;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
		eyebrow: "Admin",
		title: "Messages",
		description: "Customer conversations across every job. Open a thread to read it and reply."
	}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLoadingState, {
		"data-ocid": "admin.messages.loading_state",
		label: "Opening conversations"
	}) : isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminErrorState, {
		"data-ocid": "admin.messages.error_state",
		message: "The conversations could not be loaded. Please try again.",
		onRetry: () => void customersQuery.refetch()
	}) : customers.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminEmptyState, {
		"data-ocid": "admin.messages.empty_state",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessagesSquare, { className: "size-6" }),
		title: "No conversations yet",
		description: "When a customer sends a message it will appear here, ready for a reply."
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-5 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminCard, {
			"data-ocid": "admin.messages.list_panel",
			className: cn(selected && "hidden lg:block"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminCardHeader, {
				title: "Conversations",
				description: `${customers.length} ${customers.length === 1 ? "customer" : "customers"}`
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				"data-ocid": "admin.messages.list",
				className: "flex flex-col gap-2",
				children: customers.map((customer, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConversationRow, {
					customer,
					index: index + 1,
					active: customer.id === selectedId,
					onSelect: () => setSelectedId(customer.id)
				}, customer.id.toString()))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("min-w-0", !selected && "hidden lg:block"),
			children: selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConversationThread, {
				customer: selected,
				onBack: () => setSelectedId(null)
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminCard, {
				className: "hidden h-full items-center justify-center lg:flex",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminEmptyState, {
					"data-ocid": "admin.messages.no_selection",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "size-6" }),
					title: "Select a conversation",
					description: "Choose a customer on the left to read the full thread and reply.",
					className: "border-0 bg-transparent"
				})
			})
		})]
	})] });
}
/**
* One conversation in the list.
*
* Each row owns its own thread query so the preview and message count are real
* data, and the hook count stays stable because the row is its own component.
*/
function ConversationRow({ customer, index, active, onSelect }) {
	const messagesQuery = useCustomerMessages(customer.id);
	const messages = (0, import_react.useMemo)(() => sortThread(messagesQuery.data ?? []), [messagesQuery.data]);
	const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
	const name = customerDisplayName(customer);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		"data-ocid": `admin.messages.conversation.${index}`,
		onClick: onSelect,
		"aria-current": active ? "true" : void 0,
		className: cn("flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-smooth", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(var(--admin-ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[oklch(var(--admin-bg))]", active ? "border-[oklch(var(--admin-primary))] bg-[oklch(var(--admin-surface-alt))]" : "border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface))] hover:bg-[oklch(var(--admin-surface-alt))]"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			"aria-hidden": "true",
			className: "flex size-11 shrink-0 items-center justify-center rounded-full bg-[oklch(var(--admin-primary))] text-base font-bold text-[oklch(var(--admin-primary-foreground))]",
			children: customerInitials(name)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "min-w-0 flex-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate text-base font-semibold text-[oklch(var(--admin-foreground))]",
						children: name
					}), lastMessage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "shrink-0 text-xs font-medium text-[oklch(var(--admin-muted-foreground))]",
						children: formatDateTime(lastMessage.createdAt)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-0.5 block truncate text-sm text-[oklch(var(--admin-muted-foreground))]",
					children: messagesQuery.isLoading ? "Loading conversation…" : previewText(lastMessage)
				}),
				messages.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-1.5 flex items-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminChip, {
						className: "px-2 py-0.5 text-xs",
						children: [
							messages.length,
							" ",
							messages.length === 1 ? "message" : "messages"
						]
					})
				})
			]
		})]
	}) });
}
function ConversationThread({ customer, onBack }) {
	const customerId = customer.id;
	const messagesQuery = useCustomerMessages(customerId);
	const sendMessage = useSendAdminMessage();
	const [body, setBody] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const name = customerDisplayName(customer);
	const messages = (0, import_react.useMemo)(() => sortThread(messagesQuery.data ?? []), [messagesQuery.data]);
	const handleSubmit = (event) => {
		event.preventDefault();
		const next = body.trim();
		if (next.length === 0) {
			setError("Write a message before sending.");
			return;
		}
		setError(null);
		setBody("");
		sendMessage.mutate({
			customerId,
			jobId: null,
			body: next
		}, { onError: () => {
			setError("We couldn't send that message. Please try again.");
			setBody((current) => current === "" ? next : current);
		} });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminCard, {
		"data-ocid": "admin.messages.thread_panel",
		className: "flex flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-start gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminButton, {
					variant: "ghost",
					size: "sm",
					"data-ocid": "admin.messages.back_button",
					onClick: onBack,
					className: "lg:hidden",
					"aria-label": "Back to conversations",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), "Back"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "truncate text-lg font-bold text-[oklch(var(--admin-foreground))]",
						children: name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-0.5 truncate text-sm text-[oklch(var(--admin-muted-foreground))]",
						children: customer.email || customer.phone || "No contact details on file"
					})]
				})]
			}),
			messagesQuery.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLoadingState, {
				"data-ocid": "admin.messages.thread_loading_state",
				label: "Loading messages"
			}) : messagesQuery.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminErrorState, {
				"data-ocid": "admin.messages.thread_error_state",
				message: "We couldn't load this conversation. Please try again.",
				onRetry: () => void messagesQuery.refetch()
			}) : messages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminEmptyState, {
				"data-ocid": "admin.messages.thread_empty_state",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "size-6" }),
				title: "No messages yet",
				description: `Start the conversation with ${name} below.`,
				className: "border-0 bg-transparent"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				"data-ocid": "admin.messages.thread_list",
				className: "flex max-h-[28rem] flex-col gap-3 overflow-y-auto pr-1",
				children: messages.map((message, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					"data-ocid": `admin.messages.message.${index + 1}`,
					className: cn("max-w-[85%] rounded-2xl border px-4 py-3", message.fromAdmin ? "ml-auto border-[oklch(var(--admin-primary))] bg-[oklch(var(--admin-surface-alt))]" : "mr-auto border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface))]"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-bold uppercase tracking-[0.14em] text-[oklch(var(--admin-muted-foreground))]",
								children: message.fromAdmin ? "You" : name
							}), message.jobId !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminStatusBadge, {
								tone: "confirmed",
								label: `Job #${message.jobId.toString()}`,
								className: "px-2 py-0.5 text-[0.65rem]"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 whitespace-pre-wrap break-words text-base text-[oklch(var(--admin-foreground))]",
							children: message.body
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-[oklch(var(--admin-muted-foreground))]",
							children: formatDateTime(message.createdAt)
						})
					]
				}, message.id.toString()))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "mt-4 border-t border-[oklch(var(--admin-border))] pt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
					label: "Reply to the customer",
					htmlFor: "admin-message-reply",
					error,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminTextarea, {
						id: "admin-message-reply",
						"data-ocid": "admin.messages.reply_input",
						value: body,
						onChange: (event) => {
							setBody(event.target.value);
							setError(null);
						},
						placeholder: `Write a reply to ${name}…`
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminButton, {
					type: "submit",
					"data-ocid": "admin.messages.send_button",
					disabled: sendMessage.isPending || body.trim().length === 0,
					className: "mt-3 w-full sm:w-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4" }), sendMessage.isPending ? "Sending…" : "Send reply"]
				})]
			})
		]
	});
}
export { MessagesPage };
