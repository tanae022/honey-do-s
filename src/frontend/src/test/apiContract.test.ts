import type { backendInterface } from "@/backend";
import { JobStatus, PaymentMethod, ServiceCategory } from "@/backend";
import { createMockActor } from "@/test/mockActor";
import { describe, expect, it } from "vitest";

/**
 * The typed consumer contract between the frontend and the generated backend
 * actor. The frontend suite mocks the actor, so these assertions pin the exact
 * method names, argument shapes, and return shapes the UI depends on. A backend
 * that renames a method, changes an argument, or returns a different variant
 * breaks the app even though every mocked component test still passes.
 *
 * This is a compile-time and shape contract, not proof the canister implements
 * it: the real backend is exercised only by the PocketIC lane.
 */
type ActorMethodName = keyof backendInterface;

const LIFECYCLE_METHODS: ActorMethodName[] = [
  "submitRequest",
  "getRequestByReference",
  "acceptQuote",
  "createDepositCheckoutSession",
  "confirmDepositPayment",
  "recordDeposit",
  "confirmAppointment",
  "submitReview",
  "listRequests",
  "getRequest",
  "setQuote",
  "scheduleAppointment",
  "advanceStatus",
  "getDashboardStats",
];

/** The bee-crew, visit-history and monthly-package methods added this build. */
const HONEY_METHODS: ActorMethodName[] = [
  "createBee",
  "updateBee",
  "listBees",
  "assignBeeToJob",
  "setPackageEnrollment",
  "getVisitHistory",
  "getCustomerVisitHistory",
];

describe("backend actor consumer contract", () => {
  it("exposes every method the lifecycle depends on", () => {
    const actor = createMockActor();
    for (const method of LIFECYCLE_METHODS) {
      expect(typeof actor[method]).toBe("function");
    }
  });

  it("exposes every bee, visit-history and package method the UI calls", () => {
    const actor = createMockActor();
    for (const method of HONEY_METHODS) {
      expect(typeof actor[method]).toBe("function");
    }
  });

  it("creates a bee with a name and specialty", async () => {
    const actor = createMockActor();
    const input: Parameters<backendInterface["createBee"]>[0] = {
      name: "Beatrice",
      specialty: "Deep cleaning & organizing",
    };
    await actor.createBee(input);
    expect(actor.createBee).toHaveBeenCalledWith(input);
  });

  it("assigns a bee to a job by bigint ids", async () => {
    const actor = createMockActor();
    await actor.assignBeeToJob(7n, 3n);
    expect(actor.assignBeeToJob).toHaveBeenCalledWith(7n, 3n);
  });

  it("enrolls a customer in the monthly package with a boolean flag", async () => {
    const actor = createMockActor();
    await actor.setPackageEnrollment(7n, true);
    expect(actor.setPackageEnrollment).toHaveBeenCalledWith(7n, true);
  });

  it("reads visit history as records carrying date, service and bee", async () => {
    const actor = createMockActor();
    actor.getVisitHistory.mockResolvedValue([
      {
        jobId: 1n,
        referenceCode: "HD-4F2A9C",
        service: ServiceCategory.fixIt,
        beeId: 1n,
        beeName: "Beatrice",
        completedAt: 1_700_000_400_000_000_000n,
      },
    ]);

    const visits = await actor.getVisitHistory("HD-4F2A9C");
    expect(visits).toHaveLength(1);
    expect(visits[0]).toMatchObject({
      service: ServiceCategory.fixIt,
      beeName: "Beatrice",
    });
    expect(typeof visits[0].completedAt).toBe("bigint");
  });

  it("submits a request with the exact guest input shape", async () => {
    const actor = createMockActor();
    const input: Parameters<backendInterface["submitRequest"]>[0] = {
      customerName: "Jamie Rivera",
      email: "jamie@example.com",
      phone: "(555) 123-4567",
      preferredTiming: "Weekday mornings",
      description: "The kitchen faucet drips constantly.",
      photoIds: ["blob-1"],
      category: ServiceCategory.fixIt,
      packageInterest: false,
      ownParts: true,
    };

    await actor.submitRequest(input);

    expect(actor.submitRequest).toHaveBeenCalledWith(input);
  });

  it("carries the own-parts flag and the quote discount fields", async () => {
    const actor = createMockActor();
    actor.getRequestByReference.mockResolvedValue({
      id: 1n,
      customerName: "Jamie Rivera",
      status: JobStatus.quoted,
      preferredTiming: "Weekday mornings",
      createdAt: 1_700_000_000_000_000_000n,
      description: "The kitchen faucet drips constantly.",
      photoIds: [],
      email: "jamie@example.com",
      referenceCode: "HD-4F2A9C",
      category: ServiceCategory.fixIt,
      phone: "(555) 123-4567",
      ownParts: true,
      quote: {
        amount: 18_000n,
        note: "Includes a two-hour visit.",
        sentAt: 1_700_000_100_000_000_000n,
        discountApplied: true,
        discountAmount: 2_000n,
      },
    });

    const view = await actor.getRequestByReference("HD-4F2A9C");
    expect(view?.ownParts).toBe(true);
    expect(view?.quote?.discountApplied).toBe(true);
    expect(view?.quote?.discountAmount).toBe(2_000n);
  });

  it("accepts a quote by reference code and returns a result variant", async () => {
    const actor = createMockActor();
    const result = await actor.acceptQuote("HD-4F2A9C");
    expect(result.__kind__).toBe("ok");
  });

  it("records a CashApp deposit with the payment method enum", async () => {
    const actor = createMockActor();
    await actor.recordDeposit("HD-4F2A9C", PaymentMethod.cashApp);
    expect(actor.recordDeposit).toHaveBeenCalledWith(
      "HD-4F2A9C",
      PaymentMethod.cashApp,
    );
  });

  it("sets a quote with a bigint amount in cents", async () => {
    const actor = createMockActor();
    await actor.setQuote(7n, 12_000n, "Includes parts.");
    expect(actor.setQuote).toHaveBeenCalledWith(7n, 12_000n, "Includes parts.");
  });

  it("schedules an appointment with a nanosecond bigint timestamp", async () => {
    const actor = createMockActor();
    await actor.scheduleAppointment(7n, 1_700_000_300_000_000_000n);
    expect(actor.scheduleAppointment).toHaveBeenCalledWith(
      7n,
      1_700_000_300_000_000_000n,
    );
  });

  it("submits a review with a bigint rating", async () => {
    const actor = createMockActor();
    await actor.submitReview("HD-4F2A9C", 4n, "Great work.");
    expect(actor.submitReview).toHaveBeenCalledWith(
      "HD-4F2A9C",
      4n,
      "Great work.",
    );
  });

  it("reads dashboard stats as bigint counters", async () => {
    const actor = createMockActor();
    const stats = await actor.getDashboardStats();
    expect(typeof stats.newRequests).toBe("bigint");
    expect(typeof stats.depositsCollected).toBe("bigint");
  });

  it("returns a job view whose status is a JobStatus enum value", async () => {
    const actor = createMockActor();
    actor.getRequestByReference.mockResolvedValue({
      id: 1n,
      customerName: "Jamie Rivera",
      status: JobStatus.quoted,
      preferredTiming: "Weekday mornings",
      createdAt: 1_700_000_000_000_000_000n,
      description: "The kitchen faucet drips constantly.",
      photoIds: [],
      email: "jamie@example.com",
      referenceCode: "HD-4F2A9C",
      category: ServiceCategory.fixIt,
      phone: "(555) 123-4567",
    });

    const view = await actor.getRequestByReference("HD-4F2A9C");
    expect(view?.status).toBe(JobStatus.quoted);
  });
});
