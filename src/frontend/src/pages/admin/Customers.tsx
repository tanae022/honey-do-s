import {
  AdminButton,
  AdminCard,
  AdminCardHeader,
  type AdminColumn,
  AdminDataTable,
  AdminEmptyState,
  AdminErrorState,
  AdminField,
  AdminInput,
  AdminLoadingState,
  AdminPageHeader,
  AdminSelect,
  AdminShell,
  AdminStatCard,
  AdminStatusBadge,
  type AdminStatusTone,
} from "@/components/admin";
import {
  useCreateCustomer,
  useCustomerSearch,
  useCustomers,
  useExportCustomersCsv,
  useUpdateCustomer,
} from "@/hooks/useCustomers";
import { useIsAdmin } from "@/hooks/useJobs";
import {
  type CustomerInput,
  CustomerStatus,
  type CustomerSummary,
  PREFERRED_CONTACTS,
  PreferredContact,
  customerDisplayName,
  customerInitials,
  downloadCustomersCsv,
  formatJobCount,
  getCustomerStatusMeta,
  getPreferredContactMeta,
} from "@/lib/customers";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Link } from "@tanstack/react-router";
import {
  Download,
  LogIn,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Search,
  ShieldAlert,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { type FormEvent, useMemo, useState } from "react";

/* ------------------------------------------------------------------ */
/* Status presentation                                                 */
/* ------------------------------------------------------------------ */

/**
 * Map a customer lifecycle status onto the shared admin status tone so the
 * same state always reads the same high-contrast color across the console.
 */
const CUSTOMER_STATUS_TONE: Record<CustomerStatus, AdminStatusTone> = {
  [CustomerStatus.active]: "completed",
  [CustomerStatus.inactive]: "waiting",
  [CustomerStatus.archived]: "cancelled",
};

const EMPTY_DRAFT: CustomerInput = {
  fullName: "",
  phone: "",
  email: "",
  serviceAddress: "",
  preferredContact: PreferredContact.phone,
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

/**
 * Admin customer directory.
 *
 * A clean, searchable table of every customer the hive has served, matched on
 * name, phone, email, id and service address. Each row links to the customer's
 * full profile; the directory can be exported as CSV and customers created or
 * edited inline. Rendered on the light, high-contrast admin shell.
 */
export function CustomersPage() {
  const { data: isAdmin, isLoading: roleLoading } = useIsAdmin();
  const { login, loginStatus } = useInternetIdentity();

  if (roleLoading) {
    return (
      <AdminShell>
        <AdminLoadingState
          data-ocid="admin.customers.loading_state"
          label="Checking access…"
        />
      </AdminShell>
    );
  }

  if (!isAdmin) {
    return (
      <AdminShell>
        <AdminEmptyState
          data-ocid="admin.customers.access_denied"
          icon={<ShieldAlert className="size-6" />}
          title="Admin access required"
          description="Sign in with an administrator identity to open the customer directory."
          action={
            loginStatus !== "success" ? (
              <AdminButton
                data-ocid="admin.customers.login_button"
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

  return <CustomerDirectory />;
}

/* ------------------------------------------------------------------ */
/* Directory                                                           */
/* ------------------------------------------------------------------ */

/**
 * Whether the dashboard's "+ New Customer" quick action opened this page.
 *
 * Read straight from `window.location.search` so the quick action works on the
 * plain `/admin/customers` route without a `validateSearch` contract.
 */
function openedForNewCustomer(): boolean {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("new") === "1";
}

function CustomerDirectory() {
  const [term, setTerm] = useState("");
  const [includeArchived, setIncludeArchived] = useState(false);
  const [editing, setEditing] = useState<CustomerSummary | null>(null);
  const [creating, setCreating] = useState(openedForNewCustomer);

  const trimmed = term.trim();
  const isSearching = trimmed.length > 0;

  // The search query owns the list while a term is present; the plain
  // directory query (with its archived toggle) owns it otherwise.
  const directoryQuery = useCustomers(includeArchived);
  const searchQuery = useCustomerSearch(trimmed);

  const activeQuery = isSearching ? searchQuery : directoryQuery;
  const customers = useMemo(() => activeQuery.data ?? [], [activeQuery.data]);

  const exportCsv = useExportCustomersCsv();
  const [exportError, setExportError] = useState<string | null>(null);

  const handleExport = () => {
    setExportError(null);
    exportCsv.mutate(undefined, {
      onSuccess: (csv) => {
        downloadCustomersCsv(csv);
      },
      onError: () => {
        setExportError("Could not export the directory. Please try again.");
      },
    });
  };

  const activeCount = customers.filter(
    (customer) => customer.status === CustomerStatus.active,
  ).length;
  const totalJobs = customers.reduce(
    (sum, customer) => sum + Number(customer.jobCount),
    0,
  );

  const columns: AdminColumn<CustomerSummary>[] = [
    {
      key: "name",
      header: "Customer",
      cell: (customer) => {
        const name = customerDisplayName(customer);
        return (
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[oklch(var(--admin-surface-alt))] text-sm font-bold text-[oklch(var(--admin-primary))]"
            >
              {customerInitials(name)}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-base font-semibold text-[oklch(var(--admin-foreground))]">
                {name}
              </span>
              <span className="block truncate text-sm text-[oklch(var(--admin-muted-foreground))]">
                #{customer.id.toString()}
              </span>
            </span>
          </div>
        );
      },
    },
    {
      key: "contact",
      header: "Contact",
      cell: (customer) => (
        <div className="flex flex-col gap-1 text-sm">
          {customer.phone && (
            <span className="inline-flex items-center gap-2 text-[oklch(var(--admin-foreground))]">
              <Phone
                aria-hidden="true"
                className="size-4 shrink-0 text-[oklch(var(--admin-muted-foreground))]"
              />
              {customer.phone}
            </span>
          )}
          {customer.email && (
            <span className="inline-flex min-w-0 items-center gap-2 text-[oklch(var(--admin-muted-foreground))]">
              <Mail aria-hidden="true" className="size-4 shrink-0" />
              <span className="truncate">{customer.email}</span>
            </span>
          )}
          {!customer.phone && !customer.email && (
            <span className="text-[oklch(var(--admin-muted-foreground))]">
              No contact on file
            </span>
          )}
        </div>
      ),
    },
    {
      key: "address",
      header: "Service address",
      hideOnMobile: true,
      cell: (customer) =>
        customer.serviceAddress ? (
          <span className="inline-flex min-w-0 items-center gap-2 text-sm text-[oklch(var(--admin-foreground))]">
            <MapPin
              aria-hidden="true"
              className="size-4 shrink-0 text-[oklch(var(--admin-muted-foreground))]"
            />
            <span className="truncate">{customer.serviceAddress}</span>
          </span>
        ) : (
          <span className="text-sm text-[oklch(var(--admin-muted-foreground))]">
            —
          </span>
        ),
    },
    {
      key: "status",
      header: "Status",
      cell: (customer) => {
        const meta = getCustomerStatusMeta(customer.status);
        return (
          <AdminStatusBadge
            tone={CUSTOMER_STATUS_TONE[customer.status]}
            label={meta.label}
            dot
          />
        );
      },
    },
    {
      key: "jobs",
      header: "Jobs",
      align: "right",
      cell: (customer) => (
        <span className="font-mono text-base font-semibold text-[oklch(var(--admin-foreground))]">
          {formatJobCount(customer.jobCount)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      cell: (customer) => (
        <div className="flex items-center justify-end gap-2">
          <AdminButton
            variant="secondary"
            size="sm"
            data-ocid={`admin.customers.edit_button.${customer.id.toString()}`}
            onClick={(event) => {
              event.stopPropagation();
              setEditing(customer);
            }}
          >
            <Pencil className="size-4" />
            Edit
          </AdminButton>
          <Link
            to="/admin/customers/$customerId"
            params={{ customerId: customer.id.toString() }}
            data-ocid={`admin.customers.open_link.${customer.id.toString()}`}
            onClick={(event) => event.stopPropagation()}
            className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[oklch(var(--admin-border-strong))] bg-[oklch(var(--admin-surface))] px-4 text-sm font-semibold text-[oklch(var(--admin-foreground))] transition-smooth hover:bg-[oklch(var(--admin-surface-alt))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(var(--admin-ring))] focus-visible:ring-offset-2"
          >
            Open
          </Link>
        </div>
      ),
    },
  ];

  return (
    <AdminShell>
      <AdminPageHeader
        eyebrow="Admin"
        title="Customers"
        description="Every customer is kept as a permanent record, matched on email and phone so returning neighbors are recognized instead of duplicated."
        actions={
          <>
            <AdminButton
              variant="secondary"
              data-ocid="admin.customers.export_button"
              onClick={handleExport}
              disabled={exportCsv.isPending}
            >
              <Download className="size-4" />
              {exportCsv.isPending ? "Exporting…" : "Export CSV"}
            </AdminButton>
            <AdminButton
              data-ocid="admin.customers.new_customer_button"
              onClick={() => setCreating(true)}
            >
              <UserPlus className="size-4" />
              New customer
            </AdminButton>
          </>
        }
      />

      {exportError && (
        <p
          data-ocid="admin.customers.export_error"
          role="alert"
          className="mb-4 rounded-xl border border-[oklch(var(--admin-status-action))] bg-[oklch(var(--admin-surface))] px-4 py-3 text-base font-medium text-[oklch(var(--admin-status-action))]"
        >
          {exportError}
        </p>
      )}

      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        <AdminStatCard
          data-ocid="admin.customers.stat_total"
          label="Customers"
          value={String(customers.length)}
          icon={<Users className="size-5" />}
        />
        <AdminStatCard
          data-ocid="admin.customers.stat_active"
          label="Active"
          value={String(activeCount)}
        />
        <AdminStatCard
          data-ocid="admin.customers.stat_jobs"
          label="Jobs served"
          value={String(totalJobs)}
          className="col-span-2 lg:col-span-1"
        />
      </div>

      <AdminCard>
        <AdminCardHeader
          title="Customer directory"
          description={
            isSearching
              ? `Results for “${trimmed}”`
              : "Search by name, phone, email, customer id or service address."
          }
        />

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <AdminField
            label="Search customers"
            htmlFor="admin-customer-search"
            className="w-full sm:max-w-md"
          >
            <div className="relative">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[oklch(var(--admin-muted-foreground))]"
              />
              <AdminInput
                id="admin-customer-search"
                type="search"
                data-ocid="admin.customers.search_input"
                value={term}
                onChange={(event) => setTerm(event.target.value)}
                placeholder="Name, phone, email or address"
                className="pl-9 pr-10"
              />
              {isSearching && (
                <button
                  type="button"
                  data-ocid="admin.customers.search_clear_button"
                  aria-label="Clear search"
                  onClick={() => setTerm("")}
                  className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-[oklch(var(--admin-muted-foreground))] transition-smooth hover:bg-[oklch(var(--admin-surface-alt))] hover:text-[oklch(var(--admin-foreground))]"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          </AdminField>

          <label
            htmlFor="admin-customer-archived"
            className="inline-flex min-h-11 cursor-pointer select-none items-center gap-2 text-base font-semibold text-[oklch(var(--admin-foreground))]"
          >
            <input
              id="admin-customer-archived"
              type="checkbox"
              data-ocid="admin.customers.include_archived_toggle"
              checked={includeArchived}
              onChange={(event) => setIncludeArchived(event.target.checked)}
              className="size-5 accent-[oklch(var(--admin-primary))]"
            />
            Include archived
          </label>
        </div>

        {activeQuery.isLoading ? (
          <AdminLoadingState
            data-ocid="admin.customers.loading_state"
            label="Opening the directory…"
          />
        ) : activeQuery.isError ? (
          <AdminErrorState
            data-ocid="admin.customers.error_state"
            message="The directory could not be loaded. Please try again."
            onRetry={() => void activeQuery.refetch()}
          />
        ) : (
          <AdminDataTable
            data-ocid="admin.customers.table"
            caption="Customer directory"
            columns={columns}
            rows={customers}
            rowKey={(customer) => customer.id.toString()}
            empty={
              <AdminEmptyState
                data-ocid="admin.customers.empty_state"
                icon={<Users className="size-6" />}
                title={
                  isSearching ? "No matching customers" : "No customers yet"
                }
                description={
                  isSearching
                    ? "Try a different name, phone number, email or address."
                    : "Add your first customer to start building the hive's directory."
                }
                action={
                  !isSearching ? (
                    <AdminButton
                      data-ocid="admin.customers.empty_new_customer_button"
                      onClick={() => setCreating(true)}
                    >
                      <UserPlus className="size-4" />
                      Add first customer
                    </AdminButton>
                  ) : undefined
                }
              />
            }
          />
        )}
      </AdminCard>

      {creating && <CustomerFormDialog onClose={() => setCreating(false)} />}
      {editing && (
        <CustomerFormDialog
          customer={editing}
          onClose={() => setEditing(null)}
        />
      )}
    </AdminShell>
  );
}

/* ------------------------------------------------------------------ */
/* Create / edit dialog                                                */
/* ------------------------------------------------------------------ */

interface CustomerFormDialogProps {
  /** Present when editing an existing customer; absent when creating. */
  customer?: CustomerSummary;
  onClose: () => void;
}

/**
 * Create or edit a customer.
 *
 * Fields are grouped into identity, contact and address so entry stays quick,
 * and every field is a large, clearly labeled admin control. Preferred contact
 * is a dropdown; the customer lifecycle status is managed from the profile.
 */
function CustomerFormDialog({ customer, onClose }: CustomerFormDialogProps) {
  const isEditing = customer !== undefined;
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();

  const [draft, setDraft] = useState<CustomerInput>(() =>
    customer
      ? {
          fullName: customer.fullName,
          phone: customer.phone,
          email: customer.email,
          serviceAddress: customer.serviceAddress,
          preferredContact: PreferredContact.phone,
        }
      : EMPTY_DRAFT,
  );
  const [error, setError] = useState<string | null>(null);

  const isPending = createCustomer.isPending || updateCustomer.isPending;

  const update = <K extends keyof CustomerInput>(
    key: K,
    value: CustomerInput[K],
  ) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setError(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const input: CustomerInput = {
      fullName: draft.fullName.trim(),
      phone: draft.phone.trim(),
      email: draft.email.trim(),
      serviceAddress: draft.serviceAddress.trim(),
      preferredContact: draft.preferredContact,
    };

    if (input.fullName.length === 0) {
      setError("A customer name is required.");
      return;
    }
    if (input.phone.length === 0 && input.email.length === 0) {
      setError("Add at least a phone number or an email address.");
      return;
    }

    const onSuccess = (result: { __kind__: string; err?: unknown }) => {
      if (result.__kind__ === "ok") {
        onClose();
        return;
      }
      const err = result.err as
        | { __kind__: string; invalidInput?: string }
        | undefined;
      setError(
        err?.__kind__ === "invalidInput" && err.invalidInput
          ? err.invalidInput
          : "The customer could not be saved. Please try again.",
      );
    };
    const onError = () => {
      setError("The customer could not be saved. Please try again.");
    };

    if (isEditing && customer) {
      updateCustomer.mutate({ id: customer.id, input }, { onSuccess, onError });
    } else {
      createCustomer.mutate(input, { onSuccess, onError });
    }
  };

  return (
    <dialog
      open
      data-ocid="admin.customers.form_modal"
      aria-labelledby="admin-customer-form-title"
      className="fixed inset-0 z-50 m-0 flex h-full max-h-none w-full max-w-none items-center justify-center border-0 bg-transparent p-4"
    >
      <button
        type="button"
        aria-label="Close dialog"
        data-ocid="admin.customers.form_dismiss_button"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-[oklch(0.2_0.012_260_/_0.55)]"
      />
      <div className="admin-shell relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface))] p-5 shadow-admin sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2
              id="admin-customer-form-title"
              className="text-xl font-bold text-[oklch(var(--admin-foreground))]"
            >
              {isEditing ? "Edit customer" : "New customer"}
            </h2>
            <p className="mt-1 text-base text-[oklch(var(--admin-muted-foreground))]">
              {isEditing
                ? "Update this customer's contact details."
                : "Add a neighbor to the hive's directory."}
            </p>
          </div>
          <button
            type="button"
            data-ocid="admin.customers.form_close_button"
            aria-label="Close"
            onClick={onClose}
            className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[oklch(var(--admin-border-strong))] bg-[oklch(var(--admin-surface))] text-[oklch(var(--admin-foreground))] transition-smooth hover:bg-[oklch(var(--admin-surface-alt))]"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <AdminField label="Full name" htmlFor="admin-customer-name">
            <AdminInput
              id="admin-customer-name"
              data-ocid="admin.customers.name_input"
              value={draft.fullName}
              onChange={(event) => update("fullName", event.target.value)}
              placeholder="Ada Lovelace"
              autoComplete="name"
            />
          </AdminField>

          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="Phone" htmlFor="admin-customer-phone">
              <AdminInput
                id="admin-customer-phone"
                data-ocid="admin.customers.phone_input"
                type="tel"
                inputMode="tel"
                value={draft.phone}
                onChange={(event) => update("phone", event.target.value)}
                placeholder="405-555-0123"
                autoComplete="tel"
              />
            </AdminField>
            <AdminField label="Email" htmlFor="admin-customer-email">
              <AdminInput
                id="admin-customer-email"
                data-ocid="admin.customers.email_input"
                type="email"
                value={draft.email}
                onChange={(event) => update("email", event.target.value)}
                placeholder="ada@example.com"
                autoComplete="email"
              />
            </AdminField>
          </div>

          <AdminField
            label="Preferred contact method"
            htmlFor="admin-customer-contact"
          >
            <AdminSelect
              id="admin-customer-contact"
              data-ocid="admin.customers.preferred_contact_select"
              value={draft.preferredContact}
              onChange={(event) =>
                update(
                  "preferredContact",
                  event.target.value as PreferredContact,
                )
              }
            >
              {PREFERRED_CONTACTS.map((contact) => (
                <option key={contact} value={contact}>
                  {getPreferredContactMeta(contact).label}
                </option>
              ))}
            </AdminSelect>
          </AdminField>

          <AdminField
            label="Service address"
            htmlFor="admin-customer-address"
            hint="Where the work happens — used to match returning customers."
          >
            <AdminInput
              id="admin-customer-address"
              data-ocid="admin.customers.address_input"
              value={draft.serviceAddress}
              onChange={(event) => update("serviceAddress", event.target.value)}
              placeholder="123 Honeycomb Lane"
              autoComplete="street-address"
            />
          </AdminField>

          {error && (
            <p
              data-ocid="admin.customers.form_error"
              role="alert"
              className="rounded-xl border border-[oklch(var(--admin-status-action))] bg-[oklch(var(--admin-surface))] px-4 py-3 text-base font-medium text-[oklch(var(--admin-status-action))]"
            >
              {error}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <AdminButton
              variant="secondary"
              data-ocid="admin.customers.form_cancel_button"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </AdminButton>
            <AdminButton
              type="submit"
              data-ocid="admin.customers.form_submit_button"
              disabled={isPending}
            >
              {isPending
                ? "Saving…"
                : isEditing
                  ? "Save changes"
                  : "Add customer"}
            </AdminButton>
          </div>
        </form>
      </div>
    </dialog>
  );
}
