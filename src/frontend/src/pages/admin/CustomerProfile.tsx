import {
  type Appointment,
  type CustomerId,
  type CustomerInput,
  CustomerStatus,
  type JobRequestView,
  type PaymentHistory,
  type PreferredContact,
  type Quote,
  createActor,
} from "@/backend";
import {
  AdminButton,
  AdminCard,
  AdminCardHeader,
  AdminChip,
  type AdminColumn,
  AdminConfirmDialog,
  AdminDataTable,
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
  useCustomerMessages,
  useCustomerProfile,
  useRestoreCustomer,
  useSendAdminMessage,
  useSetCustomerStatus,
  useUpdateCustomer,
} from "@/hooks/useCustomers";
import { useIsAdmin } from "@/hooks/useJobs";
import {
  adminStatusForJob,
  adminStatusForJobRecord,
  formatPricingAmount,
  getDepositStatusMeta,
  paymentMethodLabel,
  pricingFromQuotePricing,
  pricingRows,
} from "@/lib/admin";
import {
  CUSTOMER_STATUSES,
  PREFERRED_CONTACTS,
  customerDisplayName,
  customerInitials,
  formatCustomerSince,
  getCustomerStatusMeta,
  getPreferredContactMeta,
} from "@/lib/customers";
import {
  formatDate,
  formatDateTime,
  formatMoney,
  formatReference,
} from "@/lib/jobs";
import { getService } from "@/lib/services";
import { cn } from "@/lib/utils";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  CalendarClock,
  Check,
  CreditCard,
  LogIn,
  Mail,
  MessageSquare,
  Phone,
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
 * contact details with inline edit/save, the customer's requests, quotes,
 * appointments, jobs, payments, messages and notes in one connected view, plus
 * the permanent payment history. Admin-only — the backend enforces the same
 * boundary.
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
  const contactMeta = getPreferredContactMeta(customer.preferredContact);

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
              {contactMeta.label}
            </AdminChip>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="flex min-w-0 flex-col gap-6">
          <ContactCard customerId={customerId} profile={profile} />
          <PaymentHistoryCard payments={profile.payments} />
          <RequestsCard profile={profile} />
          <QuotesCard quotes={profile.quotes} />
          <JobsCard profile={profile} />
        </div>
        <div className="flex min-w-0 flex-col gap-6">
          <LifecycleCard customerId={customerId} profile={profile} />
          <AppointmentsCard appointments={profile.appointments} />
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
              Edit customer
            </AdminButton>
          )
        }
      />

      {editing ? (
        <div data-ocid="customer_profile.edit_panel" className="grid gap-4">
          <AdminField label="Full name" htmlFor="cp-full-name">
            <AdminInput
              id="cp-full-name"
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
                data-ocid="customer_profile.edit_phone_input"
                value={form.phone}
                onChange={(event) => set("phone", event.target.value)}
              />
            </AdminField>
            <AdminField label="Email" htmlFor="cp-email">
              <AdminInput
                id="cp-email"
                type="email"
                data-ocid="customer_profile.edit_email_input"
                value={form.email}
                onChange={(event) => set("email", event.target.value)}
              />
            </AdminField>
          </div>
          <AdminField label="Service address" htmlFor="cp-address">
            <AdminInput
              id="cp-address"
              data-ocid="customer_profile.edit_address_input"
              value={form.serviceAddress}
              onChange={(event) => set("serviceAddress", event.target.value)}
            />
          </AdminField>
          <AdminField label="Preferred contact method" htmlFor="cp-preferred">
            <AdminSelect
              id="cp-preferred"
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
  const [confirmArchive, setConfirmArchive] = useState(false);

  const archived = customer.status === CustomerStatus.archived;

  return (
    <AdminCard data-ocid="customer_profile.lifecycle_card">
      <AdminCardHeader
        title="Status & actions"
        description="Change where this customer stands or archive the record."
      />

      <AdminField label="Customer status" htmlFor="cp-status">
        <AdminSelect
          id="cp-status"
          data-ocid="customer_profile.status_select"
          value={customer.status}
          disabled={setStatus.isPending}
          onChange={(event) =>
            setStatus.mutate({
              id: customerId,
              status: event.target.value as CustomerStatus,
            })
          }
        >
          {CUSTOMER_STATUSES.map((status) => (
            <option key={status} value={status}>
              {getCustomerStatusMeta(status).label}
            </option>
          ))}
        </AdminSelect>
      </AdminField>

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
            onClick={() => setConfirmArchive(true)}
          >
            <X className="size-4" />
            Archive customer
          </AdminButton>
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

      <AdminConfirmDialog
        open={confirmArchive}
        onOpenChange={setConfirmArchive}
        title="Archive this customer?"
        description="They are hidden from the active directory but their full history is kept. You can restore them at any time."
        confirmLabel="Archive customer"
        destructive
        isPending={archive.isPending}
        onConfirm={() => {
          archive.mutate(customerId, {
            onSuccess: () => setConfirmArchive(false),
          });
        }}
      />
    </AdminCard>
  );
}

/* ------------------------------------------------------------------ */
/* Payment history                                                     */
/* ------------------------------------------------------------------ */

function PaymentHistoryCard({ payments }: { payments: PaymentHistory[] }) {
  const sorted = useMemo(
    () =>
      [...payments].sort((a, b) =>
        a.createdAt === b.createdAt ? 0 : a.createdAt > b.createdAt ? -1 : 1,
      ),
    [payments],
  );

  const totalPaid = useMemo(
    () => sorted.reduce((sum, record) => sum + record.totalPaid, 0n),
    [sorted],
  );

  const columns: AdminColumn<PaymentHistory>[] = [
    {
      key: "reference",
      header: "Reference",
      cell: (record) => (
        <span className="font-mono text-sm font-semibold">
          {formatReference(record.referenceCode)}
        </span>
      ),
    },
    {
      key: "originalQuote",
      header: "Original quote",
      align: "right",
      hideOnMobile: true,
      cell: (record) => formatMoney(record.originalQuote),
    },
    {
      key: "discount",
      header: "Discount",
      align: "right",
      hideOnMobile: true,
      cell: (record) =>
        record.discountAmount > 0n
          ? `−${formatMoney(record.discountAmount)}`
          : "—",
    },
    {
      key: "finalQuote",
      header: "Final quote",
      align: "right",
      cell: (record) => formatMoney(record.finalQuote),
    },
    {
      key: "deposit",
      header: "Deposit",
      align: "right",
      cell: (record) => formatMoney(record.depositAmount),
    },
    {
      key: "method",
      header: "Method",
      hideOnMobile: true,
      cell: (record) => paymentMethodLabel(record.paymentMethod),
    },
    {
      key: "depositStatus",
      header: "Deposit status",
      cell: (record) => {
        const meta = getDepositStatusMeta(record.depositStatus);
        return <AdminStatusBadge tone={meta.tone} label={meta.label} dot />;
      },
    },
    {
      key: "remaining",
      header: "Remaining",
      align: "right",
      cell: (record) => formatMoney(record.remainingBalance),
    },
    {
      key: "finalPayment",
      header: "Final payment",
      align: "right",
      hideOnMobile: true,
      cell: (record) =>
        record.finalPayment > 0n ? formatMoney(record.finalPayment) : "—",
    },
    {
      key: "totalPaid",
      header: "Total paid",
      align: "right",
      cell: (record) => (
        <span className="font-semibold">{formatMoney(record.totalPaid)}</span>
      ),
    },
  ];

  return (
    <AdminCard data-ocid="customer_profile.payment_history_card">
      <AdminCardHeader
        title="Payment history"
        description="Every payment record for this customer, newest first."
        action={
          <AdminChip data-ocid="customer_profile.payment_history_total">
            {formatMoney(totalPaid)} paid
          </AdminChip>
        }
      />
      <AdminDataTable
        data-ocid="customer_profile.payment_history_table"
        caption="Payment history"
        columns={columns}
        rows={sorted}
        rowKey={(record) => record.id.toString()}
        empty={
          <AdminEmptyState
            data-ocid="customer_profile.payment_history_empty_state"
            icon={<CreditCard className="size-6" />}
            title="No payments yet"
            description="Payment records appear here once a quote is accepted and a deposit is recorded."
          />
        }
      />
    </AdminCard>
  );
}

/* ------------------------------------------------------------------ */
/* Requests                                                            */
/* ------------------------------------------------------------------ */

function RequestsCard({
  profile,
}: {
  profile: import("@/lib/customers").CustomerProfileView;
}) {
  const requests = useMemo(
    () =>
      [...profile.jobs].sort((a, b) =>
        a.createdAt === b.createdAt ? 0 : a.createdAt > b.createdAt ? -1 : 1,
      ),
    [profile.jobs],
  );

  return (
    <AdminCard data-ocid="customer_profile.requests_card">
      <AdminCardHeader
        title="Service requests"
        description="Every request this customer has submitted."
        action={
          <AdminChip data-ocid="customer_profile.requests_count">
            {requests.length} {requests.length === 1 ? "request" : "requests"}
          </AdminChip>
        }
      />
      {requests.length === 0 ? (
        <AdminEmptyState
          data-ocid="customer_profile.requests_empty_state"
          icon={<StickyNote className="size-6" />}
          title="No requests yet"
          description="This customer has not submitted a service request."
        />
      ) : (
        <ul
          data-ocid="customer_profile.requests_list"
          className="flex flex-col gap-3"
        >
          {requests.map((job, index) => (
            <RequestRow key={job.id.toString()} job={job} index={index + 1} />
          ))}
        </ul>
      )}
    </AdminCard>
  );
}

function RequestRow({ job, index }: { job: JobRequestView; index: number }) {
  const service = getService(job.category);
  const status = adminStatusForJob(job.status);

  return (
    <li
      data-ocid={`customer_profile.request_item.${index}`}
      className="rounded-xl border border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface-alt))] p-4"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-base font-bold text-[oklch(var(--admin-foreground))]">
            {service.label}
          </p>
          <p className="mt-0.5 font-mono text-sm text-[oklch(var(--admin-muted-foreground))]">
            {formatReference(job.referenceCode)} ·{" "}
            {formatDateTime(job.createdAt)}
          </p>
        </div>
        <AdminStatusBadge
          data-ocid={`customer_profile.request_status.${index}`}
          tone={status.tone}
          label={status.label}
          dot
        />
      </div>
      <p className="mt-3 text-base text-[oklch(var(--admin-foreground))]">
        {job.description}
      </p>
      {job.preferredTiming && (
        <p className="mt-2 text-sm text-[oklch(var(--admin-muted-foreground))]">
          Preferred timing: {job.preferredTiming}
        </p>
      )}
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* Quotes                                                              */
/* ------------------------------------------------------------------ */

function QuotesCard({ quotes }: { quotes: Quote[] }) {
  const sorted = useMemo(
    () =>
      [...quotes].sort((a, b) =>
        a.createdAt === b.createdAt ? 0 : a.createdAt > b.createdAt ? -1 : 1,
      ),
    [quotes],
  );

  return (
    <AdminCard data-ocid="customer_profile.quotes_card">
      <AdminCardHeader
        title="Quotes"
        description="Itemized quotes with their pricing breakdown."
        action={
          <AdminChip data-ocid="customer_profile.quotes_count">
            {sorted.length} {sorted.length === 1 ? "quote" : "quotes"}
          </AdminChip>
        }
      />
      {sorted.length === 0 ? (
        <AdminEmptyState
          data-ocid="customer_profile.quotes_empty_state"
          icon={<StickyNote className="size-6" />}
          title="No quotes yet"
          description="Quotes sent to this customer appear here with their full breakdown."
        />
      ) : (
        <ul
          data-ocid="customer_profile.quotes_list"
          className="flex flex-col gap-4"
        >
          {sorted.map((quote, index) => (
            <QuoteRow
              key={`${quote.quoteNumber}-${index}`}
              quote={quote}
              index={index + 1}
            />
          ))}
        </ul>
      )}
    </AdminCard>
  );
}

function QuoteRow({ quote, index }: { quote: Quote; index: number }) {
  const breakdown = pricingFromQuotePricing(quote.pricing);
  const rows = breakdown ? pricingRows(breakdown) : null;

  return (
    <li
      data-ocid={`customer_profile.quote_item.${index}`}
      className="rounded-xl border border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface-alt))] p-4"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-base font-bold text-[oklch(var(--admin-foreground))]">
            {quote.quoteNumber || `Quote ${index}`}
          </p>
          <p className="mt-0.5 text-sm text-[oklch(var(--admin-muted-foreground))]">
            {quote.workDescription || "No description"}
          </p>
        </div>
        <AdminStatusBadge
          data-ocid={`customer_profile.quote_status.${index}`}
          tone={quoteStatusTone(quote)}
          label={quoteStatusLabel(quote)}
          dot
        />
      </div>

      {rows ? (
        <dl className="mt-3 grid gap-1.5">
          {rows.map((row) => (
            <div
              key={row.key}
              className="flex items-center justify-between gap-3 text-sm"
            >
              <dt
                className={cn(
                  "text-[oklch(var(--admin-muted-foreground))]",
                  row.emphasis &&
                    "font-semibold text-[oklch(var(--admin-foreground))]",
                )}
              >
                {row.label}
              </dt>
              <dd
                className={cn(
                  "font-mono text-[oklch(var(--admin-foreground))]",
                  row.emphasis && "font-bold",
                )}
              >
                {formatPricingAmount(row)}
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <dl className="mt-3 grid gap-1.5">
          <div className="flex items-center justify-between gap-3 text-sm">
            <dt className="text-[oklch(var(--admin-muted-foreground))]">
              Total
            </dt>
            <dd className="font-mono font-bold text-[oklch(var(--admin-foreground))]">
              {formatMoney(quote.total)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3 text-sm">
            <dt className="text-[oklch(var(--admin-muted-foreground))]">
              Deposit
            </dt>
            <dd className="font-mono text-[oklch(var(--admin-foreground))]">
              {formatMoney(quote.depositRequired)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3 text-sm">
            <dt className="text-[oklch(var(--admin-muted-foreground))]">
              Remaining balance
            </dt>
            <dd className="font-mono font-bold text-[oklch(var(--admin-foreground))]">
              {formatMoney(quote.remainingBalance)}
            </dd>
          </div>
        </dl>
      )}

      {quote.expiresAt && (
        <p className="mt-3 text-sm text-[oklch(var(--admin-muted-foreground))]">
          Expires {formatDate(quote.expiresAt)}
        </p>
      )}
    </li>
  );
}

function quoteStatusLabel(quote: Quote): string {
  switch (quote.status) {
    case "approved":
      return "Approved";
    case "declined":
      return "Declined";
    case "sent":
      return "Sent";
    default:
      return "Draft";
  }
}

function quoteStatusTone(
  quote: Quote,
): "approved" | "cancelled" | "waiting" | "new" {
  switch (quote.status) {
    case "approved":
      return "approved";
    case "declined":
      return "cancelled";
    case "sent":
      return "waiting";
    default:
      return "new";
  }
}

/* ------------------------------------------------------------------ */
/* Jobs                                                                */
/* ------------------------------------------------------------------ */

function JobsCard({
  profile,
}: {
  profile: import("@/lib/customers").CustomerProfileView;
}) {
  const records = useMemo(
    () =>
      [...profile.jobRecords].sort((a, b) =>
        a.createdAt === b.createdAt ? 0 : a.createdAt > b.createdAt ? -1 : 1,
      ),
    [profile.jobRecords],
  );

  return (
    <AdminCard data-ocid="customer_profile.jobs_card">
      <AdminCardHeader
        title="Jobs"
        description="Scheduled and completed work for this customer."
        action={
          <AdminChip data-ocid="customer_profile.jobs_count">
            {records.length} {records.length === 1 ? "job" : "jobs"}
          </AdminChip>
        }
      />
      {records.length === 0 ? (
        <AdminEmptyState
          data-ocid="customer_profile.jobs_empty_state"
          icon={<CalendarClock className="size-6" />}
          title="No jobs yet"
          description="Jobs appear here once a request is scheduled and converted to work."
        />
      ) : (
        <ul
          data-ocid="customer_profile.jobs_list"
          className="flex flex-col gap-3"
        >
          {records.map((record, index) => {
            const status = adminStatusForJobRecord(record.status);
            return (
              <li
                key={record.id.toString()}
                data-ocid={`customer_profile.job_item.${index + 1}`}
                className="rounded-xl border border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface-alt))] p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-base font-bold text-[oklch(var(--admin-foreground))]">
                      {getService(record.category).label}
                    </p>
                    <p className="mt-0.5 font-mono text-sm text-[oklch(var(--admin-muted-foreground))]">
                      {formatReference(record.referenceCode)} ·{" "}
                      {formatDateTime(record.scheduledAt)}
                    </p>
                  </div>
                  <AdminStatusBadge
                    data-ocid={`customer_profile.job_status.${index + 1}`}
                    tone={status.tone}
                    label={status.label}
                    dot
                  />
                </div>
                <p className="mt-2 text-sm text-[oklch(var(--admin-muted-foreground))]">
                  {record.serviceAddress}
                </p>
                <div className="mt-3 flex flex-wrap gap-4 text-sm">
                  <span className="text-[oklch(var(--admin-muted-foreground))]">
                    Remaining balance{" "}
                    <span className="font-mono font-semibold text-[oklch(var(--admin-foreground))]">
                      {formatMoney(record.remainingBalance)}
                    </span>
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </AdminCard>
  );
}

/* ------------------------------------------------------------------ */
/* Appointments                                                        */
/* ------------------------------------------------------------------ */

function AppointmentsCard({
  appointments,
}: {
  appointments: Appointment[];
}) {
  const sorted = useMemo(
    () =>
      [...appointments].sort((a, b) =>
        a.scheduledAt === b.scheduledAt
          ? 0
          : a.scheduledAt > b.scheduledAt
            ? -1
            : 1,
      ),
    [appointments],
  );

  return (
    <AdminCard data-ocid="customer_profile.appointments_card">
      <AdminCardHeader
        title="Appointments"
        description="Scheduled visits across every job."
        action={
          <AdminChip data-ocid="customer_profile.appointments_count">
            {sorted.length}
          </AdminChip>
        }
      />
      {sorted.length === 0 ? (
        <AdminEmptyState
          data-ocid="customer_profile.appointments_empty_state"
          icon={<CalendarClock className="size-6" />}
          title="No appointments"
          description="No visits are scheduled for this customer yet."
        />
      ) : (
        <ul
          data-ocid="customer_profile.appointments_list"
          className="flex flex-col gap-3"
        >
          {sorted.map((appointment, index) => (
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
    </AdminCard>
  );
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

  return (
    <AdminCard data-ocid="customer_profile.notes_card">
      <AdminCardHeader
        title="Notes"
        description="Internal notes about this customer."
      />

      {customer.adminNotes.trim().length > 0 && (
        <p
          data-ocid="customer_profile.admin_notes"
          className="mb-4 rounded-xl border border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface-alt))] p-3 text-base text-[oklch(var(--admin-foreground))]"
        >
          {customer.adminNotes}
        </p>
      )}

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
            <li
              key={message.id.toString()}
              data-ocid={`customer_profile.message_item.${index + 1}`}
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
          ))}
        </ul>
      )}

      <div className="mt-4 border-t border-[oklch(var(--admin-border))] pt-4">
        <AdminField label="Reply to the customer" htmlFor="cp-message-reply">
          <AdminTextarea
            id="cp-message-reply"
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
