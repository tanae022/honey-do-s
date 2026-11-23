import { makeJob } from "@/test/fixtures";
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

/**
 * Cover for the accepted owner-alert-email behavior on the admin dashboard.
 *
 * The backend validates and persists the address and sends the test email; the
 * frontend cannot observe delivery, so this file pins the observable contract:
 *
 *  - the panel shows the currently saved owner alert email;
 *  - saving a valid address calls the backend and shows a confirmation;
 *  - an empty or malformed address shows an inline error and never calls the
 *    backend;
 *  - a backend `invalidEmail` rejection is surfaced inline;
 *  - the send-test button reports the backend outcome inline.
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

describe("owner alert email panel", () => {
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

  it("disables saving and does not call the backend for an empty address", async () => {
    const actor = setActor();
    actor.getOwnerAlertEmail.mockResolvedValue("owner@honeydo.com");

    await renderAdmin(actor);

    const input = await screen.findByLabelText(/owner alert email/i);
    await waitFor(() => expect(input).toHaveValue("owner@honeydo.com"));

    const user = userEvent.setup();
    await user.clear(input);

    const saveButton = screen.getByRole("button", {
      name: /save alert email/i,
    });
    await waitFor(() => expect(saveButton).toBeDisabled());
    expect(actor.setOwnerAlertEmail).not.toHaveBeenCalled();
  });

  it("shows an inline error and does not save a malformed address", async () => {
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

  it("surfaces a backend invalidEmail rejection inline", async () => {
    const actor = setActor();
    actor.getOwnerAlertEmail.mockResolvedValue("owner@honeydo.com");
    actor.setOwnerAlertEmail.mockResolvedValue({
      __kind__: "err",
      err: { __kind__: "invalidEmail", invalidEmail: "Enter a valid email" },
    });

    await renderAdmin(actor);

    const input = await screen.findByLabelText(/owner alert email/i);
    await waitFor(() => expect(input).toHaveValue("owner@honeydo.com"));

    const user = userEvent.setup();
    await user.clear(input);
    await user.type(input, "owner@honeydo.com");
    await user.click(screen.getByRole("button", { name: /save alert email/i }));

    expect(await screen.findByText(/enter a valid email/i)).toBeInTheDocument();
    expect(screen.queryByText(/alert email saved/i)).not.toBeInTheDocument();
  });
});

describe("send test alert", () => {
  it("reports a successful test alert inline", async () => {
    const actor = setActor();
    actor.getOwnerAlertEmail.mockResolvedValue("owner@honeydo.com");
    actor.sendTestAlert.mockResolvedValue({
      email: { __kind__: "sent", sent: null },
      sms: { __kind__: "sent", sent: null },
    });

    await renderAdmin(actor);

    const user = userEvent.setup();
    const testButton = await screen.findByRole("button", {
      name: /send test alert/i,
    });
    await waitFor(() => expect(testButton).toBeEnabled());
    await user.click(testButton);

    await waitFor(() => {
      expect(actor.sendTestAlert).toHaveBeenCalledTimes(1);
    });
    expect(
      await screen.findByText(/sent to owner@honeydo.com/i),
    ).toBeInTheDocument();
  });

  it("reports a failed test alert inline", async () => {
    const actor = setActor();
    actor.getOwnerAlertEmail.mockResolvedValue("owner@honeydo.com");
    actor.sendTestAlert.mockResolvedValue({
      email: { __kind__: "failed", failed: "Email service unavailable" },
      sms: { __kind__: "sent", sent: null },
    });

    await renderAdmin(actor);

    const user = userEvent.setup();
    const testButton = await screen.findByRole("button", {
      name: /send test alert/i,
    });
    await waitFor(() => expect(testButton).toBeEnabled());
    await user.click(testButton);

    expect(
      await screen.findByText(/email service unavailable/i),
    ).toBeInTheDocument();
  });
});

describe("new-request emphasis", () => {
  it("emphasizes a requested job and clears the emphasis once opened", async () => {
    const actor = setActor();
    actor.listRequests.mockResolvedValue([
      makeJob({ id: 7n, customerName: "Jamie Rivera" }),
    ]);

    await renderAdmin(actor);

    const banner = await screen.findByText(
      /new request — awaiting your quote/i,
    );
    expect(banner).toBeInTheDocument();

    const card = document.querySelector('[data-ocid="admin.request_card.1"]');
    expect(card).not.toBeNull();

    const user = userEvent.setup();
    await user.click(card as HTMLElement);

    await waitFor(() => {
      expect(
        screen.queryByText(/new request — awaiting your quote/i),
      ).not.toBeInTheDocument();
    });
  });

  it("groups requested jobs under an awaiting-quote section", async () => {
    const actor = setActor();
    actor.listRequests.mockResolvedValue([
      makeJob({ id: 7n, customerName: "Jamie Rivera" }),
    ]);

    await renderAdmin(actor);

    const section = await waitFor(() => {
      const node = document.querySelector(
        '[data-ocid="admin.awaiting_quote_section"]',
      );
      expect(node).not.toBeNull();
      return node as HTMLElement;
    });
    expect(
      within(section).getByRole("heading", { name: /awaiting your quote/i }),
    ).toBeInTheDocument();
    expect(
      document.querySelector('[data-ocid="admin.awaiting_quote_count"]'),
    ).toHaveTextContent(/1 request/i);
  });
});
