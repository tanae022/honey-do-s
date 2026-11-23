import { CustomerStatus } from "@/backend";
import {
  makeCustomerProfile,
  makeCustomerSummary,
  makeCustomerView,
} from "@/test/fixtures";
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
  useSearch: () => ({}),
  useParams: () => ({ customerId: "1" }),
  useRouterState: () => ({ location: { pathname: "/admin/customers" } }),
}));

import { CustomerProfilePage } from "@/pages/CustomerProfile";
import { CustomersPage } from "@/pages/Customers";

beforeEach(() => {
  setActor();
});

/* ------------------------------------------------------------------ */
/* Directory search forwards the term to the backend                   */
/* ------------------------------------------------------------------ */

describe("customer directory search", () => {
  it("forwards a phone-number term to the backend search", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listCustomers.mockResolvedValue([]);
    actor.searchCustomers.mockResolvedValue([
      makeCustomerSummary({ id: 3n, fullName: "Phone Match" }),
    ]);

    const user = userEvent.setup();
    renderWithProviders(<CustomersPage />);

    await user.type(
      await screen.findByLabelText(/search customers/i),
      "5551234567",
    );

    expect(await screen.findByText("Phone Match")).toBeInTheDocument();
    await waitFor(() =>
      expect(actor.searchCustomers).toHaveBeenCalledWith("5551234567"),
    );
  });

  it("forwards an email term to the backend search", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listCustomers.mockResolvedValue([]);
    actor.searchCustomers.mockResolvedValue([
      makeCustomerSummary({ id: 4n, fullName: "Email Match" }),
    ]);

    const user = userEvent.setup();
    renderWithProviders(<CustomersPage />);

    await user.type(
      await screen.findByLabelText(/search customers/i),
      "ada@example.com",
    );

    expect(await screen.findByText("Email Match")).toBeInTheDocument();
    await waitFor(() =>
      expect(actor.searchCustomers).toHaveBeenCalledWith("ada@example.com"),
    );
  });

  it("shows an empty state when a search matches nothing", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listCustomers.mockResolvedValue([]);
    actor.searchCustomers.mockResolvedValue([]);

    const user = userEvent.setup();
    renderWithProviders(<CustomersPage />);

    await user.type(
      await screen.findByLabelText(/search customers/i),
      "nobody",
    );

    expect(
      await screen.findByText(/no matching customers/i),
    ).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/* New customer dialog validation                                      */
/* ------------------------------------------------------------------ */

describe("new customer dialog", () => {
  it("requires a name and at least one contact method before saving", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listCustomers.mockResolvedValue([]);

    const user = userEvent.setup();
    renderWithProviders(<CustomersPage />);

    await user.click(
      await screen.findByRole("button", { name: /new customer/i }),
    );

    // Submitting an empty form reports the missing name and never calls the
    // backend.
    await user.click(screen.getByRole("button", { name: /add customer/i }));
    expect(
      await screen.findByText(/a customer name is required/i),
    ).toBeInTheDocument();
    expect(actor.createCustomer).not.toHaveBeenCalled();

    // A name without a phone or email is still rejected.
    await user.type(screen.getByLabelText(/full name/i), "Ada Lovelace");
    await user.click(screen.getByRole("button", { name: /add customer/i }));
    expect(
      await screen.findByText(/at least a phone number or an email/i),
    ).toBeInTheDocument();
    expect(actor.createCustomer).not.toHaveBeenCalled();
  });

  it("creates a customer with the entered contact information", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listCustomers.mockResolvedValue([]);
    actor.createCustomer.mockResolvedValue({ __kind__: "ok", ok: 1n });

    const user = userEvent.setup();
    renderWithProviders(<CustomersPage />);

    await user.click(
      await screen.findByRole("button", { name: /new customer/i }),
    );
    await user.type(screen.getByLabelText(/full name/i), "Ada Lovelace");
    await user.type(screen.getByLabelText(/^email$/i), "ada@example.com");
    await user.click(screen.getByRole("button", { name: /add customer/i }));

    await waitFor(() =>
      expect(actor.createCustomer).toHaveBeenCalledWith(
        expect.objectContaining({
          fullName: "Ada Lovelace",
          email: "ada@example.com",
        }),
      ),
    );
  });
});

/* ------------------------------------------------------------------ */
/* Profile access control                                              */
/* ------------------------------------------------------------------ */

describe("customer profile access control", () => {
  it("blocks a non-admin visitor from a customer profile", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(false);

    renderWithProviders(<CustomerProfilePage />);

    expect(
      await screen.findByRole("heading", { name: /admin access required/i }),
    ).toBeInTheDocument();
    // The profile is never fetched for a non-admin.
    expect(actor.getCustomerProfile).not.toHaveBeenCalled();
  });

  it("shows the archived status and restore action for an archived customer", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.getCustomerProfile.mockResolvedValue(
      makeCustomerProfile({
        customer: makeCustomerView({
          fullName: "Archived Customer",
          status: CustomerStatus.archived,
        }),
      }),
    );

    renderWithProviders(<CustomerProfilePage />);

    expect(await screen.findByText("Archived Customer")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /restore customer/i }),
    ).toBeInTheDocument();
  });
});
