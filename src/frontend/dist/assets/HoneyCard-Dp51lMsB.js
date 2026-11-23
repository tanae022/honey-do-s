import { K as cn, st as require_jsx_runtime } from "./createLucideIcon-CK3986Sn.js";
// src/components/honey/HoneyCard.tsx
var import_jsx_runtime = require_jsx_runtime();
/**
* Warm chocolate card with a gold-tinted border, honeycomb texture and a soft
* warm shadow. The base surface for every content block in the app.
*/
function HoneyCard({ children, className, interactive = false, textured = true, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("honey-card-surface relative overflow-hidden rounded-2xl border border-border/80 p-5 md:p-6", textured && "honeycomb-texture", interactive && "transition-smooth hover:-translate-y-1 hover:border-primary/50 hover:shadow-hex-glow", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative z-10",
			children
		})
	});
}
function HoneyCardHeader({ title, description, action, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("mb-4 flex items-start justify-between gap-3", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-outline-black-strong font-display text-lg font-semibold leading-tight text-foreground",
				children: title
			}), description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-outline-black mt-1 text-sm text-muted-foreground",
				children: description
			})]
		}), action && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "shrink-0",
			children: action
		})]
	});
}
export { HoneyCardHeader as n, HoneyCard as t };
