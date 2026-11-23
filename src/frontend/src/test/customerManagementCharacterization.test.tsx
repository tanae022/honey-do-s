import { JobStatus } from "@/backend";
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
  useRouterState: () => ({ location: { pathname: "/" } }),
}));

import { AdminPage } from "@/pages/Admin";
import { TrackPage } from "@/pages/Track";

/**
 * Characterization baseline for existing behavior the customer-management
 * request must not break.
 *
 * The request adds a customer directory, customer profiles, a notification bell
 * and new backend customer/notification/message endpoints, and reworks the
 * admin dashboard layout. Those changing surfaces are deliberately NOT asserted
 * here. What is pinned is the adjacent working behavior that must survive:
 *
 *  - the guest Track page still resolves a reference code through the backend
 *    and still shows a recoverable error state when that lookup fails;
 *  - the admin dashboard still separates requests awaiting a quote from the
 *    in-progress/completed group, so the owner's existing triage is unchanged.
 */
beforeEach(() => {
  setActor();
  window.history.replaceState({}, "", "/track");
});

async function lookupJob(reference = "HD-4F2A9C") {
  const user = userEvent.setup();
  renderWithProviders(<TrackPage />);
  await user.type(screen.getByLabelText(/reference code/i), reference);
  await user.click(screen.getByRole("button", { name: /find my job/i }));
  return user;
}

describe("guest reference-code lookup survives the customer work", () => {
  it("shows a recoverable error state when the lookup fails", async () => {
    const actor = setActor();
    actor.getRequestByReference.mockRejectedValue(new Error("boom"));

    await lookupJob();

    expect(
      await screen.findByText(/something went wrong looking up that code/i),
    ).toBeInTheDocument();
    // The lookup was actually attempted with the entered code.
    expect(actor.getRequestByReference).toHaveBeenCalledWith("HD-4F2A9C");
  });

  it("still resolves a known reference code to the job detail", async () => {
    const actor = setActor();
    actor.getRequestByReference.mockResolvedValue(
      makeJob({ status: JobStatus.quoted, quote: makeQuote() }),
    );

    await lookupJob();

    expect(await screen.findByText("Your quote")).toBeInTheDocument();
    expect(actor.getRequestByReference).toHaveBeenCalledWith("HD-4F2A9C");
  });
});

describe("admin request triage grouping survives the dashboard rework", () => {
  it("separates awaiting-quote requests from in-progress ones", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listRequests.mockResolvedValue([
      makeJob({ id: 1n, customerName: "Awaiting Customer" }),
      makeJob({
        id: 2n,
        customerName: "Working Customer",
        status: JobStatus.inProgress,
        quote: makeQuote(),
      }),
    ]);

    renderWithProviders(<AdminPage />);

    const awaiting = await waitFor(() => {
      const node = document.querySelector(
        '[data-ocid="admin.awaiting_quote_section"]',
      );
      expect(node).not.toBeNull();
      return node as HTMLElement;
    });
    expect(
      within(awaiting).getByRole("heading", { name: /awaiting your quote/i }),
    ).toBeInTheDocument();
    // The requested job's card lives in the awaiting-quote section.
    const awaitingCard = within(awaiting).getByText(
      /awaiting customer · HD-4F2A9C/i,
    );
    expect(awaitingCard).toBeInTheDocument();

    const inProgress = await waitFor(() => {
      const node = document.querySelector(
        '[data-ocid="admin.in_progress_section"]',
      );
      expect(node).not.toBeNull();
      return node as HTMLElement;
    });
    expect(
      within(inProgress).getByText(/working customer · HD-4F2A9C/i),
    ).toBeInTheDocument();
    // The in-progress request is not misfiled under awaiting-quote.
    expect(
      within(awaiting).queryByText(/working customer · HD-4F2A9C/i),
    ).not.toBeInTheDocument();
  });
});
