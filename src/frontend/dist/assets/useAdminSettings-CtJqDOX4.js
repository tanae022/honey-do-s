import { a as useQuery, i as useMutation, s as useQueryClient, t as useActor } from "./dist-DCUbDtYL.js";
import { at as createActor } from "./createLucideIcon-CK3986Sn.js";
// src/hooks/useAdminSettings.ts
/**
* How often the admin settings and payment views re-check the backend.
*
* Matches the dashboard cadence so settings, deposits and payment history stay
* fresh without flooding the canister.
*/
var ADMIN_REFETCH_MS = 15e3;
var adminKeys = {
	all: ["admin"],
	discounts: () => [...adminKeys.all, "discounts"],
	settings: () => [...adminKeys.all, "settings"],
	paymentSummary: (code) => [
		...adminKeys.all,
		"paymentSummary",
		code
	],
	paymentHistory: () => [...adminKeys.all, "paymentHistory"],
	paymentHistoryForJob: (jobId) => [
		...adminKeys.all,
		"paymentHistory",
		"job",
		jobId.toString()
	],
	jobRecords: () => [...adminKeys.all, "jobRecords"],
	jobRecord: (id) => [
		...adminKeys.all,
		"jobRecord",
		id.toString()
	]
};
/** Admin: every discount rule, newest first. */
function useDiscounts() {
	const { actor, isFetching } = useActor(createActor);
	return useQuery({
		queryKey: adminKeys.discounts(),
		queryFn: async () => {
			if (!actor) return [];
			return actor.listDiscounts();
		},
		enabled: !!actor && !isFetching,
		refetchInterval: ADMIN_REFETCH_MS,
		refetchIntervalInBackground: false
	});
}
function useCreateDiscount() {
	const { actor } = useActor(createActor);
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (input) => {
			if (!actor) throw new Error("Backend is not ready");
			return actor.createDiscount(input);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: adminKeys.discounts() });
		}
	});
}
function useUpdateDiscount() {
	const { actor } = useActor(createActor);
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (vars) => {
			if (!actor) throw new Error("Backend is not ready");
			return actor.updateDiscount(vars.id, vars.input);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: adminKeys.discounts() });
		}
	});
}
function useSetDiscountActive() {
	const { actor } = useActor(createActor);
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (vars) => {
			if (!actor) throw new Error("Backend is not ready");
			return actor.setDiscountActive(vars.id, vars.active);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: adminKeys.discounts() });
		}
	});
}
function useDeleteDiscount() {
	const { actor } = useActor(createActor);
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id) => {
			if (!actor) throw new Error("Backend is not ready");
			return actor.deleteDiscount(id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: adminKeys.discounts() });
		}
	});
}
/** Admin: the full settings bundle (tax, quote, deposit, business, payment). */
function useSettings() {
	const { actor, isFetching } = useActor(createActor);
	return useQuery({
		queryKey: adminKeys.settings(),
		queryFn: async () => {
			if (!actor) return null;
			return actor.getSettings();
		},
		enabled: !!actor && !isFetching,
		refetchInterval: ADMIN_REFETCH_MS,
		refetchIntervalInBackground: false
	});
}
function useSetTaxSetting() {
	const { actor } = useActor(createActor);
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (setting) => {
			if (!actor) throw new Error("Backend is not ready");
			return actor.setTaxSetting(setting);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: adminKeys.settings() });
		}
	});
}
function useSetDepositSetting() {
	const { actor } = useActor(createActor);
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (setting) => {
			if (!actor) throw new Error("Backend is not ready");
			return actor.setDepositSetting(setting);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: adminKeys.settings() });
		}
	});
}
function useSetPaymentSettings() {
	const { actor } = useActor(createActor);
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (settings) => {
			if (!actor) throw new Error("Backend is not ready");
			return actor.setPaymentSettings(settings);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: adminKeys.settings() });
		}
	});
}
function useSetQuoteSettings() {
	const { actor } = useActor(createActor);
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (setting) => {
			if (!actor) throw new Error("Backend is not ready");
			return actor.setQuoteSettings(setting);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: adminKeys.settings() });
		}
	});
}
function useSetBusinessSettings() {
	const { actor } = useActor(createActor);
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (setting) => {
			if (!actor) throw new Error("Backend is not ready");
			return actor.setBusinessSettings(setting);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: adminKeys.settings() });
		}
	});
}
function useSetAdminSettings() {
	const { actor } = useActor(createActor);
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (settings) => {
			if (!actor) throw new Error("Backend is not ready");
			return actor.setAdminSettings(settings);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: adminKeys.settings() });
		}
	});
}
/** Guest: the payment summary for a job reference code. */
function usePaymentSummary(referenceCode) {
	const { actor, isFetching } = useActor(createActor);
	const trimmed = referenceCode.trim();
	return useQuery({
		queryKey: adminKeys.paymentSummary(trimmed),
		queryFn: async () => {
			if (!actor || trimmed.length === 0) return null;
			return actor.getPaymentSummary(trimmed);
		},
		enabled: !!actor && !isFetching && trimmed.length > 0
	});
}
/** Guest: submit a deposit for a job reference code. */
function useSubmitDeposit() {
	const { actor } = useActor(createActor);
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (vars) => {
			if (!actor) throw new Error("Backend is not ready");
			return actor.submitDeposit(vars.referenceCode, vars.method);
		},
		onSuccess: (_result, vars) => {
			queryClient.invalidateQueries({ queryKey: adminKeys.paymentSummary(vars.referenceCode.trim()) });
			queryClient.invalidateQueries({ queryKey: adminKeys.all });
		}
	});
}
/** Admin: verify a submitted deposit. */
function useVerifyDeposit() {
	const { actor } = useActor(createActor);
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (referenceCode) => {
			if (!actor) throw new Error("Backend is not ready");
			return actor.verifyDeposit(referenceCode);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: adminKeys.all });
		}
	});
}
/** Admin: reject a submitted deposit. */
function useRejectDeposit() {
	const { actor } = useActor(createActor);
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (referenceCode) => {
			if (!actor) throw new Error("Backend is not ready");
			return actor.rejectDeposit(referenceCode);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: adminKeys.all });
		}
	});
}
/** Admin: every payment record, newest first. */
function usePaymentHistory() {
	const { actor, isFetching } = useActor(createActor);
	return useQuery({
		queryKey: adminKeys.paymentHistory(),
		queryFn: async () => {
			if (!actor) return [];
			return actor.listPaymentHistory();
		},
		enabled: !!actor && !isFetching,
		refetchInterval: ADMIN_REFETCH_MS,
		refetchIntervalInBackground: false
	});
}
/** Admin: record the final payment for a job. */
function useRecordFinalPayment() {
	const { actor } = useActor(createActor);
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (vars) => {
			if (!actor) throw new Error("Backend is not ready");
			return actor.recordFinalPayment(vars.jobId, vars.amount, vars.method);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: adminKeys.all });
		}
	});
}
/** Admin: every job record, newest first. */
function useJobRecords() {
	const { actor, isFetching } = useActor(createActor);
	return useQuery({
		queryKey: adminKeys.jobRecords(),
		queryFn: async () => {
			if (!actor) return [];
			return actor.listJobRecords();
		},
		enabled: !!actor && !isFetching,
		refetchInterval: ADMIN_REFETCH_MS,
		refetchIntervalInBackground: false
	});
}
/** Admin: create a job record from a job request and a scheduled time. */
function useCreateJobRecord() {
	const { actor } = useActor(createActor);
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (vars) => {
			if (!actor) throw new Error("Backend is not ready");
			return actor.createJobRecord(vars.jobId, vars.scheduledAt);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: adminKeys.jobRecords() });
		}
	});
}
function useAdvanceJobRecord() {
	const { actor } = useActor(createActor);
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id) => {
			if (!actor) throw new Error("Backend is not ready");
			return actor.advanceJobRecord(id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: adminKeys.jobRecords() });
		}
	});
}
function useCompleteJobRecord() {
	const { actor } = useActor(createActor);
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id) => {
			if (!actor) throw new Error("Backend is not ready");
			return actor.completeJobRecord(id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: adminKeys.jobRecords() });
		}
	});
}
function useCancelJobRecord() {
	const { actor } = useActor(createActor);
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id) => {
			if (!actor) throw new Error("Backend is not ready");
			return actor.cancelJobRecord(id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: adminKeys.jobRecords() });
		}
	});
}
export { useVerifyDeposit as C, useUpdateDiscount as S, useSetPaymentSettings as _, useCreateJobRecord as a, useSettings as b, useJobRecords as c, useRecordFinalPayment as d, useRejectDeposit as f, useSetDiscountActive as g, useSetDepositSetting as h, useCreateDiscount as i, usePaymentHistory as l, useSetBusinessSettings as m, useCancelJobRecord as n, useDeleteDiscount as o, useSetAdminSettings as p, useCompleteJobRecord as r, useDiscounts as s, useAdvanceJobRecord as t, usePaymentSummary as u, useSetQuoteSettings as v, useSubmitDeposit as x, useSetTaxSetting as y };
