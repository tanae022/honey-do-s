import { c as createLucideIcon, l as loadConfig, i as HttpAgent, k as StorageClient, O as useIsAdmin, Q as useInternetIdentity, j as jsxRuntimeExports, n as HoneyLoader, H as HoneyButton, R as LogIn, T as useDashboardStats, U as useJobRequests, V as useBees, B as BeeAccent, J as formatMoney, W as useCreateBee, Y as useUpdateBee, r as reactExports, Z as useIsStripeConfigured, _ as useSetStripeConfiguration, o as getService, q as getStatusMeta, $ as useAdvanceStatus, a0 as useSetQuote, a1 as useScheduleAppointment, a2 as useAssignBeeToJob, a3 as useEnrollInPackage, a4 as useCancelPackage, a5 as nextStatus, A as isPackageActive, F as formatReference, I as formatDateTime, f as cn, X, b as packageVisitsLabel, C as packageStartedLabel, P as PACKAGE_BILLING_NOTE, a6 as useCustomerVisitHistory, E as sortVisitsNewestFirst, N as formatVisitDate, K as visitServiceLabel, M as visitBeeName } from "./index-CGAnElCs.js";
import { H as HexStatus } from "./HexStatus-BUowxcU6.js";
import { H as HoneyCard, a as HoneyCardHeader } from "./HoneyCard-C_fTGS3d.js";
import { L as Label, I as Input, T as Textarea } from "./textarea-CMTxuGmY.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$6 = [
  ["path", { d: "M16 19h6", key: "xwg31i" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["path", { d: "M19 16v6", key: "tddt3s" }],
  ["path", { d: "M21 12.598V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8.5", key: "1glfrc" }],
  ["path", { d: "M3 10h18", key: "8toen8" }],
  ["path", { d: "M8 2v4", key: "1cmpym" }]
];
const CalendarPlus = createLucideIcon("calendar-plus", __iconNode$6);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$5 = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]];
const ChevronRight = createLucideIcon("chevron-right", __iconNode$5);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["rect", { width: "20", height: "14", x: "2", y: "5", rx: "2", key: "ynyp8z" }],
  ["line", { x1: "2", x2: "22", y1: "10", y2: "10", key: "1b3vmo" }]
];
const CreditCard = createLucideIcon("credit-card", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["line", { x1: "2", x2: "22", y1: "2", y2: "22", key: "a6p6uj" }],
  ["path", { d: "M10.41 10.41a2 2 0 1 1-2.83-2.83", key: "1bzlo9" }],
  ["line", { x1: "13.5", x2: "6", y1: "13.5", y2: "21", key: "1q0aeu" }],
  ["line", { x1: "18", x2: "21", y1: "12", y2: "15", key: "5mozeu" }],
  [
    "path",
    {
      d: "M3.59 3.59A1.99 1.99 0 0 0 3 5v14a2 2 0 0 0 2 2h14c.55 0 1.052-.22 1.41-.59",
      key: "mmje98"
    }
  ],
  ["path", { d: "M21 15V5a2 2 0 0 0-2-2H9", key: "43el77" }]
];
const ImageOff = createLucideIcon("image-off", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ],
  ["path", { d: "m15 5 4 4", key: "1mk7zo" }]
];
const Pencil = createLucideIcon("pencil", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "M12 8v4", key: "1got3b" }],
  ["path", { d: "M12 16h.01", key: "1drbdi" }]
];
const ShieldAlert = createLucideIcon("shield-alert", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["line", { x1: "19", x2: "19", y1: "8", y2: "14", key: "1bvyxn" }],
  ["line", { x1: "22", x2: "16", y1: "11", y2: "11", key: "1shjgl" }]
];
const UserPlus = createLucideIcon("user-plus", __iconNode);
let clientPromise = null;
async function getStorageClient() {
  if (!clientPromise) {
    clientPromise = (async () => {
      var _a;
      const config = await loadConfig();
      const agent = new HttpAgent({ host: config.backend_host });
      if ((_a = config.backend_host) == null ? void 0 : _a.includes("localhost")) {
        await agent.fetchRootKey().catch(() => void 0);
      }
      return new StorageClient(
        config.bucket_name,
        config.storage_gateway_url,
        config.backend_canister_id,
        config.project_id,
        agent
      );
    })().catch((error) => {
      clientPromise = null;
      throw error;
    });
  }
  return clientPromise;
}
async function resolvePhotoUrl(hash) {
  const trimmed = hash.trim();
  if (trimmed.length === 0) {
    throw new Error("Photo hash is empty");
  }
  const client = await getStorageClient();
  return client.getDirectURL(trimmed);
}
function AdminPage() {
  const { data: isAdmin, isLoading: roleLoading } = useIsAdmin();
  const { login, loginStatus } = useInternetIdentity();
  if (roleLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-16 sm:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(HoneyCard, { className: "mx-auto max-w-md", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      HoneyLoader,
      {
        "data-ocid": "admin.loading_state",
        label: "Checking access"
      }
    ) }) });
  }
  if (!isAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-page-enter px-5 py-16 sm:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(HoneyCard, { className: "mx-auto max-w-md text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "relative mx-auto flex size-14 items-center justify-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            "aria-hidden": "true",
            className: "hex-clip absolute inset-0 bg-gradient-to-b from-primary/50 to-primary/10"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "relative z-10 size-6 text-primary" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-5 font-display text-2xl font-bold text-foreground", children: "Admin access required" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: "Sign in with an administrator identity to manage incoming Honey Do's." }),
      loginStatus !== "success" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        HoneyButton,
        {
          "data-ocid": "admin.login_button",
          onClick: () => login(),
          className: "mt-6 w-full sm:w-auto",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "size-4" }),
            "Sign in"
          ]
        }
      )
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminDashboard, {});
}
function AdminDashboard() {
  const statsQuery = useDashboardStats();
  const requestsQuery = useJobRequests();
  const beesQuery = useBees();
  const stats = statsQuery.data;
  const requests = requestsQuery.data ?? [];
  const bees = beesQuery.data ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-page-enter px-5 py-10 sm:px-8 md:py-14", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto w-full max-w-5xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-[0.28em] text-primary", children: "Hive control" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-2 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl", children: "Dashboard" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(BeeAccent, { motion: "drift", className: "h-8 w-11" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "section",
      {
        "data-ocid": "admin.stats_section",
        className: "grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-5",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatCard,
            {
              ocid: "admin.stat.new_requests",
              icon: "🍯",
              label: "New requests",
              value: stats ? stats.newRequests.toString() : "—"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatCard,
            {
              ocid: "admin.stat.upcoming",
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(BeeAccent, { className: "h-5 w-7" }),
              label: "Upcoming",
              value: stats ? stats.upcomingAppointments.toString() : "—"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatCard,
            {
              ocid: "admin.stat.deposits",
              icon: "💰",
              label: "Deposits",
              value: stats ? formatMoney(stats.depositsCollected) : "—"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatCard,
            {
              ocid: "admin.stat.active_jobs",
              icon: "🏠",
              label: "Active jobs",
              value: stats ? stats.activeJobs.toString() : "—"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatCard,
            {
              ocid: "admin.stat.reviews",
              icon: "⭐",
              label: "Reviews",
              value: stats ? stats.reviewsCount.toString() : "—"
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mt-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BeeCrewPanel, { bees, isLoading: beesQuery.isLoading }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mt-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StripeSettingsPanel, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-4 font-display text-xl font-semibold text-foreground", children: "Job requests" }),
      requestsQuery.isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(HoneyCard, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        HoneyLoader,
        {
          "data-ocid": "admin.requests_loading_state",
          label: "Loading requests"
        }
      ) }),
      requestsQuery.isError && /* @__PURE__ */ jsxRuntimeExports.jsx(HoneyCard, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          "data-ocid": "admin.requests_error_state",
          className: "text-center text-sm text-destructive",
          children: "We couldn't load the request list. Please refresh."
        }
      ) }),
      !requestsQuery.isLoading && !requestsQuery.isError && requests.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(HoneyCard, { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          "data-ocid": "admin.requests_empty_state",
          className: "text-sm text-muted-foreground",
          children: "No requests yet. New Honey Do's will appear here as they arrive."
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: requests.map((job, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        AdminJobCard,
        {
          job,
          index: index + 1,
          bees
        },
        job.id.toString()
      )) })
    ] })
  ] }) });
}
function BeeCrewPanel({
  bees,
  isLoading
}) {
  const createBee = useCreateBee();
  const updateBee = useUpdateBee();
  const [name, setName] = reactExports.useState("");
  const [specialty, setSpecialty] = reactExports.useState("");
  const [editingId, setEditingId] = reactExports.useState(null);
  const [editName, setEditName] = reactExports.useState("");
  const [editSpecialty, setEditSpecialty] = reactExports.useState("");
  const canAdd = name.trim().length > 0 && specialty.trim().length > 0;
  const startEdit = (bee) => {
    setEditingId(bee.id);
    setEditName(bee.name);
    setEditSpecialty(bee.specialty);
  };
  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditSpecialty("");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(HoneyCard, { "data-ocid": "admin.bees_panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      HoneyCardHeader,
      {
        title: "Bee crew",
        description: "Your bees are the employees who do the Honey Do's. Add each bee with a name and specialty.",
        action: /* @__PURE__ */ jsxRuntimeExports.jsx(
          HexStatus,
          {
            "data-ocid": "admin.bees_count",
            label: `${bees.length} ${bees.length === 1 ? "bee" : "bees"}`
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/70 bg-muted/25 p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-sm font-semibold text-foreground", children: "Add a bee" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 grid gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "bee-name", children: "Bee name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "bee-name",
                "data-ocid": "admin.bee_name_input",
                value: name,
                onChange: (event) => setName(event.target.value),
                placeholder: "Beatrice",
                className: "mt-2 min-h-12"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "bee-specialty", children: "Specialty" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "bee-specialty",
                "data-ocid": "admin.bee_specialty_input",
                value: specialty,
                onChange: (event) => setSpecialty(event.target.value),
                placeholder: "Deep cleaning & organizing",
                className: "mt-2 min-h-12"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            HoneyButton,
            {
              "data-ocid": "admin.add_bee_button",
              disabled: createBee.isPending || !canAdd,
              onClick: () => {
                const nextName = name.trim();
                const nextSpecialty = specialty.trim();
                setName("");
                setSpecialty("");
                createBee.mutate(
                  { name: nextName, specialty: nextSpecialty },
                  {
                    onError: () => {
                      setName(
                        (current) => current === "" ? nextName : current
                      );
                      setSpecialty(
                        (current) => current === "" ? nextSpecialty : current
                      );
                    }
                  }
                );
              },
              className: "w-full",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "size-4" }),
                createBee.isPending ? "Adding…" : "Add bee"
              ]
            }
          ),
          createBee.isError && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              "data-ocid": "admin.add_bee_error_state",
              className: "text-sm text-destructive",
              children: "We couldn't add that bee. Please try again."
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        HoneyLoader,
        {
          "data-ocid": "admin.bees_loading_state",
          label: "Loading the crew"
        }
      ) : bees.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": "admin.bees_empty_state",
          className: "flex h-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border/80 bg-muted/20 p-6 text-center",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(BeeAccent, { motion: "hover", className: "h-10 w-14" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No bees in the hive yet. Add your first bee to start assigning jobs." })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        "ul",
        {
          "data-ocid": "admin.bees_list",
          className: "grid gap-3 sm:grid-cols-2",
          children: bees.map((bee, index) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            BeeCrewItem,
            {
              bee,
              index: index + 1,
              editing: editingId === bee.id,
              editName,
              editSpecialty,
              onEditName: setEditName,
              onEditSpecialty: setEditSpecialty,
              onStartEdit: () => startEdit(bee),
              onCancelEdit: cancelEdit,
              isSaving: updateBee.isPending,
              onSave: () => {
                const nextName = editName.trim();
                const nextSpecialty = editSpecialty.trim();
                if (nextName.length === 0 || nextSpecialty.length === 0) {
                  return;
                }
                updateBee.mutate(
                  {
                    id: bee.id,
                    input: { name: nextName, specialty: nextSpecialty }
                  },
                  { onSuccess: cancelEdit }
                );
              }
            }
          ) }, bee.id.toString()))
        }
      ) })
    ] })
  ] });
}
function BeeCrewItem({
  bee,
  index,
  editing,
  editName,
  editSpecialty,
  onEditName,
  onEditSpecialty,
  onStartEdit,
  onCancelEdit,
  onSave,
  isSaving
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": `admin.bee_item.${index}`,
      className: "flex h-full flex-col gap-3 rounded-xl border border-border/70 bg-card/60 p-4",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "relative flex size-12 shrink-0 items-center justify-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                "aria-hidden": "true",
                className: "hex-clip absolute inset-0 bg-gradient-to-b from-primary/40 to-primary/5"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(BeeAccent, { motion: "hover", className: "relative z-10 h-7 w-10" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-w-0 flex-1", children: editing ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                "aria-label": "Bee name",
                "data-ocid": `admin.bee_edit_name_input.${index}`,
                value: editName,
                onChange: (event) => onEditName(event.target.value),
                className: "min-h-10"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                "aria-label": "Bee specialty",
                "data-ocid": `admin.bee_edit_specialty_input.${index}`,
                value: editSpecialty,
                onChange: (event) => onEditSpecialty(event.target.value),
                className: "min-h-10"
              }
            )
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate font-display text-base font-semibold text-foreground", children: bee.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-sm text-muted-foreground", children: bee.specialty })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-auto flex items-center gap-2", children: editing ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            HoneyButton,
            {
              size: "sm",
              "data-ocid": `admin.bee_save_button.${index}`,
              disabled: isSaving || editName.trim().length === 0 || editSpecialty.trim().length === 0,
              onClick: onSave,
              children: isSaving ? "Saving…" : "Save"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            HoneyButton,
            {
              size: "sm",
              variant: "ghost",
              "data-ocid": `admin.bee_cancel_button.${index}`,
              onClick: onCancelEdit,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }),
                "Cancel"
              ]
            }
          )
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          HoneyButton,
          {
            size: "sm",
            variant: "secondary",
            "data-ocid": `admin.bee_edit_button.${index}`,
            onClick: onStartEdit,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-4" }),
              "Edit"
            ]
          }
        ) })
      ]
    }
  );
}
function StripeSettingsPanel() {
  const configuredQuery = useIsStripeConfigured();
  const setConfiguration = useSetStripeConfiguration();
  const [secretKey, setSecretKey] = reactExports.useState("");
  const [countries, setCountries] = reactExports.useState("US");
  const [saved, setSaved] = reactExports.useState(false);
  const configured = configuredQuery.data === true;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(HoneyCard, { "data-ocid": "admin.stripe_panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      HoneyCardHeader,
      {
        title: "Card payments",
        description: "Connect Stripe so customers can pay their deposit by card.",
        action: /* @__PURE__ */ jsxRuntimeExports.jsx(
          HexStatus,
          {
            "data-ocid": "admin.stripe_status",
            label: configured ? "Configured" : "Not configured",
            toneClass: configured ? "border-success/40 bg-success/15 text-success" : "border-destructive/40 bg-destructive/15 text-destructive"
          }
        )
      }
    ),
    configuredQuery.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      HoneyLoader,
      {
        "data-ocid": "admin.stripe_loading_state",
        label: "Checking Stripe status"
      }
    ) : configured ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Stripe is connected. Deposit checkout is live for accepted quotes." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "stripe-secret-key", children: "Stripe secret key" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "stripe-secret-key",
            type: "password",
            autoComplete: "off",
            "data-ocid": "admin.stripe_secret_key_input",
            value: secretKey,
            onChange: (event) => {
              setSecretKey(event.target.value);
              setSaved(false);
            },
            placeholder: "sk_live_…",
            className: "mt-2 min-h-12"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "stripe-countries", children: "Allowed countries" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "stripe-countries",
            "data-ocid": "admin.stripe_countries_input",
            value: countries,
            onChange: (event) => {
              setCountries(event.target.value);
              setSaved(false);
            },
            placeholder: "US, CA, GB",
            className: "mt-2 min-h-12"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs text-muted-foreground", children: "Comma-separated two-letter country codes." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          HoneyButton,
          {
            "data-ocid": "admin.stripe_save_button",
            disabled: setConfiguration.isPending || secretKey.trim().length === 0,
            onClick: () => {
              const allowedCountries = countries.split(",").map((code) => code.trim().toUpperCase()).filter((code) => code.length > 0);
              setConfiguration.mutate(
                {
                  secretKey: secretKey.trim(),
                  allowedCountries: allowedCountries.length > 0 ? allowedCountries : ["US"]
                },
                {
                  onSuccess: () => {
                    setSecretKey("");
                    setSaved(true);
                  }
                }
              );
            },
            className: "sm:w-auto",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "size-4" }),
              setConfiguration.isPending ? "Saving…" : "Save Stripe key"
            ]
          }
        ),
        saved && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            "data-ocid": "admin.stripe_saved_state",
            className: "text-sm text-success",
            children: "Stripe key saved."
          }
        )
      ] }),
      setConfiguration.isError && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          "data-ocid": "admin.stripe_error_state",
          className: "text-sm text-destructive",
          children: "We couldn't save the Stripe key. Check the key and try again."
        }
      )
    ] })
  ] });
}
function StatCard({
  label,
  value,
  ocid,
  icon
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(HoneyCard, { "data-ocid": ocid, className: "p-4 text-center md:p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        "aria-hidden": "true",
        className: "inline-flex items-center justify-center text-lg md:text-xl",
        children: icon
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 font-mono text-2xl font-bold text-gold-gradient md:text-3xl", children: value }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground md:text-xs", children: label })
  ] });
}
function AdminJobCard({
  job,
  index,
  bees
}) {
  const service = getService(job.category);
  const status = getStatusMeta(job.status);
  const advance = useAdvanceStatus();
  const setQuote = useSetQuote();
  const schedule = useScheduleAppointment();
  const assignBee = useAssignBeeToJob();
  const enroll = useEnrollInPackage();
  const cancelPackage = useCancelPackage();
  const [quoteAmount, setQuoteAmount] = reactExports.useState("");
  const [quoteNote, setQuoteNote] = reactExports.useState("");
  const [appointmentAt, setAppointmentAt] = reactExports.useState("");
  const [selectedBeeId, setSelectedBeeId] = reactExports.useState("");
  const upcoming = nextStatus(job.status);
  const onPackage = isPackageActive(job.packageEnrollment);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(HoneyCard, { "data-ocid": `admin.request_card.${index}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      HoneyCardHeader,
      {
        title: service.label,
        description: `${job.customerName} · ${formatReference(job.referenceCode)}`,
        action: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            HexStatus,
            {
              "data-ocid": `admin.request_status.${index}`,
              label: status.label,
              toneClass: status.chipClass
            }
          ),
          onPackage && /* @__PURE__ */ jsxRuntimeExports.jsx(
            HexStatus,
            {
              "data-ocid": `admin.request_package_badge.${index}`,
              label: "Monthly package",
              toneClass: "border-accent/60 bg-accent/15 text-accent"
            }
          )
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "grid gap-3 sm:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Detail, { label: "Received", value: formatDateTime(job.createdAt) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Detail, { label: "Preferred timing", value: job.preferredTiming }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ContactDetail,
        {
          label: "Phone",
          value: job.phone,
          href: `tel:${job.phone.replace(/[^\d+]/g, "")}`,
          ocid: `admin.request_phone_link.${index}`
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ContactDetail,
        {
          label: "Email",
          value: job.email,
          href: `mailto:${job.email}`,
          ocid: `admin.request_email_link.${index}`
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": `admin.quote_workspace.${index}`,
        className: "mt-5 grid gap-5 border-t border-border/70 pt-5 lg:grid-cols-2",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-[0.18em] text-primary", children: "What the customer sent" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 rounded-xl border border-border/70 bg-muted/30 p-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground", children: "Description" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  "data-ocid": `admin.request_description.${index}`,
                  className: "mt-2 text-sm text-foreground",
                  children: job.description
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground", children: "Photos" }),
              job.photoIds.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "ul",
                {
                  "data-ocid": `admin.request_photos.${index}`,
                  className: "mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3",
                  children: job.photoIds.map((photoId, photoIndex) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    RequestPhoto,
                    {
                      photoId,
                      index,
                      photoIndex: photoIndex + 1
                    },
                    photoId
                  ))
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  "data-ocid": `admin.request_photos_empty.${index}`,
                  className: "mt-2 rounded-xl border border-dashed border-border/80 bg-muted/20 px-4 py-6 text-center text-sm text-muted-foreground",
                  children: "No photos were attached to this request."
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": `admin.own_parts_state.${index}`,
                className: cn(
                  "mt-3 flex items-start gap-3 rounded-xl border p-4",
                  job.ownParts ? "border-success/50 bg-success/10" : "border-border/70 bg-muted/25"
                ),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      "aria-hidden": "true",
                      className: cn(
                        "hex-clip mt-0.5 size-3 shrink-0",
                        job.ownParts ? "bg-success" : "bg-muted-foreground/60"
                      )
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: job.ownParts ? "Customer supplies their own parts/supplies" : "Customer needs us to supply parts/supplies" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: job.ownParts ? "A 10% discount is applied automatically when you send the quote." : "No own-parts discount applies to this quote." })
                  ] })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-[0.18em] text-primary", children: "Send the quote" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: `quote-amount-${index}`, children: "Quote amount (USD)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex flex-col gap-2 sm:flex-row", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: `quote-amount-${index}`,
                    "data-ocid": `admin.quote_amount_input.${index}`,
                    inputMode: "decimal",
                    value: quoteAmount,
                    onChange: (event) => setQuoteAmount(event.target.value),
                    placeholder: "120.00",
                    className: "min-h-12 sm:flex-1"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  HoneyButton,
                  {
                    size: "sm",
                    "data-ocid": `admin.set_quote_button.${index}`,
                    disabled: setQuote.isPending || quoteAmount.trim().length === 0,
                    onClick: () => {
                      const parsed = Number.parseFloat(quoteAmount);
                      if (Number.isNaN(parsed) || parsed <= 0) return;
                      setQuote.mutate(
                        {
                          id: job.id,
                          amount: BigInt(Math.round(parsed * 100)),
                          note: quoteNote.trim()
                        },
                        {
                          onSuccess: () => {
                            setQuoteAmount("");
                            setQuoteNote("");
                          }
                        }
                      );
                    },
                    className: "sm:w-auto",
                    children: setQuote.isPending ? "Saving…" : "Send quote"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-xs text-muted-foreground", children: [
                "Enter the full price before any discount.",
                " ",
                job.ownParts ? "The 10% own-parts discount is applied automatically." : "No discount applies to this request."
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: `quote-note-${index}`, children: "What's included" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  id: `quote-note-${index}`,
                  "data-ocid": `admin.quote_note_input.${index}`,
                  value: quoteNote,
                  onChange: (event) => setQuoteNote(event.target.value),
                  placeholder: "Includes parts and a two-hour visit.",
                  className: "mt-2 min-h-20"
                }
              )
            ] }),
            job.quote && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": `admin.quote_summary.${index}`,
                className: "mt-3 rounded-xl border border-primary/40 bg-primary/10 p-4",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-[0.18em] text-primary", children: "Quote sent" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 font-mono text-xl font-bold text-gold-gradient", children: formatMoney(job.quote.amount) }),
                  job.quote.discountApplied && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "p",
                    {
                      "data-ocid": `admin.quote_discount.${index}`,
                      className: "mt-2 inline-flex items-center gap-2 rounded-full border border-success/50 bg-success/15 px-3 py-1 text-xs font-semibold text-success",
                      children: [
                        "Own parts/supplies discount applied — 10% off (",
                        formatMoney(job.quote.discountAmount),
                        ")"
                      ]
                    }
                  ),
                  job.quote.note && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: job.quote.note })
                ]
              }
            )
          ] })
        ]
      }
    ),
    job.deposit && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-4 text-sm text-muted-foreground", children: [
      "Deposit",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-semibold text-success", children: formatMoney(job.deposit.amount) }),
      " ",
      job.deposit.paid ? "received" : "pending"
    ] }),
    job.appointment && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-sm text-muted-foreground", children: [
      "Visit ",
      formatDateTime(job.appointment.scheduledAt),
      " ·",
      " ",
      job.appointment.confirmed ? "confirmed" : "awaiting confirmation"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 border-t border-border/70 pt-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: `appointment-${index}`, children: "Schedule a visit" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex flex-col gap-2 sm:flex-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: `appointment-${index}`,
            type: "datetime-local",
            "data-ocid": `admin.appointment_input.${index}`,
            value: appointmentAt,
            onChange: (event) => setAppointmentAt(event.target.value),
            className: "min-h-12 sm:flex-1"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          HoneyButton,
          {
            size: "sm",
            variant: "secondary",
            "data-ocid": `admin.schedule_button.${index}`,
            disabled: schedule.isPending || appointmentAt.length === 0,
            onClick: () => {
              const date = new Date(appointmentAt);
              if (Number.isNaN(date.getTime())) return;
              schedule.mutate(
                {
                  id: job.id,
                  scheduledAt: BigInt(date.getTime()) * 1000000n
                },
                { onSuccess: () => setAppointmentAt("") }
              );
            },
            className: "sm:w-auto",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarPlus, { className: "size-4" }),
              schedule.isPending ? "Saving…" : "Schedule"
            ]
          }
        )
      ] }),
      upcoming && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        HoneyButton,
        {
          variant: "secondary",
          size: "sm",
          "data-ocid": `admin.advance_button.${index}`,
          disabled: advance.isPending,
          onClick: () => advance.mutate(job.id),
          className: "mt-3 w-full sm:w-auto",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-4" }),
            advance.isPending ? "Updating…" : `Move to ${getStatusMeta(upcoming).label}`
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 grid gap-4 border-t border-border/70 pt-5 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        AssignBeePanel,
        {
          job,
          index,
          bees,
          selectedBeeId,
          onSelectBee: setSelectedBeeId,
          onAssign: () => {
            if (selectedBeeId.length === 0) return;
            assignBee.mutate(
              { id: job.id, beeId: BigInt(selectedBeeId) },
              { onSuccess: () => setSelectedBeeId("") }
            );
          },
          isPending: assignBee.isPending,
          isError: assignBee.isError
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        PackagePanel,
        {
          job,
          index,
          onPackage,
          onEnroll: () => enroll.mutate(job.id),
          onCancel: () => cancelPackage.mutate(job.id),
          isPending: enroll.isPending || cancelPackage.isPending,
          isError: enroll.isError || cancelPackage.isError
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(VisitHistoryPanel, { job, index })
  ] });
}
function AssignBeePanel({
  job,
  index,
  bees,
  selectedBeeId,
  onSelectBee,
  onAssign,
  isPending,
  isError
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": `admin.assign_bee_panel.${index}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: `assign-bee-${index}`, children: "Assigned bee" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: job.assignedBeeName ? `Currently ${job.assignedBeeName}` : "No bee assigned yet." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex flex-col gap-2 sm:flex-row", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "select",
        {
          id: `assign-bee-${index}`,
          "data-ocid": `admin.assign_bee_select.${index}`,
          value: selectedBeeId,
          onChange: (event) => onSelectBee(event.target.value),
          disabled: bees.length === 0,
          className: "min-h-12 flex-1 rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-55",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: bees.length === 0 ? "Add a bee first" : "Choose a bee…" }),
            bees.map((bee) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: bee.id.toString(), children: [
              bee.name,
              " — ",
              bee.specialty
            ] }, bee.id.toString()))
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        HoneyButton,
        {
          size: "sm",
          variant: "secondary",
          "data-ocid": `admin.assign_bee_button.${index}`,
          disabled: isPending || selectedBeeId.length === 0,
          onClick: onAssign,
          className: "sm:w-auto",
          children: isPending ? "Assigning…" : "Assign bee"
        }
      )
    ] }),
    isError && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "p",
      {
        "data-ocid": `admin.assign_bee_error_state.${index}`,
        className: "mt-2 text-sm text-destructive",
        children: "We couldn't assign that bee. Please try again."
      }
    )
  ] });
}
function PackagePanel({
  job,
  index,
  onPackage,
  onEnroll,
  onCancel,
  isPending,
  isError
}) {
  const visitsLabel = packageVisitsLabel(job.packageEnrollment);
  const startedLabel = packageStartedLabel(job.packageEnrollment);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": `admin.package_panel.${index}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Monthly package" }),
    onPackage ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: [visitsLabel, startedLabel].filter((part) => Boolean(part)).join(" · ") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs text-muted-foreground", children: [
        "Your monthly rate is set with the owner. ",
        PACKAGE_BILLING_NOTE
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        HoneyButton,
        {
          size: "sm",
          variant: "danger",
          "data-ocid": `admin.cancel_package_button.${index}`,
          disabled: isPending,
          onClick: onCancel,
          className: "mt-3 w-full sm:w-auto",
          children: isPending ? "Updating…" : "Cancel package"
        }
      )
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Not on the monthly package. Enroll this customer to bill the package manually each month." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        HoneyButton,
        {
          size: "sm",
          variant: "secondary",
          "data-ocid": `admin.enroll_package_button.${index}`,
          disabled: isPending,
          onClick: onEnroll,
          className: "mt-3 w-full sm:w-auto",
          children: isPending ? "Updating…" : "Mark on monthly package"
        }
      )
    ] }),
    isError && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "p",
      {
        "data-ocid": `admin.package_error_state.${index}`,
        className: "mt-2 text-sm text-destructive",
        children: "We couldn't update the package. Please try again."
      }
    )
  ] });
}
function VisitHistoryPanel({
  job,
  index
}) {
  const visitsQuery = useCustomerVisitHistory(job.id);
  const visits = sortVisitsNewestFirst(visitsQuery.data ?? []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": `admin.visit_history_panel.${index}`,
      className: "mt-5 border-t border-border/70 pt-5",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "font-display text-sm font-semibold text-foreground", children: [
          "Visit history for ",
          job.customerName
        ] }),
        visitsQuery.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          HoneyLoader,
          {
            "data-ocid": `admin.visit_history_loading_state.${index}`,
            label: "Loading visits"
          }
        ) : visitsQuery.isError ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            "data-ocid": `admin.visit_history_error_state.${index}`,
            className: "mt-2 text-sm text-destructive",
            children: "We couldn't load this customer's visits."
          }
        ) : visits.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            "data-ocid": `admin.visit_history_empty_state.${index}`,
            className: "mt-2 text-sm text-muted-foreground",
            children: "No completed visits yet for this customer."
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ul",
          {
            "data-ocid": `admin.visit_history_list.${index}`,
            className: "mt-3 space-y-2",
            children: visits.map((visit, visitIndex) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "li",
              {
                "data-ocid": `admin.visit_history_item.${index}.${visitIndex + 1}`,
                className: "flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-sm",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-muted-foreground", children: formatVisitDate(visit) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: visitServiceLabel(visit) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto inline-flex items-center gap-2 text-muted-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(BeeAccent, { motion: "hover", className: "h-4 w-6" }),
                    visitBeeName(visit)
                  ] })
                ]
              },
              `${visit.jobId.toString()}-${visit.completedAt.toString()}`
            ))
          }
        )
      ]
    }
  );
}
function RequestPhoto({
  photoId,
  index,
  photoIndex
}) {
  const [url, setUrl] = reactExports.useState(null);
  const [failed, setFailed] = reactExports.useState(false);
  reactExports.useEffect(() => {
    let active = true;
    setUrl(null);
    setFailed(false);
    resolvePhotoUrl(photoId).then((resolved) => {
      if (active) setUrl(resolved);
    }).catch(() => {
      if (active) setFailed(true);
    });
    return () => {
      active = false;
    };
  }, [photoId]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "li",
    {
      "data-ocid": `admin.request_photo.${index}.${photoIndex}`,
      className: "relative overflow-hidden rounded-xl border border-border/80 bg-card",
      children: url ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: url,
          target: "_blank",
          rel: "noreferrer",
          "data-ocid": `admin.request_photo_link.${index}.${photoIndex}`,
          className: "block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: url,
              alt: `Job attachment ${photoIndex} for request ${index}`,
              loading: "lazy",
              className: "aspect-square w-full object-cover transition-smooth hover:scale-105"
            }
          )
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex aspect-square w-full flex-col items-center justify-center gap-2 bg-muted/40 text-muted-foreground", children: failed ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ImageOff, { className: "size-5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 text-center text-[0.65rem]", children: "Photo unavailable" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          "aria-hidden": "true",
          className: "hex-clip size-6 animate-honey-glow bg-primary/70"
        }
      ) })
    }
  );
}
function Detail({ label, value }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "mt-1 truncate text-sm text-foreground", children: value })
  ] });
}
function ContactDetail({
  label,
  value,
  href,
  ocid
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "mt-1 min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "a",
      {
        href,
        "data-ocid": ocid,
        className: "inline-flex max-w-full items-center gap-1.5 truncate text-sm font-semibold text-primary underline-offset-4 transition-smooth hover:text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        children: value
      }
    ) })
  ] });
}
export {
  AdminPage
};
