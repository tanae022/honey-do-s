import type { PaymentMethod, PaymentSettings } from "@/backend";
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
import { useSetPaymentSettings, useSettings } from "@/hooks/useAdminSettings";
import { PAYMENT_METHODS, paymentMethodLabel } from "@/lib/admin";
import {
  CASHAPP_HANDLE,
  CHIME_HANDLE,
  PAYPAL_ACCOUNT,
  VENMO_HANDLE,
} from "@/lib/jobs";
import { useEffect, useState } from "react";

interface PaymentDraft {
  cashAppHandle: string;
  venmoHandle: string;
  payPalHandle: string;
  chimeHandle: string;
  acceptedMethods: PaymentMethod[];
}

/**
 * Payment settings: the owner's payment handles and accepted methods.
 *
 * The handles are the owner's own supplied payment information — the form is
 * seeded from the saved settings and falls back to the owner's known handles,
 * and it never invents or changes a handle on its own.
 */
export function PaymentSettingsSection() {
  const settingsQuery = useSettings();
  const setPayment = useSetPaymentSettings();

  const [draft, setDraft] = useState<PaymentDraft | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const savedPayment = settingsQuery.data?.payment;

  useEffect(() => {
    if (!initialized && savedPayment) {
      setDraft({
        cashAppHandle: savedPayment.cashAppHandle || CASHAPP_HANDLE,
        venmoHandle: savedPayment.venmoHandle || VENMO_HANDLE,
        payPalHandle: savedPayment.payPalHandle || PAYPAL_ACCOUNT,
        chimeHandle: savedPayment.chimeHandle || CHIME_HANDLE,
        acceptedMethods:
          savedPayment.acceptedMethods.length > 0
            ? savedPayment.acceptedMethods
            : PAYMENT_METHODS,
      });
      setInitialized(true);
    }
  }, [initialized, savedPayment]);

  const toggleMethod = (method: PaymentMethod, checked: boolean) => {
    setDraft((current) => {
      if (!current) return current;
      const next = checked
        ? [...current.acceptedMethods, method]
        : current.acceptedMethods.filter((item) => item !== method);
      return { ...current, acceptedMethods: next };
    });
  };

  const handleSave = () => {
    if (!draft) return;
    setSaved(false);
    setError(null);
    const settings: PaymentSettings = {
      cashAppHandle: draft.cashAppHandle.trim(),
      venmoHandle: draft.venmoHandle.trim(),
      payPalHandle: draft.payPalHandle.trim(),
      chimeHandle: draft.chimeHandle.trim(),
      acceptedMethods: draft.acceptedMethods,
    };
    setPayment.mutate(settings, {
      onSuccess: (result) => {
        if (result.__kind__ === "ok") {
          setDraft({
            cashAppHandle: result.ok.cashAppHandle || CASHAPP_HANDLE,
            venmoHandle: result.ok.venmoHandle || VENMO_HANDLE,
            payPalHandle: result.ok.payPalHandle || PAYPAL_ACCOUNT,
            chimeHandle: result.ok.chimeHandle || CHIME_HANDLE,
            acceptedMethods:
              result.ok.acceptedMethods.length > 0
                ? result.ok.acceptedMethods
                : PAYMENT_METHODS,
          });
          setSaved(true);
        } else {
          setError(
            result.err.__kind__ === "invalidInput"
              ? result.err.invalidInput
              : "We couldn't save the payment settings. Please try again.",
          );
        }
      },
      onError: () => {
        setError("We couldn't save the payment settings. Please try again.");
      },
    });
  };

  return (
    <AdminCard data-ocid="admin.settings.payment.card">
      <AdminCardHeader
        title="Payment"
        description="The payment handles customers use and the methods you accept."
        action={
          saved ? (
            <AdminChip data-ocid="admin.settings.payment.saved_chip">
              Saved
            </AdminChip>
          ) : undefined
        }
      />

      {settingsQuery.isLoading ? (
        <AdminLoadingState
          data-ocid="admin.settings.payment.loading_state"
          label="Loading payment settings…"
        />
      ) : settingsQuery.isError || !draft ? (
        <AdminErrorState
          data-ocid="admin.settings.payment.error_state"
          message="We couldn't load the payment settings."
          onRetry={() => void settingsQuery.refetch()}
        />
      ) : (
        <div className="flex flex-col gap-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="Cash App" htmlFor="payment-cashapp">
              <AdminInput
                id="payment-cashapp"
                data-ocid="admin.settings.payment.cashapp_input"
                placeholder="$thebirdhouse2"
                value={draft.cashAppHandle}
                onChange={(event) =>
                  setDraft((current) =>
                    current
                      ? { ...current, cashAppHandle: event.target.value }
                      : current,
                  )
                }
              />
            </AdminField>
            <AdminField label="Venmo" htmlFor="payment-venmo">
              <AdminInput
                id="payment-venmo"
                data-ocid="admin.settings.payment.venmo_input"
                placeholder="@Lavona-Wright"
                value={draft.venmoHandle}
                onChange={(event) =>
                  setDraft((current) =>
                    current
                      ? { ...current, venmoHandle: event.target.value }
                      : current,
                  )
                }
              />
            </AdminField>
            <AdminField label="PayPal" htmlFor="payment-paypal">
              <AdminInput
                id="payment-paypal"
                data-ocid="admin.settings.payment.paypal_input"
                placeholder="tanae Wright"
                value={draft.payPalHandle}
                onChange={(event) =>
                  setDraft((current) =>
                    current
                      ? { ...current, payPalHandle: event.target.value }
                      : current,
                  )
                }
              />
            </AdminField>
            <AdminField label="Chime" htmlFor="payment-chime">
              <AdminInput
                id="payment-chime"
                data-ocid="admin.settings.payment.chime_input"
                placeholder="$Tanae-Wright-2"
                value={draft.chimeHandle}
                onChange={(event) =>
                  setDraft((current) =>
                    current
                      ? { ...current, chimeHandle: event.target.value }
                      : current,
                  )
                }
              />
            </AdminField>
          </div>

          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-[oklch(var(--admin-foreground))]">
              Accepted methods
            </legend>
            <div className="flex flex-wrap gap-3">
              {PAYMENT_METHODS.map((method) => {
                const checked = draft.acceptedMethods.includes(method);
                return (
                  <label
                    key={method}
                    htmlFor={`payment-method-${method}`}
                    className="flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface))] px-3 text-base font-medium text-[oklch(var(--admin-foreground))]"
                  >
                    <input
                      id={`payment-method-${method}`}
                      data-ocid={`admin.settings.payment.method_checkbox.${method}`}
                      type="checkbox"
                      className="size-5 accent-[oklch(var(--admin-primary))]"
                      checked={checked}
                      onChange={(event) =>
                        toggleMethod(method, event.target.checked)
                      }
                    />
                    {paymentMethodLabel(method)}
                  </label>
                );
              })}
            </div>
          </fieldset>

          {error && (
            <p
              role="alert"
              data-ocid="admin.settings.payment.form_error"
              className="text-sm font-medium text-[oklch(var(--admin-status-action))]"
            >
              {error}
            </p>
          )}

          <div>
            <AdminButton
              data-ocid="admin.settings.payment.save_button"
              disabled={setPayment.isPending}
              onClick={handleSave}
            >
              {setPayment.isPending ? "Saving…" : "Save payment settings"}
            </AdminButton>
          </div>
        </div>
      )}
    </AdminCard>
  );
}
