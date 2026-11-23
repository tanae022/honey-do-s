import { JobStatus, QuoteStatus } from "@/backend";
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
  useSearch: () => ({}),
  useParams: () => ({ customerId: "1" }),
  useRouterState: () => ({ location: { pathname: "/admin/quotes" } }),
}));

import { QuotesPage } from "@/pages/Quotes";
import { TrackPage } from "@/pages/Track";

/**
 * Cover for the accepted quote-email change.
 *
 * Sending a quote from the admin Quotes workspace now emails the customer the
 * itemized quote with absolute accept/decline links, and the emailed link opens
 * the Track page and performs the action. These tests pin the observable
 * behavior at the frontend seam: the send reports the per-channel email
 * outcome, saving without sending never emails, the emailed accept/decline
 * links drive the same actor calls as the reference-code flow, and the Track
 * page still looks a job up by reference code. The real email transport and the
 * backend's own email body are not exercised here.
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

describe("admin quote workspace — sending emails the customer", () => {
  it("reports a delivered email when sendQuote succeeds", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listRequests.mockResolvedValue([
      makeJob({
        id: 1n,
        customerName: "Ada Lovelace",
        email: "ada@example.com",
        status: JobStatus.quoted,
        quote: makeQuote({ status: QuoteStatus.draft }),
      }),
    ]);
    actor.listCustomers.mockResolvedValue([]);
    actor.sendQuote.mockResolvedValue({
      __kind__: "ok",
      ok: {
        email: { __kind__: "sent", sent: null },
        view: makeJob({ id: 1n, status: JobStatus.quoted }),
      },
    });

    const user = userEvent.setup();
    renderWithProviders(<QuotesPage />);

    await user.click(
      await screen.findByRole("button", { name: /ada lovelace/i }),
    );
    await user.click(screen.getByRole("button", { name: /send quote/i }));

    await waitFor(() => expect(actor.sendQuote).toHaveBeenCalledWith(1n));
    expect(
      await screen.findByText(/quote sent to the customer/i),
    ).toBeInTheDocument();
  });

  it("reports a failed email to the owner without losing the quote", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listRequests.mockResolvedValue([
      makeJob({
        id: 1n,
        customerName: "Ada Lovelace",
        email: "ada@example.com",
        status: JobStatus.quoted,
        quote: makeQuote({ status: QuoteStatus.draft }),
      }),
    ]);
    actor.listCustomers.mockResolvedValue([]);
    actor.sendQuote.mockResolvedValue({
      __kind__: "ok",
      ok: {
        email: { __kind__: "failed", failed: "smtp unavailable" },
        view: makeJob({ id: 1n, status: JobStatus.quoted }),
      },
    });

    const user = userEvent.setup();
    renderWithProviders(<QuotesPage />);

    await user.click(
      await screen.findByRole("button", { name: /ada lovelace/i }),
    );
    await user.click(screen.getByRole("button", { name: /send quote/i }));

    await waitFor(() => expect(actor.sendQuote).toHaveBeenCalledWith(1n));
    // The failure is surfaced to the owner, not swallowed.
    const failure = await screen.findByText(/could not be delivered/i);
    expect(failure).toBeInTheDocument();
    expect(failure).toHaveTextContent(/smtp unavailable/i);
    // The quote workspace is still rendered with its actions intact.
    expect(
      screen.getByRole("button", { name: /send quote/i }),
    ).toBeInTheDocument();
  });

  it("does not email the customer when a quote is only saved", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listRequests.mockResolvedValue([
      makeJob({ id: 1n, customerName: "Ada Lovelace" }),
    ]);
    actor.listCustomers.mockResolvedValue([]);

    const user = userEvent.setup();
    renderWithProviders(<QuotesPage />);

    await user.click(
      await screen.findByRole("button", { name: /ada lovelace/i }),
    );
    await user.type(
      screen.getByLabelText(/description of requested work/i),
      "Replace the kitchen faucet.",
    );
    await user.type(
      screen.getByLabelText(/^description$/i),
      "Replace kitchen faucet",
    );
    await user.type(screen.getByLabelText(/unit price/i), "50");
    await user.click(screen.getByRole("button", { name: /save quote/i }));

    await waitFor(() => expect(actor.editQuote).toHaveBeenCalled());
    expect(actor.sendQuote).not.toHaveBeenCalled();
  });
});

describe("emailed quote link — accept and decline", () => {
  it("accepts the quote from the emailed accept link and advances the job", async () => {
    const actor = setActor();
    actor.getRequestByReference.mockResolvedValue(
      makeJob({
        status: JobStatus.quoted,
        quote: makeQuote({ status: QuoteStatus.sent }),
      }),
    );
    actor.getQuoteByReference.mockResolvedValue({
      referenceCode: "HD-4F2A9C",
      quoteNumber: "Q-1001",
      workDescription: "Replace the kitchen faucet.",
      note: "",
      lineItems: [{ description: "Faucet", quantity: 1n, unitPrice: 5_000n }],
      laborCharge: 2_500n,
      materialsCharge: 1_000n,
      subtotal: 8_500n,
      discountApplied: false,
      discountAmount: 0n,
      total: 8_500n,
      depositRequired: 4_250n,
      remainingBalance: 4_250n,
      status: QuoteStatus.sent,
      expired: false,
    });
    actor.acceptQuote.mockResolvedValue({ __kind__: "ok", ok: null });

    window.history.replaceState(
      {},
      "",
      "/track?reference=HD-4F2A9C&action=accept",
    );
    renderWithProviders(<TrackPage />);

    // The emailed link seeds the lookup and performs the accept without a tap.
    await waitFor(() =>
      expect(actor.acceptQuote).toHaveBeenCalledWith("HD-4F2A9C"),
    );
    expect(await screen.findByText(/quote accepted/i)).toBeInTheDocument();
  });

  it("declines the quote from the emailed decline link", async () => {
    const actor = setActor();
    actor.getRequestByReference.mockResolvedValue(
      makeJob({
        status: JobStatus.quoted,
        quote: makeQuote({ status: QuoteStatus.sent }),
      }),
    );
    actor.getQuoteByReference.mockResolvedValue({
      referenceCode: "HD-4F2A9C",
      quoteNumber: "Q-1001",
      workDescription: "Replace the kitchen faucet.",
      note: "",
      lineItems: [],
      laborCharge: 0n,
      materialsCharge: 0n,
      subtotal: 20_000n,
      discountApplied: false,
      discountAmount: 0n,
      total: 20_000n,
      depositRequired: 10_000n,
      remainingBalance: 10_000n,
      status: QuoteStatus.sent,
      expired: false,
    });
    actor.declineQuoteByReference.mockResolvedValue({
      __kind__: "ok",
      ok: makeJob({ status: JobStatus.quoted }),
    });

    window.history.replaceState(
      {},
      "",
      "/track?reference=HD-4F2A9C&action=decline",
    );
    renderWithProviders(<TrackPage />);

    await waitFor(() =>
      expect(actor.declineQuoteByReference).toHaveBeenCalledWith("HD-4F2A9C"),
    );
    expect(await screen.findByText(/quote declined/i)).toBeInTheDocument();
  });
});

describe("Track page — reference-code flow still works", () => {
  it("looks up a job by reference code and shows the same itemized quote", async () => {
    const actor = setActor();
    actor.getRequestByReference.mockResolvedValue(
      makeJob({
        status: JobStatus.quoted,
        quote: makeQuote({
          status: QuoteStatus.sent,
          workDescription: "Replace the kitchen faucet.",
          lineItems: [
            { description: "Faucet", quantity: 1n, unitPrice: 5_000n },
          ],
          laborCharge: 2_500n,
          materialsCharge: 1_000n,
          subtotal: 8_500n,
          total: 8_500n,
          depositRequired: 4_250n,
          remainingBalance: 4_250n,
        }),
      }),
    );

    await lookupJob();

    expect(await screen.findByText("Your quote")).toBeInTheDocument();
    expect(screen.getByText("Replace the kitchen faucet.")).toBeInTheDocument();
    expect(screen.getByText("Faucet")).toBeInTheDocument();
    expect(screen.getByText("Labor")).toBeInTheDocument();
    expect(screen.getByText("Materials")).toBeInTheDocument();
    expect(screen.getByText("Subtotal")).toBeInTheDocument();
    expect(screen.getByText("Deposit required")).toBeInTheDocument();
    expect(screen.getByText("Remaining balance")).toBeInTheDocument();
  });

  it("shows the lifecycle status timeline for the looked-up job", async () => {
    const actor = setActor();
    actor.getRequestByReference.mockResolvedValue(
      makeJob({ status: JobStatus.inProgress }),
    );

    await lookupJob();

    const timeline = await screen.findByRole("list");
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
});
