import { a as useQuery, i as useMutation, s as useQueryClient, t as useActor } from "./dist-DCUbDtYL.js";
import { at as createActor } from "./createLucideIcon-CK3986Sn.js";
// src/hooks/useCustomers.ts
/**
* How often the admin customer area re-checks the backend.
*
* Matches the job dashboard's cadence so the directory, notifications and
* message threads stay fresh without flooding the canister.
*/
var CUSTOMERS_REFETCH_MS = 15e3;
var customerKeys = {
	all: ["customers"],
	list: (includeArchived) => [
		...customerKeys.all,
		"list",
		includeArchived
	],
	search: (term) => [
		...customerKeys.all,
		"search",
		term
	],
	detail: (id) => [
		...customerKeys.all,
		"detail",
		id.toString()
	],
	profile: (id) => [
		...customerKeys.all,
		"profile",
		id.toString()
	],
	notifications: () => ["notifications", "list"],
	unreadCount: () => ["notifications", "unread"],
	messages: (customerId) => [
		"messages",
		"customer",
		customerId.toString()
	]
};
/** Admin: the customer directory, optionally including archived records. */
function useCustomers(includeArchived = false) {
	const { actor, isFetching } = useActor(createActor);
	return useQuery({
		queryKey: customerKeys.list(includeArchived),
		queryFn: async () => {
			if (!actor) return [];
			return actor.listCustomers(includeArchived);
		},
		enabled: !!actor && !isFetching,
		refetchInterval: CUSTOMERS_REFETCH_MS,
		refetchIntervalInBackground: false
	});
}
/**
* Admin: search the customer directory by name, phone, email, id or address.
*
* An empty term returns the full directory, so the search box can clear back
* to the unfiltered list without a second query shape.
*/
function useCustomerSearch(term) {
	const { actor, isFetching } = useActor(createActor);
	const trimmed = term.trim();
	return useQuery({
		queryKey: customerKeys.search(trimmed),
		queryFn: async () => {
			if (!actor) return [];
			return actor.searchCustomers(trimmed);
		},
		enabled: !!actor && !isFetching
	});
}
/** Admin: a customer's full profile with history, deposits and photos. */
function useCustomerProfile(id) {
	const { actor, isFetching } = useActor(createActor);
	return useQuery({
		queryKey: customerKeys.profile(id ?? 0n),
		queryFn: async () => {
			if (!actor || id === null) return null;
			return actor.getCustomerProfile(id);
		},
		enabled: !!actor && !isFetching && id !== null,
		refetchInterval: CUSTOMERS_REFETCH_MS,
		refetchIntervalInBackground: false
	});
}
/** Admin: every dashboard notification, newest first. */
function useNotifications() {
	const { actor, isFetching } = useActor(createActor);
	return useQuery({
		queryKey: customerKeys.notifications(),
		queryFn: async () => {
			if (!actor) return [];
			return actor.listNotifications();
		},
		enabled: !!actor && !isFetching,
		refetchInterval: CUSTOMERS_REFETCH_MS,
		refetchIntervalInBackground: false
	});
}
/** Admin: how many notifications have not been reviewed yet. */
function useUnreadNotificationCount() {
	const { actor, isFetching } = useActor(createActor);
	return useQuery({
		queryKey: customerKeys.unreadCount(),
		queryFn: async () => {
			if (!actor) return 0n;
			return actor.getUnreadNotificationCount();
		},
		enabled: !!actor && !isFetching,
		refetchInterval: CUSTOMERS_REFETCH_MS,
		refetchIntervalInBackground: false
	});
}
/** Admin: a customer's message thread, newest first. */
function useCustomerMessages(customerId) {
	const { actor, isFetching } = useActor(createActor);
	return useQuery({
		queryKey: customerKeys.messages(customerId ?? 0n),
		queryFn: async () => {
			if (!actor || customerId === null) return [];
			return actor.listCustomerMessages(customerId);
		},
		enabled: !!actor && !isFetching && customerId !== null,
		refetchInterval: CUSTOMERS_REFETCH_MS,
		refetchIntervalInBackground: false
	});
}
function useCreateCustomer() {
	const { actor } = useActor(createActor);
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (input) => {
			if (!actor) throw new Error("Backend is not ready");
			return actor.createCustomer(input);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: customerKeys.all });
		}
	});
}
function useUpdateCustomer() {
	const { actor } = useActor(createActor);
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (vars) => {
			if (!actor) throw new Error("Backend is not ready");
			return actor.updateCustomer(vars.id, vars.input);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: customerKeys.all });
		}
	});
}
/**
* Admin: create a service request for an existing customer.
*
* Backed by `createJobForCustomer`, which links the new request to the saved
* customer record so the admin never re-enters contact information.
*/
function useCreateJobForCustomer() {
	const { actor } = useActor(createActor);
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (vars) => {
			if (!actor) throw new Error("Backend is not ready");
			return actor.createJobForCustomer(vars.customerId, vars.input);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: customerKeys.all });
		}
	});
}
function useAddCustomerNote() {
	const { actor } = useActor(createActor);
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (vars) => {
			if (!actor) throw new Error("Backend is not ready");
			return actor.addCustomerNote(vars.id, vars.body);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: customerKeys.all });
		}
	});
}
function useSetCustomerStatus() {
	const { actor } = useActor(createActor);
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (vars) => {
			if (!actor) throw new Error("Backend is not ready");
			return actor.setCustomerStatus(vars.id, vars.status);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: customerKeys.all });
		}
	});
}
function useArchiveCustomer() {
	const { actor } = useActor(createActor);
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id) => {
			if (!actor) throw new Error("Backend is not ready");
			return actor.archiveCustomer(id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: customerKeys.all });
		}
	});
}
function useRestoreCustomer() {
	const { actor } = useActor(createActor);
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id) => {
			if (!actor) throw new Error("Backend is not ready");
			return actor.restoreCustomer(id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: customerKeys.all });
		}
	});
}
/** Admin: fetch the CSV export text for the customer directory. */
function useExportCustomersCsv() {
	const { actor } = useActor(createActor);
	return useMutation({ mutationFn: async () => {
		if (!actor) throw new Error("Backend is not ready");
		return actor.exportCustomersCsv();
	} });
}
function useMarkNotificationRead() {
	const { actor } = useActor(createActor);
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id) => {
			if (!actor) throw new Error("Backend is not ready");
			return actor.markNotificationRead(id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: customerKeys.notifications() });
			queryClient.invalidateQueries({ queryKey: customerKeys.unreadCount() });
		}
	});
}
function useMarkAllNotificationsRead() {
	const { actor } = useActor(createActor);
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async () => {
			if (!actor) throw new Error("Backend is not ready");
			return actor.markAllNotificationsRead();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: customerKeys.notifications() });
			queryClient.invalidateQueries({ queryKey: customerKeys.unreadCount() });
		}
	});
}
/**
* Admin: post a reply into a customer's message thread.
*
* The backend method is `postAdminMessage`; this hook is the frontend's
* `sendAdminMessage` entry point.
*/
function useSendAdminMessage() {
	const { actor } = useActor(createActor);
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (vars) => {
			if (!actor) throw new Error("Backend is not ready");
			return actor.postAdminMessage(vars.customerId, vars.jobId, vars.body);
		},
		onSuccess: (_result, vars) => {
			queryClient.invalidateQueries({ queryKey: customerKeys.messages(vars.customerId) });
		}
	});
}
export { useUnreadNotificationCount as _, useCreateJobForCustomer as a, useCustomerSearch as c, useMarkAllNotificationsRead as d, useMarkNotificationRead as f, useSetCustomerStatus as g, useSendAdminMessage as h, useCreateCustomer as i, useCustomers as l, useRestoreCustomer as m, useAddCustomerNote as n, useCustomerMessages as o, useNotifications as p, useArchiveCustomer as r, useCustomerProfile as s, customerKeys as t, useExportCustomersCsv as u, useUpdateCustomer as v };
