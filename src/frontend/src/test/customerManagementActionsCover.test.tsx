import { CustomerStatus, NotificationKind } from "@/backend";
import {
  makeCustomerProfile,
  makeCustomerView,
  makeMessage,
  makeNotification,
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

import { NotificationBell } from "@/components/NotificationBell";
import { CustomerProfilePage } from "@/pages/CustomerProfile";

beforeEach(() => {
  setActor();
});

/* ------------------------------------------------------------------ */
/* Customer management actions                                         */
/* ------------------------------------------------------------------ */

describe("admin customer management actions", () => {
  it("edits a customer's contact information", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.getCustomerProfile.mockResolvedValue(
      makeCustomerProfile({
        customer: makeCustomerView({
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

    await waitFor(() =>
      expect(actor.updateCustomer).toHaveBeenCalledWith(
        1n,
        expect.objectContaining({ email: "ada.new@example.com" }),
      ),
    );
  });

  it("adds an internal note to a customer", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.getCustomerProfile.mockResolvedValue(makeCustomerProfile());
    actor.addCustomerNote.mockResolvedValue({ __kind__: "ok", ok: null });

    const user = userEvent.setup();
    renderWithProviders(<CustomerProfilePage />);

    await screen.findByText("Ada Lovelace");
    await user.type(
      screen.getByLabelText(/add a note/i),
      "Left a spare key under the planter.",
    );
    await user.click(
      document.querySelector(
        '[data-ocid="customer_profile.notes_save_button"]',
      ) as HTMLElement,
    );

    await waitFor(() =>
      expect(actor.addCustomerNote).toHaveBeenCalledWith(
        1n,
        "Left a spare key under the planter.",
      ),
    );
  });

  it("updates a customer's lifecycle status", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.getCustomerProfile.mockResolvedValue(
      makeCustomerProfile({
        customer: makeCustomerView({ status: CustomerStatus.active }),
      }),
    );
    actor.setCustomerStatus.mockResolvedValue({ __kind__: "ok", ok: null });

    const user = userEvent.setup();
    renderWithProviders(<CustomerProfilePage />);

    await screen.findByText("Ada Lovelace");
    await user.click(screen.getByRole("button", { name: /update status/i }));
    await user.click(
      screen.getByRole("button", {
        name: /inactive/i,
      }),
    );

    await waitFor(() =>
      expect(actor.setCustomerStatus).toHaveBeenCalledWith(
        1n,
        CustomerStatus.inactive,
      ),
    );
  });

  it("sends an admin message into the customer's thread", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.getCustomerProfile.mockResolvedValue(makeCustomerProfile());
    actor.listCustomerMessages.mockResolvedValue([
      makeMessage({ id: 1n, body: "Can you come Thursday?", fromAdmin: false }),
    ]);
    actor.postAdminMessage.mockResolvedValue({ __kind__: "ok", ok: null });

    const user = userEvent.setup();
    renderWithProviders(<CustomerProfilePage />);

    expect(
      await screen.findByText("Can you come Thursday?"),
    ).toBeInTheDocument();

    await user.type(
      screen.getByLabelText(/reply to the customer/i),
      "Thursday morning works.",
    );
    await user.click(screen.getByRole("button", { name: /send reply/i }));

    await waitFor(() =>
      expect(actor.postAdminMessage).toHaveBeenCalledWith(
        1n,
        null,
        "Thursday morning works.",
      ),
    );
  });
});

/* ------------------------------------------------------------------ */
/* Notification kinds                                                  */
/* ------------------------------------------------------------------ */

describe("notification kinds", () => {
  it("labels each notification kind the accepted requirements name", async () => {
    const actor = setActor();
    actor.getUnreadNotificationCount.mockResolvedValue(5n);
    actor.listNotifications.mockResolvedValue([
      makeNotification({
        id: 1n,
        kind: NotificationKind.newCustomer,
        title: "New request",
      }),
      makeNotification({
        id: 2n,
        kind: NotificationKind.returningCustomerRequest,
        title: "Returning customer request",
      }),
      makeNotification({
        id: 3n,
        kind: NotificationKind.customerMessage,
        title: "New message from Ada",
      }),
      makeNotification({
        id: 4n,
        kind: NotificationKind.bookingApproval,
        title: "Booking needs approval",
      }),
      makeNotification({
        id: 5n,
        kind: NotificationKind.depositReceived,
        title: "Deposit of $100 received",
      }),
    ]);

    const user = userEvent.setup();
    renderWithProviders(<NotificationBell />);

    await user.click(
      await screen.findByRole("button", { name: /notifications, 5 unread/i }),
    );

    expect(await screen.findByText("New customer")).toBeInTheDocument();
    expect(screen.getByText("Returning customer")).toBeInTheDocument();
    expect(screen.getByText("Customer message")).toBeInTheDocument();
    expect(screen.getByText("Booking approval")).toBeInTheDocument();
    expect(screen.getByText("Deposit received")).toBeInTheDocument();
    // Each notification's own title is rendered alongside its kind label.
    expect(screen.getByText("New message from Ada")).toBeInTheDocument();
    expect(screen.getByText("Booking needs approval")).toBeInTheDocument();
  });
});
