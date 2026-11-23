import { HoneyButton } from "@/components/honey/HoneyButton";
import { HoneyCard, HoneyCardHeader } from "@/components/honey/HoneyCard";
import { HoneyLoader } from "@/components/honey/HoneyLoader";
import { Label } from "@/components/ui/label";
import {
  useCreateCustomer,
  useCustomerSearch,
  useCustomers,
  useExportCustomersCsv,
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
import { cn } from "@/lib/utils";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Link } from "@tanstack/react-router";
import {
  Download,
  LogIn,
  Mail,
  MapPin,
  Phone,
  Search,
  ShieldAlert,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { type FormEvent, useMemo, useState } from "react";

/** Status chip classes keyed by lifecycle status. */
const STATUS_CHIP_CLASS: Record<CustomerStatus, string> = {
  [CustomerStatus.active]: "status-chip-active",
  [CustomerStatus.inactive]: "status-chip-paused",
  [CustomerStatus.archived]: "status-chip-archived",
};

/**
 * Light-backed form field treatment.
 *
 * Customer entry happens on the dark honeycomb background, so every editable
 * field sits on a warm ivory surface with dark chocolate text. The 48px
 * minimum height keeps targets comfortable for thumb entry on mobile, and the
 * gold focus ring keeps keyboard focus obvious against the light surface.
 */
const LIGHT_FIELD_CLASS =
  "min-h-12 w-full rounded-lg border border-[oklch(0.78_0.05_82)] bg-[oklch(0.965_0.018_92)] px-3.5 py-2.5 text-base font-medium text-[oklch(0.22_0.025_66)] shadow-[inset_0_1px_2px_oklch(0.4_0.03_70_/_0.18)] outline-none transition-smooth placeholder:font-normal placeholder:text-[oklch(0.52_0.03_72)] focus-visible:border-[oklch(0.72_0.16_76)] focus-visible:ring-[3px] focus-visible:ring-[oklch(0.79_0.175_76_/_0.45)]";

const EMPTY_DRAFT: CustomerInput = {
  fullName: "",
  phone: "",
  email: "",
  serviceAddress: "",
  preferredContact: PreferredContact.phone,
};

/**
 * Admin customer directory.
 *
 * A searchable list of every customer the hive has served, matched on name,
 * phone, email, id and service address. Each row links to the customer's full
 * profile; the directory can be exported as CSV and new customers added inline.
 */
export function CustomersPage() {
  const { data: isAdmin, isLoading: roleLoading } = useIsAdmin();
  const { login, loginStatus } = useInternetIdentity();

  if (roleLoading) {
    return (
      <div className="px-5 py-16 sm:px-8">
        <HoneyCard className="mx-auto max-w-md">
          <HoneyLoader
            data-ocid="customers.loading_state"
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
          <h1 className="text-outline-black-strong mt-5 font-display text-2xl font-bold text-foreground">
            Admin access required
          </h1>
          <p className="text-outline-black mt-3 text-sm text-muted-foreground">
            Sign in with an administrator identity to open the customer
            directory.
          </p>
          {loginStatus !== "success" && (
            <HoneyButton
              data-ocid="customers.login_button"
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

  return <CustomerDirectory />;
}

function CustomerDirectory() {
  const [term, setTerm] = useState("");
  const [includeArchived, setIncludeArchived] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

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

  const isLoading = activeQuery.isLoading;
  const isError = activeQuery.isError;

  return (
    <div
      data-ocid="customers.page"
      className="animate-page-enter mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14"
    >
      <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Admin
          </p>
          <h1 className="text-outline-black-strong mt-2 font-display text-3xl font-bold text-gold-gradient sm:text-4xl">
            Customers
          </h1>
          <p className="text-outline-black mt-2 max-w-2xl text-sm text-muted-foreground">
            Every customer is kept as a permanent record, matched on email and
            phone so returning neighbors are recognized instead of duplicated.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <HoneyButton
            variant="secondary"
            data-ocid="customers.export_button"
            onClick={handleExport}
            disabled={exportCsv.isPending}
          >
            <Download className="size-4" />
            {exportCsv.isPending ? "Exporting…" : "Export customers"}
          </HoneyButton>
          <HoneyButton
            data-ocid="customers.new_customer_button"
            onClick={() => setDialogOpen(true)}
          >
            <UserPlus className="size-4" />
            New customer
          </HoneyButton>
        </div>
      </header>

      {exportError && (
        <p
          data-ocid="customers.export_error"
          role="alert"
          className="text-outline-black mb-4 rounded-xl border border-destructive/50 bg-destructive/15 px-4 py-3 text-sm text-destructive"
        >
          {exportError}
        </p>
      )}

      <HoneyCard>
        <HoneyCardHeader
          title="Customer directory"
          description={
            isSearching
              ? `Results for “${trimmed}”`
              : "Search by name, phone, email, customer id or service address."
          }
          action={
            <span
              aria-hidden="true"
              className="hex-clip flex size-10 items-center justify-center bg-primary/15 text-primary"
            >
              <Users className="size-5" />
            </span>
          }
        />

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="search-field flex min-h-11 w-full items-center gap-2 rounded-full border border-input px-4 sm:max-w-md">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <input
              type="search"
              data-ocid="customers.search_input"
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              placeholder="Search customers…"
              aria-label="Search customers"
              className="min-w-0 flex-1 bg-transparent py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            {isSearching && (
              <button
                type="button"
                data-ocid="customers.search_clear_button"
                aria-label="Clear search"
                onClick={() => setTerm("")}
                className="flex size-6 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-smooth hover:bg-muted/60 hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          <label className="text-outline-black inline-flex cursor-pointer select-none items-center gap-2 text-sm font-semibold text-muted-foreground">
            <input
              type="checkbox"
              data-ocid="customers.include_archived_toggle"
              checked={includeArchived}
              onChange={(event) => setIncludeArchived(event.target.checked)}
              className="size-4 accent-[oklch(var(--primary))]"
            />
            Include archived
          </label>
        </div>

        {isLoading ? (
          <HoneyLoader
            data-ocid="customers.loading_state"
            label="Opening the directory"
          />
        ) : isError ? (
          <div
            data-ocid="customers.error_state"
            className="flex flex-col items-center gap-3 py-10 text-center"
          >
            <p className="text-outline-black text-sm text-muted-foreground">
              The directory could not be loaded. Please try again.
            </p>
            <HoneyButton
              variant="secondary"
              size="sm"
              data-ocid="customers.retry_button"
              onClick={() => void activeQuery.refetch()}
            >
              Retry
            </HoneyButton>
          </div>
        ) : customers.length === 0 ? (
          <div
            data-ocid="customers.empty_state"
            className="flex flex-col items-center gap-3 py-12 text-center"
          >
            <span className="relative flex size-14 items-center justify-center">
              <span
                aria-hidden="true"
                className="hex-clip absolute inset-0 bg-gradient-to-b from-primary/40 to-primary/10"
              />
              <Users className="relative z-10 size-6 text-primary" />
            </span>
            <h3 className="text-outline-black-strong font-display text-lg font-semibold text-foreground">
              {isSearching ? "No matching customers" : "No customers yet"}
            </h3>
            <p className="text-outline-black max-w-sm text-sm text-muted-foreground">
              {isSearching
                ? "Try a different name, phone number, email or address."
                : "Add your first customer to start building the hive's directory."}
            </p>
            {!isSearching && (
              <HoneyButton
                size="sm"
                data-ocid="customers.empty_new_customer_button"
                onClick={() => setDialogOpen(true)}
              >
                <UserPlus className="size-4" />
                Add first customer
              </HoneyButton>
            )}
          </div>
        ) : (
          <ul data-ocid="customers.list" className="flex flex-col gap-3">
            {customers.map((customer, index) => (
              <CustomerRow
                key={customer.id.toString()}
                customer={customer}
                index={index + 1}
              />
            ))}
          </ul>
        )}
      </HoneyCard>

      {dialogOpen && <NewCustomerDialog onClose={() => setDialogOpen(false)} />}
    </div>
  );
}

interface CustomerRowProps {
  customer: CustomerSummary;
  index: number;
}

function CustomerRow({ customer, index }: CustomerRowProps) {
  const statusMeta = getCustomerStatusMeta(customer.status);
  const name = customerDisplayName(customer);

  return (
    <li>
      <Link
        to="/admin/customers/$customerId"
        params={{ customerId: customer.id.toString() }}
        data-ocid={`customers.row.${index}`}
        className="crm-row group flex items-center gap-4 rounded-2xl border border-border/70 p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <span
          aria-hidden="true"
          className="crm-avatar hex-clip flex size-12 shrink-0 items-center justify-center font-display text-base font-bold text-primary-foreground"
        >
          {customerInitials(name)}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-outline-black-strong truncate font-display text-base font-semibold text-foreground">
              {name}
            </span>
            <span
              data-ocid={`customers.status.${index}`}
              className={cn(
                "text-outline-black inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.14em]",
                STATUS_CHIP_CLASS[customer.status],
              )}
            >
              <span
                aria-hidden="true"
                className="hex-clip size-2 shrink-0 bg-current"
              />
              {statusMeta.label}
            </span>
          </div>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            {customer.phone && (
              <span className="inline-flex items-center gap-1.5">
                <Phone className="size-3.5 shrink-0" />
                {customer.phone}
              </span>
            )}
            {customer.email && (
              <span className="inline-flex min-w-0 items-center gap-1.5">
                <Mail className="size-3.5 shrink-0" />
                <span className="truncate">{customer.email}</span>
              </span>
            )}
            {customer.serviceAddress && (
              <span className="inline-flex min-w-0 items-center gap-1.5">
                <MapPin className="size-3.5 shrink-0" />
                <span className="truncate">{customer.serviceAddress}</span>
              </span>
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className="text-outline-black font-mono text-sm font-semibold text-foreground">
            {formatJobCount(customer.jobCount)}
          </span>
          <span className="text-outline-black text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
            View profile
          </span>
        </div>
      </Link>
    </li>
  );
}

interface NewCustomerDialogProps {
  onClose: () => void;
}

/**
 * Inline new-customer form.
 *
 * Fields are grouped into identity, contact and address so entry stays quick,
 * and every editable field sits on a light-backed surface with dark text sized
 * for comfortable mobile entry. Preferred contact is a dropdown; the customer
 * lifecycle status is managed from the profile, not at creation.
 */
function NewCustomerDialog({ onClose }: NewCustomerDialogProps) {
  const createCustomer = useCreateCustomer();
  const [draft, setDraft] = useState<CustomerInput>(EMPTY_DRAFT);
  const [error, setError] = useState<string | null>(null);

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

    createCustomer.mutate(input, {
      onSuccess: (result) => {
        if (result.__kind__ === "ok") {
          onClose();
          return;
        }
        setError(
          result.err.__kind__ === "invalidInput"
            ? result.err.invalidInput
            : "The customer could not be saved. Please try again.",
        );
      },
      onError: () => {
        setError("The customer could not be saved. Please try again.");
      },
    });
  };

  return (
    <dialog
      open
      data-ocid="customers.new_customer_modal"
      aria-labelledby="new-customer-title"
      className="fixed inset-0 z-50 m-0 flex h-full max-h-none w-full max-w-none items-center justify-center border-0 bg-transparent p-4"
    >
      <button
        type="button"
        aria-label="Close dialog"
        data-ocid="customers.new_customer_close_button"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-sm"
      />
      <div className="honey-panel honey-panel-accent relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl p-6">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2
              id="new-customer-title"
              className="text-outline-black-strong font-display text-xl font-bold text-foreground"
            >
              New customer
            </h2>
            <p className="text-outline-black mt-1 text-sm text-muted-foreground">
              Add a neighbor to the hive&apos;s directory.
            </p>
          </div>
          <button
            type="button"
            data-ocid="customers.new_customer_dismiss_button"
            aria-label="Close"
            onClick={onClose}
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-secondary/60 text-foreground transition-smooth hover:border-primary/50"
          >
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <fieldset className="flex flex-col gap-4">
            <legend className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Identity
            </legend>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="customer-name" className="text-foreground">
                Full name
              </Label>
              <input
                id="customer-name"
                data-ocid="customers.name_input"
                value={draft.fullName}
                onChange={(event) => update("fullName", event.target.value)}
                placeholder="Ada Lovelace"
                autoComplete="name"
                className={LIGHT_FIELD_CLASS}
              />
            </div>
          </fieldset>

          <fieldset className="flex flex-col gap-4">
            <legend className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Contact
            </legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="customer-phone" className="text-foreground">
                  Phone
                </Label>
                <input
                  id="customer-phone"
                  data-ocid="customers.phone_input"
                  type="tel"
                  value={draft.phone}
                  onChange={(event) => update("phone", event.target.value)}
                  placeholder="405-555-0123"
                  autoComplete="tel"
                  inputMode="tel"
                  className={LIGHT_FIELD_CLASS}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="customer-email" className="text-foreground">
                  Email
                </Label>
                <input
                  id="customer-email"
                  data-ocid="customers.email_input"
                  type="email"
                  value={draft.email}
                  onChange={(event) => update("email", event.target.value)}
                  placeholder="ada@example.com"
                  autoComplete="email"
                  className={LIGHT_FIELD_CLASS}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="customer-contact" className="text-foreground">
                Preferred contact method
              </Label>
              <select
                id="customer-contact"
                data-ocid="customers.preferred_contact_select"
                value={draft.preferredContact}
                onChange={(event) =>
                  update(
                    "preferredContact",
                    event.target.value as PreferredContact,
                  )
                }
                className={cn(LIGHT_FIELD_CLASS, "appearance-none pr-10")}
              >
                {PREFERRED_CONTACTS.map((contact) => (
                  <option key={contact} value={contact}>
                    {getPreferredContactMeta(contact).label}
                  </option>
                ))}
              </select>
            </div>
          </fieldset>

          <fieldset className="flex flex-col gap-4">
            <legend className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Service address
            </legend>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="customer-address" className="text-foreground">
                Service address
              </Label>
              <input
                id="customer-address"
                data-ocid="customers.address_input"
                value={draft.serviceAddress}
                onChange={(event) =>
                  update("serviceAddress", event.target.value)
                }
                placeholder="123 Honeycomb Lane"
                autoComplete="street-address"
                className={LIGHT_FIELD_CLASS}
              />
            </div>
          </fieldset>

          {error && (
            <p
              data-ocid="customers.new_customer_error"
              role="alert"
              className="text-outline-black rounded-xl border border-destructive/50 bg-destructive/15 px-3 py-2 text-sm text-destructive"
            >
              {error}
            </p>
          )}

          <div className="mt-1 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <HoneyButton
              variant="secondary"
              data-ocid="customers.new_customer_cancel_button"
              onClick={onClose}
            >
              Cancel
            </HoneyButton>
            <HoneyButton
              type="submit"
              data-ocid="customers.new_customer_submit_button"
              disabled={createCustomer.isPending}
            >
              {createCustomer.isPending ? "Saving…" : "Add customer"}
            </HoneyButton>
          </div>
        </form>
      </div>
    </dialog>
  );
}
