import { JobStatus } from "@/backend";
import { PACKAGE_BILLING_NOTE } from "@/lib/jobs";
import { makeJob, makePackage } from "@/test/fixtures";
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
import { HomePage } from "@/pages/Home";
import { TrackPage } from "@/pages/Track";

/**
 * Characterization baseline for the behavior the current request must keep
 * while it removes the fixed monthly price, adds an app-wide text outline, and
 * enlarges the header logo.
 *
 * The changing surfaces are deliberately NOT asserted here: no test pins the
 * `$199.00/month` value, the text-stroke CSS, or the logo's pixel size. What is
 * pinned is the adjacent working behavior that must survive:
 *
 *  - Home still says a monthly package exists and is priced per customer, and
 *    still shows included visits and the "Ask about the package" CTA;
 *  - the Track package card still shows status and included visits;
 *  - the Admin package panel still shows included visits and still enrolls and
 *    cancels through the actor;
 *  - the header still exposes its nav, sign-in control and mobile menu.
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

describe("Home monthly package offer survives without a fixed price", () => {
  it("still states a monthly package exists and is priced per customer", () => {
    renderWithProviders(<HomePage />);

    expect(
      screen.getByRole("heading", { name: /monthly package/i }),
    ).toBeInTheDocument();
    // The package is still described as a monthly arrangement whose rate is
    // set with the owner — now with no advertised dollar amount.
    expect(
      screen.getByText(/priced for your home, set up with the owner/i),
    ).toBeInTheDocument();
    expect(screen.queryByText(/\$\d/)).not.toBeInTheDocument();
  });

  it("still shows included visits and the Ask about the package CTA", () => {
    renderWithProviders(<HomePage />);

    const section = document.querySelector(
      '[data-ocid="home.package_section"]',
    );
    expect(section).not.toBeNull();
    const scope = within(section as HTMLElement);

    // Included visits are still advertised.
    expect(scope.getByText(/visits included each month/i)).toBeInTheDocument();

    // The package CTA still routes to the request form.
    const cta = scope.getByRole("link", { name: /ask about the package/i });
    expect(cta).toHaveAttribute("href", "/request");

    // The manual-billing note is unchanged.
    expect(scope.getByText(PACKAGE_BILLING_NOTE)).toBeInTheDocument();
  });
});

describe("Track package card survives without a monthly price value", () => {
  it("still shows the package status and included visits", async () => {
    const actor = setActor();
    actor.getRequestByReference.mockResolvedValue(
      makeJob({
        status: JobStatus.scheduled,
        packageEnrollment: makePackage({ active: true, includedVisits: 4n }),
      }),
    );

    await lookupJob();

    const card = await waitFor(() => {
      const node = document.querySelector('[data-ocid="track.package_card"]');
      expect(node).not.toBeNull();
      return node as HTMLElement;
    });
    const scope = within(card);

    expect(scope.getByText("Monthly package")).toBeInTheDocument();
    expect(scope.getByText("Active")).toBeInTheDocument();
    expect(
      scope.getByText(/4 visits included each month/i),
    ).toBeInTheDocument();
    // The billing note now shares its paragraph with the per-customer rate
    // sentence, so match it as a substring of that paragraph.
    expect(
      scope.getByText((content) => content.includes(PACKAGE_BILLING_NOTE)),
    ).toBeInTheDocument();
  });

  it("still shows a paused package status", async () => {
    const actor = setActor();
    actor.getRequestByReference.mockResolvedValue(
      makeJob({
        status: JobStatus.scheduled,
        packageEnrollment: makePackage({ active: false }),
      }),
    );

    await lookupJob();

    const card = await waitFor(() => {
      const node = document.querySelector('[data-ocid="track.package_card"]');
      expect(node).not.toBeNull();
      return node as HTMLElement;
    });
    expect(within(card).getByText("Paused")).toBeInTheDocument();
  });
});

describe("Admin package panel survives without a monthly price value", () => {
  it("still shows included visits for an enrolled customer", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listRequests.mockResolvedValue([
      makeJob({
        id: 7n,
        packageEnrollment: makePackage({ active: true, includedVisits: 4n }),
      }),
    ]);
    actor.listBees.mockResolvedValue([]);

    renderWithProviders(<AdminPage />);

    const panel = await waitFor(() => {
      const node = document.querySelector(
        '[data-ocid="admin.package_panel.1"]',
      );
      expect(node).not.toBeNull();
      return node as HTMLElement;
    });
    const scope = within(panel);

    expect(scope.getByText("Monthly package")).toBeInTheDocument();
    expect(
      scope.getByText(/4 visits included each month/i),
    ).toBeInTheDocument();
    expect(
      scope.getByRole("button", { name: /cancel package/i }),
    ).toBeInTheDocument();
  });

  it("still enrolls a customer through the actor", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listRequests.mockResolvedValue([makeJob({ id: 7n })]);
    actor.listBees.mockResolvedValue([]);

    const user = userEvent.setup();
    renderWithProviders(<AdminPage />);

    await user.click(
      await screen.findByRole("button", {
        name: /mark on monthly package/i,
      }),
    );

    await waitFor(() => {
      expect(actor.setPackageEnrollment).toHaveBeenCalledWith(7n, true);
    });
  });

  it("still cancels a customer's package through the actor", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listRequests.mockResolvedValue([
      makeJob({ id: 7n, packageEnrollment: makePackage({ active: true }) }),
    ]);
    actor.listBees.mockResolvedValue([]);

    const user = userEvent.setup();
    renderWithProviders(<AdminPage />);

    await user.click(
      await screen.findByRole("button", { name: /cancel package/i }),
    );

    await waitFor(() => {
      expect(actor.setPackageEnrollment).toHaveBeenCalledWith(7n, false);
    });
  });
});

describe("header controls survive the logo enlargement", () => {
  it("still exposes the primary nav and sign-in control", () => {
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

    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
    // The logo link still routes home.
    expect(screen.getByRole("link", { name: /honey do's/i })).toHaveAttribute(
      "href",
      "/",
    );
  });

  it("still opens and closes the mobile menu", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <AppLayout>
        <div>page content</div>
      </AppLayout>,
    );

    const toggle = screen.getByRole("button", { name: /open menu/i });
    await user.click(toggle);

    const mobileNav = screen.getByRole("navigation", { name: /mobile/i });
    expect(
      within(mobileNav).getByRole("link", { name: /new request/i }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /close menu/i }));
    expect(
      screen.queryByRole("navigation", { name: /mobile/i }),
    ).not.toBeInTheDocument();
  });
});
