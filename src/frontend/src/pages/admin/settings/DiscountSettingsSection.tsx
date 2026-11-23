import {
  type DiscountEligibility,
  type DiscountId,
  type DiscountKind,
  type DiscountRule,
  type DiscountRuleInput,
  DiscountEligibility as Eligibility,
  DiscountKind as Kind,
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
  AdminSelect,
  AdminStatusBadge,
} from "@/components/admin";
import {
  useCreateDiscount,
  useDeleteDiscount,
  useDiscounts,
  useSetDiscountActive,
  useUpdateDiscount,
} from "@/hooks/useAdminSettings";
import {
  discountEligibilityLabel,
  discountKindLabel,
  discountValueLabel,
} from "@/lib/admin";
import { formatDate, formatMoney, timestampToDate } from "@/lib/jobs";
import { BadgePercent, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

/** Eligibility options in display order. */
const ELIGIBILITY_OPTIONS: DiscountEligibility[] = [
  Eligibility.all,
  Eligibility.returningCustomer,
  Eligibility.ownParts,
];

interface DiscountDraft {
  name: string;
  kind: DiscountKind;
  /** Percentage as a whole number, or fixed amount in dollars. */
  value: string;
  active: boolean;
  startAt: string;
  endAt: string;
  eligibility: DiscountEligibility;
  minPurchase: string;
  maxDiscount: string;
}

const EMPTY_DRAFT: DiscountDraft = {
  name: "",
  kind: Kind.percentage,
  value: "",
  active: true,
  startAt: "",
  endAt: "",
  eligibility: Eligibility.all,
  minPurchase: "",
  maxDiscount: "",
};

/** Convert a `YYYY-MM-DD` date input value to a nanosecond Timestamp. */
function dateInputToTimestamp(value: string): bigint | undefined {
  if (value.trim().length === 0) return undefined;
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return undefined;
  return BigInt(date.getTime()) * 1_000_000n;
}

/** Convert a nanosecond Timestamp to a `YYYY-MM-DD` date input value. */
function timestampToDateInput(timestamp: bigint | undefined): string {
  if (timestamp === undefined) return "";
  const date = timestampToDate(timestamp);
  if (!date) return "";
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Parse a dollar string into whole cents, or null when invalid. */
function dollarsToCents(value: string): bigint | null {
  const trimmed = value.trim();
  if (trimmed.length === 0) return 0n;
  const amount = Number(trimmed);
  if (!Number.isFinite(amount) || amount < 0) return null;
  return BigInt(Math.round(amount * 100));
}

function draftFromRule(rule: DiscountRule): DiscountDraft {
  return {
    name: rule.name,
    kind: rule.kind,
    value:
      rule.kind === Kind.percentage
        ? `${Number(rule.value)}`
        : `${Number(rule.value) / 100}`,
    active: rule.active,
    startAt: timestampToDateInput(rule.startAt),
    endAt: timestampToDateInput(rule.endAt),
    eligibility: rule.eligibility,
    minPurchase:
      rule.minPurchase > 0n ? `${Number(rule.minPurchase) / 100}` : "",
    maxDiscount:
      rule.maxDiscount > 0n ? `${Number(rule.maxDiscount) / 100}` : "",
  };
}

/**
 * Discount settings: create, edit, activate and remove discount rules.
 *
 * The owner sets a name, a percentage or fixed amount, an active flag, an
 * optional start and end date, an eligibility rule, a minimum purchase and a
 * maximum discount. Each saved rule can be turned on or off from the list.
 */
export function DiscountSettingsSection() {
  const discountsQuery = useDiscounts();
  const createDiscount = useCreateDiscount();
  const updateDiscount = useUpdateDiscount();
  const setActive = useSetDiscountActive();
  const deleteDiscount = useDeleteDiscount();

  const [draft, setDraft] = useState<DiscountDraft>(EMPTY_DRAFT);
  const [editingId, setEditingId] = useState<DiscountId | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<DiscountRule | null>(null);

  const rules = discountsQuery.data ?? [];
  const isSaving = createDiscount.isPending || updateDiscount.isPending;

  const resetForm = () => {
    setDraft(EMPTY_DRAFT);
    setEditingId(null);
    setFormError(null);
  };

  const handleEdit = (rule: DiscountRule) => {
    setDraft(draftFromRule(rule));
    setEditingId(rule.id);
    setFormError(null);
  };

  const handleSubmit = () => {
    const name = draft.name.trim();
    if (name.length === 0) {
      setFormError("Give the discount a name.");
      return;
    }

    const value = Number(draft.value.trim());
    if (!Number.isFinite(value) || value <= 0) {
      setFormError(
        draft.kind === Kind.percentage
          ? "Enter a percentage greater than zero."
          : "Enter an amount greater than zero.",
      );
      return;
    }

    const minPurchase = dollarsToCents(draft.minPurchase);
    const maxDiscount = dollarsToCents(draft.maxDiscount);
    if (minPurchase === null || maxDiscount === null) {
      setFormError(
        "Minimum purchase and maximum discount must be valid amounts.",
      );
      return;
    }

    const startAt = dateInputToTimestamp(draft.startAt);
    const endAt = dateInputToTimestamp(draft.endAt);
    if (startAt !== undefined && endAt !== undefined && endAt < startAt) {
      setFormError("The end date must be on or after the start date.");
      return;
    }

    const input: DiscountRuleInput = {
      name,
      kind: draft.kind,
      value:
        draft.kind === Kind.percentage
          ? BigInt(Math.round(value))
          : BigInt(Math.round(value * 100)),
      active: draft.active,
      eligibility: draft.eligibility,
      minPurchase,
      maxDiscount,
      startAt,
      endAt,
    };

    setFormError(null);
    if (editingId !== null) {
      updateDiscount.mutate(
        { id: editingId, input },
        { onSuccess: () => resetForm() },
      );
    } else {
      createDiscount.mutate(input, { onSuccess: () => resetForm() });
    }
  };

  const columns: AdminColumn<DiscountRule>[] = [
    {
      key: "name",
      header: "Discount",
      cell: (rule) => (
        <div className="min-w-0">
          <span className="block font-semibold text-[oklch(var(--admin-foreground))]">
            {rule.name}
          </span>
          <span className="block text-sm text-[oklch(var(--admin-muted-foreground))]">
            {discountEligibilityLabel(rule.eligibility)}
          </span>
        </div>
      ),
    },
    {
      key: "value",
      header: "Value",
      cell: (rule) => (
        <span className="font-mono font-semibold">
          {discountValueLabel(rule)}
        </span>
      ),
    },
    {
      key: "kind",
      header: "Type",
      hideOnMobile: true,
      cell: (rule) => discountKindLabel(rule.kind),
    },
    {
      key: "window",
      header: "Dates",
      hideOnMobile: true,
      cell: (rule) => (
        <span className="text-sm text-[oklch(var(--admin-muted-foreground))]">
          {rule.startAt !== undefined || rule.endAt !== undefined
            ? `${rule.startAt !== undefined ? formatDate(rule.startAt) : "Any"} – ${
                rule.endAt !== undefined ? formatDate(rule.endAt) : "Any"
              }`
            : "Always on"}
        </span>
      ),
    },
    {
      key: "limits",
      header: "Limits",
      hideOnMobile: true,
      cell: (rule) => (
        <span className="text-sm text-[oklch(var(--admin-muted-foreground))]">
          {rule.minPurchase > 0n
            ? `Min ${formatMoney(rule.minPurchase)}`
            : "No minimum"}
          {rule.maxDiscount > 0n
            ? ` · Max ${formatMoney(rule.maxDiscount)}`
            : ""}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (rule) => (
        <AdminStatusBadge
          tone={rule.active ? "paid" : "cancelled"}
          label={rule.active ? "Active" : "Inactive"}
          dot
        />
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      cell: (rule) => (
        <div className="flex flex-wrap items-center justify-end gap-2">
          <AdminButton
            variant="secondary"
            size="sm"
            data-ocid={`admin.settings.discounts.toggle_button.${rule.id}`}
            disabled={setActive.isPending}
            onClick={() =>
              setActive.mutate({ id: rule.id, active: !rule.active })
            }
          >
            {rule.active ? "Turn off" : "Turn on"}
          </AdminButton>
          <AdminButton
            variant="secondary"
            size="sm"
            data-ocid={`admin.settings.discounts.edit_button.${rule.id}`}
            onClick={() => handleEdit(rule)}
          >
            <Pencil className="size-4" />
            Edit
          </AdminButton>
          <AdminButton
            variant="danger"
            size="sm"
            data-ocid={`admin.settings.discounts.delete_button.${rule.id}`}
            onClick={() => setPendingDelete(rule)}
          >
            <Trash2 className="size-4" />
            Delete
          </AdminButton>
        </div>
      ),
    },
  ];

  return (
    <AdminCard data-ocid="admin.settings.discounts.card">
      <AdminCardHeader
        title="Discounts"
        description="Create and manage the discounts customers can receive."
        action={
          <AdminChip data-ocid="admin.settings.discounts.count_chip">
            {rules.length} {rules.length === 1 ? "rule" : "rules"}
          </AdminChip>
        }
      />

      <div className="rounded-xl border border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface-alt))] p-4">
        <h3 className="mb-3 text-base font-bold text-[oklch(var(--admin-foreground))]">
          {editingId !== null ? "Edit discount" : "New discount"}
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <AdminField label="Name" htmlFor="discount-name">
            <AdminInput
              id="discount-name"
              data-ocid="admin.settings.discounts.name_input"
              placeholder="Returning customer 10%"
              value={draft.name}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
            />
          </AdminField>

          <AdminField label="Type" htmlFor="discount-kind">
            <AdminSelect
              id="discount-kind"
              data-ocid="admin.settings.discounts.kind_select"
              value={draft.kind}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  kind: event.target.value as DiscountKind,
                }))
              }
            >
              <option value={Kind.percentage}>Percentage off</option>
              <option value={Kind.fixed}>Fixed amount off</option>
            </AdminSelect>
          </AdminField>

          <AdminField
            label={draft.kind === Kind.percentage ? "Percentage" : "Amount"}
            htmlFor="discount-value"
            hint={
              draft.kind === Kind.percentage
                ? "Whole percent, e.g. 10 for 10%."
                : "Dollar amount, e.g. 25 for $25.00."
            }
          >
            <AdminInput
              id="discount-value"
              data-ocid="admin.settings.discounts.value_input"
              type="number"
              min="0"
              step={draft.kind === Kind.percentage ? "1" : "0.01"}
              inputMode="decimal"
              placeholder={draft.kind === Kind.percentage ? "10" : "25.00"}
              value={draft.value}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  value: event.target.value,
                }))
              }
            />
          </AdminField>

          <AdminField label="Eligibility" htmlFor="discount-eligibility">
            <AdminSelect
              id="discount-eligibility"
              data-ocid="admin.settings.discounts.eligibility_select"
              value={draft.eligibility}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  eligibility: event.target.value as DiscountEligibility,
                }))
              }
            >
              {ELIGIBILITY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {discountEligibilityLabel(option)}
                </option>
              ))}
            </AdminSelect>
          </AdminField>

          <AdminField
            label="Start date"
            htmlFor="discount-start"
            hint="Optional."
          >
            <AdminInput
              id="discount-start"
              data-ocid="admin.settings.discounts.start_input"
              type="date"
              value={draft.startAt}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  startAt: event.target.value,
                }))
              }
            />
          </AdminField>

          <AdminField label="End date" htmlFor="discount-end" hint="Optional.">
            <AdminInput
              id="discount-end"
              data-ocid="admin.settings.discounts.end_input"
              type="date"
              value={draft.endAt}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  endAt: event.target.value,
                }))
              }
            />
          </AdminField>

          <AdminField
            label="Minimum purchase"
            htmlFor="discount-min"
            hint="Optional. Dollars."
          >
            <AdminInput
              id="discount-min"
              data-ocid="admin.settings.discounts.min_input"
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              placeholder="0.00"
              value={draft.minPurchase}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  minPurchase: event.target.value,
                }))
              }
            />
          </AdminField>

          <AdminField
            label="Maximum discount"
            htmlFor="discount-max"
            hint="Optional. Dollars."
          >
            <AdminInput
              id="discount-max"
              data-ocid="admin.settings.discounts.max_input"
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              placeholder="0.00"
              value={draft.maxDiscount}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  maxDiscount: event.target.value,
                }))
              }
            />
          </AdminField>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label
            htmlFor="discount-active"
            className="flex min-h-11 cursor-pointer items-center gap-2 text-base font-semibold text-[oklch(var(--admin-foreground))]"
          >
            <input
              id="discount-active"
              data-ocid="admin.settings.discounts.active_checkbox"
              type="checkbox"
              className="size-5 accent-[oklch(var(--admin-primary))]"
              checked={draft.active}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  active: event.target.checked,
                }))
              }
            />
            Active
          </label>
        </div>

        {formError && (
          <p
            role="alert"
            data-ocid="admin.settings.discounts.form_error"
            className="mt-3 text-sm font-medium text-[oklch(var(--admin-status-action))]"
          >
            {formError}
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <AdminButton
            data-ocid="admin.settings.discounts.save_button"
            disabled={isSaving}
            onClick={handleSubmit}
          >
            <Plus className="size-4" />
            {isSaving
              ? "Saving…"
              : editingId !== null
                ? "Save changes"
                : "Create discount"}
          </AdminButton>
          {editingId !== null && (
            <AdminButton
              variant="secondary"
              data-ocid="admin.settings.discounts.cancel_button"
              onClick={resetForm}
            >
              Cancel
            </AdminButton>
          )}
        </div>
      </div>

      <div className="mt-5">
        {discountsQuery.isLoading ? (
          <AdminLoadingState
            data-ocid="admin.settings.discounts.loading_state"
            label="Loading discounts…"
          />
        ) : discountsQuery.isError ? (
          <AdminErrorState
            data-ocid="admin.settings.discounts.error_state"
            message="We couldn't load your discounts."
            onRetry={() => void discountsQuery.refetch()}
          />
        ) : (
          <AdminDataTable
            data-ocid="admin.settings.discounts.table"
            caption="Discount rules"
            columns={columns}
            rows={rules}
            rowKey={(rule) => rule.id.toString()}
            empty={
              <AdminEmptyState
                data-ocid="admin.settings.discounts.empty_state"
                icon={<BadgePercent className="size-6" />}
                title="No discounts yet"
                description="Create your first discount above and it will appear here."
              />
            }
          />
        )}
      </div>

      <AdminConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
        title="Delete this discount?"
        description={
          pendingDelete
            ? `"${pendingDelete.name}" will be removed permanently.`
            : undefined
        }
        confirmLabel="Delete discount"
        destructive
        isPending={deleteDiscount.isPending}
        onConfirm={() => {
          if (pendingDelete === null) return;
          deleteDiscount.mutate(pendingDelete.id, {
            onSuccess: () => setPendingDelete(null),
          });
        }}
      />
    </AdminCard>
  );
}
