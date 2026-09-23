import { JobStatus, PaymentMethod } from "@/backend";
import { CASHAPP_HANDLE } from "@/lib/jobs";
import {
  makeAppointment,
  makeDeposit,
  makeJob,
  makeQuote,
  makeReview,
} from "@/test/fixtures";
import {
  installCoreInfrastructureMocks,
  renderWithProviders,
  setActor,
} from "@/test/harness";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

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

async function lookupJob(reference = "HD-4F2A9C") {
  const user = userEvent.setup();
  renderWithProviders(<TrackPage />);
  await user.type(screen.getByLabelText(/reference code/i), reference);
  await user.click(screen.getByRole("button", { name: /find my job/i }));
  return user;
}

beforeEach(() => {
  setActor();
});

describe("TrackPage", () => {
  it("shows an empty state when the reference code is unknown", async () => {
    setActor();
    await lookupJob("HD-NOPE00");

    expect(
      await screen.findByText(/couldn't find a job with that code/i),
    ).toBeInTheDocument();
  });

  it("shows the quote and an ACCEPT QUOTE action for a quoted job", async () => {
    const actor = setActor();
    actor.getRequestByReference.mockResolvedValue(
      makeJob({
        status: JobStatus.quoted,
        quote: makeQuote({ amount: 20_000n }),
      }),
    );

    await lookupJob();

    expect(await screen.findByText("Your quote")).toBeInTheDocument();
    expect(screen.getAllByText("$200.00").length).toBeGreaterThanOrEqual(1);
    expect(
      screen.getByRole("button", { name: /accept quote/i }),
    ).toBeInTheDocument();
  });

  it("accepts a quote through the actor", async () => {
    const actor = setActor();
    actor.getRequestByReference.mockResolvedValue(
      makeJob({ status: JobStatus.quoted, quote: makeQuote() }),
    );

    const user = await lookupJob();
    await user.click(
      await screen.findByRole("button", { name: /accept quote/i }),
    );

    await waitFor(() => {
      expect(actor.acceptQuote).toHaveBeenCalledWith("HD-4F2A9C");
    });
  });

  it("shows the 50% deposit and balance breakdown after acceptance", async () => {
    const actor = setActor();
    actor.getRequestByReference.mockResolvedValue(
      makeJob({
        status: JobStatus.scheduled,
        quote: makeQuote({ amount: 20_000n }),
      }),
    );

    await lookupJob();

    expect(await screen.findByText("Deposit & balance")).toBeInTheDocument();
    expect(screen.getByText("Deposit (50%)")).toBeInTheDocument();
    expect(screen.getByText("Balance due")).toBeInTheDocument();
    // $200 total → $100 deposit, $100 balance.
    expect(screen.getAllByText("$100.00").length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText(/deposit due/i)).toBeInTheDocument();
  });

  it("shows deposit paid and the balance breakdown", async () => {
    const actor = setActor();
    actor.getRequestByReference.mockResolvedValue(
      makeJob({
        status: JobStatus.inProgress,
        quote: makeQuote({ amount: 20_000n }),
        deposit: makeDeposit({ amount: 10_000n, paid: true }),
      }),
    );

    await lookupJob();

    expect(await screen.findByText(/deposit paid/i)).toBeInTheDocument();
    expect(screen.getByText(/received/i)).toBeInTheDocument();
  });

  it("shows the CashApp handle as the deposit option", async () => {
    const actor = setActor();
    actor.getRequestByReference.mockResolvedValue(
      makeJob({
        status: JobStatus.scheduled,
        quote: makeQuote({ amount: 20_000n }),
      }),
    );

    await lookupJob();

    expect(await screen.findByText(CASHAPP_HANDLE)).toBeInTheDocument();
    expect(screen.getByText(/pay by cash app/i)).toBeInTheDocument();
  });

  it("records a CashApp deposit through the actor", async () => {
    const actor = setActor();
    actor.getRequestByReference.mockResolvedValue(
      makeJob({
        status: JobStatus.scheduled,
        quote: makeQuote({ amount: 20_000n }),
      }),
    );

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

  it("shows the appointment and confirms it with CONFIRM APPOINTMENT", async () => {
    const actor = setActor();
    actor.getRequestByReference.mockResolvedValue(
      makeJob({
        status: JobStatus.scheduled,
        quote: makeQuote(),
        appointment: makeAppointment({ confirmed: false }),
      }),
    );

    const user = await lookupJob();
    const confirm = await screen.findByRole("button", {
      name: /confirm appointment/i,
    });
    await user.click(confirm);

    await waitFor(() => {
      expect(actor.confirmAppointment).toHaveBeenCalledWith("HD-4F2A9C");
    });
  });

  it("shows the lifecycle timeline with the current status", async () => {
    const actor = setActor();
    actor.getRequestByReference.mockResolvedValue(
      makeJob({ status: JobStatus.inProgress }),
    );

    await lookupJob();

    const timeline = await screen.findByRole("list");
    expect(timeline).toBeInTheDocument();
    for (const step of [
      "Requested",
      "Quoted",
      "Scheduled",
      "In Progress",
      "Completed",
    ]) {
      expect(within(timeline).getByText(step)).toBeInTheDocument();
    }
  });

  it("lets the customer submit a star rating and review after completion", async () => {
    const actor = setActor();
    actor.getRequestByReference.mockResolvedValue(
      makeJob({ status: JobStatus.completed }),
    );

    const user = await lookupJob();
    await user.click(
      await screen.findByRole("button", { name: /rate 4 out of 5/i }),
    );
    await user.type(
      screen.getByLabelText(/leave a comment/i),
      "Great work, very tidy.",
    );
    await user.click(screen.getByRole("button", { name: /submit review/i }));

    await waitFor(() => {
      expect(actor.submitReview).toHaveBeenCalledWith(
        "HD-4F2A9C",
        4n,
        "Great work, very tidy.",
      );
    });
  });

  it("shows an existing review instead of the review form", async () => {
    const actor = setActor();
    actor.getRequestByReference.mockResolvedValue(
      makeJob({
        status: JobStatus.completed,
        review: makeReview({ rating: 5n, comment: "Perfect." }),
      }),
    );

    await lookupJob();

    expect(await screen.findByText("Your review")).toBeInTheDocument();
    expect(screen.getByText("Perfect.")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /submit review/i }),
    ).not.toBeInTheDocument();
  });
});
