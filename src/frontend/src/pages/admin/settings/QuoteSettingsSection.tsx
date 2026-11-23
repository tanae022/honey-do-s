import type { QuoteSettings } from "@/backend";
import {
  AdminButton,
  AdminCard,
  AdminCardHeader,
  AdminChip,
  AdminErrorState,
  AdminField,
  AdminInput,
  AdminLoadingState,
  AdminTextarea,
} from "@/components/admin";
import { useSetQuoteSettings, useSettings } from "@/hooks/useAdminSettings";
import { useEffect, useState } from "react";

/**
 * Quote settings: the default validity window and the terms shown on quotes.
 *
 * The validity is a whole number of days a quote stays open; the terms are the
 * standard wording printed on every quote the owner sends.
 */
export function QuoteSettingsSection() {
  const settingsQuery = useSettings();
  const setQuote = useSetQuoteSettings();

  const [validityDays, setValidityDays] = useState("");
  const [terms, setTerms] = useState("");
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const savedQuote = settingsQuery.data?.quote;

  useEffect(() => {
    if (!initialized && savedQuote) {
      setValidityDays(`${Number(savedQuote.validityDays)}`);
      setTerms(savedQuote.terms);
      setInitialized(true);
    }
  }, [initialized, savedQuote]);

  const handleSave = () => {
    setSaved(false);
    const days = Number(validityDays.trim());
    if (!Number.isFinite(days) || days < 1 || days > 365) {
      setError("Enter a validity between 1 and 365 days.");
      return;
    }
    setError(null);
    const setting: QuoteSettings = {
      validityDays: BigInt(Math.round(days)),
      terms: terms.trim(),
    };
    setQuote.mutate(setting, {
      onSuccess: (result) => {
        if (result.__kind__ === "ok") {
          setValidityDays(`${Number(result.ok.validityDays)}`);
          setTerms(result.ok.terms);
          setSaved(true);
        } else {
          setError(
            result.err.__kind__ === "invalidInput"
              ? result.err.invalidInput
              : "We couldn't save the quote settings. Please try again.",
          );
        }
      },
      onError: () => {
        setError("We couldn't save the quote settings. Please try again.");
      },
    });
  };

  return (
    <AdminCard data-ocid="admin.settings.quote.card">
      <AdminCardHeader
        title="Quotes"
        description="How long a quote stays open and the terms printed on it."
        action={
          saved ? (
            <AdminChip data-ocid="admin.settings.quote.saved_chip">
              Saved
            </AdminChip>
          ) : undefined
        }
      />

      {settingsQuery.isLoading ? (
        <AdminLoadingState
          data-ocid="admin.settings.quote.loading_state"
          label="Loading quote settings…"
        />
      ) : settingsQuery.isError ? (
        <AdminErrorState
          data-ocid="admin.settings.quote.error_state"
          message="We couldn't load the quote settings."
          onRetry={() => void settingsQuery.refetch()}
        />
      ) : (
        <div className="flex flex-col gap-4">
          <AdminField
            label="Validity (days)"
            htmlFor="quote-validity"
            error={error}
            hint="How many days a quote stays open before it expires."
            className="sm:max-w-xs"
          >
            <AdminInput
              id="quote-validity"
              data-ocid="admin.settings.quote.validity_input"
              type="number"
              min="1"
              max="365"
              step="1"
              inputMode="numeric"
              placeholder="30"
              value={validityDays}
              onChange={(event) => setValidityDays(event.target.value)}
            />
          </AdminField>

          <AdminField
            label="Quote terms"
            htmlFor="quote-terms"
            hint="Standard wording shown on every quote."
          >
            <AdminTextarea
              id="quote-terms"
              data-ocid="admin.settings.quote.terms_input"
              placeholder="Deposit is due before scheduling. Remaining balance is due on completion."
              value={terms}
              onChange={(event) => setTerms(event.target.value)}
            />
          </AdminField>

          <div>
            <AdminButton
              data-ocid="admin.settings.quote.save_button"
              disabled={setQuote.isPending}
              onClick={handleSave}
            >
              {setQuote.isPending ? "Saving…" : "Save quote settings"}
            </AdminButton>
          </div>
        </div>
      )}
    </AdminCard>
  );
}
