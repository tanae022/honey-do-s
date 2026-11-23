import { r as __toESM } from "./rolldown-runtime-SbdDWaPq.js";
import { s as useQueryClient } from "./dist-DCUbDtYL.js";
import { K as cn, V as timestampToDate, X as DiscountEligibility, Z as DiscountKind, ct as require_react, f as formatDate, m as formatMoney, st as require_jsx_runtime, t as createLucideIcon } from "./createLucideIcon-CK3986Sn.js";
import { t as BadgeCheck } from "./badge-check-CxAhc_Pv.js";
import { C as AdminChip, D as AdminButton, E as AdminCardHeader, O as AdminPageHeader, T as AdminCard, _ as AdminField, b as AdminTextarea, d as Primitive, f as useControllableState, g as AdminEmptyState, h as createContextScope, k as AdminShell, m as composeEventHandlers, n as AdminLoadingState, p as useLayoutEffect2, r as AdminConfirmDialog, t as AdminErrorState, v as AdminInput, w as AdminStatusBadge, x as AdminDataTable, y as AdminSelect } from "./admin-DxTl2OJo.js";
import { t as Mail } from "./mail-CjefN9m4.js";
import { t as MessageSquare } from "./message-square-Ciq8dACq.js";
import { t as Plus } from "./plus-BbIZ9xgk.js";
import { t as Trash2 } from "./trash-2-hTaV3zpM.js";
import { D as useOwnerAlertEmail, F as useSendTestAlert, I as useSetOwnerAlertEmail, L as useSetOwnerAlertPhone, O as useOwnerAlertPhone, V as useTwilioConfigStatus, h as BellRing } from "./index-DhzL9CXu.js";
import { n as useComposedRefs } from "./dist-DWpcaKVu.js";
import { S as useUpdateDiscount, _ as useSetPaymentSettings, b as useSettings, g as useSetDiscountActive, h as useSetDepositSetting, i as useCreateDiscount, m as useSetBusinessSettings, o as useDeleteDiscount, p as useSetAdminSettings, s as useDiscounts, v as useSetQuoteSettings, y as useSetTaxSetting } from "./useAdminSettings-CtJqDOX4.js";
import { t as customerKeys } from "./useCustomers-it81kN8P.js";
import { c as discountValueLabel, f as paymentMethodLabel, o as discountEligibilityLabel, r as PAYMENT_METHODS, s as discountKindLabel } from "./admin-CtzrkfjB.js";
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var BadgePercent = createLucideIcon("badge-percent", [
	["path", {
		d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
		key: "3c2336"
	}],
	["path", {
		d: "m15 9-6 6",
		key: "1uzhvr"
	}],
	["path", {
		d: "M9 9h.01",
		key: "1q5me6"
	}],
	["path", {
		d: "M15 15h.01",
		key: "lqbp3k"
	}]
]);
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Pencil = createLucideIcon("pencil", [["path", {
	d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
	key: "1a8usu"
}], ["path", {
	d: "m15 5 4 4",
	key: "1mk7zo"
}]]);
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Volume2 = createLucideIcon("volume-2", [
	["path", {
		d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",
		key: "uqj9uw"
	}],
	["path", {
		d: "M16 9a5 5 0 0 1 0 6",
		key: "1q6k2b"
	}],
	["path", {
		d: "M19.364 18.364a9 9 0 0 0 0-12.728",
		key: "ijwkga"
	}]
]);
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@radix-ui+react-use-previous@1.1.1_@types+react@19.1.17_react@19.1.5/node_modules/@radix-ui/react-use-previous/dist/index.mjs
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
function usePrevious(value) {
	const ref = import_react.useRef({
		value,
		previous: value
	});
	return import_react.useMemo(() => {
		if (ref.current.value !== value) {
			ref.current.previous = ref.current.value;
			ref.current.value = value;
		}
		return ref.current.previous;
	}, [value]);
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@radix-ui+react-use-size@1.1.1_@types+react@19.1.17_react@19.1.5/node_modules/@radix-ui/react-use-size/dist/index.mjs
function useSize(element) {
	const [size, setSize] = import_react.useState(void 0);
	useLayoutEffect2(() => {
		if (element) {
			setSize({
				width: element.offsetWidth,
				height: element.offsetHeight
			});
			const resizeObserver = new ResizeObserver((entries) => {
				if (!Array.isArray(entries)) return;
				if (!entries.length) return;
				const entry = entries[0];
				let width;
				let height;
				if ("borderBoxSize" in entry) {
					const borderSizeEntry = entry["borderBoxSize"];
					const borderSize = Array.isArray(borderSizeEntry) ? borderSizeEntry[0] : borderSizeEntry;
					width = borderSize["inlineSize"];
					height = borderSize["blockSize"];
				} else {
					width = element.offsetWidth;
					height = element.offsetHeight;
				}
				setSize({
					width,
					height
				});
			});
			resizeObserver.observe(element, { box: "border-box" });
			return () => resizeObserver.unobserve(element);
		} else setSize(void 0);
	}, [element]);
	return size;
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@radix-ui+react-switch@1.2.6_@types+react-dom@19.1.11_@types+react@19.1.17__@types+reac_d28b9ab4436ff6508f78f61d6091c188/node_modules/@radix-ui/react-switch/dist/index.mjs
var import_jsx_runtime = require_jsx_runtime();
var SWITCH_NAME = "Switch";
var [createSwitchContext, createSwitchScope] = createContextScope(SWITCH_NAME);
var [SwitchProvider, useSwitchContext] = createSwitchContext(SWITCH_NAME);
var Switch$1 = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeSwitch, name, checked: checkedProp, defaultChecked, required, disabled, value = "on", onCheckedChange, form, ...switchProps } = props;
	const [button, setButton] = import_react.useState(null);
	const composedRefs = useComposedRefs(forwardedRef, (node) => setButton(node));
	const hasConsumerStoppedPropagationRef = import_react.useRef(false);
	const isFormControl = button ? form || !!button.closest("form") : true;
	const [checked, setChecked] = useControllableState({
		prop: checkedProp,
		defaultProp: defaultChecked ?? false,
		onChange: onCheckedChange,
		caller: SWITCH_NAME
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SwitchProvider, {
		scope: __scopeSwitch,
		checked,
		disabled,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.button, {
			type: "button",
			role: "switch",
			"aria-checked": checked,
			"aria-required": required,
			"data-state": getState(checked),
			"data-disabled": disabled ? "" : void 0,
			disabled,
			value,
			...switchProps,
			ref: composedRefs,
			onClick: composeEventHandlers(props.onClick, (event) => {
				setChecked((prevChecked) => !prevChecked);
				if (isFormControl) {
					hasConsumerStoppedPropagationRef.current = event.isPropagationStopped();
					if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation();
				}
			})
		}), isFormControl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchBubbleInput, {
			control: button,
			bubbles: !hasConsumerStoppedPropagationRef.current,
			name,
			value,
			checked,
			required,
			disabled,
			form,
			style: { transform: "translateX(-100%)" }
		})]
	});
});
Switch$1.displayName = SWITCH_NAME;
var THUMB_NAME = "SwitchThumb";
var SwitchThumb = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeSwitch, ...thumbProps } = props;
	const context = useSwitchContext(THUMB_NAME, __scopeSwitch);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.span, {
		"data-state": getState(context.checked),
		"data-disabled": context.disabled ? "" : void 0,
		...thumbProps,
		ref: forwardedRef
	});
});
SwitchThumb.displayName = THUMB_NAME;
var BUBBLE_INPUT_NAME = "SwitchBubbleInput";
var SwitchBubbleInput = import_react.forwardRef(({ __scopeSwitch, control, checked, bubbles = true, ...props }, forwardedRef) => {
	const ref = import_react.useRef(null);
	const composedRefs = useComposedRefs(ref, forwardedRef);
	const prevChecked = usePrevious(checked);
	const controlSize = useSize(control);
	import_react.useEffect(() => {
		const input = ref.current;
		if (!input) return;
		const inputProto = window.HTMLInputElement.prototype;
		const setChecked = Object.getOwnPropertyDescriptor(inputProto, "checked").set;
		if (prevChecked !== checked && setChecked) {
			const event = new Event("click", { bubbles });
			setChecked.call(input, checked);
			input.dispatchEvent(event);
		}
	}, [
		prevChecked,
		checked,
		bubbles
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type: "checkbox",
		"aria-hidden": true,
		defaultChecked: checked,
		...props,
		tabIndex: -1,
		ref: composedRefs,
		style: {
			...props.style,
			...controlSize,
			position: "absolute",
			pointerEvents: "none",
			opacity: 0,
			margin: 0
		}
	});
});
SwitchBubbleInput.displayName = BUBBLE_INPUT_NAME;
function getState(checked) {
	return checked ? "checked" : "unchecked";
}
var Root = Switch$1;
var Thumb = SwitchThumb;
// src/components/ui/switch.tsx
function Switch({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
		"data-slot": "switch",
		className: cn("peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Thumb, {
			"data-slot": "switch-thumb",
			className: cn("bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0")
		})
	});
}
// src/pages/admin/settings/SettingsToggleRow.tsx
/**
* One large, readable settings toggle: a clear label, a supporting line and a
* comfortable switch. The whole row is a label so the tap target is generous on
* phone and the switch stays keyboard reachable.
*/
function SettingsToggleRow({ id, label, description, checked, onCheckedChange, disabled = false, ...rest }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex items-start justify-between gap-4 rounded-xl border border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface))] p-4", disabled && "opacity-60"),
		...rest,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			htmlFor: id,
			className: "min-w-0 cursor-pointer",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block text-base font-semibold text-[oklch(var(--admin-foreground))]",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-0.5 block text-sm text-[oklch(var(--admin-muted-foreground))]",
				children: description
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
			id,
			checked,
			onCheckedChange,
			disabled,
			"aria-label": label,
			className: "mt-1 h-7 w-12 shrink-0 data-[state=checked]:bg-[oklch(var(--admin-primary))] data-[state=unchecked]:bg-[oklch(var(--admin-border-strong))] [&_[data-slot=switch-thumb]]:size-5"
		})]
	});
}
// src/pages/admin/settings/AlertSettingsSection.tsx
var EMAIL_PATTERN$1 = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** The five alert preferences, in display order. */
var ALERT_TOGGLES = [
	{
		key: "customerRequestAlerts",
		label: "Customer request alerts",
		description: "Alert me the moment a new service request comes in."
	},
	{
		key: "notificationSound",
		label: "Notification sound",
		description: "Play a ding when a new request arrives."
	},
	{
		key: "pushNotifications",
		label: "Push notifications",
		description: "Show in-app notifications for new activity."
	},
	{
		key: "appointmentReminders",
		label: "Appointment reminders",
		description: "Remind me about upcoming appointments."
	},
	{
		key: "messageAlerts",
		label: "Message alerts",
		description: "Alert me when a customer sends a message."
	}
];
function resolveAudioContextCtor() {
	if (typeof window === "undefined") return null;
	const scoped = globalThis;
	return scoped.AudioContext ?? scoped.webkitAudioContext ?? null;
}
function playTestDing() {
	const Ctor = resolveAudioContextCtor();
	if (!Ctor) return;
	let ctx;
	try {
		ctx = new Ctor();
	} catch {
		return;
	}
	const start = ctx.currentTime;
	for (const note of [{
		at: 0,
		freq: 880
	}, {
		at: .14,
		freq: 1318.5
	}]) {
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();
		osc.type = "sine";
		osc.frequency.setValueAtTime(note.freq, start + note.at);
		gain.gain.setValueAtTime(1e-4, start + note.at);
		gain.gain.exponentialRampToValueAtTime(.16, start + note.at + .02);
		gain.gain.exponentialRampToValueAtTime(1e-4, start + note.at + .32);
		osc.connect(gain);
		gain.connect(ctx.destination);
		osc.start(start + note.at);
		osc.stop(start + note.at + .36);
	}
	window.setTimeout(() => void ctx.close().catch(() => void 0), 700);
}
/**
* Alert preferences, the TEST ALERT action and the owner alert contacts.
*
* The toggles save the whole `AdminSettings` bundle. TEST ALERT verifies the
* three owner-facing signals at once: the in-app notification panel, the unread
* badge (by refreshing the notification queries) and the sound.
*/
function AlertSettingsSection() {
	const settingsQuery = useSettings();
	const setAdminSettings = useSetAdminSettings();
	const queryClient = useQueryClient();
	const [draft, setDraft] = (0, import_react.useState)(null);
	const [initialized, setInitialized] = (0, import_react.useState)(false);
	const [saveError, setSaveError] = (0, import_react.useState)(null);
	const [saved, setSaved] = (0, import_react.useState)(false);
	const [testOutcome, setTestOutcome] = (0, import_react.useState)(null);
	const [testError, setTestError] = (0, import_react.useState)(null);
	const [badgeChecked, setBadgeChecked] = (0, import_react.useState)(false);
	const savedAdmin = settingsQuery.data?.admin;
	(0, import_react.useEffect)(() => {
		if (!initialized && savedAdmin) {
			setDraft(savedAdmin);
			setInitialized(true);
		}
	}, [initialized, savedAdmin]);
	const persist = (0, import_react.useCallback)((next) => {
		setDraft(next);
		setSaved(false);
		setSaveError(null);
		setAdminSettings.mutate(next, {
			onSuccess: (result) => {
				if (result.__kind__ === "ok") {
					setDraft(result.ok);
					setSaved(true);
				} else setSaveError(result.err.__kind__ === "invalidInput" ? result.err.invalidInput : "We couldn't save your alert preferences. Please try again.");
			},
			onError: () => {
				setSaveError("We couldn't save your alert preferences. Please try again.");
			}
		});
	}, [setAdminSettings]);
	const handleToggle = (key, checked) => {
		if (!draft) return;
		persist({
			...draft,
			[key]: checked
		});
	};
	const sendTest = useSendTestAlert();
	const handleTestAlert = () => {
		setTestOutcome(null);
		setTestError(null);
		setBadgeChecked(false);
		playTestDing();
		queryClient.invalidateQueries({ queryKey: customerKeys.unreadCount() });
		queryClient.invalidateQueries({ queryKey: customerKeys.notifications() });
		setBadgeChecked(true);
		sendTest.mutate(void 0, {
			onSuccess: (result) => {
				setTestOutcome({
					email: toOutcome(result.email),
					sms: toOutcome(result.sms)
				});
			},
			onError: () => {
				setTestError("We couldn't send the test alert. Please try again.");
			}
		});
	};
	if (settingsQuery.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminCardHeader, {
		title: "Alerts & notifications",
		description: "Choose what the app alerts you about."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLoadingState, {
		"data-ocid": "admin.settings.alerts.loading_state",
		label: "Loading alert preferences…"
	})] });
	if (settingsQuery.isError || !draft) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminCardHeader, {
		title: "Alerts & notifications",
		description: "Choose what the app alerts you about."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminErrorState, {
		"data-ocid": "admin.settings.alerts.error_state",
		message: "We couldn't load your alert preferences.",
		onRetry: () => void settingsQuery.refetch()
	})] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminCard, {
		"data-ocid": "admin.settings.alerts.card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminCardHeader, {
				title: "Alerts & notifications",
				description: "Choose what the app alerts you about. Changes save as you toggle.",
				action: saved ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminChip, {
					"data-ocid": "admin.settings.alerts.saved_chip",
					children: "Saved"
				}) : void 0
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-3",
				children: ALERT_TOGGLES.map((toggle) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsToggleRow, {
					id: `alert-${toggle.key}`,
					"data-ocid": `admin.settings.alerts.${toggle.key}_toggle`,
					label: toggle.label,
					description: toggle.description,
					checked: draft[toggle.key],
					disabled: setAdminSettings.isPending,
					onCheckedChange: (checked) => handleToggle(toggle.key, checked)
				}, toggle.key))
			}),
			saveError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "alert",
				"data-ocid": "admin.settings.alerts.save_error",
				className: "mt-3 text-sm font-medium text-[oklch(var(--admin-status-action))]",
				children: saveError
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 rounded-xl border border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface-alt))] p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-base font-semibold text-[oklch(var(--admin-foreground))]",
								children: "Test alert"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 text-sm text-[oklch(var(--admin-muted-foreground))]",
								children: "Verifies the in-app notification, the unread badge and the sound."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminButton, {
							"data-ocid": "admin.settings.test_alert_button",
							disabled: sendTest.isPending,
							onClick: handleTestAlert,
							className: "sm:w-auto",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellRing, { className: "size-4" }), sendTest.isPending ? "Testing…" : "Test alert"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-4 grid gap-2 sm:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TestSignalRow, {
								ocid: "admin.settings.test_alert.notification_result",
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellRing, { className: "size-4" }),
								label: "Notification",
								state: badgeChecked ? "ok" : "idle",
								detail: badgeChecked ? "In-app notification shown." : "Not tested yet."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TestSignalRow, {
								ocid: "admin.settings.test_alert.badge_result",
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { className: "size-4" }),
								label: "Unread badge",
								state: badgeChecked ? "ok" : "idle",
								detail: badgeChecked ? "Badge refreshed." : "Not tested yet."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TestSignalRow, {
								ocid: "admin.settings.test_alert.sound_result",
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-4" }),
								label: "Sound",
								state: badgeChecked ? "ok" : "idle",
								detail: badgeChecked ? "Ding played." : "Not tested yet."
							})
						]
					}),
					testOutcome && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						"data-ocid": "admin.settings.test_alert.channel_results",
						className: "mt-3 grid gap-2 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChannelResultRow, {
							ocid: "admin.settings.test_alert.email_result",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "size-4" }),
							label: "Email",
							outcome: testOutcome.email
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChannelResultRow, {
							ocid: "admin.settings.test_alert.sms_result",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "size-4" }),
							label: "Text",
							outcome: testOutcome.sms
						})]
					}),
					testError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						role: "alert",
						"data-ocid": "admin.settings.test_alert.error",
						className: "mt-3 text-sm font-medium text-[oklch(var(--admin-status-action))]",
						children: testError
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OwnerAlertContacts, {})
		]
	});
}
function toOutcome(result) {
	return result.__kind__ === "sent" ? { kind: "sent" } : {
		kind: "failed",
		message: result.failed
	};
}
function TestSignalRow({ ocid, icon, label, state, detail }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		"data-ocid": ocid,
		className: state === "ok" ? "flex items-start gap-2 rounded-lg border border-[oklch(var(--admin-status-paid))] bg-[oklch(var(--admin-status-paid))]/10 p-3 text-sm text-[oklch(var(--admin-foreground))]" : "flex items-start gap-2 rounded-lg border border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface))] p-3 text-sm text-[oklch(var(--admin-muted-foreground))]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mt-0.5 shrink-0",
			children: icon
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block font-semibold text-[oklch(var(--admin-foreground))]",
				children: label
			}), detail]
		})]
	});
}
function ChannelResultRow({ ocid, icon, label, outcome }) {
	const sent = outcome.kind === "sent";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		"data-ocid": ocid,
		className: sent ? "flex items-start gap-2 rounded-lg border border-[oklch(var(--admin-status-paid))] bg-[oklch(var(--admin-status-paid))]/10 p-3 text-sm text-[oklch(var(--admin-foreground))]" : "flex items-start gap-2 rounded-lg border border-[oklch(var(--admin-status-action))] bg-[oklch(var(--admin-status-action))]/10 p-3 text-sm text-[oklch(var(--admin-foreground))]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mt-0.5 shrink-0",
			children: icon
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "font-semibold",
				children: [label, ": "]
			}), sent ? "sent." : outcome.message]
		})]
	});
}
function OwnerAlertContacts() {
	const emailQuery = useOwnerAlertEmail();
	const phoneQuery = useOwnerAlertPhone();
	const twilioQuery = useTwilioConfigStatus();
	const setEmail = useSetOwnerAlertEmail();
	const setPhone = useSetOwnerAlertPhone();
	const [emailDraft, setEmailDraft] = (0, import_react.useState)("");
	const [emailInitialized, setEmailInitialized] = (0, import_react.useState)(false);
	const [emailError, setEmailError] = (0, import_react.useState)(null);
	const [emailSaved, setEmailSaved] = (0, import_react.useState)(false);
	const [phoneDraft, setPhoneDraft] = (0, import_react.useState)("");
	const [phoneInitialized, setPhoneInitialized] = (0, import_react.useState)(false);
	const [phoneError, setPhoneError] = (0, import_react.useState)(null);
	const [phoneSaved, setPhoneSaved] = (0, import_react.useState)(false);
	const savedEmail = emailQuery.data ?? "";
	const savedPhone = phoneQuery.data ?? "";
	const twilioConfigured = twilioQuery.data?.configured === true;
	(0, import_react.useEffect)(() => {
		if (!emailInitialized && emailQuery.isSuccess) {
			setEmailDraft(savedEmail);
			setEmailInitialized(true);
		}
	}, [
		emailInitialized,
		emailQuery.isSuccess,
		savedEmail
	]);
	(0, import_react.useEffect)(() => {
		if (!phoneInitialized && phoneQuery.isSuccess) {
			setPhoneDraft(savedPhone);
			setPhoneInitialized(true);
		}
	}, [
		phoneInitialized,
		phoneQuery.isSuccess,
		savedPhone
	]);
	const handleSaveEmail = () => {
		const next = emailDraft.trim();
		setEmailSaved(false);
		if (next.length === 0) {
			setEmailError("Enter the email address that should receive alerts.");
			return;
		}
		if (!EMAIL_PATTERN$1.test(next)) {
			setEmailError("Enter a valid email address, like owner@example.com.");
			return;
		}
		setEmailError(null);
		setEmail.mutate(next, {
			onSuccess: (result) => {
				if (result.__kind__ === "ok") {
					setEmailDraft(result.ok);
					setEmailSaved(true);
				} else setEmailError(result.err.__kind__ === "invalidEmail" ? result.err.invalidEmail : "We couldn't save that address. Please try again.");
			},
			onError: () => {
				setEmailError("We couldn't save that address. Please try again.");
			}
		});
	};
	const handleSavePhone = () => {
		const next = phoneDraft.trim();
		setPhoneSaved(false);
		if (next.length === 0) {
			setPhoneError("Enter the phone number that should receive texts.");
			return;
		}
		setPhoneError(null);
		setPhone.mutate(next, {
			onSuccess: (result) => {
				if (result.__kind__ === "ok") {
					setPhoneDraft(result.ok);
					setPhoneSaved(true);
				} else setPhoneError(result.err.__kind__ === "invalidPhone" ? result.err.invalidPhone : "We couldn't save that number. Please try again.");
			},
			onError: () => {
				setPhoneError("We couldn't save that number. Please try again.");
			}
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-ocid": "admin.settings.owner_alert.panel",
		className: "mt-5 rounded-xl border border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface))] p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 flex flex-wrap items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-base font-bold text-[oklch(var(--admin-foreground))]",
					children: "Owner alert contacts"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminChip, {
					"data-ocid": "admin.settings.owner_alert.email_chip",
					className: savedEmail ? "border-[oklch(var(--admin-status-paid))] text-[oklch(var(--admin-status-paid))]" : void 0,
					children: ["Email ", savedEmail ? "configured" : "not set"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminChip, {
					"data-ocid": "admin.settings.owner_alert.phone_chip",
					className: twilioConfigured && savedPhone ? "border-[oklch(var(--admin-status-paid))] text-[oklch(var(--admin-status-paid))]" : void 0,
					children: ["Text ", twilioConfigured && savedPhone ? "configured" : "not set"]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 sm:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
					label: "Alert email",
					htmlFor: "owner-alert-email",
					error: emailError,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminInput, {
						id: "owner-alert-email",
						"data-ocid": "admin.settings.owner_alert.email_input",
						type: "email",
						inputMode: "email",
						autoComplete: "email",
						placeholder: "owner@example.com",
						value: emailDraft,
						onChange: (event) => setEmailDraft(event.target.value)
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminButton, {
					variant: "secondary",
					"data-ocid": "admin.settings.owner_alert.email_save_button",
					disabled: setEmail.isPending,
					onClick: handleSaveEmail,
					children: setEmail.isPending ? "Saving…" : emailSaved ? "Saved" : "Save email"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
					label: "Alert phone",
					htmlFor: "owner-alert-phone",
					error: phoneError,
					hint: twilioConfigured ? void 0 : "Text alerts need the messaging service configured.",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminInput, {
						id: "owner-alert-phone",
						"data-ocid": "admin.settings.owner_alert.phone_input",
						type: "tel",
						inputMode: "tel",
						autoComplete: "tel",
						placeholder: "(405) 312-4987",
						value: phoneDraft,
						onChange: (event) => setPhoneDraft(event.target.value)
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminButton, {
					variant: "secondary",
					"data-ocid": "admin.settings.owner_alert.phone_save_button",
					disabled: setPhone.isPending,
					onClick: handleSavePhone,
					children: setPhone.isPending ? "Saving…" : phoneSaved ? "Saved" : "Save phone"
				})]
			})]
		})]
	});
}
// src/pages/admin/settings/BusinessSettingsSection.tsx
var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/**
* Business settings: the name, email, phone and address shown to customers.
*
* These details appear on quotes, emails and the customer-facing pages, so the
* owner keeps them accurate here.
*/
function BusinessSettingsSection() {
	const settingsQuery = useSettings();
	const setBusiness = useSetBusinessSettings();
	const [draft, setDraft] = (0, import_react.useState)(null);
	const [initialized, setInitialized] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [saved, setSaved] = (0, import_react.useState)(false);
	const savedBusiness = settingsQuery.data?.business;
	(0, import_react.useEffect)(() => {
		if (!initialized && savedBusiness) {
			setDraft(savedBusiness);
			setInitialized(true);
		}
	}, [initialized, savedBusiness]);
	const handleSave = () => {
		if (!draft) return;
		setSaved(false);
		const name = draft.businessName.trim();
		const email = draft.businessEmail.trim();
		if (name.length === 0) {
			setError("Enter the business name.");
			return;
		}
		if (email.length > 0 && !EMAIL_PATTERN.test(email)) {
			setError("Enter a valid business email address.");
			return;
		}
		setError(null);
		const setting = {
			businessName: name,
			businessEmail: email,
			businessPhone: draft.businessPhone.trim(),
			businessAddress: draft.businessAddress.trim()
		};
		setBusiness.mutate(setting, {
			onSuccess: (result) => {
				if (result.__kind__ === "ok") {
					setDraft(result.ok);
					setSaved(true);
				} else setError(result.err.__kind__ === "invalidInput" ? result.err.invalidInput : "We couldn't save the business details. Please try again.");
			},
			onError: () => {
				setError("We couldn't save the business details. Please try again.");
			}
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminCard, {
		"data-ocid": "admin.settings.business.card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminCardHeader, {
			title: "Business",
			description: "The details customers see on quotes and emails.",
			action: saved ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminChip, {
				"data-ocid": "admin.settings.business.saved_chip",
				children: "Saved"
			}) : void 0
		}), settingsQuery.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLoadingState, {
			"data-ocid": "admin.settings.business.loading_state",
			label: "Loading business details…"
		}) : settingsQuery.isError || !draft ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminErrorState, {
			"data-ocid": "admin.settings.business.error_state",
			message: "We couldn't load the business details.",
			onRetry: () => void settingsQuery.refetch()
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
							label: "Business name",
							htmlFor: "business-name",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminInput, {
								id: "business-name",
								"data-ocid": "admin.settings.business.name_input",
								placeholder: "Honey Do's",
								value: draft.businessName,
								onChange: (event) => setDraft((current) => current ? {
									...current,
									businessName: event.target.value
								} : current)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
							label: "Business email",
							htmlFor: "business-email",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminInput, {
								id: "business-email",
								"data-ocid": "admin.settings.business.email_input",
								type: "email",
								inputMode: "email",
								autoComplete: "email",
								placeholder: "hello@honeydos.com",
								value: draft.businessEmail,
								onChange: (event) => setDraft((current) => current ? {
									...current,
									businessEmail: event.target.value
								} : current)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
							label: "Business phone",
							htmlFor: "business-phone",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminInput, {
								id: "business-phone",
								"data-ocid": "admin.settings.business.phone_input",
								type: "tel",
								inputMode: "tel",
								autoComplete: "tel",
								placeholder: "(405) 312-4987",
								value: draft.businessPhone,
								onChange: (event) => setDraft((current) => current ? {
									...current,
									businessPhone: event.target.value
								} : current)
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
					label: "Business address",
					htmlFor: "business-address",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminTextarea, {
						id: "business-address",
						"data-ocid": "admin.settings.business.address_input",
						placeholder: "123 Main St, Oklahoma City, OK 73102",
						value: draft.businessAddress,
						onChange: (event) => setDraft((current) => current ? {
							...current,
							businessAddress: event.target.value
						} : current)
					})
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "alert",
					"data-ocid": "admin.settings.business.form_error",
					className: "text-sm font-medium text-[oklch(var(--admin-status-action))]",
					children: error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminButton, {
					"data-ocid": "admin.settings.business.save_button",
					disabled: setBusiness.isPending,
					onClick: handleSave,
					children: setBusiness.isPending ? "Saving…" : "Save business details"
				}) })
			]
		})]
	});
}
// src/pages/admin/settings/DepositSettingsSection.tsx
/**
* Deposit settings: the percentage of the quote collected up front.
*
* The deposit is a whole percent of the accepted quote total. The owner sets
* it here and the customer-facing deposit amount follows it.
*/
function DepositSettingsSection() {
	const settingsQuery = useSettings();
	const setDeposit = useSetDepositSetting();
	const [percent, setPercent] = (0, import_react.useState)("");
	const [initialized, setInitialized] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [saved, setSaved] = (0, import_react.useState)(false);
	const savedDeposit = settingsQuery.data?.deposit;
	(0, import_react.useEffect)(() => {
		if (!initialized && savedDeposit) {
			setPercent(`${Number(savedDeposit.percent)}`);
			setInitialized(true);
		}
	}, [initialized, savedDeposit]);
	const handleSave = () => {
		setSaved(false);
		const value = Number(percent.trim());
		if (!Number.isFinite(value) || value < 0 || value > 100) {
			setError("Enter a deposit percentage between 0 and 100.");
			return;
		}
		setError(null);
		const setting = { percent: BigInt(Math.round(value)) };
		setDeposit.mutate(setting, {
			onSuccess: (result) => {
				if (result.__kind__ === "ok") {
					setPercent(`${Number(result.ok.percent)}`);
					setSaved(true);
				} else setError(result.err.__kind__ === "invalidInput" ? result.err.invalidInput : "We couldn't save the deposit setting. Please try again.");
			},
			onError: () => {
				setError("We couldn't save the deposit setting. Please try again.");
			}
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminCard, {
		"data-ocid": "admin.settings.deposit.card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminCardHeader, {
			title: "Deposit",
			description: "The percentage of the quote collected up front.",
			action: saved ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminChip, {
				"data-ocid": "admin.settings.deposit.saved_chip",
				children: "Saved"
			}) : void 0
		}), settingsQuery.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLoadingState, {
			"data-ocid": "admin.settings.deposit.loading_state",
			label: "Loading deposit setting…"
		}) : settingsQuery.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminErrorState, {
			"data-ocid": "admin.settings.deposit.error_state",
			message: "We couldn't load the deposit setting.",
			onRetry: () => void settingsQuery.refetch()
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-4 sm:flex-row sm:items-end",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
				label: "Deposit percentage",
				htmlFor: "deposit-percent",
				error,
				hint: "A whole percent, e.g. 10 for a 10% deposit.",
				className: "sm:max-w-xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminInput, {
					id: "deposit-percent",
					"data-ocid": "admin.settings.deposit.percent_input",
					type: "number",
					min: "0",
					max: "100",
					step: "1",
					inputMode: "numeric",
					placeholder: "10",
					value: percent,
					onChange: (event) => setPercent(event.target.value)
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminButton, {
				"data-ocid": "admin.settings.deposit.save_button",
				disabled: setDeposit.isPending,
				onClick: handleSave,
				className: "sm:w-auto",
				children: setDeposit.isPending ? "Saving…" : "Save deposit"
			})]
		})]
	});
}
// src/pages/admin/settings/DiscountSettingsSection.tsx
/** Eligibility options in display order. */
var ELIGIBILITY_OPTIONS = [
	DiscountEligibility.all,
	DiscountEligibility.returningCustomer,
	DiscountEligibility.ownParts
];
var EMPTY_DRAFT = {
	name: "",
	kind: DiscountKind.percentage,
	value: "",
	active: true,
	startAt: "",
	endAt: "",
	eligibility: DiscountEligibility.all,
	minPurchase: "",
	maxDiscount: ""
};
/** Convert a `YYYY-MM-DD` date input value to a nanosecond Timestamp. */
function dateInputToTimestamp(value) {
	if (value.trim().length === 0) return void 0;
	const date = /* @__PURE__ */ new Date(`${value}T00:00:00`);
	if (Number.isNaN(date.getTime())) return void 0;
	return BigInt(date.getTime()) * 1000000n;
}
/** Convert a nanosecond Timestamp to a `YYYY-MM-DD` date input value. */
function timestampToDateInput(timestamp) {
	if (timestamp === void 0) return "";
	const date = timestampToDate(timestamp);
	if (!date) return "";
	return `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`;
}
/** Parse a dollar string into whole cents, or null when invalid. */
function dollarsToCents(value) {
	const trimmed = value.trim();
	if (trimmed.length === 0) return 0n;
	const amount = Number(trimmed);
	if (!Number.isFinite(amount) || amount < 0) return null;
	return BigInt(Math.round(amount * 100));
}
function draftFromRule(rule) {
	return {
		name: rule.name,
		kind: rule.kind,
		value: rule.kind === DiscountKind.percentage ? `${Number(rule.value)}` : `${Number(rule.value) / 100}`,
		active: rule.active,
		startAt: timestampToDateInput(rule.startAt),
		endAt: timestampToDateInput(rule.endAt),
		eligibility: rule.eligibility,
		minPurchase: rule.minPurchase > 0n ? `${Number(rule.minPurchase) / 100}` : "",
		maxDiscount: rule.maxDiscount > 0n ? `${Number(rule.maxDiscount) / 100}` : ""
	};
}
/**
* Discount settings: create, edit, activate and remove discount rules.
*
* The owner sets a name, a percentage or fixed amount, an active flag, an
* optional start and end date, an eligibility rule, a minimum purchase and a
* maximum discount. Each saved rule can be turned on or off from the list.
*/
function DiscountSettingsSection() {
	const discountsQuery = useDiscounts();
	const createDiscount = useCreateDiscount();
	const updateDiscount = useUpdateDiscount();
	const setActive = useSetDiscountActive();
	const deleteDiscount = useDeleteDiscount();
	const [draft, setDraft] = (0, import_react.useState)(EMPTY_DRAFT);
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const [formError, setFormError] = (0, import_react.useState)(null);
	const [pendingDelete, setPendingDelete] = (0, import_react.useState)(null);
	const rules = discountsQuery.data ?? [];
	const isSaving = createDiscount.isPending || updateDiscount.isPending;
	const resetForm = () => {
		setDraft(EMPTY_DRAFT);
		setEditingId(null);
		setFormError(null);
	};
	const handleEdit = (rule) => {
		setDraft(draftFromRule(rule));
		setEditingId(rule.id);
		setFormError(null);
	};
	const handleSubmit = () => {
		const name = draft.name.trim();
		if (name.length === 0) {
			setFormError("Give the discount a name.");
			return;
		}
		const value = Number(draft.value.trim());
		if (!Number.isFinite(value) || value <= 0) {
			setFormError(draft.kind === DiscountKind.percentage ? "Enter a percentage greater than zero." : "Enter an amount greater than zero.");
			return;
		}
		const minPurchase = dollarsToCents(draft.minPurchase);
		const maxDiscount = dollarsToCents(draft.maxDiscount);
		if (minPurchase === null || maxDiscount === null) {
			setFormError("Minimum purchase and maximum discount must be valid amounts.");
			return;
		}
		const startAt = dateInputToTimestamp(draft.startAt);
		const endAt = dateInputToTimestamp(draft.endAt);
		if (startAt !== void 0 && endAt !== void 0 && endAt < startAt) {
			setFormError("The end date must be on or after the start date.");
			return;
		}
		const input = {
			name,
			kind: draft.kind,
			value: draft.kind === DiscountKind.percentage ? BigInt(Math.round(value)) : BigInt(Math.round(value * 100)),
			active: draft.active,
			eligibility: draft.eligibility,
			minPurchase,
			maxDiscount,
			startAt,
			endAt
		};
		setFormError(null);
		if (editingId !== null) updateDiscount.mutate({
			id: editingId,
			input
		}, { onSuccess: () => resetForm() });
		else createDiscount.mutate(input, { onSuccess: () => resetForm() });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminCard, {
		"data-ocid": "admin.settings.discounts.card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminCardHeader, {
				title: "Discounts",
				description: "Create and manage the discounts customers can receive.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminChip, {
					"data-ocid": "admin.settings.discounts.count_chip",
					children: [
						rules.length,
						" ",
						rules.length === 1 ? "rule" : "rules"
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface-alt))] p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mb-3 text-base font-bold text-[oklch(var(--admin-foreground))]",
						children: editingId !== null ? "Edit discount" : "New discount"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
								label: "Name",
								htmlFor: "discount-name",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminInput, {
									id: "discount-name",
									"data-ocid": "admin.settings.discounts.name_input",
									placeholder: "Returning customer 10%",
									value: draft.name,
									onChange: (event) => setDraft((current) => ({
										...current,
										name: event.target.value
									}))
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
								label: "Type",
								htmlFor: "discount-kind",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminSelect, {
									id: "discount-kind",
									"data-ocid": "admin.settings.discounts.kind_select",
									value: draft.kind,
									onChange: (event) => setDraft((current) => ({
										...current,
										kind: event.target.value
									})),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: DiscountKind.percentage,
										children: "Percentage off"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: DiscountKind.fixed,
										children: "Fixed amount off"
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
								label: draft.kind === DiscountKind.percentage ? "Percentage" : "Amount",
								htmlFor: "discount-value",
								hint: draft.kind === DiscountKind.percentage ? "Whole percent, e.g. 10 for 10%." : "Dollar amount, e.g. 25 for $25.00.",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminInput, {
									id: "discount-value",
									"data-ocid": "admin.settings.discounts.value_input",
									type: "number",
									min: "0",
									step: draft.kind === DiscountKind.percentage ? "1" : "0.01",
									inputMode: "decimal",
									placeholder: draft.kind === DiscountKind.percentage ? "10" : "25.00",
									value: draft.value,
									onChange: (event) => setDraft((current) => ({
										...current,
										value: event.target.value
									}))
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
								label: "Eligibility",
								htmlFor: "discount-eligibility",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminSelect, {
									id: "discount-eligibility",
									"data-ocid": "admin.settings.discounts.eligibility_select",
									value: draft.eligibility,
									onChange: (event) => setDraft((current) => ({
										...current,
										eligibility: event.target.value
									})),
									children: ELIGIBILITY_OPTIONS.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: option,
										children: discountEligibilityLabel(option)
									}, option))
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
								label: "Start date",
								htmlFor: "discount-start",
								hint: "Optional.",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminInput, {
									id: "discount-start",
									"data-ocid": "admin.settings.discounts.start_input",
									type: "date",
									value: draft.startAt,
									onChange: (event) => setDraft((current) => ({
										...current,
										startAt: event.target.value
									}))
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
								label: "End date",
								htmlFor: "discount-end",
								hint: "Optional.",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminInput, {
									id: "discount-end",
									"data-ocid": "admin.settings.discounts.end_input",
									type: "date",
									value: draft.endAt,
									onChange: (event) => setDraft((current) => ({
										...current,
										endAt: event.target.value
									}))
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
								label: "Minimum purchase",
								htmlFor: "discount-min",
								hint: "Optional. Dollars.",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminInput, {
									id: "discount-min",
									"data-ocid": "admin.settings.discounts.min_input",
									type: "number",
									min: "0",
									step: "0.01",
									inputMode: "decimal",
									placeholder: "0.00",
									value: draft.minPurchase,
									onChange: (event) => setDraft((current) => ({
										...current,
										minPurchase: event.target.value
									}))
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
								label: "Maximum discount",
								htmlFor: "discount-max",
								hint: "Optional. Dollars.",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminInput, {
									id: "discount-max",
									"data-ocid": "admin.settings.discounts.max_input",
									type: "number",
									min: "0",
									step: "0.01",
									inputMode: "decimal",
									placeholder: "0.00",
									value: draft.maxDiscount,
									onChange: (event) => setDraft((current) => ({
										...current,
										maxDiscount: event.target.value
									}))
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 flex flex-wrap items-center gap-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							htmlFor: "discount-active",
							className: "flex min-h-11 cursor-pointer items-center gap-2 text-base font-semibold text-[oklch(var(--admin-foreground))]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "discount-active",
								"data-ocid": "admin.settings.discounts.active_checkbox",
								type: "checkbox",
								className: "size-5 accent-[oklch(var(--admin-primary))]",
								checked: draft.active,
								onChange: (event) => setDraft((current) => ({
									...current,
									active: event.target.checked
								}))
							}), "Active"]
						})
					}),
					formError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						role: "alert",
						"data-ocid": "admin.settings.discounts.form_error",
						className: "mt-3 text-sm font-medium text-[oklch(var(--admin-status-action))]",
						children: formError
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminButton, {
							"data-ocid": "admin.settings.discounts.save_button",
							disabled: isSaving,
							onClick: handleSubmit,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), isSaving ? "Saving…" : editingId !== null ? "Save changes" : "Create discount"]
						}), editingId !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminButton, {
							variant: "secondary",
							"data-ocid": "admin.settings.discounts.cancel_button",
							onClick: resetForm,
							children: "Cancel"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5",
				children: discountsQuery.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLoadingState, {
					"data-ocid": "admin.settings.discounts.loading_state",
					label: "Loading discounts…"
				}) : discountsQuery.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminErrorState, {
					"data-ocid": "admin.settings.discounts.error_state",
					message: "We couldn't load your discounts.",
					onRetry: () => void discountsQuery.refetch()
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminDataTable, {
					"data-ocid": "admin.settings.discounts.table",
					caption: "Discount rules",
					columns: [
						{
							key: "name",
							header: "Discount",
							cell: (rule) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block font-semibold text-[oklch(var(--admin-foreground))]",
									children: rule.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-sm text-[oklch(var(--admin-muted-foreground))]",
									children: discountEligibilityLabel(rule.eligibility)
								})]
							})
						},
						{
							key: "value",
							header: "Value",
							cell: (rule) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono font-semibold",
								children: discountValueLabel(rule)
							})
						},
						{
							key: "kind",
							header: "Type",
							hideOnMobile: true,
							cell: (rule) => discountKindLabel(rule.kind)
						},
						{
							key: "window",
							header: "Dates",
							hideOnMobile: true,
							cell: (rule) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm text-[oklch(var(--admin-muted-foreground))]",
								children: rule.startAt !== void 0 || rule.endAt !== void 0 ? `${rule.startAt !== void 0 ? formatDate(rule.startAt) : "Any"} – ${rule.endAt !== void 0 ? formatDate(rule.endAt) : "Any"}` : "Always on"
							})
						},
						{
							key: "limits",
							header: "Limits",
							hideOnMobile: true,
							cell: (rule) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-sm text-[oklch(var(--admin-muted-foreground))]",
								children: [rule.minPurchase > 0n ? `Min ${formatMoney(rule.minPurchase)}` : "No minimum", rule.maxDiscount > 0n ? ` · Max ${formatMoney(rule.maxDiscount)}` : ""]
							})
						},
						{
							key: "status",
							header: "Status",
							cell: (rule) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminStatusBadge, {
								tone: rule.active ? "paid" : "cancelled",
								label: rule.active ? "Active" : "Inactive",
								dot: true
							})
						},
						{
							key: "actions",
							header: "Actions",
							align: "right",
							cell: (rule) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center justify-end gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminButton, {
										variant: "secondary",
										size: "sm",
										"data-ocid": `admin.settings.discounts.toggle_button.${rule.id}`,
										disabled: setActive.isPending,
										onClick: () => setActive.mutate({
											id: rule.id,
											active: !rule.active
										}),
										children: rule.active ? "Turn off" : "Turn on"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminButton, {
										variant: "secondary",
										size: "sm",
										"data-ocid": `admin.settings.discounts.edit_button.${rule.id}`,
										onClick: () => handleEdit(rule),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" }), "Edit"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminButton, {
										variant: "danger",
										size: "sm",
										"data-ocid": `admin.settings.discounts.delete_button.${rule.id}`,
										onClick: () => setPendingDelete(rule),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), "Delete"]
									})
								]
							})
						}
					],
					rows: rules,
					rowKey: (rule) => rule.id.toString(),
					empty: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminEmptyState, {
						"data-ocid": "admin.settings.discounts.empty_state",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgePercent, { className: "size-6" }),
						title: "No discounts yet",
						description: "Create your first discount above and it will appear here."
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminConfirmDialog, {
				open: pendingDelete !== null,
				onOpenChange: (open) => {
					if (!open) setPendingDelete(null);
				},
				title: "Delete this discount?",
				description: pendingDelete ? `"${pendingDelete.name}" will be removed permanently.` : void 0,
				confirmLabel: "Delete discount",
				destructive: true,
				isPending: deleteDiscount.isPending,
				onConfirm: () => {
					if (pendingDelete === null) return;
					deleteDiscount.mutate(pendingDelete.id, { onSuccess: () => setPendingDelete(null) });
				}
			})
		]
	});
}
// src/pages/admin/settings/PaymentSettingsSection.tsx
/**
* Payment settings: the owner's payment handles and accepted methods.
*
* The handles are the owner's own supplied payment information — the form is
* seeded from the saved settings and falls back to the owner's known handles,
* and it never invents or changes a handle on its own.
*/
function PaymentSettingsSection() {
	const settingsQuery = useSettings();
	const setPayment = useSetPaymentSettings();
	const [draft, setDraft] = (0, import_react.useState)(null);
	const [initialized, setInitialized] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [saved, setSaved] = (0, import_react.useState)(false);
	const savedPayment = settingsQuery.data?.payment;
	(0, import_react.useEffect)(() => {
		if (!initialized && savedPayment) {
			setDraft({
				cashAppHandle: savedPayment.cashAppHandle || "$thebirdhouse2",
				venmoHandle: savedPayment.venmoHandle || "@Lavona-Wright",
				payPalHandle: savedPayment.payPalHandle || "tanae Wright",
				chimeHandle: savedPayment.chimeHandle || "$Tanae-Wright-2",
				acceptedMethods: savedPayment.acceptedMethods.length > 0 ? savedPayment.acceptedMethods : PAYMENT_METHODS
			});
			setInitialized(true);
		}
	}, [initialized, savedPayment]);
	const toggleMethod = (method, checked) => {
		setDraft((current) => {
			if (!current) return current;
			const next = checked ? [...current.acceptedMethods, method] : current.acceptedMethods.filter((item) => item !== method);
			return {
				...current,
				acceptedMethods: next
			};
		});
	};
	const handleSave = () => {
		if (!draft) return;
		setSaved(false);
		setError(null);
		const settings = {
			cashAppHandle: draft.cashAppHandle.trim(),
			venmoHandle: draft.venmoHandle.trim(),
			payPalHandle: draft.payPalHandle.trim(),
			chimeHandle: draft.chimeHandle.trim(),
			acceptedMethods: draft.acceptedMethods
		};
		setPayment.mutate(settings, {
			onSuccess: (result) => {
				if (result.__kind__ === "ok") {
					setDraft({
						cashAppHandle: result.ok.cashAppHandle || "$thebirdhouse2",
						venmoHandle: result.ok.venmoHandle || "@Lavona-Wright",
						payPalHandle: result.ok.payPalHandle || "tanae Wright",
						chimeHandle: result.ok.chimeHandle || "$Tanae-Wright-2",
						acceptedMethods: result.ok.acceptedMethods.length > 0 ? result.ok.acceptedMethods : PAYMENT_METHODS
					});
					setSaved(true);
				} else setError(result.err.__kind__ === "invalidInput" ? result.err.invalidInput : "We couldn't save the payment settings. Please try again.");
			},
			onError: () => {
				setError("We couldn't save the payment settings. Please try again.");
			}
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminCard, {
		"data-ocid": "admin.settings.payment.card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminCardHeader, {
			title: "Payment",
			description: "The payment handles customers use and the methods you accept.",
			action: saved ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminChip, {
				"data-ocid": "admin.settings.payment.saved_chip",
				children: "Saved"
			}) : void 0
		}), settingsQuery.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLoadingState, {
			"data-ocid": "admin.settings.payment.loading_state",
			label: "Loading payment settings…"
		}) : settingsQuery.isError || !draft ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminErrorState, {
			"data-ocid": "admin.settings.payment.error_state",
			message: "We couldn't load the payment settings.",
			onRetry: () => void settingsQuery.refetch()
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
							label: "Cash App",
							htmlFor: "payment-cashapp",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminInput, {
								id: "payment-cashapp",
								"data-ocid": "admin.settings.payment.cashapp_input",
								placeholder: "$thebirdhouse2",
								value: draft.cashAppHandle,
								onChange: (event) => setDraft((current) => current ? {
									...current,
									cashAppHandle: event.target.value
								} : current)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
							label: "Venmo",
							htmlFor: "payment-venmo",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminInput, {
								id: "payment-venmo",
								"data-ocid": "admin.settings.payment.venmo_input",
								placeholder: "@Lavona-Wright",
								value: draft.venmoHandle,
								onChange: (event) => setDraft((current) => current ? {
									...current,
									venmoHandle: event.target.value
								} : current)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
							label: "PayPal",
							htmlFor: "payment-paypal",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminInput, {
								id: "payment-paypal",
								"data-ocid": "admin.settings.payment.paypal_input",
								placeholder: "tanae Wright",
								value: draft.payPalHandle,
								onChange: (event) => setDraft((current) => current ? {
									...current,
									payPalHandle: event.target.value
								} : current)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
							label: "Chime",
							htmlFor: "payment-chime",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminInput, {
								id: "payment-chime",
								"data-ocid": "admin.settings.payment.chime_input",
								placeholder: "$Tanae-Wright-2",
								value: draft.chimeHandle,
								onChange: (event) => setDraft((current) => current ? {
									...current,
									chimeHandle: event.target.value
								} : current)
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
					className: "mb-2 text-sm font-semibold text-[oklch(var(--admin-foreground))]",
					children: "Accepted methods"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-3",
					children: PAYMENT_METHODS.map((method) => {
						const checked = draft.acceptedMethods.includes(method);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							htmlFor: `payment-method-${method}`,
							className: "flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface))] px-3 text-base font-medium text-[oklch(var(--admin-foreground))]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: `payment-method-${method}`,
								"data-ocid": `admin.settings.payment.method_checkbox.${method}`,
								type: "checkbox",
								className: "size-5 accent-[oklch(var(--admin-primary))]",
								checked,
								onChange: (event) => toggleMethod(method, event.target.checked)
							}), paymentMethodLabel(method)]
						}, method);
					})
				})] }),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "alert",
					"data-ocid": "admin.settings.payment.form_error",
					className: "text-sm font-medium text-[oklch(var(--admin-status-action))]",
					children: error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminButton, {
					"data-ocid": "admin.settings.payment.save_button",
					disabled: setPayment.isPending,
					onClick: handleSave,
					children: setPayment.isPending ? "Saving…" : "Save payment settings"
				}) })
			]
		})]
	});
}
// src/pages/admin/settings/QuoteSettingsSection.tsx
/**
* Quote settings: the default validity window and the terms shown on quotes.
*
* The validity is a whole number of days a quote stays open; the terms are the
* standard wording printed on every quote the owner sends.
*/
function QuoteSettingsSection() {
	const settingsQuery = useSettings();
	const setQuote = useSetQuoteSettings();
	const [validityDays, setValidityDays] = (0, import_react.useState)("");
	const [terms, setTerms] = (0, import_react.useState)("");
	const [initialized, setInitialized] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [saved, setSaved] = (0, import_react.useState)(false);
	const savedQuote = settingsQuery.data?.quote;
	(0, import_react.useEffect)(() => {
		if (!initialized && savedQuote) {
			setValidityDays(`${Number(savedQuote.validityDays)}`);
			setTerms(savedQuote.terms);
			setInitialized(true);
		}
	}, [initialized, savedQuote]);
	const handleSave = () => {
		setSaved(false);
		const days = Number(validityDays.trim());
		if (!Number.isFinite(days) || days < 1 || days > 365) {
			setError("Enter a validity between 1 and 365 days.");
			return;
		}
		setError(null);
		const setting = {
			validityDays: BigInt(Math.round(days)),
			terms: terms.trim()
		};
		setQuote.mutate(setting, {
			onSuccess: (result) => {
				if (result.__kind__ === "ok") {
					setValidityDays(`${Number(result.ok.validityDays)}`);
					setTerms(result.ok.terms);
					setSaved(true);
				} else setError(result.err.__kind__ === "invalidInput" ? result.err.invalidInput : "We couldn't save the quote settings. Please try again.");
			},
			onError: () => {
				setError("We couldn't save the quote settings. Please try again.");
			}
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminCard, {
		"data-ocid": "admin.settings.quote.card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminCardHeader, {
			title: "Quotes",
			description: "How long a quote stays open and the terms printed on it.",
			action: saved ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminChip, {
				"data-ocid": "admin.settings.quote.saved_chip",
				children: "Saved"
			}) : void 0
		}), settingsQuery.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLoadingState, {
			"data-ocid": "admin.settings.quote.loading_state",
			label: "Loading quote settings…"
		}) : settingsQuery.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminErrorState, {
			"data-ocid": "admin.settings.quote.error_state",
			message: "We couldn't load the quote settings.",
			onRetry: () => void settingsQuery.refetch()
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
					label: "Validity (days)",
					htmlFor: "quote-validity",
					error,
					hint: "How many days a quote stays open before it expires.",
					className: "sm:max-w-xs",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminInput, {
						id: "quote-validity",
						"data-ocid": "admin.settings.quote.validity_input",
						type: "number",
						min: "1",
						max: "365",
						step: "1",
						inputMode: "numeric",
						placeholder: "30",
						value: validityDays,
						onChange: (event) => setValidityDays(event.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
					label: "Quote terms",
					htmlFor: "quote-terms",
					hint: "Standard wording shown on every quote.",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminTextarea, {
						id: "quote-terms",
						"data-ocid": "admin.settings.quote.terms_input",
						placeholder: "Deposit is due before scheduling. Remaining balance is due on completion.",
						value: terms,
						onChange: (event) => setTerms(event.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminButton, {
					"data-ocid": "admin.settings.quote.save_button",
					disabled: setQuote.isPending,
					onClick: handleSave,
					children: setQuote.isPending ? "Saving…" : "Save quote settings"
				}) })
			]
		})]
	});
}
// src/pages/admin/settings/TaxSettingsSection.tsx
/**
* Tax settings: whether tax is charged and at what rate.
*
* The rate is a whole percent applied to the adjusted subtotal. Turning tax off
* keeps the saved rate so the owner can switch it back on without retyping it.
*/
function TaxSettingsSection() {
	const settingsQuery = useSettings();
	const setTax = useSetTaxSetting();
	const [enabled, setEnabled] = (0, import_react.useState)(true);
	const [rate, setRate] = (0, import_react.useState)("");
	const [initialized, setInitialized] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [saved, setSaved] = (0, import_react.useState)(false);
	const savedTax = settingsQuery.data?.tax;
	(0, import_react.useEffect)(() => {
		if (!initialized && savedTax) {
			setEnabled(savedTax.enabled);
			setRate(`${Number(savedTax.ratePercent)}`);
			setInitialized(true);
		}
	}, [initialized, savedTax]);
	const handleSave = () => {
		setSaved(false);
		const value = Number(rate.trim());
		if (!Number.isFinite(value) || value < 0 || value > 100) {
			setError("Enter a tax rate between 0 and 100.");
			return;
		}
		setError(null);
		const setting = {
			enabled,
			ratePercent: BigInt(Math.round(value))
		};
		setTax.mutate(setting, {
			onSuccess: (result) => {
				if (result.__kind__ === "ok") {
					setEnabled(result.ok.enabled);
					setRate(`${Number(result.ok.ratePercent)}`);
					setSaved(true);
				} else setError(result.err.__kind__ === "invalidInput" ? result.err.invalidInput : "We couldn't save the tax setting. Please try again.");
			},
			onError: () => {
				setError("We couldn't save the tax setting. Please try again.");
			}
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminCard, {
		"data-ocid": "admin.settings.tax.card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminCardHeader, {
			title: "Tax",
			description: "Whether tax is charged and at what rate.",
			action: saved ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminChip, {
				"data-ocid": "admin.settings.tax.saved_chip",
				children: "Saved"
			}) : void 0
		}), settingsQuery.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLoadingState, {
			"data-ocid": "admin.settings.tax.loading_state",
			label: "Loading tax setting…"
		}) : settingsQuery.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminErrorState, {
			"data-ocid": "admin.settings.tax.error_state",
			message: "We couldn't load the tax setting.",
			onRetry: () => void settingsQuery.refetch()
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				htmlFor: "tax-enabled",
				className: "flex min-h-11 cursor-pointer items-center gap-2 text-base font-semibold text-[oklch(var(--admin-foreground))]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: "tax-enabled",
					"data-ocid": "admin.settings.tax.enabled_checkbox",
					type: "checkbox",
					className: "size-5 accent-[oklch(var(--admin-primary))]",
					checked: enabled,
					onChange: (event) => setEnabled(event.target.checked)
				}), "Charge tax on quotes"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 sm:flex-row sm:items-end",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
					label: "Tax rate",
					htmlFor: "tax-rate",
					error,
					hint: "A whole percent, e.g. 8.5 for 8.5%.",
					className: "sm:max-w-xs",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminInput, {
						id: "tax-rate",
						"data-ocid": "admin.settings.tax.rate_input",
						type: "number",
						min: "0",
						max: "100",
						step: "0.01",
						inputMode: "decimal",
						placeholder: "8.5",
						value: rate,
						onChange: (event) => setRate(event.target.value)
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminButton, {
					"data-ocid": "admin.settings.tax.save_button",
					disabled: setTax.isPending,
					onClick: handleSave,
					className: "sm:w-auto",
					children: setTax.isPending ? "Saving…" : "Save tax"
				})]
			})]
		})]
	});
}
// src/pages/admin/Settings.tsx
/**
* Admin Settings page.
*
* The owner's control room: alert preferences, discount rules, deposit, tax,
* payment, quote and business settings. Every section is a white card on the
* light admin ground with large readable text and large tap targets, and the
* whole page stacks cleanly on phone widths without horizontal scrolling.
*/
function SettingsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
		eyebrow: "Admin",
		title: "Settings",
		description: "Alerts, discounts, deposits, tax, payments, quotes and business details."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertSettingsSection, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DiscountSettingsSection, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DepositSettingsSection, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaxSettingsSection, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentSettingsSection, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuoteSettingsSection, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BusinessSettingsSection, {})
		]
	})] });
}
export { SettingsPage };
