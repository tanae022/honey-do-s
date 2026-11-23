import {
  type BeeInput,
  type BeeView,
  type JobRequestInput,
  type JobRequestView,
  PaymentMethod,
  type StripeConfiguration,
  createActor,
} from "@/backend";
import { CASHAPP_HANDLE, countAwaitingQuote } from "@/lib/jobs";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * How often the admin dashboard re-checks the backend for new requests.
 *
 * Short enough that a freshly submitted request appears without a manual
 * reload, long enough that it never floods the canister.
 */
export const REQUESTS_REFETCH_MS = 15_000;

export const jobKeys = {
  all: ["jobs"] as const,
  list: () => [...jobKeys.all, "list"] as const,
  detail: (id: bigint) => [...jobKeys.all, "detail", id.toString()] as const,
  reference: (code: string) => [...jobKeys.all, "reference", code] as const,
  stats: () => [...jobKeys.all, "stats"] as const,
  role: () => ["role"] as const,
  stripe: () => ["stripe", "configured"] as const,
  ownerAlert: () => ["ownerAlert", "email"] as const,
  ownerAlertPhone: () => ["ownerAlert", "phone"] as const,
  twilio: () => ["twilio", "status"] as const,
  bees: () => ["bees", "list"] as const,
  visitHistory: (code: string) => ["visits", "reference", code] as const,
  customerVisits: (id: bigint) =>
    ["visits", "customer", id.toString()] as const,
  customerMessages: (code: string) => ["messages", "reference", code] as const,
  quoteByReference: (code: string) => ["quote", "reference", code] as const,
};

/* ------------------------------------------------------------------ */
/* Queries                                                             */
/* ------------------------------------------------------------------ */

export function useIsAdmin() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: jobKeys.role(),
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsStripeConfigured() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: jobKeys.stripe(),
    queryFn: async () => {
      if (!actor) return false;
      return actor.isStripeConfigured();
    },
    enabled: !!actor && !isFetching,
  });
}

/** Admin: the owner alert email that receives new-request notifications. */
export function useOwnerAlertEmail() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: jobKeys.ownerAlert(),
    queryFn: async () => {
      if (!actor) return "";
      return actor.getOwnerAlertEmail();
    },
    enabled: !!actor && !isFetching,
  });
}

/** Admin: the owner alert phone number that receives new-request texts. */
export function useOwnerAlertPhone() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: jobKeys.ownerAlertPhone(),
    queryFn: async () => {
      if (!actor) return "";
      return actor.getOwnerAlertPhone();
    },
    enabled: !!actor && !isFetching,
  });
}

/**
 * Admin: whether the Twilio messaging credential is configured and which
 * sending number it uses. Drives the "configured" state of the text channel.
 */
export function useTwilioConfigStatus() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: jobKeys.twilio(),
    queryFn: async () => {
      if (!actor) return { configured: false, fromNumber: "" };
      return actor.getTwilioConfigStatus();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDashboardStats() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: jobKeys.stats(),
    queryFn: async () => {
      if (!actor) return null;
      return actor.getDashboardStats();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: REQUESTS_REFETCH_MS,
    refetchIntervalInBackground: false,
  });
}

export function useJobRequests() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: jobKeys.list(),
    queryFn: async () => {
      if (!actor) return [];
      return actor.listRequests();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: REQUESTS_REFETCH_MS,
    refetchIntervalInBackground: false,
  });
}

/**
 * Admin: how many requests are still awaiting the owner's quote.
 *
 * Shares the request-list query key with `useJobRequests`, so the nav badge and
 * the dashboard read one cached list and one poll. Gated behind `enabled` so a
 * guest never fires the admin-only `listRequests` call.
 */
export function useNewRequestCount(enabled: boolean) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: jobKeys.list(),
    queryFn: async () => {
      if (!actor) return [];
      return actor.listRequests();
    },
    enabled: enabled && !!actor && !isFetching,
    refetchInterval: REQUESTS_REFETCH_MS,
    refetchIntervalInBackground: false,
    select: (jobs) => countAwaitingQuote(jobs),
  });
}

export function useJobRequest(id: bigint | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: jobKeys.detail(id ?? 0n),
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getRequest(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useJobByReference(referenceCode: string) {
  const { actor, isFetching } = useActor(createActor);
  const trimmed = referenceCode.trim();
  return useQuery({
    queryKey: jobKeys.reference(trimmed),
    queryFn: async () => {
      if (!actor || trimmed.length === 0) return null;
      return actor.getRequestByReference(trimmed);
    },
    enabled: !!actor && !isFetching && trimmed.length > 0,
  });
}

/**
 * Guest: the itemized quote for a job reference code, as the emailed link
 * opens it.
 *
 * Backed by `getQuoteByReference`, which returns the same quote record the
 * reference-code lookup shows, with an `expired` flag derived by the backend.
 * Returns `null` when the code is unknown or the job has no quote.
 */
export function useQuoteByReference(referenceCode: string) {
  const { actor, isFetching } = useActor(createActor);
  const trimmed = referenceCode.trim();
  return useQuery({
    queryKey: jobKeys.quoteByReference(trimmed),
    queryFn: async () => {
      if (!actor || trimmed.length === 0) return null;
      return actor.getQuoteByReference(trimmed);
    },
    enabled: !!actor && !isFetching && trimmed.length > 0,
  });
}

/** Admin: every bee (employee) in the hive. */
export function useBees() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: jobKeys.bees(),
    queryFn: async () => {
      if (!actor) return [];
      return actor.listBees();
    },
    enabled: !!actor && !isFetching,
  });
}

/** Guest: newest-first visit history for a job's reference code. */
export function useVisitHistory(referenceCode: string) {
  const { actor, isFetching } = useActor(createActor);
  const trimmed = referenceCode.trim();
  return useQuery({
    queryKey: jobKeys.visitHistory(trimmed),
    queryFn: async () => {
      if (!actor || trimmed.length === 0) return [];
      return actor.getVisitHistory(trimmed);
    },
    enabled: !!actor && !isFetching && trimmed.length > 0,
  });
}

/**
 * Guest: the customer's own message thread for a job reference code.
 *
 * The backend scopes the thread to the reference code, so a customer only ever
 * sees the exchange tied to the job they are tracking.
 */
export function useCustomerMessages(referenceCode: string) {
  const { actor, isFetching } = useActor(createActor);
  const trimmed = referenceCode.trim();
  return useQuery({
    queryKey: jobKeys.customerMessages(trimmed),
    queryFn: async () => {
      if (!actor || trimmed.length === 0) return [];
      return actor.getCustomerMessages(trimmed);
    },
    enabled: !!actor && !isFetching && trimmed.length > 0,
    refetchInterval: REQUESTS_REFETCH_MS,
    refetchIntervalInBackground: false,
  });
}

/** Admin: newest-first visit history for a job request's customer. */
export function useCustomerVisitHistory(id: bigint | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: jobKeys.customerVisits(id ?? 0n),
    queryFn: async () => {
      if (!actor || id === null) return [];
      return actor.getCustomerVisitHistory(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

/* ------------------------------------------------------------------ */
/* Mutations                                                           */
/* ------------------------------------------------------------------ */

export function useSubmitRequest() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: JobRequestInput) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.submitRequest(input);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: jobKeys.all });
    },
  });
}

export function useAcceptQuote() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (referenceCode: string) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.acceptQuote(referenceCode);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: jobKeys.all });
    },
  });
}

/**
 * Guest: decline the quote for a job reference code.
 *
 * Backed by `declineQuoteByReference`, which marks the quote `#declined`. The
 * emailed decline link and the reference-code lookup write the same record, so
 * the job's quote status stays consistent between them.
 */
export function useDeclineQuoteByReference() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (referenceCode: string) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.declineQuoteByReference(referenceCode);
    },
    onSuccess: (_result, referenceCode) => {
      void queryClient.invalidateQueries({ queryKey: jobKeys.all });
      void queryClient.invalidateQueries({
        queryKey: jobKeys.quoteByReference(referenceCode.trim()),
      });
    },
  });
}

export function useConfirmAppointment() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (referenceCode: string) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.confirmAppointment(referenceCode);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: jobKeys.all });
    },
  });
}

export function useRecordDeposit() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: {
      referenceCode: string;
      method: PaymentMethod;
    }) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.recordDeposit(vars.referenceCode, vars.method);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: jobKeys.all });
    },
  });
}

/**
 * Record the deposit as paid via Cash App.
 *
 * Cash App is the only deposit option offered today — card/Stripe checkout is
 * intentionally not surfaced. This wraps `recordDeposit` with the Cash App
 * method so pages never have to name a payment method themselves.
 */
export function useRecordCashAppDeposit() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (referenceCode: string) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.recordDeposit(referenceCode, PaymentMethod.cashApp);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: jobKeys.all });
    },
  });
}

/** The Cash App handle customers send the deposit to. */
export function useCashAppHandle(): string {
  return CASHAPP_HANDLE;
}

export function useCreateDepositCheckoutSession() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (vars: {
      referenceCode: string;
      successUrl: string;
      cancelUrl: string;
    }) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.createDepositCheckoutSession(
        vars.referenceCode,
        vars.successUrl,
        vars.cancelUrl,
      );
    },
  });
}

export function useConfirmDepositPayment() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (referenceCode: string) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.confirmDepositPayment(referenceCode);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: jobKeys.all });
    },
  });
}

export function useSubmitReview() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: {
      referenceCode: string;
      rating: bigint;
      comment: string;
    }) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.submitReview(vars.referenceCode, vars.rating, vars.comment);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: jobKeys.all });
    },
  });
}

/**
 * Guest: post a message into the customer's own thread for a job reference
 * code. Resolves to the backend `Result` so the thread can surface a
 * `notAuthorized`/`notFound` error inline.
 */
export function usePostCustomerMessage() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { referenceCode: string; body: string }) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.postCustomerMessage(vars.referenceCode, vars.body);
    },
    onSuccess: (_result, vars) => {
      void queryClient.invalidateQueries({
        queryKey: jobKeys.customerMessages(vars.referenceCode.trim()),
      });
    },
  });
}

export function useSetQuote() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: {
      id: bigint;
      amount: bigint;
      note: string;
    }) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.setQuote(vars.id, vars.amount, vars.note);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: jobKeys.all });
    },
  });
}

/**
 * Admin: email the customer their quote.
 *
 * Backed by `sendQuote`, which marks the quote `#sent`, moves the job to
 * `#quoted` and emails the itemized quote with accept/decline links. Resolves
 * to `Result<QuoteSendResult, JobError>` so the Quotes workspace can surface a
 * per-channel delivery outcome — a failed email is reported, never swallowed.
 */
export function useSendQuote() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.sendQuote(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: jobKeys.all });
    },
  });
}

export function useScheduleAppointment() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { id: bigint; scheduledAt: bigint }) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.scheduleAppointment(vars.id, vars.scheduledAt);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: jobKeys.all });
    },
  });
}

export function useSetStripeConfiguration() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (config: StripeConfiguration) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.setStripeConfiguration(config);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: jobKeys.stripe() });
    },
  });
}

/**
 * Admin: save the owner alert email.
 *
 * Resolves to the backend `Result` so the panel can surface the specific
 * `OwnerAlertError` (invalid email vs. send failure) inline.
 */
export function useSetOwnerAlertEmail() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (address: string) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.setOwnerAlertEmail(address);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: jobKeys.ownerAlert() });
    },
  });
}

/**
 * Admin: save the owner alert phone number.
 *
 * Resolves to the backend `Result` so the panel can surface the specific
 * `OwnerAlertPhoneError` (invalid number vs. send failure) inline. The backend
 * normalizes a valid number to E.164 and returns the stored value.
 */
export function useSetOwnerAlertPhone() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (number: string) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.setOwnerAlertPhone(number);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: jobKeys.ownerAlertPhone(),
      });
    },
  });
}

/**
 * Admin: send a sample alert to both the saved email and the saved phone.
 *
 * Resolves to `TestAlertResult`, whose `email` and `sms` channels each report
 * `{ #sent }` or `{ #failed : Text }` so the panel can show the outcome of each
 * channel separately.
 */
export function useSendTestAlert() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.sendTestAlert();
    },
  });
}

export function useAdvanceStatus() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.advanceStatus(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: jobKeys.all });
    },
  });
}

/**
 * Admin: cancel a job request.
 *
 * Cancellation is terminal and moves the job into the customer profile's
 * cancelled group. A completed job cannot be cancelled.
 */
export function useCancelJob() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.cancelJob(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: jobKeys.all });
    },
  });
}

/* ------------------------------------------------------------------ */
/* Bees (employees)                                                    */
/* ------------------------------------------------------------------ */

export function useCreateBee() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: BeeInput) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.createBee(input);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: jobKeys.bees() });
    },
  });
}

export function useUpdateBee() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { id: bigint; input: BeeInput }) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.updateBee(vars.id, vars.input);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: jobKeys.bees() });
      void queryClient.invalidateQueries({ queryKey: jobKeys.all });
    },
  });
}

export function useAssignBeeToJob() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { id: bigint; beeId: bigint }) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.assignBeeToJob(vars.id, vars.beeId);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: jobKeys.all });
    },
  });
}

/* ------------------------------------------------------------------ */
/* Monthly package                                                     */
/* ------------------------------------------------------------------ */

/**
 * Admin: enroll a customer in the monthly package.
 *
 * Backed by `setPackageEnrollment(id, true)` — the package is a manual,
 * owner-managed deal with no recurring auto-billing.
 */
export function useEnrollInPackage() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.setPackageEnrollment(id, true);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: jobKeys.all });
    },
  });
}

/**
 * Admin: cancel a customer's monthly package enrollment.
 *
 * Backed by `setPackageEnrollment(id, false)`.
 */
export function useCancelPackage() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.setPackageEnrollment(id, false);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: jobKeys.all });
    },
  });
}

/**
 * Read a job's monthly package enrollment, if any.
 *
 * The backend exposes package state on the job view rather than a dedicated
 * method, so this derives it from the job request query.
 */
export function usePackageStatus(id: bigint | null) {
  const query = useJobRequest(id);
  return {
    ...query,
    data: query.data?.packageEnrollment ?? null,
  };
}

/* ------------------------------------------------------------------ */
/* Scheduling — customer-linked appointments                           */
/* ------------------------------------------------------------------ */

/** One scheduled appointment, joined to the job and customer it belongs to. */
export interface ScheduledAppointment {
  jobId: bigint;
  referenceCode: string;
  customerName: string;
  category: JobRequestView["category"];
  status: JobRequestView["status"];
  scheduledAt: bigint;
  confirmed: boolean;
}

/**
 * Admin: every scheduled appointment across all jobs, newest visit first.
 *
 * Appointments live on the job view rather than a dedicated endpoint, so this
 * derives the schedule from the shared request list — one cached query and one
 * poll — and keeps each appointment linked to its job and customer.
 */
export function useScheduledAppointments() {
  const query = useJobRequests();
  const appointments = useMemo<ScheduledAppointment[]>(() => {
    const jobs = query.data ?? [];
    return jobs
      .filter((job) => job.appointment !== undefined)
      .map((job) => ({
        jobId: job.id,
        referenceCode: job.referenceCode,
        customerName: job.customerName,
        category: job.category,
        status: job.status,
        scheduledAt: job.appointment?.scheduledAt ?? 0n,
        confirmed: job.appointment?.confirmed ?? false,
      }))
      .sort((a, b) =>
        a.scheduledAt === b.scheduledAt
          ? 0
          : a.scheduledAt > b.scheduledAt
            ? -1
            : 1,
      );
  }, [query.data]);

  return { ...query, data: appointments };
}

/**
 * Admin: the quote attached to a job, if any.
 *
 * The quote is embedded on the job view, so this reads it from the shared job
 * query rather than a dedicated endpoint.
 */
export function useQuoteStatus(id: bigint | null) {
  const query = useJobRequest(id);
  return {
    ...query,
    data: query.data?.quote ?? null,
  };
}

export type { BeeView };

/* ------------------------------------------------------------------ */
/* New-request emphasis (owner-local UI state)                         */
/* ------------------------------------------------------------------ */

const SEEN_REQUESTS_KEY = "honey-dos:seen-requests";
const SEEN_REQUESTS_EVENT = "honey-dos:seen-requests-changed";
/** Cap the stored set so it never grows without bound. */
const SEEN_REQUESTS_LIMIT = 200;

function readSeenRequests(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SEEN_REQUESTS_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((value): value is string => typeof value === "string");
  } catch {
    return [];
  }
}

function writeSeenRequests(ids: string[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      SEEN_REQUESTS_KEY,
      JSON.stringify(ids.slice(-SEEN_REQUESTS_LIMIT)),
    );
  } catch {
    /* Storage unavailable — emphasis simply resets on the next load. */
  }
  window.dispatchEvent(new Event(SEEN_REQUESTS_EVENT));
}

/**
 * Which requests the owner has already opened.
 *
 * This is owner-local UI state (which cards have been looked at), never
 * backend-owned data, so it lives in `localStorage` and stays in sync across
 * every mounted consumer through a custom event.
 */
export function useSeenRequests() {
  const [seenIds, setSeenIds] = useState<string[]>(() => readSeenRequests());

  useEffect(() => {
    const sync = () => setSeenIds(readSeenRequests());
    window.addEventListener(SEEN_REQUESTS_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(SEEN_REQUESTS_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const seen = useMemo(() => new Set(seenIds), [seenIds]);

  const markSeen = useCallback((id: bigint) => {
    const key = id.toString();
    const current = readSeenRequests();
    if (current.includes(key)) return;
    writeSeenRequests([...current, key]);
  }, []);

  const markManySeen = useCallback((ids: bigint[]) => {
    const current = readSeenRequests();
    const next = new Set(current);
    let changed = false;
    for (const id of ids) {
      const key = id.toString();
      if (!next.has(key)) {
        next.add(key);
        changed = true;
      }
    }
    if (changed) writeSeenRequests([...next]);
  }, []);

  return { seen, markSeen, markManySeen };
}

/* ------------------------------------------------------------------ */
/* New-request in-app alert (owner, live)                              */
/* ------------------------------------------------------------------ */

/** How long the in-app new-request alert stays before it clears itself. */
export const NEW_REQUEST_ALERT_MS = 8_000;

export interface NewRequestAlertState {
  /** The genuinely-new request to announce, or null when there is none. */
  request: JobRequestView | null;
  /** Dismiss the current alert. */
  dismiss: () => void;
}

/**
 * Watch the request list for genuinely new arrivals while the owner is signed
 * in with the app open.
 *
 * The first successful load only seeds the baseline of already-existing
 * requests, so opening the dashboard never fires an alert. Every later poll
 * compares against that baseline and surfaces the newest arrival. Gated behind
 * `enabled` so a guest never fires the admin-only `listRequests` call.
 */
export function useNewRequestAlert(enabled: boolean): NewRequestAlertState {
  const { actor, isFetching } = useActor(createActor);
  const [request, setRequest] = useState<JobRequestView | null>(null);
  const knownIdsRef = useRef<Set<string> | null>(null);

  const query = useQuery({
    queryKey: jobKeys.list(),
    queryFn: async () => {
      if (!actor) return [];
      return actor.listRequests();
    },
    enabled: enabled && !!actor && !isFetching,
    refetchInterval: REQUESTS_REFETCH_MS,
    refetchIntervalInBackground: false,
  });

  const jobs = query.data;

  useEffect(() => {
    if (!enabled) {
      knownIdsRef.current = null;
      setRequest(null);
      return;
    }
    if (!jobs) return;
    const ids = new Set(jobs.map((job) => job.id.toString()));
    const known = knownIdsRef.current;
    if (known === null) {
      // First load: remember what already exists without announcing it.
      knownIdsRef.current = ids;
      return;
    }
    const fresh = jobs.filter((job) => !known.has(job.id.toString()));
    knownIdsRef.current = ids;
    if (fresh.length === 0) return;
    const newest = fresh.reduce((latest, job) =>
      job.createdAt > latest.createdAt ? job : latest,
    );
    setRequest(newest);
  }, [enabled, jobs]);

  const dismiss = useCallback(() => setRequest(null), []);

  return { request, dismiss };
}
