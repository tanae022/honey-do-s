import { PocketIc } from "@dfinity/pic";
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
let actor: _SERVICE;

beforeAll(async () => {
  pic = await PocketIc.create(PIC_URL);
  if (BASELINE_WASM === undefined) {
    ({ actor } = await pic.setupCanister<_SERVICE>({
      idlFactory,
      wasm: BACKEND_WASM,
    }));
    return;
  }
  // `[baseline, current]`, the same install contract the hosted deploy uses for
  // a converted project. The upgrade replays the chain from the legacy schema.
  const installed = await pic.setupCanister<_SERVICE>({
    idlFactory,
    wasm: BASELINE_WASM,
  });
  await pic.upgradeCanister({
    canisterId: installed.canisterId,
    wasm: BACKEND_WASM,
    arg: new Uint8Array(),
  });
  actor = installed.actor;
});

afterAll(async () => {
  // `?.` because `beforeAll` may not have got that far. A failed
  // `PocketIc.create` otherwise stacks "Cannot read properties of undefined"
  // on top of the real error and buries the one line that explains the run.
  await pic?.tearDown();
});

it("rejects an admin-only read from a guest caller", async () => {
  await expect(actor.listRequests()).rejects.toThrow(/Unauthorized/i);
});

it("reports the caller is not an admin on a fresh canister", async () => {
  await expect(actor.isCallerAdmin()).resolves.toBe(false);
});

it("round-trips a guest request through the real canister", async () => {
  const referenceCode = await actor.submitRequest({
    customerName: "Ada Lovelace",
    email: "ada@example.com",
    phone: "+15551234567",
    preferredTiming: "Weekday mornings",
    description: "The kitchen faucet drips constantly.",
    photoIds: [],
    category: { fixIt: null },
    packageInterest: false,
    ownParts: false,
  });
  expect(referenceCode.length).toBeGreaterThan(0);

  const found = await actor.getRequestByReference(referenceCode);
  expect(found).toHaveLength(1);
  const view = found[0];
  expect(view).toMatchObject({
    customerName: "Ada Lovelace",
    email: "ada@example.com",
    phone: "+15551234567",
    description: "The kitchen faucet drips constantly.",
    referenceCode,
    ownParts: false,
  });
  expect(view.status).toEqual({ requested: null });
});

/**
 * The owner alert is sent from `submitRequest` before the reference code is
 * returned. A local replica has no email service, so that outcall cannot
 * succeed here — which is exactly the condition the accepted requirement
 * covers: a failed email must be caught and logged, never allowed to abort the
 * state change. A `submitRequest` that resolves and whose request is then
 * readable is the observable proof that the failure did not block creation.
 */
it("creates and returns the request even though the owner email cannot be sent locally", async () => {
  const referenceCode = await actor.submitRequest({
    customerName: "Katherine Johnson",
    email: "katherine@example.com",
    phone: "+15550001111",
    preferredTiming: "Weekday afternoons",
    description: "Please fix the back porch light.",
    photoIds: [],
    category: { fixIt: null },
    packageInterest: false,
    ownParts: false,
  });
  expect(referenceCode.length).toBeGreaterThan(0);

  const found = await actor.getRequestByReference(referenceCode);
  expect(found).toHaveLength(1);
  expect(found[0].referenceCode).toBe(referenceCode);
});

it("carries attached photo ids through the real canister", async () => {
  const referenceCode = await actor.submitRequest({
    customerName: "Dorothy Vaughan",
    email: "dorothy@example.com",
    phone: "+15550002222",
    preferredTiming: "Saturday morning",
    description: "The bathroom sink is leaking under the cabinet.",
    photoIds: ["sha256:aaa", "sha256:bbb"],
    category: { fixIt: null },
    packageInterest: false,
    ownParts: false,
  });

  const found = await actor.getRequestByReference(referenceCode);
  expect(found).toHaveLength(1);
  expect(found[0].photoIds).toEqual(["sha256:aaa", "sha256:bbb"]);
});

it("carries the own-parts flag through the real canister", async () => {
  const referenceCode = await actor.submitRequest({
    customerName: "Grace Hopper",
    email: "grace@example.com",
    phone: "+15559876543",
    preferredTiming: "Saturday afternoon",
    description: "Please mow the back yard; I have my own mower.",
    photoIds: [],
    category: { mowing: null },
    packageInterest: false,
    ownParts: true,
  });

  const found = await actor.getRequestByReference(referenceCode);
  expect(found).toHaveLength(1);
  expect(found[0].ownParts).toBe(true);
});

it("returns an empty optional for an unknown reference code", async () => {
  await expect(actor.getRequestByReference("HD-NOPE00")).resolves.toEqual([]);
});

/**
 * The bee-crew, visit-history and monthly-package surface added this build is
 * owner-only. The access-control mixin exposes no public way to grant the first
 * admin role (`assignCallerUserRole` is itself admin-gated and the initial admin
 * is passed to `MixinAuthorization` at install time), so a PocketIC lane cannot
 * bootstrap an admin caller without changing production code. Those methods are
 * covered at the frontend seam in `src/test/honeyFeatures.test.tsx` and
 * `src/test/apiContract.test.ts` instead.
 */
it("rejects the owner-only bee list from a guest caller", async () => {
  const guestPic = await PocketIc.create(PIC_URL);
  try {
    const { actor: guestActor } = await guestPic.setupCanister<_SERVICE>({
      idlFactory,
      wasm: BACKEND_WASM,
    });
    await expect(guestActor.listBees()).rejects.toThrow(/Unauthorized/i);
  } finally {
    await guestPic.tearDown();
  }
});
