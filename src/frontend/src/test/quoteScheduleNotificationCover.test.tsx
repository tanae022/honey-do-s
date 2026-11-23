import {
  JobStatus,
  NotificationKind,
  QuoteStatus,
  ServiceCategory,
} from "@/backend";
import {
  makeCustomerSummary,
  makeJob,
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
  useRouterState: () => ({ location: { pathname: "/admin/quotes" } }),
}));

import { NotificationBell } from "@/components/NotificationBell";
import { QuotesPage } from "@/pages/Quotes";
import { SchedulePage } from "@/pages/Schedule";

beforeEach(() => {
  setActor();
});

/* ------------------------------------------------------------------ */
/* Quote builder — line items, totals and lifecycle actions            */
/* ------------------------------------------------------------------ */

describe("quote builder", () => {
  it("computes subtotal, total, deposit and remaining from line items and labor", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listRequests.mockResolvedValue([
      makeJob({ id: 1n, customerName: "Ada Lovelace" }),
    ]);
    actor.listCustomers.mockResolvedValue([]);

    const user = userEvent.setup();
    renderWithProviders(<QuotesPage />);

    await user.click(
      await screen.findByRole("button", { name: /ada lovelace/i }),
    );

    // One line item: 2 × $50.00 = $100.00, plus $25.00 labor = $125.00 total.
    await user.type(
      screen.getByLabelText(/^description$/i),
      "Replace kitchen faucet",
    );
    const qty = screen.getByLabelText(/^qty$/i);
    await user.clear(qty);
    await user.type(qty, "2");
    await user.type(screen.getByLabelText(/unit price/i), "50");
    await user.type(screen.getByLabelText(/labor charge/i), "25");
    await user.type(screen.getByLabelText(/deposit required/i), "50");

    const totals = screen
      .getAllByText("Subtotal")[0]
      .closest("dl") as HTMLElement;
    // Subtotal and total both read $125.00; the deposit leaves $75.00.
    expect(within(totals).getAllByText("$125.00").length).toBeGreaterThan(0);
    expect(within(totals).getByText("$75.00")).toBeInTheDocument();
  });

  it("saves a new quote through setQuote then editQuote with the itemized input", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listRequests.mockResolvedValue([
      makeJob({ id: 1n, customerName: "Ada Lovelace" }),
    ]);
    actor.listCustomers.mockResolvedValue([]);
    actor.setQuote.mockResolvedValue({ __kind__: "ok", ok: null });
    actor.editQuote.mockResolvedValue({ __kind__: "ok", ok: null });

    const user = userEvent.setup();
    renderWithProviders(<QuotesPage />);

    await user.click(
      await screen.findByRole("button", { name: /ada lovelace/i }),
    );
    await user.type(
      screen.getByLabelText(/description of requested work/i),
      "Replace the kitchen faucet and reseal the sink.",
    );
    await user.type(
      screen.getByLabelText(/^description$/i),
      "Replace kitchen faucet",
    );
    await user.type(screen.getByLabelText(/unit price/i), "50");
    await user.click(screen.getByRole("button", { name: /save quote/i }));

    await waitFor(() =>
      expect(actor.setQuote).toHaveBeenCalledWith(1n, 5000n, ""),
    );
    await waitFor(() =>
      expect(actor.editQuote).toHaveBeenCalledWith(
        1n,
        expect.objectContaining({
          workDescription: "Replace the kitchen faucet and reseal the sink.",
          lineItems: [
            expect.objectContaining({
              description: "Replace kitchen faucet",
              quantity: 1n,
              unitPrice: 5000n,
            }),
          ],
        }),
      ),
    );
  });

  it("sends, approves, declines and converts an existing quote", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listRequests.mockResolvedValue([
      makeJob({
        id: 1n,
        customerName: "Ada Lovelace",
        status: JobStatus.quoted,
        quote: makeQuote({ status: QuoteStatus.sent }),
      }),
    ]);
    actor.listCustomers.mockResolvedValue([]);
    actor.sendQuote.mockResolvedValue({ __kind__: "ok", ok: null });
    actor.approveQuote.mockResolvedValue({ __kind__: "ok", ok: null });
    actor.declineQuote.mockResolvedValue({ __kind__: "ok", ok: null });
    actor.convertQuoteToJob.mockResolvedValue({ __kind__: "ok", ok: null });
    actor.scheduleAppointment.mockResolvedValue({ __kind__: "ok", ok: null });

    const user = userEvent.setup();
    renderWithProviders(<QuotesPage />);

    await user.click(
      await screen.findByRole("button", { name: /ada lovelace/i }),
    );

    await user.click(screen.getByRole("button", { name: /send quote/i }));
    await waitFor(() => expect(actor.sendQuote).toHaveBeenCalledWith(1n));

    await user.click(screen.getByRole("button", { name: /^approve$/i }));
    await waitFor(() => expect(actor.approveQuote).toHaveBeenCalledWith(1n));

    await user.click(screen.getByRole("button", { name: /^decline$/i }));
    await waitFor(() => expect(actor.declineQuote).toHaveBeenCalledWith(1n));

    await user.click(screen.getByRole("button", { name: /convert to job/i }));
    await waitFor(() =>
      expect(actor.convertQuoteToJob).toHaveBeenCalledWith(
        1n,
        expect.any(BigInt),
      ),
    );
    await waitFor(() =>
      expect(actor.scheduleAppointment).toHaveBeenCalledWith(
        1n,
        expect.any(BigInt),
      ),
    );
  });

  it("shows the customer-facing preview with branding, customer and itemized totals", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listRequests.mockResolvedValue([
      makeJob({
        id: 1n,
        customerName: "Ada Lovelace",
        email: "ada@example.com",
        phone: "(555) 123-4567",
      }),
    ]);
    actor.listCustomers.mockResolvedValue([
      makeCustomerSummary({
        id: 1n,
        fullName: "Ada Lovelace",
        email: "ada@example.com",
        serviceAddress: "123 Honeycomb Lane",
      }),
    ]);

    const user = userEvent.setup();
    renderWithProviders(<QuotesPage />);

    await user.click(
      await screen.findByRole("button", { name: /ada lovelace/i }),
    );

    const preview = await screen.findByText(
      /how the customer reads this quote/i,
    );
    expect(preview).toBeInTheDocument();
    // Branding, customer details and the service address from the customer record.
    expect(screen.getAllByText(/Honey Do's/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText("123 Honeycomb Lane").length).toBeGreaterThan(0);
    expect(screen.getAllByText("ada@example.com").length).toBeGreaterThan(0);
    // The itemized table and totals are present.
    expect(screen.getByText("Item")).toBeInTheDocument();
    expect(screen.getAllByText("Remaining balance").length).toBeGreaterThan(0);
  });
});

/* ------------------------------------------------------------------ */
/* Scheduling — calendar and status lists                              */
/* ------------------------------------------------------------------ */

describe("scheduling area", () => {
  it("renders the calendar and all six status lists", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listRequests.mockResolvedValue([]);
    actor.listCustomers.mockResolvedValue([]);

    renderWithProviders(<SchedulePage />);

    // Wait for the board to replace its loading state.
    await screen.findByRole("heading", { name: /upcoming appointments/i });
    expect(
      screen.getByRole("heading", { name: /pending service requests/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /approved appointments/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /jobs in progress/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /completed jobs/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /cancelled jobs/i }),
    ).toBeInTheDocument();
    // The month calendar grid is present with its navigation controls.
    expect(
      screen.getByRole("button", { name: /previous month/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /next month/i }),
    ).toBeInTheDocument();
  });

  it("groups jobs into the correct status lists", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listCustomers.mockResolvedValue([]);
    actor.listRequests.mockResolvedValue([
      makeJob({
        id: 1n,
        customerName: "Pending Pat",
        status: JobStatus.requested,
      }),
      makeJob({
        id: 2n,
        customerName: "Progress Pam",
        status: JobStatus.inProgress,
      }),
      makeJob({
        id: 3n,
        customerName: "Done Dana",
        status: JobStatus.completed,
      }),
      makeJob({
        id: 4n,
        customerName: "Cancelled Cam",
        status: JobStatus.cancelled,
      }),
    ]);

    renderWithProviders(<SchedulePage />);

    await screen.findByRole("heading", { name: /pending service requests/i });

    const card = (key: string) =>
      document.querySelector(
        `[data-ocid="schedule.list.${key}"]`,
      ) as HTMLElement;

    expect(
      within(card("pending")).getByText("Pending Pat"),
    ).toBeInTheDocument();
    expect(
      within(card("inProgress")).getByText("Progress Pam"),
    ).toBeInTheDocument();
    expect(
      within(card("completed")).getByText("Done Dana"),
    ).toBeInTheDocument();
    expect(
      within(card("cancelled")).getByText("Cancelled Cam"),
    ).toBeInTheDocument();
  });

  it("saves an appointment linked to the selected customer", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listRequests.mockResolvedValue([]);
    actor.listCustomers.mockResolvedValue([
      makeCustomerSummary({
        id: 5n,
        fullName: "Ada Lovelace",
        email: "ada@example.com",
        phone: "(555) 123-4567",
      }),
    ]);
    actor.createJobForCustomer.mockResolvedValue({
      __kind__: "ok",
      ok: makeJob({ id: 9n, referenceCode: "HD-4F2A9C" }),
    });
    actor.scheduleAppointment.mockResolvedValue({
      __kind__: "ok",
      ok: makeJob({ id: 9n, referenceCode: "HD-4F2A9C" }),
    });

    const user = userEvent.setup();
    renderWithProviders(<SchedulePage />);

    const select = await screen.findByLabelText(/^customer$/i);
    await screen.findByRole("option", { name: "Ada Lovelace" });
    await user.selectOptions(select, "5");
    await user.type(
      screen.getByLabelText(/date and time/i),
      "2026-06-15T10:00",
    );
    await user.click(screen.getByRole("button", { name: /save appointment/i }));

    // The new job is created for the selected customer id, then scheduled.
    await waitFor(() =>
      expect(actor.createJobForCustomer).toHaveBeenCalledWith(
        5n,
        expect.objectContaining({
          customerName: "Ada Lovelace",
          email: "ada@example.com",
          phone: "(555) 123-4567",
        }),
      ),
    );
    await waitFor(() =>
      expect(actor.scheduleAppointment).toHaveBeenCalledWith(
        9n,
        expect.any(BigInt),
      ),
    );
  });
});

/* ------------------------------------------------------------------ */
/* Notifications — new kinds and unread indicator                      */
/* ------------------------------------------------------------------ */

describe("notification indicators", () => {
  it("shows an unread badge and labels quote, deposit and appointment kinds", async () => {
    const actor = setActor();
    actor.getUnreadNotificationCount.mockResolvedValue(4n);
    actor.listNotifications.mockResolvedValue([
      makeNotification({
        id: 1n,
        kind: NotificationKind.quoteApproved,
        title: "Quote approved",
      }),
      makeNotification({
        id: 2n,
        kind: NotificationKind.quoteDeclined,
        title: "Quote declined",
      }),
      makeNotification({
        id: 3n,
        kind: NotificationKind.depositReceived,
        title: "Deposit received",
      }),
      makeNotification({
        id: 4n,
        kind: NotificationKind.appointmentChanged,
        title: "Appointment changed",
      }),
    ]);

    const user = userEvent.setup();
    renderWithProviders(<NotificationBell />);

    await user.click(
      await screen.findByRole("button", { name: /notifications, 4 unread/i }),
    );

    expect(
      (await screen.findAllByText("Quote approved")).length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText("Quote declined").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Deposit received").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Appointment changed").length).toBeGreaterThan(
      0,
    );
  });
});
