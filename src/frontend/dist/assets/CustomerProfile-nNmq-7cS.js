import { r as __toESM } from "./rolldown-runtime-SbdDWaPq.js";
import { r as useInternetIdentity } from "./dist-DCUbDtYL.js";
import { G as getService, J as CustomerStatus, K as cn, ct as require_react, h as formatReference, it as ServiceCategory, m as formatMoney, p as formatDateTime, st as require_jsx_runtime, t as createLucideIcon } from "./createLucideIcon-CK3986Sn.js";
import { t as ArrowLeft } from "./arrow-left-JcWOqFAW.js";
import { t as Check } from "./check-qhjPHsNw.js";
import { C as AdminChip, D as AdminButton, E as AdminCardHeader, O as AdminPageHeader, T as AdminCard, _ as AdminField, b as AdminTextarea, g as AdminEmptyState, k as AdminShell, n as AdminLoadingState, t as AdminErrorState, v as AdminInput, w as AdminStatusBadge, y as AdminSelect } from "./admin-DxTl2OJo.js";
import { t as Mail } from "./mail-CjefN9m4.js";
import { t as MessageSquare } from "./message-square-Ciq8dACq.js";
import { t as Plus } from "./plus-BbIZ9xgk.js";
import { t as Send } from "./send-BC-7IC_M.js";
import { t as ShieldAlert } from "./shield-alert-CwcHCNy3.js";
import { a as X, c as Phone, g as Link, u as LogIn, v as useParams, w as useIsAdmin } from "./index-DhzL9CXu.js";
import { a as useCreateJobForCustomer, g as useSetCustomerStatus, h as useSendAdminMessage, m as useRestoreCustomer, n as useAddCustomerNote, o as useCustomerMessages, r as useArchiveCustomer, s as useCustomerProfile, v as useUpdateCustomer } from "./useCustomers-it81kN8P.js";
import { d as getDepositStatusMeta, i as adminStatusForJob } from "./admin-CtzrkfjB.js";
import { c as getCustomerStatusMeta, l as getPreferredContactMeta, n as PREFERRED_CONTACTS, o as formatCustomerSince, r as customerDisplayName, t as CUSTOMER_STATUSES } from "./customers-CXB1Kudi.js";
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Image = createLucideIcon("image", [
	["rect", {
		width: "18",
		height: "18",
		x: "3",
		y: "3",
		rx: "2",
		ry: "2",
		key: "1m3agn"
	}],
	["circle", {
		cx: "9",
		cy: "9",
		r: "2",
		key: "af1f0g"
	}],
	["path", {
		d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",
		key: "1xmnt7"
	}]
]);
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var RotateCcw = createLucideIcon("rotate-ccw", [["path", {
	d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",
	key: "1357e3"
}], ["path", {
	d: "M3 3v5h5",
	key: "1xhq8a"
}]]);
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var StickyNote = createLucideIcon("sticky-note", [["path", {
	d: "M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z",
	key: "qazsjp"
}], ["path", {
	d: "M15 3v4a2 2 0 0 0 2 2h4",
	key: "40519r"
}]]);
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var UserRound = createLucideIcon("user-round", [["circle", {
	cx: "12",
	cy: "8",
	r: "5",
	key: "1hypcn"
}], ["path", {
	d: "M20 21a8 8 0 0 0-16 0",
	key: "rfgkzh"
}]]);
// src/pages/CustomerProfile.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/**
* Admin customer profile.
*
* The full record for one customer on the light, high-contrast admin ground:
* contact details with inline edit, the customer's service history grouped by
* outcome, payments and appointments, notes and the message thread — plus the
* lifecycle actions (update status, new service request, archive/restore).
* Admin-only; the backend enforces the same boundary.
*/
function CustomerProfilePage() {
	const { data: isAdmin, isLoading: roleLoading } = useIsAdmin();
	const { login, loginStatus } = useInternetIdentity();
	if (roleLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLoadingState, {
		"data-ocid": "customer_profile.loading_state",
		label: "Checking access"
	}) });
	if (!isAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminEmptyState, {
		"data-ocid": "customer_profile.access_denied_state",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-6" }),
		title: "Admin access required",
		description: "Sign in with an administrator identity to view customer profiles.",
		action: loginStatus !== "success" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminButton, {
			"data-ocid": "customer_profile.login_button",
			onClick: () => login(),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "size-4" }), "Sign in"]
		}) : void 0
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomerProfileBody, {});
}
function CustomerProfileBody() {
	const params = useParams({ from: "/admin/customers/$customerId" });
	const customerId = (0, import_react.useMemo)(() => {
		const raw = params.customerId;
		if (!/^\d+$/.test(raw)) return null;
		try {
			return BigInt(raw);
		} catch {
			return null;
		}
	}, [params.customerId]);
	const profileQuery = useCustomerProfile(customerId);
	const profile = profileQuery.data ?? null;
	if (customerId === null) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminErrorState, {
		"data-ocid": "customer_profile.invalid_state",
		message: "That customer link is not valid. Return to the directory and choose a customer."
	}) });
	if (profileQuery.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLoadingState, {
		"data-ocid": "customer_profile.profile_loading_state",
		label: "Loading the profile"
	}) });
	if (profileQuery.isError) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminErrorState, {
		"data-ocid": "customer_profile.profile_error_state",
		message: "We couldn't load this customer. Please try again.",
		onRetry: () => void profileQuery.refetch()
	}) });
	if (!profile) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminEmptyState, {
		"data-ocid": "customer_profile.not_found_state",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, { className: "size-6" }),
		title: "Customer not found",
		description: "No customer matches this link. They may have been removed."
	}) });
	const customer = profile.customer;
	const statusMeta = getCustomerStatusMeta(customer.status);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ProfileShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
		eyebrow: "Customer profile",
		title: customerDisplayName(customer),
		description: `Customer since ${formatCustomerSince(customer.createdAt)}`,
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminStatusBadge, {
			"data-ocid": "customer_profile.status_chip",
			tone: statusToneForCustomer(customer.status),
			label: statusMeta.label,
			dot: true
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminChip, {
			"data-ocid": "customer_profile.preferred_contact_chip",
			children: getPreferredContactMeta(customer.preferredContact).label
		})] })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-w-0 flex-col gap-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactCard, {
					customerId,
					profile
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServiceHistoryCard, { profile }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentsAppointmentsCard, { profile })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-w-0 flex-col gap-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LifecycleCard, {
					customerId,
					profile
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewRequestCard, {
					customerId,
					profile
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotesCard, {
					customerId,
					profile
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageThread, { customerId })
			]
		})]
	})] });
}
function ProfileShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-ocid": "customer_profile.page",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/admin/customers",
			"data-ocid": "customer_profile.back_link",
			className: "mb-4 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-[oklch(var(--admin-muted-foreground))] transition-smooth hover:text-[oklch(var(--admin-primary))]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), "Back to customers"]
		}), children]
	}) });
}
/** Map a customer lifecycle status onto the shared admin badge tone. */
function statusToneForCustomer(status) {
	switch (status) {
		case CustomerStatus.active: return "approved";
		case CustomerStatus.inactive: return "waiting";
		default: return "cancelled";
	}
}
function ContactCard({ customerId, profile }) {
	const customer = profile.customer;
	const update = useUpdateCustomer();
	const [editing, setEditing] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		fullName: customer.fullName,
		phone: customer.phone,
		email: customer.email,
		serviceAddress: customer.serviceAddress,
		preferredContact: customer.preferredContact
	});
	const [error, setError] = (0, import_react.useState)(null);
	const [saved, setSaved] = (0, import_react.useState)(false);
	const set = (key, value) => {
		setForm((current) => ({
			...current,
			[key]: value
		}));
		setSaved(false);
		setError(null);
	};
	const startEdit = () => {
		setForm({
			fullName: customer.fullName,
			phone: customer.phone,
			email: customer.email,
			serviceAddress: customer.serviceAddress,
			preferredContact: customer.preferredContact
		});
		setError(null);
		setSaved(false);
		setEditing(true);
	};
	const handleSave = () => {
		if (form.fullName.trim().length < 2) {
			setError("Enter the customer's full name.");
			return;
		}
		if (!EMAIL_PATTERN.test(form.email.trim())) {
			setError("Enter a valid email address.");
			return;
		}
		if (form.phone.trim().length < 7) {
			setError("Enter a phone number we can reach them on.");
			return;
		}
		if (form.serviceAddress.trim().length < 3) {
			setError("Enter the service address.");
			return;
		}
		setError(null);
		update.mutate({
			id: customerId,
			input: {
				fullName: form.fullName.trim(),
				phone: form.phone.trim(),
				email: form.email.trim(),
				serviceAddress: form.serviceAddress.trim(),
				preferredContact: form.preferredContact
			}
		}, {
			onSuccess: (result) => {
				if (result.__kind__ === "ok") {
					setSaved(true);
					setEditing(false);
				} else setError(result.err.__kind__ === "invalidInput" ? result.err.invalidInput : "We couldn't save those details. Please try again.");
			},
			onError: () => {
				setError("We couldn't save those details. Please try again.");
			}
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminCard, {
		"data-ocid": "customer_profile.contact_card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminCardHeader, {
				title: "Contact information",
				description: "Saved once and reused for every request, quote and job.",
				action: editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminButton, {
					variant: "secondary",
					size: "sm",
					"data-ocid": "customer_profile.edit_cancel_button",
					onClick: () => setEditing(false),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), "Cancel"]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminButton, {
					size: "sm",
					"data-ocid": "customer_profile.edit_button",
					onClick: startEdit,
					children: "Edit contact"
				})
			}),
			editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				"data-ocid": "customer_profile.edit_panel",
				className: "grid gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
						label: "Full name",
						htmlFor: "cp-full-name",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminInput, {
							id: "cp-full-name",
							className: "form-field",
							"data-ocid": "customer_profile.edit_name_input",
							value: form.fullName,
							onChange: (event) => set("fullName", event.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
							label: "Phone",
							htmlFor: "cp-phone",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminInput, {
								id: "cp-phone",
								type: "tel",
								className: "form-field",
								"data-ocid": "customer_profile.edit_phone_input",
								value: form.phone,
								onChange: (event) => set("phone", event.target.value)
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
							label: "Email",
							htmlFor: "cp-email",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminInput, {
								id: "cp-email",
								type: "email",
								className: "form-field",
								"data-ocid": "customer_profile.edit_email_input",
								value: form.email,
								onChange: (event) => set("email", event.target.value)
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
						label: "Service address",
						htmlFor: "cp-address",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminInput, {
							id: "cp-address",
							className: "form-field",
							"data-ocid": "customer_profile.edit_address_input",
							value: form.serviceAddress,
							onChange: (event) => set("serviceAddress", event.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
						label: "Preferred contact method",
						htmlFor: "cp-preferred",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminSelect, {
							id: "cp-preferred",
							className: "form-field",
							"data-ocid": "customer_profile.edit_preferred_select",
							value: form.preferredContact,
							onChange: (event) => set("preferredContact", event.target.value),
							children: PREFERRED_CONTACTS.map((method) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: method,
								children: getPreferredContactMeta(method).label
							}, method))
						})
					}),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						"data-ocid": "customer_profile.edit_error_state",
						role: "alert",
						className: "text-sm font-medium text-[oklch(var(--admin-status-action))]",
						children: error
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-col gap-3 sm:flex-row sm:items-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminButton, {
							"data-ocid": "customer_profile.edit_save_button",
							disabled: update.isPending,
							onClick: handleSave,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }), update.isPending ? "Saving…" : "Save changes"]
						})
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "grid gap-4 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactRow, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-4" }),
						label: "Phone",
						value: customer.phone,
						href: `tel:${customer.phone.replace(/[^\d+]/g, "")}`,
						ocid: "customer_profile.phone_link"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactRow, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "size-4" }),
						label: "Email",
						value: customer.email,
						href: `mailto:${customer.email}`,
						ocid: "customer_profile.email_link"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactRow, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, { className: "size-4" }),
						label: "Service address",
						value: customer.serviceAddress,
						ocid: "customer_profile.address"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactRow, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "size-4" }),
						label: "Preferred contact",
						value: getPreferredContactMeta(customer.preferredContact).label,
						ocid: "customer_profile.preferred_contact"
					})
				]
			}),
			saved && !editing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				"data-ocid": "customer_profile.edit_saved_state",
				className: "mt-4 text-sm font-medium text-[oklch(var(--admin-status-paid))]",
				children: "Contact information saved."
			})
		]
	});
}
function ContactRow({ icon, label, value, href, ocid }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dt", {
			className: "flex items-center gap-1.5 text-sm font-semibold text-[oklch(var(--admin-muted-foreground))]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"aria-hidden": "true",
				className: "text-[oklch(var(--admin-primary))]",
				children: icon
			}), label]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "mt-1 min-w-0",
			children: href ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href,
				"data-ocid": ocid,
				className: "inline-flex max-w-full items-center gap-1.5 truncate text-base font-semibold text-[oklch(var(--admin-primary))] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(var(--admin-ring))]",
				children: value
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"data-ocid": ocid,
				className: "block break-words text-base font-semibold text-[oklch(var(--admin-foreground))]",
				children: value
			})
		})]
	});
}
function LifecycleCard({ customerId, profile }) {
	const customer = profile.customer;
	const setStatus = useSetCustomerStatus();
	const archive = useArchiveCustomer();
	const restore = useRestoreCustomer();
	const [statusOpen, setStatusOpen] = (0, import_react.useState)(false);
	const archived = customer.status === CustomerStatus.archived;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminCard, {
		"data-ocid": "customer_profile.lifecycle_card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminCardHeader, {
				title: "Status & actions",
				description: "Change where this customer stands or archive the record."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminStatusBadge, {
					"data-ocid": "customer_profile.lifecycle_status",
					tone: statusToneForCustomer(customer.status),
					label: getCustomerStatusMeta(customer.status).label,
					dot: true
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminButton, {
					variant: "secondary",
					size: "sm",
					"data-ocid": "customer_profile.update_status_button",
					"aria-expanded": statusOpen,
					disabled: setStatus.isPending,
					onClick: () => setStatusOpen((open) => !open),
					children: "Update status"
				})]
			}),
			statusOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"data-ocid": "customer_profile.status_options",
				className: "mt-4 flex flex-wrap gap-2",
				children: CUSTOMER_STATUSES.map((status) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminButton, {
					variant: status === customer.status ? "primary" : "secondary",
					size: "sm",
					"data-ocid": `customer_profile.status_option.${status}`,
					disabled: setStatus.isPending,
					onClick: () => {
						setStatus.mutate({
							id: customerId,
							status
						});
						setStatusOpen(false);
					},
					children: getCustomerStatusMeta(status).label
				}, status))
			}),
			setStatus.isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				"data-ocid": "customer_profile.status_error_state",
				role: "alert",
				className: "mt-3 text-sm font-medium text-[oklch(var(--admin-status-action))]",
				children: "We couldn't update the status. Please try again."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 border-t border-[oklch(var(--admin-border))] pt-5",
				children: [
					archived ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminButton, {
						variant: "secondary",
						"data-ocid": "customer_profile.restore_button",
						disabled: restore.isPending,
						onClick: () => restore.mutate(customerId),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-4" }), restore.isPending ? "Restoring…" : "Restore customer"]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminButton, {
						variant: "danger",
						"data-ocid": "customer_profile.archive_button",
						disabled: archive.isPending,
						onClick: () => archive.mutate(customerId),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), archive.isPending ? "Archiving…" : "Archive customer"]
					}),
					archive.isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						"data-ocid": "customer_profile.archive_error_state",
						role: "alert",
						className: "mt-3 text-sm font-medium text-[oklch(var(--admin-status-action))]",
						children: "We couldn't archive this customer. Please try again."
					}),
					restore.isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						"data-ocid": "customer_profile.restore_error_state",
						role: "alert",
						className: "mt-3 text-sm font-medium text-[oklch(var(--admin-status-action))]",
						children: "We couldn't restore this customer. Please try again."
					})
				]
			})
		]
	});
}
function NewRequestCard({ customerId, profile }) {
	const customer = profile.customer;
	const createRequest = useCreateJobForCustomer();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [category, setCategory] = (0, import_react.useState)(ServiceCategory.fixIt);
	const [preferredTiming, setPreferredTiming] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [created, setCreated] = (0, import_react.useState)(null);
	const reset = () => {
		setCategory(ServiceCategory.fixIt);
		setPreferredTiming("");
		setDescription("");
		setError(null);
	};
	const handleCreate = () => {
		if (description.trim().length < 3) {
			setError("Tell us what needs doing.");
			return;
		}
		setError(null);
		createRequest.mutate({
			customerId,
			input: {
				customerName: customer.fullName,
				email: customer.email,
				phone: customer.phone,
				category,
				preferredTiming: preferredTiming.trim(),
				description: description.trim(),
				photoIds: [],
				ownParts: false,
				packageInterest: false
			}
		}, {
			onSuccess: (result) => {
				if (result.__kind__ === "ok") {
					setCreated(result.ok.referenceCode);
					reset();
					setOpen(false);
				} else setError("We couldn't create that request. Please try again.");
			},
			onError: () => {
				setError("We couldn't create that request. Please try again.");
			}
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminCard, {
		"data-ocid": "customer_profile.new_request_card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminCardHeader, {
				title: "New service request",
				description: "Book work for this customer without re-entering their details.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminButton, {
					size: "sm",
					"data-ocid": "customer_profile.new_request_button",
					"aria-expanded": open,
					onClick: () => {
						setOpen((value) => !value);
						setCreated(null);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "New service request"]
				})
			}),
			created && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				"data-ocid": "customer_profile.new_request_success_state",
				className: "mb-4 rounded-xl border border-[oklch(var(--admin-status-paid))] bg-[oklch(var(--admin-surface-alt))] px-4 py-3 text-base font-semibold text-[oklch(var(--admin-status-paid))]",
				children: [
					"Request ",
					formatReference(created),
					" created for",
					" ",
					customerDisplayName(customer),
					"."
				]
			}),
			open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				"data-ocid": "customer_profile.new_request_panel",
				className: "grid gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "rounded-xl border border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface-alt))] px-4 py-3 text-sm text-[oklch(var(--admin-muted-foreground))]",
						children: [
							"This request uses ",
							customerDisplayName(customer),
							"'s saved contact information — ",
							customer.email,
							" · ",
							customer.phone,
							"."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
						label: "Service",
						htmlFor: "cp-request-category",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminSelect, {
							id: "cp-request-category",
							className: "form-field",
							"data-ocid": "customer_profile.new_request_category_select",
							value: category,
							onChange: (event) => setCategory(event.target.value),
							children: SERVICE_CATEGORIES.map((value) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value,
								children: getService(value).label
							}, value))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
						label: "When works best",
						htmlFor: "cp-request-timing",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminInput, {
							id: "cp-request-timing",
							className: "form-field",
							"data-ocid": "customer_profile.new_request_timing_input",
							value: preferredTiming,
							placeholder: "Weekday mornings",
							onChange: (event) => setPreferredTiming(event.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
						label: "What needs doing",
						htmlFor: "cp-request-description",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminTextarea, {
							id: "cp-request-description",
							className: "form-field",
							"data-ocid": "customer_profile.new_request_description_input",
							value: description,
							placeholder: "The back gate hinge is loose.",
							onChange: (event) => setDescription(event.target.value)
						})
					}),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						"data-ocid": "customer_profile.new_request_error_state",
						role: "alert",
						className: "text-sm font-medium text-[oklch(var(--admin-status-action))]",
						children: error
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-3 sm:flex-row sm:items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminButton, {
							"data-ocid": "customer_profile.new_request_submit_button",
							disabled: createRequest.isPending,
							onClick: handleCreate,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), createRequest.isPending ? "Creating…" : "Create request"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminButton, {
							variant: "secondary",
							"data-ocid": "customer_profile.new_request_cancel_button",
							disabled: createRequest.isPending,
							onClick: () => {
								reset();
								setOpen(false);
							},
							children: "Cancel"
						})]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-base text-[oklch(var(--admin-muted-foreground))]",
				children: "Start a request and it is linked to this customer automatically."
			})
		]
	});
}
var SERVICE_CATEGORIES = [
	ServiceCategory.fixIt,
	ServiceCategory.house,
	ServiceCategory.yardPlants,
	ServiceCategory.cleanOrganize,
	ServiceCategory.moveLift,
	ServiceCategory.errands,
	ServiceCategory.mowing,
	ServiceCategory.showMe
];
function ServiceHistoryCard({ profile }) {
	const groups = (0, import_react.useMemo)(() => [
		{
			key: "pending",
			label: "Pending & active",
			jobs: sortNewestFirst(profile.pendingJobs)
		},
		{
			key: "completed",
			label: "Completed",
			jobs: sortNewestFirst(profile.completedJobs)
		},
		{
			key: "cancelled",
			label: "Cancelled",
			jobs: sortNewestFirst(profile.cancelledJobs)
		}
	], [
		profile.pendingJobs,
		profile.completedJobs,
		profile.cancelledJobs
	]);
	const total = groups.reduce((sum, group) => sum + group.jobs.length, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminCard, {
		"data-ocid": "customer_profile.service_history_card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminCardHeader, {
			title: "Service history",
			description: "Every request this customer has made, grouped by outcome.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminChip, {
				"data-ocid": "customer_profile.service_history_count",
				children: [
					total,
					" ",
					total === 1 ? "request" : "requests"
				]
			})
		}), total === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminEmptyState, {
			"data-ocid": "customer_profile.service_history_empty_state",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StickyNote, { className: "size-6" }),
			title: "No service requests yet",
			description: "Requests this customer submits appear here with their quotes and status."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col gap-5",
			children: groups.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				"data-ocid": `customer_profile.history_group.${group.key}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "admin-label mb-2",
					children: [
						group.label,
						" · ",
						group.jobs.length
					]
				}), group.jobs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-[oklch(var(--admin-muted-foreground))]",
					children: "Nothing here yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "flex flex-col gap-3",
					children: group.jobs.map((job, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HistoryRow, {
						job,
						index: index + 1
					}, job.id.toString()))
				})]
			}, group.key))
		})]
	});
}
function HistoryRow({ job, index }) {
	const status = adminStatusForJob(job.status);
	const quote = job.quote;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		"data-ocid": `customer_profile.history_item.${index}`,
		className: "rounded-xl border border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface-alt))] p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-base font-bold text-[oklch(var(--admin-foreground))]",
						children: getService(job.category).label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-0.5 font-mono text-sm text-[oklch(var(--admin-muted-foreground))]",
						children: [
							formatReference(job.referenceCode),
							" ·",
							" ",
							formatDateTime(job.createdAt)
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminStatusBadge, {
					"data-ocid": `customer_profile.history_status.${index}`,
					tone: status.tone,
					label: status.label,
					dot: true
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-base text-[oklch(var(--admin-foreground))]",
				children: job.description
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm",
				children: [quote && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-[oklch(var(--admin-muted-foreground))]",
					children: [
						"Quote",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono font-semibold text-[oklch(var(--admin-foreground))]",
							children: formatMoney(quote.amount)
						})
					]
				}), job.preferredTiming && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-[oklch(var(--admin-muted-foreground))]",
					children: ["Preferred timing: ", job.preferredTiming]
				})]
			})
		]
	});
}
function sortNewestFirst(jobs) {
	return [...jobs].sort((a, b) => a.createdAt === b.createdAt ? 0 : a.createdAt > b.createdAt ? -1 : 1);
}
function PaymentsAppointmentsCard({ profile }) {
	const deposits = (0, import_react.useMemo)(() => sortDepositsNewestFirst(profile.deposits), [profile.deposits]);
	const appointments = (0, import_react.useMemo)(() => sortAppointmentsNewestFirst(profile.appointments), [profile.appointments]);
	const photos = profile.photoIds;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminCard, {
		"data-ocid": "customer_profile.payments_appointments_card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminCardHeader, {
			title: "Payments & appointments",
			description: "Deposits recorded, scheduled visits and job photos."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "admin-label mb-2",
					children: "Deposits"
				}), deposits.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					"data-ocid": "customer_profile.deposits_empty_state",
					className: "text-base text-[oklch(var(--admin-muted-foreground))]",
					children: "No deposits recorded yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					"data-ocid": "customer_profile.deposits_list",
					className: "flex flex-col gap-2",
					children: deposits.map((deposit, index) => {
						const meta = getDepositStatusMeta(deposit.status);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							"data-ocid": `customer_profile.deposit_item.${index + 1}`,
							className: "flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface-alt))] px-4 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-base font-semibold text-[oklch(var(--admin-foreground))]",
								children: formatMoney(deposit.amount)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminStatusBadge, {
								tone: meta.tone,
								label: meta.label,
								dot: true
							})]
						}, `${deposit.paidAt?.toString() ?? "deposit"}-${index}`);
					})
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "admin-label mb-2",
					children: "Appointments"
				}), appointments.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					"data-ocid": "customer_profile.appointments_empty_state",
					className: "text-base text-[oklch(var(--admin-muted-foreground))]",
					children: "No appointments scheduled yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					"data-ocid": "customer_profile.appointments_list",
					className: "flex flex-col gap-2",
					children: appointments.map((appointment, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						"data-ocid": `customer_profile.appointment_item.${index + 1}`,
						className: "flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface-alt))] px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-base font-semibold text-[oklch(var(--admin-foreground))]",
							children: formatDateTime(appointment.scheduledAt)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminStatusBadge, {
							tone: appointment.confirmed ? "confirmed" : "waiting",
							label: appointment.confirmed ? "Confirmed" : "Pending",
							dot: true
						})]
					}, `${appointment.scheduledAt.toString()}-${index}`))
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "admin-label mb-2",
					children: "Photos"
				}), photos.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					"data-ocid": "customer_profile.photos_empty_state",
					className: "text-base text-[oklch(var(--admin-muted-foreground))]",
					children: "No photos attached yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					"data-ocid": "customer_profile.photos_list",
					className: "flex flex-wrap gap-2",
					children: photos.map((photoId, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						"data-ocid": `customer_profile.photo_item.${index + 1}`,
						className: "flex items-center gap-2 rounded-lg border border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface-alt))] px-3 py-2 text-sm text-[oklch(var(--admin-muted-foreground))]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, {
							className: "size-4",
							"aria-hidden": "true"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono",
							children: shortPhotoId(photoId)
						})]
					}, photoId))
				})] })
			]
		})]
	});
}
function sortDepositsNewestFirst(deposits) {
	return [...deposits].sort((a, b) => {
		const aTime = a.paidAt ?? a.submittedAt ?? 0n;
		const bTime = b.paidAt ?? b.submittedAt ?? 0n;
		return aTime === bTime ? 0 : aTime > bTime ? -1 : 1;
	});
}
function sortAppointmentsNewestFirst(appointments) {
	return [...appointments].sort((a, b) => a.scheduledAt === b.scheduledAt ? 0 : a.scheduledAt > b.scheduledAt ? -1 : 1);
}
function shortPhotoId(photoId) {
	return photoId.length > 18 ? `${photoId.slice(0, 18)}…` : photoId;
}
function NotesCard({ customerId, profile }) {
	const customer = profile.customer;
	const addNote = useAddCustomerNote();
	const [body, setBody] = (0, import_react.useState)("");
	const [internalBody, setInternalBody] = (0, import_react.useState)("");
	const [showInternal, setShowInternal] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const notes = (0, import_react.useMemo)(() => [...customer.notes].sort((a, b) => a.createdAt === b.createdAt ? 0 : a.createdAt > b.createdAt ? -1 : 1), [customer.notes]);
	const handleAdd = () => {
		const next = body.trim();
		if (next.length === 0) {
			setError("Write a note before saving.");
			return;
		}
		setError(null);
		setBody("");
		addNote.mutate({
			id: customerId,
			body: next
		}, { onError: () => {
			setError("We couldn't save that note. Please try again.");
			setBody((current) => current === "" ? next : current);
		} });
	};
	const handleAddInternal = () => {
		const next = internalBody.trim();
		if (next.length === 0) {
			setError("Write a note before saving.");
			return;
		}
		setError(null);
		setInternalBody("");
		addNote.mutate({
			id: customerId,
			body: next
		}, { onError: () => {
			setError("We couldn't save that note. Please try again.");
			setInternalBody((current) => current === "" ? next : current);
		} });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminCard, {
		"data-ocid": "customer_profile.notes_card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminCardHeader, {
				title: "Notes",
				description: "Internal notes about this customer."
			}),
			notes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				"data-ocid": "customer_profile.notes_empty_state",
				className: "text-base text-[oklch(var(--admin-muted-foreground))]",
				children: "No notes yet. Add the first one below."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				"data-ocid": "customer_profile.notes_list",
				className: "flex flex-col gap-2",
				children: notes.map((note, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					"data-ocid": `customer_profile.note_item.${index + 1}`,
					className: "rounded-lg border border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface-alt))] px-3 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-base text-[oklch(var(--admin-foreground))]",
						children: note.body
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-[oklch(var(--admin-muted-foreground))]",
						children: formatDateTime(note.createdAt)
					})]
				}, note.id.toString()))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 border-t border-[oklch(var(--admin-border))] pt-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
						label: "Add a note",
						htmlFor: "cp-notes-add",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminTextarea, {
							id: "cp-notes-add",
							className: "form-field",
							"data-ocid": "customer_profile.notes_input",
							value: body,
							onChange: (event) => {
								setBody(event.target.value);
								setError(null);
							},
							placeholder: "Gate code is 4821. Prefers texts before 9am."
						})
					}),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						"data-ocid": "customer_profile.notes_error_state",
						role: "alert",
						className: "mt-2 text-sm font-medium text-[oklch(var(--admin-status-action))]",
						children: error
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminButton, {
						size: "sm",
						"data-ocid": "customer_profile.notes_save_button",
						disabled: addNote.isPending || body.trim().length === 0,
						onClick: handleAdd,
						className: "mt-3 w-full sm:w-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StickyNote, { className: "size-4" }), addNote.isPending ? "Saving…" : "Add note"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminButton, {
							variant: "secondary",
							size: "sm",
							"data-ocid": "customer_profile.add_note_button",
							"aria-expanded": showInternal,
							onClick: () => setShowInternal((value) => !value),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Add internal note"]
						})
					}),
					showInternal && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						"data-ocid": "customer_profile.internal_note_panel",
						className: "mt-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
							label: "Internal note",
							htmlFor: "cp-notes-internal",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminTextarea, {
								id: "cp-notes-internal",
								className: "form-field",
								"data-ocid": "customer_profile.internal_note_input",
								value: internalBody,
								onChange: (event) => {
									setInternalBody(event.target.value);
									setError(null);
								},
								placeholder: "Only visible to the team."
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminButton, {
							size: "sm",
							"data-ocid": "customer_profile.internal_note_save_button",
							disabled: addNote.isPending || internalBody.trim().length === 0,
							onClick: handleAddInternal,
							className: "mt-3 w-full sm:w-auto",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StickyNote, { className: "size-4" }), addNote.isPending ? "Saving…" : "Save internal note"]
						})]
					})
				]
			})
		]
	});
}
function MessageThread({ customerId }) {
	const messagesQuery = useCustomerMessages(customerId);
	const sendMessage = useSendAdminMessage();
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
		"data-ocid": "customer_profile.messages_card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminCardHeader, {
				title: "Messages",
				description: "Messages exchanged with this customer."
			}),
			messagesQuery.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLoadingState, {
				"data-ocid": "customer_profile.messages_loading_state",
				label: "Loading messages"
			}) : messagesQuery.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminErrorState, {
				"data-ocid": "customer_profile.messages_error_state",
				message: "We couldn't load the message thread.",
				onRetry: () => void messagesQuery.refetch()
			}) : messages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				"data-ocid": "customer_profile.messages_empty_state",
				className: "text-base text-[oklch(var(--admin-muted-foreground))]",
				children: "No messages yet. Start the conversation below."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				"data-ocid": "customer_profile.messages_list",
				className: "flex max-h-96 flex-col gap-3 overflow-y-auto pr-1",
				children: messages.map((message, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageBubble, {
					message,
					index: index + 1
				}, message.id.toString()))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 border-t border-[oklch(var(--admin-border))] pt-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
						label: "Reply to the customer",
						htmlFor: "cp-message-reply",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminTextarea, {
							id: "cp-message-reply",
							className: "form-field",
							"data-ocid": "customer_profile.message_input",
							value: body,
							onChange: (event) => {
								setBody(event.target.value);
								setError(null);
							},
							placeholder: "Thanks for reaching out — we can be there Thursday morning."
						})
					}),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						"data-ocid": "customer_profile.message_error_state",
						role: "alert",
						className: "mt-2 text-sm font-medium text-[oklch(var(--admin-status-action))]",
						children: error
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminButton, {
						size: "sm",
						"data-ocid": "customer_profile.message_send_button",
						disabled: sendMessage.isPending || body.trim().length === 0,
						onClick: handleSend,
						className: "mt-3 w-full sm:w-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4" }), sendMessage.isPending ? "Sending…" : "Send reply"]
					})
				]
			})
		]
	});
}
function MessageBubble({ message, index }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		"data-ocid": `customer_profile.message_item.${index}`,
		className: cn("max-w-[85%] rounded-2xl border px-4 py-2.5", message.fromAdmin ? "ml-auto border-[oklch(var(--admin-primary))] bg-[oklch(var(--admin-primary))] text-[oklch(var(--admin-primary-foreground))]" : "mr-auto border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface-alt))] text-[oklch(var(--admin-foreground))]"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cn("text-sm font-semibold uppercase tracking-[0.14em]", message.fromAdmin ? "text-[oklch(var(--admin-primary-foreground))] opacity-80" : "text-[oklch(var(--admin-muted-foreground))]"),
				children: message.fromAdmin ? "You" : "Customer"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-base",
				children: message.body
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cn("mt-1 text-sm", message.fromAdmin ? "text-[oklch(var(--admin-primary-foreground))] opacity-80" : "text-[oklch(var(--admin-muted-foreground))]"),
				children: formatDateTime(message.createdAt)
			})
		]
	});
}
export { CustomerProfilePage };
