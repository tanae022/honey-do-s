import { JobStatus, QuoteStatus } from "@/backend";
import { makeJob, makeQuote } from "@/test/fixtures";
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
  useSearch: () => ({}),
  useParams: () => ({ customerId: "1" }),
  useRouterState: () => ({ location: { pathname: "/admin/quotes" } }),
}));

import { QuotesPage } from "@/pages/Quotes";
import { TrackPage } from "@/pages/Track";

/**
 * Characterization baseline for the quote-email change.
 *
 * The accepted request adds an email to the customer when the owner sends a
 * quote. These tests pin the behavior that must survive that change: the admin
 * workspace still saves, sends, approves, declines and converts through the
 * generated actor; saving without sending never calls `sendQuote`; and the
 * customer Track page still looks a job up by reference code and renders the
 * same itemized quote and accept flow. They deliberately do not assert the
 * email itself, which does not exist yet.
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
});

describe("admin quote workspace (characterization)", () => {
  it("saves a new quote through setQuote then editQuote without sending it", async () => {
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

    await waitFor(() =>
      expect(actor.setQuote).toHaveBeenCalledWith(1n, 5000n, ""),
    );
    await waitFor(() => expect(actor.editQuote).toHaveBeenCalled());
    // Saving a quote must not send it to the customer.
    expect(actor.sendQuote).not.toHaveBeenCalled();
  });

  it("sends an existing quote through sendQuote and reports success", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listRequests.mockResolvedValue([
      makeJob({
        id: 1n,
        customerName: "Ada Lovelace",
        status: JobStatus.quoted,
        quote: makeQuote({ status: QuoteStatus.draft }),
      }),
    ]);
    actor.listCustomers.mockResolvedValue([]);

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

  it("approves and declines an existing quote through the actor", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listRequests.mockResolvedValue([
      makeJob({
        id: 1n,
        customerName: "Ada Lovelace",
        status: JobStatus.quoted,
        quote: makeQuote({ status: QuoteStatus.sent }),
      }),
    ]);
    actor.listCustomers.mockResolvedValue([]);

    const user = userEvent.setup();
    renderWithProviders(<QuotesPage />);

    await user.click(
      await screen.findByRole("button", { name: /ada lovelace/i }),
    );

    await user.click(screen.getByRole("button", { name: /^approve$/i }));
    await waitFor(() => expect(actor.approveQuote).toHaveBeenCalledWith(1n));

    await user.click(screen.getByRole("button", { name: /^decline$/i }));
    await waitFor(() => expect(actor.declineQuote).toHaveBeenCalledWith(1n));
  });

  it("shows the itemized customer preview with line items and totals", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listRequests.mockResolvedValue([
      makeJob({
        id: 1n,
        customerName: "Ada Lovelace",
        email: "ada@example.com",
        phone: "(555) 123-4567",
      }),
    ]);
    actor.listCustomers.mockResolvedValue([]);

    const user = userEvent.setup();
    renderWithProviders(<QuotesPage />);

    await user.click(
      await screen.findByRole("button", { name: /ada lovelace/i }),
    );

    expect(
      await screen.findByText(/how the customer reads this quote/i),
    ).toBeInTheDocument();
    expect(screen.getByText("Item")).toBeInTheDocument();
    expect(screen.getAllByText("Remaining balance").length).toBeGreaterThan(0);
    expect(screen.getAllByText("ada@example.com").length).toBeGreaterThan(0);
  });
});

describe("customer Track page (characterization)", () => {
  it("looks up a job by reference code and shows the itemized quote", async () => {
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

  it("accepts a quote by reference code and advances the job", async () => {
    const actor = setActor();
    actor.getRequestByReference.mockResolvedValue(
      makeJob({ status: JobStatus.quoted, quote: makeQuote() }),
    );

    const user = await lookupJob();
    await user.click(
      await screen.findByRole("button", { name: /accept quote/i }),
    );

    await waitFor(() =>
      expect(actor.acceptQuote).toHaveBeenCalledWith("HD-4F2A9C"),
    );
  });

  it("shows an empty state for an unknown reference code", async () => {
    setActor();
    await lookupJob("HD-NOPE00");

    expect(
      await screen.findByText(/couldn't find a job with that code/i),
    ).toBeInTheDocument();
  });

  it("shows the status timeline for the looked-up job", async () => {
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
