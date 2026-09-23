import { JobStatus, PaymentMethod, ServiceCategory } from "@/backend";
import { CASHAPP_HANDLE } from "@/lib/jobs";
import { makeJob, makeQuote } from "@/test/fixtures";
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

import { AdminPage } from "@/pages/Admin";
import { RequestPage } from "@/pages/Request";
import { TrackPage } from "@/pages/Track";

/**
 * Characterization baseline for behavior the current request must not break.
 *
 * The request intentionally changes the deposit surface (CashApp only, card
 * hidden), adds an own-parts/supplies discount, and reworks the bee artwork and
 * background. Those changing areas are deliberately NOT asserted here. What is
 * pinned is the adjacent working behavior that must survive:
 *
 *  - the CashApp deposit path (handle + "I've sent it" recording) still works;
 *  - the admin sees a request's description and photos alongside the quote box;
 *  - the request form's existing package-interest checkbox still submits.
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

describe("CashApp deposit path", () => {
  it("shows the CashApp handle and records the deposit when the customer confirms sending it", async () => {
    const actor = setActor();
    actor.getRequestByReference.mockResolvedValue(
      makeJob({
        status: JobStatus.scheduled,
        quote: makeQuote({ amount: 20_000n }),
      }),
    );

    const user = await lookupJob();

    // The handle the customer must pay is visible.
    expect(await screen.findByText(CASHAPP_HANDLE)).toBeInTheDocument();

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

  it("does not offer the deposit action once the deposit is already paid", async () => {
    const actor = setActor();
    actor.getRequestByReference.mockResolvedValue(
      makeJob({
        status: JobStatus.inProgress,
        quote: makeQuote({ amount: 20_000n }),
        deposit: {
          amount: 10_000n,
          method: PaymentMethod.cashApp,
          paid: true,
          paidAt: 1_700_000_200_000_000_000n,
        },
      }),
    );

    await lookupJob();

    expect(await screen.findByText(/deposit paid/i)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /i've sent it/i }),
    ).not.toBeInTheDocument();
  });
});

describe("admin quote context", () => {
  it("shows the request description and photos alongside the quote box", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listRequests.mockResolvedValue([
      makeJob({
        id: 7n,
        description: "The kitchen faucet drips constantly.",
        photoIds: ["blob-a", "blob-b"],
      }),
    ]);

    renderWithProviders(<AdminPage />);

    // The description the owner quotes from is visible.
    expect(
      await screen.findByText("The kitchen faucet drips constantly."),
    ).toBeInTheDocument();

    // The uploaded photos render as thumbnails on the same request card.
    await waitFor(() => {
      expect(
        document.querySelector('[data-ocid="admin.request_photos.1"]'),
      ).not.toBeNull();
    });
    const photos = document.querySelector(
      '[data-ocid="admin.request_photos.1"]',
    );
    expect(photos?.querySelectorAll("li")).toHaveLength(2);

    // The quote controls sit on that same request card, so the owner can quote
    // from the description and photos without leaving the card.
    const card = document.querySelector('[data-ocid="admin.request_card.1"]');
    expect(card).not.toBeNull();
    expect(
      within(card as HTMLElement).getByLabelText(/quote amount/i),
    ).toBeInTheDocument();
    expect(
      within(card as HTMLElement).getByRole("button", { name: /send quote/i }),
    ).toBeInTheDocument();
  });
});

describe("request form package interest", () => {
  it("submits the package-interest checkbox value with the request", async () => {
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
    await user.click(
      screen.getByRole("checkbox", { name: /monthly package/i }),
    );
    await user.click(screen.getByRole("button", { name: /send my request/i }));

    await waitFor(() => {
      expect(actor.submitRequest).toHaveBeenCalledTimes(1);
    });
    expect(actor.submitRequest.mock.calls[0][0]).toMatchObject({
      category: ServiceCategory.fixIt,
      packageInterest: true,
    });
  });
});

describe("own-parts/supplies 10% discount", () => {
  it("submits the own-parts checkbox value with the request", async () => {
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
    await user.click(
      screen.getByRole("checkbox", { name: /own parts\/supplies/i }),
    );
    await user.click(screen.getByRole("button", { name: /send my request/i }));

    await waitFor(() => {
      expect(actor.submitRequest).toHaveBeenCalledTimes(1);
    });
    expect(actor.submitRequest.mock.calls[0][0]).toMatchObject({
      ownParts: true,
    });
  });

  it("shows the applied discount on the customer's quote", async () => {
    const actor = setActor();
    actor.getRequestByReference.mockResolvedValue(
      makeJob({
        status: JobStatus.quoted,
        ownParts: true,
        quote: makeQuote({
          amount: 18_000n,
          discountApplied: true,
          discountAmount: 2_000n,
        }),
      }),
    );

    await lookupJob();

    const badge = await screen.findByText(/10% off/i);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent(/own parts\/supplies discount applied/i);
    expect(badge).toHaveTextContent(/\$20\.00/);
    expect(
      screen.getByText(/own parts\/supplies discount \(10%\)/i),
    ).toBeInTheDocument();
  });

  it("shows the applied discount next to the admin quote box", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listRequests.mockResolvedValue([
      makeJob({
        id: 7n,
        ownParts: true,
        status: JobStatus.quoted,
        quote: makeQuote({
          amount: 18_000n,
          discountApplied: true,
          discountAmount: 2_000n,
        }),
      }),
    ]);

    renderWithProviders(<AdminPage />);

    expect(
      await screen.findByText(/own parts\/supplies discount applied/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/\$20\.00/)).toBeInTheDocument();
  });
});
