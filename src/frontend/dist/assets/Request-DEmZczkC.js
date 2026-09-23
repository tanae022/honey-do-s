import { c as createLucideIcon, j as jsxRuntimeExports, B as BeeAccent, f as cn, u as useSearch, r as reactExports, g as ServiceCategory, h as useSubmitRequest, d as Phone, L as Link, H as HoneyButton, S as SERVICES, X, l as loadConfig, i as HttpAgent, k as StorageClient } from "./index-CGAnElCs.js";
import { L as Lightbulb, S as ShoppingBag, P as Package, a as Sparkles, F as Flower2, b as Sprout, c as PaintRoller, W as Wrench, H as HexTile } from "./HexTile-C0iMC2J9.js";
import { H as HoneyCard } from "./HoneyCard-C_fTGS3d.js";
import { C as Check, L as Label, I as Input, T as Textarea } from "./textarea-CMTxuGmY.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 5h6", key: "1vod17" }],
  ["path", { d: "M19 2v6", key: "4bpg5p" }],
  ["path", { d: "M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5", key: "1ue2ih" }],
  ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21", key: "1xmnt7" }],
  ["circle", { cx: "9", cy: "9", r: "2", key: "af1f0g" }]
];
const ImagePlus = createLucideIcon("image-plus", __iconNode);
function HoneyDropSuccess({
  title,
  message,
  className,
  "data-ocid": dataOcid
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "output",
    {
      "data-ocid": dataOcid,
      "aria-live": "polite",
      className: cn(
        "flex flex-col items-center gap-4 py-8 text-center",
        className
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              "aria-hidden": "true",
              className: "hex-clip block size-24 animate-honey-drop bg-gradient-to-b from-accent to-primary shadow-honey-lg"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              "aria-hidden": "true",
              className: "hex-clip absolute inset-[5px] flex items-center justify-center bg-gradient-to-b from-primary/40 to-card",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-10 text-accent", strokeWidth: 3 })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            BeeAccent,
            {
              motion: "drift",
              className: "absolute -right-8 -top-3 h-7 w-9"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-outline-black-strong font-display text-2xl font-bold text-gold-gradient", children: title }),
          message && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-outline-black mx-auto max-w-sm text-sm text-muted-foreground", children: message })
        ] })
      ]
    }
  );
}
const ICONS = {
  Wrench,
  PaintRoller,
  Sprout,
  Flower2,
  Sparkles,
  Package,
  ShoppingBag,
  Lightbulb
};
const MAX_PHOTOS = 6;
const OWNER_PHONE_DISPLAY = "405-312-4987";
const OWNER_PHONE_HREF = "tel:+14053124987";
const EMPTY_FORM = {
  customerName: "",
  email: "",
  phone: "",
  preferredTiming: "",
  description: "",
  packageInterest: false,
  ownParts: false
};
function RequestPage() {
  const search = useSearch({ from: "/request" });
  const [category, setCategory] = reactExports.useState(
    search.service ?? ServiceCategory.fixIt
  );
  const [form, setForm] = reactExports.useState(EMPTY_FORM);
  const [photos, setPhotos] = reactExports.useState([]);
  const [errors, setErrors] = reactExports.useState({});
  const [referenceCode, setReferenceCode] = reactExports.useState(null);
  const fileInputRef = reactExports.useRef(null);
  const submitRequest = useSubmitRequest();
  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }
  function startUpload(draft) {
    const bytes = draft.file.arrayBuffer();
    void bytes.then(async (buffer) => {
      var _a;
      try {
        const config = await loadConfig();
        const agent = new HttpAgent({ host: config.backend_host });
        if ((_a = config.backend_host) == null ? void 0 : _a.includes("localhost")) {
          await agent.fetchRootKey().catch(() => void 0);
        }
        const storageClient = new StorageClient(
          config.bucket_name,
          config.storage_gateway_url,
          config.backend_canister_id,
          config.project_id,
          agent
        );
        const { hash } = await storageClient.putFile(
          new Uint8Array(buffer),
          (percentage) => {
            setPhotos(
              (current) => current.map(
                (photo) => photo.id === draft.id ? { ...photo, progress: Math.round(percentage) } : photo
              )
            );
          },
          draft.file.type,
          draft.file.name
        );
        setPhotos(
          (current) => current.map(
            (photo) => photo.id === draft.id ? { ...photo, status: "done", progress: 100, photoId: hash } : photo
          )
        );
      } catch {
        setPhotos(
          (current) => current.map(
            (photo) => photo.id === draft.id ? { ...photo, status: "error" } : photo
          )
        );
      }
    });
  }
  function handleFiles(fileList) {
    if (!fileList || fileList.length === 0) return;
    const incoming = Array.from(fileList).filter(
      (file) => file.type.startsWith("image/")
    );
    setPhotos((current) => {
      const room = MAX_PHOTOS - current.length;
      const accepted = incoming.slice(0, Math.max(room, 0));
      const drafts = accepted.map((file, index) => ({
        id: `${Date.now()}-${index}-${file.name}`,
        file,
        previewUrl: URL.createObjectURL(file),
        progress: 0,
        status: "uploading",
        photoId: null
      }));
      for (const draft of drafts) startUpload(draft);
      return [...current, ...drafts];
    });
  }
  function removePhoto(id) {
    setPhotos((current) => {
      const target = current.find((photo) => photo.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return current.filter((photo) => photo.id !== id);
    });
  }
  function validate() {
    const next = {};
    if (form.customerName.trim().length < 2) {
      next.customerName = "Please tell us your name.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = "Enter a valid email address.";
    }
    if (form.phone.trim().length < 7) {
      next.phone = "Enter a phone number we can reach you on.";
    }
    if (form.preferredTiming.trim().length < 2) {
      next.preferredTiming = "When would you like this done?";
    }
    if (form.description.trim().length < 10) {
      next.description = "Add a few details so we can quote accurately.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }
  const uploading = photos.some((photo) => photo.status === "uploading");
  const failedUploads = photos.some((photo) => photo.status === "error");
  function handleSubmit(event) {
    event.preventDefault();
    if (!validate()) return;
    if (uploading) return;
    const input = {
      customerName: form.customerName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      preferredTiming: form.preferredTiming.trim(),
      description: form.description.trim(),
      photoIds: photos.map((photo) => photo.photoId).filter((id) => id !== null),
      category,
      packageInterest: form.packageInterest,
      ownParts: form.ownParts
    };
    submitRequest.mutate(input, {
      onSuccess: (code) => {
        setReferenceCode(code);
        setForm(EMPTY_FORM);
        setErrors({});
        for (const photo of photos) URL.revokeObjectURL(photo.previewUrl);
        setPhotos([]);
      }
    });
  }
  if (referenceCode) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-page-enter px-5 py-12 sm:px-8 md:py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto w-full max-w-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(HoneyCard, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        HoneyDropSuccess,
        {
          "data-ocid": "request.success_state",
          title: "Your request is in!",
          message: "Your request was sent straight to the owner — we've emailed it straight to the owner and tucked your Honey Do into the hive. We'll be in touch shortly."
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 rounded-2xl border border-primary/40 bg-muted/40 p-5 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground", children: "Your reference code" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            "data-ocid": "request.reference_code",
            className: "mt-2 font-mono text-2xl font-bold tracking-[0.18em] text-gold-gradient",
            children: referenceCode.toUpperCase()
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs text-muted-foreground", children: "Save this code — you'll use it to track your job." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 rounded-2xl border border-border/70 bg-card/60 p-4 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Need it handled sooner? Call the owner directly." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "a",
          {
            href: OWNER_PHONE_HREF,
            "data-ocid": "request.success_call_link",
            className: "mt-2 inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-primary/50 bg-primary/10 px-5 text-base font-semibold text-foreground transition-smooth hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "size-4 text-primary", "aria-hidden": "true" }),
              OWNER_PHONE_DISPLAY
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/track", "data-ocid": "request.track_link", children: /* @__PURE__ */ jsxRuntimeExports.jsx(HoneyButton, { className: "w-full sm:w-auto", children: "Track this job" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          HoneyButton,
          {
            variant: "secondary",
            "data-ocid": "request.new_request_button",
            onClick: () => setReferenceCode(null),
            className: "w-full sm:w-auto",
            children: "Submit another"
          }
        )
      ] })
    ] }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-page-enter px-5 py-10 sm:px-8 md:py-14", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto w-full max-w-3xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "mb-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(BeeAccent, { className: "mx-auto h-8 w-11" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-4 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl", children: "Request a Honey Do" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mx-auto mt-3 max-w-lg text-sm text-muted-foreground md:text-base", children: "Tell us what needs doing — just the details, no sign-in needed to request." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-4 text-sm text-muted-foreground", children: [
        "Prefer to talk it through?",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "a",
          {
            href: OWNER_PHONE_HREF,
            "data-ocid": "request.call_link",
            className: "inline-flex min-h-6 items-center gap-1.5 font-semibold text-primary underline-offset-4 transition-smooth hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "size-4", "aria-hidden": "true" }),
              "Call ",
              OWNER_PHONE_DISPLAY
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, noValidate: true, className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(HoneyCard, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("fieldset", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("legend", { className: "mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-primary", children: "Choose a service" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            "data-ocid": "request.service_grid",
            className: "grid grid-cols-2 gap-3 sm:grid-cols-3",
            children: SERVICES.map((service, index) => {
              const Icon = ICONS[service.icon] ?? Wrench;
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                HexTile,
                {
                  "data-ocid": `request.service_tile.${index + 1}`,
                  label: service.label,
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-5" }),
                  selected: category === service.category,
                  onClick: () => setCategory(service.category)
                },
                service.category
              );
            })
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(HoneyCard, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-5 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "customerName", children: "Your name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "customerName",
              "data-ocid": "request.name_input",
              value: form.customerName,
              onChange: (event) => update("customerName", event.target.value),
              placeholder: "Jamie Rivera",
              "aria-invalid": !!errors.customerName,
              className: "mt-2 min-h-12"
            }
          ),
          errors.customerName && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              "data-ocid": "request.name_error",
              className: "mt-1.5 text-xs text-destructive",
              children: errors.customerName
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "email",
              type: "email",
              "data-ocid": "request.email_input",
              value: form.email,
              onChange: (event) => update("email", event.target.value),
              placeholder: "jamie@example.com",
              "aria-invalid": !!errors.email,
              className: "mt-2 min-h-12"
            }
          ),
          errors.email && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              "data-ocid": "request.email_error",
              className: "mt-1.5 text-xs text-destructive",
              children: errors.email
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "phone", children: "Phone" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "phone",
              type: "tel",
              "data-ocid": "request.phone_input",
              value: form.phone,
              onChange: (event) => update("phone", event.target.value),
              placeholder: "(555) 123-4567",
              "aria-invalid": !!errors.phone,
              className: "mt-2 min-h-12"
            }
          ),
          errors.phone && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              "data-ocid": "request.phone_error",
              className: "mt-1.5 text-xs text-destructive",
              children: errors.phone
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "preferredTiming", children: "When works best for you?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "preferredTiming",
              "data-ocid": "request.timing_input",
              value: form.preferredTiming,
              onChange: (event) => update("preferredTiming", event.target.value),
              placeholder: "Weekday mornings, or Saturday afternoon",
              "aria-invalid": !!errors.preferredTiming,
              className: "mt-2 min-h-12"
            }
          ),
          errors.preferredTiming && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              "data-ocid": "request.timing_error",
              className: "mt-1.5 text-xs text-destructive",
              children: errors.preferredTiming
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "description", children: "What needs doing?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              id: "description",
              "data-ocid": "request.description_input",
              value: form.description,
              onChange: (event) => update("description", event.target.value),
              placeholder: "The kitchen faucet drips constantly and the cabinet door below it is loose.",
              "aria-invalid": !!errors.description,
              className: "mt-2 min-h-32"
            }
          ),
          errors.description && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              "data-ocid": "request.description_error",
              className: "mt-1.5 text-xs text-destructive",
              children: errors.description
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sm:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "label",
          {
            htmlFor: "packageInterest",
            className: "flex cursor-pointer items-start gap-3 rounded-2xl border border-primary/40 bg-muted/40 p-4 transition-smooth hover:border-primary/70 hover:bg-muted/60",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: "packageInterest",
                  type: "checkbox",
                  "data-ocid": "request.package_interest_checkbox",
                  checked: form.packageInterest,
                  onChange: (event) => update("packageInterest", event.target.checked),
                  className: "mt-0.5 size-5 shrink-0 accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 font-display text-base font-semibold text-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Package,
                    {
                      className: "size-4 text-primary",
                      "aria-hidden": "true"
                    }
                  ),
                  "Ask about the monthly package"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-1 block text-sm text-muted-foreground", children: "A flat monthly rate for regular help around the home — no auto-billing, just a simple deal we set up together." })
              ] })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sm:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "label",
          {
            htmlFor: "ownParts",
            className: "flex cursor-pointer items-start gap-3 rounded-2xl border border-primary/40 bg-muted/40 p-4 transition-smooth hover:border-primary/70 hover:bg-muted/60",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: "ownParts",
                  type: "checkbox",
                  "data-ocid": "request.own_parts_checkbox",
                  checked: form.ownParts,
                  onChange: (event) => update("ownParts", event.target.checked),
                  className: "mt-0.5 size-5 shrink-0 accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 font-display text-base font-semibold text-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Wrench,
                    {
                      className: "size-4 text-primary",
                      "aria-hidden": "true"
                    }
                  ),
                  "I have my own parts/supplies (mower, weed eater, etc.)"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "mt-1 block text-sm text-muted-foreground", children: [
                  "Check this box and we'll take",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-primary", children: "10% off your quote" }),
                  " ",
                  "— you'll see the discount applied when your quote arrives."
                ] })
              ] })
            ]
          }
        ) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(HoneyCard, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg font-semibold leading-tight text-foreground", children: "Photos of the job" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-sm text-muted-foreground", children: [
              "Snap what needs doing so we can quote accurately. Up to",
              " ",
              MAX_PHOTOS,
              " photos."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              "aria-hidden": "true",
              className: "hex-clip mt-1 size-3 shrink-0 bg-primary/70"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            ref: fileInputRef,
            id: "photos",
            type: "file",
            accept: "image/*",
            multiple: true,
            capture: "environment",
            className: "sr-only",
            "data-ocid": "request.photo_input",
            onChange: (event) => {
              handleFiles(event.target.files);
              event.target.value = "";
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            "data-ocid": "request.upload_button",
            onClick: () => {
              var _a;
              return (_a = fileInputRef.current) == null ? void 0 : _a.click();
            },
            disabled: photos.length >= MAX_PHOTOS,
            className: "group flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary/45 bg-muted/30 px-4 py-8 text-center transition-smooth hover:border-primary/75 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-55",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hex-clip flex size-12 items-center justify-center bg-gradient-to-b from-accent to-primary shadow-honey", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ImagePlus, { className: "size-6 text-primary-foreground" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: photos.length >= MAX_PHOTOS ? "Photo limit reached" : "Add photos" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Tap to choose from your camera or gallery" })
            ]
          }
        ),
        photos.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ul",
          {
            "data-ocid": "request.photo_list",
            className: "mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3",
            children: photos.map((photo, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "li",
              {
                "data-ocid": `request.photo_item.${index + 1}`,
                className: "relative overflow-hidden rounded-xl border border-border/80 bg-card",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: photo.previewUrl,
                      alt: `Selected job attachment ${index + 1}`,
                      className: "aspect-square w-full object-cover"
                    }
                  ),
                  photo.status === "uploading" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-x-0 bottom-0 bg-background/85 px-2 py-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-full overflow-hidden rounded-full bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "h-full rounded-full bg-gradient-to-r from-accent to-primary transition-smooth",
                        style: { width: `${photo.progress}%` }
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "mt-1 block text-[0.65rem] font-medium text-muted-foreground", children: [
                      "Uploading ",
                      photo.progress,
                      "%"
                    ] })
                  ] }),
                  photo.status === "error" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-0 bottom-0 bg-destructive/85 px-2 py-1.5 text-[0.65rem] font-semibold text-destructive-foreground", children: "Upload failed — remove and try again" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      "data-ocid": `request.remove_photo_button.${index + 1}`,
                      onClick: () => removePhoto(photo.id),
                      "aria-label": `Remove photo ${index + 1}`,
                      className: "absolute right-1.5 top-1.5 flex size-8 items-center justify-center rounded-full border border-border/70 bg-background/85 text-foreground transition-smooth hover:bg-destructive hover:text-destructive-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" })
                    }
                  )
                ]
              },
              photo.id
            ))
          }
        )
      ] }),
      submitRequest.isError && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          "data-ocid": "request.submit_error",
          className: "rounded-xl border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive",
          children: "We couldn't send your request. Please try again."
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky bottom-4 z-20 flex flex-col gap-3 sm:static sm:flex-row sm:justify-end", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          HoneyButton,
          {
            type: "submit",
            size: "lg",
            "data-ocid": "request.submit_button",
            disabled: submitRequest.isPending || uploading,
            className: "w-full shadow-honey-lg sm:w-auto",
            children: submitRequest.isPending ? "Sending…" : uploading ? "Uploading photos…" : "Send my request"
          }
        ),
        failedUploads && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-xs text-destructive sm:self-center", children: "Some photos didn't upload. Remove them or try again." })
      ] })
    ] })
  ] }) });
}
export {
  RequestPage
};
