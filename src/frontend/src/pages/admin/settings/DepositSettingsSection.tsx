import type { DepositSetting } from "@/backend";
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
import { useSetDepositSetting, useSettings } from "@/hooks/useAdminSettings";
import { useEffect, useState } from "react";

/**
 * Deposit settings: the percentage of the quote collected up front.
 *
 * The deposit is a whole percent of the accepted quote total. The owner sets
 * it here and the customer-facing deposit amount follows it.
 */
export function DepositSettingsSection() {
  const settingsQuery = useSettings();
  const setDeposit = useSetDepositSetting();

  const [percent, setPercent] = useState("");
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const savedDeposit = settingsQuery.data?.deposit;

  useEffect(() => {
    if (!initialized && savedDeposit) {
      setPercent(`${Number(savedDeposit.percent)}`);
      setInitialized(true);
    }
  }, [initialized, savedDeposit]);

  const handleSave = () => {
    setSaved(false);
    const value = Number(percent.trim());
    if (!Number.isFinite(value) || value < 0 || value > 100) {
      setError("Enter a deposit percentage between 0 and 100.");
      return;
    }
    setError(null);
    const setting: DepositSetting = { percent: BigInt(Math.round(value)) };
    setDeposit.mutate(setting, {
      onSuccess: (result) => {
        if (result.__kind__ === "ok") {
          setPercent(`${Number(result.ok.percent)}`);
          setSaved(true);
        } else {
          setError(
            result.err.__kind__ === "invalidInput"
              ? result.err.invalidInput
              : "We couldn't save the deposit setting. Please try again.",
          );
        }
      },
      onError: () => {
        setError("We couldn't save the deposit setting. Please try again.");
      },
    });
  };

  return (
    <AdminCard data-ocid="admin.settings.deposit.card">
      <AdminCardHeader
        title="Deposit"
        description="The percentage of the quote collected up front."
        action={
          saved ? (
            <AdminChip data-ocid="admin.settings.deposit.saved_chip">
              Saved
            </AdminChip>
          ) : undefined
        }
      />

      {settingsQuery.isLoading ? (
        <AdminLoadingState
          data-ocid="admin.settings.deposit.loading_state"
          label="Loading deposit setting…"
        />
      ) : settingsQuery.isError ? (
        <AdminErrorState
          data-ocid="admin.settings.deposit.error_state"
          message="We couldn't load the deposit setting."
          onRetry={() => void settingsQuery.refetch()}
        />
      ) : (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <AdminField
            label="Deposit percentage"
            htmlFor="deposit-percent"
            error={error}
            hint="A whole percent, e.g. 10 for a 10% deposit."
            className="sm:max-w-xs"
          >
            <AdminInput
              id="deposit-percent"
              data-ocid="admin.settings.deposit.percent_input"
              type="number"
              min="0"
              max="100"
              step="1"
              inputMode="numeric"
              placeholder="10"
              value={percent}
              onChange={(event) => setPercent(event.target.value)}
            />
          </AdminField>
          <AdminButton
            data-ocid="admin.settings.deposit.save_button"
            disabled={setDeposit.isPending}
            onClick={handleSave}
            className="sm:w-auto"
          >
            {setDeposit.isPending ? "Saving…" : "Save deposit"}
          </AdminButton>
        </div>
      )}
    </AdminCard>
  );
}
