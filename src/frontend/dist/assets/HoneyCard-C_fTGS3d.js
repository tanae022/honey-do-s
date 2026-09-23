import { j as jsxRuntimeExports, f as cn } from "./index-CGAnElCs.js";
function HoneyCard({
  children,
  className,
  interactive = false,
  textured = true,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: cn(
        "honey-card-surface relative overflow-hidden rounded-2xl border border-border/80 p-5 md:p-6",
        textured && "honeycomb-texture",
        interactive && "transition-smooth hover:-translate-y-1 hover:border-primary/50 hover:shadow-hex-glow",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative z-10", children })
    }
  );
}
function HoneyCardHeader({
  title,
  description,
  action,
  className
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn("mb-4 flex items-start justify-between gap-3", className),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-outline-black-strong font-display text-lg font-semibold leading-tight text-foreground", children: title }),
          description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-outline-black mt-1 text-sm text-muted-foreground", children: description })
        ] }),
        action && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0", children: action })
      ]
    }
  );
}
export {
  HoneyCard as H,
  HoneyCardHeader as a
};
