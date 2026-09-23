import { JobStatus, PaymentMethod } from "@/backend";
import {
  CASHAPP_HANDLE,
  CHIME_HANDLE,
  DEPOSIT_OPTIONS,
  PAYPAL_ACCOUNT,
  VENMO_HANDLE,
} from "@/lib/jobs";
import { makeJob, makeQuote } from "@/test/fixtures";
import {
  installCoreInfrastructureMocks,
  renderWithProviders,
  setActor,
} from "@/test/harness";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

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

import { TrackPage } from "@/pages/Track";

/**
 * The Track page deposit card now offers four manual payment options side by
 * side — Cash App, Venmo, PayPal and Chime — each with its own handle and copy
 * button, and a deep link where the provider has one. Cash App stays fully
 * available and unchanged; the new options are added alongside it.
 *
 * The backend `PaymentMethod` enum only has `stripe` and `cashApp`, so every
 * manual option records through the existing `cashApp` variant while the UI
 * names the provider the customer actually chose.
 */
async function lookupJob(reference = "HD-4F2A9C") {
  const user = userEvent.setup();
  renderWithProviders(<TrackPage />);
  await user.type(screen.getByLabelText(/reference code/i), reference);
  await user.click(screen.getByRole("button", { name: /find my job/i }));
  return user;
}

/** The deposit card element, or null before it has rendered. */
function depositCard(): HTMLElement | null {
  return document.querySelector('[data-ocid="track.deposit_card"]');
}

beforeEach(() => {
  setActor();
  window.history.replaceState({}, "", "/track");
});

afterEach(() => {
  window.history.replaceState({}, "", "/track");
});

describe("Track deposit card payment options", () => {
  it("shows all four options with their correct handles and copy buttons", async () => {
    const actor = setActor();
    actor.getRequestByReference.mockResolvedValue(
      makeJob({
        status: JobStatus.scheduled,
        quote: makeQuote({ amount: 20_000n }),
      }),
    );

    await lookupJob();

    await waitFor(() => {
      expect(depositCard()).not.toBeNull();
    });
    const card = depositCard() as HTMLElement;

    // Every option renders its provider name, handle and copy affordance.
    for (const option of DEPOSIT_OPTIONS) {
      expect(
        within(card).getByText(option.label, { exact: true }),
      ).toBeInTheDocument();
      expect(within(card).getByText(option.handle)).toBeInTheDocument();
      expect(
        within(card).getByRole("button", {
          name: `Copy ${option.label} handle`,
        }),
      ).toBeInTheDocument();
    }

    // The four handles are the ones the owner specified.
    expect(CASHAPP_HANDLE).toBe("$Taetae22Wright");
    expect(VENMO_HANDLE).toBe("@Lavona-Wright");
    expect(PAYPAL_ACCOUNT).toBe("tanae Wright");
    expect(CHIME_HANDLE).toBe("$Tanae-Wright-2");
  });

  it("copies the handle of whichever option the customer picks", async () => {
    const actor = setActor();
    actor.getRequestByReference.mockResolvedValue(
      makeJob({
        status: JobStatus.scheduled,
        quote: makeQuote({ amount: 20_000n }),
      }),
    );

    const user = await lookupJob();
    const writeText = vi.spyOn(navigator.clipboard, "writeText");

    await user.click(
      await screen.findByRole("button", { name: /copy venmo handle/i }),
    );

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith(VENMO_HANDLE);
    });
  });

  it("offers a deep link for Cash App and Venmo but not PayPal or Chime", async () => {
    const actor = setActor();
    actor.getRequestByReference.mockResolvedValue(
      makeJob({
        status: JobStatus.scheduled,
        quote: makeQuote({ amount: 20_000n }),
      }),
    );

    const user = await lookupJob();
    await waitFor(() => {
      expect(depositCard()).not.toBeNull();
    });

    // Cash App is selected by default and exposes its deep link.
    const cashAppLink = document.querySelector(
      '[data-ocid="track.deposit_open_link.cashapp"]',
    );
    expect(cashAppLink).not.toBeNull();
    expect(cashAppLink).toHaveAttribute(
      "href",
      "https://cash.app/$Taetae22Wright",
    );

    // Selecting Venmo swaps in the Venmo deep link.
    await user.click(
      document.querySelector(
        '[data-ocid="track.deposit_select_button.venmo"]',
      ) as HTMLElement,
    );
    await waitFor(() => {
      expect(
        document.querySelector('[data-ocid="track.deposit_open_link.venmo"]'),
      ).not.toBeNull();
    });
    expect(
      document.querySelector('[data-ocid="track.deposit_open_link.venmo"]'),
    ).toHaveAttribute("href", "https://venmo.com/Lavona-Wright");

    // PayPal and Chime have no deep link, so no open link is offered for them.
    await user.click(
      document.querySelector(
        '[data-ocid="track.deposit_select_button.paypal"]',
      ) as HTMLElement,
    );
    expect(
      document.querySelector('[data-ocid="track.deposit_open_link.paypal"]'),
    ).toBeNull();

    await user.click(
      document.querySelector(
        '[data-ocid="track.deposit_select_button.chime"]',
      ) as HTMLElement,
    );
    expect(
      document.querySelector('[data-ocid="track.deposit_open_link.chime"]'),
    ).toBeNull();
  });

  it("records the deposit when the customer confirms sending it via a non-Cash-App option", async () => {
    const actor = setActor();
    actor.getRequestByReference.mockResolvedValue(
      makeJob({
        status: JobStatus.scheduled,
        quote: makeQuote({ amount: 20_000n }),
      }),
    );

    const user = await lookupJob();
    await waitFor(() => {
      expect(depositCard()).not.toBeNull();
    });

    // Pick Chime, then confirm the deposit was sent.
    await user.click(
      document.querySelector(
        '[data-ocid="track.deposit_select_button.chime"]',
      ) as HTMLElement,
    );
    await user.click(
      document.querySelector(
        '[data-ocid="track.deposit_sent_button"]',
      ) as HTMLElement,
    );

    await waitFor(() => {
      expect(actor.recordDeposit).toHaveBeenCalledWith(
        "HD-4F2A9C",
        PaymentMethod.cashApp,
      );
    });
    // The confirmation names the provider the customer actually chose.
    expect(
      await screen.findByText(/we'll confirm your chime deposit shortly/i),
    ).toBeInTheDocument();
  });

  it("keeps Cash App selected and functional by default", async () => {
    const actor = setActor();
    actor.getRequestByReference.mockResolvedValue(
      makeJob({
        status: JobStatus.scheduled,
        quote: makeQuote({ amount: 20_000n }),
      }),
    );

    const user = await lookupJob();
    await waitFor(() => {
      expect(depositCard()).not.toBeNull();
    });

    // Cash App is the default selection and its handle is visible.
    expect(
      document.querySelector(
        '[data-ocid="track.deposit_select_button.cashapp"]',
      ),
    ).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText(CASHAPP_HANDLE)).toBeInTheDocument();

    await user.click(
      document.querySelector(
        '[data-ocid="track.deposit_sent_button"]',
      ) as HTMLElement,
    );

    await waitFor(() => {
      expect(actor.recordDeposit).toHaveBeenCalledWith(
        "HD-4F2A9C",
        PaymentMethod.cashApp,
      );
    });
  });
});
