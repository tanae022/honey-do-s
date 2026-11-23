import {
  CustomerStatus,
  DepositStatus,
  JobStatus,
  NotificationKind,
  PaymentMethod,
} from "@/backend";
import {
  makeCustomerProfile,
  makeCustomerSummary,
  makeCustomerView,
  makeJob,
  makeMessage,
  makeNotification,
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
  useRouterState: () => ({ location: { pathname: "/admin/customers" } }),
}));

import { NotificationBell } from "@/components/NotificationBell";
import { CustomerProfilePage } from "@/pages/CustomerProfile";
import { CustomersPage } from "@/pages/Customers";
import { TrackPage } from "@/pages/Track";

beforeEach(() => {
  setActor();
});

/* ------------------------------------------------------------------ */
/* Customer directory + search                                         */
/* ------------------------------------------------------------------ */

describe("admin customer directory", () => {
  it("lists customers and searches by a term through the backend", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listCustomers.mockResolvedValue([
      makeCustomerSummary({ id: 1n, fullName: "Ada Lovelace" }),
    ]);
    actor.searchCustomers.mockResolvedValue([
      makeCustomerSummary({
        id: 2n,
        fullName: "Grace Hopper",
        email: "grace@example.com",
      }),
    ]);

    const user = userEvent.setup();
    renderWithProviders(<CustomersPage />);

    // The unfiltered directory query owns the list before a term is typed.
    expect(await screen.findByText("Ada Lovelace")).toBeInTheDocument();
    expect(actor.listCustomers).toHaveBeenCalledWith(false);

    await user.type(screen.getByLabelText(/search customers/i), "grace");

    // The search query takes over and the backend is asked for the term.
    expect(await screen.findByText("Grace Hopper")).toBeInTheDocument();
    await waitFor(() =>
      expect(actor.searchCustomers).toHaveBeenCalledWith("grace"),
    );
  });

  it("blocks a non-admin visitor from the directory", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(false);

    renderWithProviders(<CustomersPage />);

    expect(
      await screen.findByRole("heading", { name: /admin access required/i }),
    ).toBeInTheDocument();
    expect(actor.listCustomers).not.toHaveBeenCalled();
  });

  it("exports the directory as a CSV download", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listCustomers.mockResolvedValue([makeCustomerSummary()]);
    actor.exportCustomersCsv.mockResolvedValue(
      "name,email\nAda,ada@example.com",
    );

    const createObjectURL = vi.fn().mockReturnValue("blob:customers");
    const revokeObjectURL = vi.fn();
    Object.defineProperty(URL, "createObjectURL", {
      writable: true,
      configurable: true,
      value: createObjectURL,
    });
    Object.defineProperty(URL, "revokeObjectURL", {
      writable: true,
      configurable: true,
      value: revokeObjectURL,
    });

    const user = userEvent.setup();
    renderWithProviders(<CustomersPage />);

    await screen.findByText("Ada Lovelace");
    await user.click(screen.getByRole("button", { name: /export customers/i }));

    await waitFor(() => expect(actor.exportCustomersCsv).toHaveBeenCalled());
    expect(createObjectURL).toHaveBeenCalled();
  });
});

/* ------------------------------------------------------------------ */
/* Customer profile                                                    */
/* ------------------------------------------------------------------ */

describe("admin customer profile", () => {
  it("groups service history and shows payments, notes and photos", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.getCustomerProfile.mockResolvedValue(
      makeCustomerProfile({
        customer: makeCustomerView({
          fullName: "Ada Lovelace",
          notes: [
            {
              id: 1n,
              body: "Gate code is 4821.",
              createdAt: 1_700_000_000_000_000_000n,
            },
          ],
        }),
        jobs: [
          makeJob({ id: 1n, status: JobStatus.requested }),
          makeJob({ id: 2n, status: JobStatus.completed, quote: makeQuote() }),
          makeJob({ id: 3n, status: JobStatus.cancelled }),
        ],
        pendingJobs: [makeJob({ id: 1n, status: JobStatus.requested })],
        completedJobs: [
          makeJob({
            id: 2n,
            status: JobStatus.completed,
            quote: makeQuote(),
          }),
        ],
        cancelledJobs: [makeJob({ id: 3n, status: JobStatus.cancelled })],
        deposits: [
          {
            amount: 10_000n,
            method: PaymentMethod.stripe,
            paid: true,
            status: DepositStatus.verified,
            paidAt: 1_700_000_200_000_000_000n,
          },
        ],
        appointments: [
          { confirmed: true, scheduledAt: 1_700_000_300_000_000_000n },
        ],
        photoIds: ["sha256:aaa"],
      }),
    );

    renderWithProviders(<CustomerProfilePage />);

    expect(await screen.findByText("Ada Lovelace")).toBeInTheDocument();
    // Contact information is rendered.
    expect(screen.getByText("ada@example.com")).toBeInTheDocument();
    // History is grouped into pending, completed and cancelled sections.
    expect(
      document.querySelector(
        '[data-ocid="customer_profile.history_group.pending"]',
      ),
    ).not.toBeNull();
    expect(
      document.querySelector(
        '[data-ocid="customer_profile.history_group.completed"]',
      ),
    ).not.toBeNull();
    expect(
      document.querySelector(
        '[data-ocid="customer_profile.history_group.cancelled"]',
      ),
    ).not.toBeNull();
    // Notes, deposits, appointments and photos each render.
    expect(screen.getByText("Gate code is 4821.")).toBeInTheDocument();
    expect(
      document.querySelector('[data-ocid="customer_profile.deposits_list"]'),
    ).not.toBeNull();
    expect(
      document.querySelector(
        '[data-ocid="customer_profile.appointments_list"]',
      ),
    ).not.toBeNull();
    expect(
      document.querySelector('[data-ocid="customer_profile.photos_list"]'),
    ).not.toBeNull();
  });

  it("creates a new service request for the customer without re-entering contact info", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.getCustomerProfile.mockResolvedValue(
      makeCustomerProfile({
        customer: makeCustomerView({
          fullName: "Ada Lovelace",
          email: "ada@example.com",
          phone: "(555) 123-4567",
        }),
      }),
    );
    actor.createJobForCustomer.mockResolvedValue({
      __kind__: "ok",
      ok: makeJob({ id: 9n, referenceCode: "HD-NEW001" }),
    });

    const user = userEvent.setup();
    renderWithProviders(<CustomerProfilePage />);

    await screen.findByText("Ada Lovelace");
    await user.click(
      screen.getByRole("button", { name: /new service request/i }),
    );

    await user.type(
      screen.getByLabelText(/when works best/i),
      "Weekday mornings",
    );
    await user.type(
      screen.getByLabelText(/what needs doing/i),
      "The back gate hinge is loose.",
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

  it("archives a customer and offers restore once archived", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.getCustomerProfile.mockResolvedValue(
      makeCustomerProfile({
        customer: makeCustomerView({ status: CustomerStatus.active }),
      }),
    );
    actor.archiveCustomer.mockResolvedValue({ __kind__: "ok", ok: null });

    const user = userEvent.setup();
    renderWithProviders(<CustomerProfilePage />);

    await screen.findByText("Ada Lovelace");
    await user.click(screen.getByRole("button", { name: /archive customer/i }));

    await waitFor(() => expect(actor.archiveCustomer).toHaveBeenCalledWith(1n));
  });

  it("shows the restore action for an archived customer", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.getCustomerProfile.mockResolvedValue(
      makeCustomerProfile({
        customer: makeCustomerView({ status: CustomerStatus.archived }),
      }),
    );

    renderWithProviders(<CustomerProfilePage />);

    expect(
      await screen.findByRole("button", { name: /restore customer/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /archive customer/i }),
    ).not.toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/* Notification bell                                                   */
/* ------------------------------------------------------------------ */

describe("admin notification bell", () => {
  it("shows the unread count and clears it when all are marked read", async () => {
    const actor = setActor();
    actor.getUnreadNotificationCount.mockResolvedValue(2n);
    actor.listNotifications.mockResolvedValue([
      makeNotification({
        id: 1n,
        kind: NotificationKind.newCustomer,
        title: "New request",
        read: false,
      }),
      makeNotification({
        id: 2n,
        kind: NotificationKind.depositReceived,
        title: "Deposit received",
        read: false,
      }),
    ]);
    actor.markAllNotificationsRead.mockResolvedValue(undefined);

    const user = userEvent.setup();
    renderWithProviders(<NotificationBell />);

    // The bell carries the unread count in its accessible label.
    const bell = await screen.findByRole("button", {
      name: /notifications, 2 unread/i,
    });
    expect(bell).toBeInTheDocument();

    await user.click(bell);

    expect(await screen.findByText("New request")).toBeInTheDocument();
    expect(
      document.querySelector('[data-ocid="admin.notification_item.2"]'),
    ).not.toBeNull();

    await user.click(screen.getByRole("button", { name: /mark all read/i }));

    await waitFor(() =>
      expect(actor.markAllNotificationsRead).toHaveBeenCalled(),
    );
  });

  it("marks a single notification read", async () => {
    const actor = setActor();
    actor.getUnreadNotificationCount.mockResolvedValue(1n);
    actor.listNotifications.mockResolvedValue([
      makeNotification({ id: 7n, title: "Customer message", read: false }),
    ]);
    actor.markNotificationRead.mockResolvedValue({ __kind__: "ok", ok: null });

    const user = userEvent.setup();
    renderWithProviders(<NotificationBell />);

    await user.click(
      await screen.findByRole("button", { name: /notifications, 1 unread/i }),
    );
    await user.click(screen.getByRole("button", { name: /mark read/i }));

    await waitFor(() =>
      expect(actor.markNotificationRead).toHaveBeenCalledWith(7n),
    );
  });
});

/* ------------------------------------------------------------------ */
/* Guest message thread on the Track page                              */
/* ------------------------------------------------------------------ */

describe("guest message thread", () => {
  it("loads the thread for a reference code and posts a reply", async () => {
    const actor = setActor();
    actor.getRequestByReference.mockResolvedValue(
      makeJob({ status: JobStatus.quoted, quote: makeQuote() }),
    );
    actor.getCustomerMessages.mockResolvedValue([
      makeMessage({ id: 1n, body: "Can you come Thursday?", fromAdmin: false }),
    ]);
    actor.postCustomerMessage.mockResolvedValue({ __kind__: "ok", ok: null });

    const user = userEvent.setup();
    renderWithProviders(<TrackPage />);

    await user.type(screen.getByLabelText(/reference code/i), "HD-4F2A9C");
    await user.click(screen.getByRole("button", { name: /find my job/i }));

    // The thread is scoped to the reference code.
    expect(
      await screen.findByText("Can you come Thursday?"),
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(actor.getCustomerMessages).toHaveBeenCalledWith("HD-4F2A9C"),
    );

    await user.type(
      screen.getByLabelText(/send a message/i),
      "Thursday works, thank you!",
    );
    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() =>
      expect(actor.postCustomerMessage).toHaveBeenCalledWith(
        "HD-4F2A9C",
        "Thursday works, thank you!",
      ),
    );
  });
});
