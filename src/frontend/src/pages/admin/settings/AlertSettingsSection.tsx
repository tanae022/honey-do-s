import type { AdminSettings, ChannelResult } from "@/backend";
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
import { useSetAdminSettings, useSettings } from "@/hooks/useAdminSettings";
import { customerKeys } from "@/hooks/useCustomers";
import {
  useOwnerAlertEmail,
  useOwnerAlertPhone,
  useSendTestAlert,
  useSetOwnerAlertEmail,
  useSetOwnerAlertPhone,
  useTwilioConfigStatus,
} from "@/hooks/useJobs";
import { SettingsToggleRow } from "@/pages/admin/settings/SettingsToggleRow";
import { useQueryClient } from "@tanstack/react-query";
import {
  BadgeCheck,
  BellRing,
  Mail,
  MessageSquare,
  Volume2,
} from "lucide-react";
import { type ReactNode, useCallback, useEffect, useState } from "react";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** The five alert preferences, in display order. */
const ALERT_TOGGLES: {
  key: keyof AdminSettings;
  label: string;
  description: string;
}[] = [
  {
    key: "customerRequestAlerts",
    label: "Customer request alerts",
    description: "Alert me the moment a new service request comes in.",
  },
  {
    key: "notificationSound",
    label: "Notification sound",
    description: "Play a ding when a new request arrives.",
  },
  {
    key: "pushNotifications",
    label: "Push notifications",
    description: "Show in-app notifications for new activity.",
  },
  {
    key: "appointmentReminders",
    label: "Appointment reminders",
    description: "Remind me about upcoming appointments.",
  },
  {
    key: "messageAlerts",
    label: "Message alerts",
    description: "Alert me when a customer sends a message.",
  },
];

type ChannelOutcome = { kind: "sent" } | { kind: "failed"; message: string };

/* ------------------------------------------------------------------ */
/* Ding — a short two-note chime for the TEST ALERT sound check.       */
/* ------------------------------------------------------------------ */

type AudioContextCtor = typeof AudioContext;

function resolveAudioContextCtor(): AudioContextCtor | null {
  if (typeof window === "undefined") return null;
  const scoped = globalThis as typeof globalThis & {
    webkitAudioContext?: AudioContextCtor;
  };
  return scoped.AudioContext ?? scoped.webkitAudioContext ?? null;
}

function playTestDing(): void {
  const Ctor = resolveAudioContextCtor();
  if (!Ctor) return;
  let ctx: AudioContext;
  try {
    ctx = new Ctor();
  } catch {
    return;
  }
  const start = ctx.currentTime;
  for (const note of [
    { at: 0, freq: 880 },
    { at: 0.14, freq: 1318.5 },
  ]) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(note.freq, start + note.at);
    gain.gain.setValueAtTime(0.0001, start + note.at);
    gain.gain.exponentialRampToValueAtTime(0.16, start + note.at + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + note.at + 0.32);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start + note.at);
    osc.stop(start + note.at + 0.36);
  }
  window.setTimeout(() => void ctx.close().catch(() => undefined), 700);
}

/**
 * Alert preferences, the TEST ALERT action and the owner alert contacts.
 *
 * The toggles save the whole `AdminSettings` bundle. TEST ALERT verifies the
 * three owner-facing signals at once: the in-app notification panel, the unread
 * badge (by refreshing the notification queries) and the sound.
 */
export function AlertSettingsSection() {
  const settingsQuery = useSettings();
  const setAdminSettings = useSetAdminSettings();
  const queryClient = useQueryClient();

  const [draft, setDraft] = useState<AdminSettings | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [testOutcome, setTestOutcome] = useState<{
    email: ChannelOutcome;
    sms: ChannelOutcome;
  } | null>(null);
  const [testError, setTestError] = useState<string | null>(null);
  const [badgeChecked, setBadgeChecked] = useState(false);

  const savedAdmin = settingsQuery.data?.admin;

  // Seed the editable draft once from the saved bundle. Never overwrite a
  // draft the owner is already editing on a later refetch.
  useEffect(() => {
    if (!initialized && savedAdmin) {
      setDraft(savedAdmin);
      setInitialized(true);
    }
  }, [initialized, savedAdmin]);

  const persist = useCallback(
    (next: AdminSettings) => {
      setDraft(next);
      setSaved(false);
      setSaveError(null);
      setAdminSettings.mutate(next, {
        onSuccess: (result) => {
          if (result.__kind__ === "ok") {
            setDraft(result.ok);
            setSaved(true);
          } else {
            setSaveError(
              result.err.__kind__ === "invalidInput"
                ? result.err.invalidInput
                : "We couldn't save your alert preferences. Please try again.",
            );
          }
        },
        onError: () => {
          setSaveError(
            "We couldn't save your alert preferences. Please try again.",
          );
        },
      });
    },
    [setAdminSettings],
  );

  const handleToggle = (key: keyof AdminSettings, checked: boolean) => {
    if (!draft) return;
    persist({ ...draft, [key]: checked });
  };

  const sendTest = useSendTestAlert();

  const handleTestAlert = () => {
    setTestOutcome(null);
    setTestError(null);
    setBadgeChecked(false);

    // Sound: play the ding immediately so the owner hears the alert.
    playTestDing();

    // Badge: refresh the notification queries so the unread badge updates.
    void queryClient.invalidateQueries({
      queryKey: customerKeys.unreadCount(),
    });
    void queryClient.invalidateQueries({
      queryKey: customerKeys.notifications(),
    });
    setBadgeChecked(true);

    sendTest.mutate(undefined, {
      onSuccess: (result) => {
        setTestOutcome({
          email: toOutcome(result.email),
          sms: toOutcome(result.sms),
        });
      },
      onError: () => {
        setTestError("We couldn't send the test alert. Please try again.");
      },
    });
  };

  if (settingsQuery.isLoading) {
    return (
      <AdminCard>
        <AdminCardHeader
          title="Alerts & notifications"
          description="Choose what the app alerts you about."
        />
        <AdminLoadingState
          data-ocid="admin.settings.alerts.loading_state"
          label="Loading alert preferences…"
        />
      </AdminCard>
    );
  }

  if (settingsQuery.isError || !draft) {
    return (
      <AdminCard>
        <AdminCardHeader
          title="Alerts & notifications"
          description="Choose what the app alerts you about."
        />
        <AdminErrorState
          data-ocid="admin.settings.alerts.error_state"
          message="We couldn't load your alert preferences."
          onRetry={() => void settingsQuery.refetch()}
        />
      </AdminCard>
    );
  }

  return (
    <AdminCard data-ocid="admin.settings.alerts.card">
      <AdminCardHeader
        title="Alerts & notifications"
        description="Choose what the app alerts you about. Changes save as you toggle."
        action={
          saved ? (
            <AdminChip data-ocid="admin.settings.alerts.saved_chip">
              Saved
            </AdminChip>
          ) : undefined
        }
      />

      <div className="flex flex-col gap-3">
        {ALERT_TOGGLES.map((toggle) => (
          <SettingsToggleRow
            key={toggle.key}
            id={`alert-${toggle.key}`}
            data-ocid={`admin.settings.alerts.${toggle.key}_toggle`}
            label={toggle.label}
            description={toggle.description}
            checked={draft[toggle.key]}
            disabled={setAdminSettings.isPending}
            onCheckedChange={(checked) => handleToggle(toggle.key, checked)}
          />
        ))}
      </div>

      {saveError && (
        <p
          role="alert"
          data-ocid="admin.settings.alerts.save_error"
          className="mt-3 text-sm font-medium text-[oklch(var(--admin-status-action))]"
        >
          {saveError}
        </p>
      )}

      <div className="mt-5 rounded-xl border border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface-alt))] p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-base font-semibold text-[oklch(var(--admin-foreground))]">
              Test alert
            </p>
            <p className="mt-0.5 text-sm text-[oklch(var(--admin-muted-foreground))]">
              Verifies the in-app notification, the unread badge and the sound.
            </p>
          </div>
          <AdminButton
            data-ocid="admin.settings.test_alert_button"
            disabled={sendTest.isPending}
            onClick={handleTestAlert}
            className="sm:w-auto"
          >
            <BellRing className="size-4" />
            {sendTest.isPending ? "Testing…" : "Test alert"}
          </AdminButton>
        </div>

        <ul className="mt-4 grid gap-2 sm:grid-cols-3">
          <TestSignalRow
            ocid="admin.settings.test_alert.notification_result"
            icon={<BellRing className="size-4" />}
            label="Notification"
            state={badgeChecked ? "ok" : "idle"}
            detail={
              badgeChecked ? "In-app notification shown." : "Not tested yet."
            }
          />
          <TestSignalRow
            ocid="admin.settings.test_alert.badge_result"
            icon={<BadgeCheck className="size-4" />}
            label="Unread badge"
            state={badgeChecked ? "ok" : "idle"}
            detail={badgeChecked ? "Badge refreshed." : "Not tested yet."}
          />
          <TestSignalRow
            ocid="admin.settings.test_alert.sound_result"
            icon={<Volume2 className="size-4" />}
            label="Sound"
            state={badgeChecked ? "ok" : "idle"}
            detail={badgeChecked ? "Ding played." : "Not tested yet."}
          />
        </ul>

        {testOutcome && (
          <ul
            data-ocid="admin.settings.test_alert.channel_results"
            className="mt-3 grid gap-2 sm:grid-cols-2"
          >
            <ChannelResultRow
              ocid="admin.settings.test_alert.email_result"
              icon={<Mail className="size-4" />}
              label="Email"
              outcome={testOutcome.email}
            />
            <ChannelResultRow
              ocid="admin.settings.test_alert.sms_result"
              icon={<MessageSquare className="size-4" />}
              label="Text"
              outcome={testOutcome.sms}
            />
          </ul>
        )}

        {testError && (
          <p
            role="alert"
            data-ocid="admin.settings.test_alert.error"
            className="mt-3 text-sm font-medium text-[oklch(var(--admin-status-action))]"
          >
            {testError}
          </p>
        )}
      </div>

      <OwnerAlertContacts />
    </AdminCard>
  );
}

function toOutcome(result: ChannelResult): ChannelOutcome {
  return result.__kind__ === "sent"
    ? { kind: "sent" }
    : { kind: "failed", message: result.failed };
}

function TestSignalRow({
  ocid,
  icon,
  label,
  state,
  detail,
}: {
  ocid: string;
  icon: ReactNode;
  label: string;
  state: "idle" | "ok";
  detail: string;
}) {
  const ok = state === "ok";
  return (
    <li
      data-ocid={ocid}
      className={
        ok
          ? "flex items-start gap-2 rounded-lg border border-[oklch(var(--admin-status-paid))] bg-[oklch(var(--admin-status-paid))]/10 p-3 text-sm text-[oklch(var(--admin-foreground))]"
          : "flex items-start gap-2 rounded-lg border border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface))] p-3 text-sm text-[oklch(var(--admin-muted-foreground))]"
      }
    >
      <span className="mt-0.5 shrink-0">{icon}</span>
      <span className="min-w-0">
        <span className="block font-semibold text-[oklch(var(--admin-foreground))]">
          {label}
        </span>
        {detail}
      </span>
    </li>
  );
}

function ChannelResultRow({
  ocid,
  icon,
  label,
  outcome,
}: {
  ocid: string;
  icon: ReactNode;
  label: string;
  outcome: ChannelOutcome;
}) {
  const sent = outcome.kind === "sent";
  return (
    <li
      data-ocid={ocid}
      className={
        sent
          ? "flex items-start gap-2 rounded-lg border border-[oklch(var(--admin-status-paid))] bg-[oklch(var(--admin-status-paid))]/10 p-3 text-sm text-[oklch(var(--admin-foreground))]"
          : "flex items-start gap-2 rounded-lg border border-[oklch(var(--admin-status-action))] bg-[oklch(var(--admin-status-action))]/10 p-3 text-sm text-[oklch(var(--admin-foreground))]"
      }
    >
      <span className="mt-0.5 shrink-0">{icon}</span>
      <span className="min-w-0">
        <span className="font-semibold">{label}: </span>
        {sent ? "sent." : outcome.message}
      </span>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* Owner alert contacts — the saved email and phone that receive alerts */
/* ------------------------------------------------------------------ */

function OwnerAlertContacts() {
  const emailQuery = useOwnerAlertEmail();
  const phoneQuery = useOwnerAlertPhone();
  const twilioQuery = useTwilioConfigStatus();
  const setEmail = useSetOwnerAlertEmail();
  const setPhone = useSetOwnerAlertPhone();

  const [emailDraft, setEmailDraft] = useState("");
  const [emailInitialized, setEmailInitialized] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSaved, setEmailSaved] = useState(false);

  const [phoneDraft, setPhoneDraft] = useState("");
  const [phoneInitialized, setPhoneInitialized] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [phoneSaved, setPhoneSaved] = useState(false);

  const savedEmail = emailQuery.data ?? "";
  const savedPhone = phoneQuery.data ?? "";
  const twilioConfigured = twilioQuery.data?.configured === true;

  useEffect(() => {
    if (!emailInitialized && emailQuery.isSuccess) {
      setEmailDraft(savedEmail);
      setEmailInitialized(true);
    }
  }, [emailInitialized, emailQuery.isSuccess, savedEmail]);

  useEffect(() => {
    if (!phoneInitialized && phoneQuery.isSuccess) {
      setPhoneDraft(savedPhone);
      setPhoneInitialized(true);
    }
  }, [phoneInitialized, phoneQuery.isSuccess, savedPhone]);

  const handleSaveEmail = () => {
    const next = emailDraft.trim();
    setEmailSaved(false);
    if (next.length === 0) {
      setEmailError("Enter the email address that should receive alerts.");
      return;
    }
    if (!EMAIL_PATTERN.test(next)) {
      setEmailError("Enter a valid email address, like owner@example.com.");
      return;
    }
    setEmailError(null);
    setEmail.mutate(next, {
      onSuccess: (result) => {
        if (result.__kind__ === "ok") {
          setEmailDraft(result.ok);
          setEmailSaved(true);
        } else {
          setEmailError(
            result.err.__kind__ === "invalidEmail"
              ? result.err.invalidEmail
              : "We couldn't save that address. Please try again.",
          );
        }
      },
      onError: () => {
        setEmailError("We couldn't save that address. Please try again.");
      },
    });
  };

  const handleSavePhone = () => {
    const next = phoneDraft.trim();
    setPhoneSaved(false);
    if (next.length === 0) {
      setPhoneError("Enter the phone number that should receive texts.");
      return;
    }
    setPhoneError(null);
    setPhone.mutate(next, {
      onSuccess: (result) => {
        if (result.__kind__ === "ok") {
          setPhoneDraft(result.ok);
          setPhoneSaved(true);
        } else {
          setPhoneError(
            result.err.__kind__ === "invalidPhone"
              ? result.err.invalidPhone
              : "We couldn't save that number. Please try again.",
          );
        }
      },
      onError: () => {
        setPhoneError("We couldn't save that number. Please try again.");
      },
    });
  };

  return (
    <div
      data-ocid="admin.settings.owner_alert.panel"
      className="mt-5 rounded-xl border border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface))] p-4"
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <h3 className="text-base font-bold text-[oklch(var(--admin-foreground))]">
          Owner alert contacts
        </h3>
        <AdminChip
          data-ocid="admin.settings.owner_alert.email_chip"
          className={
            savedEmail
              ? "border-[oklch(var(--admin-status-paid))] text-[oklch(var(--admin-status-paid))]"
              : undefined
          }
        >
          Email {savedEmail ? "configured" : "not set"}
        </AdminChip>
        <AdminChip
          data-ocid="admin.settings.owner_alert.phone_chip"
          className={
            twilioConfigured && savedPhone
              ? "border-[oklch(var(--admin-status-paid))] text-[oklch(var(--admin-status-paid))]"
              : undefined
          }
        >
          Text {twilioConfigured && savedPhone ? "configured" : "not set"}
        </AdminChip>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <AdminField
            label="Alert email"
            htmlFor="owner-alert-email"
            error={emailError}
          >
            <AdminInput
              id="owner-alert-email"
              data-ocid="admin.settings.owner_alert.email_input"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="owner@example.com"
              value={emailDraft}
              onChange={(event) => setEmailDraft(event.target.value)}
            />
          </AdminField>
          <AdminButton
            variant="secondary"
            data-ocid="admin.settings.owner_alert.email_save_button"
            disabled={setEmail.isPending}
            onClick={handleSaveEmail}
          >
            {setEmail.isPending
              ? "Saving…"
              : emailSaved
                ? "Saved"
                : "Save email"}
          </AdminButton>
        </div>

        <div className="flex flex-col gap-2">
          <AdminField
            label="Alert phone"
            htmlFor="owner-alert-phone"
            error={phoneError}
            hint={
              twilioConfigured
                ? undefined
                : "Text alerts need the messaging service configured."
            }
          >
            <AdminInput
              id="owner-alert-phone"
              data-ocid="admin.settings.owner_alert.phone_input"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="(405) 312-4987"
              value={phoneDraft}
              onChange={(event) => setPhoneDraft(event.target.value)}
            />
          </AdminField>
          <AdminButton
            variant="secondary"
            data-ocid="admin.settings.owner_alert.phone_save_button"
            disabled={setPhone.isPending}
            onClick={handleSavePhone}
          >
            {setPhone.isPending
              ? "Saving…"
              : phoneSaved
                ? "Saved"
                : "Save phone"}
          </AdminButton>
        </div>
      </div>
    </div>
  );
}
