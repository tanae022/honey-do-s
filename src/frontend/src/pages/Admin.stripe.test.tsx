import { makeJob } from "@/test/fixtures";
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

/**
 * Admin Stripe configuration and request-photo rendering. These are existing
 * admin capabilities the current request does not intentionally change, so
 * they are frozen here; the dashboard's new bee/package sections are not.
 */
beforeEach(() => {
  setActor();
});

describe("AdminPage Stripe configuration", () => {
  it("saves the Stripe secret key with normalized allowed countries", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.isStripeConfigured.mockResolvedValue(false);
    actor.listRequests.mockResolvedValue([]);

    const user = userEvent.setup();
    renderWithProviders(<AdminPage />);

    await user.type(
      await screen.findByLabelText(/stripe secret key/i),
      "sk_test_123",
    );
    const countries = screen.getByLabelText(/allowed countries/i);
    await user.clear(countries);
    await user.type(countries, "us, ca");
    await user.click(screen.getByRole("button", { name: /save stripe key/i }));

    await waitFor(() => {
      expect(actor.setStripeConfiguration).toHaveBeenCalledWith({
        secretKey: "sk_test_123",
        allowedCountries: ["US", "CA"],
      });
    });
    expect(await screen.findByText(/stripe key saved/i)).toBeInTheDocument();
  });

  it("shows the connected state instead of the key form when Stripe is configured", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.isStripeConfigured.mockResolvedValue(true);
    actor.listRequests.mockResolvedValue([]);

    renderWithProviders(<AdminPage />);

    expect(await screen.findByText("Configured")).toBeInTheDocument();
    expect(
      screen.queryByLabelText(/stripe secret key/i),
    ).not.toBeInTheDocument();
  });
});

describe("AdminPage request photos", () => {
  it("renders a thumbnail for each photo on a request", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listRequests.mockResolvedValue([
      makeJob({ id: 7n, photoIds: ["blob-a", "blob-b"] }),
    ]);

    renderWithProviders(<AdminPage />);

    await waitFor(() => {
      expect(
        document.querySelector('[data-ocid="admin.request_photos.1"]'),
      ).not.toBeNull();
    });
    const list = document.querySelector('[data-ocid="admin.request_photos.1"]');
    expect(list?.querySelectorAll("li")).toHaveLength(2);
  });
});
