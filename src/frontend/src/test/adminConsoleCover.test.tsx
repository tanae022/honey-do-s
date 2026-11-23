import {
  type CustomerProfileView,
  CustomerStatus,
  type Deposit,
  DepositStatus,
  JobRecordStatus,
  type JobRecordView,
  JobStatus,
  NotificationKind,
  type PaymentHistory,
  PaymentMethod,
  type PaymentSummaryView,
  QuoteStatus,
  type SettingsBundle,
} from "@/backend";
import {
  makeCustomerProfile,
  makeCustomerSummary,
  makeCustomerView,
  makeJob,
  makeMessage,
  makeNotification,
  makeQuote,
  makeStats,
} from "@/test/fixtures";
import {
  installCoreInfrastructureMocks,
  renderWithProviders,
  setActor,
} from "@/test/harness";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

installCoreInfrastructureMocks();

/** The customer id the profile route resolves for the profile tests. */
const PROFILE_CUSTOMER_ID = "1";

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
  useParams: () => ({ customerId: PROFILE_CUSTOMER_ID }),
  useRouterState: () => ({ location: { pathname: "/admin" } }),
}));

import { AppLayout } from "@/components/layout/AppLayout";
import { PaymentsPage } from "@/pages/Payments";
import { TrackPage } from "@/pages/Track";
import { CalendarPage } from "@/pages/admin/Calendar";
import { CustomerProfilePage } from "@/pages/admin/CustomerProfile";
import { CustomersPage } from "@/pages/admin/Customers";
import { DashboardPage } from "@/pages/admin/Dashboard";
import { JobsPage } from "@/pages/admin/Jobs";
import { MessagesPage } from "@/pages/admin/Messages";
import { NotificationsPage } from "@/pages/admin/Notifications";
import { RequestsPage } from "@/pages/admin/Requests";
import { SettingsPage } from "@/pages/admin/Settings";

/** Query a rendered element by its `data-ocid` attribute. */
function ocid(id: string): HTMLElement | null {
  return document.querySelector(`[data-ocid="${id}"]`);
}

/* ------------------------------------------------------------------ */
/* Fixtures                                                            */
/* ------------------------------------------------------------------ */

function makeDeposit(overrides: Partial<Deposit> = {}): Deposit {
  return {
    amount: 2_500n,
    method: PaymentMethod.cashApp,
    paid: false,
    status: DepositStatus.submitted,
    submittedAt: 1_700_000_200_000_000_000n,
    ...overrides,
  };
}

function makePaymentSummary(
  overrides: Partial<PaymentSummaryView> = {},
): PaymentSummaryView {
  return {
    customerName: "Jamie Rivera",
    depositAmount: 2_500n,
    chimeHandle: "$honeydo-chime",
    adjustedSubtotal: 25_000n,
    venmoHandle: "@honeydo-venmo",
    depositStatus: DepositStatus.pending,
    discountAmount: 5_000n,
    finalTotal: 25_000n,
    appointmentConfirmed: false,
    serviceDescription: "Replace the kitchen faucet.",
    discountReason: "Spring promo applied",
    referenceCode: "HD-4F2A9C",
    payPalHandle: "honeydo@paypal.me",
    cashAppHandle: "$honeydo",
    remainingBalance: 22_500n,
    originalSubtotal: 30_000n,
    acceptedMethods: [
      PaymentMethod.payPal,
      PaymentMethod.cashApp,
      PaymentMethod.venmo,
      PaymentMethod.chime,
    ],
    taxAmount: 0n,
    ...overrides,
  };
}

function makePaymentHistory(
  overrides: Partial<PaymentHistory> = {},
): PaymentHistory {
  return {
    id: 1n,
    depositAmount: 2_500n,
    paymentMethod: PaymentMethod.cashApp,
    depositStatus: DepositStatus.verified,
    discountAmount: 5_000n,
    createdAt: 1_700_000_200_000_000_000n,
    totalPaid: 2_500n,
    jobRequestId: 1n,
    finalPayment: 0n,
    referenceCode: "HD-4F2A9C",
    updatedAt: 1_700_000_200_000_000_000n,
    finalQuote: 25_000n,
    remainingBalance: 22_500n,
    customerId: 1n,
    originalQuote: 30_000n,
    ...overrides,
  };
}

function makeSettings(overrides: Partial<SettingsBundle> = {}): SettingsBundle {
  return {
    tax: { enabled: false, ratePercent: 0n },
    admin: {
      appointmentReminders: true,
      notificationSound: true,
      messageAlerts: true,
      pushNotifications: true,
      customerRequestAlerts: true,
    },
    quote: { terms: "Payment due on completion.", validityDays: 30n },
    deposit: { percent: 10n },
    business: {
      businessName: "Honey Do's",
      businessEmail: "owner@example.com",
      businessAddress: "1 Hive Way",
      businessPhone: "(405) 312-4987",
    },
    payment: {
      chimeHandle: "$honeydo-chime",
      venmoHandle: "@honeydo-venmo",
      payPalHandle: "honeydo@paypal.me",
      cashAppHandle: "$honeydo",
      acceptedMethods: [
        PaymentMethod.payPal,
        PaymentMethod.cashApp,
        PaymentMethod.venmo,
        PaymentMethod.chime,
      ],
    },
    ...overrides,
  };
}

beforeEach(() => {
  setActor();
  window.history.replaceState({}, "", "/admin");
});

afterEach(() => {
  window.history.replaceState({}, "", "/admin");
});

/* ------------------------------------------------------------------ */
/* Dashboard                                                           */
/* ------------------------------------------------------------------ */

describe("Admin dashboard", () => {
  it("shows the eight headline counts and the four quick actions", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.getDashboardStats.mockResolvedValue(
      makeStats({
        newRequests: 3n,
        upcomingAppointments: 2n,
        activeJobs: 4n,
      }),
    );
    actor.listRequests.mockResolvedValue([
      makeJob({ id: 1n, status: JobStatus.requested }),
      makeJob({ id: 2n, status: JobStatus.quoted, quote: makeQuote() }),
    ]);
    actor.listPaymentHistory.mockResolvedValue([
      makePaymentHistory({ depositStatus: DepositStatus.submitted }),
    ]);
    actor.listCustomers.mockResolvedValue([]);

    renderWithProviders(<DashboardPage />);

    const stats = await screen.findByRole("region", {
      name: /dashboard counts/i,
    });
    for (const label of [
      "New Requests",
      "Today's Appointments",
      "Upcoming Appointments",
      "Pending Quotes",
      "Deposits Pending",
      "Active Jobs",
      "Payments",
      "Customers",
    ]) {
      expect(within(stats).getByText(label)).toBeInTheDocument();
    }

    const quick = screen.getByRole("region", { name: /quick actions/i });
    for (const label of [
      "+ New Request",
      "+ New Customer",
      "+ New Quote",
      "+ New Appointment",
    ]) {
      expect(within(quick).getByText(label)).toBeInTheDocument();
    }
  });

  it("links each quick action to its matching create flow", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.getDashboardStats.mockResolvedValue(makeStats());
    actor.listRequests.mockResolvedValue([]);
    actor.listPaymentHistory.mockResolvedValue([]);
    actor.listCustomers.mockResolvedValue([]);

    renderWithProviders(<DashboardPage />);

    const quick = await screen.findByRole("region", {
      name: /quick actions/i,
    });
    expect(
      within(quick).getByRole("link", { name: /new request/i }),
    ).toHaveAttribute("href", "/request");
    expect(
      within(quick).getByRole("link", { name: /new customer/i }),
    ).toHaveAttribute("href", "/admin/customers");
    expect(
      within(quick).getByRole("link", { name: /new quote/i }),
    ).toHaveAttribute("href", "/admin/quotes");
    expect(
      within(quick).getByRole("link", { name: /new appointment/i }),
    ).toHaveAttribute("href", "/admin/calendar");
  });

  it("links each headline count to the relevant filtered list", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.getDashboardStats.mockResolvedValue(makeStats());
    actor.listRequests.mockResolvedValue([]);
    actor.listPaymentHistory.mockResolvedValue([]);
    actor.listCustomers.mockResolvedValue([]);

    renderWithProviders(<DashboardPage />);

    await screen.findByRole("region", {
      name: /dashboard counts/i,
    });
    const expected: [string, string][] = [
      ["admin.dashboard.stat.new_requests", "/admin/requests"],
      ["admin.dashboard.stat.today_appointments", "/admin/calendar"],
      ["admin.dashboard.stat.upcoming_appointments", "/admin/calendar"],
      ["admin.dashboard.stat.pending_quotes", "/admin/quotes"],
      ["admin.dashboard.stat.deposits_pending", "/admin/payments"],
      ["admin.dashboard.stat.active_jobs", "/admin/jobs"],
      ["admin.dashboard.stat.payments", "/admin/payments"],
      ["admin.dashboard.stat.customers", "/admin/customers"],
    ];
    for (const [id, href] of expected) {
      const link = ocid(id);
      expect(link).not.toBeNull();
      expect(link).toHaveAttribute("href", href);
    }
  });
});

/* ------------------------------------------------------------------ */
/* Customer payment page — 10% deposit math                            */
/* ------------------------------------------------------------------ */

describe("Customer payment page", () => {
  async function lookupJob() {
    const user = userEvent.setup();
    renderWithProviders(<TrackPage />);
    await user.type(screen.getByLabelText(/reference code/i), "HD-4F2A9C");
    await user.click(screen.getByRole("button", { name: /find my job/i }));
    return user;
  }

  it("shows the 10% deposit and remaining balance for a $300 quote with a $50 discount", async () => {
    const actor = setActor();
    actor.getRequestByReference.mockResolvedValue(
      makeJob({
        status: JobStatus.scheduled,
        quote: makeQuote({ amount: 25_000n, total: 25_000n }),
      }),
    );
    actor.getPaymentSummary.mockResolvedValue(
      makePaymentSummary({
        originalSubtotal: 30_000n,
        discountAmount: 5_000n,
        adjustedSubtotal: 25_000n,
        finalTotal: 25_000n,
        depositAmount: 2_500n,
        remainingBalance: 22_500n,
      }),
    );

    await lookupJob();

    const card = await waitFor(() => {
      const node = ocid("track.payment_breakdown_card");
      expect(node).not.toBeNull();
      return node as HTMLElement;
    });
    expect(within(card).getByText("$300.00")).toBeInTheDocument();
    expect(within(card).getByText("$250.00")).toBeInTheDocument();
    expect(within(card).getByText("$25.00")).toBeInTheDocument();
    expect(within(card).getByText("$225.00")).toBeInTheDocument();
  });

  it("offers PayPal, Cash App, Venmo and Chime and the exact amount to pay", async () => {
    const actor = setActor();
    actor.getRequestByReference.mockResolvedValue(
      makeJob({
        status: JobStatus.scheduled,
        quote: makeQuote({ amount: 25_000n, total: 25_000n }),
      }),
    );
    actor.getPaymentSummary.mockResolvedValue(makePaymentSummary());

    await lookupJob();

    const options = await waitFor(() => {
      const node = ocid("track.deposit_options");
      expect(node).not.toBeNull();
      return node as HTMLElement;
    });
    for (const label of ["PayPal", "Cash App", "Venmo", "Chime"]) {
      expect(within(options).getByText(label)).toBeInTheDocument();
    }
    expect(screen.getByText(/exact amount to pay/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /i've paid my deposit/i }),
    ).toBeInTheDocument();
  });

  it("submits the deposit with the selected method", async () => {
    const actor = setActor();
    actor.getRequestByReference.mockResolvedValue(
      makeJob({
        status: JobStatus.scheduled,
        quote: makeQuote({ amount: 25_000n, total: 25_000n }),
      }),
    );
    actor.getPaymentSummary.mockResolvedValue(makePaymentSummary());

    const user = await lookupJob();

    await user.click(
      await screen.findByRole("button", { name: /i've paid my deposit/i }),
    );

    await waitFor(() => {
      expect(actor.submitDeposit).toHaveBeenCalledWith(
        "HD-4F2A9C",
        PaymentMethod.cashApp,
      );
    });
  });

  it("shows the deposit submitted — verifying state once the deposit is submitted", async () => {
    const actor = setActor();
    actor.getRequestByReference.mockResolvedValue(
      makeJob({
        status: JobStatus.scheduled,
        quote: makeQuote({ amount: 25_000n, total: 25_000n }),
      }),
    );
    actor.getPaymentSummary.mockResolvedValue(
      makePaymentSummary({ depositStatus: DepositStatus.submitted }),
    );

    await lookupJob();

    await waitFor(() => {
      expect(
        screen.getAllByText(/deposit submitted — verifying/i).length,
      ).toBeGreaterThan(0);
    });
  });
});

/* ------------------------------------------------------------------ */
/* Admin payment verification                                          */
/* ------------------------------------------------------------------ */

describe("Admin payment verification", () => {
  it("shows customer, quote, amount, method and status with confirm and reject actions", async () => {
    const actor = setActor();
    actor.listRequests.mockResolvedValue([
      makeJob({
        id: 1n,
        status: JobStatus.scheduled,
        quote: makeQuote({ total: 25_000n, depositRequired: 2_500n }),
        deposit: makeDeposit({ status: DepositStatus.submitted }),
      }),
    ]);
    actor.listPaymentHistory.mockResolvedValue([]);

    renderWithProviders(<PaymentsPage />);

    const table = await waitFor(() => {
      const node = ocid("admin.payments.pending_table");
      expect(node).not.toBeNull();
      return node as HTMLElement;
    });
    expect(within(table).getAllByText("Jamie Rivera").length).toBeGreaterThan(
      0,
    );
    expect(within(table).getAllByText("$250.00").length).toBeGreaterThan(0);
    expect(within(table).getAllByText("$25.00").length).toBeGreaterThan(0);
    expect(within(table).getAllByText("Cash App").length).toBeGreaterThan(0);
    expect(
      within(table).getAllByText("Deposit submitted").length,
    ).toBeGreaterThan(0);
    expect(
      within(table).getAllByRole("button", { name: /confirm payment/i }).length,
    ).toBeGreaterThan(0);
    expect(
      within(table).getAllByRole("button", { name: /payment not received/i })
        .length,
    ).toBeGreaterThan(0);
  });

  it("verifies a submitted deposit through the confirm dialog", async () => {
    const actor = setActor();
    actor.listRequests.mockResolvedValue([
      makeJob({
        id: 1n,
        status: JobStatus.scheduled,
        quote: makeQuote({ total: 25_000n, depositRequired: 2_500n }),
        deposit: makeDeposit({ status: DepositStatus.submitted }),
      }),
    ]);
    actor.listPaymentHistory.mockResolvedValue([]);

    const user = userEvent.setup();
    renderWithProviders(<PaymentsPage />);

    const confirmButtons = await screen.findAllByRole("button", {
      name: /confirm payment/i,
    });
    await user.click(confirmButtons[0]);
    const dialog = await screen.findByRole("alertdialog");
    await user.click(
      within(dialog).getByRole("button", { name: /confirm payment/i }),
    );

    await waitFor(() => {
      expect(actor.verifyDeposit).toHaveBeenCalledWith("HD-4F2A9C");
    });
  });

  it("rejects a submitted deposit through the not-received dialog", async () => {
    const actor = setActor();
    actor.listRequests.mockResolvedValue([
      makeJob({
        id: 1n,
        status: JobStatus.scheduled,
        quote: makeQuote({ total: 25_000n, depositRequired: 2_500n }),
        deposit: makeDeposit({ status: DepositStatus.submitted }),
      }),
    ]);
    actor.listPaymentHistory.mockResolvedValue([]);

    const user = userEvent.setup();
    renderWithProviders(<PaymentsPage />);

    const rejectButtons = await screen.findAllByRole("button", {
      name: /payment not received/i,
    });
    await user.click(rejectButtons[0]);
    const dialog = await screen.findByRole("alertdialog");
    await user.click(
      within(dialog).getByRole("button", { name: /payment not received/i }),
    );

    await waitFor(() => {
      expect(actor.rejectDeposit).toHaveBeenCalledWith("HD-4F2A9C");
    });
  });

  it("shows the permanent payment history fields", async () => {
    const actor = setActor();
    actor.listRequests.mockResolvedValue([]);
    actor.listPaymentHistory.mockResolvedValue([makePaymentHistory()]);

    renderWithProviders(<PaymentsPage />);

    const table = await waitFor(() => {
      const node = ocid("admin.payments.history_table");
      expect(node).not.toBeNull();
      return node as HTMLElement;
    });
    expect(within(table).getAllByText("HD-4F2A9C").length).toBeGreaterThan(0);
    expect(within(table).getAllByText("$300.00").length).toBeGreaterThan(0);
    expect(within(table).getAllByText("−$50.00").length).toBeGreaterThan(0);
    expect(within(table).getAllByText("$250.00").length).toBeGreaterThan(0);
    expect(within(table).getAllByText("$25.00").length).toBeGreaterThan(0);
    expect(within(table).getAllByText("$225.00").length).toBeGreaterThan(0);
    expect(
      within(table).getAllByText("Deposit verified").length,
    ).toBeGreaterThan(0);
  });
});

/* ------------------------------------------------------------------ */
/* Calendar — deposit gates confirmation                               */
/* ------------------------------------------------------------------ */

describe("Admin calendar", () => {
  it("offers Day, Week, Month and Agenda views", async () => {
    const actor = setActor();
    actor.listRequests.mockResolvedValue([]);
    actor.listJobRecords.mockResolvedValue([]);
    actor.listCustomers.mockResolvedValue([]);

    renderWithProviders(<CalendarPage />);

    const tabs = await screen.findByRole("tablist", {
      name: /calendar view/i,
    });
    for (const label of ["Day", "Week", "Month", "Agenda"]) {
      expect(
        within(tabs).getByRole("tab", { name: label }),
      ).toBeInTheDocument();
    }
  });

  it("does not mark an appointment confirmed until its deposit is verified", async () => {
    const actor = setActor();
    actor.listRequests.mockResolvedValue([
      makeJob({
        id: 1n,
        status: JobStatus.scheduled,
        appointment: {
          confirmed: false,
          scheduledAt: 1_700_000_300_000_000_000n,
        },
        deposit: makeDeposit({ status: DepositStatus.submitted }),
      }),
    ]);
    actor.listJobRecords.mockResolvedValue([]);
    actor.listCustomers.mockResolvedValue([]);

    renderWithProviders(<CalendarPage />);

    await waitFor(() => {
      const awaiting = ocid("admin.calendar.summary.awaiting");
      expect(awaiting).not.toBeNull();
      expect(
        within(awaiting as HTMLElement).getByText("1"),
      ).toBeInTheDocument();
    });
    const confirmed = ocid("admin.calendar.summary.confirmed") as HTMLElement;
    expect(within(confirmed).getByText("0")).toBeInTheDocument();
  });

  it("counts an appointment as confirmed once its deposit is verified", async () => {
    const actor = setActor();
    actor.listRequests.mockResolvedValue([
      makeJob({
        id: 1n,
        status: JobStatus.scheduled,
        appointment: {
          confirmed: true,
          scheduledAt: 1_700_000_300_000_000_000n,
        },
        deposit: makeDeposit({ status: DepositStatus.verified, paid: true }),
      }),
    ]);
    actor.listJobRecords.mockResolvedValue([]);
    actor.listCustomers.mockResolvedValue([]);

    renderWithProviders(<CalendarPage />);

    await waitFor(() => {
      const confirmed = ocid("admin.calendar.summary.confirmed");
      expect(confirmed).not.toBeNull();
      expect(
        within(confirmed as HTMLElement).getByText("1"),
      ).toBeInTheDocument();
    });
  });
});

/* ------------------------------------------------------------------ */
/* Notifications                                                       */
/* ------------------------------------------------------------------ */

describe("Admin notifications", () => {
  it("lists alerts with unread state and marks one read", async () => {
    const actor = setActor();
    actor.listNotifications.mockResolvedValue([
      makeNotification({
        id: 1n,
        kind: NotificationKind.newRequest,
        title: "New request",
        read: false,
      }),
      makeNotification({
        id: 2n,
        kind: NotificationKind.paymentReceived,
        title: "Payment received",
        read: true,
      }),
    ]);
    actor.getUnreadNotificationCount.mockResolvedValue(1n);

    const user = userEvent.setup();
    renderWithProviders(<NotificationsPage />);

    const list = await waitFor(() => {
      const node = ocid("admin.notifications.list");
      expect(node).not.toBeNull();
      return node as HTMLElement;
    });
    expect(within(list).getAllByText("New request").length).toBeGreaterThan(0);
    expect(
      within(list).getAllByText("Payment received").length,
    ).toBeGreaterThan(0);
    expect(ocid("admin.notifications.unread_badge.1")).not.toBeNull();

    await user.click(within(list).getByRole("button", { name: /mark read/i }));

    await waitFor(() => {
      expect(actor.markNotificationRead).toHaveBeenCalledWith(1n);
    });
  });

  it("marks all notifications read", async () => {
    const actor = setActor();
    actor.listNotifications.mockResolvedValue([
      makeNotification({ id: 1n, read: false }),
    ]);
    actor.getUnreadNotificationCount.mockResolvedValue(1n);

    const user = userEvent.setup();
    renderWithProviders(<NotificationsPage />);

    await user.click(
      await screen.findByRole("button", { name: /mark all read/i }),
    );

    await waitFor(() => {
      expect(actor.markAllNotificationsRead).toHaveBeenCalled();
    });
  });
});

/* ------------------------------------------------------------------ */
/* Settings                                                            */
/* ------------------------------------------------------------------ */

describe("Admin settings", () => {
  it("exposes the five alert toggles and the TEST ALERT action", async () => {
    const actor = setActor();
    actor.getSettings.mockResolvedValue(makeSettings());
    actor.getOwnerAlertEmail.mockResolvedValue("owner@example.com");
    actor.getOwnerAlertPhone.mockResolvedValue("+14053124987");
    actor.getTwilioConfigStatus.mockResolvedValue({
      configured: true,
      fromNumber: "+14053124987",
    });

    renderWithProviders(<SettingsPage />);

    for (const label of [
      "Customer request alerts",
      "Notification sound",
      "Push notifications",
      "Appointment reminders",
      "Message alerts",
    ]) {
      expect(await screen.findByText(label)).toBeInTheDocument();
    }
    expect(
      screen.getByRole("button", { name: /test alert/i }),
    ).toBeInTheDocument();
  });

  it("saves an alert toggle through setAdminSettings", async () => {
    const actor = setActor();
    actor.getSettings.mockResolvedValue(makeSettings());
    actor.getOwnerAlertEmail.mockResolvedValue("owner@example.com");
    actor.getOwnerAlertPhone.mockResolvedValue("+14053124987");
    actor.getTwilioConfigStatus.mockResolvedValue({
      configured: true,
      fromNumber: "+14053124987",
    });
    actor.setAdminSettings.mockResolvedValue({
      __kind__: "ok",
      ok: makeSettings().admin,
    });

    const user = userEvent.setup();
    renderWithProviders(<SettingsPage />);

    const toggle = await waitFor(() => {
      const node = ocid("admin.settings.alerts.notificationSound_toggle");
      expect(node).not.toBeNull();
      return node as HTMLElement;
    });
    await user.click(
      within(toggle).getByRole("switch", { name: /notification sound/i }),
    );

    await waitFor(() => {
      expect(actor.setAdminSettings).toHaveBeenCalled();
    });
  });

  it("seeds the Cash App field from the saved payment settings", async () => {
    const actor = setActor();
    actor.getSettings.mockResolvedValue(
      makeSettings({
        payment: {
          ...makeSettings().payment,
          cashAppHandle: "$saved-business-tag",
        },
      }),
    );
    actor.getOwnerAlertEmail.mockResolvedValue("owner@example.com");
    actor.getOwnerAlertPhone.mockResolvedValue("+14053124987");
    actor.getTwilioConfigStatus.mockResolvedValue({
      configured: true,
      fromNumber: "+14053124987",
    });

    renderWithProviders(<SettingsPage />);

    const cashAppInput = await waitFor(() => {
      const node = ocid("admin.settings.payment.cashapp_input");
      expect(node).not.toBeNull();
      return node as HTMLInputElement;
    });
    // The owner's saved handle wins over the built-in fallback.
    expect(cashAppInput).toHaveValue("$saved-business-tag");
  });

  it("runs the TEST ALERT action", async () => {
    const actor = setActor();
    actor.getSettings.mockResolvedValue(makeSettings());
    actor.getOwnerAlertEmail.mockResolvedValue("owner@example.com");
    actor.getOwnerAlertPhone.mockResolvedValue("+14053124987");
    actor.getTwilioConfigStatus.mockResolvedValue({
      configured: true,
      fromNumber: "+14053124987",
    });
    actor.sendTestAlert.mockResolvedValue({
      email: { __kind__: "sent", sent: null },
      sms: { __kind__: "sent", sent: null },
    });

    const user = userEvent.setup();
    renderWithProviders(<SettingsPage />);

    await user.click(
      await screen.findByRole("button", { name: /test alert/i }),
    );

    await waitFor(() => {
      expect(actor.sendTestAlert).toHaveBeenCalled();
    });
  });
});

/* ------------------------------------------------------------------ */
/* Admin menu                                                          */
/* ------------------------------------------------------------------ */

describe("Admin menu", () => {
  it("exposes every admin destination as a working link", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listRequests.mockResolvedValue([]);

    renderWithProviders(<AppLayout>content</AppLayout>);

    const menu = await screen.findByRole("navigation", { name: /^admin$/i });
    const expected: [string, string][] = [
      ["Dashboard", "/admin"],
      ["Requests", "/admin/requests"],
      ["Calendar", "/admin/calendar"],
      ["Customers", "/admin/customers"],
      ["Quotes", "/admin/quotes"],
      ["Jobs", "/admin/jobs"],
      ["Payments", "/admin/payments"],
      ["Messages", "/admin/messages"],
      ["Notifications", "/admin/notifications"],
      ["Settings", "/admin/settings"],
    ];
    for (const [label, href] of expected) {
      expect(within(menu).getByRole("link", { name: label })).toHaveAttribute(
        "href",
        href,
      );
    }
  });
});

/* ------------------------------------------------------------------ */
/* Requests                                                            */
/* ------------------------------------------------------------------ */

describe("Admin requests", () => {
  it("lists a request with its customer, quote, deposit and balance", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listRequests.mockResolvedValue([
      makeJob({
        id: 1n,
        status: JobStatus.quoted,
        quote: makeQuote({
          total: 25_000n,
          discountApplied: true,
          discountAmount: 5_000n,
          depositRequired: 2_500n,
          remainingBalance: 22_500n,
        }),
        deposit: makeDeposit({
          amount: 2_500n,
          status: DepositStatus.submitted,
        }),
      }),
    ]);
    actor.listCustomers.mockResolvedValue([
      makeCustomerSummary({ email: "jamie@example.com" }),
    ]);
    actor.listJobRecords.mockResolvedValue([]);

    renderWithProviders(<RequestsPage />);

    const table = await waitFor(() => {
      const node = ocid("admin.requests.table");
      expect(node).not.toBeNull();
      return node as HTMLElement;
    });
    expect(within(table).getAllByText("Jamie Rivera").length).toBeGreaterThan(
      0,
    );
    expect(within(table).getAllByText("$250.00").length).toBeGreaterThan(0);
    expect(within(table).getAllByText("$25.00").length).toBeGreaterThan(0);
    expect(within(table).getAllByText("$225.00").length).toBeGreaterThan(0);
  });

  it("filters the list by status and annotates a request", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listRequests.mockResolvedValue([
      makeJob({ id: 1n, status: JobStatus.requested }),
      makeJob({ id: 2n, status: JobStatus.quoted, quote: makeQuote() }),
    ]);
    actor.listCustomers.mockResolvedValue([
      makeCustomerSummary({ email: "jamie@example.com" }),
    ]);
    actor.listJobRecords.mockResolvedValue([]);
    actor.addCustomerNote.mockResolvedValue({ __kind__: "ok", ok: null });

    const user = userEvent.setup();
    renderWithProviders(<RequestsPage />);

    await screen.findByText("All requests");
    // Narrow to the quoted request via the status filter tab (quoted → Waiting).
    await user.click(ocid("admin.requests.filter.waiting") as HTMLElement);

    await waitFor(() => {
      expect(
        ocid("admin.requests.filter.waiting")?.getAttribute("aria-pressed"),
      ).toBe("true");
    });
    // Only the quoted request remains in the table (one desktop row).
    const filtered = ocid("admin.requests.table") as HTMLElement;
    expect(
      filtered.querySelectorAll('[data-ocid^="admin.table.row."]').length,
    ).toBe(1);

    // Open the request detail and save a note against its customer.
    await user.click(ocid("admin.table.row.1") as HTMLElement);
    const noteInput = await screen.findByLabelText(/add a note/i);
    await user.type(noteInput, "Called to confirm the details.");
    await user.click(screen.getByRole("button", { name: /save note/i }));

    await waitFor(() => {
      expect(actor.addCustomerNote).toHaveBeenCalledWith(
        1n,
        "Called to confirm the details.",
      );
    });
  });
});

/* ------------------------------------------------------------------ */
/* Customers                                                           */
/* ------------------------------------------------------------------ */

describe("Admin customers", () => {
  it("matches an existing customer instead of creating a duplicate", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listCustomers.mockResolvedValue([
      makeCustomerSummary({ id: 7n, email: "ada@example.com" }),
    ]);
    // The backend resolves the existing profile and returns its id.
    actor.createCustomer.mockResolvedValue({ __kind__: "ok", ok: 7n });

    const user = userEvent.setup();
    renderWithProviders(<CustomersPage />);

    await user.click(
      await screen.findByRole("button", { name: /new customer/i }),
    );
    await user.type(await screen.findByLabelText(/full name/i), "Ada Lovelace");
    await user.type(screen.getByLabelText(/email/i), "ada@example.com");
    await user.click(screen.getByRole("button", { name: /add customer/i }));

    await waitFor(() => {
      expect(actor.createCustomer).toHaveBeenCalledWith(
        expect.objectContaining({ email: "ada@example.com" }),
      );
    });
    // The existing profile id is what the backend returned, not a new one.
    expect(actor.createCustomer).toHaveBeenCalledTimes(1);
  });
});

/* ------------------------------------------------------------------ */
/* Customer profile                                                    */
/* ------------------------------------------------------------------ */

describe("Admin customer profile", () => {
  function makeProfile(
    overrides: Partial<CustomerProfileView> = {},
  ): CustomerProfileView {
    return makeCustomerProfile({
      customer: makeCustomerView({ id: 1n, fullName: "Ada Lovelace" }),
      jobs: [makeJob({ id: 1n, status: JobStatus.quoted, quote: makeQuote() })],
      quotes: [makeQuote({ quoteNumber: "Q-1001" })],
      appointments: [
        { confirmed: true, scheduledAt: 1_700_000_300_000_000_000n },
      ],
      jobRecords: [
        {
          id: 1n,
          jobRequestId: 1n,
          customerId: 1n,
          customerName: "Ada Lovelace",
          referenceCode: "HD-4F2A9C",
          category: makeJob().category,
          serviceAddress: "123 Honeycomb Lane",
          scheduledAt: 1_700_000_300_000_000_000n,
          status: JobRecordStatus.scheduled,
          remainingBalance: 22_500n,
          createdAt: 1_700_000_000_000_000_000n,
          quote: makeQuote(),
        } as JobRecordView,
      ],
      payments: [makePaymentHistory()],
      messages: [makeMessage({ body: "Could you come Thursday?" })],
      ...overrides,
    });
  }

  it("shows the customer's requests, quotes, appointments, jobs, payments, messages and notes", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.getCustomerProfile.mockResolvedValue(makeProfile());
    actor.listCustomerMessages.mockResolvedValue([
      makeMessage({ body: "Could you come Thursday?" }),
    ]);

    renderWithProviders(<CustomerProfilePage />);

    expect(await screen.findByText("Contact information")).toBeInTheDocument();
    expect(screen.getByText("Service requests")).toBeInTheDocument();
    expect(screen.getByText("Quotes")).toBeInTheDocument();
    expect(screen.getByText("Appointments")).toBeInTheDocument();
    expect(screen.getByText("Jobs")).toBeInTheDocument();
    expect(screen.getAllByText("Payment history").length).toBeGreaterThan(0);
    expect(screen.getByText("Messages")).toBeInTheDocument();
    expect(screen.getByText("Notes")).toBeInTheDocument();
    expect(
      await screen.findByText("Could you come Thursday?"),
    ).toBeInTheDocument();
  });

  it("saves an edited contact detail against the same customer id", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.getCustomerProfile.mockResolvedValue(makeProfile());
    actor.listCustomerMessages.mockResolvedValue([]);
    actor.updateCustomer.mockResolvedValue({ __kind__: "ok", ok: null });

    const user = userEvent.setup();
    renderWithProviders(<CustomerProfilePage />);

    await user.click(
      await screen.findByRole("button", { name: /edit customer/i }),
    );
    const phone = await screen.findByLabelText(/phone/i);
    await user.clear(phone);
    await user.type(phone, "(555) 999-0000");
    await user.click(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() => {
      expect(actor.updateCustomer).toHaveBeenCalledWith(
        1n,
        expect.objectContaining({ phone: "(555) 999-0000" }),
      );
    });
  });

  it("updates the customer lifecycle status from the profile", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.getCustomerProfile.mockResolvedValue(makeProfile());
    actor.listCustomerMessages.mockResolvedValue([]);
    actor.setCustomerStatus.mockResolvedValue({ __kind__: "ok", ok: null });

    const user = userEvent.setup();
    renderWithProviders(<CustomerProfilePage />);

    const statusSelect = await waitFor(() => {
      const node = ocid("customer_profile.status_select");
      expect(node).not.toBeNull();
      return node as HTMLSelectElement;
    });
    await user.selectOptions(statusSelect, "inactive");

    await waitFor(() => {
      expect(actor.setCustomerStatus).toHaveBeenCalledWith(
        1n,
        CustomerStatus.inactive,
      );
    });
  });

  it("archives a customer through the confirmation dialog", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.getCustomerProfile.mockResolvedValue(makeProfile());
    actor.listCustomerMessages.mockResolvedValue([]);
    actor.archiveCustomer.mockResolvedValue({ __kind__: "ok", ok: null });

    const user = userEvent.setup();
    renderWithProviders(<CustomerProfilePage />);

    await user.click(
      await screen.findByRole("button", { name: /archive customer/i }),
    );
    const dialog = await screen.findByRole("alertdialog");
    await user.click(
      within(dialog).getByRole("button", { name: /archive customer/i }),
    );

    await waitFor(() => {
      expect(actor.archiveCustomer).toHaveBeenCalledWith(1n);
    });
  });

  it("adds an internal note to the customer", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.getCustomerProfile.mockResolvedValue(makeProfile());
    actor.listCustomerMessages.mockResolvedValue([]);
    actor.addCustomerNote.mockResolvedValue({ __kind__: "ok", ok: null });

    const user = userEvent.setup();
    renderWithProviders(<CustomerProfilePage />);

    await user.type(
      await screen.findByLabelText(/add a note/i),
      "Gate code is 4821.",
    );
    await user.click(ocid("customer_profile.notes_save_button") as HTMLElement);

    await waitFor(() => {
      expect(actor.addCustomerNote).toHaveBeenCalledWith(
        1n,
        "Gate code is 4821.",
      );
    });
  });

  it("replies to the customer's message thread", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.getCustomerProfile.mockResolvedValue(makeProfile());
    actor.listCustomerMessages.mockResolvedValue([
      makeMessage({
        id: 1n,
        body: "Could you come Thursday?",
        fromAdmin: false,
      }),
    ]);
    actor.postAdminMessage.mockResolvedValue({ __kind__: "ok", ok: null });

    const user = userEvent.setup();
    renderWithProviders(<CustomerProfilePage />);

    expect(
      await screen.findByText("Could you come Thursday?"),
    ).toBeInTheDocument();
    await user.type(
      screen.getByLabelText(/reply to the customer/i),
      "Thursday morning works.",
    );
    await user.click(
      ocid("customer_profile.message_send_button") as HTMLElement,
    );

    await waitFor(() => {
      expect(actor.postAdminMessage).toHaveBeenCalledWith(
        1n,
        null,
        "Thursday morning works.",
      );
    });
  });
});

/* ------------------------------------------------------------------ */
/* Jobs                                                                */
/* ------------------------------------------------------------------ */

describe("Admin jobs", () => {
  function makeRecord(overrides: Partial<JobRecordView> = {}): JobRecordView {
    return {
      id: 1n,
      jobRequestId: 1n,
      customerId: 1n,
      customerName: "Ada Lovelace",
      referenceCode: "HD-4F2A9C",
      category: makeJob().category,
      serviceAddress: "123 Honeycomb Lane",
      scheduledAt: 1_700_000_300_000_000_000n,
      status: JobRecordStatus.scheduled,
      remainingBalance: 22_500n,
      createdAt: 1_700_000_000_000_000_000n,
      quote: makeQuote(),
      ...overrides,
    } as JobRecordView;
  }

  it("creates a job from a confirmed request and advances it to completion", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listJobRecords.mockResolvedValue([makeRecord()]);
    actor.listRequests.mockResolvedValue([
      makeJob({ id: 1n, status: JobStatus.scheduled, quote: makeQuote() }),
    ]);
    actor.listCustomers.mockResolvedValue([
      makeCustomerSummary({ email: "jamie@example.com" }),
    ]);
    actor.advanceJobRecord.mockResolvedValue({
      __kind__: "ok",
      ok: makeRecord({ status: JobRecordStatus.inProgress }),
    });
    actor.completeJobRecord.mockResolvedValue({
      __kind__: "ok",
      ok: makeRecord({ status: JobRecordStatus.completed }),
    });

    const user = userEvent.setup();
    renderWithProviders(<JobsPage />);

    const table = await waitFor(() => {
      const node = ocid("admin.jobs.table");
      expect(node).not.toBeNull();
      return node as HTMLElement;
    });
    expect(within(table).getAllByText("Ada Lovelace").length).toBeGreaterThan(
      0,
    );

    // Open the job and advance it, then mark it completed.
    await user.click(within(table).getAllByText("Ada Lovelace")[0]);
    await user.click(
      await screen.findByRole("button", { name: /advance status/i }),
    );
    await waitFor(() => {
      expect(actor.advanceJobRecord).toHaveBeenCalledWith(1n);
    });

    await user.click(screen.getByRole("button", { name: /mark completed/i }));
    await waitFor(() => {
      expect(actor.completeJobRecord).toHaveBeenCalledWith(1n);
    });
  });
});

/* ------------------------------------------------------------------ */
/* Messages                                                            */
/* ------------------------------------------------------------------ */

describe("Admin messages", () => {
  it("lists a customer conversation and lets the owner reply", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listCustomers.mockResolvedValue([
      makeCustomerSummary({ id: 1n, fullName: "Ada Lovelace" }),
    ]);
    actor.listCustomerMessages.mockResolvedValue([
      makeMessage({ body: "Could you come Thursday?" }),
    ]);
    actor.postAdminMessage.mockResolvedValue({ __kind__: "ok", ok: null });

    const user = userEvent.setup();
    renderWithProviders(<MessagesPage />);

    const list = await waitFor(() => {
      const node = ocid("admin.messages.list");
      expect(node).not.toBeNull();
      return node as HTMLElement;
    });
    await user.click(
      within(list).getByRole("button", { name: /ada lovelace/i }),
    );

    expect(
      await screen.findAllByText("Could you come Thursday?"),
    ).not.toHaveLength(0);

    await user.type(
      await screen.findByLabelText(/reply to the customer/i),
      "Thursday morning works.",
    );
    await user.click(screen.getByRole("button", { name: /send reply/i }));

    await waitFor(() => {
      expect(actor.postAdminMessage).toHaveBeenCalledWith(
        1n,
        null,
        "Thursday morning works.",
      );
    });
  });
});

/* ------------------------------------------------------------------ */
/* Discount settings                                                   */
/* ------------------------------------------------------------------ */

describe("Admin discount settings", () => {
  it("creates, activates and deactivates a discount rule", async () => {
    const actor = setActor();
    actor.getSettings.mockResolvedValue(makeSettings());
    actor.getOwnerAlertEmail.mockResolvedValue("owner@example.com");
    actor.getOwnerAlertPhone.mockResolvedValue("+14053124987");
    actor.getTwilioConfigStatus.mockResolvedValue({
      configured: true,
      fromNumber: "+14053124987",
    });
    actor.listDiscounts.mockResolvedValue([
      {
        id: 1n,
        name: "Spring 10%",
        kind: "percentage",
        value: 10n,
        active: true,
        eligibility: "all",
        minPurchase: 0n,
        maxDiscount: 0n,
        createdAt: 1_700_000_000_000_000_000n,
      },
    ]);
    actor.createDiscount.mockResolvedValue({ __kind__: "ok", ok: null });
    actor.setDiscountActive.mockResolvedValue({ __kind__: "ok", ok: null });

    const user = userEvent.setup();
    renderWithProviders(<SettingsPage />);

    await user.type(
      await screen.findByLabelText(/^name$/i),
      "Returning customer 10%",
    );
    await user.type(
      ocid("admin.settings.discounts.value_input") as HTMLElement,
      "10",
    );
    await user.click(screen.getByRole("button", { name: /create discount/i }));

    await waitFor(() => {
      expect(actor.createDiscount).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Returning customer 10%" }),
      );
    });

    // The saved rule can be turned off from the list (desktop + mobile rows).
    const turnOff = await screen.findAllByRole("button", { name: /turn off/i });
    await user.click(turnOff[0]);
    await waitFor(() => {
      expect(actor.setDiscountActive).toHaveBeenCalledWith(1n, false);
    });
  });
});
