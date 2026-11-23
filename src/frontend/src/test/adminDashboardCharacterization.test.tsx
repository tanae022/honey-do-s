import { JobStatus } from "@/backend";
import { makeJob, makeStats } from "@/test/fixtures";
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

import { AppLayout } from "@/components/layout/AppLayout";
import { AdminPage } from "@/pages/Admin";
import { RequestPage } from "@/pages/Request";

/**
 * Characterization baseline for the admin dashboard and navigation the current
 * request must not break.
 *
 * The request intentionally reworks the dashboard's request list (auto-refresh,
 * a "last updated" indicator, requested-state grouping/emphasis, richer new
 * request cards) and adds a new-request badge to the Dashboard nav item. Those
 * changing surfaces are deliberately NOT asserted here. What is pinned is the
 * adjacent working behavior that must survive:
 *
 *  - the admin dashboard still renders its stats section and each request card
 *    with the customer name, reference code, status chip and quote controls;
 *  - a request in the `requested` state still renders with its "Requested"
 *    status and the customer's contact details;
 *  - the Dashboard nav item is still admin-only, and the guest nav items are
 *    unchanged;
 *  - a guest can still submit a request from /request and receive a reference
 *    code.
 */
beforeEach(() => {
  setActor();
});

describe("admin dashboard request list survives the rework", () => {
  it("still renders the stats section and each request's status and quote controls", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.getDashboardStats.mockResolvedValue(makeStats({ newRequests: 2n }));
    actor.listRequests.mockResolvedValue([
      makeJob({
        id: 7n,
        customerName: "Jamie Rivera",
        referenceCode: "HD-4F2A9C",
        status: JobStatus.requested,
      }),
    ]);

    renderWithProviders(<AdminPage />);

    // The stats section the dashboard has always shown is still present.
    expect(await screen.findByText("New requests")).toBeInTheDocument();
    expect(
      document.querySelector('[data-ocid="admin.stats_section"]'),
    ).not.toBeNull();

    // The request card still carries the customer name, reference code, status
    // chip and the quote controls the owner acts on.
    const card = await waitFor(() => {
      const node = document.querySelector('[data-ocid="admin.request_card.1"]');
      expect(node).not.toBeNull();
      return node as HTMLElement;
    });
    const scope = within(card);
    // The customer name and reference code share the card header line.
    expect(scope.getByText(/jamie rivera · HD-4F2A9C/i)).toBeInTheDocument();
    expect(
      document.querySelector('[data-ocid="admin.request_status.1"]'),
    ).toHaveTextContent(/requested/i);
    expect(scope.getByLabelText(/quote amount/i)).toBeInTheDocument();
    expect(
      scope.getByRole("button", { name: /send quote/i }),
    ).toBeInTheDocument();
  });

  it("still shows a requested job's customer contact details", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listRequests.mockResolvedValue([
      makeJob({
        id: 7n,
        status: JobStatus.requested,
        customerName: "Jamie Rivera",
        email: "jamie@example.com",
        phone: "(555) 123-4567",
      }),
    ]);

    renderWithProviders(<AdminPage />);

    await screen.findByText("jamie@example.com");
    const card = document.querySelector('[data-ocid="admin.request_card.1"]');
    expect(card).not.toBeNull();
    const scope = within(card as HTMLElement);
    expect(scope.getByText("jamie@example.com")).toBeInTheDocument();
    expect(scope.getByText("(555) 123-4567")).toBeInTheDocument();
  });

  it("still shows the empty state when there are no requests", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listRequests.mockResolvedValue([]);

    renderWithProviders(<AdminPage />);

    expect(await screen.findByText(/no requests yet/i)).toBeInTheDocument();
  });
});

describe("admin navigation gating survives the badge addition", () => {
  it("hides the Dashboard nav item from a non-admin visitor", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(false);

    renderWithProviders(
      <AppLayout>
        <div>page content</div>
      </AppLayout>,
    );

    const nav = screen.getByRole("navigation", { name: /primary/i });
    expect(
      within(nav).getByRole("link", { name: /home/i }),
    ).toBeInTheDocument();
    expect(
      within(nav).getByRole("link", { name: /new request/i }),
    ).toBeInTheDocument();
    expect(
      within(nav).getByRole("link", { name: /track job/i }),
    ).toBeInTheDocument();
    // The Dashboard item is admin-only and must stay hidden for a guest.
    await waitFor(() => {
      expect(
        within(nav).queryByRole("link", { name: /dashboard/i }),
      ).not.toBeInTheDocument();
    });
  });

  it("shows the Dashboard nav item to an admin", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);

    renderWithProviders(
      <AppLayout>
        <div>page content</div>
      </AppLayout>,
    );

    const nav = screen.getByRole("navigation", { name: /primary/i });
    expect(
      await within(nav).findByRole("link", { name: /dashboard/i }),
    ).toBeInTheDocument();
  });

  it("exposes no admin-only nav link to a guest", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(false);

    renderWithProviders(
      <AppLayout>
        <div>page content</div>
      </AppLayout>,
    );

    const nav = screen.getByRole("navigation", { name: /primary/i });
    // The guest nav is exactly the three customer-facing links; the admin menu
    // is being reorganized, so this pins the rule rather than the admin labels.
    await waitFor(() => {
      expect(
        within(nav).queryByRole("link", { name: /dashboard/i }),
      ).toBeNull();
    });
    const links = within(nav).getAllByRole("link");
    expect(links).toHaveLength(3);
    for (const link of links) {
      expect(link).toHaveAttribute("href");
      expect(link.getAttribute("href")?.startsWith("/admin")).toBe(false);
    }
  });
});

describe("guest intake still returns a reference code", () => {
  it("submits a valid request and shows the reference code", async () => {
    const actor = setActor();
    actor.submitRequest.mockResolvedValue("HD-4F2A9C");
    const user = userEvent.setup();
    renderWithProviders(<RequestPage />);

    await user.type(screen.getByLabelText(/your name/i), "Jamie Rivera");
    await user.type(screen.getByLabelText(/^email$/i), "jamie@example.com");
    await user.type(screen.getByLabelText(/^phone$/i), "(555) 123-4567");
    await user.type(
      screen.getByLabelText(/when works best/i),
      "Weekday mornings",
    );
    await user.type(
      screen.getByLabelText(/what needs doing/i),
      "The kitchen faucet drips constantly.",
    );
    await user.click(screen.getByRole("button", { name: /send my request/i }));

    expect(await screen.findByText("HD-4F2A9C")).toBeInTheDocument();
  });
});
