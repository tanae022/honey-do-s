import { JobStatus } from "@/backend";
import { makeJob, makeQuote, makeStats } from "@/test/fixtures";
import {
  installCoreInfrastructureMocks,
  renderWithProviders,
  setActor,
} from "@/test/harness";
import { screen, waitFor } from "@testing-library/react";
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

import { AdminPage } from "@/pages/Admin";

beforeEach(() => {
  setActor();
});

describe("AdminPage", () => {
  it("blocks unauthenticated visitors with a sign-in prompt", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(false);

    renderWithProviders(<AdminPage />);

    expect(
      await screen.findByRole("heading", { name: /admin access required/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/hive control/i)).not.toBeInTheDocument();
  });

  it("shows the honeycomb statistics for an admin", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.getDashboardStats.mockResolvedValue(
      makeStats({
        newRequests: 3n,
        upcomingAppointments: 2n,
        depositsCollected: 15_000n,
        activeJobs: 4n,
        reviewsCount: 1n,
      }),
    );
    actor.listRequests.mockResolvedValue([]);

    renderWithProviders(<AdminPage />);

    expect(await screen.findByText("New requests")).toBeInTheDocument();
    expect(screen.getByText("Upcoming")).toBeInTheDocument();
    expect(screen.getByText("Deposits")).toBeInTheDocument();
    expect(screen.getByText("Active jobs")).toBeInTheDocument();
    expect(screen.getByText("Reviews")).toBeInTheDocument();
    expect(await screen.findByText("$150.00")).toBeInTheDocument();
  });

  it("shows an empty state when there are no requests", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listRequests.mockResolvedValue([]);

    renderWithProviders(<AdminPage />);

    expect(await screen.findByText(/no requests yet/i)).toBeInTheDocument();
  });

  it("sets a quote on a request through the actor", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listRequests.mockResolvedValue([makeJob({ id: 7n })]);

    const user = userEvent.setup();
    renderWithProviders(<AdminPage />);

    const amount = await screen.findByLabelText(/quote amount/i);
    await user.type(amount, "120.00");
    await user.click(screen.getByRole("button", { name: /send quote/i }));

    await waitFor(() => {
      expect(actor.setQuote).toHaveBeenCalledWith(7n, 12_000n, "");
    });
  });

  it("advances a request to the next lifecycle status", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listRequests.mockResolvedValue([
      makeJob({ id: 7n, status: JobStatus.quoted, quote: makeQuote() }),
    ]);

    const user = userEvent.setup();
    renderWithProviders(<AdminPage />);

    const advance = await screen.findByRole("button", {
      name: /move to scheduled/i,
    });
    await user.click(advance);

    await waitFor(() => {
      expect(actor.advanceStatus).toHaveBeenCalledWith(7n);
    });
  });

  it("schedules an appointment through the actor", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listRequests.mockResolvedValue([makeJob({ id: 7n })]);

    const user = userEvent.setup();
    renderWithProviders(<AdminPage />);

    const input = await screen.findByLabelText(/schedule a visit/i);
    await user.type(input, "2026-10-01T10:00");
    await user.click(screen.getByRole("button", { name: /^schedule$/i }));

    await waitFor(() => {
      expect(actor.scheduleAppointment).toHaveBeenCalledTimes(1);
    });
    const [id, scheduledAt] = actor.scheduleAppointment.mock.calls[0];
    expect(id).toBe(7n);
    expect(typeof scheduledAt).toBe("bigint");
  });
});
