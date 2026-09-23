import { c as createLucideIcon, r as reactExports, m as useJobByReference, j as jsxRuntimeExports, B as BeeAccent, H as HoneyButton, n as HoneyLoader, o as getService, q as getStatusMeta, s as useAcceptQuote, t as useConfirmAppointment, v as useRecordDeposit, w as useSubmitReview, x as useVisitHistory, D as DEPOSIT_OPTIONS, y as depositAmount, z as balanceDue, A as isPackageActive, b as packageVisitsLabel, C as packageStartedLabel, E as sortVisitsNewestFirst, F as formatReference, G as statusIndex, I as formatDateTime, P as PACKAGE_BILLING_NOTE, J as formatMoney, K as visitServiceLabel, M as visitBeeName, N as formatVisitDate } from "./index-CGAnElCs.js";
import { H as HexStatus, a as HexStatusTimeline } from "./HexStatus-BUowxcU6.js";
import { H as HoneyCard, a as HoneyCardHeader } from "./HoneyCard-C_fTGS3d.js";
import { L as Label, I as Input, C as Check, T as Textarea } from "./textarea-CMTxuGmY.js";
import { C as CalendarCheck } from "./calendar-check-CtMF6iDa.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
];
const Copy = createLucideIcon("copy", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "M10 14 21 3", key: "gplh6r" }],
  ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
];
const ExternalLink = createLucideIcon("external-link", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }],
  ["path", { d: "M12 7v5l4 2", key: "1fdv2h" }]
];
const History = createLucideIcon("history", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
      key: "r04s7s"
    }
  ]
];
const Star = createLucideIcon("star", __iconNode);
function TrackPage() {
  const [reference, setReference] = reactExports.useState("");
  const [submitted, setSubmitted] = reactExports.useState("");
  const jobQuery = useJobByReference(submitted);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-page-enter px-5 py-10 sm:px-8 md:py-14", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto w-full max-w-3xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "mb-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(BeeAccent, { className: "mx-auto h-8 w-11" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-4 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl", children: "Track your Honey Do" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mx-auto mt-3 max-w-lg text-sm text-muted-foreground md:text-base", children: "Enter the reference code from your request to see its progress." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(HoneyCard, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "form",
      {
        onSubmit: (event) => {
          event.preventDefault();
          setSubmitted(reference.trim());
        },
        className: "flex flex-col gap-3 sm:flex-row sm:items-end",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "reference", children: "Reference code" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "reference",
                "data-ocid": "track.reference_input",
                value: reference,
                onChange: (event) => setReference(event.target.value),
                placeholder: "HD-4F2A9C",
                className: "mt-2 min-h-12 font-mono uppercase tracking-[0.14em]"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            HoneyButton,
            {
              type: "submit",
              "data-ocid": "track.lookup_button",
              disabled: reference.trim().length === 0,
              className: "w-full sm:w-auto",
              children: "Find my job"
            }
          )
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6", children: [
      submitted.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(HoneyCard, { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        "Your reference code looks like",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-semibold text-primary", children: "HD-4F2A9C" }),
        ". It was shown when you submitted your request."
      ] }) }),
      submitted.length > 0 && jobQuery.isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(HoneyCard, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        HoneyLoader,
        {
          "data-ocid": "track.loading_state",
          label: "Finding your job"
        }
      ) }),
      submitted.length > 0 && jobQuery.isError && /* @__PURE__ */ jsxRuntimeExports.jsx(HoneyCard, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          "data-ocid": "track.error_state",
          className: "text-center text-sm text-destructive",
          children: "Something went wrong looking up that code. Please try again."
        }
      ) }),
      submitted.length > 0 && !jobQuery.isLoading && !jobQuery.isError && !jobQuery.data && /* @__PURE__ */ jsxRuntimeExports.jsx(HoneyCard, { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          "data-ocid": "track.empty_state",
          className: "text-sm text-muted-foreground",
          children: "We couldn't find a job with that code. Double-check the letters and numbers, then try again."
        }
      ) }),
      jobQuery.data && /* @__PURE__ */ jsxRuntimeExports.jsx(JobDetail, { job: jobQuery.data })
    ] })
  ] }) });
}
function JobDetail({ job }) {
  var _a, _b;
  const service = getService(job.category);
  const status = getStatusMeta(job.status);
  const acceptQuote = useAcceptQuote();
  const confirmAppointment = useConfirmAppointment();
  const recordDeposit = useRecordDeposit();
  const submitReview = useSubmitReview();
  const visitsQuery = useVisitHistory(job.referenceCode);
  const [rating, setRating] = reactExports.useState(5);
  const [comment, setComment] = reactExports.useState("");
  const [copiedId, setCopiedId] = reactExports.useState(null);
  const [selectedOptionId, setSelectedOptionId] = reactExports.useState(
    DEPOSIT_OPTIONS[0].id
  );
  const [celebrating, setCelebrating] = reactExports.useState(false);
  const quoteAccepted = job.status !== "quoted";
  const canAcceptQuote = !!job.quote && job.status === "quoted";
  const canPayDeposit = !!job.quote && job.status !== "quoted" && !((_a = job.deposit) == null ? void 0 : _a.paid);
  const canReview = job.status === "completed" && !job.review;
  const isCompleted = job.status === "completed";
  const deposit = job.quote ? depositAmount(job.quote.amount) : 0n;
  const balance = job.quote ? balanceDue(job.quote.amount) : 0n;
  const packageActive = isPackageActive(job.packageEnrollment);
  const packageVisits = packageVisitsLabel(job.packageEnrollment);
  const packageStarted = packageStartedLabel(job.packageEnrollment);
  const visits = sortVisitsNewestFirst(visitsQuery.data ?? []);
  const selectedOption = DEPOSIT_OPTIONS.find((option) => option.id === selectedOptionId) ?? DEPOSIT_OPTIONS[0];
  const selectedMethod = selectedOption.method;
  const copyHandle = async (option) => {
    try {
      await navigator.clipboard.writeText(option.handle);
      setCopiedId(option.id);
      window.setTimeout(
        () => setCopiedId((current) => current === option.id ? null : current),
        2e3
      );
    } catch {
      setCopiedId(null);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    celebrating && /* @__PURE__ */ jsxRuntimeExports.jsx(BeeSwarmCelebration, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(HoneyCard, { "data-ocid": "track.job_card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        HoneyCardHeader,
        {
          title: service.label,
          description: `Reference ${formatReference(job.referenceCode)}`,
          action: /* @__PURE__ */ jsxRuntimeExports.jsx(
            HexStatus,
            {
              "data-ocid": "track.status_chip",
              label: status.label,
              toneClass: status.chipClass
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: status.description }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        HexStatusTimeline,
        {
          "data-ocid": "track.status_timeline",
          steps: [
            "Requested",
            "Quoted",
            "Scheduled",
            "In Progress",
            "Completed"
          ],
          currentIndex: Math.max(statusIndex(job.status), 0)
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "mt-6 grid gap-4 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Detail, { label: "Requested", value: formatDateTime(job.createdAt) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Detail, { label: "Preferred timing", value: job.preferredTiming }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Detail,
          {
            label: "Contact",
            value: `${job.customerName} · ${job.phone}`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Detail, { label: "Email", value: job.email })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 rounded-xl border border-border/70 bg-muted/30 p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground", children: "Your description" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-foreground", children: job.description })
      ] })
    ] }),
    job.assignedBeeName && /* @__PURE__ */ jsxRuntimeExports.jsxs(HoneyCard, { "data-ocid": "track.assigned_bee_card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        HoneyCardHeader,
        {
          title: "Your bee",
          description: "The Honey Do's bee handling this visit."
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "relative flex size-16 shrink-0 items-center justify-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              "aria-hidden": "true",
              className: "hex-clip absolute inset-0 bg-gradient-to-b from-primary/45 to-primary/10"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            BeeAccent,
            {
              className: "relative z-10 h-9 w-12",
              motion: "hover",
              label: `${job.assignedBeeName}, your assigned bee`
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-lg font-semibold text-foreground", children: job.assignedBeeName }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            "Assigned to your ",
            service.label.toLowerCase(),
            " visit."
          ] })
        ] })
      ] })
    ] }),
    job.packageEnrollment && /* @__PURE__ */ jsxRuntimeExports.jsxs(HoneyCard, { "data-ocid": "track.package_card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        HoneyCardHeader,
        {
          title: "Monthly package",
          description: packageActive ? "Your hive membership is active." : "Your hive membership is paused.",
          action: /* @__PURE__ */ jsxRuntimeExports.jsx(
            HexStatus,
            {
              "data-ocid": "track.package_status_chip",
              label: packageActive ? "Active" : "Paused",
              toneClass: packageActive ? "border-success/60 bg-success/15 text-success" : "border-warning/60 bg-warning/15 text-warning"
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "grid gap-4 sm:grid-cols-2", children: [
        packageVisits && /* @__PURE__ */ jsxRuntimeExports.jsx(Detail, { label: "Included", value: packageVisits }),
        packageStarted && /* @__PURE__ */ jsxRuntimeExports.jsx(Detail, { label: "Started", value: packageStarted })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-4 text-xs text-muted-foreground", children: [
        "Your monthly rate is set with the owner. ",
        PACKAGE_BILLING_NOTE
      ] })
    ] }),
    job.quote && /* @__PURE__ */ jsxRuntimeExports.jsxs(HoneyCard, { "data-ocid": "track.quote_card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        HoneyCardHeader,
        {
          title: "Your quote",
          description: `Sent ${formatDateTime(job.quote.sentAt)}`
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-3xl font-bold text-gold-gradient", children: formatMoney(job.quote.amount) }),
      job.quote.discountApplied && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "p",
        {
          "data-ocid": "track.quote_discount",
          className: "mt-3 inline-flex items-center gap-2 rounded-full border border-success/50 bg-success/15 px-3 py-1 text-xs font-semibold text-success",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3.5" }),
            "Own parts/supplies discount applied — 10% off (",
            formatMoney(job.quote.discountAmount),
            ")"
          ]
        }
      ),
      job.quote.note && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: job.quote.note }),
      canAcceptQuote && /* @__PURE__ */ jsxRuntimeExports.jsx(
        HoneyButton,
        {
          "data-ocid": "track.accept_quote_button",
          disabled: acceptQuote.isPending,
          onClick: () => acceptQuote.mutate(job.referenceCode, {
            onSuccess: () => setCelebrating(true)
          }),
          className: "mt-5 w-full sm:w-auto",
          children: acceptQuote.isPending ? "Accepting…" : "🍯 ACCEPT QUOTE"
        }
      ),
      quoteAccepted && !canAcceptQuote && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-4 inline-flex items-center gap-2 text-sm font-semibold text-success", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-4" }),
        "Quote accepted"
      ] })
    ] }),
    job.quote && /* @__PURE__ */ jsxRuntimeExports.jsxs(HoneyCard, { "data-ocid": "track.payment_breakdown_card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        HoneyCardHeader,
        {
          title: "Deposit & balance",
          description: "Half now secures your spot; the rest is due on completion."
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "space-y-3", children: [
        job.quote.discountApplied && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-sm text-muted-foreground", children: "Own parts/supplies discount (10%)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("dd", { className: "font-mono text-sm font-semibold text-success", children: [
            "−",
            formatMoney(job.quote.discountAmount)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-sm text-muted-foreground", children: "Quote total" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "font-mono text-sm font-semibold text-foreground", children: formatMoney(job.quote.amount) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-sm text-muted-foreground", children: "Deposit (50%)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "font-mono text-sm font-semibold text-foreground", children: formatMoney(deposit) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 border-t border-border/70 pt-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-sm font-semibold text-foreground", children: "Balance due" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "font-mono text-base font-bold text-gold-gradient", children: formatMoney(balance) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4", children: ((_b = job.deposit) == null ? void 0 : _b.paid) ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "p",
        {
          "data-ocid": "track.deposit_status",
          className: "inline-flex items-center gap-2 text-sm font-semibold text-success",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-4" }),
            "Deposit paid — ",
            formatMoney(job.deposit.amount),
            " received"
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "p",
        {
          "data-ocid": "track.deposit_status",
          className: "inline-flex items-center gap-2 text-sm font-semibold text-warning",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                "aria-hidden": "true",
                className: "hex-clip size-2.5 bg-current"
              }
            ),
            "Deposit due — ",
            formatMoney(deposit)
          ]
        }
      ) })
    ] }),
    job.appointment && /* @__PURE__ */ jsxRuntimeExports.jsxs(HoneyCard, { "data-ocid": "track.appointment_card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        HoneyCardHeader,
        {
          title: "Appointment",
          description: formatDateTime(job.appointment.scheduledAt),
          action: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "relative flex size-11 items-center justify-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                "aria-hidden": "true",
                className: "hex-clip absolute inset-0 bg-gradient-to-b from-primary/50 to-primary/10"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarCheck, { className: "relative z-10 size-5 text-primary" })
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(BeeAccent, { className: "h-6 w-8", motion: "drift" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Your slot is reserved on the hive calendar." })
      ] }),
      job.appointment.confirmed ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "inline-flex items-center gap-2 text-sm font-semibold text-success", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-4" }),
        "Appointment confirmed"
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        HoneyButton,
        {
          "data-ocid": "track.confirm_appointment_button",
          disabled: confirmAppointment.isPending,
          onClick: () => confirmAppointment.mutate(job.referenceCode),
          className: "w-full sm:w-auto",
          children: confirmAppointment.isPending ? "Confirming…" : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(BeeAccent, { className: "h-4 w-6" }),
            "CONFIRM APPOINTMENT"
          ] })
        }
      )
    ] }),
    canPayDeposit && job.quote && /* @__PURE__ */ jsxRuntimeExports.jsxs(HoneyCard, { "data-ocid": "track.deposit_card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        HoneyCardHeader,
        {
          title: "Secure your spot",
          description: `Send the ${formatMoney(deposit)} deposit to confirm your booking.`
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Pick where you'd like to send it, copy the handle, then tap “I've sent it” so we can mark your deposit received." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          "data-ocid": "track.deposit_options",
          className: "mt-4 grid gap-3 sm:grid-cols-2",
          children: DEPOSIT_OPTIONS.map((option) => {
            const selected = option.id === selectedOption.id;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": `track.deposit_option.${option.id}`,
                className: `flex flex-col gap-2 rounded-xl border p-4 transition-smooth ${selected ? "border-primary/60 bg-primary/15 shadow-honey" : "border-border/70 bg-muted/30 hover:border-primary/40"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      "data-ocid": `track.deposit_select_button.${option.id}`,
                      "aria-pressed": selected,
                      onClick: () => setSelectedOptionId(option.id),
                      className: "flex min-h-8 w-full items-center justify-between gap-2 rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-base font-semibold text-foreground", children: option.label }),
                        selected && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-4 shrink-0 text-primary" })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "min-w-0 truncate font-mono text-sm font-semibold text-primary", children: option.handle }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        "data-ocid": `track.deposit_copy_button.${option.id}`,
                        "aria-label": `Copy ${option.label} handle`,
                        onClick: () => void copyHandle(option),
                        className: "shrink-0 rounded-full p-1.5 transition-smooth hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        children: copiedId === option.id ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "size-4" })
                      }
                    )
                  ] })
                ]
              },
              option.id
            );
          })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 rounded-xl border border-primary/40 bg-primary/10 p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold uppercase tracking-[0.2em] text-primary", children: [
          "Pay by ",
          selectedOption.label
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-sm text-muted-foreground", children: [
          selectedOption.hint,
          " Send ",
          formatMoney(deposit),
          ", then tap “I've sent it”."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-col gap-3 sm:flex-row sm:items-center", children: [
          selectedOption.url && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "a",
            {
              href: selectedOption.url,
              target: "_blank",
              rel: "noreferrer",
              "data-ocid": `track.deposit_open_link.${selectedOption.id}`,
              className: "inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-primary/45 bg-secondary/60 px-6 text-base font-semibold text-foreground transition-smooth hover:border-primary/70 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "size-4" }),
                "Open ",
                selectedOption.label
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            HoneyButton,
            {
              "data-ocid": "track.deposit_sent_button",
              disabled: recordDeposit.isPending,
              onClick: () => recordDeposit.mutate({
                referenceCode: job.referenceCode,
                method: selectedMethod
              }),
              className: "w-full sm:w-auto",
              children: recordDeposit.isPending ? "Marking…" : `I've sent it via ${selectedOption.label}`
            }
          )
        ] }),
        recordDeposit.isError && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            "data-ocid": "track.deposit_error",
            className: "mt-3 text-sm font-semibold text-destructive",
            children: "We couldn't record your deposit. Please try again."
          }
        ),
        recordDeposit.isSuccess && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "p",
          {
            "data-ocid": "track.deposit_recorded",
            className: "mt-3 inline-flex items-center gap-2 text-sm font-semibold text-success",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-4" }),
              "Thanks — we'll confirm your ",
              selectedOption.label,
              " deposit shortly."
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(HoneyCard, { "data-ocid": "track.visit_history_card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        HoneyCardHeader,
        {
          title: "Past visits",
          description: "Every Honey Do's visit to your home, newest first.",
          action: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "relative flex size-11 items-center justify-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                "aria-hidden": "true",
                className: "hex-clip absolute inset-0 bg-gradient-to-b from-primary/50 to-primary/10"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "relative z-10 size-5 text-primary" })
          ] })
        }
      ),
      visitsQuery.isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(
        HoneyLoader,
        {
          "data-ocid": "track.visit_history_loading",
          label: "Loading your visits"
        }
      ),
      !visitsQuery.isLoading && visitsQuery.isError && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          "data-ocid": "track.visit_history_error",
          className: "text-sm text-destructive",
          children: "We couldn't load your visit history. Please try again."
        }
      ),
      !visitsQuery.isLoading && !visitsQuery.isError && visits.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          "data-ocid": "track.visit_history_empty",
          className: "text-sm text-muted-foreground",
          children: "No completed visits yet. Once your first Honey Do is finished, it will show up here."
        }
      ),
      visits.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { "data-ocid": "track.visit_history_list", className: "space-y-3", children: visits.map((visit, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "li",
        {
          "data-ocid": `track.visit_history_item.${index + 1}`,
          className: "flex items-center gap-4 rounded-xl border border-border/70 bg-muted/30 p-4",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "relative flex size-12 shrink-0 items-center justify-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  "aria-hidden": "true",
                  className: "hex-clip absolute inset-0 bg-gradient-to-b from-primary/40 to-primary/10"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(BeeAccent, { className: "relative z-10 h-7 w-9", motion: "hover" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate font-display text-base font-semibold text-foreground", children: visitServiceLabel(visit) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-sm text-muted-foreground", children: visitBeeName(visit) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground", children: formatVisitDate(visit) })
          ]
        },
        `${visit.jobId.toString()}-${visit.completedAt.toString()}`
      )) })
    ] }),
    job.review && /* @__PURE__ */ jsxRuntimeExports.jsxs(HoneyCard, { "data-ocid": "track.review_card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(HoneyCardHeader, { title: "Your review" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: [1, 2, 3, 4, 5].map((value) => {
        var _a2;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          Star,
          {
            className: value <= Number((_a2 = job.review) == null ? void 0 : _a2.rating) ? "size-5 fill-primary text-primary" : "size-5 text-muted-foreground"
          },
          value
        );
      }) }),
      job.review.comment && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: job.review.comment })
    ] }),
    isCompleted && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      HoneyCard,
      {
        "data-ocid": "track.completed_accent",
        className: "flex items-center gap-4",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "relative flex size-14 shrink-0 items-center justify-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                "aria-hidden": "true",
                className: "hex-clip absolute inset-0 bg-gradient-to-b from-success/40 to-success/10"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(BeeAccent, { className: "relative z-10 h-8 w-11", motion: "hover" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                "aria-hidden": "true",
                className: "hex-clip absolute -bottom-1 right-0 size-3 bg-gradient-to-b from-accent to-primary shadow-honey"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-base font-semibold text-foreground", children: "Job complete" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Your Honey Do is finished — thank you for letting us help." })
          ] })
        ]
      }
    ),
    canReview && /* @__PURE__ */ jsxRuntimeExports.jsxs(HoneyCard, { "data-ocid": "track.review_form", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        HoneyCardHeader,
        {
          title: "How did we do?",
          description: "Your feedback helps us keep the hive buzzing."
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: [1, 2, 3, 4, 5].map((value) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          "data-ocid": `track.rating_button.${value}`,
          "aria-label": `Rate ${value} out of 5`,
          "aria-pressed": rating === value,
          onClick: () => setRating(value),
          className: "rounded-full p-1 transition-smooth hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Star,
            {
              className: value <= rating ? "size-7 fill-primary text-primary" : "size-7 text-muted-foreground"
            }
          )
        },
        value
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "review-comment", children: "Leave a comment" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            id: "review-comment",
            "data-ocid": "track.review_input",
            value: comment,
            onChange: (event) => setComment(event.target.value),
            placeholder: "They fixed the faucet and even tightened the cabinet door.",
            className: "mt-2 min-h-24"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        HoneyButton,
        {
          "data-ocid": "track.submit_review_button",
          disabled: submitReview.isPending,
          onClick: () => submitReview.mutate(
            {
              referenceCode: job.referenceCode,
              rating: BigInt(rating),
              comment: comment.trim()
            },
            { onSuccess: () => setComment("") }
          ),
          className: "mt-4 w-full sm:w-auto",
          children: submitReview.isPending ? "Sending…" : "Submit review"
        }
      )
    ] })
  ] });
}
const SWARM_BEES = [
  { id: "swarm-1", top: 14, left: -12, duration: 2.6, delay: 0, size: 44 },
  { id: "swarm-2", top: 30, left: -18, duration: 3.1, delay: 0.18, size: 34 },
  { id: "swarm-3", top: 48, left: -10, duration: 2.9, delay: 0.36, size: 40 },
  { id: "swarm-4", top: 64, left: -16, duration: 3.3, delay: 0.54, size: 30 },
  { id: "swarm-5", top: 22, left: -22, duration: 3.5, delay: 0.72, size: 38 },
  { id: "swarm-6", top: 76, left: -14, duration: 2.8, delay: 0.9, size: 32 },
  { id: "swarm-7", top: 40, left: -20, duration: 3.2, delay: 1.08, size: 36 },
  { id: "swarm-8", top: 56, left: -12, duration: 3, delay: 1.26, size: 28 }
];
function BeeSwarmCelebration() {
  const [reducedMotion, setReducedMotion] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);
    const onChange = (event) => setReducedMotion(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);
  if (reducedMotion) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-ocid": "track.bee_celebration",
        "aria-hidden": "true",
        className: "pointer-events-none fixed inset-0 z-40 animate-honey-glow bg-gradient-to-b from-accent/25 via-primary/10 to-transparent"
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "track.bee_celebration",
      "aria-hidden": "true",
      className: "pointer-events-none fixed inset-0 z-40 overflow-hidden",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inset-0 animate-honey-glow bg-gradient-to-b from-accent/30 via-primary/10 to-transparent" }),
        SWARM_BEES.map((bee) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "absolute animate-bee-swarm",
            style: {
              top: `${bee.top}%`,
              left: `${bee.left}vw`,
              animationDuration: `${bee.duration}s`,
              animationDelay: `${bee.delay}s`
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              BeeAccent,
              {
                className: "h-auto",
                motion: "hover",
                ...{ style: { width: `${bee.size}px` } }
              }
            )
          },
          bee.id
        ))
      ]
    }
  );
}
function Detail({ label, value }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "mt-1 truncate text-sm text-foreground", children: value })
  ] });
}
export {
  TrackPage
};
