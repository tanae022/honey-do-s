import {
  type BeeInput,
  type BeeView,
  type JobRequestInput,
  PaymentMethod,
  type StripeConfiguration,
  createActor,
} from "@/backend";
import { CASHAPP_HANDLE } from "@/lib/jobs";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const jobKeys = {
  all: ["jobs"] as const,
  list: () => [...jobKeys.all, "list"] as const,
  detail: (id: bigint) => [...jobKeys.all, "detail", id.toString()] as const,
  reference: (code: string) => [...jobKeys.all, "reference", code] as const,
  stats: () => [...jobKeys.all, "stats"] as const,
  role: () => ["role"] as const,
  stripe: () => ["stripe", "configured"] as const,
  bees: () => ["bees", "list"] as const,
  visitHistory: (code: string) => ["visits", "reference", code] as const,
  customerVisits: (id: bigint) =>
    ["visits", "customer", id.toString()] as const,
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

export function useDashboardStats() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: jobKeys.stats(),
    queryFn: async () => {
      if (!actor) return null;
      return actor.getDashboardStats();
    },
    enabled: !!actor && !isFetching,
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

/**
 * Admin: remove a bee from the hive.
 *
 * The backend does not yet expose a delete method; this hook is wired to the
 * expected `deleteBee(id)` signature so the admin surface can call it as soon
 * as the binding lands. It rejects with a clear message until then.
 */
export function useDeleteBee() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Backend is not ready");
      const deleteBee = (
        actor as unknown as {
          deleteBee?: (beeId: bigint) => Promise<unknown>;
        }
      ).deleteBee;
      if (typeof deleteBee !== "function") {
        throw new Error("Removing a bee is not available yet");
      }
      return deleteBee(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: jobKeys.bees() });
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

export type { BeeView };
