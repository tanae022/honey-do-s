import type { backendInterface } from "@/backend";
import { vi } from "vitest";

/**
 * A typed, local stand-in for the generated backend actor. Every method the
 * frontend calls is present and returns a benign default, so a test only has to
 * override the calls it actually exercises. No network, no real canister.
 */
export type MockActor = {
  [K in keyof backendInterface]: ReturnType<typeof vi.fn>;
};

export function createMockActor(
  overrides: Partial<Record<keyof backendInterface, unknown>> = {},
): MockActor {
  const actor: Record<string, ReturnType<typeof vi.fn>> = {
    acceptQuote: vi.fn().mockResolvedValue({ __kind__: "ok", ok: null }),
    addCustomerNote: vi.fn().mockResolvedValue({ __kind__: "ok", ok: null }),
    advanceJobRecord: vi.fn().mockResolvedValue({ __kind__: "ok", ok: null }),
    advanceStatus: vi.fn().mockResolvedValue({ __kind__: "ok", ok: null }),
    archiveCustomer: vi.fn().mockResolvedValue({ __kind__: "ok", ok: null }),
    assignBeeToJob: vi.fn().mockResolvedValue({ __kind__: "ok", ok: null }),
    approveQuote: vi.fn().mockResolvedValue({ __kind__: "ok", ok: null }),
    assignCallerUserRole: vi.fn().mockResolvedValue(undefined),
    cancelJob: vi.fn().mockResolvedValue({ __kind__: "ok", ok: null }),
    cancelJobRecord: vi.fn().mockResolvedValue({ __kind__: "ok", ok: null }),
    completeJobRecord: vi.fn().mockResolvedValue({ __kind__: "ok", ok: null }),
    confirmAppointment: vi.fn().mockResolvedValue({ __kind__: "ok", ok: null }),
    confirmDepositPayment: vi
      .fn()
      .mockResolvedValue({ __kind__: "ok", ok: null }),
    createBee: vi.fn().mockResolvedValue({
      __kind__: "ok",
      ok: {
        id: 1n,
        name: "Beatrice",
        specialty: "Deep cleaning & organizing",
        createdAt: 1_700_000_000_000_000_000n,
      },
    }),
    createCheckoutSession: vi.fn().mockResolvedValue(""),
    createCustomer: vi.fn().mockResolvedValue({ __kind__: "ok", ok: 1n }),
    createDiscount: vi.fn().mockResolvedValue({ __kind__: "ok", ok: null }),
    createJobRecord: vi.fn().mockResolvedValue({ __kind__: "ok", ok: null }),
    createDepositCheckoutSession: vi.fn().mockResolvedValue({
      __kind__: "ok",
      ok: "https://checkout.stripe.test",
    }),
    createJobForCustomer: vi
      .fn()
      .mockResolvedValue({ __kind__: "ok", ok: null }),
    convertQuoteToJob: vi.fn().mockResolvedValue({ __kind__: "ok", ok: null }),
    declineQuote: vi.fn().mockResolvedValue({ __kind__: "ok", ok: null }),
    deleteDiscount: vi.fn().mockResolvedValue({ __kind__: "ok", ok: null }),
    declineQuoteByReference: vi
      .fn()
      .mockResolvedValue({ __kind__: "ok", ok: null }),
    editQuote: vi.fn().mockResolvedValue({ __kind__: "ok", ok: null }),
    execute: vi.fn().mockResolvedValue({ hasMore: false, rows: [] }),
    exportCustomersCsv: vi.fn().mockResolvedValue(""),
    getApiDoc: vi.fn().mockResolvedValue(""),
    getCallerUserRole: vi.fn().mockResolvedValue("guest"),
    getCustomer: vi.fn().mockResolvedValue(null),
    getCustomerMessages: vi.fn().mockResolvedValue([]),
    getCustomerProfile: vi.fn().mockResolvedValue(null),
    getCustomerVisitHistory: vi.fn().mockResolvedValue([]),
    getDashboardStats: vi.fn().mockResolvedValue({
      newRequests: 0n,
      upcomingAppointments: 0n,
      depositsCollected: 0n,
      activeJobs: 0n,
      reviewsCount: 0n,
    }),
    getOwnerAlertEmail: vi.fn().mockResolvedValue(""),
    getOwnerAlertPhone: vi.fn().mockResolvedValue(""),
    getPaymentHistoryForJob: vi.fn().mockResolvedValue(null),
    getPaymentSummary: vi.fn().mockResolvedValue(null),
    getQuoteByReference: vi.fn().mockResolvedValue(null),
    getRequest: vi.fn().mockResolvedValue(null),
    getRequestByReference: vi.fn().mockResolvedValue(null),
    getSettings: vi.fn().mockResolvedValue(null),
    getStripeSessionStatus: vi
      .fn()
      .mockResolvedValue({ __kind__: "failed", failed: { error: "none" } }),
    getTwilioConfigStatus: vi
      .fn()
      .mockResolvedValue({ configured: false, fromNumber: "" }),
    getUnreadNotificationCount: vi.fn().mockResolvedValue(0n),
    getVisitHistory: vi.fn().mockResolvedValue([]),
    isCallerAdmin: vi.fn().mockResolvedValue(false),
    isStripeConfigured: vi.fn().mockResolvedValue(false),
    listBees: vi.fn().mockResolvedValue([]),
    listCustomerMessages: vi.fn().mockResolvedValue([]),
    listCustomers: vi.fn().mockResolvedValue([]),
    listDiscounts: vi.fn().mockResolvedValue([]),
    listJobRecords: vi.fn().mockResolvedValue([]),
    listNotifications: vi.fn().mockResolvedValue([]),
    listPaymentHistory: vi.fn().mockResolvedValue([]),
    listRequests: vi.fn().mockResolvedValue([]),
    markAllNotificationsRead: vi.fn().mockResolvedValue(undefined),
    markNotificationRead: vi
      .fn()
      .mockResolvedValue({ __kind__: "ok", ok: null }),
    postAdminMessage: vi.fn().mockResolvedValue({ __kind__: "ok", ok: null }),
    postCustomerMessage: vi
      .fn()
      .mockResolvedValue({ __kind__: "ok", ok: null }),
    raiseNotification: vi.fn().mockResolvedValue(1n),
    recordDeposit: vi.fn().mockResolvedValue({ __kind__: "ok", ok: null }),
    recordFinalPayment: vi.fn().mockResolvedValue({ __kind__: "ok", ok: null }),
    rejectDeposit: vi.fn().mockResolvedValue({ __kind__: "ok", ok: null }),
    resolveOrCreateCustomer: vi.fn().mockResolvedValue(1n),
    restoreCustomer: vi.fn().mockResolvedValue({ __kind__: "ok", ok: null }),
    scheduleAppointment: vi
      .fn()
      .mockResolvedValue({ __kind__: "ok", ok: null }),
    schema: vi.fn().mockResolvedValue(""),
    searchCustomers: vi.fn().mockResolvedValue([]),
    sendAppointmentReminder: vi
      .fn()
      .mockResolvedValue({ __kind__: "ok", ok: null }),
    sendTestAlert: vi.fn().mockResolvedValue({ __kind__: "sent", sent: null }),
    setAdminSettings: vi.fn().mockResolvedValue({ __kind__: "ok", ok: null }),
    setBusinessSettings: vi
      .fn()
      .mockResolvedValue({ __kind__: "ok", ok: null }),
    setCustomerStatus: vi.fn().mockResolvedValue({ __kind__: "ok", ok: null }),
    setDepositSetting: vi.fn().mockResolvedValue({ __kind__: "ok", ok: null }),
    setDiscountActive: vi.fn().mockResolvedValue({ __kind__: "ok", ok: null }),
    setPaymentSettings: vi.fn().mockResolvedValue({ __kind__: "ok", ok: null }),
    setQuoteSettings: vi.fn().mockResolvedValue({ __kind__: "ok", ok: null }),
    setTaxSetting: vi.fn().mockResolvedValue({ __kind__: "ok", ok: null }),
    setPackageEnrollment: vi
      .fn()
      .mockResolvedValue({ __kind__: "ok", ok: null }),
    setOwnerAlertEmail: vi
      .fn()
      .mockResolvedValue({ __kind__: "ok", ok: "owner@example.com" }),
    setOwnerAlertPhone: vi
      .fn()
      .mockResolvedValue({ __kind__: "ok", ok: "+14053124987" }),
    sendQuote: vi.fn().mockResolvedValue({ __kind__: "ok", ok: null }),
    setQuote: vi.fn().mockResolvedValue({ __kind__: "ok", ok: null }),
    setStripeConfiguration: vi.fn().mockResolvedValue(undefined),
    setTwilioCredentials: vi.fn().mockResolvedValue(undefined),
    submitDeposit: vi.fn().mockResolvedValue({ __kind__: "ok", ok: null }),
    submitRequest: vi.fn().mockResolvedValue("HD-4F2A9C"),
    submitReview: vi.fn().mockResolvedValue({ __kind__: "ok", ok: null }),
    transform: vi.fn().mockResolvedValue({
      status: 200n,
      body: new Uint8Array(),
      headers: [],
    }),
    updateBee: vi.fn().mockResolvedValue({
      __kind__: "ok",
      ok: {
        id: 1n,
        name: "Beatrice",
        specialty: "Deep cleaning & organizing",
        createdAt: 1_700_000_000_000_000_000n,
      },
    }),
    updateCustomer: vi.fn().mockResolvedValue({ __kind__: "ok", ok: null }),
    updateDiscount: vi.fn().mockResolvedValue({ __kind__: "ok", ok: null }),
    verifyDeposit: vi.fn().mockResolvedValue({ __kind__: "ok", ok: null }),
  };

  for (const [key, value] of Object.entries(overrides)) {
    actor[key] = vi.fn().mockResolvedValue(value);
  }

  return actor as unknown as MockActor;
}
