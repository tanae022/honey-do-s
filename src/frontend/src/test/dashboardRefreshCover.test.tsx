import { JobStatus } from "@/backend";
import { makeJob } from "@/test/fixtures";
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
  useRouterState: () => ({ location: { pathname: "/" } }),
}));

import { AppLayout } from "@/components/layout/AppLayout";
import { AdminPage } from "@/pages/Admin";

/**
 * Cover for the accepted dashboard-refresh and new-request-badge behavior.
 *
 * The dashboard polls the backend on an interval so a freshly submitted request
 * appears without a manual reload, shows a "last updated" indicator with a
 * manual refresh control, and the Dashboard nav item carries a badge counting
 * the requests still awaiting a quote. The frontend suite mocks the actor, so
 * these pin the observable UI contract, not real polling against a canister.
 */
beforeEach(() => {
  setActor();
  window.localStorage.clear();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("dashboard auto-refresh", () => {
  it("shows a last-updated indicator and a manual refresh control", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);

    renderWithProviders(<AdminPage />);

    await screen.findByText("Owner alerts");
    expect(
      document.querySelector('[data-ocid="admin.last_updated"]'),
    ).toHaveTextContent(/updated/i);
    expect(
      screen.getByRole("button", { name: /refresh requests now/i }),
    ).toBeInTheDocument();
  });

  it("re-fetches the request list on the polling interval", async () => {
    // `shouldAdvanceTime` lets React Query's internal scheduling and RTL's
    // `waitFor` keep making progress while the interval clock is controlled.
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listRequests.mockResolvedValue([]);

    renderWithProviders(<AdminPage />);

    // The initial fetch happens on mount.
    await waitFor(() => {
      expect(actor.listRequests).toHaveBeenCalled();
    });
    const initialCalls = actor.listRequests.mock.calls.length;

    // Advancing past the 15s interval triggers another poll with no user action.
    await vi.advanceTimersByTimeAsync(15_000);

    await waitFor(() => {
      expect(actor.listRequests.mock.calls.length).toBeGreaterThan(
        initialCalls,
      );
    });
  });

  it("re-fetches the request list when the manual refresh control is used", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listRequests.mockResolvedValue([]);

    renderWithProviders(<AdminPage />);

    await waitFor(() => {
      expect(actor.listRequests).toHaveBeenCalled();
    });
    const initialCalls = actor.listRequests.mock.calls.length;

    const user = userEvent.setup();
    await user.click(
      screen.getByRole("button", { name: /refresh requests now/i }),
    );

    await waitFor(() => {
      expect(actor.listRequests.mock.calls.length).toBeGreaterThan(
        initialCalls,
      );
    });
  });
});

describe("dashboard nav badge", () => {
  it("shows the count of requests awaiting a quote to an admin", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listRequests.mockResolvedValue([
      makeJob({ id: 1n, status: JobStatus.requested }),
      makeJob({ id: 2n, status: JobStatus.requested }),
      makeJob({ id: 3n, status: JobStatus.quoted }),
    ]);

    renderWithProviders(
      <AppLayout>
        <div>page content</div>
      </AppLayout>,
    );

    const nav = screen.getByRole("navigation", { name: /primary/i });
    await within(nav).findByRole("link", { name: /dashboard/i });

    const badge = await waitFor(() => {
      const node = document.querySelector(
        '[data-ocid="nav.new_request_badge"]',
      );
      expect(node).not.toBeNull();
      return node as HTMLElement;
    });
    // Only the two `requested` jobs count; the quoted one does not.
    expect(badge).toHaveTextContent("2");
  });

  it("renders no badge when no requests await a quote", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listRequests.mockResolvedValue([
      makeJob({ id: 1n, status: JobStatus.quoted }),
    ]);

    renderWithProviders(
      <AppLayout>
        <div>page content</div>
      </AppLayout>,
    );

    const nav = screen.getByRole("navigation", { name: /primary/i });
    await within(nav).findByRole("link", { name: /dashboard/i });

    await waitFor(() => {
      expect(
        document.querySelector('[data-ocid="nav.new_request_badge"]'),
      ).toBeNull();
    });
  });
});
