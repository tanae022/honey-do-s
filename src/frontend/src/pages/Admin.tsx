import type { BeeView, JobRequestView } from "@/backend";
import { BeeAccent } from "@/components/honey/BeeAccent";
import { HexStatus } from "@/components/honey/HexStatus";
import { HoneyButton } from "@/components/honey/HoneyButton";
import { HoneyCard, HoneyCardHeader } from "@/components/honey/HoneyCard";
import { HoneyLoader } from "@/components/honey/HoneyLoader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useAdvanceStatus,
  useAssignBeeToJob,
  useBees,
  useCancelPackage,
  useCreateBee,
  useCustomerVisitHistory,
  useDashboardStats,
  useEnrollInPackage,
  useIsAdmin,
  useIsStripeConfigured,
  useJobRequests,
  useScheduleAppointment,
  useSetQuote,
  useSetStripeConfiguration,
  useUpdateBee,
} from "@/hooks/useJobs";
import {
  PACKAGE_BILLING_NOTE,
  formatDateTime,
  formatMoney,
  formatReference,
  formatVisitDate,
  getStatusMeta,
  isPackageActive,
  nextStatus,
  packageStartedLabel,
  packageVisitsLabel,
  sortVisitsNewestFirst,
  visitBeeName,
  visitServiceLabel,
} from "@/lib/jobs";
import { resolvePhotoUrl } from "@/lib/photoUrl";
import { getService } from "@/lib/services";
import { cn } from "@/lib/utils";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Link } from "@tanstack/react-router";
import {
  CalendarPlus,
  ChevronRight,
  CreditCard,
  ImageOff,
  LogIn,
  Pencil,
  ShieldAlert,
  UserPlus,
  X,
} from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";

export function AdminPage() {
  const { data: isAdmin, isLoading: roleLoading } = useIsAdmin();
  const { login, loginStatus } = useInternetIdentity();

  if (roleLoading) {
    return (
      <div className="px-5 py-16 sm:px-8">
        <HoneyCard className="mx-auto max-w-md">
          <HoneyLoader
            data-ocid="admin.loading_state"
            label="Checking access"
          />
        </HoneyCard>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="animate-page-enter px-5 py-16 sm:px-8">
        <HoneyCard className="mx-auto max-w-md text-center">
          <span className="relative mx-auto flex size-14 items-center justify-center">
            <span
              aria-hidden="true"
              className="hex-clip absolute inset-0 bg-gradient-to-b from-primary/50 to-primary/10"
            />
            <ShieldAlert className="relative z-10 size-6 text-primary" />
          </span>
          <h1 className="mt-5 font-display text-2xl font-bold text-foreground">
            Admin access required
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Sign in with an administrator identity to manage incoming Honey
            Do&apos;s.
          </p>
          {loginStatus !== "success" && (
            <HoneyButton
              data-ocid="admin.login_button"
              onClick={() => login()}
              className="mt-6 w-full sm:w-auto"
            >
              <LogIn className="size-4" />
              Sign in
            </HoneyButton>
          )}
        </HoneyCard>
      </div>
    );
  }

  return <AdminDashboard />;
}

function AdminDashboard() {
  const statsQuery = useDashboardStats();
  const requestsQuery = useJobRequests();
  const beesQuery = useBees();

  const stats = statsQuery.data;
  const requests = requestsQuery.data ?? [];
  const bees = beesQuery.data ?? [];

  return (
    <div className="animate-page-enter px-5 py-10 sm:px-8 md:py-14">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
              Hive control
            </span>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Dashboard
            </h1>
          </div>
          <BeeAccent motion="drift" className="h-8 w-11" />
        </header>

        <section
          data-ocid="admin.stats_section"
          className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-5"
        >
          <StatCard
            ocid="admin.stat.new_requests"
            icon="🍯"
            label="New requests"
            value={stats ? stats.newRequests.toString() : "—"}
          />
          <StatCard
            ocid="admin.stat.upcoming"
            icon={<BeeAccent className="h-5 w-7" />}
            label="Upcoming"
            value={stats ? stats.upcomingAppointments.toString() : "—"}
          />
          <StatCard
            ocid="admin.stat.deposits"
            icon="💰"
            label="Deposits"
            value={stats ? formatMoney(stats.depositsCollected) : "—"}
          />
          <StatCard
            ocid="admin.stat.active_jobs"
            icon="🏠"
            label="Active jobs"
            value={stats ? stats.activeJobs.toString() : "—"}
          />
          <StatCard
            ocid="admin.stat.reviews"
            icon="⭐"
            label="Reviews"
            value={stats ? stats.reviewsCount.toString() : "—"}
          />
        </section>

        <section className="mt-8">
          <BeeCrewPanel bees={bees} isLoading={beesQuery.isLoading} />
        </section>

        <section className="mt-8">
          <StripeSettingsPanel />
        </section>

        <section className="mt-8">
          <h2 className="mb-4 font-display text-xl font-semibold text-foreground">
            Job requests
          </h2>

          {requestsQuery.isLoading && (
            <HoneyCard>
              <HoneyLoader
                data-ocid="admin.requests_loading_state"
                label="Loading requests"
              />
            </HoneyCard>
          )}

          {requestsQuery.isError && (
            <HoneyCard>
              <p
                data-ocid="admin.requests_error_state"
                className="text-center text-sm text-destructive"
              >
                We couldn&apos;t load the request list. Please refresh.
              </p>
            </HoneyCard>
          )}

          {!requestsQuery.isLoading &&
            !requestsQuery.isError &&
            requests.length === 0 && (
              <HoneyCard className="text-center">
                <p
                  data-ocid="admin.requests_empty_state"
                  className="text-sm text-muted-foreground"
                >
                  No requests yet. New Honey Do&apos;s will appear here as they
                  arrive.
                </p>
              </HoneyCard>
            )}

          <div className="space-y-4">
            {requests.map((job, index) => (
              <AdminJobCard
                key={job.id.toString()}
                job={job}
                index={index + 1}
                bees={bees}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Bee crew                                                            */
/* ------------------------------------------------------------------ */

function BeeCrewPanel({
  bees,
  isLoading,
}: {
  bees: BeeView[];
  isLoading: boolean;
}) {
  const createBee = useCreateBee();
  const updateBee = useUpdateBee();

  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [editingId, setEditingId] = useState<bigint | null>(null);
  const [editName, setEditName] = useState("");
  const [editSpecialty, setEditSpecialty] = useState("");

  const canAdd = name.trim().length > 0 && specialty.trim().length > 0;

  const startEdit = (bee: BeeView) => {
    setEditingId(bee.id);
    setEditName(bee.name);
    setEditSpecialty(bee.specialty);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditSpecialty("");
  };

  return (
    <HoneyCard data-ocid="admin.bees_panel">
      <HoneyCardHeader
        title="Bee crew"
        description="Your bees are the employees who do the Honey Do's. Add each bee with a name and specialty."
        action={
          <HexStatus
            data-ocid="admin.bees_count"
            label={`${bees.length} ${bees.length === 1 ? "bee" : "bees"}`}
          />
        }
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <div className="rounded-xl border border-border/70 bg-muted/25 p-4">
          <h3 className="font-display text-sm font-semibold text-foreground">
            Add a bee
          </h3>
          <div className="mt-3 grid gap-3">
            <div>
              <Label htmlFor="bee-name">Bee name</Label>
              <Input
                id="bee-name"
                data-ocid="admin.bee_name_input"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Beatrice"
                className="mt-2 min-h-12"
              />
            </div>
            <div>
              <Label htmlFor="bee-specialty">Specialty</Label>
              <Input
                id="bee-specialty"
                data-ocid="admin.bee_specialty_input"
                value={specialty}
                onChange={(event) => setSpecialty(event.target.value)}
                placeholder="Deep cleaning & organizing"
                className="mt-2 min-h-12"
              />
            </div>
            <HoneyButton
              data-ocid="admin.add_bee_button"
              disabled={createBee.isPending || !canAdd}
              onClick={() => {
                const nextName = name.trim();
                const nextSpecialty = specialty.trim();
                setName("");
                setSpecialty("");
                createBee.mutate(
                  { name: nextName, specialty: nextSpecialty },
                  {
                    onError: () => {
                      setName((current) =>
                        current === "" ? nextName : current,
                      );
                      setSpecialty((current) =>
                        current === "" ? nextSpecialty : current,
                      );
                    },
                  },
                );
              }}
              className="w-full"
            >
              <UserPlus className="size-4" />
              {createBee.isPending ? "Adding…" : "Add bee"}
            </HoneyButton>
            {createBee.isError && (
              <p
                data-ocid="admin.add_bee_error_state"
                className="text-sm text-destructive"
              >
                We couldn&apos;t add that bee. Please try again.
              </p>
            )}
          </div>
        </div>

        <div>
          {isLoading ? (
            <HoneyLoader
              data-ocid="admin.bees_loading_state"
              label="Loading the crew"
            />
          ) : bees.length === 0 ? (
            <div
              data-ocid="admin.bees_empty_state"
              className="flex h-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border/80 bg-muted/20 p-6 text-center"
            >
              <BeeAccent motion="hover" className="h-10 w-14" />
              <p className="text-sm text-muted-foreground">
                No bees in the hive yet. Add your first bee to start assigning
                jobs.
              </p>
            </div>
          ) : (
            <ul
              data-ocid="admin.bees_list"
              className="grid gap-3 sm:grid-cols-2"
            >
              {bees.map((bee, index) => (
                <li key={bee.id.toString()}>
                  <BeeCrewItem
                    bee={bee}
                    index={index + 1}
                    editing={editingId === bee.id}
                    editName={editName}
                    editSpecialty={editSpecialty}
                    onEditName={setEditName}
                    onEditSpecialty={setEditSpecialty}
                    onStartEdit={() => startEdit(bee)}
                    onCancelEdit={cancelEdit}
                    isSaving={updateBee.isPending}
                    onSave={() => {
                      const nextName = editName.trim();
                      const nextSpecialty = editSpecialty.trim();
                      if (nextName.length === 0 || nextSpecialty.length === 0) {
                        return;
                      }
                      updateBee.mutate(
                        {
                          id: bee.id,
                          input: { name: nextName, specialty: nextSpecialty },
                        },
                        { onSuccess: cancelEdit },
                      );
                    }}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </HoneyCard>
  );
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
  isSaving,
}: {
  bee: BeeView;
  index: number;
  editing: boolean;
  editName: string;
  editSpecialty: string;
  onEditName: (value: string) => void;
  onEditSpecialty: (value: string) => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSave: () => void;
  isSaving: boolean;
}) {
  return (
    <div
      data-ocid={`admin.bee_item.${index}`}
      className="flex h-full flex-col gap-3 rounded-xl border border-border/70 bg-card/60 p-4"
    >
      <div className="flex items-start gap-3">
        <span className="relative flex size-12 shrink-0 items-center justify-center">
          <span
            aria-hidden="true"
            className="hex-clip absolute inset-0 bg-gradient-to-b from-primary/40 to-primary/5"
          />
          <BeeAccent motion="hover" className="relative z-10 h-7 w-10" />
        </span>
        <div className="min-w-0 flex-1">
          {editing ? (
            <div className="grid gap-2">
              <Input
                aria-label="Bee name"
                data-ocid={`admin.bee_edit_name_input.${index}`}
                value={editName}
                onChange={(event) => onEditName(event.target.value)}
                className="min-h-10"
              />
              <Input
                aria-label="Bee specialty"
                data-ocid={`admin.bee_edit_specialty_input.${index}`}
                value={editSpecialty}
                onChange={(event) => onEditSpecialty(event.target.value)}
                className="min-h-10"
              />
            </div>
          ) : (
            <>
              <p className="truncate font-display text-base font-semibold text-foreground">
                {bee.name}
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {bee.specialty}
              </p>
            </>
          )}
        </div>
      </div>

      <div className="mt-auto flex items-center gap-2">
        {editing ? (
          <>
            <HoneyButton
              size="sm"
              data-ocid={`admin.bee_save_button.${index}`}
              disabled={
                isSaving ||
                editName.trim().length === 0 ||
                editSpecialty.trim().length === 0
              }
              onClick={onSave}
            >
              {isSaving ? "Saving…" : "Save"}
            </HoneyButton>
            <HoneyButton
              size="sm"
              variant="ghost"
              data-ocid={`admin.bee_cancel_button.${index}`}
              onClick={onCancelEdit}
            >
              <X className="size-4" />
              Cancel
            </HoneyButton>
          </>
        ) : (
          <HoneyButton
            size="sm"
            variant="secondary"
            data-ocid={`admin.bee_edit_button.${index}`}
            onClick={onStartEdit}
          >
            <Pencil className="size-4" />
            Edit
          </HoneyButton>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stripe settings                                                     */
/* ------------------------------------------------------------------ */

function StripeSettingsPanel() {
  const configuredQuery = useIsStripeConfigured();
  const setConfiguration = useSetStripeConfiguration();

  const [secretKey, setSecretKey] = useState("");
  const [countries, setCountries] = useState("US");
  const [saved, setSaved] = useState(false);

  const configured = configuredQuery.data === true;

  return (
    <HoneyCard data-ocid="admin.stripe_panel">
      <HoneyCardHeader
        title="Card payments"
        description="Connect Stripe so customers can pay their deposit by card."
        action={
          <HexStatus
            data-ocid="admin.stripe_status"
            label={configured ? "Configured" : "Not configured"}
            toneClass={
              configured
                ? "border-success/40 bg-success/15 text-success"
                : "border-destructive/40 bg-destructive/15 text-destructive"
            }
          />
        }
      />

      {configuredQuery.isLoading ? (
        <HoneyLoader
          data-ocid="admin.stripe_loading_state"
          label="Checking Stripe status"
        />
      ) : configured ? (
        <p className="text-sm text-muted-foreground">
          Stripe is connected. Deposit checkout is live for accepted quotes.
        </p>
      ) : (
        <div className="grid gap-4">
          <div>
            <Label htmlFor="stripe-secret-key">Stripe secret key</Label>
            <Input
              id="stripe-secret-key"
              type="password"
              autoComplete="off"
              data-ocid="admin.stripe_secret_key_input"
              value={secretKey}
              onChange={(event) => {
                setSecretKey(event.target.value);
                setSaved(false);
              }}
              placeholder="sk_live_…"
              className="mt-2 min-h-12"
            />
          </div>

          <div>
            <Label htmlFor="stripe-countries">Allowed countries</Label>
            <Input
              id="stripe-countries"
              data-ocid="admin.stripe_countries_input"
              value={countries}
              onChange={(event) => {
                setCountries(event.target.value);
                setSaved(false);
              }}
              placeholder="US, CA, GB"
              className="mt-2 min-h-12"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Comma-separated two-letter country codes.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <HoneyButton
              data-ocid="admin.stripe_save_button"
              disabled={
                setConfiguration.isPending || secretKey.trim().length === 0
              }
              onClick={() => {
                const allowedCountries = countries
                  .split(",")
                  .map((code) => code.trim().toUpperCase())
                  .filter((code) => code.length > 0);
                setConfiguration.mutate(
                  {
                    secretKey: secretKey.trim(),
                    allowedCountries:
                      allowedCountries.length > 0 ? allowedCountries : ["US"],
                  },
                  {
                    onSuccess: () => {
                      setSecretKey("");
                      setSaved(true);
                    },
                  },
                );
              }}
              className="sm:w-auto"
            >
              <CreditCard className="size-4" />
              {setConfiguration.isPending ? "Saving…" : "Save Stripe key"}
            </HoneyButton>

            {saved && (
              <p
                data-ocid="admin.stripe_saved_state"
                className="text-sm text-success"
              >
                Stripe key saved.
              </p>
            )}
          </div>

          {setConfiguration.isError && (
            <p
              data-ocid="admin.stripe_error_state"
              className="text-sm text-destructive"
            >
              We couldn&apos;t save the Stripe key. Check the key and try again.
            </p>
          )}
        </div>
      )}
    </HoneyCard>
  );
}

function StatCard({
  label,
  value,
  ocid,
  icon,
}: {
  label: string;
  value: string;
  ocid: string;
  icon: ReactNode;
}) {
  return (
    <HoneyCard data-ocid={ocid} className="p-4 text-center md:p-5">
      <span
        aria-hidden="true"
        className="inline-flex items-center justify-center text-lg md:text-xl"
      >
        {icon}
      </span>
      <p className="mt-1 font-mono text-2xl font-bold text-gold-gradient md:text-3xl">
        {value}
      </p>
      <p className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground md:text-xs">
        {label}
      </p>
    </HoneyCard>
  );
}

/* ------------------------------------------------------------------ */
/* Job request card                                                    */
/* ------------------------------------------------------------------ */

function AdminJobCard({
  job,
  index,
  bees,
}: {
  job: JobRequestView;
  index: number;
  bees: BeeView[];
}) {
  const service = getService(job.category);
  const status = getStatusMeta(job.status);
  const advance = useAdvanceStatus();
  const setQuote = useSetQuote();
  const schedule = useScheduleAppointment();
  const assignBee = useAssignBeeToJob();
  const enroll = useEnrollInPackage();
  const cancelPackage = useCancelPackage();

  const [quoteAmount, setQuoteAmount] = useState("");
  const [quoteNote, setQuoteNote] = useState("");
  const [appointmentAt, setAppointmentAt] = useState("");
  const [selectedBeeId, setSelectedBeeId] = useState("");

  const upcoming = nextStatus(job.status);
  const onPackage = isPackageActive(job.packageEnrollment);

  return (
    <HoneyCard data-ocid={`admin.request_card.${index}`}>
      <HoneyCardHeader
        title={service.label}
        description={`${job.customerName} · ${formatReference(job.referenceCode)}`}
        action={
          <div className="flex flex-col items-end gap-2">
            <HexStatus
              data-ocid={`admin.request_status.${index}`}
              label={status.label}
              toneClass={status.chipClass}
            />
            {onPackage && (
              <HexStatus
                data-ocid={`admin.request_package_badge.${index}`}
                label="Monthly package"
                toneClass="border-accent/60 bg-accent/15 text-accent"
              />
            )}
          </div>
        }
      />

      <dl className="grid gap-3 sm:grid-cols-2">
        <Detail label="Received" value={formatDateTime(job.createdAt)} />
        <Detail label="Preferred timing" value={job.preferredTiming} />
        <ContactDetail
          label="Phone"
          value={job.phone}
          href={`tel:${job.phone.replace(/[^\d+]/g, "")}`}
          ocid={`admin.request_phone_link.${index}`}
        />
        <ContactDetail
          label="Email"
          value={job.email}
          href={`mailto:${job.email}`}
          ocid={`admin.request_email_link.${index}`}
        />
      </dl>

      <div
        data-ocid={`admin.quote_workspace.${index}`}
        className="mt-5 grid gap-5 border-t border-border/70 pt-5 lg:grid-cols-2"
      >
        {/* Left: what the customer told us — description, photos, own-parts */}
        <div className="min-w-0">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            What the customer sent
          </span>

          <div className="mt-3 rounded-xl border border-border/70 bg-muted/30 p-4">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Description
            </span>
            <p
              data-ocid={`admin.request_description.${index}`}
              className="mt-2 text-sm text-foreground"
            >
              {job.description}
            </p>
          </div>

          <div className="mt-3">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Photos
            </span>
            {job.photoIds.length > 0 ? (
              <ul
                data-ocid={`admin.request_photos.${index}`}
                className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3"
              >
                {job.photoIds.map((photoId, photoIndex) => (
                  <RequestPhoto
                    key={photoId}
                    photoId={photoId}
                    index={index}
                    photoIndex={photoIndex + 1}
                  />
                ))}
              </ul>
            ) : (
              <p
                data-ocid={`admin.request_photos_empty.${index}`}
                className="mt-2 rounded-xl border border-dashed border-border/80 bg-muted/20 px-4 py-6 text-center text-sm text-muted-foreground"
              >
                No photos were attached to this request.
              </p>
            )}
          </div>

          <div
            data-ocid={`admin.own_parts_state.${index}`}
            className={cn(
              "mt-3 flex items-start gap-3 rounded-xl border p-4",
              job.ownParts
                ? "border-success/50 bg-success/10"
                : "border-border/70 bg-muted/25",
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "hex-clip mt-0.5 size-3 shrink-0",
                job.ownParts ? "bg-success" : "bg-muted-foreground/60",
              )}
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">
                {job.ownParts
                  ? "Customer supplies their own parts/supplies"
                  : "Customer needs us to supply parts/supplies"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {job.ownParts
                  ? "A 10% discount is applied automatically when you send the quote."
                  : "No own-parts discount applies to this quote."}
              </p>
            </div>
          </div>
        </div>

        {/* Right: the quote box, built from what's on the left */}
        <div className="min-w-0">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Send the quote
          </span>

          <div className="mt-3">
            <Label htmlFor={`quote-amount-${index}`}>Quote amount (USD)</Label>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <Input
                id={`quote-amount-${index}`}
                data-ocid={`admin.quote_amount_input.${index}`}
                inputMode="decimal"
                value={quoteAmount}
                onChange={(event) => setQuoteAmount(event.target.value)}
                placeholder="120.00"
                className="min-h-12 sm:flex-1"
              />
              <HoneyButton
                size="sm"
                data-ocid={`admin.set_quote_button.${index}`}
                disabled={setQuote.isPending || quoteAmount.trim().length === 0}
                onClick={() => {
                  const parsed = Number.parseFloat(quoteAmount);
                  if (Number.isNaN(parsed) || parsed <= 0) return;
                  setQuote.mutate(
                    {
                      id: job.id,
                      amount: BigInt(Math.round(parsed * 100)),
                      note: quoteNote.trim(),
                    },
                    {
                      onSuccess: () => {
                        setQuoteAmount("");
                        setQuoteNote("");
                      },
                    },
                  );
                }}
                className="sm:w-auto"
              >
                {setQuote.isPending ? "Saving…" : "Send quote"}
              </HoneyButton>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Enter the full price before any discount.{" "}
              {job.ownParts
                ? "The 10% own-parts discount is applied automatically."
                : "No discount applies to this request."}
            </p>
          </div>

          <div className="mt-3">
            <Label htmlFor={`quote-note-${index}`}>What&apos;s included</Label>
            <Textarea
              id={`quote-note-${index}`}
              data-ocid={`admin.quote_note_input.${index}`}
              value={quoteNote}
              onChange={(event) => setQuoteNote(event.target.value)}
              placeholder="Includes parts and a two-hour visit."
              className="mt-2 min-h-20"
            />
          </div>

          {job.quote && (
            <div
              data-ocid={`admin.quote_summary.${index}`}
              className="mt-3 rounded-xl border border-primary/40 bg-primary/10 p-4"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Quote sent
              </span>
              <p className="mt-2 font-mono text-xl font-bold text-gold-gradient">
                {formatMoney(job.quote.amount)}
              </p>
              {job.quote.discountApplied && (
                <p
                  data-ocid={`admin.quote_discount.${index}`}
                  className="mt-2 inline-flex items-center gap-2 rounded-full border border-success/50 bg-success/15 px-3 py-1 text-xs font-semibold text-success"
                >
                  Own parts/supplies discount applied — 10% off (
                  {formatMoney(job.quote.discountAmount)})
                </p>
              )}
              {job.quote.note && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {job.quote.note}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {job.deposit && (
        <p className="mt-4 text-sm text-muted-foreground">
          Deposit{" "}
          <span className="font-mono font-semibold text-success">
            {formatMoney(job.deposit.amount)}
          </span>{" "}
          {job.deposit.paid ? "received" : "pending"}
        </p>
      )}

      {job.appointment && (
        <p className="mt-2 text-sm text-muted-foreground">
          Visit {formatDateTime(job.appointment.scheduledAt)} ·{" "}
          {job.appointment.confirmed ? "confirmed" : "awaiting confirmation"}
        </p>
      )}

      <div className="mt-5 border-t border-border/70 pt-5">
        <div>
          <Label htmlFor={`appointment-${index}`}>Schedule a visit</Label>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <Input
              id={`appointment-${index}`}
              type="datetime-local"
              data-ocid={`admin.appointment_input.${index}`}
              value={appointmentAt}
              onChange={(event) => setAppointmentAt(event.target.value)}
              className="min-h-12 sm:flex-1"
            />
            <HoneyButton
              size="sm"
              variant="secondary"
              data-ocid={`admin.schedule_button.${index}`}
              disabled={schedule.isPending || appointmentAt.length === 0}
              onClick={() => {
                const date = new Date(appointmentAt);
                if (Number.isNaN(date.getTime())) return;
                schedule.mutate(
                  {
                    id: job.id,
                    scheduledAt: BigInt(date.getTime()) * 1_000_000n,
                  },
                  { onSuccess: () => setAppointmentAt("") },
                );
              }}
              className="sm:w-auto"
            >
              <CalendarPlus className="size-4" />
              {schedule.isPending ? "Saving…" : "Schedule"}
            </HoneyButton>
          </div>

          {upcoming && (
            <HoneyButton
              variant="secondary"
              size="sm"
              data-ocid={`admin.advance_button.${index}`}
              disabled={advance.isPending}
              onClick={() => advance.mutate(job.id)}
              className="mt-3 w-full sm:w-auto"
            >
              <ChevronRight className="size-4" />
              {advance.isPending
                ? "Updating…"
                : `Move to ${getStatusMeta(upcoming).label}`}
            </HoneyButton>
          )}
        </div>
      </div>

      <div className="mt-5 grid gap-4 border-t border-border/70 pt-5 lg:grid-cols-2">
        <AssignBeePanel
          job={job}
          index={index}
          bees={bees}
          selectedBeeId={selectedBeeId}
          onSelectBee={setSelectedBeeId}
          onAssign={() => {
            if (selectedBeeId.length === 0) return;
            assignBee.mutate(
              { id: job.id, beeId: BigInt(selectedBeeId) },
              { onSuccess: () => setSelectedBeeId("") },
            );
          }}
          isPending={assignBee.isPending}
          isError={assignBee.isError}
        />

        <PackagePanel
          job={job}
          index={index}
          onPackage={onPackage}
          onEnroll={() => enroll.mutate(job.id)}
          onCancel={() => cancelPackage.mutate(job.id)}
          isPending={enroll.isPending || cancelPackage.isPending}
          isError={enroll.isError || cancelPackage.isError}
        />
      </div>

      <VisitHistoryPanel job={job} index={index} />
    </HoneyCard>
  );
}

function AssignBeePanel({
  job,
  index,
  bees,
  selectedBeeId,
  onSelectBee,
  onAssign,
  isPending,
  isError,
}: {
  job: JobRequestView;
  index: number;
  bees: BeeView[];
  selectedBeeId: string;
  onSelectBee: (value: string) => void;
  onAssign: () => void;
  isPending: boolean;
  isError: boolean;
}) {
  return (
    <div data-ocid={`admin.assign_bee_panel.${index}`}>
      <Label htmlFor={`assign-bee-${index}`}>Assigned bee</Label>
      <p className="mt-1 text-sm text-muted-foreground">
        {job.assignedBeeName
          ? `Currently ${job.assignedBeeName}`
          : "No bee assigned yet."}
      </p>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <select
          id={`assign-bee-${index}`}
          data-ocid={`admin.assign_bee_select.${index}`}
          value={selectedBeeId}
          onChange={(event) => onSelectBee(event.target.value)}
          disabled={bees.length === 0}
          className="min-h-12 flex-1 rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-55"
        >
          <option value="">
            {bees.length === 0 ? "Add a bee first" : "Choose a bee…"}
          </option>
          {bees.map((bee) => (
            <option key={bee.id.toString()} value={bee.id.toString()}>
              {bee.name} — {bee.specialty}
            </option>
          ))}
        </select>
        <HoneyButton
          size="sm"
          variant="secondary"
          data-ocid={`admin.assign_bee_button.${index}`}
          disabled={isPending || selectedBeeId.length === 0}
          onClick={onAssign}
          className="sm:w-auto"
        >
          {isPending ? "Assigning…" : "Assign bee"}
        </HoneyButton>
      </div>
      {isError && (
        <p
          data-ocid={`admin.assign_bee_error_state.${index}`}
          className="mt-2 text-sm text-destructive"
        >
          We couldn&apos;t assign that bee. Please try again.
        </p>
      )}
    </div>
  );
}

function PackagePanel({
  job,
  index,
  onPackage,
  onEnroll,
  onCancel,
  isPending,
  isError,
}: {
  job: JobRequestView;
  index: number;
  onPackage: boolean;
  onEnroll: () => void;
  onCancel: () => void;
  isPending: boolean;
  isError: boolean;
}) {
  const visitsLabel = packageVisitsLabel(job.packageEnrollment);
  const startedLabel = packageStartedLabel(job.packageEnrollment);

  return (
    <div data-ocid={`admin.package_panel.${index}`}>
      <Label>Monthly package</Label>
      {onPackage ? (
        <>
          <p className="mt-1 text-sm text-muted-foreground">
            {[visitsLabel, startedLabel]
              .filter((part): part is string => Boolean(part))
              .join(" · ")}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Your monthly rate is set with the owner. {PACKAGE_BILLING_NOTE}
          </p>
          <HoneyButton
            size="sm"
            variant="danger"
            data-ocid={`admin.cancel_package_button.${index}`}
            disabled={isPending}
            onClick={onCancel}
            className="mt-3 w-full sm:w-auto"
          >
            {isPending ? "Updating…" : "Cancel package"}
          </HoneyButton>
        </>
      ) : (
        <>
          <p className="mt-1 text-sm text-muted-foreground">
            Not on the monthly package. Enroll this customer to bill the package
            manually each month.
          </p>
          <HoneyButton
            size="sm"
            variant="secondary"
            data-ocid={`admin.enroll_package_button.${index}`}
            disabled={isPending}
            onClick={onEnroll}
            className="mt-3 w-full sm:w-auto"
          >
            {isPending ? "Updating…" : "Mark on monthly package"}
          </HoneyButton>
        </>
      )}
      {isError && (
        <p
          data-ocid={`admin.package_error_state.${index}`}
          className="mt-2 text-sm text-destructive"
        >
          We couldn&apos;t update the package. Please try again.
        </p>
      )}
    </div>
  );
}

function VisitHistoryPanel({
  job,
  index,
}: {
  job: JobRequestView;
  index: number;
}) {
  const visitsQuery = useCustomerVisitHistory(job.id);
  const visits = sortVisitsNewestFirst(visitsQuery.data ?? []);

  return (
    <div
      data-ocid={`admin.visit_history_panel.${index}`}
      className="mt-5 border-t border-border/70 pt-5"
    >
      <h4 className="font-display text-sm font-semibold text-foreground">
        Visit history for {job.customerName}
      </h4>

      {visitsQuery.isLoading ? (
        <HoneyLoader
          data-ocid={`admin.visit_history_loading_state.${index}`}
          label="Loading visits"
        />
      ) : visitsQuery.isError ? (
        <p
          data-ocid={`admin.visit_history_error_state.${index}`}
          className="mt-2 text-sm text-destructive"
        >
          We couldn&apos;t load this customer&apos;s visits.
        </p>
      ) : visits.length === 0 ? (
        <p
          data-ocid={`admin.visit_history_empty_state.${index}`}
          className="mt-2 text-sm text-muted-foreground"
        >
          No completed visits yet for this customer.
        </p>
      ) : (
        <ul
          data-ocid={`admin.visit_history_list.${index}`}
          className="mt-3 space-y-2"
        >
          {visits.map((visit, visitIndex) => (
            <li
              key={`${visit.jobId.toString()}-${visit.completedAt.toString()}`}
              data-ocid={`admin.visit_history_item.${index}.${visitIndex + 1}`}
              className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-sm"
            >
              <span className="font-mono text-xs text-muted-foreground">
                {formatVisitDate(visit)}
              </span>
              <span className="font-medium text-foreground">
                {visitServiceLabel(visit)}
              </span>
              <span className="ml-auto inline-flex items-center gap-2 text-muted-foreground">
                <BeeAccent motion="hover" className="h-4 w-6" />
                {visitBeeName(visit)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * Resolves a stored object-storage photo hash into a direct gateway URL and
 * renders it as a tappable thumbnail. Shows a loading placeholder while the
 * runtime config resolves, and a hexagon fallback only when resolution truly
 * fails.
 */
function RequestPhoto({
  photoId,
  index,
  photoIndex,
}: {
  photoId: string;
  index: number;
  photoIndex: number;
}) {
  const [url, setUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    setUrl(null);
    setFailed(false);

    resolvePhotoUrl(photoId)
      .then((resolved) => {
        if (active) setUrl(resolved);
      })
      .catch(() => {
        if (active) setFailed(true);
      });

    return () => {
      active = false;
    };
  }, [photoId]);

  return (
    <li
      data-ocid={`admin.request_photo.${index}.${photoIndex}`}
      className="relative overflow-hidden rounded-xl border border-border/80 bg-card"
    >
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          data-ocid={`admin.request_photo_link.${index}.${photoIndex}`}
          className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <img
            src={url}
            alt={`Job attachment ${photoIndex} for request ${index}`}
            loading="lazy"
            className="aspect-square w-full object-cover transition-smooth hover:scale-105"
          />
        </a>
      ) : (
        <div className="flex aspect-square w-full flex-col items-center justify-center gap-2 bg-muted/40 text-muted-foreground">
          {failed ? (
            <>
              <ImageOff className="size-5" />
              <span className="px-2 text-center text-[0.65rem]">
                Photo unavailable
              </span>
            </>
          ) : (
            <span
              aria-hidden="true"
              className="hex-clip size-6 animate-honey-glow bg-primary/70"
            />
          )}
        </div>
      )}
    </li>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 truncate text-sm text-foreground">{value}</dd>
    </div>
  );
}

/**
 * A customer contact detail the owner can act on directly — tapping the phone
 * opens the dialer and tapping the email opens a new message.
 */
function ContactDetail({
  label,
  value,
  href,
  ocid,
}: {
  label: string;
  value: string;
  href: string;
  ocid: string;
}) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 min-w-0">
        <a
          href={href}
          data-ocid={ocid}
          className="inline-flex max-w-full items-center gap-1.5 truncate text-sm font-semibold text-primary underline-offset-4 transition-smooth hover:text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {value}
        </a>
      </dd>
    </div>
  );
}
