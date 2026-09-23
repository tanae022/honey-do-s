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
    advanceStatus: vi.fn().mockResolvedValue({ __kind__: "ok", ok: null }),
    assignBeeToJob: vi.fn().mockResolvedValue({ __kind__: "ok", ok: null }),
    assignCallerUserRole: vi.fn().mockResolvedValue(undefined),
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
    createDepositCheckoutSession: vi.fn().mockResolvedValue({
      __kind__: "ok",
      ok: "https://checkout.stripe.test",
    }),
    execute: vi.fn().mockResolvedValue({ hasMore: false, rows: [] }),
    getApiDoc: vi.fn().mockResolvedValue(""),
    getCallerUserRole: vi.fn().mockResolvedValue("guest"),
    getCustomerVisitHistory: vi.fn().mockResolvedValue([]),
    getDashboardStats: vi.fn().mockResolvedValue({
      newRequests: 0n,
      upcomingAppointments: 0n,
      depositsCollected: 0n,
      activeJobs: 0n,
      reviewsCount: 0n,
    }),
    getRequest: vi.fn().mockResolvedValue(null),
    getRequestByReference: vi.fn().mockResolvedValue(null),
    getStripeSessionStatus: vi
      .fn()
      .mockResolvedValue({ __kind__: "failed", failed: { error: "none" } }),
    getVisitHistory: vi.fn().mockResolvedValue([]),
    isCallerAdmin: vi.fn().mockResolvedValue(false),
    isStripeConfigured: vi.fn().mockResolvedValue(false),
    listBees: vi.fn().mockResolvedValue([]),
    listRequests: vi.fn().mockResolvedValue([]),
    recordDeposit: vi.fn().mockResolvedValue({ __kind__: "ok", ok: null }),
    scheduleAppointment: vi
      .fn()
      .mockResolvedValue({ __kind__: "ok", ok: null }),
    schema: vi.fn().mockResolvedValue(""),
    setPackageEnrollment: vi
      .fn()
      .mockResolvedValue({ __kind__: "ok", ok: null }),
    setQuote: vi.fn().mockResolvedValue({ __kind__: "ok", ok: null }),
    setStripeConfiguration: vi.fn().mockResolvedValue(undefined),
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
  };

  for (const [key, value] of Object.entries(overrides)) {
    actor[key] = vi.fn().mockResolvedValue(value);
  }

  return actor as unknown as MockActor;
}
