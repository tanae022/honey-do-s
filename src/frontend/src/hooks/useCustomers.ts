import { createActor } from "@/backend";
import type {
  CustomerId,
  CustomerInput,
  CustomerStatus,
  JobRequestInput,
  MessageId,
  NotificationId,
} from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * How often the admin customer area re-checks the backend.
 *
 * Matches the job dashboard's cadence so the directory, notifications and
 * message threads stay fresh without flooding the canister.
 */
export const CUSTOMERS_REFETCH_MS = 15_000;

export const customerKeys = {
  all: ["customers"] as const,
  list: (includeArchived: boolean) =>
    [...customerKeys.all, "list", includeArchived] as const,
  search: (term: string) => [...customerKeys.all, "search", term] as const,
  detail: (id: CustomerId) =>
    [...customerKeys.all, "detail", id.toString()] as const,
  profile: (id: CustomerId) =>
    [...customerKeys.all, "profile", id.toString()] as const,
  notifications: () => ["notifications", "list"] as const,
  unreadCount: () => ["notifications", "unread"] as const,
  messages: (customerId: CustomerId) =>
    ["messages", "customer", customerId.toString()] as const,
};

/* ------------------------------------------------------------------ */
/* Queries                                                             */
/* ------------------------------------------------------------------ */

/** Admin: the customer directory, optionally including archived records. */
export function useCustomers(includeArchived = false) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: customerKeys.list(includeArchived),
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCustomers(includeArchived);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: CUSTOMERS_REFETCH_MS,
    refetchIntervalInBackground: false,
  });
}

/**
 * Admin: search the customer directory by name, phone, email, id or address.
 *
 * An empty term returns the full directory, so the search box can clear back
 * to the unfiltered list without a second query shape.
 */
export function useCustomerSearch(term: string) {
  const { actor, isFetching } = useActor(createActor);
  const trimmed = term.trim();
  return useQuery({
    queryKey: customerKeys.search(trimmed),
    queryFn: async () => {
      if (!actor) return [];
      return actor.searchCustomers(trimmed);
    },
    enabled: !!actor && !isFetching,
  });
}

/** Admin: a single customer record. */
export function useCustomer(id: CustomerId | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: customerKeys.detail(id ?? 0n),
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getCustomer(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

/** Admin: a customer's full profile with history, deposits and photos. */
export function useCustomerProfile(id: CustomerId | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: customerKeys.profile(id ?? 0n),
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getCustomerProfile(id);
    },
    enabled: !!actor && !isFetching && id !== null,
    refetchInterval: CUSTOMERS_REFETCH_MS,
    refetchIntervalInBackground: false,
  });
}

/** Admin: every dashboard notification, newest first. */
export function useNotifications() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: customerKeys.notifications(),
    queryFn: async () => {
      if (!actor) return [];
      return actor.listNotifications();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: CUSTOMERS_REFETCH_MS,
    refetchIntervalInBackground: false,
  });
}

/** Admin: how many notifications have not been reviewed yet. */
export function useUnreadNotificationCount() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: customerKeys.unreadCount(),
    queryFn: async () => {
      if (!actor) return 0n;
      return actor.getUnreadNotificationCount();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: CUSTOMERS_REFETCH_MS,
    refetchIntervalInBackground: false,
  });
}

/** Admin: a customer's message thread, newest first. */
export function useCustomerMessages(customerId: CustomerId | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: customerKeys.messages(customerId ?? 0n),
    queryFn: async () => {
      if (!actor || customerId === null) return [];
      return actor.listCustomerMessages(customerId);
    },
    enabled: !!actor && !isFetching && customerId !== null,
    refetchInterval: CUSTOMERS_REFETCH_MS,
    refetchIntervalInBackground: false,
  });
}

/* ------------------------------------------------------------------ */
/* Mutations                                                           */
/* ------------------------------------------------------------------ */

export function useCreateCustomer() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CustomerInput) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.createCustomer(input);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: customerKeys.all });
    },
  });
}

export function useUpdateCustomer() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { id: CustomerId; input: CustomerInput }) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.updateCustomer(vars.id, vars.input);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: customerKeys.all });
    },
  });
}

/**
 * Admin: create a service request for an existing customer.
 *
 * Backed by `createJobForCustomer`, which links the new request to the saved
 * customer record so the admin never re-enters contact information.
 */
export function useCreateJobForCustomer() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: {
      customerId: CustomerId;
      input: JobRequestInput;
    }) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.createJobForCustomer(vars.customerId, vars.input);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: customerKeys.all });
    },
  });
}

export function useAddCustomerNote() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { id: CustomerId; body: string }) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.addCustomerNote(vars.id, vars.body);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: customerKeys.all });
    },
  });
}

export function useSetCustomerStatus() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { id: CustomerId; status: CustomerStatus }) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.setCustomerStatus(vars.id, vars.status);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: customerKeys.all });
    },
  });
}

export function useArchiveCustomer() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: CustomerId) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.archiveCustomer(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: customerKeys.all });
    },
  });
}

export function useRestoreCustomer() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: CustomerId) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.restoreCustomer(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: customerKeys.all });
    },
  });
}

/** Admin: fetch the CSV export text for the customer directory. */
export function useExportCustomersCsv() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.exportCustomersCsv();
    },
  });
}

export function useMarkNotificationRead() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: NotificationId) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.markNotificationRead(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: customerKeys.notifications(),
      });
      void queryClient.invalidateQueries({
        queryKey: customerKeys.unreadCount(),
      });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.markAllNotificationsRead();
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: customerKeys.notifications(),
      });
      void queryClient.invalidateQueries({
        queryKey: customerKeys.unreadCount(),
      });
    },
  });
}

/**
 * Admin: post a reply into a customer's message thread.
 *
 * The backend method is `postAdminMessage`; this hook is the frontend's
 * `sendAdminMessage` entry point.
 */
export function useSendAdminMessage() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: {
      customerId: CustomerId;
      jobId: bigint | null;
      body: string;
    }) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.postAdminMessage(vars.customerId, vars.jobId, vars.body);
    },
    onSuccess: (_result, vars) => {
      void queryClient.invalidateQueries({
        queryKey: customerKeys.messages(vars.customerId),
      });
    },
  });
}

export type { MessageId };
