import {
  type AdminSettings,
  type BusinessSettings,
  type DepositSetting,
  type DiscountId,
  type DiscountRuleInput,
  type JobId,
  type JobRecordId,
  type PaymentMethod,
  type PaymentSettings,
  type QuoteSettings,
  type ReferenceCode,
  type TaxSetting,
  createActor,
} from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * How often the admin settings and payment views re-check the backend.
 *
 * Matches the dashboard cadence so settings, deposits and payment history stay
 * fresh without flooding the canister.
 */
export const ADMIN_REFETCH_MS = 15_000;

export const adminKeys = {
  all: ["admin"] as const,
  discounts: () => [...adminKeys.all, "discounts"] as const,
  settings: () => [...adminKeys.all, "settings"] as const,
  paymentSummary: (code: string) =>
    [...adminKeys.all, "paymentSummary", code] as const,
  paymentHistory: () => [...adminKeys.all, "paymentHistory"] as const,
  paymentHistoryForJob: (jobId: JobId) =>
    [...adminKeys.all, "paymentHistory", "job", jobId.toString()] as const,
  jobRecords: () => [...adminKeys.all, "jobRecords"] as const,
  jobRecord: (id: JobRecordId) =>
    [...adminKeys.all, "jobRecord", id.toString()] as const,
};

/* ------------------------------------------------------------------ */
/* Discount rules                                                      */
/* ------------------------------------------------------------------ */

/** Admin: every discount rule, newest first. */
export function useDiscounts() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: adminKeys.discounts(),
    queryFn: async () => {
      if (!actor) return [];
      return actor.listDiscounts();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: ADMIN_REFETCH_MS,
    refetchIntervalInBackground: false,
  });
}

export function useCreateDiscount() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: DiscountRuleInput) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.createDiscount(input);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.discounts() });
    },
  });
}

export function useUpdateDiscount() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { id: DiscountId; input: DiscountRuleInput }) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.updateDiscount(vars.id, vars.input);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.discounts() });
    },
  });
}

export function useSetDiscountActive() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { id: DiscountId; active: boolean }) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.setDiscountActive(vars.id, vars.active);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.discounts() });
    },
  });
}

export function useDeleteDiscount() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: DiscountId) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.deleteDiscount(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.discounts() });
    },
  });
}

/* ------------------------------------------------------------------ */
/* Settings bundle                                                     */
/* ------------------------------------------------------------------ */

/** Admin: the full settings bundle (tax, quote, deposit, business, payment). */
export function useSettings() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: adminKeys.settings(),
    queryFn: async () => {
      if (!actor) return null;
      return actor.getSettings();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: ADMIN_REFETCH_MS,
    refetchIntervalInBackground: false,
  });
}

export function useSetTaxSetting() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (setting: TaxSetting) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.setTaxSetting(setting);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.settings() });
    },
  });
}

export function useSetDepositSetting() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (setting: DepositSetting) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.setDepositSetting(setting);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.settings() });
    },
  });
}

export function useSetPaymentSettings() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (settings: PaymentSettings) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.setPaymentSettings(settings);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.settings() });
    },
  });
}

export function useSetQuoteSettings() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (setting: QuoteSettings) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.setQuoteSettings(setting);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.settings() });
    },
  });
}

export function useSetBusinessSettings() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (setting: BusinessSettings) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.setBusinessSettings(setting);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.settings() });
    },
  });
}

export function useSetAdminSettings() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (settings: AdminSettings) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.setAdminSettings(settings);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.settings() });
    },
  });
}

/* ------------------------------------------------------------------ */
/* Deposits                                                            */
/* ------------------------------------------------------------------ */

/** Guest: the payment summary for a job reference code. */
export function usePaymentSummary(referenceCode: string) {
  const { actor, isFetching } = useActor(createActor);
  const trimmed = referenceCode.trim();
  return useQuery({
    queryKey: adminKeys.paymentSummary(trimmed),
    queryFn: async () => {
      if (!actor || trimmed.length === 0) return null;
      return actor.getPaymentSummary(trimmed);
    },
    enabled: !!actor && !isFetching && trimmed.length > 0,
  });
}

/** Guest: submit a deposit for a job reference code. */
export function useSubmitDeposit() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: {
      referenceCode: ReferenceCode;
      method: PaymentMethod;
    }) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.submitDeposit(vars.referenceCode, vars.method);
    },
    onSuccess: (_result, vars) => {
      void queryClient.invalidateQueries({
        queryKey: adminKeys.paymentSummary(vars.referenceCode.trim()),
      });
      void queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
  });
}

/** Admin: verify a submitted deposit. */
export function useVerifyDeposit() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (referenceCode: ReferenceCode) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.verifyDeposit(referenceCode);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
  });
}

/** Admin: reject a submitted deposit. */
export function useRejectDeposit() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (referenceCode: ReferenceCode) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.rejectDeposit(referenceCode);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
  });
}

/* ------------------------------------------------------------------ */
/* Payment history                                                     */
/* ------------------------------------------------------------------ */

/** Admin: every payment record, newest first. */
export function usePaymentHistory() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: adminKeys.paymentHistory(),
    queryFn: async () => {
      if (!actor) return [];
      return actor.listPaymentHistory();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: ADMIN_REFETCH_MS,
    refetchIntervalInBackground: false,
  });
}

/** Admin: the payment record for a single job, if any. */
export function usePaymentHistoryForJob(jobId: JobId | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: adminKeys.paymentHistoryForJob(jobId ?? 0n),
    queryFn: async () => {
      if (!actor || jobId === null) return null;
      return actor.getPaymentHistoryForJob(jobId);
    },
    enabled: !!actor && !isFetching && jobId !== null,
  });
}

/** Admin: record the final payment for a job. */
export function useRecordFinalPayment() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: {
      jobId: JobId;
      amount: bigint;
      method: PaymentMethod;
    }) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.recordFinalPayment(vars.jobId, vars.amount, vars.method);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
  });
}

/* ------------------------------------------------------------------ */
/* Job records                                                         */
/* ------------------------------------------------------------------ */

/** Admin: every job record, newest first. */
export function useJobRecords() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: adminKeys.jobRecords(),
    queryFn: async () => {
      if (!actor) return [];
      return actor.listJobRecords();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: ADMIN_REFETCH_MS,
    refetchIntervalInBackground: false,
  });
}

/** Admin: a single job record. */
export function useJobRecord(id: JobRecordId | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: adminKeys.jobRecord(id ?? 0n),
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getJobRecord(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

/** Admin: create a job record from a job request and a scheduled time. */
export function useCreateJobRecord() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { jobId: JobId; scheduledAt: bigint }) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.createJobRecord(vars.jobId, vars.scheduledAt);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.jobRecords() });
    },
  });
}

export function useAdvanceJobRecord() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: JobRecordId) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.advanceJobRecord(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.jobRecords() });
    },
  });
}

export function useCompleteJobRecord() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: JobRecordId) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.completeJobRecord(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.jobRecords() });
    },
  });
}

export function useCancelJobRecord() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: JobRecordId) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.cancelJobRecord(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.jobRecords() });
    },
  });
}

/**
 * Admin: send an appointment reminder for a job.
 *
 * This is a manual, owner-triggered reminder — never a scheduled automatic
 * delivery.
 */
export function useSendAppointmentReminder() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (jobId: JobId) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.sendAppointmentReminder(jobId);
    },
  });
}
