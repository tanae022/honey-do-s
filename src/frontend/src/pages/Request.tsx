import { type JobRequestInput, ServiceCategory } from "@/backend";
import { BeeAccent } from "@/components/honey/BeeAccent";
import { HexTile } from "@/components/honey/HexTile";
import { HoneyButton } from "@/components/honey/HoneyButton";
import { HoneyCard } from "@/components/honey/HoneyCard";
import { HoneyDropSuccess } from "@/components/honey/HoneyDropSuccess";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitRequest } from "@/hooks/useJobs";
import { SERVICES } from "@/lib/services";
import { loadConfig } from "@caffeineai/core-infrastructure";
import { StorageClient } from "@caffeineai/object-storage";
import { HttpAgent } from "@icp-sdk/core/agent";
import { Link, useSearch } from "@tanstack/react-router";
import {
  Flower2,
  ImagePlus,
  Lightbulb,
  Package,
  PaintRoller,
  Phone,
  ShoppingBag,
  Sparkles,
  Sprout,
  Wrench,
  X,
} from "lucide-react";
import type { ComponentType } from "react";
import { useRef, useState } from "react";

const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  Wrench,
  PaintRoller,
  Sprout,
  Flower2,
  Sparkles,
  Package,
  ShoppingBag,
  Lightbulb,
};

const MAX_PHOTOS = 6;

/** Owner's direct line — shown so customers can call instead of waiting. */
const OWNER_PHONE_DISPLAY = "405-312-4987";
const OWNER_PHONE_HREF = "tel:+14053124987";

interface PhotoDraft {
  id: string;
  file: File;
  previewUrl: string;
  progress: number;
  status: "uploading" | "done" | "error";
  photoId: string | null;
}

interface FormState {
  customerName: string;
  email: string;
  phone: string;
  preferredTiming: string;
  description: string;
  packageInterest: boolean;
  ownParts: boolean;
}

const EMPTY_FORM: FormState = {
  customerName: "",
  email: "",
  phone: "",
  preferredTiming: "",
  description: "",
  packageInterest: false,
  ownParts: false,
};

export function RequestPage() {
  const search = useSearch({ from: "/request" });
  const [category, setCategory] = useState<ServiceCategory>(
    search.service ?? ServiceCategory.fixIt,
  );
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [photos, setPhotos] = useState<PhotoDraft[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [referenceCode, setReferenceCode] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const submitRequest = useSubmitRequest();

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function startUpload(draft: PhotoDraft) {
    const bytes = draft.file.arrayBuffer();
    void bytes.then(async (buffer) => {
      try {
        const config = await loadConfig();
        const agent = new HttpAgent({ host: config.backend_host });
        if (config.backend_host?.includes("localhost")) {
          await agent.fetchRootKey().catch(() => undefined);
        }
        const storageClient = new StorageClient(
          config.bucket_name,
          config.storage_gateway_url,
          config.backend_canister_id,
          config.project_id,
          agent,
        );
        const { hash } = await storageClient.putFile(
          new Uint8Array(buffer),
          (percentage) => {
            setPhotos((current) =>
              current.map((photo) =>
                photo.id === draft.id
                  ? { ...photo, progress: Math.round(percentage) }
                  : photo,
              ),
            );
          },
          draft.file.type,
          draft.file.name,
        );
        setPhotos((current) =>
          current.map((photo) =>
            photo.id === draft.id
              ? { ...photo, status: "done", progress: 100, photoId: hash }
              : photo,
          ),
        );
      } catch {
        setPhotos((current) =>
          current.map((photo) =>
            photo.id === draft.id ? { ...photo, status: "error" } : photo,
          ),
        );
      }
    });
  }

  function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const incoming = Array.from(fileList).filter((file) =>
      file.type.startsWith("image/"),
    );
    setPhotos((current) => {
      const room = MAX_PHOTOS - current.length;
      const accepted = incoming.slice(0, Math.max(room, 0));
      const drafts: PhotoDraft[] = accepted.map((file, index) => ({
        id: `${Date.now()}-${index}-${file.name}`,
        file,
        previewUrl: URL.createObjectURL(file),
        progress: 0,
        status: "uploading",
        photoId: null,
      }));
      for (const draft of drafts) startUpload(draft);
      return [...current, ...drafts];
    });
  }

  function removePhoto(id: string) {
    setPhotos((current) => {
      const target = current.find((photo) => photo.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return current.filter((photo) => photo.id !== id);
    });
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
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

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;
    if (uploading) return;

    const input: JobRequestInput = {
      customerName: form.customerName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      preferredTiming: form.preferredTiming.trim(),
      description: form.description.trim(),
      photoIds: photos
        .map((photo) => photo.photoId)
        .filter((id): id is string => id !== null),
      category,
      packageInterest: form.packageInterest,
      ownParts: form.ownParts,
    };

    submitRequest.mutate(input, {
      onSuccess: (code) => {
        setReferenceCode(code);
        setForm(EMPTY_FORM);
        setErrors({});
        for (const photo of photos) URL.revokeObjectURL(photo.previewUrl);
        setPhotos([]);
      },
    });
  }

  if (referenceCode) {
    return (
      <div className="animate-page-enter px-5 py-12 sm:px-8 md:py-16">
        <div className="mx-auto w-full max-w-xl">
          <HoneyCard>
            <HoneyDropSuccess
              data-ocid="request.success_state"
              title="Your request is in!"
              message="Your request was sent straight to the owner — we've emailed it straight to the owner and tucked your Honey Do into the hive. We'll be in touch shortly."
            />
            <div className="mt-2 rounded-2xl border border-primary/40 bg-muted/40 p-5 text-center">
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Your reference code
              </span>
              <p
                data-ocid="request.reference_code"
                className="mt-2 font-mono text-2xl font-bold tracking-[0.18em] text-gold-gradient"
              >
                {referenceCode.toUpperCase()}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Save this code — you&apos;ll use it to track your job.
              </p>
            </div>
            <div className="mt-5 rounded-2xl border border-border/70 bg-card/60 p-4 text-center">
              <p className="text-sm text-muted-foreground">
                Need it handled sooner? Call the owner directly.
              </p>
              <a
                href={OWNER_PHONE_HREF}
                data-ocid="request.success_call_link"
                className="mt-2 inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-primary/50 bg-primary/10 px-5 text-base font-semibold text-foreground transition-smooth hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Phone className="size-4 text-primary" aria-hidden="true" />
                {OWNER_PHONE_DISPLAY}
              </a>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link to="/track" data-ocid="request.track_link">
                <HoneyButton className="w-full sm:w-auto">
                  Track this job
                </HoneyButton>
              </Link>
              <HoneyButton
                variant="secondary"
                data-ocid="request.new_request_button"
                onClick={() => setReferenceCode(null)}
                className="w-full sm:w-auto"
              >
                Submit another
              </HoneyButton>
            </div>
          </HoneyCard>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-page-enter px-5 py-10 sm:px-8 md:py-14">
      <div className="mx-auto w-full max-w-3xl">
        <header className="mb-8 text-center">
          <BeeAccent className="mx-auto h-8 w-11" />
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Request a Honey Do
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground md:text-base">
            Tell us what needs doing — just the details, no sign-in needed to
            request.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Prefer to talk it through?{" "}
            <a
              href={OWNER_PHONE_HREF}
              data-ocid="request.call_link"
              className="inline-flex min-h-6 items-center gap-1.5 font-semibold text-primary underline-offset-4 transition-smooth hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Phone className="size-4" aria-hidden="true" />
              Call {OWNER_PHONE_DISPLAY}
            </a>
          </p>
        </header>

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <HoneyCard>
            <fieldset>
              <legend className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                Choose a service
              </legend>
              <div
                data-ocid="request.service_grid"
                className="grid grid-cols-2 gap-3 sm:grid-cols-3"
              >
                {SERVICES.map((service, index) => {
                  const Icon = ICONS[service.icon] ?? Wrench;
                  return (
                    <HexTile
                      key={service.category}
                      data-ocid={`request.service_tile.${index + 1}`}
                      label={service.label}
                      icon={<Icon className="size-5" />}
                      selected={category === service.category}
                      onClick={() => setCategory(service.category)}
                    />
                  );
                })}
              </div>
            </fieldset>
          </HoneyCard>

          <HoneyCard>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="customerName">Your name</Label>
                <Input
                  id="customerName"
                  data-ocid="request.name_input"
                  value={form.customerName}
                  onChange={(event) =>
                    update("customerName", event.target.value)
                  }
                  placeholder="Jamie Rivera"
                  aria-invalid={!!errors.customerName}
                  className="mt-2 min-h-12"
                />
                {errors.customerName && (
                  <p
                    data-ocid="request.name_error"
                    className="mt-1.5 text-xs text-destructive"
                  >
                    {errors.customerName}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  data-ocid="request.email_input"
                  value={form.email}
                  onChange={(event) => update("email", event.target.value)}
                  placeholder="jamie@example.com"
                  aria-invalid={!!errors.email}
                  className="mt-2 min-h-12"
                />
                {errors.email && (
                  <p
                    data-ocid="request.email_error"
                    className="mt-1.5 text-xs text-destructive"
                  >
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  data-ocid="request.phone_input"
                  value={form.phone}
                  onChange={(event) => update("phone", event.target.value)}
                  placeholder="(555) 123-4567"
                  aria-invalid={!!errors.phone}
                  className="mt-2 min-h-12"
                />
                {errors.phone && (
                  <p
                    data-ocid="request.phone_error"
                    className="mt-1.5 text-xs text-destructive"
                  >
                    {errors.phone}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="preferredTiming">
                  When works best for you?
                </Label>
                <Input
                  id="preferredTiming"
                  data-ocid="request.timing_input"
                  value={form.preferredTiming}
                  onChange={(event) =>
                    update("preferredTiming", event.target.value)
                  }
                  placeholder="Weekday mornings, or Saturday afternoon"
                  aria-invalid={!!errors.preferredTiming}
                  className="mt-2 min-h-12"
                />
                {errors.preferredTiming && (
                  <p
                    data-ocid="request.timing_error"
                    className="mt-1.5 text-xs text-destructive"
                  >
                    {errors.preferredTiming}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="description">What needs doing?</Label>
                <Textarea
                  id="description"
                  data-ocid="request.description_input"
                  value={form.description}
                  onChange={(event) =>
                    update("description", event.target.value)
                  }
                  placeholder="The kitchen faucet drips constantly and the cabinet door below it is loose."
                  aria-invalid={!!errors.description}
                  className="mt-2 min-h-32"
                />
                {errors.description && (
                  <p
                    data-ocid="request.description_error"
                    className="mt-1.5 text-xs text-destructive"
                  >
                    {errors.description}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="packageInterest"
                  className="flex cursor-pointer items-start gap-3 rounded-2xl border border-primary/40 bg-muted/40 p-4 transition-smooth hover:border-primary/70 hover:bg-muted/60"
                >
                  <input
                    id="packageInterest"
                    type="checkbox"
                    data-ocid="request.package_interest_checkbox"
                    checked={form.packageInterest}
                    onChange={(event) =>
                      update("packageInterest", event.target.checked)
                    }
                    className="mt-0.5 size-5 shrink-0 accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  />
                  <span className="min-w-0">
                    <span className="flex items-center gap-2 font-display text-base font-semibold text-foreground">
                      <Package
                        className="size-4 text-primary"
                        aria-hidden="true"
                      />
                      Ask about the monthly package
                    </span>
                    <span className="mt-1 block text-sm text-muted-foreground">
                      A flat monthly rate for regular help around the home — no
                      auto-billing, just a simple deal we set up together.
                    </span>
                  </span>
                </label>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="ownParts"
                  className="flex cursor-pointer items-start gap-3 rounded-2xl border border-primary/40 bg-muted/40 p-4 transition-smooth hover:border-primary/70 hover:bg-muted/60"
                >
                  <input
                    id="ownParts"
                    type="checkbox"
                    data-ocid="request.own_parts_checkbox"
                    checked={form.ownParts}
                    onChange={(event) =>
                      update("ownParts", event.target.checked)
                    }
                    className="mt-0.5 size-5 shrink-0 accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  />
                  <span className="min-w-0">
                    <span className="flex items-center gap-2 font-display text-base font-semibold text-foreground">
                      <Wrench
                        className="size-4 text-primary"
                        aria-hidden="true"
                      />
                      I have my own parts/supplies (mower, weed eater, etc.)
                    </span>
                    <span className="mt-1 block text-sm text-muted-foreground">
                      Check this box and we&apos;ll take{" "}
                      <span className="font-semibold text-primary">
                        10% off your quote
                      </span>{" "}
                      — you&apos;ll see the discount applied when your quote
                      arrives.
                    </span>
                  </span>
                </label>
              </div>
            </div>
          </HoneyCard>

          <HoneyCard>
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-display text-lg font-semibold leading-tight text-foreground">
                  Photos of the job
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Snap what needs doing so we can quote accurately. Up to{" "}
                  {MAX_PHOTOS} photos.
                </p>
              </div>
              <span
                aria-hidden="true"
                className="hex-clip mt-1 size-3 shrink-0 bg-primary/70"
              />
            </div>

            <input
              ref={fileInputRef}
              id="photos"
              type="file"
              accept="image/*"
              multiple
              capture="environment"
              className="sr-only"
              data-ocid="request.photo_input"
              onChange={(event) => {
                handleFiles(event.target.files);
                event.target.value = "";
              }}
            />

            <button
              type="button"
              data-ocid="request.upload_button"
              onClick={() => fileInputRef.current?.click()}
              disabled={photos.length >= MAX_PHOTOS}
              className="group flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary/45 bg-muted/30 px-4 py-8 text-center transition-smooth hover:border-primary/75 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-55"
            >
              <span className="hex-clip flex size-12 items-center justify-center bg-gradient-to-b from-accent to-primary shadow-honey">
                <ImagePlus className="size-6 text-primary-foreground" />
              </span>
              <span className="text-sm font-semibold text-foreground">
                {photos.length >= MAX_PHOTOS
                  ? "Photo limit reached"
                  : "Add photos"}
              </span>
              <span className="text-xs text-muted-foreground">
                Tap to choose from your camera or gallery
              </span>
            </button>

            {photos.length > 0 && (
              <ul
                data-ocid="request.photo_list"
                className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3"
              >
                {photos.map((photo, index) => (
                  <li
                    key={photo.id}
                    data-ocid={`request.photo_item.${index + 1}`}
                    className="relative overflow-hidden rounded-xl border border-border/80 bg-card"
                  >
                    <img
                      src={photo.previewUrl}
                      alt={`Selected job attachment ${index + 1}`}
                      className="aspect-square w-full object-cover"
                    />
                    {photo.status === "uploading" && (
                      <div className="absolute inset-x-0 bottom-0 bg-background/85 px-2 py-1.5">
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-accent to-primary transition-smooth"
                            style={{ width: `${photo.progress}%` }}
                          />
                        </div>
                        <span className="mt-1 block text-[0.65rem] font-medium text-muted-foreground">
                          Uploading {photo.progress}%
                        </span>
                      </div>
                    )}
                    {photo.status === "error" && (
                      <div className="absolute inset-x-0 bottom-0 bg-destructive/85 px-2 py-1.5 text-[0.65rem] font-semibold text-destructive-foreground">
                        Upload failed — remove and try again
                      </div>
                    )}
                    <button
                      type="button"
                      data-ocid={`request.remove_photo_button.${index + 1}`}
                      onClick={() => removePhoto(photo.id)}
                      aria-label={`Remove photo ${index + 1}`}
                      className="absolute right-1.5 top-1.5 flex size-8 items-center justify-center rounded-full border border-border/70 bg-background/85 text-foreground transition-smooth hover:bg-destructive hover:text-destructive-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <X className="size-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </HoneyCard>

          {submitRequest.isError && (
            <p
              data-ocid="request.submit_error"
              className="rounded-xl border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
              We couldn&apos;t send your request. Please try again.
            </p>
          )}

          <div className="sticky bottom-4 z-20 flex flex-col gap-3 sm:static sm:flex-row sm:justify-end">
            <HoneyButton
              type="submit"
              size="lg"
              data-ocid="request.submit_button"
              disabled={submitRequest.isPending || uploading}
              className="w-full shadow-honey-lg sm:w-auto"
            >
              {submitRequest.isPending
                ? "Sending…"
                : uploading
                  ? "Uploading photos…"
                  : "Send my request"}
            </HoneyButton>
            {failedUploads && (
              <p className="text-center text-xs text-destructive sm:self-center">
                Some photos didn&apos;t upload. Remove them or try again.
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
