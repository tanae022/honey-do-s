import { JobStatus, PaymentMethod } from "@/backend";
import { CASHAPP_HANDLE } from "@/lib/jobs";
import { makeJob, makeQuote } from "@/test/fixtures";
import {
  installCoreInfrastructureMocks,
  renderWithProviders,
  setActor,
} from "@/test/harness";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

installCoreInfrastructureMocks();

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
});
