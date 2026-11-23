import { PocketIc, createIdentity } from "@dfinity/pic";
import type { Actor } from "@dfinity/pic";
import { afterAll, beforeAll, expect, it } from "vitest";

import { idlFactory } from "../../src/frontend/src/declarations/backend.did.js";
import type { _SERVICE } from "../../src/frontend/src/declarations/backend.did";

const PIC_URL = process.env.POCKET_IC_URL ?? "";
const BACKEND_WASM = process.env.BACKEND_WASM ?? "";
// Set only on a converted project: the last pre-EM revision, whose schema this
// app's migration chain replays from. Installing the current wasm onto an empty
// canister there traps IC0503 before any test runs.
const BASELINE_WASM = process.env.BACKEND_WASM_BASELINE;

let pic: PocketIc | undefined;
let canisterId: Awaited<ReturnType<PocketIc["createCanister"]>>;
let admin: Actor<_SERVICE>;
let guest: Actor<_SERVICE>;

const alice = createIdentity("alice");
const bob = createIdentity("bob");

/**
 * The admin console surface added this build — deposits with a submitted/
 * verifying state, payment history, job records, discount rules and the
 * settings bundle — is exercised here against the real canister. The frontend
 * suite mocks the actor, so it passes unchanged against a backend whose new
 * methods are unimplemented stubs; this lane is the only place the real public
 * API runs.
 *
 * The access-control mixin exposes `_initialize_access_control`, and the first
 * caller to invoke it becomes the administrator. That is the public flow the
 * app itself uses, so the lane bootstraps an admin through it rather than
 * reaching into production state.
 */
beforeAll(async () => {
  pic = await PocketIc.create(PIC_URL);
  if (BASELINE_WASM === undefined) {
    const installed = await pic.setupCanister<_SERVICE>({
      idlFactory,
      wasm: BACKEND_WASM,
    });
    canisterId = installed.canisterId;
    admin = installed.actor;
  } else {
    // `[baseline, current]`, the same install contract the hosted deploy uses
    // for a converted project. The upgrade replays the chain from the legacy
    // schema.
    const installed = await pic.setupCanister<_SERVICE>({
      idlFactory,
      wasm: BASELINE_WASM,
    });
    await pic.upgradeCanister({
      canisterId: installed.canisterId,
      wasm: BACKEND_WASM,
      arg: new Uint8Array(),
    });
    canisterId = installed.canisterId;
    admin = installed.actor;
  }

  // The first initialized caller becomes the administrator.
  admin.setIdentity(alice);
  await admin._initialize_access_control();
  await expect(admin.isCallerAdmin()).resolves.toBe(true);

  // A separate, never-initialized caller stays a guest.
  guest = pic.createActor<_SERVICE>(idlFactory, canisterId);
  guest.setIdentity(bob);
});

afterAll(async () => {
  await pic?.tearDown();
});

const requestInput = (overrides: {
  customerName: string;
  email: string;
  phone: string;
  description?: string;
}) => ({
  customerName: overrides.customerName,
  email: overrides.email,
  phone: overrides.phone,
  preferredTiming: "Weekday mornings",
  description: overrides.description ?? "The kitchen faucet drips constantly.",
  photoIds: [] as string[],
  category: { fixIt: null },
  packageInterest: false,
  ownParts: false,
});

/**
 * Drive a job from a fresh request to an approved quote so the deposit flow has
 * a final total to take 10% of. Returns the reference code and the job id.
 */
async function requestWithApprovedQuote(
  name: string,
  email: string,
  phone: string,
  amount: bigint,
): Promise<{ referenceCode: string; jobId: bigint }> {
  const referenceCode = await admin.submitRequest(
    requestInput({ customerName: name, email, phone }),
  );
  const found = await admin.getRequestByReference(referenceCode);
  expect(found).toHaveLength(1);
  const jobId = found[0].id;

  const quoted = await admin.setQuote(jobId, amount, "Approved scope of work.");
  expect("ok" in quoted).toBe(true);

  const approved = await admin.approveQuote(jobId);
  expect("ok" in approved).toBe(true);
  return { referenceCode, jobId };
}

it("rejects every new admin-console read and write from a guest caller", async () => {
  await expect(guest.getSettings()).rejects.toThrow(/Unauthorized/i);
  await expect(guest.listDiscounts()).rejects.toThrow(/Unauthorized/i);
  await expect(guest.listPaymentHistory()).rejects.toThrow(/Unauthorized/i);
  await expect(guest.listJobRecords()).rejects.toThrow(/Unauthorized/i);
  await expect(guest.verifyDeposit("HD-NOPE00")).rejects.toThrow(
    /Unauthorized/i,
  );
  await expect(guest.rejectDeposit("HD-NOPE00")).rejects.toThrow(
    /Unauthorized/i,
  );
  await expect(
    guest.createDiscount({
      name: "Guest discount",
      kind: { percentage: null },
      value: 10n,
      active: true,
      startAt: [],
      endAt: [],
      eligibility: { all: null },
      minPurchase: 0n,
      maxDiscount: 0n,
    }),
  ).rejects.toThrow(/Unauthorized/i);
  await expect(
    guest.setTaxSetting({ enabled: true, ratePercent: 5n }),
  ).rejects.toThrow(/Unauthorized/i);
  await expect(guest.setDepositSetting({ percent: 10n })).rejects.toThrow(
    /Unauthorized/i,
  );
});

it("computes a 10% deposit and remaining balance on an approved quote", async () => {
  const { referenceCode } = await requestWithApprovedQuote(
    "Ada Lovelace",
    "ada@example.com",
    "+15551234567",
    30_000n,
  );

  const summary = await admin.getPaymentSummary(referenceCode);
  expect(summary).toHaveLength(1);
  const view = summary[0];
  // $300 final total -> $30 deposit (10%) -> $270 remaining.
  expect(view.finalTotal).toBe(30_000n);
  expect(view.depositAmount).toBe(3_000n);
  expect(view.remainingBalance).toBe(27_000n);
  expect(view.depositStatus).toEqual({ pending: null });
  expect(view.appointmentConfirmed).toBe(false);

  // The customer payment page reads the summary as a guest, scoped to the
  // reference code they hold; an unknown code yields nothing.
  const guestView = await guest.getPaymentSummary(referenceCode);
  expect(guestView).toHaveLength(1);
  expect(guestView[0].finalTotal).toBe(30_000n);
  await expect(guest.getPaymentSummary("HD-NOPE00")).resolves.toEqual([]);
});

it("moves a deposit through submitted, verified and rejected states", async () => {
  const { referenceCode } = await requestWithApprovedQuote(
    "Grace Hopper",
    "grace@example.com",
    "+15559876543",
    20_000n,
  );

  // The customer submits the deposit with a chosen method; it is not paid yet.
  const submitted = await guest.submitDeposit(referenceCode, { cashApp: null });
  expect("ok" in submitted).toBe(true);
  if (!("ok" in submitted)) return;
  expect(submitted.ok.deposit?.[0]?.status).toEqual({ submitted: null });
  expect(submitted.ok.deposit?.[0]?.paid).toBe(false);

  // A submitted deposit is not a confirmed booking until the owner verifies it.
  const awaiting = await admin.getPaymentSummary(referenceCode);
  expect(awaiting[0].depositStatus).toEqual({ submitted: null });
  expect(awaiting[0].appointmentConfirmed).toBe(false);

  // The owner rejects it: the deposit returns to rejected and stays unpaid.
  const rejected = await admin.rejectDeposit(referenceCode);
  expect("ok" in rejected).toBe(true);
  if (!("ok" in rejected)) return;
  expect(rejected.ok.deposit?.[0]?.status).toEqual({ rejected: null });
  expect(rejected.ok.deposit?.[0]?.paid).toBe(false);

  // The customer resubmits, and the owner confirms it.
  await guest.submitDeposit(referenceCode, { venmo: null });
  const verified = await admin.verifyDeposit(referenceCode);
  expect("ok" in verified).toBe(true);
  if (!("ok" in verified)) return;
  expect(verified.ok.deposit?.[0]?.status).toEqual({ verified: null });
  expect(verified.ok.deposit?.[0]?.paid).toBe(true);

  const confirmed = await admin.getPaymentSummary(referenceCode);
  expect(confirmed[0].depositStatus).toEqual({ verified: null });
  expect(confirmed[0].depositMethod).toEqual([{ venmo: null }]);
});

it("stores a permanent payment-history entry with the full breakdown", async () => {
  const { referenceCode, jobId } = await requestWithApprovedQuote(
    "Katherine Johnson",
    "katherine@example.com",
    "+15550001111",
    30_000n,
  );

  await guest.submitDeposit(referenceCode, { payPal: null });
  await admin.verifyDeposit(referenceCode);

  const history = await admin.listPaymentHistory();
  const entry = history.find((h) => h.referenceCode === referenceCode);
  expect(entry).toBeDefined();
  if (entry === undefined) return;
  expect(entry.originalQuote).toBe(30_000n);
  expect(entry.finalQuote).toBe(30_000n);
  expect(entry.depositAmount).toBe(3_000n);
  expect(entry.remainingBalance).toBe(27_000n);
  expect(entry.paymentMethod).toEqual({ payPal: null });
  expect(entry.depositStatus).toEqual({ verified: null });
  // Only a verified deposit counts toward the total paid.
  expect(entry.totalPaid).toBe(3_000n);

  const forJob = await admin.getPaymentHistoryForJob(jobId);
  expect(forJob).toHaveLength(1);
  expect(forJob[0].referenceCode).toBe(referenceCode);
});

it("records a final payment and adds it to the total paid", async () => {
  const { referenceCode, jobId } = await requestWithApprovedQuote(
    "Dorothy Vaughan",
    "dorothy@example.com",
    "+15550002222",
    30_000n,
  );

  await guest.submitDeposit(referenceCode, { chime: null });
  await admin.verifyDeposit(referenceCode);

  const recorded = await admin.recordFinalPayment(jobId, 27_000n, {
    chime: null,
  });
  expect("ok" in recorded).toBe(true);
  if (!("ok" in recorded)) return;
  expect(recorded.ok.finalPayment).toBe(27_000n);
  // Verified deposit ($30) plus the final payment ($270) is the full $300.
  expect(recorded.ok.totalPaid).toBe(30_000n);
  expect(recorded.ok.remainingBalance).toBe(27_000n);
});

it("creates a job record from a confirmed request and advances it to completion", async () => {
  const { referenceCode, jobId } = await requestWithApprovedQuote(
    "Mary Jackson",
    "mary@example.com",
    "+15550003333",
    30_000n,
  );

  await guest.submitDeposit(referenceCode, { cashApp: null });
  await admin.verifyDeposit(referenceCode);

  const created = await admin.createJobRecord(jobId, 1_700_000_000_000_000_000n);
  expect("ok" in created).toBe(true);
  if (!("ok" in created)) return;
  const recordId = created.ok.id;
  expect(created.ok.customerName).toBe("Mary Jackson");
  expect(created.ok.referenceCode).toBe(referenceCode);
  expect(created.ok.status).toEqual({ scheduled: null });
  expect(created.ok.remainingBalance).toBe(27_000n);

  const advanced = await admin.advanceJobRecord(recordId);
  expect("ok" in advanced).toBe(true);
  if (!("ok" in advanced)) return;
  expect(advanced.ok.status).toEqual({ inProgress: null });

  const completed = await admin.completeJobRecord(recordId);
  expect("ok" in completed).toBe(true);
  if (!("ok" in completed)) return;
  expect(completed.ok.status).toEqual({ completed: null });
  expect(completed.ok.completedAt).not.toEqual([]);

  const records = await admin.listJobRecords();
  expect(records.map((r) => r.id)).toContain(recordId);
});

it("creates, activates, deactivates and deletes a discount rule", async () => {
  const created = await admin.createDiscount({
    name: "Spring 10%",
    kind: { percentage: null },
    value: 10n,
    active: true,
    startAt: [],
    endAt: [],
    eligibility: { all: null },
    minPurchase: 0n,
    maxDiscount: 0n,
  });
  expect("ok" in created).toBe(true);
  if (!("ok" in created)) return;
  const id = created.ok.id;
  expect(created.ok.active).toBe(true);

  const deactivated = await admin.setDiscountActive(id, false);
  expect("ok" in deactivated).toBe(true);
  if (!("ok" in deactivated)) return;
  expect(deactivated.ok.active).toBe(false);

  const listed = await admin.listDiscounts();
  expect(listed.map((d) => d.id)).toContain(id);

  const deleted = await admin.deleteDiscount(id);
  expect("ok" in deleted).toBe(true);
  const afterDelete = await admin.listDiscounts();
  expect(afterDelete.map((d) => d.id)).not.toContain(id);
});

it("applies an active eligible discount to a quote and reports why", async () => {
  const created = await admin.createDiscount({
    name: "Always $50 off",
    kind: { fixed: null },
    value: 5_000n,
    active: true,
    startAt: [],
    endAt: [],
    eligibility: { all: null },
    minPurchase: 0n,
    maxDiscount: 0n,
  });
  expect("ok" in created).toBe(true);

  const referenceCode = await admin.submitRequest(
    requestInput({
      customerName: "Discount Diner",
      email: "discount@example.com",
      phone: "+15550007777",
    }),
  );
  const found = await admin.getRequestByReference(referenceCode);
  const jobId = found[0].id;
  await admin.setQuote(jobId, 30_000n, "Discounted scope.");
  await admin.approveQuote(jobId);

  const summary = await admin.getPaymentSummary(referenceCode);
  expect(summary).toHaveLength(1);
  const view = summary[0];
  // $300 subtotal - $50 discount = $250 final; 10% deposit is $25.
  expect(view.discountAmount).toBe(5_000n);
  expect(view.finalTotal).toBe(25_000n);
  expect(view.depositAmount).toBe(2_500n);
  expect(view.remainingBalance).toBe(22_500n);
  expect(view.discountReason.length).toBeGreaterThan(0);
});

it("reads and updates the settings bundle", async () => {
  const settings = await admin.getSettings();
  // The default deposit is exactly 10%.
  expect(settings.deposit.percent).toBe(10n);

  const tax = await admin.setTaxSetting({ enabled: true, ratePercent: 7n });
  expect("ok" in tax).toBe(true);
  if (!("ok" in tax)) return;
  expect(tax.ok).toEqual({ enabled: true, ratePercent: 7n });

  const deposit = await admin.setDepositSetting({ percent: 10n });
  expect("ok" in deposit).toBe(true);

  const updated = await admin.getSettings();
  expect(updated.tax).toEqual({ enabled: true, ratePercent: 7n });
  expect(updated.deposit.percent).toBe(10n);
});
