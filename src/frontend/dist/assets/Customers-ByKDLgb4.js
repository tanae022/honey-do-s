import { r as __toESM } from "./rolldown-runtime-SbdDWaPq.js";
import { r as useInternetIdentity } from "./dist-DCUbDtYL.js";
import { J as CustomerStatus, K as cn, ct as require_react, nt as PreferredContact, st as require_jsx_runtime, t as createLucideIcon } from "./createLucideIcon-CK3986Sn.js";
import { t as Mail } from "./mail-CjefN9m4.js";
import { t as MapPin } from "./map-pin-DHILvEJZ.js";
import { t as ShieldAlert } from "./shield-alert-CwcHCNy3.js";
import { t as UserPlus } from "./user-plus-DZOyHkAR.js";
import { U as HoneyLoader, a as X, c as Phone, g as Link, s as Users, t as HoneyButton, u as LogIn, w as useIsAdmin } from "./index-DhzL9CXu.js";
import { t as Label } from "./label-DQWmTWtr.js";
import { c as useCustomerSearch, i as useCreateCustomer, l as useCustomers, u as useExportCustomersCsv } from "./useCustomers-it81kN8P.js";
import { a as downloadCustomersCsv, c as getCustomerStatusMeta, i as customerInitials, l as getPreferredContactMeta, n as PREFERRED_CONTACTS, r as customerDisplayName, s as formatJobCount } from "./customers-CXB1Kudi.js";
import { n as HoneyCardHeader, t as HoneyCard } from "./HoneyCard-Dp51lMsB.js";
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Download = createLucideIcon("download", [
	["path", {
		d: "M12 15V3",
		key: "m9g1x1"
	}],
	["path", {
		d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",
		key: "ih7n3h"
	}],
	["path", {
		d: "m7 10 5 5 5-5",
		key: "brsn70"
	}]
]);
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Search = createLucideIcon("search", [["path", {
	d: "m21 21-4.34-4.34",
	key: "14j7rj"
}], ["circle", {
	cx: "11",
	cy: "11",
	r: "8",
	key: "4ej97u"
}]]);
// src/pages/Customers.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
/** Status chip classes keyed by lifecycle status. */
var STATUS_CHIP_CLASS = {
	[CustomerStatus.active]: "status-chip-active",
	[CustomerStatus.inactive]: "status-chip-paused",
	[CustomerStatus.archived]: "status-chip-archived"
};
/**
* Light-backed form field treatment.
*
* Customer entry happens on the dark honeycomb background, so every editable
* field sits on a warm ivory surface with dark chocolate text. The 48px
* minimum height keeps targets comfortable for thumb entry on mobile, and the
* gold focus ring keeps keyboard focus obvious against the light surface.
*/
var LIGHT_FIELD_CLASS = "min-h-12 w-full rounded-lg border border-[oklch(0.78_0.05_82)] bg-[oklch(0.965_0.018_92)] px-3.5 py-2.5 text-base font-medium text-[oklch(0.22_0.025_66)] shadow-[inset_0_1px_2px_oklch(0.4_0.03_70_/_0.18)] outline-none transition-smooth placeholder:font-normal placeholder:text-[oklch(0.52_0.03_72)] focus-visible:border-[oklch(0.72_0.16_76)] focus-visible:ring-[3px] focus-visible:ring-[oklch(0.79_0.175_76_/_0.45)]";
var EMPTY_DRAFT = {
	fullName: "",
	phone: "",
	email: "",
	serviceAddress: "",
	preferredContact: PreferredContact.phone
};
/**
* Admin customer directory.
*
* A searchable list of every customer the hive has served, matched on name,
* phone, email, id and service address. Each row links to the customer's full
* profile; the directory can be exported as CSV and new customers added inline.
*/
function CustomersPage() {
	const { data: isAdmin, isLoading: roleLoading } = useIsAdmin();
	const { login, loginStatus } = useInternetIdentity();
	if (roleLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "px-5 py-16 sm:px-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoneyCard, {
			className: "mx-auto max-w-md",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoneyLoader, {
				"data-ocid": "customers.loading_state",
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
					children: "Sign in with an administrator identity to open the customer directory."
				}),
				loginStatus !== "success" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(HoneyButton, {
					"data-ocid": "customers.login_button",
					onClick: () => login(),
					className: "mt-6 w-full sm:w-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "size-4" }), "Sign in"]
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomerDirectory, {});
}
function CustomerDirectory() {
	const [term, setTerm] = (0, import_react.useState)("");
	const [includeArchived, setIncludeArchived] = (0, import_react.useState)(false);
	const [dialogOpen, setDialogOpen] = (0, import_react.useState)(false);
	const trimmed = term.trim();
	const isSearching = trimmed.length > 0;
	const directoryQuery = useCustomers(includeArchived);
	const searchQuery = useCustomerSearch(trimmed);
	const activeQuery = isSearching ? searchQuery : directoryQuery;
	const customers = (0, import_react.useMemo)(() => activeQuery.data ?? [], [activeQuery.data]);
	const exportCsv = useExportCustomersCsv();
	const [exportError, setExportError] = (0, import_react.useState)(null);
	const handleExport = () => {
		setExportError(null);
		exportCsv.mutate(void 0, {
			onSuccess: (csv) => {
				downloadCustomersCsv(csv);
			},
			onError: () => {
				setExportError("Could not export the directory. Please try again.");
			}
		});
	};
	const isLoading = activeQuery.isLoading;
	const isError = activeQuery.isError;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-ocid": "customers.page",
		className: "animate-page-enter mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase tracking-[0.22em] text-primary",
						children: "Admin"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-outline-black-strong mt-2 font-display text-3xl font-bold text-gold-gradient sm:text-4xl",
						children: "Customers"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-outline-black mt-2 max-w-2xl text-sm text-muted-foreground",
						children: "Every customer is kept as a permanent record, matched on email and phone so returning neighbors are recognized instead of duplicated."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(HoneyButton, {
						variant: "secondary",
						"data-ocid": "customers.export_button",
						onClick: handleExport,
						disabled: exportCsv.isPending,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), exportCsv.isPending ? "Exporting…" : "Export customers"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(HoneyButton, {
						"data-ocid": "customers.new_customer_button",
						onClick: () => setDialogOpen(true),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "size-4" }), "New customer"]
					})]
				})]
			}),
			exportError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				"data-ocid": "customers.export_error",
				role: "alert",
				className: "text-outline-black mb-4 rounded-xl border border-destructive/50 bg-destructive/15 px-4 py-3 text-sm text-destructive",
				children: exportError
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(HoneyCard, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoneyCardHeader, {
					title: "Customer directory",
					description: isSearching ? `Results for “${trimmed}”` : "Search by name, phone, email, customer id or service address.",
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						"aria-hidden": "true",
						className: "hex-clip flex size-10 items-center justify-center bg-primary/15 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-5" })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "search-field flex min-h-11 w-full items-center gap-2 rounded-full border border-input px-4 sm:max-w-md",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4 shrink-0 text-muted-foreground" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "search",
								"data-ocid": "customers.search_input",
								value: term,
								onChange: (event) => setTerm(event.target.value),
								placeholder: "Search customers…",
								"aria-label": "Search customers",
								className: "min-w-0 flex-1 bg-transparent py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
							}),
							isSearching && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"data-ocid": "customers.search_clear_button",
								"aria-label": "Clear search",
								onClick: () => setTerm(""),
								className: "flex size-6 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-smooth hover:bg-muted/60 hover:text-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-outline-black inline-flex cursor-pointer select-none items-center gap-2 text-sm font-semibold text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							"data-ocid": "customers.include_archived_toggle",
							checked: includeArchived,
							onChange: (event) => setIncludeArchived(event.target.checked),
							className: "size-4 accent-[oklch(var(--primary))]"
						}), "Include archived"]
					})]
				}),
				isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoneyLoader, {
					"data-ocid": "customers.loading_state",
					label: "Opening the directory"
				}) : isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					"data-ocid": "customers.error_state",
					className: "flex flex-col items-center gap-3 py-10 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-outline-black text-sm text-muted-foreground",
						children: "The directory could not be loaded. Please try again."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoneyButton, {
						variant: "secondary",
						size: "sm",
						"data-ocid": "customers.retry_button",
						onClick: () => void activeQuery.refetch(),
						children: "Retry"
					})]
				}) : customers.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					"data-ocid": "customers.empty_state",
					className: "flex flex-col items-center gap-3 py-12 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "relative flex size-14 items-center justify-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								"aria-hidden": "true",
								className: "hex-clip absolute inset-0 bg-gradient-to-b from-primary/40 to-primary/10"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "relative z-10 size-6 text-primary" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-outline-black-strong font-display text-lg font-semibold text-foreground",
							children: isSearching ? "No matching customers" : "No customers yet"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-outline-black max-w-sm text-sm text-muted-foreground",
							children: isSearching ? "Try a different name, phone number, email or address." : "Add your first customer to start building the hive's directory."
						}),
						!isSearching && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(HoneyButton, {
							size: "sm",
							"data-ocid": "customers.empty_new_customer_button",
							onClick: () => setDialogOpen(true),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "size-4" }), "Add first customer"]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					"data-ocid": "customers.list",
					className: "flex flex-col gap-3",
					children: customers.map((customer, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomerRow, {
						customer,
						index: index + 1
					}, customer.id.toString()))
				})
			] }),
			dialogOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewCustomerDialog, { onClose: () => setDialogOpen(false) })
		]
	});
}
function CustomerRow({ customer, index }) {
	const statusMeta = getCustomerStatusMeta(customer.status);
	const name = customerDisplayName(customer);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/admin/customers/$customerId",
		params: { customerId: customer.id.toString() },
		"data-ocid": `customers.row.${index}`,
		className: "crm-row group flex items-center gap-4 rounded-2xl border border-border/70 p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"aria-hidden": "true",
				className: "crm-avatar hex-clip flex size-12 shrink-0 items-center justify-center font-display text-base font-bold text-primary-foreground",
				children: customerInitials(name)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-outline-black-strong truncate font-display text-base font-semibold text-foreground",
						children: name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						"data-ocid": `customers.status.${index}`,
						className: cn("text-outline-black inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.14em]", STATUS_CHIP_CLASS[customer.status]),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"aria-hidden": "true",
							className: "hex-clip size-2 shrink-0 bg-current"
						}), statusMeta.label]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground",
					children: [
						customer.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-3.5 shrink-0" }), customer.phone]
						}),
						customer.email && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex min-w-0 items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "size-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: customer.email
							})]
						}),
						customer.serviceAddress && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex min-w-0 items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: customer.serviceAddress
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex shrink-0 flex-col items-end gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-outline-black font-mono text-sm font-semibold text-foreground",
					children: formatJobCount(customer.jobCount)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-outline-black text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground",
					children: "View profile"
				})]
			})
		]
	}) });
}
/**
* Inline new-customer form.
*
* Fields are grouped into identity, contact and address so entry stays quick,
* and every editable field sits on a light-backed surface with dark text sized
* for comfortable mobile entry. Preferred contact is a dropdown; the customer
* lifecycle status is managed from the profile, not at creation.
*/
function NewCustomerDialog({ onClose }) {
	const createCustomer = useCreateCustomer();
	const [draft, setDraft] = (0, import_react.useState)(EMPTY_DRAFT);
	const [error, setError] = (0, import_react.useState)(null);
	const update = (key, value) => {
		setDraft((current) => ({
			...current,
			[key]: value
		}));
		setError(null);
	};
	const handleSubmit = (event) => {
		event.preventDefault();
		setError(null);
		const input = {
			fullName: draft.fullName.trim(),
			phone: draft.phone.trim(),
			email: draft.email.trim(),
			serviceAddress: draft.serviceAddress.trim(),
			preferredContact: draft.preferredContact
		};
		if (input.fullName.length === 0) {
			setError("A customer name is required.");
			return;
		}
		if (input.phone.length === 0 && input.email.length === 0) {
			setError("Add at least a phone number or an email address.");
			return;
		}
		createCustomer.mutate(input, {
			onSuccess: (result) => {
				if (result.__kind__ === "ok") {
					onClose();
					return;
				}
				setError(result.err.__kind__ === "invalidInput" ? result.err.invalidInput : "The customer could not be saved. Please try again.");
			},
			onError: () => {
				setError("The customer could not be saved. Please try again.");
			}
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dialog", {
		open: true,
		"data-ocid": "customers.new_customer_modal",
		"aria-labelledby": "new-customer-title",
		className: "fixed inset-0 z-50 m-0 flex h-full max-h-none w-full max-w-none items-center justify-center border-0 bg-transparent p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-label": "Close dialog",
			"data-ocid": "customers.new_customer_close_button",
			onClick: onClose,
			className: "absolute inset-0 cursor-default bg-black/60 backdrop-blur-sm"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "honey-panel honey-panel-accent relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-5 flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					id: "new-customer-title",
					className: "text-outline-black-strong font-display text-xl font-bold text-foreground",
					children: "New customer"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-outline-black mt-1 text-sm text-muted-foreground",
					children: "Add a neighbor to the hive's directory."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"data-ocid": "customers.new_customer_dismiss_button",
					"aria-label": "Close",
					onClick: onClose,
					className: "flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-secondary/60 text-foreground transition-smooth hover:border-primary/50",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "flex flex-col gap-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
						className: "flex flex-col gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
							className: "mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary",
							children: "Identity"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "customer-name",
								className: "text-foreground",
								children: "Full name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "customer-name",
								"data-ocid": "customers.name_input",
								value: draft.fullName,
								onChange: (event) => update("fullName", event.target.value),
								placeholder: "Ada Lovelace",
								autoComplete: "name",
								className: LIGHT_FIELD_CLASS
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
						className: "flex flex-col gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
								className: "mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary",
								children: "Contact"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-4 sm:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "customer-phone",
										className: "text-foreground",
										children: "Phone"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										id: "customer-phone",
										"data-ocid": "customers.phone_input",
										type: "tel",
										value: draft.phone,
										onChange: (event) => update("phone", event.target.value),
										placeholder: "405-555-0123",
										autoComplete: "tel",
										inputMode: "tel",
										className: LIGHT_FIELD_CLASS
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "customer-email",
										className: "text-foreground",
										children: "Email"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										id: "customer-email",
										"data-ocid": "customers.email_input",
										type: "email",
										value: draft.email,
										onChange: (event) => update("email", event.target.value),
										placeholder: "ada@example.com",
										autoComplete: "email",
										className: LIGHT_FIELD_CLASS
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "customer-contact",
									className: "text-foreground",
									children: "Preferred contact method"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									id: "customer-contact",
									"data-ocid": "customers.preferred_contact_select",
									value: draft.preferredContact,
									onChange: (event) => update("preferredContact", event.target.value),
									className: cn(LIGHT_FIELD_CLASS, "appearance-none pr-10"),
									children: PREFERRED_CONTACTS.map((contact) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: contact,
										children: getPreferredContactMeta(contact).label
									}, contact))
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
						className: "flex flex-col gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
							className: "mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary",
							children: "Service address"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "customer-address",
								className: "text-foreground",
								children: "Service address"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "customer-address",
								"data-ocid": "customers.address_input",
								value: draft.serviceAddress,
								onChange: (event) => update("serviceAddress", event.target.value),
								placeholder: "123 Honeycomb Lane",
								autoComplete: "street-address",
								className: LIGHT_FIELD_CLASS
							})]
						})]
					}),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						"data-ocid": "customers.new_customer_error",
						role: "alert",
						className: "text-outline-black rounded-xl border border-destructive/50 bg-destructive/15 px-3 py-2 text-sm text-destructive",
						children: error
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoneyButton, {
							variant: "secondary",
							"data-ocid": "customers.new_customer_cancel_button",
							onClick: onClose,
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoneyButton, {
							type: "submit",
							"data-ocid": "customers.new_customer_submit_button",
							disabled: createCustomer.isPending,
							children: createCustomer.isPending ? "Saving…" : "Add customer"
						})]
					})
				]
			})]
		})]
	});
}
export { CustomersPage };
