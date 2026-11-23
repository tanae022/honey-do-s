import { CustomerStatus, JobStatus, PreferredContact } from "@/backend";
import {
  makeAppointment,
  makeCustomerNote,
  makeCustomerProfile,
  makeCustomerView,
  makeDeposit,
  makeJob,
  makeMessage,
  makeQuote,
} from "@/test/fixtures";
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
  useRouterState: () => ({ location: { pathname: "/admin/customers/1" } }),
}));

import { CustomerProfilePage } from "@/pages/CustomerProfile";

/**
 * Characterization baseline for the customer-profile redesign.
 *
 * The request restyles the profile onto solid dark panels with gold borders and
 * ivory text and reworks the edit controls. Those changing surfaces are
 * deliberately NOT asserted here. What is pinned is the adjacent working
 * behavior the redesign must preserve:
 *
 *  - the profile still surfaces the full customer record — contact details,
 *    service history, payments, appointments, notes and the message thread;
 *  - editing still persists to the SAME customer id (no duplicate record);
 *  - the new-request panel still reuses the customer's saved contact info
 *    instead of asking for it again.
 */
beforeEach(() => {
  setActor();
});

describe("customer profile still surfaces the full record", () => {
  it("renders contact details, history, payments, appointments, notes and messages", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.getCustomerProfile.mockResolvedValue(
      makeCustomerProfile({
        customer: makeCustomerView({
          fullName: "Ada Lovelace",
          email: "ada@example.com",
          phone: "(555) 123-4567",
          serviceAddress: "123 Honeycomb Lane",
          preferredContact: PreferredContact.email,
          status: CustomerStatus.active,
          notes: [makeCustomerNote({ id: 1n, body: "Gate code is 4821." })],
        }),
        jobs: [
          makeJob({
            id: 1n,
            status: JobStatus.quoted,
            quote: makeQuote({ amount: 20_000n }),
          }),
        ],
        pendingJobs: [
          makeJob({
            id: 1n,
            status: JobStatus.quoted,
            quote: makeQuote({ amount: 20_000n }),
          }),
        ],
        deposits: [makeDeposit({ amount: 10_000n, paid: true })],
        appointments: [makeAppointment({ confirmed: true })],
      }),
    );
    actor.listCustomerMessages.mockResolvedValue([
      makeMessage({ id: 1n, body: "Can you come Thursday?", fromAdmin: false }),
    ]);

    renderWithProviders(<CustomerProfilePage />);

    // Contact details.
    expect(await screen.findByText("Ada Lovelace")).toBeInTheDocument();
    expect(screen.getByText("ada@example.com")).toBeInTheDocument();
    expect(screen.getByText("(555) 123-4567")).toBeInTheDocument();
    expect(screen.getByText("123 Honeycomb Lane")).toBeInTheDocument();

    // Service history with the quote amount.
    expect(screen.getByText("Service history")).toBeInTheDocument();
    expect(screen.getByText("$200.00")).toBeInTheDocument();

    // Payments and appointments.
    expect(screen.getByText("Payments & appointments")).toBeInTheDocument();
    // The deposit amount appears in both the history balance and the deposit
    // list, so assert at least one rendering rather than a unique match.
    expect(screen.getAllByText("$100.00").length).toBeGreaterThan(0);

    // Notes and the message thread.
    expect(screen.getByText("Gate code is 4821.")).toBeInTheDocument();
    expect(
      await screen.findByText("Can you come Thursday?"),
    ).toBeInTheDocument();
  });

  it("shows the empty states when a customer has no history yet", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.getCustomerProfile.mockResolvedValue(makeCustomerProfile());
    actor.listCustomerMessages.mockResolvedValue([]);

    renderWithProviders(<CustomerProfilePage />);

    expect(await screen.findByText("Ada Lovelace")).toBeInTheDocument();
    expect(screen.getByText(/no service requests yet/i)).toBeInTheDocument();
    expect(screen.getByText(/no deposits recorded yet/i)).toBeInTheDocument();
    expect(
      screen.getByText(/no appointments scheduled yet/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/no notes yet/i)).toBeInTheDocument();
    expect(await screen.findByText(/no messages yet/i)).toBeInTheDocument();
  });
});

describe("editing a customer persists to the same record", () => {
  it("saves the edited contact info against the existing customer id", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.getCustomerProfile.mockResolvedValue(
      makeCustomerProfile({
        customer: makeCustomerView({
          id: 7n,
          fullName: "Ada Lovelace",
          email: "ada@example.com",
        }),
      }),
    );
    actor.updateCustomer.mockResolvedValue({ __kind__: "ok", ok: null });

    const user = userEvent.setup();
    renderWithProviders(<CustomerProfilePage />);

    await screen.findByText("Ada Lovelace");
    await user.click(screen.getByRole("button", { name: /edit contact/i }));

    const emailInput = screen.getByLabelText(/^email$/i);
    await user.clear(emailInput);
    await user.type(emailInput, "ada.new@example.com");
    await user.click(screen.getByRole("button", { name: /save changes/i }));

    // The update targets the routed customer id — no new record is created.
    await waitFor(() =>
      expect(actor.updateCustomer).toHaveBeenCalledWith(
        1n,
        expect.objectContaining({ email: "ada.new@example.com" }),
      ),
    );
    expect(actor.createCustomer).not.toHaveBeenCalled();
  });

  it("rejects an invalid email before calling the backend", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.getCustomerProfile.mockResolvedValue(makeCustomerProfile());

    const user = userEvent.setup();
    renderWithProviders(<CustomerProfilePage />);

    await screen.findByText("Ada Lovelace");
    await user.click(screen.getByRole("button", { name: /edit contact/i }));

    const emailInput = screen.getByLabelText(/^email$/i);
    await user.clear(emailInput);
    await user.type(emailInput, "not-an-email");
    await user.click(screen.getByRole("button", { name: /save changes/i }));

    expect(
      await screen.findByText(/enter a valid email address/i),
    ).toBeInTheDocument();
    expect(actor.updateCustomer).not.toHaveBeenCalled();
  });
});

describe("new request reuses the customer's saved contact info", () => {
  it("creates a job for the customer without re-entering contact details", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.getCustomerProfile.mockResolvedValue(
      makeCustomerProfile({
        customer: makeCustomerView({
          id: 3n,
          fullName: "Ada Lovelace",
          email: "ada@example.com",
          phone: "(555) 123-4567",
        }),
      }),
    );
    actor.createJobForCustomer.mockResolvedValue({
      __kind__: "ok",
      ok: makeJob({ referenceCode: "HD-4F2A9C" }),
    });

    const user = userEvent.setup();
    renderWithProviders(<CustomerProfilePage />);

    await screen.findByText("Ada Lovelace");
    await user.click(
      screen.getByRole("button", { name: /new service request/i }),
    );

    const panel = await screen.findByText(/uses .*saved contact information/i);
    expect(panel).toBeInTheDocument();

    await user.type(
      screen.getByLabelText(/when works best/i),
      "Weekday mornings",
    );
    await user.type(
      screen.getByLabelText(/what needs doing/i),
      "The back gate hinge is loose and the fence panel needs re-seating.",
    );
    await user.click(screen.getByRole("button", { name: /create request/i }));

    await waitFor(() =>
      expect(actor.createJobForCustomer).toHaveBeenCalledWith(
        1n,
        expect.objectContaining({
          customerName: "Ada Lovelace",
          email: "ada@example.com",
          phone: "(555) 123-4567",
        }),
      ),
    );
  });
});
