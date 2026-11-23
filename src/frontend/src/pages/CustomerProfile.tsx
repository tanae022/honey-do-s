import {
  type Appointment,
  type CustomerId,
  type CustomerInput,
  CustomerStatus,
  type Deposit,
  type JobRequestView,
  type MessageView,
  type PhotoId,
  type PreferredContact,
  ServiceCategory,
} from "@/backend";
import {
  AdminButton,
  AdminCard,
  AdminCardHeader,
  AdminChip,
  AdminEmptyState,
  AdminErrorState,
  AdminField,
  AdminInput,
  AdminLoadingState,
  AdminPageHeader,
  AdminSelect,
  AdminShell,
  AdminStatusBadge,
  AdminTextarea,
} from "@/components/admin";
import {
  useAddCustomerNote,
  useArchiveCustomer,
  useCreateJobForCustomer,
  useCustomerMessages,
  useCustomerProfile,
  useRestoreCustomer,
  useSendAdminMessage,
  useSetCustomerStatus,
  useUpdateCustomer,
} from "@/hooks/useCustomers";
import { useIsAdmin } from "@/hooks/useJobs";
import { adminStatusForJob, getDepositStatusMeta } from "@/lib/admin";
import {
  CUSTOMER_STATUSES,
  PREFERRED_CONTACTS,
  customerDisplayName,
  formatCustomerSince,
  getCustomerStatusMeta,
  getPreferredContactMeta,
} from "@/lib/customers";
import { formatDateTime, formatMoney, formatReference } from "@/lib/jobs";
import { getService } from "@/lib/services";
import { cn } from "@/lib/utils";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Check,
  ImageIcon,
  LogIn,
  Mail,
  MessageSquare,
  Phone,
  Plus,
  RotateCcw,
  Send,
  ShieldAlert,
  StickyNote,
  UserRound,
  X,
} from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Admin customer profile.
 *
 * The full record for one customer on the light, high-contrast admin ground:
 * contact details with inline edit, the customer's service history grouped by
 * outcome, payments and appointments, notes and the message thread — plus the
 * lifecycle actions (update status, new service request, archive/restore).
 * Admin-only; the backend enforces the same boundary.
 */
export function CustomerProfilePage() {
  const { data: isAdmin, isLoading: roleLoading } = useIsAdmin();
  const { login, loginStatus } = useInternetIdentity();

  if (roleLoading) {
    return (
      <AdminShell>
        <AdminLoadingState
          data-ocid="customer_profile.loading_state"
          label="Checking access"
        />
      </AdminShell>
    );
  }

  if (!isAdmin) {
    return (
      <AdminShell>
        <AdminEmptyState
          data-ocid="customer_profile.access_denied_state"
          icon={<ShieldAlert className="size-6" />}
          title="Admin access required"
          description="Sign in with an administrator identity to view customer profiles."
          action={
            loginStatus !== "success" ? (
              <AdminButton
                data-ocid="customer_profile.login_button"
                onClick={() => login()}
              >
                <LogIn className="size-4" />
                Sign in
              </AdminButton>
            ) : undefined
          }
        />
      </AdminShell>
    );
  }

  return <CustomerProfileBody />;
}

function CustomerProfileBody() {
  const params = useParams({ from: "/admin/customers/$customerId" });
  const customerId = useMemo<CustomerId | null>(() => {
    const raw = params.customerId;
    if (!/^\d+$/.test(raw)) return null;
    try {
      return BigInt(raw);
    } catch {
      return null;
    }
  }, [params.customerId]);

  const profileQuery = useCustomerProfile(customerId);
  const profile = profileQuery.data ?? null;

  if (customerId === null) {
    return (
      <ProfileShell>
        <AdminErrorState
          data-ocid="customer_profile.invalid_state"
          message="That customer link is not valid. Return to the directory and choose a customer."
        />
      </ProfileShell>
    );
  }

  if (profileQuery.isLoading) {
    return (
      <ProfileShell>
        <AdminLoadingState
          data-ocid="customer_profile.profile_loading_state"
          label="Loading the profile"
        />
      </ProfileShell>
    );
  }

  if (profileQuery.isError) {
    return (
      <ProfileShell>
        <AdminErrorState
          data-ocid="customer_profile.profile_error_state"
          message="We couldn't load this customer. Please try again."
          onRetry={() => void profileQuery.refetch()}
        />
      </ProfileShell>
    );
  }

  if (!profile) {
    return (
      <ProfileShell>
        <AdminEmptyState
          data-ocid="customer_profile.not_found_state"
          icon={<UserRound className="size-6" />}
          title="Customer not found"
          description="No customer matches this link. They may have been removed."
        />
      </ProfileShell>
    );
  }

  const customer = profile.customer;
  const statusMeta = getCustomerStatusMeta(customer.status);

  return (
    <ProfileShell>
      <AdminPageHeader
        eyebrow="Customer profile"
        title={customerDisplayName(customer)}
        description={`Customer since ${formatCustomerSince(customer.createdAt)}`}
        actions={
          <>
            <AdminStatusBadge
              data-ocid="customer_profile.status_chip"
              tone={statusToneForCustomer(customer.status)}
              label={statusMeta.label}
              dot
            />
            <AdminChip data-ocid="customer_profile.preferred_contact_chip">
              {getPreferredContactMeta(customer.preferredContact).label}
            </AdminChip>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="flex min-w-0 flex-col gap-6">
          <ContactCard customerId={customerId} profile={profile} />
          <ServiceHistoryCard profile={profile} />
          <PaymentsAppointmentsCard profile={profile} />
        </div>
        <div className="flex min-w-0 flex-col gap-6">
          <LifecycleCard customerId={customerId} profile={profile} />
          <NewRequestCard customerId={customerId} profile={profile} />
          <NotesCard customerId={customerId} profile={profile} />
          <MessageThread customerId={customerId} />
        </div>
      </div>
    </ProfileShell>
  );
}

function ProfileShell({ children }: { children: ReactNode }) {
  return (
    <AdminShell>
      <div data-ocid="customer_profile.page">
        <Link
          to="/admin/customers"
          data-ocid="customer_profile.back_link"
          className="mb-4 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-[oklch(var(--admin-muted-foreground))] transition-smooth hover:text-[oklch(var(--admin-primary))]"
        >
          <ArrowLeft className="size-4" />
          Back to customers
        </Link>
        {children}
      </div>
    </AdminShell>
  );
}

/** Map a customer lifecycle status onto the shared admin badge tone. */
function statusToneForCustomer(
  status: CustomerStatus,
): "approved" | "waiting" | "cancelled" {
  switch (status) {
    case CustomerStatus.active:
      return "approved";
    case CustomerStatus.inactive:
      return "waiting";
    default:
      return "cancelled";
  }
}

/* ------------------------------------------------------------------ */
/* Contact information                                                 */
/* ------------------------------------------------------------------ */

function ContactCard({
  customerId,
  profile,
}: {
  customerId: CustomerId;
  profile: import("@/lib/customers").CustomerProfileView;
}) {
  const customer = profile.customer;
  const update = useUpdateCustomer();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<CustomerInput>({
    fullName: customer.fullName,
    phone: customer.phone,
    email: customer.email,
    serviceAddress: customer.serviceAddress,
    preferredContact: customer.preferredContact,
  });
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const set = <K extends keyof CustomerInput>(
    key: K,
    value: CustomerInput[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
    setSaved(false);
    setError(null);
  };

  const startEdit = () => {
    setForm({
      fullName: customer.fullName,
      phone: customer.phone,
      email: customer.email,
      serviceAddress: customer.serviceAddress,
      preferredContact: customer.preferredContact,
    });
    setError(null);
    setSaved(false);
    setEditing(true);
  };

  const handleSave = () => {
    if (form.fullName.trim().length < 2) {
      setError("Enter the customer's full name.");
      return;
    }
    if (!EMAIL_PATTERN.test(form.email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    if (form.phone.trim().length < 7) {
      setError("Enter a phone number we can reach them on.");
      return;
    }
    if (form.serviceAddress.trim().length < 3) {
      setError("Enter the service address.");
      return;
    }
    setError(null);
    update.mutate(
      {
        id: customerId,
        input: {
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          serviceAddress: form.serviceAddress.trim(),
          preferredContact: form.preferredContact,
        },
      },
      {
        onSuccess: (result) => {
          if (result.__kind__ === "ok") {
            setSaved(true);
            setEditing(false);
          } else {
            setError(
              result.err.__kind__ === "invalidInput"
                ? result.err.invalidInput
                : "We couldn't save those details. Please try again.",
            );
          }
        },
        onError: () => {
          setError("We couldn't save those details. Please try again.");
        },
      },
    );
  };

  return (
    <AdminCard data-ocid="customer_profile.contact_card">
      <AdminCardHeader
        title="Contact information"
        description="Saved once and reused for every request, quote and job."
        action={
          editing ? (
            <AdminButton
              variant="secondary"
              size="sm"
              data-ocid="customer_profile.edit_cancel_button"
              onClick={() => setEditing(false)}
            >
              <X className="size-4" />
              Cancel
            </AdminButton>
          ) : (
            <AdminButton
              size="sm"
              data-ocid="customer_profile.edit_button"
              onClick={startEdit}
            >
              Edit contact
            </AdminButton>
          )
        }
      />

      {editing ? (
        <div data-ocid="customer_profile.edit_panel" className="grid gap-4">
          <AdminField label="Full name" htmlFor="cp-full-name">
            <AdminInput
              id="cp-full-name"
              className="form-field"
              data-ocid="customer_profile.edit_name_input"
              value={form.fullName}
              onChange={(event) => set("fullName", event.target.value)}
            />
          </AdminField>
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="Phone" htmlFor="cp-phone">
              <AdminInput
                id="cp-phone"
                type="tel"
                className="form-field"
                data-ocid="customer_profile.edit_phone_input"
                value={form.phone}
                onChange={(event) => set("phone", event.target.value)}
              />
            </AdminField>
            <AdminField label="Email" htmlFor="cp-email">
              <AdminInput
                id="cp-email"
                type="email"
                className="form-field"
                data-ocid="customer_profile.edit_email_input"
                value={form.email}
                onChange={(event) => set("email", event.target.value)}
              />
            </AdminField>
          </div>
          <AdminField label="Service address" htmlFor="cp-address">
            <AdminInput
              id="cp-address"
              className="form-field"
              data-ocid="customer_profile.edit_address_input"
              value={form.serviceAddress}
              onChange={(event) => set("serviceAddress", event.target.value)}
            />
          </AdminField>
          <AdminField label="Preferred contact method" htmlFor="cp-preferred">
            <AdminSelect
              id="cp-preferred"
              className="form-field"
              data-ocid="customer_profile.edit_preferred_select"
              value={form.preferredContact}
              onChange={(event) =>
                set("preferredContact", event.target.value as PreferredContact)
              }
            >
              {PREFERRED_CONTACTS.map((method) => (
                <option key={method} value={method}>
                  {getPreferredContactMeta(method).label}
                </option>
              ))}
            </AdminSelect>
          </AdminField>

          {error && (
            <p
              data-ocid="customer_profile.edit_error_state"
              role="alert"
              className="text-sm font-medium text-[oklch(var(--admin-status-action))]"
            >
              {error}
            </p>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <AdminButton
              data-ocid="customer_profile.edit_save_button"
              disabled={update.isPending}
              onClick={handleSave}
            >
              <Check className="size-4" />
              {update.isPending ? "Saving…" : "Save changes"}
            </AdminButton>
          </div>
        </div>
      ) : (
        <dl className="grid gap-4 sm:grid-cols-2">
          <ContactRow
            icon={<Phone className="size-4" />}
            label="Phone"
            value={customer.phone}
            href={`tel:${customer.phone.replace(/[^\d+]/g, "")}`}
            ocid="customer_profile.phone_link"
          />
          <ContactRow
            icon={<Mail className="size-4" />}
            label="Email"
            value={customer.email}
            href={`mailto:${customer.email}`}
            ocid="customer_profile.email_link"
          />
          <ContactRow
            icon={<UserRound className="size-4" />}
            label="Service address"
            value={customer.serviceAddress}
            ocid="customer_profile.address"
          />
          <ContactRow
            icon={<MessageSquare className="size-4" />}
            label="Preferred contact"
            value={getPreferredContactMeta(customer.preferredContact).label}
            ocid="customer_profile.preferred_contact"
          />
        </dl>
      )}

      {saved && !editing && (
        <p
          data-ocid="customer_profile.edit_saved_state"
          className="mt-4 text-sm font-medium text-[oklch(var(--admin-status-paid))]"
        >
          Contact information saved.
        </p>
      )}
    </AdminCard>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
  ocid,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  href?: string;
  ocid: string;
}) {
  return (
    <div className="min-w-0">
      <dt className="flex items-center gap-1.5 text-sm font-semibold text-[oklch(var(--admin-muted-foreground))]">
        <span aria-hidden="true" className="text-[oklch(var(--admin-primary))]">
          {icon}
        </span>
        {label}
      </dt>
      <dd className="mt-1 min-w-0">
        {href ? (
          <a
            href={href}
            data-ocid={ocid}
            className="inline-flex max-w-full items-center gap-1.5 truncate text-base font-semibold text-[oklch(var(--admin-primary))] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(var(--admin-ring))]"
          >
            {value}
          </a>
        ) : (
          <span
            data-ocid={ocid}
            className="block break-words text-base font-semibold text-[oklch(var(--admin-foreground))]"
          >
            {value}
          </span>
        )}
      </dd>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Lifecycle actions                                                   */
/* ------------------------------------------------------------------ */

function LifecycleCard({
  customerId,
  profile,
}: {
  customerId: CustomerId;
  profile: import("@/lib/customers").CustomerProfileView;
}) {
  const customer = profile.customer;
  const setStatus = useSetCustomerStatus();
  const archive = useArchiveCustomer();
  const restore = useRestoreCustomer();
  const [statusOpen, setStatusOpen] = useState(false);

  const archived = customer.status === CustomerStatus.archived;

  return (
    <AdminCard data-ocid="customer_profile.lifecycle_card">
      <AdminCardHeader
        title="Status & actions"
        description="Change where this customer stands or archive the record."
      />

      <div className="flex flex-wrap items-center gap-3">
        <AdminStatusBadge
          data-ocid="customer_profile.lifecycle_status"
          tone={statusToneForCustomer(customer.status)}
          label={getCustomerStatusMeta(customer.status).label}
          dot
        />
        <AdminButton
          variant="secondary"
          size="sm"
          data-ocid="customer_profile.update_status_button"
          aria-expanded={statusOpen}
          disabled={setStatus.isPending}
          onClick={() => setStatusOpen((open) => !open)}
        >
          Update status
        </AdminButton>
      </div>

      {statusOpen && (
        <div
          data-ocid="customer_profile.status_options"
          className="mt-4 flex flex-wrap gap-2"
        >
          {CUSTOMER_STATUSES.map((status) => (
            <AdminButton
              key={status}
              variant={status === customer.status ? "primary" : "secondary"}
              size="sm"
              data-ocid={`customer_profile.status_option.${status}`}
              disabled={setStatus.isPending}
              onClick={() => {
                setStatus.mutate({ id: customerId, status });
                setStatusOpen(false);
              }}
            >
              {getCustomerStatusMeta(status).label}
            </AdminButton>
          ))}
        </div>
      )}

      {setStatus.isError && (
        <p
          data-ocid="customer_profile.status_error_state"
          role="alert"
          className="mt-3 text-sm font-medium text-[oklch(var(--admin-status-action))]"
        >
          We couldn&apos;t update the status. Please try again.
        </p>
      )}

      <div className="mt-5 border-t border-[oklch(var(--admin-border))] pt-5">
        {archived ? (
          <AdminButton
            variant="secondary"
            data-ocid="customer_profile.restore_button"
            disabled={restore.isPending}
            onClick={() => restore.mutate(customerId)}
          >
            <RotateCcw className="size-4" />
            {restore.isPending ? "Restoring…" : "Restore customer"}
          </AdminButton>
        ) : (
          <AdminButton
            variant="danger"
            data-ocid="customer_profile.archive_button"
            disabled={archive.isPending}
            onClick={() => archive.mutate(customerId)}
          >
            <X className="size-4" />
            {archive.isPending ? "Archiving…" : "Archive customer"}
          </AdminButton>
        )}
        {archive.isError && (
          <p
            data-ocid="customer_profile.archive_error_state"
            role="alert"
            className="mt-3 text-sm font-medium text-[oklch(var(--admin-status-action))]"
          >
            We couldn&apos;t archive this customer. Please try again.
          </p>
        )}
        {restore.isError && (
          <p
            data-ocid="customer_profile.restore_error_state"
            role="alert"
            className="mt-3 text-sm font-medium text-[oklch(var(--admin-status-action))]"
          >
            We couldn&apos;t restore this customer. Please try again.
          </p>
        )}
      </div>
    </AdminCard>
  );
}

/* ------------------------------------------------------------------ */
/* New service request                                                 */
/* ------------------------------------------------------------------ */

function NewRequestCard({
  customerId,
  profile,
}: {
  customerId: CustomerId;
  profile: import("@/lib/customers").CustomerProfileView;
}) {
  const customer = profile.customer;
  const createRequest = useCreateJobForCustomer();
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<ServiceCategory>(
    ServiceCategory.fixIt,
  );
  const [preferredTiming, setPreferredTiming] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<string | null>(null);

  const reset = () => {
    setCategory(ServiceCategory.fixIt);
    setPreferredTiming("");
    setDescription("");
    setError(null);
  };

  const handleCreate = () => {
    if (description.trim().length < 3) {
      setError("Tell us what needs doing.");
      return;
    }
    setError(null);
    createRequest.mutate(
      {
        customerId,
        input: {
          customerName: customer.fullName,
          email: customer.email,
          phone: customer.phone,
          category,
          preferredTiming: preferredTiming.trim(),
          description: description.trim(),
          photoIds: [],
          ownParts: false,
          packageInterest: false,
        },
      },
      {
        onSuccess: (result) => {
          if (result.__kind__ === "ok") {
            setCreated(result.ok.referenceCode);
            reset();
            setOpen(false);
          } else {
            setError("We couldn't create that request. Please try again.");
          }
        },
        onError: () => {
          setError("We couldn't create that request. Please try again.");
        },
      },
    );
  };

  return (
    <AdminCard data-ocid="customer_profile.new_request_card">
      <AdminCardHeader
        title="New service request"
        description="Book work for this customer without re-entering their details."
        action={
          <AdminButton
            size="sm"
            data-ocid="customer_profile.new_request_button"
            aria-expanded={open}
            onClick={() => {
              setOpen((value) => !value);
              setCreated(null);
            }}
          >
            <Plus className="size-4" />
            New service request
          </AdminButton>
        }
      />

      {created && (
        <p
          data-ocid="customer_profile.new_request_success_state"
          className="mb-4 rounded-xl border border-[oklch(var(--admin-status-paid))] bg-[oklch(var(--admin-surface-alt))] px-4 py-3 text-base font-semibold text-[oklch(var(--admin-status-paid))]"
        >
          Request {formatReference(created)} created for{" "}
          {customerDisplayName(customer)}.
        </p>
      )}

      {open ? (
        <div
          data-ocid="customer_profile.new_request_panel"
          className="grid gap-4"
        >
          <p className="rounded-xl border border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface-alt))] px-4 py-3 text-sm text-[oklch(var(--admin-muted-foreground))]">
            This request uses {customerDisplayName(customer)}&apos;s saved
            contact information — {customer.email} · {customer.phone}.
          </p>

          <AdminField label="Service" htmlFor="cp-request-category">
            <AdminSelect
              id="cp-request-category"
              className="form-field"
              data-ocid="customer_profile.new_request_category_select"
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as ServiceCategory)
              }
            >
              {SERVICE_CATEGORIES.map((value) => (
                <option key={value} value={value}>
                  {getService(value).label}
                </option>
              ))}
            </AdminSelect>
          </AdminField>

          <AdminField label="When works best" htmlFor="cp-request-timing">
            <AdminInput
              id="cp-request-timing"
              className="form-field"
              data-ocid="customer_profile.new_request_timing_input"
              value={preferredTiming}
              placeholder="Weekday mornings"
              onChange={(event) => setPreferredTiming(event.target.value)}
            />
          </AdminField>

          <AdminField label="What needs doing" htmlFor="cp-request-description">
            <AdminTextarea
              id="cp-request-description"
              className="form-field"
              data-ocid="customer_profile.new_request_description_input"
              value={description}
              placeholder="The back gate hinge is loose."
              onChange={(event) => setDescription(event.target.value)}
            />
          </AdminField>

          {error && (
            <p
              data-ocid="customer_profile.new_request_error_state"
              role="alert"
              className="text-sm font-medium text-[oklch(var(--admin-status-action))]"
            >
              {error}
            </p>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <AdminButton
              data-ocid="customer_profile.new_request_submit_button"
              disabled={createRequest.isPending}
              onClick={handleCreate}
            >
              <Plus className="size-4" />
              {createRequest.isPending ? "Creating…" : "Create request"}
            </AdminButton>
            <AdminButton
              variant="secondary"
              data-ocid="customer_profile.new_request_cancel_button"
              disabled={createRequest.isPending}
              onClick={() => {
                reset();
                setOpen(false);
              }}
            >
              Cancel
            </AdminButton>
          </div>
        </div>
      ) : (
        <p className="text-base text-[oklch(var(--admin-muted-foreground))]">
          Start a request and it is linked to this customer automatically.
        </p>
      )}
    </AdminCard>
  );
}

const SERVICE_CATEGORIES: ServiceCategory[] = [
  ServiceCategory.fixIt,
  ServiceCategory.house,
  ServiceCategory.yardPlants,
  ServiceCategory.cleanOrganize,
  ServiceCategory.moveLift,
  ServiceCategory.errands,
  ServiceCategory.mowing,
  ServiceCategory.showMe,
];

/* ------------------------------------------------------------------ */
/* Service history                                                     */
/* ------------------------------------------------------------------ */

function ServiceHistoryCard({
  profile,
}: {
  profile: import("@/lib/customers").CustomerProfileView;
}) {
  const groups = useMemo(
    () => [
      {
        key: "pending",
        label: "Pending & active",
        jobs: sortNewestFirst(profile.pendingJobs),
      },
      {
        key: "completed",
        label: "Completed",
        jobs: sortNewestFirst(profile.completedJobs),
      },
      {
        key: "cancelled",
        label: "Cancelled",
        jobs: sortNewestFirst(profile.cancelledJobs),
      },
    ],
    [profile.pendingJobs, profile.completedJobs, profile.cancelledJobs],
  );

  const total = groups.reduce((sum, group) => sum + group.jobs.length, 0);

  return (
    <AdminCard data-ocid="customer_profile.service_history_card">
      <AdminCardHeader
        title="Service history"
        description="Every request this customer has made, grouped by outcome."
        action={
          <AdminChip data-ocid="customer_profile.service_history_count">
            {total} {total === 1 ? "request" : "requests"}
          </AdminChip>
        }
      />

      {total === 0 ? (
        <AdminEmptyState
          data-ocid="customer_profile.service_history_empty_state"
          icon={<StickyNote className="size-6" />}
          title="No service requests yet"
          description="Requests this customer submits appear here with their quotes and status."
        />
      ) : (
        <div className="flex flex-col gap-5">
          {groups.map((group) => (
            <section
              key={group.key}
              data-ocid={`customer_profile.history_group.${group.key}`}
            >
              <h3 className="admin-label mb-2">
                {group.label} · {group.jobs.length}
              </h3>
              {group.jobs.length === 0 ? (
                <p className="text-sm text-[oklch(var(--admin-muted-foreground))]">
                  Nothing here yet.
                </p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {group.jobs.map((job, index) => (
                    <HistoryRow
                      key={job.id.toString()}
                      job={job}
                      index={index + 1}
                    />
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      )}
    </AdminCard>
  );
}

function HistoryRow({ job, index }: { job: JobRequestView; index: number }) {
  const status = adminStatusForJob(job.status);
  const quote = job.quote;

  return (
    <li
      data-ocid={`customer_profile.history_item.${index}`}
      className="rounded-xl border border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface-alt))] p-4"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-base font-bold text-[oklch(var(--admin-foreground))]">
            {getService(job.category).label}
          </p>
          <p className="mt-0.5 font-mono text-sm text-[oklch(var(--admin-muted-foreground))]">
            {formatReference(job.referenceCode)} ·{" "}
            {formatDateTime(job.createdAt)}
          </p>
        </div>
        <AdminStatusBadge
          data-ocid={`customer_profile.history_status.${index}`}
          tone={status.tone}
          label={status.label}
          dot
        />
      </div>
      <p className="mt-3 text-base text-[oklch(var(--admin-foreground))]">
        {job.description}
      </p>
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
        {quote && (
          <span className="text-[oklch(var(--admin-muted-foreground))]">
            Quote{" "}
            <span className="font-mono font-semibold text-[oklch(var(--admin-foreground))]">
              {formatMoney(quote.amount)}
            </span>
          </span>
        )}
        {job.preferredTiming && (
          <span className="text-[oklch(var(--admin-muted-foreground))]">
            Preferred timing: {job.preferredTiming}
          </span>
        )}
      </div>
    </li>
  );
}

function sortNewestFirst(jobs: JobRequestView[]): JobRequestView[] {
  return [...jobs].sort((a, b) =>
    a.createdAt === b.createdAt ? 0 : a.createdAt > b.createdAt ? -1 : 1,
  );
}

/* ------------------------------------------------------------------ */
/* Payments & appointments                                             */
/* ------------------------------------------------------------------ */

function PaymentsAppointmentsCard({
  profile,
}: {
  profile: import("@/lib/customers").CustomerProfileView;
}) {
  const deposits = useMemo(
    () => sortDepositsNewestFirst(profile.deposits),
    [profile.deposits],
  );
  const appointments = useMemo(
    () => sortAppointmentsNewestFirst(profile.appointments),
    [profile.appointments],
  );
  const photos = profile.photoIds;

  return (
    <AdminCard data-ocid="customer_profile.payments_appointments_card">
      <AdminCardHeader
        title="Payments & appointments"
        description="Deposits recorded, scheduled visits and job photos."
      />

      <div className="grid gap-6">
        <section>
          <h3 className="admin-label mb-2">Deposits</h3>
          {deposits.length === 0 ? (
            <p
              data-ocid="customer_profile.deposits_empty_state"
              className="text-base text-[oklch(var(--admin-muted-foreground))]"
            >
              No deposits recorded yet.
            </p>
          ) : (
            <ul
              data-ocid="customer_profile.deposits_list"
              className="flex flex-col gap-2"
            >
              {deposits.map((deposit, index) => {
                const meta = getDepositStatusMeta(deposit.status);
                return (
                  <li
                    key={`${deposit.paidAt?.toString() ?? "deposit"}-${index}`}
                    data-ocid={`customer_profile.deposit_item.${index + 1}`}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface-alt))] px-4 py-3"
                  >
                    <span className="font-mono text-base font-semibold text-[oklch(var(--admin-foreground))]">
                      {formatMoney(deposit.amount)}
                    </span>
                    <AdminStatusBadge tone={meta.tone} label={meta.label} dot />
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section>
          <h3 className="admin-label mb-2">Appointments</h3>
          {appointments.length === 0 ? (
            <p
              data-ocid="customer_profile.appointments_empty_state"
              className="text-base text-[oklch(var(--admin-muted-foreground))]"
            >
              No appointments scheduled yet.
            </p>
          ) : (
            <ul
              data-ocid="customer_profile.appointments_list"
              className="flex flex-col gap-2"
            >
              {appointments.map((appointment, index) => (
                <li
                  key={`${appointment.scheduledAt.toString()}-${index}`}
                  data-ocid={`customer_profile.appointment_item.${index + 1}`}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface-alt))] px-4 py-3"
                >
                  <span className="text-base font-semibold text-[oklch(var(--admin-foreground))]">
                    {formatDateTime(appointment.scheduledAt)}
                  </span>
                  <AdminStatusBadge
                    tone={appointment.confirmed ? "confirmed" : "waiting"}
                    label={appointment.confirmed ? "Confirmed" : "Pending"}
                    dot
                  />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h3 className="admin-label mb-2">Photos</h3>
          {photos.length === 0 ? (
            <p
              data-ocid="customer_profile.photos_empty_state"
              className="text-base text-[oklch(var(--admin-muted-foreground))]"
            >
              No photos attached yet.
            </p>
          ) : (
            <ul
              data-ocid="customer_profile.photos_list"
              className="flex flex-wrap gap-2"
            >
              {photos.map((photoId, index) => (
                <li
                  key={photoId}
                  data-ocid={`customer_profile.photo_item.${index + 1}`}
                  className="flex items-center gap-2 rounded-lg border border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface-alt))] px-3 py-2 text-sm text-[oklch(var(--admin-muted-foreground))]"
                >
                  <ImageIcon className="size-4" aria-hidden="true" />
                  <span className="font-mono">{shortPhotoId(photoId)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </AdminCard>
  );
}

function sortDepositsNewestFirst(deposits: Deposit[]): Deposit[] {
  return [...deposits].sort((a, b) => {
    const aTime = a.paidAt ?? a.submittedAt ?? 0n;
    const bTime = b.paidAt ?? b.submittedAt ?? 0n;
    return aTime === bTime ? 0 : aTime > bTime ? -1 : 1;
  });
}

function sortAppointmentsNewestFirst(
  appointments: Appointment[],
): Appointment[] {
  return [...appointments].sort((a, b) =>
    a.scheduledAt === b.scheduledAt
      ? 0
      : a.scheduledAt > b.scheduledAt
        ? -1
        : 1,
  );
}

function shortPhotoId(photoId: PhotoId): string {
  return photoId.length > 18 ? `${photoId.slice(0, 18)}…` : photoId;
}

/* ------------------------------------------------------------------ */
/* Notes                                                               */
/* ------------------------------------------------------------------ */

function NotesCard({
  customerId,
  profile,
}: {
  customerId: CustomerId;
  profile: import("@/lib/customers").CustomerProfileView;
}) {
  const customer = profile.customer;
  const addNote = useAddCustomerNote();
  const [body, setBody] = useState("");
  const [internalBody, setInternalBody] = useState("");
  const [showInternal, setShowInternal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const notes = useMemo(
    () =>
      [...customer.notes].sort((a, b) =>
        a.createdAt === b.createdAt ? 0 : a.createdAt > b.createdAt ? -1 : 1,
      ),
    [customer.notes],
  );

  const handleAdd = () => {
    const next = body.trim();
    if (next.length === 0) {
      setError("Write a note before saving.");
      return;
    }
    setError(null);
    setBody("");
    addNote.mutate(
      { id: customerId, body: next },
      {
        onError: () => {
          setError("We couldn't save that note. Please try again.");
          setBody((current) => (current === "" ? next : current));
        },
      },
    );
  };

  const handleAddInternal = () => {
    const next = internalBody.trim();
    if (next.length === 0) {
      setError("Write a note before saving.");
      return;
    }
    setError(null);
    setInternalBody("");
    addNote.mutate(
      { id: customerId, body: next },
      {
        onError: () => {
          setError("We couldn't save that note. Please try again.");
          setInternalBody((current) => (current === "" ? next : current));
        },
      },
    );
  };

  return (
    <AdminCard data-ocid="customer_profile.notes_card">
      <AdminCardHeader
        title="Notes"
        description="Internal notes about this customer."
      />

      {notes.length === 0 ? (
        <p
          data-ocid="customer_profile.notes_empty_state"
          className="text-base text-[oklch(var(--admin-muted-foreground))]"
        >
          No notes yet. Add the first one below.
        </p>
      ) : (
        <ul
          data-ocid="customer_profile.notes_list"
          className="flex flex-col gap-2"
        >
          {notes.map((note, index) => (
            <li
              key={note.id.toString()}
              data-ocid={`customer_profile.note_item.${index + 1}`}
              className="rounded-lg border border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface-alt))] px-3 py-2"
            >
              <p className="text-base text-[oklch(var(--admin-foreground))]">
                {note.body}
              </p>
              <p className="mt-1 text-sm text-[oklch(var(--admin-muted-foreground))]">
                {formatDateTime(note.createdAt)}
              </p>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 border-t border-[oklch(var(--admin-border))] pt-4">
        <AdminField label="Add a note" htmlFor="cp-notes-add">
          <AdminTextarea
            id="cp-notes-add"
            className="form-field"
            data-ocid="customer_profile.notes_input"
            value={body}
            onChange={(event) => {
              setBody(event.target.value);
              setError(null);
            }}
            placeholder="Gate code is 4821. Prefers texts before 9am."
          />
        </AdminField>
        {error && (
          <p
            data-ocid="customer_profile.notes_error_state"
            role="alert"
            className="mt-2 text-sm font-medium text-[oklch(var(--admin-status-action))]"
          >
            {error}
          </p>
        )}
        <AdminButton
          size="sm"
          data-ocid="customer_profile.notes_save_button"
          disabled={addNote.isPending || body.trim().length === 0}
          onClick={handleAdd}
          className="mt-3 w-full sm:w-auto"
        >
          <StickyNote className="size-4" />
          {addNote.isPending ? "Saving…" : "Add note"}
        </AdminButton>

        <div className="mt-4">
          <AdminButton
            variant="secondary"
            size="sm"
            data-ocid="customer_profile.add_note_button"
            aria-expanded={showInternal}
            onClick={() => setShowInternal((value) => !value)}
          >
            <Plus className="size-4" />
            Add internal note
          </AdminButton>
        </div>

        {showInternal && (
          <div
            data-ocid="customer_profile.internal_note_panel"
            className="mt-3"
          >
            <AdminField label="Internal note" htmlFor="cp-notes-internal">
              <AdminTextarea
                id="cp-notes-internal"
                className="form-field"
                data-ocid="customer_profile.internal_note_input"
                value={internalBody}
                onChange={(event) => {
                  setInternalBody(event.target.value);
                  setError(null);
                }}
                placeholder="Only visible to the team."
              />
            </AdminField>
            <AdminButton
              size="sm"
              data-ocid="customer_profile.internal_note_save_button"
              disabled={addNote.isPending || internalBody.trim().length === 0}
              onClick={handleAddInternal}
              className="mt-3 w-full sm:w-auto"
            >
              <StickyNote className="size-4" />
              {addNote.isPending ? "Saving…" : "Save internal note"}
            </AdminButton>
          </div>
        )}
      </div>
    </AdminCard>
  );
}

/* ------------------------------------------------------------------ */
/* Message thread                                                      */
/* ------------------------------------------------------------------ */

function MessageThread({ customerId }: { customerId: CustomerId }) {
  const messagesQuery = useCustomerMessages(customerId);
  const sendMessage = useSendAdminMessage();
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);

  const messages = useMemo(() => {
    const list = messagesQuery.data ?? [];
    return [...list].sort((a, b) =>
      a.createdAt === b.createdAt ? 0 : a.createdAt > b.createdAt ? 1 : -1,
    );
  }, [messagesQuery.data]);

  const handleSend = () => {
    const next = body.trim();
    if (next.length === 0) {
      setError("Write a message before sending.");
      return;
    }
    setError(null);
    setBody("");
    sendMessage.mutate(
      { customerId, jobId: null, body: next },
      {
        onError: () => {
          setError("We couldn't send that message. Please try again.");
          setBody((current) => (current === "" ? next : current));
        },
      },
    );
  };

  return (
    <AdminCard data-ocid="customer_profile.messages_card">
      <AdminCardHeader
        title="Messages"
        description="Messages exchanged with this customer."
      />

      {messagesQuery.isLoading ? (
        <AdminLoadingState
          data-ocid="customer_profile.messages_loading_state"
          label="Loading messages"
        />
      ) : messagesQuery.isError ? (
        <AdminErrorState
          data-ocid="customer_profile.messages_error_state"
          message="We couldn't load the message thread."
          onRetry={() => void messagesQuery.refetch()}
        />
      ) : messages.length === 0 ? (
        <p
          data-ocid="customer_profile.messages_empty_state"
          className="text-base text-[oklch(var(--admin-muted-foreground))]"
        >
          No messages yet. Start the conversation below.
        </p>
      ) : (
        <ul
          data-ocid="customer_profile.messages_list"
          className="flex max-h-96 flex-col gap-3 overflow-y-auto pr-1"
        >
          {messages.map((message, index) => (
            <MessageBubble
              key={message.id.toString()}
              message={message}
              index={index + 1}
            />
          ))}
        </ul>
      )}

      <div className="mt-4 border-t border-[oklch(var(--admin-border))] pt-4">
        <AdminField label="Reply to the customer" htmlFor="cp-message-reply">
          <AdminTextarea
            id="cp-message-reply"
            className="form-field"
            data-ocid="customer_profile.message_input"
            value={body}
            onChange={(event) => {
              setBody(event.target.value);
              setError(null);
            }}
            placeholder="Thanks for reaching out — we can be there Thursday morning."
          />
        </AdminField>
        {error && (
          <p
            data-ocid="customer_profile.message_error_state"
            role="alert"
            className="mt-2 text-sm font-medium text-[oklch(var(--admin-status-action))]"
          >
            {error}
          </p>
        )}
        <AdminButton
          size="sm"
          data-ocid="customer_profile.message_send_button"
          disabled={sendMessage.isPending || body.trim().length === 0}
          onClick={handleSend}
          className="mt-3 w-full sm:w-auto"
        >
          <Send className="size-4" />
          {sendMessage.isPending ? "Sending…" : "Send reply"}
        </AdminButton>
      </div>
    </AdminCard>
  );
}

function MessageBubble({
  message,
  index,
}: {
  message: MessageView;
  index: number;
}) {
  return (
    <li
      data-ocid={`customer_profile.message_item.${index}`}
      className={cn(
        "max-w-[85%] rounded-2xl border px-4 py-2.5",
        message.fromAdmin
          ? "ml-auto border-[oklch(var(--admin-primary))] bg-[oklch(var(--admin-primary))] text-[oklch(var(--admin-primary-foreground))]"
          : "mr-auto border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface-alt))] text-[oklch(var(--admin-foreground))]",
      )}
    >
      <p
        className={cn(
          "text-sm font-semibold uppercase tracking-[0.14em]",
          message.fromAdmin
            ? "text-[oklch(var(--admin-primary-foreground))] opacity-80"
            : "text-[oklch(var(--admin-muted-foreground))]",
        )}
      >
        {message.fromAdmin ? "You" : "Customer"}
      </p>
      <p className="mt-1 text-base">{message.body}</p>
      <p
        className={cn(
          "mt-1 text-sm",
          message.fromAdmin
            ? "text-[oklch(var(--admin-primary-foreground))] opacity-80"
            : "text-[oklch(var(--admin-muted-foreground))]",
        )}
      >
        {formatDateTime(message.createdAt)}
      </p>
    </li>
  );
}
