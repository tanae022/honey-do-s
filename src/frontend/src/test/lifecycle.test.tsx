import { JobStatus, PaymentMethod, ServiceCategory } from "@/backend";
import {
  makeAppointment,
  makeDeposit,
  makeJob,
  makeQuote,
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
}));

import { AdminPage } from "@/pages/Admin";
import { RequestPage } from "@/pages/Request";
import { TrackPage } from "@/pages/Track";

/**
 * The end-to-end guest journey the current request must not break:
 * request -> quote -> accept -> deposit -> appointment -> status -> review.
 *
 * Each leg is driven through the real page components against one typed local
 * actor mock, and the assertions are on the observable actor calls and the
 * customer-visible outcome. Layout, bee artwork, and the new package/bee
 * sections are intentionally changing and are deliberately not asserted here.
 */
beforeEach(() => {
  setActor();
  window.history.replaceState({}, "", "/track");
});

describe("request-to-review lifecycle journey", () => {
  it("walks a guest request through quote, acceptance, deposit, appointment, completion and review", async () => {
    const actor = setActor();
    const user = userEvent.setup();

    // --- 1. Guest submits a request and receives a reference code. ---
    actor.submitRequest.mockResolvedValue("HD-4F2A9C");
    const request = renderWithProviders(<RequestPage />);

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
    expect(actor.submitRequest).toHaveBeenCalledTimes(1);
    expect(actor.submitRequest.mock.calls[0][0]).toMatchObject({
      customerName: "Jamie Rivera",
      email: "jamie@example.com",
      phone: "(555) 123-4567",
      category: ServiceCategory.fixIt,
    });
    request.unmount();

    // --- 2. Admin sees the request and sends a quote. ---
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listRequests.mockResolvedValue([makeJob({ id: 7n })]);
    const admin = renderWithProviders(<AdminPage />);

    const amount = await screen.findByLabelText(/quote amount/i);
    await user.type(amount, "200.00");
    await user.click(screen.getByRole("button", { name: /send quote/i }));

    await waitFor(() => {
      expect(actor.setQuote).toHaveBeenCalledWith(7n, 20_000n, "");
    });
    admin.unmount();

    // --- 3. Guest accepts the quote. ---
    actor.getRequestByReference.mockResolvedValue(
      makeJob({
        status: JobStatus.quoted,
        quote: makeQuote({ amount: 20_000n }),
      }),
    );
    const track = renderWithProviders(<TrackPage />);

    await user.type(screen.getByLabelText(/reference code/i), "HD-4F2A9C");
    await user.click(screen.getByRole("button", { name: /find my job/i }));
    await user.click(
      await screen.findByRole("button", { name: /accept quote/i }),
    );

    await waitFor(() => {
      expect(actor.acceptQuote).toHaveBeenCalledWith("HD-4F2A9C");
    });
    track.unmount();

    // --- 4. Guest pays the deposit by Cash App. ---
    actor.getRequestByReference.mockResolvedValue(
      makeJob({
        status: JobStatus.scheduled,
        quote: makeQuote({ amount: 20_000n }),
      }),
    );
    const deposit = renderWithProviders(<TrackPage />);

    await user.type(screen.getByLabelText(/reference code/i), "HD-4F2A9C");
    await user.click(screen.getByRole("button", { name: /find my job/i }));
    await user.click(
      await screen.findByRole("button", { name: /i've sent it/i }),
    );

    await waitFor(() => {
      expect(actor.recordDeposit).toHaveBeenCalledWith(
        "HD-4F2A9C",
        PaymentMethod.cashApp,
      );
    });
    deposit.unmount();

    // --- 5. Admin schedules the visit; guest confirms it. ---
    actor.listRequests.mockResolvedValue([
      makeJob({ id: 7n, status: JobStatus.scheduled, quote: makeQuote() }),
    ]);
    const schedule = renderWithProviders(<AdminPage />);

    const when = await screen.findByLabelText(/schedule a visit/i);
    await user.type(when, "2026-10-01T10:00");
    await user.click(screen.getByRole("button", { name: /^schedule$/i }));

    await waitFor(() => {
      expect(actor.scheduleAppointment).toHaveBeenCalledTimes(1);
    });
    expect(actor.scheduleAppointment.mock.calls[0][0]).toBe(7n);
    schedule.unmount();

    actor.getRequestByReference.mockResolvedValue(
      makeJob({
        status: JobStatus.scheduled,
        quote: makeQuote(),
        appointment: makeAppointment({ confirmed: false }),
      }),
    );
    const confirm = renderWithProviders(<TrackPage />);

    await user.type(screen.getByLabelText(/reference code/i), "HD-4F2A9C");
    await user.click(screen.getByRole("button", { name: /find my job/i }));
    await user.click(
      await screen.findByRole("button", { name: /confirm appointment/i }),
    );

    await waitFor(() => {
      expect(actor.confirmAppointment).toHaveBeenCalledWith("HD-4F2A9C");
    });
    confirm.unmount();

    // --- 6. Admin advances the job to completion. ---
    actor.listRequests.mockResolvedValue([
      makeJob({ id: 7n, status: JobStatus.inProgress, quote: makeQuote() }),
    ]);
    const advance = renderWithProviders(<AdminPage />);

    await user.click(
      await screen.findByRole("button", { name: /move to completed/i }),
    );

    await waitFor(() => {
      expect(actor.advanceStatus).toHaveBeenCalledWith(7n);
    });
    advance.unmount();

    // --- 7. Guest leaves a review on the completed job. ---
    actor.getRequestByReference.mockResolvedValue(
      makeJob({
        status: JobStatus.completed,
        quote: makeQuote(),
        deposit: makeDeposit({ paid: true }),
      }),
    );
    const review = renderWithProviders(<TrackPage />);

    await user.type(screen.getByLabelText(/reference code/i), "HD-4F2A9C");
    await user.click(screen.getByRole("button", { name: /find my job/i }));
    await user.click(
      await screen.findByRole("button", { name: /rate 4 out of 5/i }),
    );
    await user.type(
      screen.getByLabelText(/leave a comment/i),
      "Great work, very tidy.",
    );
    await user.click(screen.getByRole("button", { name: /submit review/i }));

    await waitFor(() => {
      expect(actor.submitReview).toHaveBeenCalledWith(
        "HD-4F2A9C",
        4n,
        "Great work, very tidy.",
      );
    });
    review.unmount();
  });

  it("records a CashApp deposit through the manual-payment path", async () => {
    const actor = setActor();
    actor.getRequestByReference.mockResolvedValue(
      makeJob({
        status: JobStatus.scheduled,
        quote: makeQuote({ amount: 20_000n }),
      }),
    );
    const user = userEvent.setup();
    renderWithProviders(<TrackPage />);

    await user.type(screen.getByLabelText(/reference code/i), "HD-4F2A9C");
    await user.click(screen.getByRole("button", { name: /find my job/i }));
    await user.click(
      await screen.findByRole("button", { name: /i've sent it/i }),
    );

    await waitFor(() => {
      expect(actor.recordDeposit).toHaveBeenCalledWith(
        "HD-4F2A9C",
        PaymentMethod.cashApp,
      );
    });
  });
});
