import type { TaxSetting } from "@/backend";
import {
  AdminButton,
  AdminCard,
  AdminCardHeader,
  AdminChip,
  AdminErrorState,
  AdminField,
  AdminInput,
  AdminLoadingState,
} from "@/components/admin";
import { useSetTaxSetting, useSettings } from "@/hooks/useAdminSettings";
import { useEffect, useState } from "react";

/**
 * Tax settings: whether tax is charged and at what rate.
 *
 * The rate is a whole percent applied to the adjusted subtotal. Turning tax off
 * keeps the saved rate so the owner can switch it back on without retyping it.
 */
export function TaxSettingsSection() {
  const settingsQuery = useSettings();
  const setTax = useSetTaxSetting();

  const [enabled, setEnabled] = useState(true);
  const [rate, setRate] = useState("");
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const savedTax = settingsQuery.data?.tax;

  useEffect(() => {
    if (!initialized && savedTax) {
      setEnabled(savedTax.enabled);
      setRate(`${Number(savedTax.ratePercent)}`);
      setInitialized(true);
    }
  }, [initialized, savedTax]);

  const handleSave = () => {
    setSaved(false);
    const value = Number(rate.trim());
    if (!Number.isFinite(value) || value < 0 || value > 100) {
      setError("Enter a tax rate between 0 and 100.");
      return;
    }
    setError(null);
    const setting: TaxSetting = {
      enabled,
      ratePercent: BigInt(Math.round(value)),
    };
    setTax.mutate(setting, {
      onSuccess: (result) => {
        if (result.__kind__ === "ok") {
          setEnabled(result.ok.enabled);
          setRate(`${Number(result.ok.ratePercent)}`);
          setSaved(true);
        } else {
          setError(
            result.err.__kind__ === "invalidInput"
              ? result.err.invalidInput
              : "We couldn't save the tax setting. Please try again.",
          );
        }
      },
      onError: () => {
        setError("We couldn't save the tax setting. Please try again.");
      },
    });
  };

  return (
    <AdminCard data-ocid="admin.settings.tax.card">
      <AdminCardHeader
        title="Tax"
        description="Whether tax is charged and at what rate."
        action={
          saved ? (
            <AdminChip data-ocid="admin.settings.tax.saved_chip">
              Saved
            </AdminChip>
          ) : undefined
        }
      />

      {settingsQuery.isLoading ? (
        <AdminLoadingState
          data-ocid="admin.settings.tax.loading_state"
          label="Loading tax setting…"
        />
      ) : settingsQuery.isError ? (
        <AdminErrorState
          data-ocid="admin.settings.tax.error_state"
          message="We couldn't load the tax setting."
          onRetry={() => void settingsQuery.refetch()}
        />
      ) : (
        <div className="flex flex-col gap-4">
          <label
            htmlFor="tax-enabled"
            className="flex min-h-11 cursor-pointer items-center gap-2 text-base font-semibold text-[oklch(var(--admin-foreground))]"
          >
            <input
              id="tax-enabled"
              data-ocid="admin.settings.tax.enabled_checkbox"
              type="checkbox"
              className="size-5 accent-[oklch(var(--admin-primary))]"
              checked={enabled}
              onChange={(event) => setEnabled(event.target.checked)}
            />
            Charge tax on quotes
          </label>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <AdminField
              label="Tax rate"
              htmlFor="tax-rate"
              error={error}
              hint="A whole percent, e.g. 8.5 for 8.5%."
              className="sm:max-w-xs"
            >
              <AdminInput
                id="tax-rate"
                data-ocid="admin.settings.tax.rate_input"
                type="number"
                min="0"
                max="100"
                step="0.01"
                inputMode="decimal"
                placeholder="8.5"
                value={rate}
                onChange={(event) => setRate(event.target.value)}
              />
            </AdminField>
            <AdminButton
              data-ocid="admin.settings.tax.save_button"
              disabled={setTax.isPending}
              onClick={handleSave}
              className="sm:w-auto"
            >
              {setTax.isPending ? "Saving…" : "Save tax"}
            </AdminButton>
          </div>
        </div>
      )}
    </AdminCard>
  );
}
