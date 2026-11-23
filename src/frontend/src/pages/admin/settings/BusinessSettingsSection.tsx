import type { BusinessSettings } from "@/backend";
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
import { useSetBusinessSettings, useSettings } from "@/hooks/useAdminSettings";
import { useEffect, useState } from "react";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Business settings: the name, email, phone and address shown to customers.
 *
 * These details appear on quotes, emails and the customer-facing pages, so the
 * owner keeps them accurate here.
 */
export function BusinessSettingsSection() {
  const settingsQuery = useSettings();
  const setBusiness = useSetBusinessSettings();

  const [draft, setDraft] = useState<BusinessSettings | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const savedBusiness = settingsQuery.data?.business;

  useEffect(() => {
    if (!initialized && savedBusiness) {
      setDraft(savedBusiness);
      setInitialized(true);
    }
  }, [initialized, savedBusiness]);

  const handleSave = () => {
    if (!draft) return;
    setSaved(false);
    const name = draft.businessName.trim();
    const email = draft.businessEmail.trim();
    if (name.length === 0) {
      setError("Enter the business name.");
      return;
    }
    if (email.length > 0 && !EMAIL_PATTERN.test(email)) {
      setError("Enter a valid business email address.");
      return;
    }
    setError(null);
    const setting: BusinessSettings = {
      businessName: name,
      businessEmail: email,
      businessPhone: draft.businessPhone.trim(),
      businessAddress: draft.businessAddress.trim(),
    };
    setBusiness.mutate(setting, {
      onSuccess: (result) => {
        if (result.__kind__ === "ok") {
          setDraft(result.ok);
          setSaved(true);
        } else {
          setError(
            result.err.__kind__ === "invalidInput"
              ? result.err.invalidInput
              : "We couldn't save the business details. Please try again.",
          );
        }
      },
      onError: () => {
        setError("We couldn't save the business details. Please try again.");
      },
    });
  };

  return (
    <AdminCard data-ocid="admin.settings.business.card">
      <AdminCardHeader
        title="Business"
        description="The details customers see on quotes and emails."
        action={
          saved ? (
            <AdminChip data-ocid="admin.settings.business.saved_chip">
              Saved
            </AdminChip>
          ) : undefined
        }
      />

      {settingsQuery.isLoading ? (
        <AdminLoadingState
          data-ocid="admin.settings.business.loading_state"
          label="Loading business details…"
        />
      ) : settingsQuery.isError || !draft ? (
        <AdminErrorState
          data-ocid="admin.settings.business.error_state"
          message="We couldn't load the business details."
          onRetry={() => void settingsQuery.refetch()}
        />
      ) : (
        <div className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="Business name" htmlFor="business-name">
              <AdminInput
                id="business-name"
                data-ocid="admin.settings.business.name_input"
                placeholder="Honey Do's"
                value={draft.businessName}
                onChange={(event) =>
                  setDraft((current) =>
                    current
                      ? { ...current, businessName: event.target.value }
                      : current,
                  )
                }
              />
            </AdminField>
            <AdminField label="Business email" htmlFor="business-email">
              <AdminInput
                id="business-email"
                data-ocid="admin.settings.business.email_input"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="hello@honeydos.com"
                value={draft.businessEmail}
                onChange={(event) =>
                  setDraft((current) =>
                    current
                      ? { ...current, businessEmail: event.target.value }
                      : current,
                  )
                }
              />
            </AdminField>
            <AdminField label="Business phone" htmlFor="business-phone">
              <AdminInput
                id="business-phone"
                data-ocid="admin.settings.business.phone_input"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="(405) 312-4987"
                value={draft.businessPhone}
                onChange={(event) =>
                  setDraft((current) =>
                    current
                      ? { ...current, businessPhone: event.target.value }
                      : current,
                  )
                }
              />
            </AdminField>
          </div>

          <AdminField label="Business address" htmlFor="business-address">
            <AdminTextarea
              id="business-address"
              data-ocid="admin.settings.business.address_input"
              placeholder="123 Main St, Oklahoma City, OK 73102"
              value={draft.businessAddress}
              onChange={(event) =>
                setDraft((current) =>
                  current
                    ? { ...current, businessAddress: event.target.value }
                    : current,
                )
              }
            />
          </AdminField>

          {error && (
            <p
              role="alert"
              data-ocid="admin.settings.business.form_error"
              className="text-sm font-medium text-[oklch(var(--admin-status-action))]"
            >
              {error}
            </p>
          )}

          <div>
            <AdminButton
              data-ocid="admin.settings.business.save_button"
              disabled={setBusiness.isPending}
              onClick={handleSave}
            >
              {setBusiness.isPending ? "Saving…" : "Save business details"}
            </AdminButton>
          </div>
        </div>
      )}
    </AdminCard>
  );
}
