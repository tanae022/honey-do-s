import { JobStatus } from "@/backend";
import { makeJob } from "@/test/fixtures";
import {
  installCoreInfrastructureMocks,
  renderWithProviders,
  setActor,
} from "@/test/harness";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

installCoreInfrastructureMocks({ isAuthenticated: true });

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

/**
 * Cover for the accepted in-app new-request alert.
 *
 * While the owner is signed in with admin access and the app is open, a
 * genuinely new request arriving on a later poll raises an in-app alert that
 * names the request and links to the dashboard. The first load only seeds the
 * baseline, so opening the app never fires the alert. The alert is dismissible
 * and clears itself after a short time. A guest or non-admin never sees it.
 *
 * The backend is mocked, so these pin the observable UI contract and the
 * `listRequests` polling seam — not real canister behavior. The ding is played
 * through the Web Audio API, which jsdom does not implement, so the sound
 * itself is not asserted here.
 */
beforeEach(() => {
  setActor();
  window.localStorage.clear();
});

afterEach(() => {
  vi.useRealTimers();
});

function renderShell() {
  return renderWithProviders(
    <AppLayout>
      <div>page content</div>
    </AppLayout>,
  );
}

describe("new-request in-app alert", () => {
  it("does not alert on first load when requests already exist", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listRequests.mockResolvedValue([
      makeJob({ id: 1n, customerName: "Ada Lovelace" }),
    ]);

    renderShell();

    await waitFor(() => expect(actor.listRequests).toHaveBeenCalled());
    expect(
      document.querySelector('[data-ocid="new_request_alert"]'),
    ).toBeNull();
  });

  it("alerts on a genuinely new request and names it", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listRequests.mockResolvedValue([
      makeJob({ id: 1n, customerName: "Ada Lovelace" }),
    ]);

    renderShell();

    // First poll seeds the baseline of already-existing requests.
    await waitFor(() => expect(actor.listRequests).toHaveBeenCalled());

    // A new request arrives on the next poll.
    actor.listRequests.mockResolvedValue([
      makeJob({ id: 1n, customerName: "Ada Lovelace" }),
      makeJob({
        id: 2n,
        customerName: "Grace Hopper",
        referenceCode: "HD-9B7C1D",
        status: JobStatus.requested,
      }),
    ]);
    await vi.advanceTimersByTimeAsync(15_000);

    const alert = await waitFor(() => {
      const node = document.querySelector('[data-ocid="new_request_alert"]');
      expect(node).not.toBeNull();
      return node as HTMLElement;
    });
    expect(alert).toHaveTextContent("Grace Hopper");
    expect(alert).toHaveTextContent("Fix It");
    expect(alert).toHaveTextContent("HD-9B7C1D");
    expect(
      alert.querySelector('[data-ocid="new_request_alert.dashboard_link"]'),
    ).toHaveAttribute("href", "/admin");
  });

  it("dismisses the alert when the dismiss control is used", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listRequests.mockResolvedValue([]);

    renderShell();
    await waitFor(() => expect(actor.listRequests).toHaveBeenCalled());

    actor.listRequests.mockResolvedValue([
      makeJob({ id: 2n, customerName: "Grace Hopper" }),
    ]);
    await vi.advanceTimersByTimeAsync(15_000);

    await waitFor(() => {
      expect(
        document.querySelector('[data-ocid="new_request_alert"]'),
      ).not.toBeNull();
    });

    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    await user.click(
      document.querySelector(
        '[data-ocid="new_request_alert.dismiss_button"]',
      ) as HTMLElement,
    );

    await waitFor(() => {
      expect(
        document.querySelector('[data-ocid="new_request_alert"]'),
      ).toBeNull();
    });
  });

  it("clears the alert on its own after a short time", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listRequests.mockResolvedValue([]);

    renderShell();
    await waitFor(() => expect(actor.listRequests).toHaveBeenCalled());

    actor.listRequests.mockResolvedValue([
      makeJob({ id: 2n, customerName: "Grace Hopper" }),
    ]);
    await vi.advanceTimersByTimeAsync(15_000);

    await waitFor(() => {
      expect(
        document.querySelector('[data-ocid="new_request_alert"]'),
      ).not.toBeNull();
    });

    // The alert clears itself after NEW_REQUEST_ALERT_MS (8s).
    await vi.advanceTimersByTimeAsync(8_000);

    await waitFor(() => {
      expect(
        document.querySelector('[data-ocid="new_request_alert"]'),
      ).toBeNull();
    });
  });

  it("never alerts a non-admin visitor", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(false);
    actor.listRequests.mockResolvedValue([]);

    renderShell();
    await waitFor(() => expect(actor.isCallerAdmin).toHaveBeenCalled());

    actor.listRequests.mockResolvedValue([
      makeJob({ id: 2n, customerName: "Grace Hopper" }),
    ]);
    await vi.advanceTimersByTimeAsync(15_000);

    expect(
      document.querySelector('[data-ocid="new_request_alert"]'),
    ).toBeNull();
    // A guest never fires the admin-only request-list call.
    expect(actor.listRequests).not.toHaveBeenCalled();
  });
});
