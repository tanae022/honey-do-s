import { JobStatus } from "@/backend";
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

/**
 * Characterization baseline for the owner-notification surface the current
 * request must not break.
 *
 * The request intentionally seeds the owner alert email, adds an owner alert
 * phone field, sends an SMS on new requests, and reworks the Owner alerts panel
 * into a combined test action. Those changing surfaces are deliberately NOT
 * asserted here. What is pinned is the adjacent working behavior that must
 * survive:
 *
 *  - appointment scheduling still notifies the customer and the owner (the
 *    admin schedule action still calls `scheduleAppointment` and the scheduled
 *    visit is reflected on the request card);
 *  - the Owner alerts panel still shows the saved email, still saves a valid
 *    address, and still refuses to overwrite the saved value for an invalid
 *    address;
 *  - the Owner alerts panel is still admin-gated, so a non-admin cannot read or
 *    change the owner alert email;
 *  - a submitted request still returns its reference code even when the owner
 *    notification cannot be delivered.
 */
beforeEach(() => {
  setActor();
  window.localStorage.clear();
});

async function renderAdmin(actor = setActor()) {
  actor.isCallerAdmin.mockResolvedValue(true);
  renderWithProviders(<AdminPage />);
  await screen.findByText("Owner alerts");
  return actor;
}

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
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
}

describe("appointment scheduling still notifies both parties", () => {
  it("schedules the visit through the actor and reflects it on the request card", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listRequests.mockResolvedValue([
      makeJob({ id: 7n, status: JobStatus.quoted, quote: makeQuote() }),
    ]);

    renderWithProviders(<AdminPage />);

    const input = await screen.findByLabelText(/schedule a visit/i);
    const user = userEvent.setup();
    await user.type(input, "2026-10-01T10:00");
    await user.click(screen.getByRole("button", { name: /^schedule$/i }));

    // The backend emails both the customer and the owner from this call; the
    // frontend observes only the actor invocation and the resulting view.
    await waitFor(() => {
      expect(actor.scheduleAppointment).toHaveBeenCalledTimes(1);
    });
    const [id, scheduledAt] = actor.scheduleAppointment.mock.calls[0];
    expect(id).toBe(7n);
    expect(typeof scheduledAt).toBe("bigint");
  });

  it("shows the scheduled visit on the request card", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listRequests.mockResolvedValue([
      makeJob({
        id: 7n,
        status: JobStatus.scheduled,
        quote: makeQuote(),
        appointment: {
          confirmed: false,
          scheduledAt: 1_700_000_300_000_000_000n,
        },
      }),
    ]);

    renderWithProviders(<AdminPage />);

    const card = await waitFor(() => {
      const node = document.querySelector('[data-ocid="admin.request_card.1"]');
      expect(node).not.toBeNull();
      return node as HTMLElement;
    });
    expect(
      within(card).getByText(/awaiting confirmation/i),
    ).toBeInTheDocument();
  });
});

describe("owner alert email panel survives the phone-field rework", () => {
  it("shows the currently saved owner alert email address", async () => {
    const actor = setActor();
    actor.getOwnerAlertEmail.mockResolvedValue("owner@honeydo.com");

    await renderAdmin(actor);

    const input = await screen.findByLabelText(/owner alert email/i);
    await waitFor(() => {
      expect(input).toHaveValue("owner@honeydo.com");
    });
  });

  it("saves a valid address and shows a confirmation", async () => {
    const actor = setActor();
    actor.getOwnerAlertEmail.mockResolvedValue("old@honeydo.com");
    actor.setOwnerAlertEmail.mockResolvedValue({
      __kind__: "ok",
      ok: "new@honeydo.com",
    });

    await renderAdmin(actor);

    const input = await screen.findByLabelText(/owner alert email/i);
    await waitFor(() => expect(input).toHaveValue("old@honeydo.com"));

    const user = userEvent.setup();
    await user.clear(input);
    await user.type(input, "new@honeydo.com");
    await user.click(screen.getByRole("button", { name: /save alert email/i }));

    await waitFor(() => {
      expect(actor.setOwnerAlertEmail).toHaveBeenCalledWith("new@honeydo.com");
    });
    expect(await screen.findByText(/alert email saved/i)).toBeInTheDocument();
  });

  it("shows an inline error and does not overwrite the saved value for an invalid address", async () => {
    const actor = setActor();
    actor.getOwnerAlertEmail.mockResolvedValue("owner@honeydo.com");

    await renderAdmin(actor);

    const input = await screen.findByLabelText(/owner alert email/i);
    await waitFor(() => expect(input).toHaveValue("owner@honeydo.com"));

    const user = userEvent.setup();
    await user.clear(input);
    await user.type(input, "not-an-email");
    await user.click(screen.getByRole("button", { name: /save alert email/i }));

    expect(await screen.findByText(/valid email address/i)).toBeInTheDocument();
    expect(actor.setOwnerAlertEmail).not.toHaveBeenCalled();
  });
});

describe("owner alert settings stay admin-gated", () => {
  it("does not expose the owner alert email to a non-admin visitor", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(false);
    actor.getOwnerAlertEmail.mockResolvedValue("owner@honeydo.com");

    renderWithProviders(<AdminPage />);

    expect(
      await screen.findByRole("heading", { name: /admin access required/i }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Owner alerts")).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText(/owner alert email/i),
    ).not.toBeInTheDocument();
    expect(actor.getOwnerAlertEmail).not.toHaveBeenCalled();
  });
});

describe("new-request notification failure does not block the request", () => {
  it("returns the reference code even when the owner notification cannot be delivered", async () => {
    // The backend creates the job and returns the reference code even when the
    // owner notification fails; the frontend observes only the resolved code.
    const actor = setActor();
    actor.submitRequest.mockResolvedValue("HD-4F2A9C");
    const user = userEvent.setup();
    renderWithProviders(<RequestPage />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /send my request/i }));

    expect(await screen.findByText("HD-4F2A9C")).toBeInTheDocument();
    expect(
      screen.queryByText(/couldn't send your request/i),
    ).not.toBeInTheDocument();
  });
});
