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
 * The customer database, notification bell and message thread added this build
 * are exercised here against the real canister. The frontend suite mocks the
 * actor, so it passes unchanged against a backend whose customer methods are
 * unimplemented stubs; this lane is the only place the real public API runs.
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
    // schema, which backfills customer records from existing jobs.
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

it("rejects every customer read and write from a guest caller", async () => {
  await expect(guest.listCustomers(false)).rejects.toThrow(/Unauthorized/i);
  await expect(guest.searchCustomers("ada")).rejects.toThrow(/Unauthorized/i);
  await expect(guest.getCustomer(0n)).rejects.toThrow(/Unauthorized/i);
  await expect(guest.getCustomerProfile(0n)).rejects.toThrow(/Unauthorized/i);
  await expect(
    guest.createCustomer({
      fullName: "Mallory",
      email: "mallory@example.com",
      phone: "+15550009999",
      serviceAddress: "1 Intruder Way",
      preferredContact: { email: null },
    }),
  ).rejects.toThrow(/Unauthorized/i);
  await expect(guest.archiveCustomer(0n)).rejects.toThrow(/Unauthorized/i);
  await expect(guest.exportCustomersCsv()).rejects.toThrow(/Unauthorized/i);
  await expect(guest.listNotifications()).rejects.toThrow(/Unauthorized/i);
  await expect(guest.getUnreadNotificationCount()).rejects.toThrow(
    /Unauthorized/i,
  );
});

it("creates exactly one customer record for a new request and links the job", async () => {
  const referenceCode = await admin.submitRequest(
    requestInput({
      customerName: "Ada Lovelace",
      email: "ada@example.com",
      phone: "+15551234567",
    }),
  );
  expect(referenceCode.length).toBeGreaterThan(0);

  const customers = await admin.listCustomers(false);
  const ada = customers.filter((c) => c.email === "ada@example.com");
  expect(ada).toHaveLength(1);
  expect(ada[0].id).toBeGreaterThanOrEqual(0n);
  expect(ada[0].jobCount).toBe(1n);

  const profile = await admin.getCustomerProfile(ada[0].id);
  expect(profile).toHaveLength(1);
  expect(profile[0].jobs.map((job) => job.referenceCode)).toContain(
    referenceCode,
  );
});

it("attaches a second request with the same email to the existing customer", async () => {
  const before = await admin.listCustomers(false);
  const adaBefore = before.find((c) => c.email === "ada@example.com");
  expect(adaBefore).toBeDefined();

  const secondReference = await admin.submitRequest(
    requestInput({
      customerName: "Ada Lovelace",
      email: "ada@example.com",
      phone: "+15551234567",
      description: "The back gate hinge is loose.",
    }),
  );

  const after = await admin.listCustomers(false);
  const adaAfter = after.filter((c) => c.email === "ada@example.com");
  // No duplicate record was created.
  expect(adaAfter).toHaveLength(1);
  expect(adaAfter[0].id).toBe(adaBefore?.id);
  expect(adaAfter[0].jobCount).toBe(2n);

  const profile = await admin.getCustomerProfile(adaAfter[0].id);
  expect(profile[0].jobs.map((job) => job.referenceCode)).toContain(
    secondReference,
  );
});

it("matches a returning customer on phone when the email differs", async () => {
  const first = await admin.submitRequest(
    requestInput({
      customerName: "Grace Hopper",
      email: "grace@example.com",
      phone: "(555) 987-6543",
    }),
  );
  expect(first.length).toBeGreaterThan(0);

  // Same phone digits, different formatting and a different email: still the
  // same person, matched on the normalized phone.
  const second = await admin.submitRequest(
    requestInput({
      customerName: "Grace Hopper",
      email: "grace.alt@example.com",
      phone: "555.987.6543",
    }),
  );
  expect(second.length).toBeGreaterThan(0);

  const customers = await admin.listCustomers(false);
  const grace = customers.filter((c) => c.phone.includes("987"));
  expect(grace).toHaveLength(1);
  expect(grace[0].jobCount).toBe(2n);
});

it("searches the directory by name, phone, email, id and service address", async () => {
  const created = await admin.createCustomer({
    fullName: "Katherine Johnson",
    email: "katherine@example.com",
    phone: "+15550001111",
    serviceAddress: "42 Orbit Avenue",
    preferredContact: { email: null },
  });
  expect("ok" in created).toBe(true);
  if (!("ok" in created)) return;
  const id = created.ok.id;

  const byName = await admin.searchCustomers("katherine");
  expect(byName.map((c) => c.id)).toContain(id);

  const byPhone = await admin.searchCustomers("5550001111");
  expect(byPhone.map((c) => c.id)).toContain(id);

  const byEmail = await admin.searchCustomers("katherine@example.com");
  expect(byEmail.map((c) => c.id)).toContain(id);

  const byId = await admin.searchCustomers(id.toString());
  expect(byId.map((c) => c.id)).toContain(id);

  const byAddress = await admin.searchCustomers("orbit avenue");
  expect(byAddress.map((c) => c.id)).toContain(id);
});

it("groups a customer's service history and keeps it through archive and restore", async () => {
  const created = await admin.createCustomer({
    fullName: "Dorothy Vaughan",
    email: "dorothy@example.com",
    phone: "+15550002222",
    serviceAddress: "7 Compute Court",
    preferredContact: { email: null },
  });
  expect("ok" in created).toBe(true);
  if (!("ok" in created)) return;
  const id = created.ok.id;

  const jobResult = await admin.createJobForCustomer(id, {
    customerName: "ignored",
    email: "ignored@example.com",
    phone: "+10000000000",
    preferredTiming: "Saturday morning",
    description: "The bathroom sink is leaking under the cabinet.",
    photoIds: ["sha256:aaa"],
    category: { fixIt: null },
    packageInterest: false,
    ownParts: false,
  });
  expect("ok" in jobResult).toBe(true);
  if (!("ok" in jobResult)) return;
  // The job reuses the customer's stored contact information.
  expect(jobResult.ok.email).toBe("dorothy@example.com");
  expect(jobResult.ok.phone).toBe("+15550002222");

  const profile = await admin.getCustomerProfile(id);
  expect(profile).toHaveLength(1);
  expect(profile[0].pendingJobs).toHaveLength(1);
  expect(profile[0].photoIds).toContain("sha256:aaa");

  // Archive: the record and its job history remain intact.
  const archived = await admin.archiveCustomer(id);
  expect("ok" in archived).toBe(true);
  const archivedProfile = await admin.getCustomerProfile(id);
  expect(archivedProfile).toHaveLength(1);
  expect(archivedProfile[0].customer.status).toEqual({ archived: null });
  expect(archivedProfile[0].jobs).toHaveLength(1);

  // Archived customers are hidden from the default directory but present with
  // the include-archived flag.
  const defaultList = await admin.listCustomers(false);
  expect(defaultList.map((c) => c.id)).not.toContain(id);
  const withArchived = await admin.listCustomers(true);
  expect(withArchived.map((c) => c.id)).toContain(id);

  // Restore returns the customer to active with history intact.
  const restored = await admin.restoreCustomer(id);
  expect("ok" in restored).toBe(true);
  const restoredProfile = await admin.getCustomerProfile(id);
  expect(restoredProfile[0].customer.status).toEqual({ active: null });
  expect(restoredProfile[0].jobs).toHaveLength(1);
});

it("raises notifications for new and returning requests and clears the unread count", async () => {
  const before = await admin.getUnreadNotificationCount();

  await admin.submitRequest(
    requestInput({
      customerName: "Mary Jackson",
      email: "mary@example.com",
      phone: "+15550003333",
    }),
  );
  // A returning request from the same person raises a second notification.
  await admin.submitRequest(
    requestInput({
      customerName: "Mary Jackson",
      email: "mary@example.com",
      phone: "+15550003333",
    }),
  );

  const after = await admin.getUnreadNotificationCount();
  expect(after).toBeGreaterThan(before);

  const notifications = await admin.listNotifications();
  const kinds = notifications.map((n) => Object.keys(n.kind)[0]);
  expect(kinds).toContain("newCustomer");
  expect(kinds).toContain("returningCustomerRequest");

  await admin.markAllNotificationsRead();
  await expect(admin.getUnreadNotificationCount()).resolves.toBe(0n);
});

it("scopes a customer's message thread to their own reference code", async () => {
  const aliceReference = await admin.submitRequest(
    requestInput({
      customerName: "Alice Thread",
      email: "alice.thread@example.com",
      phone: "+15550004444",
    }),
  );
  const bobReference = await admin.submitRequest(
    requestInput({
      customerName: "Bob Thread",
      email: "bob.thread@example.com",
      phone: "+15550005555",
    }),
  );

  // The customer posts through their own reference code.
  const posted = await guest.postCustomerMessage(
    aliceReference,
    "Can you come Thursday?",
  );
  expect("ok" in posted).toBe(true);

  // Alice's thread shows her message; Bob's thread does not.
  const aliceThread = await guest.getCustomerMessages(aliceReference);
  expect(aliceThread.map((m) => m.body)).toContain("Can you come Thursday?");
  const bobThread = await guest.getCustomerMessages(bobReference);
  expect(bobThread.map((m) => m.body)).not.toContain("Can you come Thursday?");

  // An unknown reference code yields an empty thread rather than another
  // customer's messages.
  await expect(guest.getCustomerMessages("HD-NOPE00")).resolves.toEqual([]);
});

it("exports the customer records as CSV text", async () => {
  const csv = await admin.exportCustomersCsv();
  expect(csv).toContain("Customer ID");
  expect(csv).toContain("ada@example.com");
});
