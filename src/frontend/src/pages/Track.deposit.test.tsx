import {
  DepositStatus,
  JobStatus,
  PaymentMethod,
  type PaymentSummaryView,
} from "@/backend";
import { CASHAPP_HANDLE } from "@/lib/jobs";
import { makeJob, makeQuote } from "@/test/fixtures";
import {
  installCoreInfrastructureMocks,
  renderWithProviders,
  setActor,
} from "@/test/harness";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

installCoreInfrastructureMocks();

/** A fully-populated payment summary so a test overrides only what it asserts. */
function makePaymentSummary(
  overrides: Partial<PaymentSummaryView> = {},
): PaymentSummaryView {
  return {
    customerName: "Jamie Rivera",
    depositAmount: 2_500n,
    chimeHandle: "$honeydo-chime",
    adjustedSubtotal: 25_000n,
    venmoHandle: "@honeydo-venmo",
    depositStatus: DepositStatus.pending,
    discountAmount: 5_000n,
    finalTotal: 25_000n,
    appointmentConfirmed: false,
    serviceDescription: "Replace the kitchen faucet.",
    discountReason: "Spring promo applied",
    referenceCode: "HD-4F2A9C",
    payPalHandle: "honeydo@paypal.me",
    cashAppHandle: "$honeydo",
    remainingBalance: 22_500n,
    originalSubtotal: 30_000n,
    acceptedMethods: [
      PaymentMethod.payPal,
      PaymentMethod.cashApp,
      PaymentMethod.venmo,
      PaymentMethod.chime,
    ],
    taxAmount: 0n,
    ...overrides,
  };
}

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    to,
    children,
    ...props
  }: {
    to: string;
    children: React.ReactNode;
  }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

import { TrackPage } from "@/pages/Track";

/**
 * The deposit leg of the request -> quote -> accept -> deposit -> appointment ->
 * status -> review lifecycle. The current request adds Venmo, PayPal and Chime
 * alongside Cash App and keeps card/Stripe checkout hidden, so these assertions
 * pin the shipped manual-payment surface: the Cash App handle is shown, "I've
 * sent it" records a cashApp deposit, and no card checkout control is offered.
 * The four-option card itself is covered in `depositOptions.test.tsx`.
 */
async function lookupJob(reference = "HD-4F2A9C") {
  const user = userEvent.setup();
  renderWithProviders(<TrackPage />);
  await user.type(screen.getByLabelText(/reference code/i), reference);
  await user.click(screen.getByRole("button", { name: /find my job/i }));
  return user;
}

beforeEach(() => {
  setActor();
  window.history.replaceState({}, "", "/track");
});

afterEach(() => {
  window.history.replaceState({}, "", "/track");
});

describe("TrackPage CashApp deposit lifecycle", () => {
  it("shows the CashApp handle and records the deposit when the customer confirms sending it", async () => {
    const actor = setActor();
    actor.getRequestByReference.mockResolvedValue(
      makeJob({
        status: JobStatus.scheduled,
        quote: makeQuote({ amount: 20_000n }),
      }),
    );

    const user = await lookupJob();

    expect(await screen.findByText(CASHAPP_HANDLE)).toBeInTheDocument();
    await user.click(
      await screen.findByRole("button", { name: /i've sent it/i }),
    );

    await waitFor(() => {
      expect(actor.recordDeposit).toHaveBeenCalledWith(
        "HD-4F2A9C",
        PaymentMethod.cashApp,
      );
    });
  });

  it("does not offer a card checkout path for the deposit", async () => {
    const actor = setActor();
    actor.getRequestByReference.mockResolvedValue(
      makeJob({
        status: JobStatus.scheduled,
        quote: makeQuote({ amount: 20_000n }),
      }),
    );

    await lookupJob();

    await screen.findByText(CASHAPP_HANDLE);
    expect(
      screen.queryByRole("button", { name: /pay deposit by card/i }),
    ).not.toBeInTheDocument();
    expect(actor.createDepositCheckoutSession).not.toHaveBeenCalled();
    expect(actor.confirmDepositPayment).not.toHaveBeenCalled();
  });

  it("does not offer the deposit action once the deposit is already paid", async () => {
    const actor = setActor();
    actor.getRequestByReference.mockResolvedValue(
      makeJob({
        status: JobStatus.inProgress,
        quote: makeQuote({ amount: 20_000n }),
        deposit: {
          amount: 10_000n,
          method: PaymentMethod.cashApp,
          paid: true,
          status: DepositStatus.verified,
          paidAt: 1_700_000_200_000_000_000n,
        },
      }),
    );

    await lookupJob();

    expect(await screen.findByText(/deposit paid/i)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /i've sent it/i }),
    ).not.toBeInTheDocument();
  });

  it("shows the verified deposit state with the amount received", async () => {
    const actor = setActor();
    actor.getRequestByReference.mockResolvedValue(
      makeJob({
        status: JobStatus.inProgress,
        quote: makeQuote({ amount: 25_000n, total: 25_000n }),
      }),
    );
    actor.getPaymentSummary.mockResolvedValue(
      makePaymentSummary({
        depositStatus: DepositStatus.verified,
        depositMethod: PaymentMethod.cashApp,
      }),
    );

    await lookupJob();

    const status = await waitFor(() => {
      const node = document.querySelector('[data-ocid="track.deposit_status"]');
      expect(node).not.toBeNull();
      return node as HTMLElement;
    });
    expect(within(status).getByText(/deposit paid/i)).toBeInTheDocument();
    expect(within(status).getByText(/cash app/i)).toBeInTheDocument();
    expect(within(status).getAllByText(/\$25\.00/).length).toBeGreaterThan(0);
  });

  it("shows the rejected deposit notice and lets the customer resubmit", async () => {
    const actor = setActor();
    actor.getRequestByReference.mockResolvedValue(
      makeJob({
        status: JobStatus.scheduled,
        quote: makeQuote({ amount: 25_000n, total: 25_000n }),
      }),
    );
    actor.getPaymentSummary.mockResolvedValue(
      makePaymentSummary({ depositStatus: DepositStatus.rejected }),
    );

    const user = await lookupJob();

    expect(
      await screen.findByText(/couldn't find your last deposit/i),
    ).toBeInTheDocument();
    // A rejected deposit returns the customer to the pay-deposit state.
    await user.click(
      await screen.findByRole("button", { name: /i've paid my deposit/i }),
    );

    await waitFor(() => {
      expect(actor.submitDeposit).toHaveBeenCalledWith(
        "HD-4F2A9C",
        PaymentMethod.cashApp,
      );
    });
  });

  it("shows the deposit submitted — verifying state once the deposit is submitted", async () => {
    const actor = setActor();
    actor.getRequestByReference.mockResolvedValue(
      makeJob({
        status: JobStatus.scheduled,
        quote: makeQuote({ amount: 25_000n, total: 25_000n }),
      }),
    );
    actor.getPaymentSummary.mockResolvedValue(
      makePaymentSummary({
        depositStatus: DepositStatus.submitted,
        depositMethod: PaymentMethod.cashApp,
      }),
    );

    await lookupJob();

    // The verifying card names the submitted state and the amount awaiting
    // verification, and the pay-deposit action is no longer offered.
    expect(
      (await screen.findAllByText(/deposit submitted — verifying/i)).length,
    ).toBeGreaterThan(0);
    expect(
      screen.queryByRole("button", { name: /i've paid my deposit/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /i've sent it/i }),
    ).not.toBeInTheDocument();
  });

  it("records the legacy sent-it deposit through recordDeposit", async () => {
    const actor = setActor();
    actor.getRequestByReference.mockResolvedValue(
      makeJob({
        status: JobStatus.scheduled,
        quote: makeQuote({ amount: 25_000n, total: 25_000n }),
      }),
    );
    actor.getPaymentSummary.mockResolvedValue(makePaymentSummary());

    const user = await lookupJob();

    await user.click(
      await screen.findByRole("button", { name: /i've sent it/i }),
    );

    await waitFor(() => {
      expect(actor.recordDeposit).toHaveBeenCalledWith(
        "HD-4F2A9C",
        PaymentMethod.cashApp,
      );
    });
  });
});
