import { K as cn, st as require_jsx_runtime } from "./createLucideIcon-CK3986Sn.js";
import { t as Check } from "./check-qhjPHsNw.js";
// src/components/honey/HexStatus.tsx
var import_jsx_runtime = require_jsx_runtime();
/**
* Hexagon-clipped status chip. Replaces the generic coloured dot used for job
* lifecycle states.
*/
function HexStatus({ label, toneClass, className, "data-ocid": dataOcid }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		"data-ocid": dataOcid,
		className: cn("text-outline-black inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em]", toneClass ?? "border-primary/50 bg-primary/15 text-primary", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			"aria-hidden": "true",
			className: "hex-clip size-2.5 shrink-0 bg-current"
		}), label]
	});
}
/**
* Honeycomb lifecycle indicator. Each stage is a hexagon joined by a comb
* connector; completed stages fill with honey gold and show a check.
*/
function HexStatusTimeline({ steps, currentIndex, className, "data-ocid": dataOcid }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		"data-ocid": dataOcid,
		className: cn("flex w-full items-start", className),
		children: steps.map((step, index) => {
			const done = index < currentIndex;
			const active = index === currentIndex;
			const reached = done || active;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex min-w-0 flex-1 flex-col items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex w-full items-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"aria-hidden": "true",
							className: cn("h-px flex-1", index === 0 ? "bg-transparent" : done || active ? "bg-primary/60" : "bg-border")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("hex-clip flex size-9 shrink-0 items-center justify-center border text-[0.7rem] font-bold transition-smooth", reached ? "border-primary/60 bg-primary/25 text-primary" : "border-border bg-muted/40 text-muted-foreground", active && "glow-honey scale-110"),
							children: done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
								className: "size-4",
								strokeWidth: 3
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: index + 1 })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"aria-hidden": "true",
							className: cn("h-px flex-1", index === steps.length - 1 ? "bg-transparent" : done ? "bg-primary/60" : "bg-border")
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("text-outline-black text-center text-[0.65rem] font-semibold uppercase leading-tight tracking-[0.1em]", active ? "text-primary" : done ? "text-foreground/80" : "text-muted-foreground"),
					children: step
				})]
			}, step);
		})
	});
}
export { HexStatusTimeline as n, HexStatus as t };
